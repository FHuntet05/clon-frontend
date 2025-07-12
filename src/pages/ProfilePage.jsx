import React, { useState } from 'react'
import {
  User,
  Wallet,
  Settings,
  Globe,
  Copy,
  Plus,
  ExternalLink,
  Shield,
  LogOut,
  Star
} from 'lucide-react'
import { useI18n } from '../context/I18nContext'
import { useUser } from '../context/UserContext'
import { useTelegram } from '../context/TelegramContext'

const ProfilePage = () => {
  const { t, language, changeLanguage, availableLanguages } = useI18n()
  const {
    balance,
    totalEarned,
    level,
    wallet,
    generateWallet,
    userData
  } = useUser()
  const { user, hapticFeedback, showAlert, showConfirm } = useTelegram()

  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [generatingWallet, setGeneratingWallet] = useState('')

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      hapticFeedback('success')
      showAlert(t('copied'))
    } catch (error) {
      hapticFeedback('error')
    }
  }

  const handleGenerateWallet = async (network) => {
    const confirmed = await showConfirm(
      `Generate a ${network.toUpperCase()} deposit wallet?`
    )

    if (!confirmed) return

    setGeneratingWallet(network)
    try {
      await generateWallet(network)
      hapticFeedback('success')
      showAlert(`${network.toUpperCase()} wallet generated successfully!`)
    } catch (error) {
      hapticFeedback('error')
      showAlert('Failed to generate wallet')
    } finally {
      setGeneratingWallet('')
    }
  }

  const getLanguageName = (code) => {
    const names = { en: 'English', es: 'Español' }
    return names[code] || code
  }

  const formatAddress = (address) => {
    if (!address) return 'Not generated'
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  return (
    <div className="min-h-screen star-bg">
      {/* Header */}
      <div className="p-4 pt-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <User className="text-cosno-primary" size={28} />
            <h1 className="text-2xl font-bold text-white">{t('profile')}</h1>
          </div>
          <p className="text-white/60">Manage your account and settings</p>
        </div>

        {/* User Info Card */}
        <div className="card-glass p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cosno-primary to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">
                {user?.first_name?.charAt(0) || '👤'}
              </span>
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-white/60">@{user?.username || 'username'}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="text-yellow-400" size={16} />
                <span className="text-yellow-400 font-semibold">Level {level}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <div className="text-yellow-400 text-lg font-bold">
                {balance.toLocaleString()}
              </div>
              <div className="text-white/60 text-xs">Balance</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">
                {totalEarned.toLocaleString()}
              </div>
              <div className="text-white/60 text-xs">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-lg font-bold">
                {level}
              </div>
              <div className="text-white/60 text-xs">Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 pb-20 space-y-4">
        {/* Wallet Section */}
        <div className="card-glass p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Wallet className="text-green-400" size={20} />
            Crypto Wallets
          </h3>

          <div className="space-y-3">
            {/* TRON Wallet */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">TRX</span>
                  </div>
                  <span className="text-white font-medium">TRON</span>
                </div>
                {wallet.tron ? (
                  <button
                    onClick={() => copyToClipboard(wallet.tron.address)}
                    className="text-cosno-primary hover:text-purple-400"
                  >
                    <Copy size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleGenerateWallet('tron')}
                    disabled={generatingWallet === 'tron'}
                    className="bg-cosno-primary hover:bg-purple-600 px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    {generatingWallet === 'tron' ? 'Generating...' : 'Generate'}
                  </button>
                )}
              </div>
              <p className="text-white/60 text-sm">
                {wallet.tron ? formatAddress(wallet.tron.address) : 'No wallet generated'}
              </p>
              <p className="text-white/40 text-xs mt-1">
                {t('deposit_only')} - Do not send other tokens
              </p>
            </div>

            {/* BSC Wallet */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">BSC</span>
                  </div>
                  <span className="text-white font-medium">Binance Smart Chain</span>
                </div>
                {wallet.bsc ? (
                  <button
                    onClick={() => copyToClipboard(wallet.bsc.address)}
                    className="text-cosno-primary hover:text-purple-400"
                  >
                    <Copy size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleGenerateWallet('bsc')}
                    disabled={generatingWallet === 'bsc'}
                    className="bg-cosno-primary hover:bg-purple-600 px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    {generatingWallet === 'bsc' ? 'Generating...' : 'Generate'}
                  </button>
                )}
              </div>
              <p className="text-white/60 text-sm">
                {wallet.bsc ? formatAddress(wallet.bsc.address) : 'No wallet generated'}
              </p>
              <p className="text-white/40 text-xs mt-1">
                {t('deposit_only')} - Do not send other tokens
              </p>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="card-glass p-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Settings className="text-gray-400" size={20} />
            Settings
          </h3>

          <div className="space-y-3">
            {/* Language Setting */}
            <button
              onClick={() => setShowLanguageModal(true)}
              className="w-full flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-blue-400" />
                <div className="text-left">
                  <p className="text-white font-medium">Language</p>
                  <p className="text-white/60 text-sm">{getLanguageName(language)}</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-white/40" />
            </button>

            {/* Security */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-green-400" />
                <div>
                  <p className="text-white font-medium">Security</p>
                  <p className="text-white/60 text-sm">Telegram authenticated</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card-glass p-4">
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <ExternalLink size={20} className="text-blue-400" />
              <span className="text-white">About COSNO</span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <ExternalLink size={20} className="text-blue-400" />
              <span className="text-white">Support & Help</span>
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-white/40 text-sm">
          <p>COSNO v1.0.0</p>
          <p>Telegram MiniApp</p>
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-glass p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold mb-4">Select Language</h3>
            <div className="space-y-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    changeLanguage(lang)
                    setShowLanguageModal(false)
                    hapticFeedback('light')
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    language === lang
                      ? 'bg-cosno-primary text-white'
                      : 'bg-white/5 text-white/80 hover:bg-white/10'
                  }`}
                >
                  {getLanguageName(lang)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-4 p-3 bg-white/10 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage