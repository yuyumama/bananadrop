function UnlockedBananaTiers({ unlockedTiers, tierColors }) {
  return (
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
      {unlockedTiers.map((tier) => (
        <div
          key={tier.tier}
          style={{
            background: 'rgba(255,255,255,0.88)',
            borderRadius: 10,
            padding: '5px 9px',
            fontSize: '0.72rem',
            fontWeight: 'bold',
            color: tierColors[tier.tier - 1],
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            userSelect: 'none',
          }}
        >
          {tier.name}
          <br />
          <span style={{ fontSize: '0.65rem' }}>+{tier.score}pt</span>
        </div>
      ))}
    </div>
  );
}

export default UnlockedBananaTiers;
