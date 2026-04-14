import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { loadSave, postSave } from '../services/saveApi';
import { isCognitoConfigured, getAccessToken } from '../services/cognitoAuth';

const AUTO_SAVE_INTERVAL_MS = 60_000;

/**
 * ログイン時に自動ロード、定期的・ページ離脱時に自動セーブする。
 * ユーザーはセーブ操作を一切意識しない。
 *
 * @param {object} options
 * @param {object|null} options.user - AuthContext の user（未ログイン時は null）
 * @param {() => object} options.getGameState - 現在のゲーム状態を返すコールバック
 * @param {(gameState: object) => void} options.restoreGame - 保存済み状態を復元するコールバック
 * @param {(data: object) => void} [options.onSaveLoaded] - セーブデータ取得後に呼ばれるコールバック
 */
export function useSaveSync({ user, getGameState, restoreGame, onSaveLoaded }) {
  const hasLoadedRef = useRef(false);
  // コールバック類は毎レンダーで再生成される可能性があるので ref 経由で最新を保持
  const getGameStateRef = useRef(getGameState);
  const onSaveLoadedRef = useRef(onSaveLoaded);
  // beforeunload 時に同期的に使えるよう最新トークンをキャッシュする
  const tokenRef = useRef(null);

  // レンダー後に ref を同期（レンダー中の直接代入を避ける）
  useLayoutEffect(() => {
    getGameStateRef.current = getGameState;
    onSaveLoadedRef.current = onSaveLoaded;
  });

  // ログイン時に自動ロード（1セッションに1回のみ）
  useEffect(() => {
    if (!isCognitoConfigured || !user || hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    loadSave()
      .then((data) => {
        if (data.exists && data.gameState) {
          restoreGame(data.gameState);
        }
        onSaveLoadedRef.current?.(data);
      })
      .catch((err) => console.error('Save load failed:', err));
  }, [user, restoreGame]);

  // ログアウト時にロード済みフラグをリセット
  useEffect(() => {
    if (!user) hasLoadedRef.current = false;
  }, [user]);

  const doSave = useCallback(async () => {
    if (!isCognitoConfigured || !user) return;
    try {
      const token = await getAccessToken();
      tokenRef.current = token;
      await postSave(getGameStateRef.current());
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [user]);

  // 定期オートセーブ
  useEffect(() => {
    if (!isCognitoConfigured || !user) return;
    const id = setInterval(doSave, AUTO_SAVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user, doSave]);

  // ページ離脱時に保存
  // fetch keepalive を使うことでブラウザがページを閉じた後もリクエストを完遂する。
  // getAccessToken() は非同期のため呼び出せないので、直前の定期セーブで更新した
  // キャッシュトークンを使用する。
  useEffect(() => {
    if (!isCognitoConfigured || !user) return;
    const handleBeforeUnload = () => {
      const token = tokenRef.current;
      if (!token) return;
      const body = JSON.stringify({ gameState: getGameStateRef.current() });
      navigator.sendBeacon
        ? navigator.sendBeacon(
            '/api/save',
            new Blob([body], { type: 'application/json' }),
          )
        : fetch('/api/save', {
            method: 'POST',
            keepalive: true,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body,
          });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);
}
