import { motion } from 'motion/react'

interface SlotMachineSpinButtonProps {
  handleSpin: () => Promise<void>;
  spinning: boolean;
}

const SlotMachineSpinButton = ({
  spinning,
  handleSpin,
}: SlotMachineSpinButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={handleSpin}
      className={[
        'w-full max-w-[280px] py-[0.85rem] rounded-xl border-none',
        'text-white text-base font-extrabold tracking-[0.06em] uppercase font-display',
        spinning
          ? 'bg-gradient-to-br from-[var(--casino-red)] to-red-700 cursor-pointer shadow-[0_0_28px_rgba(220,38,38,0.45)] opacity-80'
          : 'bg-gradient-to-br from-[var(--casino-red)] to-red-700 cursor-pointer shadow-[0_0_28px_rgba(220,38,38,0.45)]',
      ].join(' ')}
    >
      {spinning ? (
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 0.7 }}
        >
          Spinning…
        </motion.span>
      ) : (
        'Spin'
      )}
    </motion.button>
  )
}

export default SlotMachineSpinButton