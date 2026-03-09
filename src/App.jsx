import { useState, useCallback, useRef, useEffect } from 'react';
import BananaWorld from './components/BananaWorld';
import ClickRipple from './components/ui/ClickRipple';
import FeverBurst from './components/ui/FeverBurst';
import SpawnFlash from './components/ui/SpawnFlash';
import CoinSpawnFlash from './components/ui/CoinSpawnFlash';
import FloatingScoreText from './components/ui/FloatingScoreText';
import ScoreDisplay from './components/ui/ScoreDisplay';
import BananaTree from './components/ui/BananaTree';
import ShopButton from './components/ui/ShopButton';
import ShopModal from './components/ui/ShopModal';
import UnlockedBananaTiers from './components/ui/UnlockedBananaTiers';
import UpgradePanel from './components/ui/UpgradePanel';

import { TIER_COLORS } from './data/constants/tierColors';
import { UPGRADE_GROUPS } from './data/constants/upgradeGroups';
import { PANEL_HEIGHT } from './data/constants/layout';
import useUpgradeState from './hooks/useUpgradeState';
import useActiveEffects from './hooks/useActiveEffects';

// oneバナナ着地時にスポーンする「1種類」を決定する
const pickOneKindSelection = (unlockedTiers) => {
  const tier = unlockedTiers[Math.floor(Math.random() * unlockedTiers.length)];
  return { type: 'tier', tier };
};

let _textId = 0;

const MAX_FLOATING_TEXTS = 15;
const MAX_CLICK_EFFECTS = 5;
const MAX_SPAWN_FLASHES = 3;
const MAX_FEVER_BURSTS = 3;

function App() {
  const [score, setScore] = useState(0);
  const {
    bananaPerClick,
    autoSpawnRate,
    giantChance,
    unlockedTiers,
    purchased,
    buyUpgrade,
    treeLevel,
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

  // 選択済みスキルのボーナスを集計
  const treeWaterBonus = treeChosenSkills.reduce(
    (sum, s) => sum + (s.waterBoost ?? 0),
    0,
  );
  const treeWaterCostDiscount = Math.min(
    treeChosenSkills.reduce((sum, s) => sum + (s.waterCostDiscount ?? 0), 0),
    0.9, // 最大90%割引
  );
  // レベルアップ時コイン数（ref 経由で stale closure を回避）
  const coinsPerLevelUpRef = useRef(1);
  coinsPerLevelUpRef.current =
    1 + treeChosenSkills.reduce((sum, s) => sum + (s.coinsPerLevelUp ?? 0), 0);
  // 特殊バナナ出現率アップボーナス
  const treeMutationRateBonus = treeChosenSkills.reduce(
    (sum, s) => sum + (s.mutationRateBonus ?? 0),
    0,
  );
  // タップ時大量生成ボーナス確率
  const treeCriticalClickChance = treeChosenSkills.reduce(
    (sum, s) => sum + (s.criticalClickChance ?? 0),
    0,
  );

  const bananaWorldRef = useRef(null);

  const [floatingTexts, setFloatingTexts] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [feverBursts, setFeverBursts] = useState([]);
  const [spawnFlashes, setSpawnFlashes] = useState([]);
  const [coinFlashes, setCoinFlashes] = useState([]);
  const [scoreBump, setScoreBump] = useState(false);
  const [perSecond, setPerSecond] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  // 開発者モード: Ctrl+Shift+D で切り替え
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDevMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ツリーレベルアップ時にバナコインをスポーン（coinsPerLevelUp 個）
  const prevTreeLevelRef = useRef(null);
  useEffect(() => {
    if (prevTreeLevelRef.current === null) {
      prevTreeLevelRef.current = treeLevel;
      return;
    }
    if (treeLevel > prevTreeLevelRef.current) {
      const count = coinsPerLevelUpRef.current;
      const newFlashes = [];
      for (let i = 0; i < count; i++) {
        const x = 80 + Math.random() * (window.innerWidth - 160);
        bananaWorldRef.current?.spawnCoin(x);
        newFlashes.push({ id: ++_textId, x });
      }
      setCoinFlashes((prev) => [...prev, ...newFlashes]);
      const flashIds = new Set(newFlashes.map((f) => f.id));
      setTimeout(
        () => setCoinFlashes((prev) => prev.filter((f) => !flashIds.has(f.id))),
        1800,
      );
    }
    prevTreeLevelRef.current = treeLevel;
  }, [treeLevel]);

  const [floatingCoins, setFloatingCoins] = useState([]);

  const handleCoinCollected = useCallback(
    (x) => {
      addBanaCoin();
      const id = ++_textId;
      const clampedX = Math.max(
        60,
        Math.min(window.innerWidth - 60, x ?? window.innerWidth / 2),
      );
      setFloatingCoins((prev) => [...prev, { id, x: clampedX }]);
      setTimeout(
        () => setFloatingCoins((prev) => prev.filter((c) => c.id !== id)),
        1200,
      );
    },
    [addBanaCoin],
  );

  // 実測ローリング平均（5秒間の実スコア履歴から計算）
  const scoreHistoryRef = useRef([]);
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const cutoff = now - 5000;
      scoreHistoryRef.current = scoreHistoryRef.current.filter(
        (e) => e.time > cutoff,
      );
      const total = scoreHistoryRef.current.reduce((s, e) => s + e.score, 0);
      setPerSecond(Math.round(total / 5));
    }, 500);
    return () => clearInterval(id);
  }, []);

  // スコアテキストをフレーム単位でバッチ集約し、DOM要素数を削減
  const scoreBatchRef = useRef([]);
  const scoreRafRef = useRef(0);

  const handleScore = useCallback((scoreItems) => {
    const total = scoreItems.reduce((sum, item) => sum + item.score, 0);
    setScore((s) => s + total);
    scoreHistoryRef.current.push({ time: Date.now(), score: total });
    setScoreBump(true);
    setTimeout(() => setScoreBump(false), 300);

    // バッチに追加し、次フレームでまとめてDOM生成
    scoreBatchRef.current.push(...scoreItems);
    if (!scoreRafRef.current) {
      scoreRafRef.current = requestAnimationFrame(() => {
        scoreRafRef.current = 0;
        const batch = scoreBatchRef.current;
        scoreBatchRef.current = [];
        if (batch.length === 0) return;

        // 同フレーム内のスコアをX位置で近いもの同士にまとめる（最大8個）
        const merged = [];
        const sorted = batch.sort((a, b) => a.x - b.x);
        let current = { ...sorted[0] };
        for (let i = 1; i < sorted.length; i++) {
          const item = sorted[i];
          if (Math.abs(item.x - current.x) < 60 && merged.length < 7) {
            current.score += item.score;
          } else {
            merged.push(current);
            current = { ...item };
          }
        }
        merged.push(current);
        // 最大8個に制限
        const limited = merged.length > 8 ? merged.slice(0, 8) : merged;

        const newTexts = limited.map((item) => ({
          id: ++_textId,
          value: item.score,
          tier: item.tier,
          x: Math.max(40, Math.min(window.innerWidth - 40, item.x)),
        }));

        setFloatingTexts((prev) => {
          const combined = [...prev, ...newTexts];
          // 同時表示上限を超えた分は古いものから削除
          return combined.length > MAX_FLOATING_TEXTS
            ? combined.slice(combined.length - MAX_FLOATING_TEXTS)
            : combined;
        });
        setTimeout(() => {
          const ids = new Set(newTexts.map((t) => t.id));
          setFloatingTexts((prev) => prev.filter((t) => !ids.has(t.id)));
        }, 1200);
      });
    }
  }, []);

  const handleClick = useCallback((e) => {
    const id = ++_textId;
    setClickEffects((prev) => {
      const next = [...prev, { id, x: e.clientX, y: e.clientY }];
      return next.length > MAX_CLICK_EFFECTS
        ? next.slice(next.length - MAX_CLICK_EFFECTS)
        : next;
    });
    setTimeout(
      () => setClickEffects((prev) => prev.filter((ef) => ef.id !== id)),
      600,
    );
  }, []);

  // 特殊バナナがスポーンしたときのエフェクト
  const handleSpecialSpawn = useCallback((x, itemId) => {
    const id = ++_textId;
    setSpawnFlashes((prev) => {
      const next = [...prev, { id, x, itemId }];
      return next.length > MAX_SPAWN_FLASHES
        ? next.slice(next.length - MAX_SPAWN_FLASHES)
        : next;
    });
    setTimeout(
      () => setSpawnFlashes((prev) => prev.filter((f) => f.id !== id)),
      1200,
    );
  }, []);

  // 特殊バナナが着地したときの処理
  // pos: { x, y } — 着地位置（バースト表示に使用）
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
        const burstId = ++_textId;
        setFeverBursts((prev) => {
          const next = [...prev, { id: burstId, x: pos.x, y: pos.y, itemId }];
          return next.length > MAX_FEVER_BURSTS
            ? next.slice(next.length - MAX_FEVER_BURSTS)
            : next;
        });
        setTimeout(
          () => setFeverBursts((prev) => prev.filter((b) => b.id !== burstId)),
          1100,
        );
      }
    },
    [shopPurchases, unlockedTiers, triggerEffect],
  );

  const handleBuyUpgrade = useCallback(
    (upgrade) => {
      const purchasedSuccess = buyUpgrade(upgrade, score, devMode);
      if (!purchasedSuccess) return;
      if (!devMode) {
        setScore((currentScore) => currentScore - upgrade.cost);
      }
    },
    [buyUpgrade, score, devMode],
  );

  const handleAdjustScore = useCallback((delta) => {
    setScore((s) => Math.max(0, s + delta));
  }, []);

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
  }, [waterTree, score, devMode, treeWaterBonus, treeWaterCostDiscount]);

  const scoreColor = (tier) => TIER_COLORS[tier - 1] ?? '#555';

  // フィーバー残り秒数と進捗
  const feverRemaining = isFever
    ? Math.max(0, Math.ceil((feverEndTime - Date.now()) / 1000))
    : 0;
  const feverPercent =
    isFever && feverDuration > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((feverEndTime - Date.now()) / (feverDuration * 1000)) * 100,
          ),
        )
      : 0;

  // oneKind 残り秒数と進捗
  const oneKindRemaining = isOneKind
    ? Math.max(0, Math.ceil((oneKindEndTime - Date.now()) / 1000))
    : 0;
  const oneKindPercent =
    isOneKind && oneKindDuration > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((oneKindEndTime - Date.now()) / (oneKindDuration * 1000)) * 100,
          ),
        )
      : 0;

  // allGiant 残り秒数と進捗
  const allGiantRemaining = isAllGiant
    ? Math.max(0, Math.ceil((allGiantEndTime - Date.now()) / 1000))
    : 0;
  const allGiantPercent =
    isAllGiant && allGiantDuration > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((allGiantEndTime - Date.now()) / (allGiantDuration * 1000)) * 100,
          ),
        )
      : 0;

  // エフェクト適用後の値
  const effectiveRate = autoSpawnRate * effectiveAutoMultiplier;
  const effectiveGiantChance = isAllGiant ? 1 : giantChance;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
      onClick={handleClick}
    >
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

      {/* フィーバー：上部カウントダウンバー + 中央ラベル */}
      {isFever && (
        <>
          {/* 画面最上部の光る帯 */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              zIndex: 200,
              background: 'rgba(0,0,0,0.06)',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${feverPercent}%`,
                background: 'linear-gradient(90deg, #ff6b35, #ffd700, #ff9f00)',
                backgroundSize: '200% 100%',
                boxShadow:
                  '0 0 12px rgba(255,107,53,0.8), 0 0 4px rgba(255,215,0,0.6)',
                borderRadius: '0 3px 3px 0',
                transition: 'width 0.5s linear',
                animation: 'feverBarShimmer 2s linear infinite',
              }}
            />
          </div>

          {/* 中央フローティングラベル */}
          <div
            style={{
              position: 'fixed',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 201,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 100, 30, 0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,107,53,0.3)',
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#e85d00',
              whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>🔥</span>
            <span>ぬいバナナ</span>
            <span
              style={{
                opacity: 0.65,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {feverRemaining}s
            </span>
          </div>
        </>
      )}

      {/* allGiant：上部カウントダウンバー + 中央ラベル */}
      {isAllGiant && (
        <>
          <div
            style={{
              position: 'fixed',
              top: isFever ? 5 : 0,
              left: 0,
              right: 0,
              height: 5,
              zIndex: 200,
              background: 'rgba(0,0,0,0.06)',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${allGiantPercent}%`,
                background: 'linear-gradient(90deg, #a855f7, #ec4899, #a855f7)',
                backgroundSize: '200% 100%',
                boxShadow:
                  '0 0 12px rgba(168,85,247,0.8), 0 0 4px rgba(236,72,153,0.6)',
                borderRadius: '0 3px 3px 0',
                transition: 'width 0.5s linear',
                animation: 'feverBarShimmer 2s linear infinite',
              }}
            />
          </div>
          <div
            style={{
              position: 'fixed',
              top: isFever ? 36 : 10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 201,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(168, 85, 247, 0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(168,85,247,0.3)',
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: 'var(--special-magic)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>✨</span>
            <span>マジックバナナ</span>
            <span
              style={{
                opacity: 0.65,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {allGiantRemaining}s
            </span>
          </div>
        </>
      )}

      {/* oneKind：上部カウントダウンバー + 中央ラベル */}
      {isOneKind && (
        <>
          <div
            style={{
              position: 'fixed',
              top: [isFever, isAllGiant].filter(Boolean).length * 5,
              left: 0,
              right: 0,
              height: 5,
              zIndex: 200,
              background: 'rgba(0,0,0,0.06)',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${oneKindPercent}%`,
                background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4)',
                backgroundSize: '200% 100%',
                boxShadow:
                  '0 0 12px rgba(6,182,212,0.8), 0 0 4px rgba(59,130,246,0.6)',
                borderRadius: '0 3px 3px 0',
                transition: 'width 0.5s linear',
                animation: 'feverBarShimmer 2s linear infinite',
              }}
            />
          </div>
          <div
            style={{
              position: 'fixed',
              top: 10 + [isFever, isAllGiant].filter(Boolean).length * 26,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 201,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(6, 182, 212, 0.12)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(6,182,212,0.3)',
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#0891b2',
              whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>🍌</span>
            <span>oneバナナ</span>
            <span
              style={{
                opacity: 0.65,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {oneKindRemaining}s
            </span>
          </div>
        </>
      )}

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
      {floatingCoins.map((coin) => (
        <div
          key={coin.id}
          style={{
            position: 'fixed',
            left: coin.x,
            bottom: 120,
            transform: 'translateX(-50%)',
            zIndex: 20,
            fontSize: '1.6rem',
            fontWeight: 900,
            fontFamily: '"Outfit", sans-serif',
            color: 'var(--accent-gold)',
            pointerEvents: 'none',
            animation:
              'floatUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            willChange: 'transform, opacity',
            contain: 'layout style',
            textShadow:
              '0 2px 10px rgba(255,215,0,0.6), 0 0 20px rgba(255,215,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}coin.png`}
            alt="coin"
            style={{
              width: 28,
              height: 28,
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 6px rgba(212,175,55,0.6))',
            }}
          />
          <span>+1</span>
        </div>
      ))}
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
        onResetUpgrades={resetUpgrades}
        onAdjustScore={handleAdjustScore}
        onAdjustCoins={adjustCoins}
        isOneKind={isOneKind}
        oneKindSelection={oneKindSelection}
        onSpecialSpawn={handleSpecialSpawn}
        treeMutationRateBonus={treeMutationRateBonus}
        treeCriticalClickChance={treeCriticalClickChance}
      />
    </div>
  );
}

export default App;
