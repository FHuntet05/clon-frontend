import React from 'react'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1a202c 0%, #2d3748 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>COSNO</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Telegram Mining Game</p>

      <button
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
          border: 'none',
          fontSize: '4rem',
          cursor: 'pointer',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
        onClick={() => alert('Mining works!')}
      >
        🪙
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>1,000</div>
          <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Coins</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>100/100</div>
          <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Energy</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34d399' }}>Lv.1</div>
          <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Level</div>
        </div>
      </div>
    </div>
  )
}

export default App