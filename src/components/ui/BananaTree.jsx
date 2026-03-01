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

// スキル種別ごとのカラーテーマ
const SKILL_TYPE_THEMES = {
  growthBonus: {
    bg: 'rgba(76,175,80,0.13)',
    border: 'rgba(76,175,80,0.45)',
    text: '#2e7d32',
    glow: 'rgba(76,175,80,0.35)',
    dot: '#4caf50',
    cardBg: 'linear-gradient(135deg, rgba(76,175,80,0.12) 0%, rgba(165,214,120,0.08) 100%)',
  },
  waterCostDiscount: {
    bg: 'rgba(0,188,212,0.12)',
    border: 'rgba(0,188,212,0.45)',
    text: '#006064',
    glow: 'rgba(0,188,212,0.35)',
    dot: '#00bcd4',
    cardBg: 'linear-gradient(135deg, rgba(0,188,212,0.12) 0%, rgba(100,220,240,0.08) 100%)',
  },
  waterBoost: {
    bg: 'rgba(30,136,229,0.12)',
    border: 'rgba(30,136,229,0.45)',
    text: '#1565c0',
    glow: 'rgba(30,136,229,0.35)',
    dot: '#1e88e5',
    cardBg: 'linear-gradient(135deg, rgba(30,136,229,0.12) 0%, rgba(100,181,246,0.08) 100%)',
  },
  coinsPerLevelUp: {
    bg: 'rgba(212,175,55,0.13)',
    border: 'rgba(212,175,55,0.5)',
    text: '#b8860b',
    glow: 'rgba(212,175,55,0.4)',
    dot: '#d4af37',
    cardBg: 'linear-gradient(135deg, rgba(212,175,55,0.13) 0%, rgba(255,230,100,0.08) 100%)',
  },
  mutationRateBonus: {
    bg: 'rgba(156,39,176,0.11)',
    border: 'rgba(156,39,176,0.42)',
    text: '#6a1b9a',
    glow: 'rgba(156,39,176,0.35)',
    dot: '#9c27b0',
    cardBg: 'linear-gradient(135deg, rgba(156,39,176,0.11) 0%, rgba(206,147,216,0.08) 100%)',
  },
  criticalClickChance: {
    bg: 'rgba(255,87,34,0.11)',
    border: 'rgba(255,87,34,0.42)',
    text: '#bf360c',
    glow: 'rgba(255,87,34,0.38)',
    dot: '#ff5722',
    cardBg: 'linear-gradient(135deg, rgba(255,87,34,0.11) 0%, rgba(255,171,145,0.08) 100%)',
  },
};

const FALLBACK_THEME = {
  bg: 'rgba(100,100,100,0.1)',
  border: 'rgba(100,100,100,0.3)',
  text: '#555',
  glow: 'rgba(100,100,100,0.25)',
  dot: '#aaa',
  cardBg: 'rgba(100,100,100,0.06)',
};

function getSkillTheme(skill) {
  const key = Object.keys(SKILL_TYPE_THEMES).find((k) => skill[k] != null);
  return key ? SKILL_TYPE_THEMES[key] : FALLBACK_THEME;
}

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

  const accentColor = isGold ? 'var(--accent-gold)' : '#4caf50';

  return (
    <>
      {/* ── メインパネル ── */}
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
              width: 140,
              height: 140,
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
                boxShadow: canAfford
                  ? '0 3px 10px rgba(30,136,229,0.3)'
                  : 'none',
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
                if (canAfford)
                  e.currentTarget.style.transform = 'scale(1.05)';
              }}
            >
              <Droplets
                size={14}
                fill={canAfford ? 'rgba(255,255,255,0.25)' : 'none'}
              />
              水やり +{waterBoostPercent}%
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
            }}
          >
            {/* ── ステージ進捗ドット ── */}
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
                    ? '#ff9800'
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

            {/* ── 選択済みスキル（カラーピルバッジ） ── */}
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
                        style={{ fontSize: '0.75rem', lineHeight: 1, flexShrink: 0 }}
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

            {/* ── スキル選択中（モダンデザイン） ── */}
            {pendingChoice && (
              <div
                style={{
                  width: '100%',
                  marginTop: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.4)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                {/* ヘッダー部分 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '5px 0',
                    background: 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(255,183,77,0.15) 100%)',
                    borderBottom: '1px solid rgba(255,152,0,0.15)',
                  }}
                >
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ffb74d' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#f57c00', letterSpacing: '0.06em' }}>SKILL UNLOCKED</span>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ffb74d' }} />
                </div>

                {/* リスト部分 */}
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
                          padding: '10px 10px',
                          border: 'none',
                          borderBottom: isLast ? 'none' : '1px solid rgba(0,0,0,0.04)',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = theme.bg;
                          e.currentTarget.style.paddingLeft = '14px';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.paddingLeft = '10px';
                        }}
                      >
                        <div style={{ fontSize: '1.2rem', filter: `drop-shadow(0 2px 4px ${theme.glow})`, flexShrink: 0 }}>
                          {skill.icon}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: theme.text, lineHeight: 1.1 }}>
                            {skill.name}
                          </span>
                          <span style={{ fontSize: '0.5rem', fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.25, opacity: 0.8 }}>
                            {skill.description.replace(/\n/g, ' ')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── スキル未解放ヒント ── */}
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


    </>
  );
}
