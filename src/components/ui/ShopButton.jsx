import { Store } from 'lucide-react';

export default function ShopButton({ banaCoins, onOpen }) {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 10,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1px solid var(--accent-gold-soft)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--accent-gold)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(212, 175, 55, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.borderColor = 'var(--accent-gold-soft)';
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
      }}
      onClick={onOpen}
    >
      {/* コインアイコン（大） */}
      <img
        src={`${import.meta.env.BASE_URL}coin.png`}
        alt="バナコイン"
        style={{
          width: 40,
          height: 40,
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 6px rgba(212,175,55,0.5))',
          flexShrink: 0,
        }}
      />

      {/* バナコイン残高 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <span
          style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          バナコイン
        </span>
        <span
          style={{
            fontSize: '1.3rem',
            fontWeight: 900,
            color: 'var(--accent-gold)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {banaCoins.toLocaleString()}
        </span>
      </div>

      {/* 区切り */}
      <div
        style={{
          width: 1,
          height: 32,
          background: 'rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}
      />

      {/* ショップアイコン */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          color: 'var(--text-muted)',
          flexShrink: 0,
        }}
      >
        <Store size={18} strokeWidth={2} />
        <span
          style={{
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Shop
        </span>
      </div>
    </div>
  );
}
