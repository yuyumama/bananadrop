const ITEM_COLORS = {
  banana_nui: { main: '255,140,0', light: '255,180,50' },
  banana_magic: { main: '168,85,247', light: '192,132,252' },
  banana_blackhole: { main: '59,130,246', light: '96,165,250' },
  banana_onekind: { main: '225,29,72', light: '251,113,133' },
};

const DEFAULT_COLOR = { main: '255,215,0', light: '255,170,0' };

function SpawnFlash({ flash }) {
  const color = ITEM_COLORS[flash.itemId] ?? DEFAULT_COLOR;
  const { main, light } = color;

  return (
    <>
      {/* 画面全体のフラッシュオーバーレイ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(circle at 50% 0%, rgba(${main},0.25) 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 19,
          animation: 'spawnFlashOverlay 0.8s ease-out forwards',
        }}
      />
      {/* 光の柱 */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 12,
          height: '100%',
          background: `linear-gradient(to bottom, rgba(${main},1), rgba(${main},0.8) 30%, rgba(${main},0.4) 60%, transparent)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'spawnFlashLine 0.9s ease-out forwards',
        }}
      />
      {/* 外側のぼやけた柱 */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 40,
          height: '100%',
          background: `linear-gradient(to bottom, rgba(${main},0.5), rgba(${main},0.3) 40%, transparent)`,
          pointerEvents: 'none',
          zIndex: 19,
          filter: 'blur(8px)',
          animation: 'spawnFlashLine 1.0s ease-out forwards',
        }}
      />
      {/* 中央グロー */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${main},0.9) 0%, rgba(${main},0.5) 30%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'spawnFlashGlow 1.0s ease-out forwards',
        }}
      />
      {/* リング1 */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: `4px solid rgba(${main},1)`,
          boxShadow: `0 0 20px rgba(${main},0.6), 0 0 40px rgba(${main},0.3)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'spawnFlashRing 0.9s ease-out forwards',
        }}
      />
      {/* リング2（遅延） */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 50,
          height: 50,
          borderRadius: '50%',
          border: `3px solid rgba(${light},0.9)`,
          boxShadow: `0 0 15px rgba(${light},0.5)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'spawnFlashRing 0.8s ease-out 0.1s forwards',
          opacity: 0,
        }}
      />
    </>
  );
}

export default SpawnFlash;
