import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Crown, Star } from 'lucide-react'
import { useI18n } from '../context/I18nContext'
import { useUser } from '../context/UserContext'
import { userAPI } from '../utils/api'

const LeaderboardPage = () => {
  const { t } = useI18n()
  const { balance } = useUser()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  useEffect(() => {
    loadLeaderboard()
  }, [selectedPeriod])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const data = await userAPI.getLeaderboard(selectedPeriod)
      setLeaderboard(data)
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-400" size={24} />
      case 2:
        return <Medal className="text-gray-300" size={24} />
      case 3:
        return <Medal className="text-yellow-600" size={24} />
      default:
        return <span className="text-white/60 font-bold">#{rank}</span>
    }
  }

  const getRankBackground = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-yellow-400/30'
      case 2:
        return 'bg-gradient-to-r from-gray-300/20 to-gray-500/20 border-gray-300/30'
      case 3:
        return 'bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 border-yellow-600/30'
      default:
        return 'bg-white/5 border-white/10'
    }
  }

  const periods = [
    { key: 'all', label: 'All Time' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' }
  ]

  return (
    <div className="min-h-screen star-bg">
      {/* Header */}
      <div className="p-4 pt-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="text-yellow-400" size={28} />
            <h1 className="text-2xl font-bold text-white">{t('leaderboard')}</h1>
          </div>
          <p className="text-white/60">Top miners in COSNO</p>
        </div>

        {/* Period Selector */}
        <div className="flex bg-white/10 rounded-lg p-1 mb-6">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === period.key
                  ? 'bg-cosno-primary text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Your Rank */}
        <div className="card-glass p-4 mb-6 border-cosno-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cosno-primary rounded-full flex items-center justify-center">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <p className="text-white font-semibold">You</p>
                <p className="text-white/60 text-sm">Your current rank</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-yellow-400 font-bold text-lg">
                {balance.toLocaleString()}
              </p>
              <p className="text-white/60 text-sm">Rank #4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="card-glass p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                  </div>
                  <div className="h-6 w-20 bg-white/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div
                key={player.id || index}
                className={`card-glass p-4 border ${getRankBackground(player.rank)}`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-12 h-12 flex items-center justify-center">
                    {getRankIcon(player.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-cosno-primary to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xl">{player.avatar || '👤'}</span>
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {player.username || `Player ${player.rank}`}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <span>Level {player.level || 1}</span>
                      {player.rank <= 3 && (
                        <Star className="text-yellow-400" size={12} />
                      )}
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold text-lg">
                      {player.balance?.toLocaleString() || '0'}
                    </p>
                    <p className="text-white/60 text-xs">coins</p>
                  </div>
                </div>

                {/* Special effects for top 3 */}
                {player.rank <= 3 && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-yellow-400 to-transparent rounded-r-xl" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && leaderboard.length >= 10 && (
          <button
            onClick={loadLeaderboard}
            className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            Load More
          </button>
        )}

        {/* Empty State */}
        {!loading && leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="text-white/30 mx-auto mb-4" size={48} />
            <p className="text-white/60">No data available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderboardPage