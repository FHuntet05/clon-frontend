import React, { useState } from 'react'
import { Battery, Zap, Coins } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useTelegram } from '../context/TelegramContext'
import { useI18n } from '../context/I18nContext'

const MinePage = () => {
  const { t } = useI18n()
  const { hapticFeedback } = useTelegram()
  const {
    balance,
    energy,
    maxEnergy,
    miningRate,
    level,
    totalEarned,
    mineCoins
  } = useUser()

  const [clicks, setClicks] = useState([])
  const [animatingCoins, setAnimatingCoins] = useState([])

  const handleMineClick = (event) => {
    if (energy <= 0) {
      hapticFeedback('error')
      return
    }

    hapticFeedback('medium')
    mineCoins()

    // Create click animation
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newClick = {
      id: Date.now(),
      x,
      y,
      value: miningRate
    }

    setClicks(prev => [...prev, newClick])

    // Create floating coin animation
    const coinId = Date.now() + Math.random()
    setAnimatingCoins(prev => [...prev, {
      id: coinId,
      x: x,
      y: y,
      value: miningRate
    }])

    // Remove click animation after delay
    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== newClick.id))
    }, 1000)

    // Remove coin animation after delay
    setTimeout(() => {
      setAnimatingCoins(prev => prev.filter(coin => coin.id !== coinId))
    }, 2000)
  }

  const energyPercentage = (energy / maxEnergy) * 100

  return (
    <div className="min-h-screen star-bg flex flex-col">
      {/* Header Stats */}
      <div className="p-4 space-y-4">
        {/* Balance */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-1">
            <Coins size={24} />
            <span className="text-3xl font-bold">
              {balance.toLocaleString()}
            </span>
          </div>
          <p className="text-white/60 text-sm">
            Total Earned: {totalEarned.toLocaleString()}
          </p>
        </div>

        {/* Energy Bar */}
        <div className="card-glass p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Battery size={16} />
              <span className="text-sm font-medium">{t('energy')}</span>
            </div>
            <span className="text-white text-sm">
              {energy}/{maxEnergy}
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ease-out"
              style={{ width: `${energyPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-white/60 mt-1">
            <span>{t('energy_limit')}: {maxEnergy}</span>
            <span>Level {level}</span>
          </div>
        </div>

        {/* Mining Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card-glass p-3 text-center">
            <div className="text-cosno-primary text-xl font-bold">
              +{miningRate}
            </div>
            <div className="text-white/60 text-xs">
              {t('coins_per_tap')}
            </div>
          </div>

          <div className="card-glass p-3 text-center">
            <div className="text-green-400 text-xl font-bold">
              {Math.round(energy)} ⚡
            </div>
            <div className="text-white/60 text-xs">
              Available Energy
            </div>
          </div>
        </div>
      </div>

      {/* Main Mining Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Floating Coins */}
        {animatingCoins.map((coin) => (
          <div
            key={coin.id}
            className="absolute pointer-events-none z-20 animate-pulse"
            style={{
              left: coin.x,
              top: coin.y,
              animation: 'float-up 2s ease-out forwards'
            }}
          >
            <div className="bg-yellow-400 text-black rounded-full px-2 py-1 text-sm font-bold shadow-lg">
              +{coin.value}
            </div>
          </div>
        ))}

        {/* Click Effects */}
        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute pointer-events-none z-10"
            style={{
              left: click.x - 25,
              top: click.y - 25,
              animation: 'click-effect 1s ease-out forwards'
            }}
          >
            <div className="w-12 h-12 bg-cosno-primary rounded-full opacity-60" />
          </div>
        ))}

        {/* Main Coin */}
        <button
          onClick={handleMineClick}
          disabled={energy <= 0}
          className={`relative w-48 h-48 rounded-full transition-all duration-200 ${
            energy > 0
              ? 'hover:scale-105 active:scale-95 cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            background: 'radial-gradient(circle, #ffd700 0%, #ffb347 50%, #ff8c00 100%)',
            boxShadow: '0 0 50px rgba(255, 215, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.3)'
          }}
        >
          <div className="absolute inset-4 rounded-full bg-gradient-to-t from-yellow-600 to-yellow-300 flex items-center justify-center">
            <span className="text-4xl">🪙</span>
          </div>

          {/* Pulse effect when energy is full */}
          {energy === maxEnergy && (
            <div className="absolute inset-0 rounded-full animate-ping bg-yellow-400 opacity-20" />
          )}
        </button>

        {/* Mining Instructions */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/80 text-lg font-medium mb-2">
            {energy > 0 ? t('tap_to_mine') : 'Energy Depleted!'}
          </p>
          {energy <= 0 && (
            <p className="text-white/60 text-sm">
              Wait for energy to regenerate...
            </p>
          )}
        </div>
      </div>

      {/* Bottom Quick Stats */}
      <div className="p-4 pb-20">
        <div className="card-glass p-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-yellow-400 text-lg font-bold">
                {(balance / 1000).toFixed(1)}k
              </div>
              <div className="text-white/60 text-xs">Coins</div>
            </div>

            <div className="text-center">
              <div className="text-blue-400 text-lg font-bold">
                Lv.{level}
              </div>
              <div className="text-white/60 text-xs">Level</div>
            </div>

            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">
                x{miningRate}
              </div>
              <div className="text-white/60 text-xs">Per Tap</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }

        @keyframes click-effect {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default MinePage