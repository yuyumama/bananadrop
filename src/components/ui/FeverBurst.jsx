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
  const { main, light, outer } = color;

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
          border: `3px solid rgba(${main},0.9)`,
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
          border: `3px solid rgba(${light},0.9)`,
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
          border: `2px solid rgba(${outer},0.7)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'feverBurst 1.0s ease-out 0.04s forwards',
        }}
      />
    </>
  );
}

export default FeverBurst;
