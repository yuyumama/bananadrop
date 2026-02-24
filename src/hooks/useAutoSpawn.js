import { useEffect } from 'react';
import { SHOP_ITEMS } from '../data/shopItems';

export default function useAutoSpawn({
  autoSpawnRate,
  spawnBanana,
  spawnSpecialBanana,
  shopPurchasesRef,
}) {
  useEffect(() => {
    if (autoSpawnRate <= 0) return;

    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      spawnBanana(x);

      // 特殊バナナ: 1秒あたりの確率をティック間隔に換算して同タイミングで判定
      if (!spawnSpecialBanana || !shopPurchasesRef) return;
      SHOP_ITEMS.forEach((item) => {
        const count = shopPurchasesRef.current?.[item.id] ?? 0;
        if (count === 0) return;
        const chancePerTick = item.spawnChancePerSecond / autoSpawnRate;
        if (Math.random() < chancePerTick) {
          spawnSpecialBanana(x, item);
        }
      });
    }, 1000 / autoSpawnRate);

    return () => clearInterval(interval);
  }, [autoSpawnRate, spawnBanana, spawnSpecialBanana, shopPurchasesRef]);
}
