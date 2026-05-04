import { Heart, Info, ShieldCheck, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-red-500/20 bg-black/60 backdrop-blur-md">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
      />
      <div className="page-wrap py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="display-title text-xl font-bold text-white">
                MyCasino
              </span>
              <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-yellow-400">
                Non-profit
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
              A purely-for-fun casino simulator. No real money, no real
              winnings — just the thrill, without the loss.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
              Why we exist
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="mt-0.5 text-green-400" />
                <span>Zero real-money transactions, ever.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles size={14} className="mt-0.5 text-yellow-400" />
                <span>Built for the thrill, not the loss.</span>
              </li>
              <li className="flex items-start gap-2">
                <Heart size={14} className="mt-0.5 text-red-400" />
                <span>Made for those who want fun without harm.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs text-yellow-200/90">
          <div className="mb-1 flex items-center gap-2 font-semibold uppercase tracking-widest">
            <Info size={13} /> Important notice
          </div>
          <p className="leading-relaxed">
            This website is a <strong>non-profit fun project</strong> — it is
            <em> not </em> a paid casino. It exists for people who enjoy the
            adrenaline of gambling but don't want to lose actual money. All
            credits, jackpots, and winnings on MyCasino are virtual and have
            no real-world monetary value.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 text-xs text-gray-500 md:flex-row">
          <span>
            © {new Date().getFullYear()} MyCasino. Made with{' '}
            <Heart size={11} className="inline text-red-500" /> for the love of
            the game.
          </span>
          <span className="tracking-widest uppercase">
            Play responsibly · Play virtually
          </span>
        </div>
      </div>
    </footer>
  )
}
