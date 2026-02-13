function ClickRipple({ effect }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: effect.x,
        top: effect.y,
        width: 50,
        height: 50,
        borderRadius: '50%',
        border: '3px solid rgba(255, 200, 0, 0.9)',
        pointerEvents: 'none',
        zIndex: 20,
        animation: 'ripple 0.6s ease-out forwards',
      }}
    />
  );
}

export default ClickRipple;
