function FeverBurst({ burst }) {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '3px solid rgba(255, 140, 0, 0.9)',
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'feverBurst 0.8s ease-out forwards',
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid rgba(255, 215, 0, 0.9)',
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'feverBurst 0.65s ease-out 0.08s forwards',
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '2px solid rgba(255, 107, 53, 0.7)',
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'feverBurst 1.0s ease-out 0.04s forwards',
        }}
      />
    </>
  );
}

export default FeverBurst;
