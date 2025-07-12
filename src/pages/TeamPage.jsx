import React, { useState, useEffect } from 'react'
import { Users, Share, Copy, Gift, Star, UserPlus, ExternalLink } from 'lucide-react'
import { useI18n } from '../context/I18nContext'
import { useUser } from '../context/UserContext'
import { useTelegram } from '../context/TelegramContext'
import { userAPI } from '../utils/api'

const TeamPage = () => {
  const { t } = useI18n()
  const { hapticFeedback, showAlert } = useTelegram()
  const { referralCode, balance } = useUser()
  const [referrals, setReferrals] = useState([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [loading, setLoading] = useState(true)

  const inviteLink = `https://t.me/cosno_bot?start=${referralCode}`

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = async () => {
    try {
      const data = await userAPI.getReferrals()
      setReferrals(data.referrals || [])
      setTotalEarnings(data.totalEarnings || 0)
    } catch (error) {
      console.error('Failed to load referrals:', error)
      // Mock data for development
      setReferrals([
        { id: 1, username: 'CryptoFan', joinedAt: '2024-01-15', earnings: 500, level: 2 },
        { id: 2, username: 'MiningPro', joinedAt: '2024-01-20', earnings: 300, level: 1 },
        { id: 3, username: 'TokenHunter', joinedAt: '2024-01-25', earnings: 750, level: 3 }
      ])
      setTotalEarnings(1550)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      hapticFeedback('success')
      showAlert(t('copied'))
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      hapticFeedback('success')
      showAlert(t('copied'))
    }
  }

  const shareInviteLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join COSNO Mining!',
        text: 'Start mining coins with me in COSNO! 🚀',
        url: inviteLink
      })
    } else {
      copyToClipboard(inviteLink)
    }
    hapticFeedback('medium')
  }

  const getReferralReward = (level) => {
    const rewards = {
      1: 50,   // 5% of their earnings
      2: 25,   // 2.5% of their earnings
      3: 10    // 1% of their earnings
    }
    return rewards[level] || 10
  }

  return (
    <div className="min-h-screen star-bg">
      {/* Header */}
      <div className="p-4 pt-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="text-blue-400" size={28} />
            <h1 className="text-2xl font-bold text-white">{t('team')}</h1>
          </div>
          <p className="text-white/60">Invite friends and earn together</p>
        </div>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card-glass p-4 text-center">
            <div className="text-blue-400 text-2xl font-bold mb-1">
              {referrals.length}
            </div>
            <p className="text-white/60 text-sm">{t('total_referrals')}</p>
          </div>

          <div className="card-glass p-4 text-center">
            <div className="text-green-400 text-2xl font-bold mb-1">
              {totalEarnings.toLocaleString()}
            </div>
            <p className="text-white/60 text-sm">{t('referral_earnings')}</p>
          </div>
        </div>

        {/* Invite Section */}
        <div className="card-glass p-4 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Gift className="text-yellow-400" size={20} />
            {t('invite_friends')}
          </h3>

          <div className="space-y-3">
            {/* Referral Code */}
            <div>
              <label className="text-white/60 text-sm block mb-1">
                {t('referral_code')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={referralCode || 'REF123456'}
                  readOnly
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                />
                <button
                  onClick={() => copyToClipboard(referralCode || 'REF123456')}
                  className="bg-cosno-primary hover:bg-purple-600 px-3 py-2 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Invite Link */}
            <div>
              <label className="text-white/60 text-sm block mb-1">
                Invite Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(inviteLink)}
                  className="bg-cosno-primary hover:bg-purple-600 px-3 py-2 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={shareInviteLink}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              <Share size={18} />
              Share Invite Link
            </button>
          </div>
        </div>

        {/* Referral Benefits */}
        <div className="card-glass p-4 mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            Referral Benefits
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/80">
              <span>Level 1 Friends:</span>
              <span className="text-green-400">5% of their earnings</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Level 2 Friends:</span>
              <span className="text-green-400">2.5% of their earnings</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Level 3 Friends:</span>
              <span className="text-green-400">1% of their earnings</span>
            </div>
            <div className="flex justify-between text-white/80 border-t border-white/10 pt-2 mt-2">
              <span>Joining Bonus:</span>
              <span className="text-yellow-400">+1000 coins each</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div className="px-4 pb-20">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <UserPlus size={20} />
          Your Team ({referrals.length})
        </h3>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-glass p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded w-2/3" />
                  </div>
                  <div className="h-6 w-16 bg-white/20 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : referrals.length > 0 ? (
          <div className="space-y-3">
            {referrals.map((referral, index) => (
              <div key={referral.id} className="card-glass p-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-cosno-primary to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {referral.username?.charAt(0) || '?'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">
                        {referral.username || `Friend ${index + 1}`}
                      </p>
                      <span className="bg-cosno-primary/20 text-cosno-primary px-2 py-1 rounded text-xs">
                        Lv.{referral.level || 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>Joined: {new Date(referral.joinedAt).toLocaleDateString()}</span>
                      <span className="text-green-400">
                        +{referral.earnings?.toLocaleString() || 0} earned
                      </span>
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">
                      +{getReferralReward(referral.level)}
                    </p>
                    <p className="text-white/60 text-xs">coins/day</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="text-white/30 mx-auto mb-4" size={48} />
            <p className="text-white/60 mb-2">No referrals yet</p>
            <p className="text-white/40 text-sm">
              Invite friends to start earning together!
            </p>
          </div>
        )}

        {/* How it Works */}
        <div className="mt-8 card-glass p-4">
          <h3 className="text-white font-semibold mb-3">How Referrals Work</h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>1. Share your invite link with friends</p>
            <p>2. They join COSNO using your link</p>
            <p>3. Both of you get bonus coins</p>
            <p>4. You earn a percentage of their mining</p>
            <p>5. Build your team and earn more!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamPage