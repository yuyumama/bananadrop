import { useState } from 'react';
import { BANANA_TIERS } from '../../data/constants/bananaTiers';
import { SHOP_ITEMS } from '../../data/shopItems';

function HoverButton({
  onClick,
  style,
  hoverShadowColor = '212,175,55',
  children,
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 4px 12px rgba(${hoverShadowColor},0.25)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.97)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
      }}
      style={{
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function GlassRow({ children, style }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1.5px dashed rgba(212,175,55,0.5)',
        borderRadius: 20,
        padding: '4px 8px',
        boxShadow: '0 2px 8px rgba(132,122,100,0.12)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SelectorButton({
  selected,
  accentColor = '212,175,55',
  onClick,
  icon,
  label,
}) {
  return (
    <HoverButton
      onClick={onClick}
      hoverShadowColor={accentColor}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        padding: '3px 4px',
        background: selected
          ? `rgba(${accentColor},0.3)`
          : 'rgba(255,255,255,0.85)',
        color: '#4a4a4a',
        fontWeight: 700,
        fontSize: '0.55rem',
        border: selected
          ? `1.5px solid rgba(${accentColor},0.7)`
          : '1.5px solid rgba(212,175,55,0.35)',
        borderRadius: 10,
        whiteSpace: 'nowrap',
        minWidth: 36,
      }}
    >
      {icon}
      <span>{label}</span>
    </HoverButton>
  );
}

const ADJUSTER_BUTTON_STYLE = {
  padding: '3px 8px',
  background: 'rgba(255,255,255,0.85)',
  color: '#4a4a4a',
  fontWeight: 700,
  fontSize: '0.68rem',
  border: '1px solid rgba(212,175,55,0.35)',
  borderRadius: 12,
  whiteSpace: 'nowrap',
};

const SCORE_STEPS = [
  { label: '-100,000', delta: -100000 },
  { label: '-10,000', delta: -10000 },
  { label: '-1,000', delta: -1000 },
  { label: '+1,000', delta: 1000 },
  { label: '+10,000', delta: 10000 },
  { label: '+100,000', delta: 100000 },
];

const COIN_STEPS = [
  { label: '-100', delta: -100 },
  { label: '-10', delta: -10 },
  { label: '+10', delta: 10 },
  { label: '+100', delta: 100 },
];

export default function DebugPanel({
  debugForcedBanana,
  onSelectForcedBanana,
  onAdjustScore,
  onAdjustCoins,
  onResetUpgrades,
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'auto',
      }}
    >
      {/* トグルボタン */}
      <div
        className="glass-panel"
        style={{
          padding: '4px 12px',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid var(--accent-gold-soft)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          e.currentTarget.style.borderColor = 'var(--accent-gold)';
          e.currentTarget.style.boxShadow =
            '0 12px 24px rgba(212, 175, 55, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.borderColor = 'var(--accent-gold-soft)';
          e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        🛠 Debug {expanded ? '▲' : '▼'}
      </div>

      {expanded && (
        <>
          {/* 行1: バナナスポーン種類セレクター */}
          <GlassRow
            style={{
              padding: '4px 6px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '90vw',
            }}
          >
            {/* OFF ボタン */}
            <SelectorButton
              selected={!debugForcedBanana}
              onClick={() => onSelectForcedBanana(null)}
              icon={
                <span
                  style={{
                    fontSize: '0.85rem',
                    display: 'block',
                    height: 20,
                    lineHeight: '20px',
                  }}
                >
                  🚫
                </span>
              }
              label="OFF"
            />

            {/* 通常バナナ12種 */}
            {BANANA_TIERS.map((tier) => (
              <SelectorButton
                key={`tier-${tier.tier}`}
                selected={
                  debugForcedBanana?.type === 'tier' &&
                  debugForcedBanana.tier.tier === tier.tier
                }
                onClick={() => onSelectForcedBanana({ type: 'tier', tier })}
                icon={
                  <img
                    src={`${import.meta.env.BASE_URL}${tier.icon}`}
                    alt={tier.name}
                    style={{ width: 20, height: 20, objectFit: 'contain' }}
                  />
                }
                label={tier.name}
              />
            ))}

            {/* スペシャルバナナ4種 */}
            {SHOP_ITEMS.map((item) => (
              <SelectorButton
                key={`special-${item.id}`}
                selected={
                  debugForcedBanana?.type === 'special' &&
                  debugForcedBanana.item.id === item.id
                }
                accentColor="255,140,0"
                onClick={() => onSelectForcedBanana({ type: 'special', item })}
                icon={
                  <img
                    src={`${import.meta.env.BASE_URL}${item.icon}`}
                    alt={item.label}
                    style={{ width: 20, height: 20, objectFit: 'contain' }}
                  />
                }
                label={item.label}
              />
            ))}
          </GlassRow>

          {/* 行2: スコア調整 */}
          <GlassRow>
            <span style={{ fontSize: '1rem', color: '#d4af37', lineHeight: 1 }}>
              🍌
            </span>
            {SCORE_STEPS.map(({ label, delta }) => (
              <HoverButton
                key={label}
                onClick={() => onAdjustScore(delta)}
                style={ADJUSTER_BUTTON_STYLE}
              >
                {label}
              </HoverButton>
            ))}
          </GlassRow>

          {/* 行3: バナコイン調整 + リセット */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <GlassRow>
              <img
                src={`${import.meta.env.BASE_URL}coin.png`}
                alt="バナコイン"
                style={{
                  width: 18,
                  height: 18,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 1px 3px rgba(212,175,55,0.5))',
                  flexShrink: 0,
                }}
              />
              {COIN_STEPS.map(({ label, delta }) => (
                <HoverButton
                  key={label}
                  onClick={() => onAdjustCoins(delta)}
                  style={ADJUSTER_BUTTON_STYLE}
                >
                  {label}
                </HoverButton>
              ))}
            </GlassRow>
            <GlassRow>
              <HoverButton
                onClick={() => onResetUpgrades?.()}
                style={ADJUSTER_BUTTON_STYLE}
              >
                🔄 リセット
              </HoverButton>
            </GlassRow>
          </div>
        </>
      )}
    </div>
  );
}
