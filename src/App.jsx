import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { TelegramProvider } from './context/TelegramContext'
import { UserProvider } from './context/UserContext'
import { I18nProvider } from './context/I18nContext'
import { useAuth } from './hooks/useAuth'

// Pages
import LoginPage from './pages/LoginPage'
import MinePage from './pages/MinePage'
import LeaderboardPage from './pages/LeaderboardPage'
import UpgradePage from './pages/UpgradePage'
import TeamPage from './pages/TeamPage'
import ProfilePage from './pages/ProfilePage'

// Components
import TabBar from './components/TabBar'

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{
    background: 'linear-gradient(to bottom, #04041e, #062b67)'
  }}>
    <div className="text-center">
      <div style={{
        width: '64px',
        height: '64px',
        border: '3px solid #5556ec',
        borderTop: '3px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px'
      }}></div>
      <p style={{ color: 'white', fontSize: '18px' }}>Loading COSNO...</p>
    </div>
  </div>
)

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{
          background: 'linear-gradient(to bottom, #04041e, #062b67)'
        }}>
          <div className="text-center" style={{ color: 'white' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Something went wrong</h1>
            <p style={{ opacity: 0.7, marginBottom: '16px' }}>{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#5556ec',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(to bottom, #04041e, #062b67)',
      backgroundImage: 'url(https://ext.same-assets.com/3546354360/3218586608.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <main className="flex-1 pb-20">
        {children}
      </main>
      <TabBar />
    </div>
  )
}

// App Content Component (needs to be inside providers)
const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <MinePage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/mine" element={
          <ProtectedRoute>
            <AppLayout>
              <MinePage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <AppLayout>
              <LeaderboardPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/upgrade" element={
          <ProtectedRoute>
            <AppLayout>
              <UpgradePage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/team" element={
          <ProtectedRoute>
            <AppLayout>
              <TeamPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

// Main App Component with all providers
function App() {
  return (
    <ErrorBoundary>
      <TelegramProvider>
        <I18nProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </I18nProvider>
      </TelegramProvider>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ErrorBoundary>
  )
}

export default App