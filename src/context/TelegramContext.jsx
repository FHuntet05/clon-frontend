import React, { createContext, useContext, useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

const TelegramContext = createContext({})

export const useTelegram = () => {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (WebApp?.initDataUnsafe?.user) {
      setUser(WebApp.initDataUnsafe.user)
    } else {
      // For development/testing purposes
      setUser({
        id: 12345678,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        language_code: 'en'
      })
    }
    setIsLoading(false)
  }, [])

  const hapticFeedback = (type = 'light') => {
    if (WebApp?.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred(type)
    }
  }

  const showAlert = (message) => {
    if (WebApp?.showAlert) {
      WebApp.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message) => {
    return new Promise((resolve) => {
      if (WebApp?.showConfirm) {
        WebApp.showConfirm(message, resolve)
      } else {
        resolve(confirm(message))
      }
    })
  }

  const value = {
    user,
    isLoading,
    WebApp,
    hapticFeedback,
    showAlert,
    showConfirm,
    initData: WebApp?.initData,
    colorScheme: WebApp?.colorScheme || 'dark',
    themeParams: WebApp?.themeParams
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}
