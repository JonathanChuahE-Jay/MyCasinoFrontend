import { createFileRoute } from '@tanstack/react-router'
import {
  Check,
  Coins,
  Copy,
  Gift,
  KeyRound,
  Phone,
  Shield,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'motion/react'
import { selectUser, useAuthStore } from '#/store/useAuthStore'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import { useChangePassword } from '#/queries/transactions'
import { handleApiError } from '#/lib/handle-api-error'

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
    <section className="min-h-[calc(100vh-3.75rem)] py-10">
      <div className="page-wrap max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="casino-emblem mx-auto mb-5">
            <User size={28} />
          </div>
          <h1 className="display-title text-3xl font-extrabold">
            Your Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Member since {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="casino-card mb-4 overflow-hidden rounded-2xl"
        >
          {fields.map(({ icon, label, value, highlight }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between px-6 py-4 ${
                i < fields.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                {label}
              </div>
              <div
                className={`text-sm font-bold ${
                  highlight ? 'text-yellow-400' : 'text-white'
                }`}
              >
                {value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Referral */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="casino-card mb-4 rounded-2xl p-5"
        >
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <Gift size={13} /> Referral Code
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <span className="display-title text-2xl tracking-[0.15em] text-yellow-400">
              {user.referral_code}
            </span>
            <Button onClick={copyReferral} className="border-white/10">
              {copied ? (
                <Check size={13} className="text-green-400" />
              ) : (
                <Copy size={13} />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Share this code with friends to earn referral bonuses.
          </p>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="casino-card rounded-2xl p-5"
        >
          <ChangePasswordSection />
        </motion.div>
      </div>
    </section>
  )
}

function ChangePasswordSection() {
  const { mutate, isPending } = useChangePassword()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (next !== confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (next.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    mutate(
      {
        current_password: current,
        new_password: next,
        confirm_password: confirm,
      },
      {
        onSuccess: () => {
          toast.success('Password updated!')
          setCurrent('')
          setNext('')
          setConfirm('')
        },
        onError: handleApiError,
      },
    )
  }

  return (
    <form onSubmit={submit}>
      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <KeyRound size={13} /> Change Password
      </div>
      <div className="grid gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="current">Current password</Label>
          <Input
            id="current"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="new">New password</Label>
            <Input
              id="new"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="confirm">Confirm new</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="mt-2 border-red-500/40 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400"
        >
          <KeyRound size={13} />
          {isPending ? 'Updating…' : 'Update password'}
        </Button>
      </div>
    </form>
  )
}
