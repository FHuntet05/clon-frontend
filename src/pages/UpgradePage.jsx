import React, { useState, useEffect } from 'react'
import { ArrowUp, Zap, Battery, Clock, Star, Lock } from 'lucide-react'
import { useI18n } from '../context/I18nContext'
import { useUser } from '../context/UserContext'
import { useTelegram } from '../context/TelegramContext'
import { upgradeAPI } from '../utils/api'

const UpgradePage = () => {
  const { t } = useI18n()
  const { hapticFeedback, showConfirm } = useTelegram()
  const { balance, dispatch } = useUser()
  const [upgrades, setUpgrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUpgrades()
  }, [])

  const loadUpgrades = async () => {
    try {
      const data = await upgradeAPI.getUpgrades()
      setUpgrades(data)
    } catch (error) {
      console.error('Failed to load upgrades:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseUpgrade = async (upgrade) => {
    if (balance < upgrade.cost) {
      hapticFeedback('error')
      return
    }

    const confirmed = await showConfirm(
      `Purchase ${upgrade.name} for ${upgrade.cost} coins?`
    )

    if (!confirmed) return

    try {
      hapticFeedback('success')

      // Update local state immediately for better UX
      dispatch({ type: 'UPDATE_BALANCE', payload: balance - upgrade.cost })

      // Update upgrade level locally
      setUpgrades(prev => prev.map(u =>
        u.id === upgrade.id
          ? { ...u, level: u.level + 1, cost: Math.floor(u.cost * 1.5) }
          : u
      ))

      // Call API to persist changes
      // await upgradeAPI.purchaseUpgrade(telegramUser.id, upgrade.id)

    } catch (error) {
      console.error('Failed to purchase upgrade:', error)
      // Revert changes on error
      dispatch({ type: 'UPDATE_BALANCE', payload: balance })
    }
  }

  const getUpgradeIcon = (name) => {
    const iconMap = {
      'Mining Power': Zap,
      'Energy Capacity': Battery,
      'Energy Regeneration': Clock,
      'Special Boost': Star
    }
    const Icon = iconMap[name] || ArrowUp
    return <Icon size={24} />
  }

  const getUpgradeColor = (name) => {
    const colorMap = {
      'Mining Power': 'text-yellow-400',
      'Energy Capacity': 'text-blue-400',
      'Energy Regeneration': 'text-green-400',
      'Special Boost': 'text-purple-400'
    }
    return colorMap[name] || 'text-white'
  }

  const canAfford = (cost) => balance >= cost

  return (
    <div className="min-h-screen star-bg">
      {/* Header */}
      <div className="p-4 pt-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ArrowUp className="text-green-400" size={28} />
            <h1 className="text-2xl font-bold text-white">{t('upgrade')}</h1>
          </div>
          <p className="text-white/60">Enhance your mining power</p>
        </div>

        {/* Balance Display */}
        <div className="card-glass p-4 mb-6 text-center">
          <div className="text-yellow-400 text-2xl font-bold mb-1">
            {balance.toLocaleString()}
          </div>
          <p className="text-white/60">Available Coins</p>
        </div>
      </div>

      {/* Upgrades List */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-glass p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                  </div>
                  <div className="h-10 w-24 bg-white/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {upgrades.map((upgrade) => {
              const affordable = canAfford(upgrade.cost)
              const isMaxLevel = upgrade.level >= 50 // Arbitrary max level

              return (
                <div
                  key={upgrade.id}
                  className={`card-glass p-4 border transition-all ${
                    affordable && !isMaxLevel
                      ? 'border-green-400/30 hover:border-green-400/50'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      affordable && !isMaxLevel
                        ? 'bg-green-400/20'
                        : 'bg-white/10'
                    }`}>
                      <div className={getUpgradeColor(upgrade.name)}>
                        {getUpgradeIcon(upgrade.name)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">
                          {upgrade.name}
                        </h3>
                        <span className="bg-cosno-primary/20 text-cosno-primary px-2 py-1 rounded text-xs">
                          Lv.{upgrade.level}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-2">
                        {upgrade.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-400">
                          {upgrade.benefit}
                        </span>
                        <span className="text-yellow-400">
                          Cost: {upgrade.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="text-right">
                      {isMaxLevel ? (
                        <div className="bg-gray-500/20 px-4 py-2 rounded-lg">
                          <span className="text-gray-400 text-sm">MAX</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePurchaseUpgrade(upgrade)}
                          disabled={!affordable}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            affordable
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-white/10 text-white/40 cursor-not-allowed'
                          }`}
                        >
                          {affordable ? (
                            <div className="flex items-center gap-1">
                              <ArrowUp size={16} />
                              <span>{t('upgrade_now')}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Lock size={16} />
                              <span>Locked</span>
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar for Next Level */}
                  {!isMaxLevel && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Progress to Level {upgrade.level + 1}</span>
                        <span>{Math.min(100, (balance / upgrade.cost) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (balance / upgrade.cost) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 card-glass p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            Upgrade Tips
          </h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>• Mining Power increases coins per tap</p>
            <p>• Energy Capacity allows longer mining sessions</p>
            <p>• Energy Regeneration reduces waiting time</p>
            <p>• Higher level upgrades cost more but give better benefits</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradePage