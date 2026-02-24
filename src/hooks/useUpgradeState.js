import { useState, useCallback, useEffect } from 'react';
import { BANANA_TIERS } from '../data/constants/bananaTiers';
import {
  canPurchaseUpgrade,
  applyUpgradeEffects,
} from '../services/upgradeRules';
import { getShopItemCost } from '../data/shopItems';

export default function useUpgradeState() {
  const [bananaPerClick, setBananaPerClick] = useState(1);
  const [autoSpawnRate, setAutoSpawnRate] = useState(0);
  const [giantChance, setGiantChance] = useState(0);
  const [unlockedTiers, setUnlockedTiers] = useState([BANANA_TIERS[0]]);
  const [purchased, setPurchased] = useState(new Set());
  const [shopPurchases, setShopPurchases] = useState({});

  // バナナツリー用ステート (アトミックな更新のためにオブジェクトに統合)
  const [treeData, setTreeData] = useState({
    level: 0,
    growth: 0,
    seeds: 0,
  });

  // 時間経過でツリーが成長 (1秒に1%)
  useEffect(() => {
    const interval = setInterval(() => {
      setTreeData((prev) => {
        let newGrowth = prev.growth + 1;
        let newLevel = prev.level;
        let newSeeds = prev.seeds;

        if (newGrowth >= 100) {
          newLevel += 1;
          newSeeds += 1;
          newGrowth -= 100;
        }

        return {
          ...prev,
          growth: newGrowth,
          level: newLevel,
          seeds: newSeeds,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const buyUpgrade = useCallback(
    (upgrade, score) => {
      if (!canPurchaseUpgrade({ upgrade, score, purchased })) return false;

      const nextState = applyUpgradeEffects({
        upgrade,
        bananaTiers: BANANA_TIERS,
        state: {
          purchased,
          bananaPerClick,
          autoSpawnRate,
          giantChance,
          unlockedTiers,
        },
      });

      setPurchased(nextState.purchased);
      setBananaPerClick(nextState.bananaPerClick);
      setAutoSpawnRate(nextState.autoSpawnRate);
      setGiantChance(nextState.giantChance);
      setUnlockedTiers(nextState.unlockedTiers);
      return true;
    },
    [purchased, bananaPerClick, autoSpawnRate, giantChance, unlockedTiers],
  );

  const waterTree = useCallback(
    (currentScore) => {
      // ツリーのレベルに応じた水やりコスト
      const cost = 100 + treeData.level * 50;

      if (currentScore < cost) return false;

      setTreeData((prev) => {
        let newGrowth = prev.growth + 20;
        let newLevel = prev.level;
        let newSeeds = prev.seeds;

        if (newGrowth >= 100) {
          newLevel += 1;
          newSeeds += 1;
          newGrowth -= 100;
        }

        return {
          ...prev,
          growth: newGrowth,
          level: newLevel,
          seeds: newSeeds,
        };
      });

      return cost; // 消費したスコアを返す
    },
    [treeData.level],
  );

  const buyShopItem = useCallback(
    (item) => {
      const count = shopPurchases[item.id] ?? 0;
      if (count >= item.maxCount) return false;
      const cost = getShopItemCost(item, count);
      if (treeData.seeds < cost) return false;

      setTreeData((prev) => ({ ...prev, seeds: prev.seeds - cost }));
      setShopPurchases((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] ?? 0) + 1,
      }));
      return true;
    },
    [shopPurchases, treeData.seeds],
  );

  const cheatSeeds = useCallback(() => {
    setTreeData((prev) => ({ ...prev, seeds: prev.seeds + 999 }));
  }, []);

  return {
    bananaPerClick,
    autoSpawnRate,
    giantChance,
    unlockedTiers,
    purchased,
    buyUpgrade,
    // Tree states & functions (エイリアスを貼って後方互換性を維持)
    treeLevel: treeData.level,
    seeds: treeData.seeds,
    treeGrowth: treeData.growth,
    waterTree,
    // Shop
    shopPurchases,
    buyShopItem,
    cheatSeeds,
  };
}
