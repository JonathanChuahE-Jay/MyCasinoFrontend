import { motion, AnimatePresence } from 'motion/react'
import { Coins, Crown, Sparkles, Trophy, Zap } from 'lucide-react'
import type { PlayResult } from '#/types/slots'

export interface WinLogEntry {
  id: number
  credits_won: number
  credit_per_spin: number
  free_spin: boolean
  jackpot: boolean
  gold: boolean
  at: number
}

export function makeLogEntry(
  result: PlayResult,
  credit_per_spin: number,
  id: number,
): WinLogEntry {
  const won = parseFloat((result.credits_won as unknown as string) ?? '0') || 0
  return {
    id,
    credits_won: won,
    credit_per_spin,
    free_spin: !!result.free_spin?.triggered,
    jackpot: !!result.jackpot?.triggered,
    gold: !!result.gold?.gold_grid?.flat()?.some(Boolean),
    at: Date.now(),
  }
}

export function SlotMachineWinLog({ entries }: { entries: WinLogEntry[] }) {
  return (
    <div className="casino-card flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <Trophy size={14} className="text-yellow-400" />
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
          Win Log
        </h3>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">
          last {entries.length}
        </span>
      </div>

      <div className="max-h-[18rem] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center text-muted-foreground">
            <Sparkles size={24} className="opacity-40" />
            <p className="text-xs">No spins yet — pull the lever!</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {entries.map((e) => {
                const won = e.credits_won > 0
                const net = e.credits_won - e.credit_per_spin
                return (
                  <motion.li
                    key={e.id}
                    initial={{ opacity: 0, x: -8, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        e.jackpot
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : won
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-white/5 text-muted-foreground'
                      }`}
                    >
                      {e.jackpot ? (
                        <Crown size={14} />
                      ) : e.free_spin ? (
                        <Zap size={14} />
                      ) : (
                        <Coins size={14} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        {won ? (
                          <span className="text-green-400">
                            +{e.credits_won.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No win</span>
                        )}
                        {e.jackpot && (
                          <span className="rounded-full bg-yellow-500/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-widest text-yellow-300">
                            Jackpot
                          </span>
                        )}
                        {e.free_spin && (
                          <span className="rounded-full bg-purple-500/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-widest text-purple-300">
                            Free
                          </span>
                        )}
                        {e.gold && (
                          <span className="rounded-full bg-amber-500/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-widest text-amber-300">
                            Gold
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        bet {e.credit_per_spin} ·{' '}
                        {new Date(e.at).toLocaleTimeString()}
                      </div>
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        net > 0
                          ? 'text-green-400'
                          : net < 0
                            ? 'text-red-400'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {net > 0 ? '+' : ''}
                      {net.toFixed(2)}
                    </div>
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  )
}
