import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const telegramInitData = window.Telegram?.WebApp?.initData
    if (telegramInitData) {
      config.headers['X-Telegram-Init-Data'] = telegramInitData
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error.response?.data || error.message)
  }
)

export const userAPI = {
  getOrCreateUser: async (telegramUser) => {
    try {
      const response = await api.post('/users/auth', {
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        languageCode: telegramUser.language_code
      })
      return response
    } catch (error) {
      // If backend is not available, return mock data
      return {
        id: telegramUser.id,
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        balance: 1000,
        energy: 100,
        maxEnergy: 100,
        miningRate: 1,
        level: 1,
        experience: 0,
        totalEarned: 1000,
        referralCode: `REF${telegramUser.id}`,
        wallet: {
          tron: null,
          bsc: null
        }
      }
    }
  },

  updateBalance: async (telegramId, balance) => {
    return await api.put(`/users/${telegramId}/balance`, { balance })
  },

  generateWallet: async (telegramId, network) => {
    try {
      return await api.post(`/wallets/generate`, {
        telegramId,
        network
      })
    } catch (error) {
      // Mock wallet generation for development
      const networks = {
        tron: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        bsc: '0x742d35Cc6634C0532925a3b8D1D8E8AC24C7b9C2'
      }
      return {
        address: networks[network] + Math.random().toString(36).substring(7),
        network,
        type: 'deposit-only'
      }
    }
  },

  getReferrals: async (telegramId) => {
    return await api.get(`/users/${telegramId}/referrals`)
  },

  getLeaderboard: async () => {
    try {
      return await api.get('/leaderboard')
    } catch (error) {
      // Mock leaderboard data
      return [
        { rank: 1, username: 'CryptoKing', balance: 50000, avatar: '👑' },
        { rank: 2, username: 'MinerPro', balance: 45000, avatar: '⛏️' },
        { rank: 3, username: 'CoinMaster', balance: 40000, avatar: '💰' },
        { rank: 4, username: 'You', balance: 1000, avatar: '🚀' }
      ]
    }
  }
}

export const upgradeAPI = {
  getUpgrades: async () => {
    try {
      return await api.get('/upgrades')
    } catch (error) {
      // Mock upgrades data
      return [
        {
          id: 1,
          name: 'Mining Power',
          description: 'Increase coins per tap',
          level: 1,
          cost: 100,
          benefit: '+1 coin per tap'
        },
        {
          id: 2,
          name: 'Energy Capacity',
          description: 'Increase maximum energy',
          level: 1,
          cost: 200,
          benefit: '+10 max energy'
        },
        {
          id: 3,
          name: 'Energy Regeneration',
          description: 'Faster energy recovery',
          level: 1,
          cost: 150,
          benefit: '+1 energy/2s'
        }
      ]
    }
  },

  purchaseUpgrade: async (telegramId, upgradeId) => {
    return await api.post('/upgrades/purchase', {
      telegramId,
      upgradeId
    })
  }
}

export default api