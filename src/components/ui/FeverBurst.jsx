const ITEM_COLORS = {
  banana_nui: { main: '255,140,0', light: '255,215,0', outer: '255,107,53' },
  banana_magic: {
    main: '168,85,247',
    light: '192,132,252',
    outer: '236,72,153',
  },
  banana_blackhole: {
    main: '59,130,246',
    light: '96,165,250',
    outer: '6,182,212',
  },
  banana_onekind: {
    main: '225,29,72',
    light: '251,113,133',
    outer: '251,146,60',
  },
};

const DEFAULT_COLOR = {
  main: '255,140,0',
  light: '255,215,0',
  outer: '255,107,53',
};

function FeverBurst({ burst }) {
  const color = ITEM_COLORS[burst.itemId] ?? DEFAULT_COLOR;
  const { main, light } = color;

  return (
    <>
      {/* 着地点を中心とした画面グロー */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse at ${burst.x}px ${burst.y}px, rgba(${main},0.22) 0%, transparent 55%)`,
          pointerEvents: 'none',
          zIndex: 19,
          animation: 'impactOverlay 0.65s ease-out forwards',
        }}
      />

      {/* 中央フラッシュ（塗りつぶし） */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: `rgba(${light}, 1)`,
          boxShadow: `0 0 32px 10px rgba(${main},0.75)`,
          pointerEvents: 'none',
          zIndex: 22,
          animation: 'impactCore 0.5s ease-out forwards',
        }}
      />

      {/* 大きな衝撃波（塗りつぶし） */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: `rgba(${main}, 0.32)`,
          pointerEvents: 'none',
          zIndex: 21,
          animation:
            'impactShockwave 0.9s cubic-bezier(0.1, 0.6, 0.2, 1) forwards',
        }}
      />

      {/* リング1 */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: `3px solid rgba(${main},0.9)`,
          boxShadow: `0 0 12px rgba(${main},0.6)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'impactRing 0.75s ease-out forwards',
        }}
      />

      {/* リング2（遅延） */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid rgba(${light},0.75)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'impactRing 1.0s ease-out 0.07s forwards',
        }}
      />
    </>
  );
}

export default FeverBurst;
