import React from 'react'

const LoginPage = () => {
  const handleLogin = () => {
    // Simular login exitoso
    localStorage.setItem('cosno-auth', 'true')
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(to bottom, #04041e, #062b67)',
      backgroundImage: 'url(https://ext.same-assets.com/3546354360/3772941444.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="text-center">
        <div className="mb-8">
          <img
            src="https://ext.same-assets.com/3546354360/1143302676.svg"
            alt="COSNO"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white">COSNO</h1>
        </div>

        <button
          onClick={handleLogin}
          className="px-8 py-3 text-white font-semibold rounded-lg transition-all duration-200 hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #5556ec 0%, #7b6cf7 100%)',
            boxShadow: '0 4px 15px rgba(85, 86, 236, 0.3)'
          }}
        >
          Start Mining
        </button>

        <p className="text-white/60 text-sm mt-4">Click to enter COSNO</p>
      </div>
    </div>
  )
}

export default LoginPage
