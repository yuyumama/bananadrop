function UpgradeGroupCard({
  group,
  currentLabel,
  nextItem,
  affordable,
  onBuy,
}) {
  return (
    <div
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
          onClick={(event) => {
            event.stopPropagation();
            onBuy(nextItem);
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
}

export default UpgradeGroupCard;
