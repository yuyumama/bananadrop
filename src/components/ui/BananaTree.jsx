import { useState, useEffect, useRef } from 'react';
import { Droplets } from 'lucide-react';
import { getMaxGrowth, getWaterCost } from '../../hooks/useUpgradeState';

const TREE_STAGES = [
  { label: '種子', color: '#8bc34a' },
  { label: '芽吹き', color: '#7cb342' },
  { label: '若苗', color: '#558b2f' },
  { label: '若葉', color: '#4caf50' },
  { label: '成長期', color: '#388e3c' },
  { label: '開花', color: '#a5d240' },
  { label: '成熟', color: '#d4af37' },
];

export default function BananaTree({
  score,
  treeLevel,
  treeGrowth,
  waterCount,
  onWater,
  devMode,
}) {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevLevelRef = useRef(treeLevel);

  const stageIndex = Math.min(
    Math.floor(treeLevel / 5),
    TREE_STAGES.length - 1,
  );
  const currentStage = TREE_STAGES[stageIndex];
  const isGold = stageIndex >= 5;

  const cost = getWaterCost(waterCount);
  const canAfford = score >= cost || devMode;
  const maxGrowth = getMaxGrowth(treeLevel);
  const progress = Math.min(100, Math.max(0, (treeGrowth / maxGrowth) * 100));

  const imgSrc = `${import.meta.env.BASE_URL}tree_stage${String(stageIndex).padStart(2, '0')}.png`;
  const coinSrc = `${import.meta.env.BASE_URL}coin.png`;

  useEffect(() => {
    if (treeLevel > prevLevelRef.current) {
      const showTimer = setTimeout(() => setShowLevelUp(true), 0);
      const hideTimer = setTimeout(() => setShowLevelUp(false), 2000);
      prevLevelRef.current = treeLevel;
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    prevLevelRef.current = treeLevel;
  }, [treeLevel]);

  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        top: 130,
        left: 24,
        zIndex: 10,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        userSelect: 'none',
        width: 160,
        borderRadius: '24px',
        border: isGold
          ? '1px solid var(--accent-gold-soft)'
          : '1px solid var(--glass-border)',
        animation: showLevelUp ? 'levelUpFlash 0.8s ease-out' : undefined,
      }}
    >
      {/* Level-up coin pop-up */}
      {showLevelUp && (
        <div
          style={{
            position: 'absolute',
            top: '6%',
            left: '32%',
            color: 'var(--accent-gold)',
            fontWeight: 900,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 20,
            animation: 'seedPopUp 2s ease-out forwards',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>コイン</span>
          <img
            src={coinSrc}
            alt="coin"
            style={{ width: 18, height: 18, objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Top: tree image + level badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <img
          key={stageIndex}
          src={imgSrc}
          alt={currentStage.label}
          style={{
            width: 90,
            height: 90,
            objectFit: 'contain',
            display: 'block',
            filter: isGold
              ? 'drop-shadow(0 0 8px rgba(212,175,55,0.6))'
              : 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
          }}
        />
        {/* Stage name + LV badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 900,
              color: currentStage.color,
              letterSpacing: '0.03em',
            }}
          >
            {currentStage.label}
          </span>
          <div
            style={{
              fontSize: '0.58rem',
              fontWeight: 900,
              color: currentStage.color,
              background: isGold
                ? 'rgba(212,175,55,0.14)'
                : 'rgba(76,175,80,0.1)',
              padding: '1px 8px',
              borderRadius: 10,
              letterSpacing: '0.05em',
            }}
          >
            LV.{treeLevel}
          </div>
        </div>
      </div>

      {/* Bottom: info column */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Growth bar + coin goal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
            }}
          >
            <span>次のバナコインまで</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(progress)}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                flex: 1,
                height: 7,
                background: 'rgba(0,0,0,0.07)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: isGold
                    ? 'linear-gradient(90deg, var(--accent-gold), #ffe066)'
                    : `linear-gradient(90deg, ${currentStage.color}, #a5d678)`,
                  borderRadius: 4,
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </div>
            <img
              src={coinSrc}
              alt="バナコイン"
              style={{
                width: 22,
                height: 22,
                objectFit: 'contain',
                flexShrink: 0,
                animation: 'treeCoinGlow 2s ease-in-out infinite',
                opacity: progress >= 95 ? 1 : 0.45,
                transition: 'opacity 0.5s',
              }}
            />
          </div>
        </div>

        {/* Water button + cost */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <button
            onClick={() => canAfford && onWater()}
            disabled={!canAfford}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 15px',
              borderRadius: 20,
              border: 'none',
              width: '100%',
              justifyContent: 'center',
              background: canAfford
                ? 'linear-gradient(135deg, #64B5F6 0%, #1E88E5 100%)'
                : '#ececec',
              color: canAfford ? '#fff' : '#bbb',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: canAfford ? 'pointer' : 'not-allowed',
              boxShadow: canAfford ? '0 3px 10px rgba(30,136,229,0.3)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onMouseEnter={(e) => {
              if (canAfford) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow =
                  '0 5px 14px rgba(30,136,229,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = canAfford
                ? '0 3px 10px rgba(30,136,229,0.3)'
                : 'none';
            }}
            onMouseDown={(e) => {
              if (canAfford) e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              if (canAfford) e.currentTarget.style.transform = 'scale(1.05)';
            }}
          >
            <Droplets
              size={14}
              fill={canAfford ? 'rgba(255,255,255,0.25)' : 'none'}
            />
            水やり +20%
          </button>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: canAfford ? 'var(--accent-gold)' : 'var(--text-muted)',
              opacity: canAfford ? 0.85 : 0.4,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ fontSize: '0.8em' }}>🍌</span>
            <span>{cost.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
