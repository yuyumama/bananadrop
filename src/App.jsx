import { useState, useCallback, useRef, useEffect } from 'react';
import BananaWorld from './components/BananaWorld';
import ScoreDisplay from './components/ScoreDisplay';
import { UPGRADES } from './data/upgrades';

const BANANA_TIERS = [
  { tier: 1, name: '普通バナナ', score: 1, texture: 'banana_green.png' },
  { tier: 2, name: '熟バナナ', score: 3, texture: 'banana_rembg.png' },
  { tier: 3, name: '完熟バナナ', score: 12, texture: 'banana_ripe.png' },
  { tier: 4, name: '銀バナナ', score: 30, texture: 'banana_silver.png' },
  { tier: 5, name: '金バナナ', score: 100, texture: 'banana_gold.png' },
  { tier: 6, name: '伝説バナナ', score: 500, texture: 'banana_legend.png' },
];

const TIER_COLORS = [
  '#888',
  '#c8a000',
  '#cd7f32',
  '#c0c0c0',
  '#ffd700',
  '#ff00ff',
];

const GROUPS = [
  { key: 'click', label: '🍌 クリック', defaultLabel: '1本/クリック' },
  { key: 'banana', label: '🌟 バナナ種', defaultLabel: '普通バナナのみ' },
  { key: 'auto', label: '⏰ オート', defaultLabel: '手動のみ' },
  { key: 'rare', label: '💫 レア', defaultLabel: 'レアなし' },
];

let _textId = 0;

