import { useState, useCallback } from 'react';
import { BANANA_TIERS } from '../data/constants/bananaTiers';
import {
  canPurchaseUpgrade,
  applyUpgradeEffects,
} from '../services/upgradeRules';

export default function useUpgradeState() {
  const [bananaPerClick, setBananaPerClick] = useState(1);
  const [autoSpawnRate, setAutoSpawnRate] = useState(0);
  const [giantChance, setGiantChance] = useState(0);
  const [unlockedTiers, setUnlockedTiers] = useState([BANANA_TIERS[0]]);
  const [purchased, setPurchased] = useState(new Set());

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

  return {
    bananaPerClick,
    autoSpawnRate,
    giantChance,
    unlockedTiers,
    purchased,
    buyUpgrade,
  };
}
