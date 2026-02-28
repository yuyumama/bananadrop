function SpawnFlash({ flash }) {
  return (
    <>
      {/* 画面全体のフラッシュオーバーレイ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 0%, rgba(255,215,0,0.25) 0%, transparent 60%)',
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
          background:
            'linear-gradient(to bottom, rgba(255,215,0,1), rgba(255,140,0,0.8) 30%, rgba(255,107,53,0.4) 60%, transparent)',
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
          background:
            'linear-gradient(to bottom, rgba(255,215,0,0.5), rgba(255,140,0,0.3) 40%, transparent)',
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
          background:
            'radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,140,0,0.5) 30%, transparent 70%)',
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
          border: '4px solid rgba(255,215,0,1)',
          boxShadow:
            '0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,140,0,0.3)',
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
          border: '3px solid rgba(255,170,0,0.9)',
          boxShadow: '0 0 15px rgba(255,170,0,0.5)',
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
