import { useState, useCallback, useRef, useEffect } from 'react';
import BananaWorld from './components/BananaWorld';
import ClickRipple from './components/ui/ClickRipple';
import FeverBurst from './components/ui/FeverBurst';
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

let _textId = 0;

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
    waterTree,
    addBanaCoin,
    shopPurchases,
    buyShopItem,
    cheatBanaCoins,
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
  } = useActiveEffects();

  const bananaWorldRef = useRef(null);

  const [floatingTexts, setFloatingTexts] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [feverBursts, setFeverBursts] = useState([]);
  const [scoreBump, setScoreBump] = useState(false);
  const [perSecond, setPerSecond] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  // 開発者モード: Ctrl+Shift+D で切り替え
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDevMode((prev) => {
          const next = !prev;
          if (next) {
            setScore(99999999);
            cheatBanaCoins();
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cheatBanaCoins]);

  // ツリーレベルアップ時にバナコインをスポーン
  const prevTreeLevelRef = useRef(null);
  useEffect(() => {
    if (prevTreeLevelRef.current === null) {
      prevTreeLevelRef.current = treeLevel;
      return;
    }
    if (treeLevel > prevTreeLevelRef.current) {
      const x = 80 + Math.random() * (window.innerWidth - 160);
      bananaWorldRef.current?.spawnCoin(x);
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

  const handleScore = useCallback((scoreItems) => {
    const total = scoreItems.reduce((sum, item) => sum + item.score, 0);
    setScore((s) => s + total);
    scoreHistoryRef.current.push({ time: Date.now(), score: total });
    setScoreBump(true);
    setTimeout(() => setScoreBump(false), 300);

    const newTexts = scoreItems.map((item) => ({
      id: ++_textId,
      value: item.score,
      x: Math.max(40, Math.min(window.innerWidth - 40, item.x)),
    }));
    setFloatingTexts((prev) => [...prev, ...newTexts]);
    setTimeout(() => {
      const ids = new Set(newTexts.map((t) => t.id));
      setFloatingTexts((prev) => prev.filter((t) => !ids.has(t.id)));
    }, 1200);
  }, []);

  const handleClick = useCallback((e) => {
    const id = ++_textId;
    setClickEffects((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(
      () => setClickEffects((prev) => prev.filter((ef) => ef.id !== id)),
      600,
    );
  }, []);

  // 特殊バナナが着地したときの処理
  // pos: { x, y } — 着地位置（バースト表示に使用）
  const handleEffect = useCallback(
    (itemId, pos) => {
      const count = shopPurchases[itemId] ?? 1;
      triggerEffect(itemId, count);

      if (pos) {
        const burstId = ++_textId;
        setFeverBursts((prev) => [
          ...prev,
          { id: burstId, x: pos.x, y: pos.y },
        ]);
        setTimeout(
          () => setFeverBursts((prev) => prev.filter((b) => b.id !== burstId)),
          1100,
        );
      }
    },
    [shopPurchases, triggerEffect],
  );

  const handleBuyUpgrade = useCallback(
    (upgrade) => {
      const purchasedSuccess = buyUpgrade(upgrade, score);
      if (!purchasedSuccess) return;
      if (!devMode) {
        setScore((currentScore) => currentScore - upgrade.cost);
      }
    },
    [buyUpgrade, score, devMode],
  );

  const handleWaterTree = useCallback(() => {
    const cost = waterTree(score);
    if (cost && !devMode) {
      setScore((currentScore) => currentScore - cost);
    }
  }, [waterTree, score, devMode]);

  const scoreColor = (score) => {
    if (score >= 500) return '#ff00ff';
    if (score >= 100) return '#ffd700';
    if (score >= 30) return '#c0c0c0';
    if (score >= 12) return '#cd7f32';
    if (score >= 3) return '#c8a000';
    return '#555';
  };

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
              color: '#9333ea',
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

      <BananaTree
        score={score}
        treeLevel={treeLevel}
        treeGrowth={treeGrowth}
        onWater={handleWaterTree}
        devMode={devMode}
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
            color: '#d4af37',
            pointerEvents: 'none',
            animation:
              'floatUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
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
          color={scoreColor(text.value)}
        />
      ))}

      {clickEffects.map((effect) => (
        <ClickRipple key={effect.id} effect={effect} />
      ))}

      {feverBursts.map((burst) => (
        <FeverBurst key={burst.id} burst={burst} />
      ))}

      <UpgradePanel
        groups={UPGRADE_GROUPS}
        purchased={purchased}
        score={score}
        onBuy={handleBuyUpgrade}
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
      />
    </div>
  );
}

export default App;
