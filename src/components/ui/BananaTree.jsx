import { useState, useEffect, useRef } from 'react';
import { Droplets } from 'lucide-react';

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
  seeds,
  treeLevel,
  treeGrowth,
  onWater,
  devMode,
}) {
  const [showSeedEffect, setShowSeedEffect] = useState(false);
  const prevLevelRef = useRef(treeLevel);

  const stageIndex = Math.min(
    Math.floor(treeLevel / 5),
    TREE_STAGES.length - 1,
  );
  const currentStage = TREE_STAGES[stageIndex];
  const isGold = stageIndex >= 5;

  const cost = 100 + treeLevel * 50;
  const canAfford = score >= cost || devMode;
  const progress = Math.min(100, Math.max(0, treeGrowth));

  const imgSrc = `${import.meta.env.BASE_URL}tree_stage${String(stageIndex).padStart(2, '0')}.png`;

  useEffect(() => {
    if (treeLevel > prevLevelRef.current) {
      const showTimer = setTimeout(() => setShowSeedEffect(true), 0);
      const hideTimer = setTimeout(() => setShowSeedEffect(false), 2000);
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
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        userSelect: 'none',
        minWidth: 280,
        borderRadius: '24px',
        border: isGold
          ? '1px solid var(--accent-gold-soft)'
          : '1px solid var(--glass-border)',
        animation: showSeedEffect ? 'levelUpFlash 0.8s ease-out' : undefined,
      }}
    >
      {/* Level-up seed pop-up */}
      {showSeedEffect && (
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
            gap: 3,
          }}
        >
          <span>+1</span>
          <span style={{ fontSize: '1rem' }}>🌱</span>
        </div>
      )}

      {/* Left: tree image + level badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          flexShrink: 0,
        }}
      >
        <img
          key={stageIndex}
          src={imgSrc}
          alt={currentStage.label}
          style={{
            width: 120,
            height: 120,
            objectFit: 'contain',
            display: 'block',
            filter: isGold
              ? 'drop-shadow(0 0 8px rgba(212,175,55,0.6))'
              : 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
          }}
        />
        {/* LV badge */}
        <div
          style={{
            fontSize: '0.62rem',
            fontWeight: 900,
            color: currentStage.color,
            background: isGold
              ? 'rgba(212,175,55,0.14)'
              : 'rgba(76,175,80,0.1)',
            padding: '2px 10px',
            borderRadius: 10,
            letterSpacing: '0.05em',
          }}
        >
          LV.{treeLevel}
        </div>
      </div>

      {/* Right: info column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          minWidth: 0,
        }}
      >
        {/* Stage name + Seeds balance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: '0.88rem',
              fontWeight: 900,
              color: currentStage.color,
              letterSpacing: '0.03em',
            }}
          >
            {currentStage.label}
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              background: 'rgba(212,175,55,0.1)',
              padding: '2px 8px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
            }}
          >
            ✨ {seeds}
          </span>
        </div>

        {/* Growth bar */}
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
            <span>次のシードまで</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div
            style={{
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
        </div>

        {/* Water button + cost */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
              background: canAfford
                ? 'linear-gradient(135deg, #64B5F6 0%, #1E88E5 100%)'
                : '#ececec',
              color: canAfford ? '#fff' : '#bbb',
              fontSize: '0.73rem',
              fontWeight: 800,
              cursor: canAfford ? 'pointer' : 'not-allowed',
              boxShadow: canAfford ? '0 3px 10px rgba(30,136,229,0.3)' : 'none',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              flexShrink: 0,
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
              fontSize: '0.68rem',
              fontWeight: 700,
              color: canAfford ? 'var(--text-muted)' : 'var(--text-muted)',
              opacity: canAfford ? 0.7 : 0.35,
              whiteSpace: 'nowrap',
            }}
          >
            -{cost}pt
          </span>
        </div>
      </div>
    </div>
  );
}
