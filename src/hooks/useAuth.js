import { useUser } from '../context/UserContext'
import { useTelegram } from '../context/TelegramContext'

export const useAuth = () => {
  const { isAuthenticated, loading } = useUser()
  const { user: telegramUser, isLoading: telegramLoading } = useTelegram()

  return {
    isAuthenticated: isAuthenticated && !!telegramUser,
    isLoading: loading || telegramLoading,
    user: telegramUser
  }
}
