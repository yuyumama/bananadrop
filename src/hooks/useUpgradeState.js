import { useState, useCallback, useEffect } from 'react';
import { BANANA_TIERS } from '../data/constants/bananaTiers';
import {
  canPurchaseUpgrade,
  applyUpgradeEffects,
} from '../services/upgradeRules';
import { getShopItemCost } from '../data/shopItems';
import { TREE_SKILL_STAGES } from '../data/constants/treeSkills';

/** レベルアップに必要な成長値（指数スケーリング） */
export const getMaxGrowth = (level) => Math.round(100 * Math.pow(1.15, level));

/** 水やり回数に応じたコスト（~4回ごとに2倍） */
export const getWaterCost = (waterCount) =>
  Math.round(100 * Math.pow(1.4, waterCount));

/**
 * そのステージのプール（3択）からランダムで2つ選んで返す。
 * stageIndex は 0 始まり（LV.5 = 0, LV.10 = 1, ...）
 */
const pickTwoFromStage = (stageIndex) => {
  const pool = TREE_SKILL_STAGES[stageIndex];
  if (!pool || pool.length === 0) return null;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.length === 1 ? [shuffled[0]] : [shuffled[0], shuffled[1]];
};

/**
 * 新レベル到達時にスキル解放が必要か調べ、必要なら pendingChoice を返す。
 * 5レベルごと（=画像変化タイミング）にスキルを提示する。
 */
const computeSkillUpdate = (prev, newLevel) => {
  if (prev.pendingChoice) return {};
  const stagesDue = Math.floor(newLevel / 5);
  const stagesProcessed = prev.chosenSkills.length;
  if (stagesDue <= stagesProcessed) return {};
  return { pendingChoice: pickTwoFromStage(stagesProcessed) };
};

export default function useUpgradeState() {
  const [bananaPerClick, setBananaPerClick] = useState(1);
  const [autoSpawnRate, setAutoSpawnRate] = useState(0);
  const [giantChance, setGiantChance] = useState(0);
  const [unlockedTiers, setUnlockedTiers] = useState([BANANA_TIERS[0]]);
  const [purchased, setPurchased] = useState(new Set());
  const [shopPurchases, setShopPurchases] = useState({});

  // バナナツリー用ステート
  const [treeData, setTreeData] = useState({
    level: 0,
    growth: 0,
    banaCoins: 0,
    waterCount: 0,
    chosenSkills: [], // 選択済みスキルの配列
    pendingChoice: null, // null | skill[] 選択待ちの候補（4択）
  });

  // 時間経過でツリーが成長 (1秒に +1 + growthBonus)
  useEffect(() => {
    const interval = setInterval(() => {
      setTreeData((prev) => {
        const totalGrowthBonus = prev.chosenSkills.reduce(
          (sum, s) => sum + (s.growthBonus ?? 0),
          0,
        );
        const maxGrowth = getMaxGrowth(prev.level);
        let newGrowth = prev.growth + 1 + totalGrowthBonus;
        let newLevel = prev.level;
        let newWaterCount = prev.waterCount;

        if (newGrowth >= maxGrowth) {
          newLevel += 1;
          newGrowth -= maxGrowth;
        }

        return {
          ...prev,
          growth: newGrowth,
          level: newLevel,
          waterCount: newWaterCount,
          ...computeSkillUpdate(prev, newLevel),
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

  /**
   * @param waterBoostRatio    水やりの効果倍率（ベース 0.2）
   * @param waterCostMultiplier 水やりコストの倍率（1.0 = 割引なし）
   */
  const waterTree = useCallback(
    (
      currentScore,
      devMode = false,
      waterBoostRatio = 0.2,
      waterCostMultiplier = 1.0,
    ) => {
      const cost = Math.round(
        getWaterCost(treeData.waterCount) * waterCostMultiplier,
      );

      if (!devMode && currentScore < cost) return false;

      setTreeData((prev) => {
        const maxGrowth = getMaxGrowth(prev.level);
        let newGrowth = prev.growth + Math.round(maxGrowth * waterBoostRatio);
        let newLevel = prev.level;
        let newWaterCount = prev.waterCount + 1;

        if (newGrowth >= maxGrowth) {
          newLevel += 1;
          newGrowth -= maxGrowth;
        }

        return {
          ...prev,
          growth: newGrowth,
          level: newLevel,
          waterCount: newWaterCount,
          ...computeSkillUpdate(prev, newLevel),
        };
      });

      return cost;
    },
    [treeData.waterCount],
  );

  const addBanaCoin = useCallback(() => {
    setTreeData((prev) => ({ ...prev, banaCoins: prev.banaCoins + 1 }));
  }, []);

  /** スキル選択肢から1つを選ぶ */
  const chooseTreeSkill = useCallback((skill) => {
    setTreeData((prev) => {
      const newChosen = [...prev.chosenSkills, skill];
      const stagesDue = Math.floor(prev.level / 5);
      const newPending =
        stagesDue > newChosen.length
          ? pickTwoFromStage(newChosen.length)
          : null;
      return { ...prev, chosenSkills: newChosen, pendingChoice: newPending };
    });
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
    treeChosenSkills: treeData.chosenSkills,
    treePendingChoice: treeData.pendingChoice,
    chooseTreeSkill,
    // Shop
    shopPurchases,
    buyShopItem,
    cheatBanaCoins,
    adjustCoins,
    resetUpgrades,
  };
}
