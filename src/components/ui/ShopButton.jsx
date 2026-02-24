import { Store } from 'lucide-react';

export default function ShopButton({ seeds, onOpen }) {
  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 10,
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
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
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background:
            'linear-gradient(135deg, var(--accent-gold-soft) 0%, #fff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-gold)',
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8)',
        }}
      >
        <Store size={22} strokeWidth={2.5} />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Shop
        </span>
        <div
          style={{
            marginTop: 2,
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ opacity: 0.7 }}>✨</span>
          <span>{seeds} Seeds</span>
        </div>
      </div>
    </div>
  );
}
