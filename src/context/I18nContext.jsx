import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTelegram } from './TelegramContext'

const I18nContext = createContext({})

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

const translations = {
  en: {
    // Navigation
    mine: 'Mine',
    leaderboard: 'Leaderboard',
    upgrade: 'Upgrade',
    team: 'Team',
    profile: 'Me',

    // Login
    login: 'Login',
    email: 'Email',
    mobile: 'Mobile',
    telegram: 'Telegram',
    loginPassword: 'Login password',
    rememberMe: 'Remember Me',
    noAccount: 'No account?',
    register: 'Register',

    // Mining
    balance: 'Balance',
    energy: 'Energy',
    tap_to_mine: 'Tap to Mine',
    coins_per_tap: 'Coins per tap',
    energy_limit: 'Energy limit',

    // Upgrades
    mining_power: 'Mining Power',
    energy_capacity: 'Energy Capacity',
    energy_regen: 'Energy Regeneration',
    upgrade_cost: 'Upgrade Cost',
    upgrade_now: 'Upgrade Now',

    // Team/Referrals
    invite_friends: 'Invite Friends',
    referral_code: 'Referral Code',
    total_referrals: 'Total Referrals',
    referral_earnings: 'Referral Earnings',

    // Wallet
    generate_wallet: 'Generate Wallet',
    wallet_address: 'Wallet Address',
    deposit_only: 'Deposit Only',

    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    copy: 'Copy',
    copied: 'Copied!',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  es: {
    // Navigation
    mine: 'Minar',
    leaderboard: 'Clasificación',
    upgrade: 'Mejorar',
    team: 'Equipo',
    profile: 'Perfil',

    // Login
    login: 'Iniciar Sesión',
    email: 'Correo',
    mobile: 'Móvil',
    telegram: 'Telegram',
    loginPassword: 'Contraseña',
    rememberMe: 'Recordarme',
    noAccount: '¿No tienes cuenta?',
    register: 'Registrarse',

    // Mining
    balance: 'Saldo',
    energy: 'Energía',
    tap_to_mine: 'Toca para Minar',
    coins_per_tap: 'Monedas por toque',
    energy_limit: 'Límite de energía',

    // Upgrades
    mining_power: 'Poder de Minería',
    energy_capacity: 'Capacidad de Energía',
    energy_regen: 'Regeneración de Energía',
    upgrade_cost: 'Costo de Mejora',
    upgrade_now: 'Mejorar Ahora',

    // Team/Referrals
    invite_friends: 'Invitar Amigos',
    referral_code: 'Código de Referido',
    total_referrals: 'Total de Referidos',
    referral_earnings: 'Ganancias por Referidos',

    // Wallet
    generate_wallet: 'Generar Wallet',
    wallet_address: 'Dirección de Wallet',
    deposit_only: 'Solo Depósito',

    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    copy: 'Copiar',
    copied: '¡Copiado!',
    cancel: 'Cancelar',
    confirm: 'Confirmar'
  }
}

export const I18nProvider = ({ children }) => {
  const { user } = useTelegram()
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    // Set language based on Telegram user language or default to English
    const telegramLang = user?.language_code
    if (telegramLang && translations[telegramLang]) {
      setLanguage(telegramLang)
    } else if (telegramLang?.startsWith('es')) {
      setLanguage('es')
    }
  }, [user])

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
      localStorage.setItem('language', lang)
    }
  }

  const value = {
    language,
    t,
    changeLanguage,
    availableLanguages: Object.keys(translations)
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}
