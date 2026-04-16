const BAR_HEIGHT = 5;
const LABEL_STACK_OFFSET = 26;

function EffectStatusBar({ effect, index }) {
  const {
    percent,
    remaining,
    name,
    ariaLabel,
    icon,
    barGradient,
    barShadow,
    labelBg,
    labelBorder,
    labelColor,
  } = effect;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: index * BAR_HEIGHT,
          left: 0,
          right: 0,
          height: BAR_HEIGHT,
          zIndex: 200,
          background: 'rgba(0,0,0,0.06)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: barGradient,
            backgroundSize: '200% 100%',
            boxShadow: barShadow,
            borderRadius: '0 3px 3px 0',
            transition: 'width 0.5s linear',
            animation: 'feverBarShimmer 2s linear infinite',
          }}
        />
      </div>
      <div
        className="effect-status-label"
        role="status"
        aria-label={ariaLabel}
        style={{
          position: 'fixed',
          top: 10 + index * LABEL_STACK_OFFSET,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 201,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: labelBg,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: labelBorder,
          borderRadius: 20,
          padding: '4px 14px',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: labelColor,
          whiteSpace: 'nowrap',
          letterSpacing: '0.04em',
        }}
      >
        <span style={{ fontSize: '0.85rem' }} aria-hidden="true">
          {icon}
        </span>
        <span>{name}</span>
        <span
          style={{
            opacity: 0.65,
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {remaining}s
        </span>
      </div>
    </>
  );
}

const remainingSeconds = (endTime) =>
  Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

const remainingPercent = (endTime, duration) =>
  duration > 0
    ? Math.max(
        0,
        Math.min(100, ((endTime - Date.now()) / (duration * 1000)) * 100),
      )
    : 0;

function ActiveEffectStatusBars({
  isFever,
  feverEndTime,
  feverDuration,
  isAllGiant,
  allGiantEndTime,
  allGiantDuration,
  isOneKind,
  oneKindEndTime,
  oneKindDuration,
}) {
  const feverRemaining = remainingSeconds(feverEndTime);
  const allGiantRemaining = remainingSeconds(allGiantEndTime);
  const oneKindRemaining = remainingSeconds(oneKindEndTime);

  const effects = [
    isFever && {
      key: 'fever',
      name: 'ぬいバナナ',
      ariaLabel: `ぬいバナナフィーバー 残り${feverRemaining}秒`,
      icon: '🔥',
      remaining: feverRemaining,
      percent: remainingPercent(feverEndTime, feverDuration),
      barGradient: 'linear-gradient(90deg, #ff6b35, #ffd700, #ff9f00)',
      barShadow: '0 0 12px rgba(255,107,53,0.8), 0 0 4px rgba(255,215,0,0.6)',
      labelBg: 'rgba(255, 100, 30, 0.12)',
      labelBorder: '1px solid rgba(255,107,53,0.3)',
      labelColor: '#e85d00',
    },
    isAllGiant && {
      key: 'allGiant',
      name: 'マジックバナナ',
      ariaLabel: `マジックバナナ 残り${allGiantRemaining}秒`,
      icon: '✨',
      remaining: allGiantRemaining,
      percent: remainingPercent(allGiantEndTime, allGiantDuration),
      barGradient: 'linear-gradient(90deg, #a855f7, #ec4899, #a855f7)',
      barShadow: '0 0 12px rgba(168,85,247,0.8), 0 0 4px rgba(236,72,153,0.6)',
      labelBg: 'rgba(168, 85, 247, 0.12)',
      labelBorder: '1px solid rgba(168,85,247,0.3)',
      labelColor: 'var(--special-magic)',
    },
    isOneKind && {
      key: 'oneKind',
      name: 'oneバナナ',
      ariaLabel: `oneバナナ 残り${oneKindRemaining}秒`,
      icon: '🍌',
      remaining: oneKindRemaining,
      percent: remainingPercent(oneKindEndTime, oneKindDuration),
      barGradient: 'linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4)',
      barShadow: '0 0 12px rgba(6,182,212,0.8), 0 0 4px rgba(59,130,246,0.6)',
      labelBg: 'rgba(6, 182, 212, 0.12)',
      labelBorder: '1px solid rgba(6,182,212,0.3)',
      labelColor: '#0891b2',
    },
  ].filter(Boolean);

  return effects.map((effect, index) => (
    <EffectStatusBar key={effect.key} effect={effect} index={index} />
  ));
}

export default ActiveEffectStatusBars;
