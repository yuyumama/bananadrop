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

/**
 * Render a fixed-position UI block showing unlocked banana tiers and purchased special banana items.
 *
 * Renders a "Special" column when any special-item counts are greater than zero and always renders a
 * "Bananas" column listing each unlocked tier with its icon, name, and score. Visual styling (colors,
 * borders, hover/background states) is driven by the provided color arrays and boolean flags.
 *
 * @param {Object} props
 * @param {Array<{tier: number, name: string, icon: string, score: number}>} props.unlockedTiers - Array of unlocked tier objects; `tier` is 1-based and used to index `tierColors`.
 * @param {string[]} props.tierColors - Array of color strings indexed by `tier - 1` to style each tier row.
 * @param {number} props.nuiBananaCount - Count of "ぬいバナナ" special items.
 * @param {boolean} props.isFever - When true, applies fever visual styling to the nui item.
 * @param {number} props.magicBananaCount - Count of "マジックバナナ" special items.
 * @param {boolean} props.isAllGiant - When true, applies giant visual styling to the magic item.
 * @param {number} props.blackholeBananaCount - Count of "ブラックホール" special items.
 * @param {number} props.onekindBananaCount - Count of "oneバナナ" special items.
 * @param {boolean} props.isOneKind - When true, applies one-kind visual styling to the one-banana item.
 * @returns {JSX.Element} The rendered UI element containing special items (conditionally) and the list of unlocked banana tiers.
 */
function UnlockedBananaTiers({
  unlockedTiers,
  tierColors,
  nuiBananaCount,
  isFever,
  magicBananaCount,
  isAllGiant,
  blackholeBananaCount,
  onekindBananaCount,
  isOneKind,
}) {
  const hasSpecial =
    nuiBananaCount > 0 ||
    magicBananaCount > 0 ||
    blackholeBananaCount > 0 ||
    onekindBananaCount > 0;

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
                color: 'var(--special-nui)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                userSelect: 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: '3px solid var(--special-nui)',
                background: isFever
                  ? 'var(--special-nui-light)'
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
                  color: 'var(--special-nui)',
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
                color: 'var(--special-magic)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                userSelect: 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: '3px solid var(--special-magic-light)',
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
                  color: 'var(--special-magic-light)',
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
                color: 'var(--special-blackhole-dark)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                userSelect: 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: '3px solid var(--special-blackhole)',
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
                  color: 'var(--special-blackhole)',
                  marginLeft: 'auto',
                  paddingLeft: 8,
                  opacity: 0.8,
                }}
              >
                ×{blackholeBananaCount}
              </span>
            </div>
          )}
          {onekindBananaCount > 0 && (
            <div
              className="glass-panel"
              style={{
                padding: '6px 14px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--special-onekind)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                userSelect: 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: '3px solid var(--special-onekind)',
                background: isOneKind
                  ? 'rgba(225, 29, 72, 0.15)'
                  : 'rgba(255, 255, 255, 0.8)',
                boxShadow: isOneKind
                  ? '0 2px 12px rgba(225, 29, 72, 0.3)'
                  : '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}banana_onekind.png`}
                alt="oneバナナ"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
              <span>oneバナナ</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'var(--special-onekind)',
                  marginLeft: 'auto',
                  paddingLeft: 8,
                  opacity: 0.8,
                }}
              >
                ×{onekindBananaCount}
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
