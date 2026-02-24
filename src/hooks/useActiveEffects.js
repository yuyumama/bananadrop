import { useState, useCallback, useEffect } from 'react';
import { SHOP_ITEMS } from '../data/shopItems';

export default function useActiveEffects() {
  const [effects, setEffects] = useState([]);

  // アクティブなエフェクトがある間だけ 500ms ごとに期限切れを除去
  useEffect(() => {
    if (effects.length === 0) return;
    const id = setInterval(() => {
      const now = Date.now();
      setEffects((prev) => prev.filter((e) => e.endTime > now));
    }, 500);
    return () => clearInterval(id);
  }, [effects.length]);

  // アイテム ID と所持数を受け取って対応するエフェクトを発動
  // count を掛けた分だけ効果時間を延長する
  const triggerEffect = useCallback((itemId, count = 1) => {
    const item = SHOP_ITEMS.find((s) => s.id === itemId);
    if (!item?.effect) return;

    const { type, duration, maxDuration, autoMultiplier } = item.effect;
    const totalDuration = Math.min(
      maxDuration ?? Infinity,
      duration * Math.max(1, count),
    );
    setEffects((prev) => [
      // 同じ type は上書き（重複を避ける）
      ...prev.filter((e) => e.type !== type),
      {
        type,
        endTime: Date.now() + totalDuration * 1000,
        duration: totalDuration,
        autoMultiplier: autoMultiplier ?? 1,
      },
    ]);
  }, []);

  // 現在の最大オート倍率
  const effectiveAutoMultiplier = effects.reduce(
    (max, e) => Math.max(max, e.autoMultiplier ?? 1),
    1,
  );

  const feverEffect = effects.find((e) => e.type === 'feverTime');

  return {
    effects,
    triggerEffect,
    effectiveAutoMultiplier,
    isFever: Boolean(feverEffect),
    feverEndTime: feverEffect?.endTime ?? 0,
    feverDuration: feverEffect?.duration ?? 0,
  };
}
