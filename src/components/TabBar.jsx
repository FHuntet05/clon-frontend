import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Pickaxe,
  Trophy,
  ArrowUp,
  Users,
  User
} from 'lucide-react'
import { useI18n } from '../context/I18nContext'
import { useTelegram } from '../context/TelegramContext'

const TabBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { hapticFeedback } = useTelegram()

  const tabs = [
    {
      path: '/mine',
      icon: Pickaxe,
      label: t('mine')
    },
    {
      path: '/leaderboard',
      icon: Trophy,
      label: t('leaderboard')
    },
    {
      path: '/upgrade',
      icon: ArrowUp,
      label: t('upgrade')
    },
    {
      path: '/team',
      icon: Users,
      label: t('team')
    },
    {
      path: '/profile',
      icon: User,
      label: t('profile')
    }
  ]

  const handleTabClick = (path) => {
    hapticFeedback('light')
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cosno-dark/90 backdrop-blur-sm border-t border-white/10">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path

          return (
            <button
              key={path}
              onClick={() => handleTabClick(path)}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-all duration-200 ${
                isActive
                  ? 'text-cosno-primary scale-110'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Icon
                size={20}
                className={`mb-1 ${isActive ? 'drop-shadow-lg' : ''}`}
              />
              <span className="text-xs font-medium truncate">
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabBar