function FloatingCoinList({ coins }) {
  return coins.map((coin) => (
    <div
      key={coin.id}
      style={{
        position: 'fixed',
        left: coin.x,
        bottom: 120,
        transform: 'translateX(-50%)',
        zIndex: 20,
        fontSize: '1.6rem',
        fontWeight: 900,
        fontFamily: '"Outfit", sans-serif',
        color: 'var(--accent-gold)',
        pointerEvents: 'none',
        animation: 'floatUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        willChange: 'transform, opacity',
        contain: 'layout style',
        textShadow:
          '0 2px 10px rgba(255,215,0,0.6), 0 0 20px rgba(255,215,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}coin.png`}
        alt="coin"
        style={{
          width: 28,
          height: 28,
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 6px rgba(212,175,55,0.6))',
        }}
      />
      <span>+1</span>
    </div>
  ));
}

export default FloatingCoinList;
