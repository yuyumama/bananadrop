import BananaWorld from './components/BananaWorld'

function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Background Typography */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '20vw',
        fontWeight: '900',
        color: '#f0f0f0',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 0,
        whiteSpace: 'nowrap'
      }}>
        BANANA
      </div>

      <BananaWorld />
    </div>
  )
}

export default App
