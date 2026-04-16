import { useState, useCallback, useRef } from 'react';
import useLatestRef from './hooks/useLatestRef';
import { useAuth } from './hooks/useAuth';
import { useSaveSync } from './hooks/useSaveSync';
import { autoUserName, postSave } from './services/saveApi';
import { computeTreeSkillBonuses } from './services/treeSkillBonuses';
import AuthToolbar from './components/auth/AuthToolbar';
import BananaWorld from './components/BananaWorld';
import ClickRipple from './components/ui/ClickRipple';
import FeverBurst from './components/ui/FeverBurst';
import SpawnFlash from './components/ui/SpawnFlash';
import CoinSpawnFlash from './components/ui/CoinSpawnFlash';
import FloatingScoreText from './components/ui/FloatingScoreText';
import FloatingCoinList from './components/ui/FloatingCoinList';
import ScoreDisplay from './components/ui/ScoreDisplay';
import BananaTree from './components/ui/BananaTree';
import ShopButton from './components/ui/ShopButton';
import ShopModal from './components/ui/ShopModal';
import UnlockedBananaTiers from './components/ui/UnlockedBananaTiers';
import UpgradePanel from './components/ui/UpgradePanel';
import LoadingScreen from './components/ui/LoadingScreen';
import ActiveEffectStatusBars from './components/ui/ActiveEffectStatusBars';

import { TIER_COLORS } from './data/constants/tierColors';
import { BANANA_TIERS } from './data/constants/bananaTiers';
import { UPGRADE_GROUPS } from './data/constants/upgradeGroups';
import { PANEL_HEIGHT } from './data/constants/layout';
import useUpgradeState from './hooks/useUpgradeState';
import useActiveEffects from './hooks/useActiveEffects';
import useDevMode from './hooks/useDevMode';
import useScoreTracking from './hooks/useScoreTracking';
import useVisualEffects from './hooks/useVisualEffects';
import useTreeLevelUpCoins from './hooks/useTreeLevelUpCoins';

// oneバナナ着地時にスポーンする「1種類」を決定する
const pickOneKindSelection = (unlockedTiers) => {
  const tier = unlockedTiers[Math.floor(Math.random() * unlockedTiers.length)];
  return { type: 'tier', tier };
};

