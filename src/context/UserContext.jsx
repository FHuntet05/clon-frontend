import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useTelegram } from './TelegramContext'
import { userAPI } from '../utils/api'

const UserContext = createContext({})

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

const initialState = {
  isAuthenticated: false,
  userData: null,
  balance: 0,
  energy: 100,
  maxEnergy: 100,
  miningRate: 1,
  level: 1,
  experience: 0,
  totalEarned: 0,
  referrals: [],
  referralCode: '',
  wallet: {
    tron: null,
    bsc: null
  },
  upgrades: [],
  tasks: [],
  loading: false,
  error: null
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      }

    case 'UPDATE_BALANCE':
      return { ...state, balance: action.payload }

    case 'UPDATE_ENERGY':
      return { ...state, energy: action.payload }

    case 'MINE_COINS': {
      const energyCost = action.payload.cost || 1
      const coinsEarned = action.payload.amount || state.miningRate

      if (state.energy >= energyCost) {
        return {
          ...state,
          balance: state.balance + coinsEarned,
          energy: Math.max(0, state.energy - energyCost),
          totalEarned: state.totalEarned + coinsEarned
        }
      }
      return state
    }

    case 'SET_WALLET':
      return {
        ...state,
        wallet: { ...state.wallet, ...action.payload }
      }

    case 'UPDATE_UPGRADES':
      return { ...state, upgrades: action.payload }

    case 'LEVEL_UP':
      return {
        ...state,
        level: state.level + 1,
        maxEnergy: state.maxEnergy + 10,
        miningRate: state.miningRate + 0.5
      }

    default:
      return state
  }
}

export const UserProvider = ({ children }) => {
  const { user: telegramUser } = useTelegram()
  const [state, dispatch] = useReducer(userReducer, initialState)

  useEffect(() => {
    if (telegramUser) {
      initializeUser()
    }
  }, [telegramUser, initializeUser])

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: 'UPDATE_ENERGY',
        payload: Math.min(state.maxEnergy, state.energy + 1)
      })
    }, 3000) // 1 energy per 3 seconds

    return () => clearInterval(interval)
  }, [state.energy, state.maxEnergy])

  const initializeUser = useCallback(async () => {
    if (!telegramUser) return

    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      // Get or create user data
      const userData = await userAPI.getOrCreateUser(telegramUser)
      dispatch({ type: 'SET_USER_DATA', payload: userData })
    } catch (error) {
      console.error('Failed to initialize user:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }, [telegramUser])

  const mineCoins = (amount = state.miningRate, energyCost = 1) => {
    dispatch({
      type: 'MINE_COINS',
      payload: { amount, cost: energyCost }
    })
  }

  const generateWallet = async (network) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const walletData = await userAPI.generateWallet(telegramUser.id, network)
      dispatch({
        type: 'SET_WALLET',
        payload: { [network]: walletData }
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const value = {
    ...state,
    dispatch,
    mineCoins,
    generateWallet,
    initializeUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}