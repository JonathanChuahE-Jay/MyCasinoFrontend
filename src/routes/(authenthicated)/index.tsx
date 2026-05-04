import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

export const Route = createFileRoute('/(authenthicated)/')({
  component: Home,
})

function Home() {
  return (
    <section className="relative">
      <div className="page-wrap relative pt-16 pb-24 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center text-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-yellow-400"
          >
            <Sparkles size={12} /> Non-profit · Just for fun
          </motion.span>

          <h1 className="display-title text-balance text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-red-400 via-yellow-300 to-red-500 bg-clip-text text-transparent">
              Feel the rush.
            </span>
            <br />
            <span className="text-white">Lose nothing real.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-sm leading-relaxed text-gray-400 sm:text-base">
            A free, non-profit fun project for those who love the thrill of
            gambling but don't want to lose actual money. Spin the reels, chase
            the jackpots — all virtual.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
