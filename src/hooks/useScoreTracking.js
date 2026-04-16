import { useState, useCallback, useEffect, useRef } from 'react';

const MAX_FLOATING_TEXTS = 15;
const MERGE_DISTANCE_PX = 60;
const MAX_MERGED_TEXTS_PER_FRAME = 8;
const SCORE_HISTORY_WINDOW_MS = 5000;
const PER_SECOND_INTERVAL_MS = 500;
const SCORE_BUMP_DURATION_MS = 300;
const FLOATING_TEXT_DURATION_MS = 1200;

let _textId = 0;

export default function useScoreTracking() {
  const [score, setScore] = useState(0);
  const [scoreBump, setScoreBump] = useState(false);
  const [perSecond, setPerSecond] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState([]);

  // 実測ローリング平均（直近 5 秒の実スコア履歴から算出）
  const scoreHistoryRef = useRef([]);
  useEffect(() => {
    const id = setInterval(() => {
      const cutoff = Date.now() - SCORE_HISTORY_WINDOW_MS;
      scoreHistoryRef.current = scoreHistoryRef.current.filter(
        (e) => e.time > cutoff,
      );
      const total = scoreHistoryRef.current.reduce((s, e) => s + e.score, 0);
      setPerSecond(Math.round(total / (SCORE_HISTORY_WINDOW_MS / 1000)));
    }, PER_SECOND_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // スコアテキストをフレーム単位でバッチ集約し、DOM 要素数を削減
  const scoreBatchRef = useRef([]);
  const scoreRafRef = useRef(0);

  const handleScore = useCallback((scoreItems) => {
    const total = scoreItems.reduce((sum, item) => sum + item.score, 0);
    setScore((s) => s + total);
    scoreHistoryRef.current.push({ time: Date.now(), score: total });
    setScoreBump(true);
    setTimeout(() => setScoreBump(false), SCORE_BUMP_DURATION_MS);

    scoreBatchRef.current.push(...scoreItems);
    if (scoreRafRef.current) return;

    scoreRafRef.current = requestAnimationFrame(() => {
      scoreRafRef.current = 0;
      const batch = scoreBatchRef.current;
      scoreBatchRef.current = [];
      if (batch.length === 0) return;

      // 同フレーム内のスコアを X 位置で近いもの同士にまとめる
      const merged = [];
      const sorted = batch.sort((a, b) => a.x - b.x);
      let current = { ...sorted[0] };
      for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i];
        if (
          Math.abs(item.x - current.x) < MERGE_DISTANCE_PX &&
          item.tier === current.tier
        ) {
          current.score += item.score;
        } else {
          merged.push(current);
          current = { ...item };
        }
      }
      merged.push(current);
      const limited =
        merged.length > MAX_MERGED_TEXTS_PER_FRAME
          ? merged.slice(0, MAX_MERGED_TEXTS_PER_FRAME)
          : merged;

      const newTexts = limited.map((item) => ({
        id: ++_textId,
        value: item.score,
        tier: item.tier,
        x: Math.max(40, Math.min(window.innerWidth - 40, item.x)),
      }));

      setFloatingTexts((prev) => {
        const combined = [...prev, ...newTexts];
        return combined.length > MAX_FLOATING_TEXTS
          ? combined.slice(combined.length - MAX_FLOATING_TEXTS)
          : combined;
      });
      setTimeout(() => {
        const ids = new Set(newTexts.map((t) => t.id));
        setFloatingTexts((prev) => prev.filter((t) => !ids.has(t.id)));
      }, FLOATING_TEXT_DURATION_MS);
    });
  }, []);

  const adjustScore = useCallback((delta) => {
    setScore((s) => Math.max(0, s + delta));
  }, []);

  return {
    score,
    setScore,
    scoreBump,
    perSecond,
    floatingTexts,
    handleScore,
    adjustScore,
  };
}
