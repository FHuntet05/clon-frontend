import React, { useState } from 'react'
import { Globe } from 'lucide-react'
import { useI18n } from '../context/I18nContext'
import { useTelegram } from '../context/TelegramContext'

const LoginPage = () => {
  const { t, language, changeLanguage } = useI18n()
  const { user } = useTelegram()
  const [activeTab, setActiveTab] = useState('telegram')
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)

  // Auto-authenticate if user comes from Telegram
  React.useEffect(() => {
    if (user) {
      // This would trigger authentication automatically
      // For now, we'll just show the welcome message
    }
  }, [user])

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ]

  return (
    <div className="min-h-screen star-bg flex flex-col">
      {/* Top Language Selector */}
      <div className="flex justify-end p-4">
        <div className="relative">
          <button
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <Globe size={16} />
            <span>{language === 'en' ? 'English' : 'Español'}</span>
          </button>

          {showLanguageSelector && (
            <div className="absolute top-full right-0 mt-2 bg-cosno-dark/90 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden z-10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code)
                    setShowLanguageSelector(false)
                  }}
                  className="block w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cosno-primary to-purple-600 rounded-full flex items-center justify-center">
            <img
              src="https://ext.same-assets.com/3546354360/2597820790.svg"
              alt="COSNO Logo"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">COSNO</h1>
        </div>

        {/* Welcome Message for Telegram Users */}
        {user && (
          <div className="card-glass p-6 mb-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Welcome, {user.first_name}!
            </h2>
            <p className="text-white/70">
              You're logged in via Telegram. Tap to start mining!
            </p>
            <button className="btn-primary mt-4 w-full">
              Start Mining
            </button>
          </div>
        )}

        {/* Login Form (for non-Telegram users or demonstration) */}
        {!user && (
          <div className="w-full max-w-sm">
            {/* Tab Selector */}
            <div className="flex bg-white/10 rounded-lg p-1 mb-6">
              {['email', 'mobile', 'telegram'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-cosno-primary text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {t(tab)}
                </button>
              ))}
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <input
                type={activeTab === 'email' ? 'email' : 'text'}
                placeholder={
                  activeTab === 'email'
                    ? t('email')
                    : activeTab === 'mobile'
                    ? 'Mobile'
                    : 'Telegram'
                }
                className="input-field w-full"
              />

              <input
                type="password"
                placeholder={t('loginPassword')}
                className="input-field w-full"
              />

              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-cosno-primary"
                />
                <label htmlFor="remember" className="text-white/70">
                  {t('rememberMe')}
                </label>
              </div>

              <button className="btn-primary w-full">
                {t('login')}
              </button>

              <div className="text-center text-sm text-white/70">
                <span>{t('noAccount')} </span>
                <button className="text-cosno-primary hover:text-purple-400 transition-colors">
                  {t('register')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating coin indicator */}
      <div className="fixed bottom-20 right-4 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-2xl animate-bounce">
        🪙
      </div>
    </div>
  )
}

export default LoginPage
