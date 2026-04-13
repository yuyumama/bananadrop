import { useState, useEffect, useRef } from 'react';
import { Droplets } from 'lucide-react';
import { getMaxGrowth, getWaterCost } from '../../hooks/useUpgradeState';

// Stage definitions with hex values for inline rgba calculations
const TREE_STAGES = [
  {
    label: '種子',
    cssColor: 'var(--tree-green-1)',
    hex: '#8bc34a',
    glow: 'rgba(139,195,74,0.4)',
    glowSoft: 'rgba(139,195,74,0.18)',
    particle: 'rgba(139,195,74,0.8)',
  },
  {
    label: '芽吹き',
    cssColor: 'var(--tree-green-2)',
    hex: '#7cb342',
    glow: 'rgba(124,179,66,0.4)',
    glowSoft: 'rgba(124,179,66,0.18)',
    particle: 'rgba(124,179,66,0.8)',
  },
  {
    label: '若苗',
    cssColor: 'var(--tree-green-3)',
    hex: '#558b2f',
    glow: 'rgba(85,139,47,0.42)',
    glowSoft: 'rgba(85,139,47,0.18)',
    particle: 'rgba(85,139,47,0.8)',
  },
  {
    label: '若葉',
    cssColor: 'var(--tree-green-4)',
    hex: '#4caf50',
    glow: 'rgba(76,175,80,0.42)',
    glowSoft: 'rgba(76,175,80,0.18)',
    particle: 'rgba(76,175,80,0.8)',
  },
  {
    label: '成長期',
    cssColor: 'var(--tree-green-5)',
    hex: '#388e3c',
    glow: 'rgba(56,142,60,0.42)',
    glowSoft: 'rgba(56,142,60,0.18)',
    particle: 'rgba(56,142,60,0.8)',
  },
  {
    label: '開花',
    cssColor: 'var(--tree-green-6)',
    hex: '#a5d240',
    glow: 'rgba(165,210,64,0.5)',
    glowSoft: 'rgba(165,210,64,0.22)',
    particle: 'rgba(165,210,64,0.85)',
  },
  {
    label: '成熟',
    cssColor: 'var(--accent-gold)',
    hex: '#d4af37',
    glow: 'rgba(212,175,55,0.5)',
    glowSoft: 'rgba(212,175,55,0.22)',
    particle: 'rgba(212,175,55,0.9)',
  },
];

// Skill type themes
const SKILL_TYPE_THEMES = {
  growthBonus: {
    bg: 'rgba(76,175,80,0.13)',
    border: 'rgba(76,175,80,0.45)',
    text: '#2e7d32',
    glow: 'rgba(76,175,80,0.35)',
    dot: '#4caf50',
  },
  waterCostDiscount: {
    bg: 'rgba(0,188,212,0.12)',
    border: 'rgba(0,188,212,0.45)',
    text: '#006064',
    glow: 'rgba(0,188,212,0.35)',
    dot: '#00bcd4',
  },
  waterBoost: {
    bg: 'rgba(30,136,229,0.12)',
    border: 'rgba(30,136,229,0.45)',
    text: '#1565c0',
    glow: 'rgba(30,136,229,0.35)',
    dot: '#1e88e5',
  },
  coinsPerLevelUp: {
    bg: 'rgba(212,175,55,0.13)',
    border: 'rgba(212,175,55,0.5)',
    text: '#b8860b',
    glow: 'rgba(212,175,55,0.4)',
    dot: '#d4af37',
  },
  mutationRateBonus: {
    bg: 'rgba(156,39,176,0.11)',
    border: 'rgba(156,39,176,0.42)',
    text: '#6a1b9a',
    glow: 'rgba(156,39,176,0.35)',
    dot: '#9c27b0',
  },
  criticalClickChance: {
    bg: 'rgba(255,87,34,0.11)',
    border: 'rgba(255,87,34,0.42)',
    text: '#bf360c',
    glow: 'rgba(255,87,34,0.38)',
    dot: '#ff5722',
  },
};

const FALLBACK_THEME = {
  bg: 'rgba(100,100,100,0.1)',
  border: 'rgba(100,100,100,0.3)',
  text: '#555',
  glow: 'rgba(100,100,100,0.25)',
  dot: '#aaa',
};

function getSkillTheme(skill) {
  const key = Object.keys(SKILL_TYPE_THEMES).find((k) => skill[k] != null);
  return key ? SKILL_TYPE_THEMES[key] : FALLBACK_THEME;
}

// Static particle configs (positions and drift vectors) to avoid rerenders
const PARTICLE_CONFIGS = [
  { left: '30%', top: '62%', delay: 0.0, tx: '-6px', duration: 3.0 },
  { left: '70%', top: '52%', delay: 0.9, tx: '7px', duration: 3.5 },
  { left: '45%', top: '36%', delay: 1.7, tx: '-3px', duration: 2.8 },
  { left: '63%', top: '44%', delay: 0.5, tx: '5px', duration: 3.2 },
  { left: '20%', top: '47%', delay: 2.3, tx: '-8px', duration: 2.6 },
  { left: '80%', top: '67%', delay: 1.2, tx: '6px', duration: 3.8 },
];

export default function BananaTree({
  score,
  treeLevel,
  treeGrowth,
  waterCount,
  onWater,
  devMode,
  chosenSkills = [],
  pendingChoice = null,
  onChooseSkill,
  waterBoostPercent = 20,
  waterCostDiscount = 0,
}) {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevLevelRef = useRef(treeLevel);

  const stageIndex = Math.min(
    Math.floor(treeLevel / 5),
    TREE_STAGES.length - 1,
  );
  const currentStage = TREE_STAGES[stageIndex];
  const isGold = stageIndex >= 5;

  const cost = Math.round(getWaterCost(waterCount) * (1 - waterCostDiscount));
  const canAfford = score >= cost || devMode;
  const maxGrowth = getMaxGrowth(treeLevel);
  const progress = Math.min(100, Math.max(0, (treeGrowth / maxGrowth) * 100));

  const getImgSrc = (idx) =>
    `${import.meta.env.BASE_URL}tree_stage${String(idx).padStart(2, '0')}.png`;
  const coinSrc = `${import.meta.env.BASE_URL}coin.png`;

  // ── Stage transition crossfade state ──
  const displayedStageRef = useRef(stageIndex);
  const transitionTimersRef = useRef([]);
  const [treeTransition, setTreeTransition] = useState({
    currentStageIndex: stageIndex,
    prevStageIndex: null,
    isTransitioning: false,
    showBurst: false,
  });

  useEffect(() => {
    if (stageIndex === displayedStageRef.current) return;

    const prevStage = displayedStageRef.current;
    displayedStageRef.current = stageIndex;

    transitionTimersRef.current.forEach(clearTimeout);

    setTreeTransition({
      currentStageIndex: stageIndex,
      prevStageIndex: prevStage,
      isTransitioning: true,
      showBurst: true,
    });

    transitionTimersRef.current = [
      setTimeout(() => {
        setTreeTransition((prev) => ({ ...prev, showBurst: false }));
      }, 580),
      setTimeout(() => {
        setTreeTransition((prev) => ({
          ...prev,
          prevStageIndex: null,
          isTransitioning: false,
        }));
      }, 750),
    ];
  }, [stageIndex]);

  useEffect(() => {
    return () => transitionTimersRef.current.forEach(clearTimeout);
  }, []);

  // Level-up flash
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

  const particleCount = Math.min(stageIndex + 1, 6);
  const currentImgSrc = getImgSrc(treeTransition.currentStageIndex);
  const prevImgSrc =
    treeTransition.prevStageIndex !== null
      ? getImgSrc(treeTransition.prevStageIndex)
      : null;
  const prevStage =
    treeTransition.prevStageIndex !== null
      ? TREE_STAGES[treeTransition.prevStageIndex]
      : null;

  return (
    <section
      className="banana-tree-panel"
      aria-label={`バナナツリー レベル${treeLevel} - ${currentStage.label}`}
      style={{
        position: 'fixed',
        top: 130,
        left: 24,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {/* ── メインパネル ── */}
      <div
        className="glass-panel banana-tree-main"
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          userSelect: 'none',
          width: 160,
          maxHeight: 'calc(100vh - 130px - 120px)',
          boxSizing: 'border-box',
          borderRadius: '24px',
          border: `1px solid ${currentStage.glow}`,
          transition: 'border-color 1.2s ease',
          animation: showLevelUp ? 'levelUpFlash 0.8s ease-out' : undefined,
          pointerEvents: 'auto',
        }}
      >
        {/* ── Tree Showcase: circular living frame ── */}
        <div
          className="tree-showcase"
          style={{
            position: 'relative',
            width: 136,
            height: 136,
            flexShrink: 0,
          }}
        >
          {/* Outer glow ring */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              border: `1px solid ${currentStage.glow}`,
              boxShadow: `0 0 16px ${currentStage.glow}`,
              transition: 'all 1.2s ease',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Circular viewport */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              overflow: 'hidden',
              background: `radial-gradient(circle at 50% 78%, ${currentStage.glowSoft} 0%, rgba(252,250,245,0.35) 65%)`,
              border: `1.5px solid ${currentStage.glow}`,
              boxShadow: isGold
                ? `0 4px 24px rgba(212,175,55,0.3), inset 0 0 20px rgba(212,175,55,0.1)`
                : `0 4px 18px ${currentStage.glow}, inset 0 0 14px ${currentStage.glowSoft}`,
              transition:
                'background 1.2s ease, border-color 1.2s ease, box-shadow 1.2s ease',
            }}
          >
            {/* Ground reflection ellipse */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: 5,
                left: '16%',
                right: '16%',
                height: 18,
                background: `radial-gradient(ellipse at center, ${currentStage.glowSoft} 0%, transparent 70%)`,
                transition: 'background 1.2s ease',
                filter: 'blur(5px)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            {/* Previous tree image (stage-out animation) */}
            {prevImgSrc && prevStage && (
              <img
                src={prevImgSrc}
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 5,
                  width: 'calc(100% - 10px)',
                  height: 'calc(100% - 10px)',
                  objectFit: 'contain',
                  filter: `drop-shadow(0 2px 6px ${prevStage.glow})`,
                  animation:
                    'treeStageOut 0.55s cubic-bezier(0.4, 0, 1, 1) forwards',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
            )}

            {/* Current tree image */}
            <img
              className="tree-image"
              src={currentImgSrc}
              alt={`${currentStage.label} ステージのバナナツリー`}
              style={{
                position: 'absolute',
                inset: 5,
                width: 'calc(100% - 10px)',
                height: 'calc(100% - 10px)',
                objectFit: 'contain',
                animation: treeTransition.isTransitioning
                  ? 'treeStageIn 0.7s cubic-bezier(0.34, 1.4, 0.64, 1) forwards'
                  : 'treeSway 5.5s ease-in-out infinite',
                filter: isGold
                  ? 'drop-shadow(0 2px 10px rgba(212,175,55,0.6))'
                  : `drop-shadow(0 2px 8px ${currentStage.glow})`,
                transition: 'filter 1.2s ease',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />

            {/* Floating particles (count increases with stage) */}
            {PARTICLE_CONFIGS.slice(0, particleCount).map((p, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: p.left,
                  top: p.top,
                  width: 2 + (i % 3 === 0 ? 2 : i % 2),
                  height: 2 + (i % 3 === 0 ? 2 : i % 2),
                  borderRadius: '50%',
                  background: currentStage.particle,
                  opacity: 0,
                  '--tx': p.tx,
                  animation: `treeParticleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
                  transition: 'background 1.2s ease',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              />
            ))}

            {/* Stage-change burst overlay */}
            {treeTransition.showBurst && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center, ${currentStage.glowSoft} 0%, transparent 70%)`,
                  animation: 'treeStageBurst 0.55s ease-out forwards',
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              />
            )}
          </div>
        </div>

        {/* Stage name + LV badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            className="tree-stage-label"
            style={{
              fontSize: '0.78rem',
              fontWeight: 900,
              color: currentStage.cssColor,
              letterSpacing: '0.03em',
              transition: 'color 1s ease',
            }}
          >
            {currentStage.label}
          </span>
          <div
            className="tree-lv-badge"
            style={{
              fontSize: '0.58rem',
              fontWeight: 900,
              color: currentStage.cssColor,
              background: isGold
                ? 'rgba(212,175,55,0.14)'
                : 'var(--status-maxed-bg)',
              padding: '1px 8px',
              borderRadius: 10,
              letterSpacing: '0.05em',
              transition: 'color 1s ease',
            }}
          >
            LV.{treeLevel}
          </div>
        </div>

        {/* Bottom: info column */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            flex: 1,
            minHeight: 0,
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
                gap: 4,
                minWidth: 0,
              }}
            >
              <span
                className="tree-progress-label"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                次のバナコインまで
              </span>
              <span
                style={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}
              >
                {Math.round(progress)}%
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="バナコインまでの進捗"
                style={{
                  flex: 1,
                  height: 7,
                  background: 'var(--progress-bg)',
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
                      : `linear-gradient(90deg, ${currentStage.hex}, #a5d678)`,
                    borderRadius: 4,
                    transition:
                      'width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 1.2s ease',
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
              className="water-button"
              aria-label={`水やり +${waterBoostPercent}%、コスト: ${cost.toLocaleString()} バナナ`}
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
                  ? 'linear-gradient(135deg, var(--accent-gold-soft) 0%, var(--accent-gold) 100%)'
                  : 'var(--disabled-bg)',
                color: canAfford ? '#fff' : 'var(--disabled-text)',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: canAfford ? 'pointer' : 'not-allowed',
                boxShadow: canAfford
                  ? '0 3px 10px var(--accent-gold-glow)'
                  : 'none',
                transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
              onMouseEnter={(e) => {
                if (canAfford) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow =
                    '0 5px 14px rgba(212,175,55,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = canAfford
                  ? '0 3px 10px rgba(212,175,55,0.25)'
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
              <span className="water-button-label">水やり </span>+
              {waterBoostPercent}%
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

          {/* Tree skills section */}
          <div
            style={{
              width: '100%',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              paddingTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
            }}
          >
            {/* Stage progress dots */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              {Array.from({ length: 6 }, (_, i) => {
                const isDone = i < chosenSkills.length;
                const isPending = pendingChoice && i === chosenSkills.length;
                const dotColor = isDone
                  ? getSkillTheme(chosenSkills[i]).dot
                  : isPending
                    ? 'var(--pending-orange)'
                    : 'rgba(0,0,0,0.1)';
                return (
                  <div
                    key={i}
                    style={{
                      width: isDone ? 8 : isPending ? 9 : 5,
                      height: isDone ? 8 : isPending ? 9 : 5,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: dotColor,
                      boxShadow: isDone
                        ? `0 0 6px ${getSkillTheme(chosenSkills[i]).glow}`
                        : isPending
                          ? '0 0 6px rgba(255,152,0,0.6)'
                          : 'none',
                      transition: 'all 0.35s ease',
                      animation: isPending
                        ? 'skillPulse 1s ease-in-out infinite'
                        : undefined,
                    }}
                  />
                );
              })}
              {!pendingChoice && chosenSkills.length < 6 && (
                <span
                  style={{
                    marginLeft: 3,
                    fontSize: '0.42rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    opacity: 0.55,
                  }}
                >
                  LV.{(chosenSkills.length + 1) * 5}
                </span>
              )}
            </div>

            {/* Chosen skill badges */}
            {chosenSkills.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {chosenSkills.map((skill) => {
                  const theme = getSkillTheme(skill);
                  return (
                    <div
                      key={skill.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 7px',
                        borderRadius: 8,
                        background: theme.bg,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        {skill.icon}
                      </span>
                      <span
                        style={{
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          color: theme.text,
                          lineHeight: 1.3,
                        }}
                      >
                        {skill.description.replace(/\n/g, ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Skill unlock hint */}
            {!pendingChoice && chosenSkills.length === 0 && (
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  opacity: 0.5,
                  textAlign: 'center',
                }}
              >
                LV.5でスキル解放
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Skill choose panel ── */}
      {pendingChoice && (
        <div
          className="glass-panel skill-choose-panel"
          role="dialog"
          aria-label="スキル選択"
          style={{
            width: 192,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(255,152,0,0.25)',
            boxShadow:
              '0 8px 32px rgba(255,152,0,0.12), 0 2px 10px rgba(0,0,0,0.06)',
            animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
            pointerEvents: 'auto',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '7px 0',
              background:
                'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,183,77,0.15) 100%)',
              borderBottom: '1px solid rgba(255,152,0,0.15)',
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'var(--pending-orange-light)',
              }}
            />
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 800,
                color: 'var(--pending-orange-dark)',
                letterSpacing: '0.06em',
              }}
            >
              SKILL UNLOCKED
            </span>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'var(--pending-orange-light)',
              }}
            />
          </div>

          {/* Skill list */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pendingChoice.map((skill, idx) => {
              const theme = getSkillTheme(skill);
              const isLast = idx === pendingChoice.length - 1;
              return (
                <button
                  key={skill.id}
                  onClick={() => onChooseSkill(skill)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    border: 'none',
                    borderBottom: isLast
                      ? 'none'
                      : '1px solid rgba(0,0,0,0.04)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    animation: `slideInRight 0.3s ease both`,
                    animationDelay: `${idx * 0.06}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.bg;
                    e.currentTarget.style.paddingLeft = '16px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.paddingLeft = '12px';
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.2rem',
                      filter: `drop-shadow(0 2px 4px ${theme.glow})`,
                      flexShrink: 0,
                    }}
                  >
                    {skill.icon}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: theme.text,
                        lineHeight: 1.1,
                      }}
                    >
                      {skill.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.5rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        lineHeight: 1.25,
                        opacity: 0.8,
                      }}
                    >
                      {skill.description.replace(/\n/g, ' ')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
