import { createFileRoute } from '@tanstack/react-router'
import { Check, Coins, Copy, Gift, Phone, Shield, User } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { selectUser, useAuthStore } from '#/store/useAuthStore.ts'

export const Route = createFileRoute('/(authenthicated)/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const user = useAuthStore(selectUser)
  const [copied, setCopied] = useState(false)

  function copyReferral() {
    if (!user?.referral_code) return
    navigator.clipboard.writeText(user.referral_code)
    setCopied(true)
    toast.success('Referral code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) return null

  const fields = [
    {
      icon: <Phone size={16} />,
      label: 'Phone Number',
      value: user.phone_number,
    },
    {
      icon: <Shield size={16} />,
      label: 'Account Role',
      value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    },
    {
      icon: <Coins size={16} />,
      label: 'Credits',
      value: parseFloat(user.credits).toFixed(2),
      highlight: true,
    },
  ]

  return (
    <div style={{ minHeight: 'calc(100vh - 3.75rem)', padding: '2.5rem 0' }}>
      <div className="page-wrap" style={{ maxWidth: '600px' }}>
        {/* Header */}
        <div
          className="rise-in"
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '9999px',
              background:
                'radial-gradient(circle at 30% 30%, #ef4444, #991b1b 70%, #450a0a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              boxShadow: '0 0 40px rgba(220,38,38,0.4)',
            }}
          >
            <User size={28} color="#fff" />
          </div>
          <h1
            className="display-title"
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              margin: '0 0 0.25rem',
            }}
          >
            Your Profile
          </h1>
          <p
            style={{
              color: 'var(--casino-text-mute)',
              margin: 0,
              fontSize: '0.88rem',
            }}
          >
            Member since {new Date(Date.now()).toLocaleDateString()}
          </p>
        </div>

        {/* Info Card */}
        <div
          className="casino-card"
          style={{
            borderRadius: '1rem',
            overflow: 'hidden',
            marginBottom: '1rem',
          }}
        >
          {fields.map(({ icon, label, value, highlight }, i) => (
            <div
              key={label}
              style={{
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom:
                  i < fields.length - 1
                    ? '1px solid var(--casino-line-soft)'
                    : undefined,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  color: 'var(--casino-text-mute)',
                  fontSize: '0.85rem',
                }}
              >
                {icon}
                {label}
              </div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: highlight
                    ? 'var(--casino-gold)'
                    : 'var(--casino-text)',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Referral Code */}
        <div
          className="casino-card"
          style={{ borderRadius: '1rem', padding: '1.25rem 1.5rem' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--casino-text-mute)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.75rem',
            }}
          >
            <Gift size={13} />
            Referral Code
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '0.625rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--casino-line-soft)',
            }}
          >
            <span
              className="display-title"
              style={{
                fontSize: '1.5rem',
                letterSpacing: '0.15em',
                color: 'var(--casino-gold)',
              }}
            >
              {user.referral_code}
            </span>
            <button
              onClick={copyReferral}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--casino-line)',
                background: 'transparent',
                color: 'var(--casino-text-soft)',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {copied ? (
                <Check size={13} color="#4ade80" />
              ) : (
                <Copy size={13} />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--casino-text-mute)',
              margin: '0.625rem 0 0',
            }}
          >
            Share this code with friends to earn referral bonuses.
          </p>
        </div>
      </div>
    </div>
  )
}
