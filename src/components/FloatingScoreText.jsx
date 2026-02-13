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
                  : '1.1rem',
        fontWeight: 'bold',
        color,
        pointerEvents: 'none',
        animation: 'floatUp 1.2s ease-out forwards',
        textShadow: '0 1px 4px rgba(255,255,255,0.9)',
        whiteSpace: 'nowrap',
      }}
    >
      +{text.value}🍌
    </div>
  );
}

export default FloatingScoreText;
