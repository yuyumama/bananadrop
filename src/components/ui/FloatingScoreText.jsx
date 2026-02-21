function FloatingScoreText({ text, color }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: text.x,
        bottom: 100,
        zIndex: 20,
        fontSize:
          text.value >= 500
            ? '2.5rem'
            : text.value >= 100
              ? '2.2rem'
              : text.value >= 30
                ? '1.8rem'
                : text.value >= 12
                  ? '1.4rem'
                  : '1.2rem',
        fontWeight: 800,
        fontFamily: '"Outfit", sans-serif',
        color,
        pointerEvents: 'none',
        animation: 'floatUpFade 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        textShadow:
          '0 2px 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          fontSize: '0.8em',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        }}
      >
        🍌
      </span>
      <span>+{text.value}</span>
    </div>
  );
}

export default FloatingScoreText;