function App() {
  const { signOut, user, authEnabled } = useAuth();
  const {
    bananaPerClick,
    autoSpawnRate,
    giantChance,
    unlockedTiers,
    purchased,
    buyUpgrade,
    treeLevel,
    treeChosenStages,
    banaCoins,
    treeGrowth,
    waterCount,
    waterTree,
    addBanaCoin,
    treeChosenSkills,
    treePendingChoice,
    chooseTreeSkill,
    shopPurchases,
    buyShopItem,
    adjustCoins,
    resetUpgrades,
    restoreState,
  } = useUpgradeState();

  const {
    triggerEffect,
    effectiveAutoMultiplier,
    isFever,
    feverEndTime,
    feverDuration,
    isAllGiant,
    allGiantEndTime,
    allGiantDuration,
    isOneKind,
    oneKindEndTime,
    oneKindDuration,
    oneKindSelection,
  } = useActiveEffects();

  const {
    waterBoost: treeWaterBonus,
    waterCostDiscount: treeWaterCostDiscount,
    coinsPerLevelUp,
    mutationRateBonus: treeMutationRateBonus,
    criticalClickChance: treeCriticalClickChance,
  } = computeTreeSkillBonuses(treeChosenSkills);

  const devMode = useDevMode();

  const {
    score,
    setScore,
    scoreBump,
    perSecond,
    floatingTexts,
    handleScore,
    adjustScore: handleAdjustScore,
  } = useScoreTracking();

  const {
    clickEffects,
    feverBursts,
    spawnFlashes,
    coinFlashes,
    floatingCoins,
    triggerClickRipple,
    triggerSpawnFlash,
    triggerFeverBurst,
    spawnCoinFlashes,
    spawnFloatingCoin,
  } = useVisualEffects();

  const bananaWorldRef = useRef(null);

  const { primeTreeLevel } = useTreeLevelUpCoins({
    treeLevel,
    coinsPerLevelUp,
    spawnPhysicsCoin: (x) => bananaWorldRef.current?.spawnCoin(x),
    spawnCoinFlashes,
  });

  // score の最新値を非同期コールバックから参照するための ref
  const scoreRef = useLatestRef(score);

  const getGameState = useCallback(
    () => ({
      score: scoreRef.current,
      purchased: Array.from(purchased),
      bananaPerClick,
      autoSpawnRate,
      giantChance,
      unlockedTierIds: unlockedTiers.map((t) => t.tier),
      treeLevel,
      treeGrowth,
      banaCoins,
      waterCount,
      chosenSkills: treeChosenSkills,
      chosenStages: treeChosenStages,
      shopPurchases,
    }),
    [
      scoreRef,
      purchased,
      bananaPerClick,
      autoSpawnRate,
      giantChance,
      unlockedTiers,
      treeLevel,
      treeGrowth,
      banaCoins,
      waterCount,
      treeChosenSkills,
      treeChosenStages,
      shopPurchases,
    ],
  );

  const restoreGame = useCallback(
    (gs) => {
      // セーブ復元時の treeLevel 変化をレベルアップと誤検知しないよう
      // 復元前に prev を合わせておく
      primeTreeLevel(gs.treeLevel ?? 0);
      restoreState(gs);
      setScore(gs.score ?? 0);
    },
    [restoreState, setScore, primeTreeLevel],
  );

  const [userName, setUserName] = useState(null);

  const { isLoadingSave } = useSaveSync({
    user,
    getGameState,
    restoreGame,
    onSaveLoaded: (data) => {
      if (data.userName) {
        setUserName(data.userName);
      } else if (user?.sub) {
        setUserName(autoUserName(user.sub));
      }
    },
  });

  const handleCoinCollected = useCallback(
    (x) => {
      addBanaCoin();
      spawnFloatingCoin(x);
    },
    [addBanaCoin, spawnFloatingCoin],
  );

  const handleClick = useCallback(
    (e) => {
      triggerClickRipple(e.clientX, e.clientY);
    },
    [triggerClickRipple],
  );

  // 特殊バナナが着地したときの処理
  const handleEffect = useCallback(
    (itemId, pos) => {
      const count = shopPurchases[itemId] ?? 1;
      if (itemId === 'banana_onekind') {
        const selection = pickOneKindSelection(unlockedTiers);
        triggerEffect(itemId, count, { selection });
      } else {
        triggerEffect(itemId, count);
      }
      if (pos) {
        triggerFeverBurst(pos.x, pos.y, itemId);
      }
    },
    [shopPurchases, unlockedTiers, triggerEffect, triggerFeverBurst],
  );

  const handleBuyUpgrade = useCallback(
    (upgrade) => {
      const purchasedSuccess = buyUpgrade(upgrade, score, devMode);
      if (!purchasedSuccess) return;
      if (!devMode) {
        setScore((currentScore) => currentScore - upgrade.cost);
      }
    },
    [buyUpgrade, score, devMode, setScore],
  );

  const handleResetAll = useCallback(async () => {
    resetUpgrades();
    setScore(0);
    const initialState = {
      score: 0,
      purchased: [],
      bananaPerClick: 1,
      autoSpawnRate: 0,
      giantChance: 0,
      unlockedTierIds: [BANANA_TIERS[0].tier],
      treeLevel: 0,
      treeGrowth: 0,
      banaCoins: 0,
      waterCount: 0,
      chosenSkills: [],
      chosenStages: 0,
      shopPurchases: {},
    };
    try {
      await postSave(initialState);
    } catch (err) {
      console.error('Reset save failed:', err);
    }
  }, [resetUpgrades, setScore]);

  const handleWaterTree = useCallback(() => {
    const cost = waterTree(
      score,
      devMode,
      0.2 + treeWaterBonus,
      1 - treeWaterCostDiscount,
    );
    if (cost !== false && !devMode) {
      setScore((currentScore) => currentScore - cost);
    }
  }, [
    waterTree,
    score,
    devMode,
    treeWaterBonus,
    treeWaterCostDiscount,
    setScore,
  ]);

  const scoreColor = (tier) => TIER_COLORS[tier - 1] ?? '#555';

  // エフェクト適用後の値
  const effectiveRate = autoSpawnRate * effectiveAutoMultiplier;
  const effectiveGiantChance = isAllGiant ? 1 : giantChance;

  const [isShopOpen, setIsShopOpen] = useState(false);

  if (isLoadingSave) {
    return <LoadingScreen />;
  }

  return (
    <main
      aria-label="バナナドロップ ゲーム"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
      onClick={handleClick}
    >
      <AuthToolbar
        authEnabled={authEnabled}
        user={user}
        userName={userName}
        onUserNameChange={setUserName}
        signOut={signOut}
      />
      <ScoreDisplay
        score={score}
        perSecond={perSecond}
        scoreBump={scoreBump}
        devMode={devMode}
      />
      <UnlockedBananaTiers
        unlockedTiers={unlockedTiers}
        tierColors={TIER_COLORS}
        nuiBananaCount={shopPurchases['banana_nui'] ?? 0}
        isFever={isFever}
        magicBananaCount={shopPurchases['banana_magic'] ?? 0}
        isAllGiant={isAllGiant}
        blackholeBananaCount={shopPurchases['banana_blackhole'] ?? 0}
        onekindBananaCount={shopPurchases['banana_onekind'] ?? 0}
        isOneKind={isOneKind}
      />
      <ShopButton banaCoins={banaCoins} onOpen={() => setIsShopOpen(true)} />
      {isShopOpen && (
        <ShopModal
          banaCoins={banaCoins}
          shopPurchases={shopPurchases}
          onBuy={buyShopItem}
          onClose={() => setIsShopOpen(false)}
          treeLevel={treeLevel}
          treeGrowth={treeGrowth}
        />
      )}

      <ActiveEffectStatusBars
        isFever={isFever}
        feverEndTime={feverEndTime}
        feverDuration={feverDuration}
        isAllGiant={isAllGiant}
        allGiantEndTime={allGiantEndTime}
        allGiantDuration={allGiantDuration}
        isOneKind={isOneKind}
        oneKindEndTime={oneKindEndTime}
        oneKindDuration={oneKindDuration}
      />

      <BananaTree
        score={score}
        treeLevel={treeLevel}
        treeGrowth={treeGrowth}
        waterCount={waterCount}
        onWater={handleWaterTree}
        devMode={devMode}
        chosenSkills={treeChosenSkills}
        pendingChoice={treePendingChoice}
        onChooseSkill={chooseTreeSkill}
        waterBoostPercent={Math.round((0.2 + treeWaterBonus) * 100)}
        waterCostDiscount={treeWaterCostDiscount}
      />

      <FloatingCoinList coins={floatingCoins} />
      {floatingTexts.map((text) => (
        <FloatingScoreText
          key={text.id}
          text={text}
          color={scoreColor(text.tier)}
        />
      ))}
      {clickEffects.map((effect) => (
        <ClickRipple key={effect.id} effect={effect} />
      ))}
      {feverBursts.map((burst) => (
        <FeverBurst key={burst.id} burst={burst} />
      ))}
      {spawnFlashes.map((flash) => (
        <SpawnFlash key={flash.id} flash={flash} />
      ))}
      {coinFlashes.map((flash) => (
        <CoinSpawnFlash key={flash.id} flash={flash} />
      ))}

      <UpgradePanel
        groups={UPGRADE_GROUPS}
        purchased={purchased}
        score={score}
        onBuy={handleBuyUpgrade}
        devMode={devMode}
      />

      <BananaWorld
        ref={bananaWorldRef}
        bananaPerClick={bananaPerClick}
        autoSpawnRate={effectiveRate}
        panelHeight={PANEL_HEIGHT}
        unlockedTiers={unlockedTiers}
        giantChance={effectiveGiantChance}
        onScore={handleScore}
        onEffect={handleEffect}
        onCoinCollected={handleCoinCollected}
        shopPurchases={shopPurchases}
        devMode={devMode}
        onResetUpgrades={handleResetAll}
        onAdjustScore={handleAdjustScore}
        onAdjustCoins={adjustCoins}
        isOneKind={isOneKind}
        oneKindSelection={oneKindSelection}
        onSpecialSpawn={triggerSpawnFlash}
        treeMutationRateBonus={treeMutationRateBonus}
        treeCriticalClickChance={treeCriticalClickChance}
      />
    </main>
  );
}

export default App;