function App() {
  const [score, setScore] = useState(0);
  const [bananaPerClick, setBananaPerClick] = useState(1);
  const [autoSpawnRate, setAutoSpawnRate] = useState(0);
  const [giantChance, setGiantChance] = useState(0);
  const [unlockedTiers, setUnlockedTiers] = useState([BANANA_TIERS[0]]);
  const [purchased, setPurchased] = useState(new Set());
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [scoreBump, setScoreBump] = useState(false);
  const [perSecond, setPerSecond] = useState(0);

  const unlockedTiersRef = useRef(unlockedTiers);
  useEffect(() => {
    unlockedTiersRef.current = unlockedTiers;
  }, [unlockedTiers]);

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

  const buyUpgrade = (upgrade) => {
    if (score < upgrade.cost) return;
    if (purchased.has(upgrade.id)) return;
    if (upgrade.requires && !purchased.has(upgrade.requires)) return;

    setScore((s) => s - upgrade.cost);
    setPurchased((p) => new Set([...p, upgrade.id]));

    if (upgrade.clickPer) setBananaPerClick(upgrade.clickPer);
    else if (upgrade.autoPer) setAutoSpawnRate(upgrade.autoPer);
    else if (upgrade.giantChance) setGiantChance(upgrade.giantChance);
    else if (upgrade.tier) {
      const newTier = BANANA_TIERS.find((t) => t.tier === upgrade.tier);
      setUnlockedTiers((prev) => [...prev, newTier]);
    }
  };

  const scoreColor = (score) => {
    if (score >= 500) return '#ff00ff';
    if (score >= 100) return '#ffd700';
    if (score >= 30) return '#c0c0c0';
    if (score >= 12) return '#cd7f32';
    if (score >= 3) return '#c8a000';
    return '#555';
  };

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
      <ScoreDisplay score={score} perSecond={perSecond} scoreBump={scoreBump} />

      {/* 解放中のバナナ種 */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 10,
          display: 'flex',
          gap: 4,
        }}
      >
        {unlockedTiers.map((t) => (
          <div
            key={t.tier}
            style={{
              background: 'rgba(255,255,255,0.88)',
              borderRadius: 10,
              padding: '5px 9px',
              fontSize: '0.72rem',
              fontWeight: 'bold',
              color: TIER_COLORS[t.tier - 1],
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              userSelect: 'none',
            }}
          >
            {t.name}
            <br />
            <span style={{ fontSize: '0.65rem' }}>+{t.score}pt</span>
          </div>
        ))}
      </div>

      {/* 浮き上がりテキスト */}
      {floatingTexts.map((t) => (
        <div
          key={t.id}
          style={{
            position: 'fixed',
            left: t.x,
            bottom: 100,
            zIndex: 20,
            fontSize:
              t.value >= 500
                ? '2.5rem'
                : t.value >= 100
                  ? '2.2rem'
                  : t.value >= 30
                    ? '1.8rem'
                    : t.value >= 12
                      ? '1.4rem'
                      : '1.1rem',
            fontWeight: 'bold',
            color: scoreColor(t.value),
            pointerEvents: 'none',
            animation: 'floatUp 1.2s ease-out forwards',
            textShadow: '0 1px 4px rgba(255,255,255,0.9)',
            whiteSpace: 'nowrap',
          }}
        >
          +{t.value}🍌
        </div>
      ))}

      {/* クリックリップル */}
      {clickEffects.map((ef) => (
        <div
          key={ef.id}
          style={{
            position: 'fixed',
            left: ef.x,
            top: ef.y,
            width: 50,
            height: 50,
            borderRadius: '50%',
            border: '3px solid rgba(255, 200, 0, 0.9)',
            pointerEvents: 'none',
            zIndex: 20,
            animation: 'ripple 0.6s ease-out forwards',
          }}
        />
      ))}

      {/* アップグレードパネル */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'rgba(255,255,255,0.93)',
          borderTop: '1.5px solid rgba(0,0,0,0.08)',
          padding: '8px 8px 10px',
          display: 'flex',
          gap: 6,
          backdropFilter: 'blur(10px)',
        }}
      >
        {GROUPS.map((group) => {
          const items = UPGRADES.filter((u) => u.group === group.key);
          const purchasedItems = items.filter((u) => purchased.has(u.id));
          const currentLabel =
            purchasedItems.length > 0
              ? purchasedItems[purchasedItems.length - 1].label
              : group.defaultLabel;
          const nextItem = items.find(
            (u) =>
              !purchased.has(u.id) &&
              (!u.requires || purchased.has(u.requires)),
          );
          const affordable = nextItem && score >= nextItem.cost;

          return (
            <div
              key={group.key}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 'bold',
                  color: '#888',
                  textAlign: 'center',
                }}
              >
                {group.label}
              </div>
              {!nextItem ? (
                <button
                  disabled
                  style={{
                    width: '100%',
                    padding: '7px 4px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#b0e0a0',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'default',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: '#3a7a3a' }}>
                    ✓ {currentLabel}
                  </div>
                  <div
                    style={{
                      fontSize: '0.6rem',
                      marginTop: 1,
                      fontWeight: 'normal',
                      color: '#5a9a5a',
                    }}
                  >
                    MAX
                  </div>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    buyUpgrade(nextItem);
                  }}
                  style={{
                    width: '100%',
                    padding: '7px 4px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: affordable ? 'pointer' : 'not-allowed',
                    background: affordable ? '#ffd700' : '#eeeeee',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    boxShadow: affordable
                      ? '0 2px 10px rgba(255,190,0,0.6), 0 0 0 1.5px rgba(255,180,0,0.4)'
                      : '0 1px 3px rgba(0,0,0,0.1)',
                    transform: affordable ? 'translateY(-1px)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '0.6rem', color: '#666' }}>
                    {currentLabel}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#333' }}>
                    → {nextItem.label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.6rem',
                      marginTop: 1,
                      fontWeight: 'normal',
                      opacity: 0.8,
                    }}
                  >
                    🍌 {nextItem.cost.toLocaleString()}
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <BananaWorld
        bananaPerClick={bananaPerClick}
        autoSpawnRate={autoSpawnRate}
        panelHeight={80}
        unlockedTiers={unlockedTiers}
        giantChance={giantChance}
        onScore={handleScore}
      />
    </div>
  );
}

export default App;
