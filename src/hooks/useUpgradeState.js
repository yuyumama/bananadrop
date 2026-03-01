import { useState, useCallback, useEffect } from 'react';
import { BANANA_TIERS } from '../data/constants/bananaTiers';
import {
  canPurchaseUpgrade,
  applyUpgradeEffects,
} from '../services/upgradeRules';
import { getShopItemCost } from '../data/shopItems';

/** レベルアップに必要な成長値（指数スケーリング） */
export const getMaxGrowth = (level) => Math.round(100 * Math.pow(1.15, level));

/** 水やり回数に応じたコスト（~4回ごとに2倍） */
export const getWaterCost = (waterCount) =>
  Math.round(100 * Math.pow(1.4, waterCount));

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
    banaCoins: 0,
    waterCount: 0,
  });

  // 時間経過でツリーが成長 (1秒に+1)
  useEffect(() => {
    const interval = setInterval(() => {
      setTreeData((prev) => {
        const maxGrowth = getMaxGrowth(prev.level);
        let newGrowth = prev.growth + 1;
        let newLevel = prev.level;

        if (newGrowth >= maxGrowth) {
          newLevel += 1;
          newGrowth -= maxGrowth;
        }

        return {
          ...prev,
          growth: newGrowth,
          level: newLevel,
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const buyUpgrade = useCallback(
    (upgrade, score, devMode) => {
      if (!canPurchaseUpgrade({ upgrade, score, purchased, devMode }))
        return false;

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
    (currentScore, devMode = false) => {
      const cost = getWaterCost(treeData.waterCount);

      if (!devMode && currentScore < cost) return false;

      setTreeData((prev) => {
        const maxGrowth = getMaxGrowth(prev.level);
        let newGrowth = prev.growth + Math.round(maxGrowth * 0.2);
        let newLevel = prev.level;

        if (newGrowth >= maxGrowth) {
          newLevel += 1;
          newGrowth -= maxGrowth;
        }

        return {
          ...prev,
          growth: newGrowth,
          level: newLevel,
          waterCount: prev.waterCount + 1,
        };
      });

      return cost; // 消費したスコアを返す
    },
    [treeData.waterCount],
  );

  const addBanaCoin = useCallback(() => {
    setTreeData((prev) => ({ ...prev, banaCoins: prev.banaCoins + 1 }));
  }, []);

  const buyShopItem = useCallback(
    (item) => {
      const count = shopPurchases[item.id] ?? 0;
      if (count >= item.maxCount) return false;
      const cost = getShopItemCost(item, count);
      if (treeData.banaCoins < cost) return false;

      setTreeData((prev) => ({ ...prev, banaCoins: prev.banaCoins - cost }));
      setShopPurchases((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] ?? 0) + 1,
      }));
      return true;
    },
    [shopPurchases, treeData.banaCoins],
  );

  const cheatBanaCoins = useCallback(() => {
    setTreeData((prev) => ({ ...prev, banaCoins: prev.banaCoins + 999 }));
  }, []);

  const adjustCoins = useCallback((delta) => {
    setTreeData((prev) => ({
      ...prev,
      banaCoins: Math.max(0, prev.banaCoins + delta),
    }));
  }, []);

  const resetUpgrades = useCallback(() => {
    setPurchased(new Set());
    setBananaPerClick(1);
    setAutoSpawnRate(0);
    setGiantChance(0);
    setUnlockedTiers([BANANA_TIERS[0]]);
  }, []);

  return {
    bananaPerClick,
    autoSpawnRate,
    giantChance,
    unlockedTiers,
    purchased,
    buyUpgrade,
    // Tree states & functions
    treeLevel: treeData.level,
    banaCoins: treeData.banaCoins,
    treeGrowth: treeData.growth,
    waterCount: treeData.waterCount,
    waterTree,
    addBanaCoin,
    // Shop
    shopPurchases,
    buyShopItem,
    cheatBanaCoins,
    adjustCoins,
    resetUpgrades,
  };
}
