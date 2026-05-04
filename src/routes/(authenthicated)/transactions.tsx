import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowDownToLine,
  Coins,
  History,
  Plus,
  Receipt,
  TrendingUp,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { useMyTransactions, useTopUp } from '#/queries/transactions'
import { handleApiError } from '#/lib/handle-api-error'
import { userQuerySet } from '#/queries/accounts/user'
import { Skeleton } from '#/components/ui/skeleton'

export const Route = createFileRoute('/(authenthicated)/transactions')({
  component: TransactionsPage,
})

const PRESETS = [
  { credits: 100, price: 5 },
  { credits: 250, price: 10 },
  { credits: 600, price: 20 },
  { credits: 1500, price: 45 },
]

function TransactionsPage() {
  const { data, isLoading } = useMyTransactions()
  const topUp = useTopUp()
  const invalidateUser = userQuerySet.useInvalidateAll()
  const [customCredits, setCustomCredits] = useState('')

  const items = data?.results ?? []
  const totalCredits = items.reduce(
    (sum, t) => sum + parseFloat(t.credits_purchased),
    0,
  )
  const totalPaid = items.reduce((sum, t) => sum + parseFloat(t.amount_paid), 0)

  const buy = (credits: number, amount: number) => {
    topUp.mutate(
      {
        credits_purchased: credits.toFixed(2),
        amount_paid: amount.toFixed(2),
        payment_reference: `FUN-${Date.now()}`,
      },
      {
        onSuccess: () => {
          toast.success(`+${credits} virtual credits added!`)
          setCustomCredits('')
          void invalidateUser()
        },
        onError: () => handleApiError,
      },
    )
  }

  const buyCustom = () => {
    const c = parseFloat(customCredits)
    if (!c || c <= 0) {
      toast.error('Enter a valid credit amount')
      return
    }
    buy(c, c / 20)
  }

  return (
    <section className="min-h-[calc(100vh-3.75rem)] py-10">
      <div className="page-wrap">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="casino-chip">Your Wallet</p>
          <h1 className="display-title text-3xl font-bold sm:text-4xl">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Top up virtual credits and review your history. Remember — no real
            money changes hands.
          </p>
        </motion.div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<TrendingUp size={16} />}
            label="Total topped up"
            value={`${totalCredits.toFixed(2)} cr`}
          />
          <StatCard
            icon={<Receipt size={16} />}
            label="Transactions"
            value={items.length.toString()}
          />
          <StatCard
            icon={<Coins size={16} />}
            label="Equivalent (virtual)"
            value={`$${totalPaid.toFixed(2)}`}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="casino-card mb-8 rounded-2xl p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Plus size={16} className="text-red-400" />
            <h2 className="text-lg font-semibold">Top up credits</h2>
            <span className="ml-auto rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-400">
              Free · Virtual
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRESETS.map((p) => (
              <button
                key={p.credits}
                onClick={() => buy(p.credits, p.price)}
                disabled={topUp.isPending}
                className="group relative overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-br from-red-950/40 to-black p-4 text-left transition hover:-translate-y-0.5 hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] disabled:opacity-50"
              >
                <div className="display-title text-2xl font-bold text-yellow-400">
                  +{p.credits}
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ ${p.price} (virtual)
                </div>
                <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-red-500/10 transition group-hover:bg-red-500/30" />
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="Custom amount of credits…"
              value={customCredits}
              onChange={(e) => setCustomCredits(e.target.value)}
            />
            <Button
              onClick={buyCustom}
              disabled={topUp.isPending}
              className="border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
            >
              <ArrowDownToLine size={14} />
              Top up
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="casino-card overflow-hidden rounded-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/5 px-6 py-4">
            <History size={16} className="text-red-400" />
            <h2 className="text-lg font-semibold">History</h2>
          </div>

          {isLoading ? (
            <div className="space-y-2 p-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-1.5 h-3 w-44" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center text-muted-foreground">
              <Receipt size={28} className="opacity-50" />
              <p className="text-sm">No transactions yet.</p>
              <p className="text-xs">Top up above to get started.</p>
            </div>
          ) : (
            <ul>
              {items.map((t, i) => (
                <motion.li
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center justify-between gap-4 border-b border-white/5 px-6 py-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-yellow-500/10 text-yellow-400">
                      <Coins size={16} />
                    </div>
                    <div>
                      <div className="font-semibold">
                        +{parseFloat(t.credits_purchased).toFixed(2)} credits
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleString()} ·{' '}
                        {t.payment_reference ?? '—'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400">
                      ${parseFloat(t.amount_paid).toFixed(2)}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      virtual
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="casino-card rounded-xl p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="display-title mt-1 text-xl font-bold text-white">
        {value}
      </div>
    </div>
  )
}
