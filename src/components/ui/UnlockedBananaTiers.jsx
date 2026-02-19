function UnlockedBananaTiers({ unlockedTiers, tierColors }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: '0.65rem',
          fontWeight: 800,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: -4,
        }}
      >
        Collection
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {unlockedTiers.map((tier) => (
          <div
            key={tier.tier}
            className="glass-panel"
            style={{
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: tierColors[tier.tier - 1],
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              userSelect: 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            <span>{tier.name}</span>
            <span style={{ opacity: 0.5, fontWeight: 500, color: 'var(--text-muted)' }}>
              {tier.score}pt
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UnlockedBananaTiers;
