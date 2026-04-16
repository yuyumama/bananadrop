import { useEffect, useRef, useCallback } from 'react';
import useLatestRef from './useLatestRef';

// ツリーレベルアップ検知で物理コインスポーン + フラッシュエフェクトを発火する
export default function useTreeLevelUpCoins({
  treeLevel,
  coinsPerLevelUp,
  spawnPhysicsCoin,
  spawnCoinFlashes,
}) {
  const prevTreeLevelRef = useRef(null);
  const coinsPerLevelUpRef = useLatestRef(coinsPerLevelUp);
  const spawnPhysicsCoinRef = useLatestRef(spawnPhysicsCoin);
  const spawnCoinFlashesRef = useLatestRef(spawnCoinFlashes);

  useEffect(() => {
    if (prevTreeLevelRef.current === null) {
      prevTreeLevelRef.current = treeLevel;
      return;
    }
    if (treeLevel > prevTreeLevelRef.current) {
      const count = coinsPerLevelUpRef.current;
      const xs = [];
      for (let i = 0; i < count; i++) {
        const x = 80 + Math.random() * (window.innerWidth - 160);
        spawnPhysicsCoinRef.current?.(x);
        xs.push(x);
      }
      spawnCoinFlashesRef.current?.(xs);
    }
    prevTreeLevelRef.current = treeLevel;
    // ref 経由で最新値を参照するため deps には含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeLevel]);

  // セーブ復元時にレベルアップ誤検知を防ぐため、事前に prev を合わせる
  const primeTreeLevel = useCallback((level) => {
    prevTreeLevelRef.current = level;
  }, []);

  return { primeTreeLevel };
}
