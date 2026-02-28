const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: '0.6rem',
      fontWeight: 800,
      color: 'var(--text-muted)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: -2,
    }}
  >
    {children}
  </div>
);

function UnlockedBananaTiers({
  unlockedTiers,
  tierColors,
  nuiBananaCount,
  isFever,
  magicBananaCount,
  isAllGiant,
  blackholeBananaCount,
}) {
  const hasSpecial =
    nuiBananaCount > 0 || magicBananaCount > 0 || blackholeBananaCount > 0;

  return (
    <div
      className="banana-ui-block"
      style={{
        position: 'fixed',
        top: 110,
        right: 24,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        maxHeight: 'calc(100vh - 110px - 120px)',
      }}
    >
      {/* 特殊アイテムセクション（1体以上購入済みの場合のみ） */}
      {hasSpecial && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
          }}
        >
          <SectionLabel>Special</SectionLabel>
          {nuiBananaCount > 0 && (
            <div
              className="glass-panel"
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#ff8c00',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                userSelect: 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: '3px solid #ff8c00',
                background: isFever
                  ? 'rgba(255, 140, 0, 0.15)'
                  : 'rgba(255, 255, 255, 0.8)',
                boxShadow: isFever
                  ? '0 2px 12px rgba(255, 140, 0, 0.3)'
                  : '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}banana_nui.png`}
                alt="ぬいバナナ"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
              <span>ぬいバナナ</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#ff8c00',
                  marginLeft: 'auto',
                  paddingLeft: 8,
                  opacity: 0.8,
                }}
              >
                ×{nuiBananaCount}
              </span>
            </div>
          )}
          {magicBananaCount > 0 && (
            <div
              className="glass-panel"
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#9333ea',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                userSelect: 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: '3px solid #a855f7',
                background: isAllGiant
                  ? 'rgba(168, 85, 247, 0.15)'
                  : 'rgba(255, 255, 255, 0.8)',
                boxShadow: isAllGiant
                  ? '0 2px 12px rgba(168, 85, 247, 0.3)'
                  : '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}banana_magic.png`}
                alt="マジックバナナ"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
              <span>マジックバナナ</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#a855f7',
                  marginLeft: 'auto',
                  paddingLeft: 8,
                  opacity: 0.8,
                }}
              >
                ×{magicBananaCount}
              </span>
            </div>
          )}
          {blackholeBananaCount > 0 && (
            <div
              className="glass-panel"
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#1e3a5f',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                userSelect: 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: '3px solid #3b82f6',
                background: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}banana_blackhole.png`}
                alt="ブラックホールバナナ"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
              <span>ブラックホール</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#3b82f6',
                  marginLeft: 'auto',
                  paddingLeft: 8,
                  opacity: 0.8,
                }}
              >
                ×{blackholeBananaCount}
              </span>
            </div>
          )}
        </div>
      )}

      {/* バナナ種別セクション */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 110px - 120px)',
        }}
      >
        <SectionLabel>Bananas</SectionLabel>
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
            <span
              style={{
                fontSize: '0.65rem',
                opacity: 0.6,
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginLeft: 'auto',
                paddingLeft: 8,
              }}
            >
              {tier.score}pt
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UnlockedBananaTiers;
