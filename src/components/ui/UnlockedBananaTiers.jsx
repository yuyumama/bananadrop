function UnlockedBananaTiers({ unlockedTiers, tierColors }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 110,
        right: 24,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
        maxWidth: '300px', // 横に広がりすぎないように制限
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
          alignSelf: 'flex-end',
        }}
      >
        Collection
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          alignItems: 'flex-end'
        }}
      >
        {unlockedTiers.map((tier) => (
          <div
            key={tier.tier}
            className="glass-panel"
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: tierColors[tier.tier - 1],
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              userSelect: 'none',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              borderLeft: `3px solid ${tierColors[tier.tier - 1]}`,
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
              e.currentTarget.style.background = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}${tier.icon}`}
              alt={tier.name}
              style={{ width: 24, height: 24, objectFit: 'contain' }}
            />
            <span>{tier.name}</span>
            <span style={{
              fontSize: '0.65rem',
              opacity: 0.6,
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginLeft: 'auto',
              paddingLeft: 8
            }}>
              {tier.score}pt
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UnlockedBananaTiers;
