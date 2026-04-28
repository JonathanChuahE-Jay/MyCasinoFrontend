import React from 'react'
import {
  slotMachineQuerySet,
  usePlaySlot,
  useSlotMachineJackpots,
  useSlotMachineSymbols,
} from '#/queries/slots'
import type { FreespinOption, PlayResult } from '#/types/slots'
import placeholder from '#/assets/common/slot-machine.png'
import type { ReelHandle } from '#/components/routes/slots/id/SlotMachineReel.tsx'
import type { JackpotSession } from '#/components/routes/slots/id/SlotMachineJackpotModal.tsx'
import { mapGrid } from '#/lib/mapGrid.ts'
import { handleApiError } from '#/lib/handle-api-error.ts'
import { userQuerySet } from '#/queries/accounts/user.ts'

export function useSlotMachine(machineId: string) {
  const { data: machine, isLoading } = slotMachineQuerySet.useDetail(machineId)
  const { data: symbolsData } = useSlotMachineSymbols(machineId)
  const { data: jackpotsData } = useSlotMachineJackpots(machineId)
  const { mutateAsync: playSlot } = usePlaySlot()
  const symbols = symbolsData?.results ?? []
  const jackpots = jackpotsData?.results ?? []
  const invalidateUser = userQuerySet.useInvalidateAll()
  const [symbolSize, setSymbolSize] = React.useState(72)
  const [selectedCredit, setSelectedCredit] = React.useState<number | null>(
    null,
  )
  const [selectedWildcard, setSelectedWildcard] = React.useState<number | null>(
    null,
  )
  const [spinning, setSpinning] = React.useState(false)
  const [result, setResult] = React.useState<PlayResult | null>(null)
  const [showResult, setShowResult] = React.useState(false)
  const [freespinOptions, setFreespinOptions] = React.useState<
    FreespinOption[] | null
  >(null)
  const reelRefs = React.useRef<(ReelHandle | null)[]>([])
  const [jackpotSession, setJackpotSession] =
    React.useState<JackpotSession | null>(null)

  const spinIdRef = React.useRef(0)
  const pendingTimeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const pendingResultRef = React.useRef<{ result: PlayResult; spinId: number } | null>(null)
  const finishCalledRef = React.useRef(-1)

  const symbolMap = React.useMemo(() => {
    const map = new Map<string, string>()
    for (const sym of symbols) map.set(sym.id, sym.image ?? placeholder)
    return map
  }, [symbols])

  const wildcardImg = React.useMemo(
    () => symbols.find((s) => s.is_wildcard)?.image ?? placeholder,
    [symbols],
  )
  const symbolImages = React.useMemo(
    () =>
      symbols.length > 0
        ? symbols.map((s) => s.image ?? placeholder)
        : [placeholder],
    [symbols],
  )

  React.useEffect(() => {
    function calc() {
      const w = window.innerWidth
      if (w < 480) setSymbolSize(56)
      else if (w < 768) setSymbolSize(64)
      else setSymbolSize(72)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const cols = machine?.cols ?? 3
  const rows = machine?.rows ?? 3
  const creditOptions = machine?.credits_per_spin ?? []
  const wildcardOptions = machine?.wildcard_col_options ?? []
  const activeCreditOption =
    creditOptions.find((o) => o.credit_per_spin === selectedCredit) ??
    creditOptions[0]

  function finishSpin(playResult: PlayResult, spinId: number) {
    if (spinId !== spinIdRef.current) return
    if (finishCalledRef.current === spinId) return
    finishCalledRef.current = spinId
    pendingResultRef.current = null

    setSpinning(false)
    setResult(playResult)
    setShowResult(true)

    const freeSpin = playResult.free_spin
    if (freeSpin?.triggered) {
      const opts = (freeSpin as Record<string, unknown>).options as
        | FreespinOption[]
        | undefined
      if (opts?.length) setFreespinOptions(opts)
    }

    if (
      playResult.jackpot?.triggered &&
      playResult.jackpot.reveal_sequence?.length
    ) {
      setJackpotSession({
        reveal_sequence: playResult.jackpot.reveal_sequence,
        winner_position: playResult.jackpot.winner_position ?? 0,
        winner_jackpot_id: playResult.jackpot.winner_jackpot_id,
        session_id: playResult.jackpot.session_id ?? '',
      })
    }
  }

  async function handleSpin() {
    if (!machine) return

    // If spinning and result already arrived: stop all reels and show result now
    if (spinning) {
      if (pendingResultRef.current) {
        pendingTimeoutsRef.current.forEach(clearTimeout)
        pendingTimeoutsRef.current = []
        reelRefs.current.forEach((reel) => reel?.stopImmediate())
        const { result: pendingResult, spinId } = pendingResultRef.current
        finishSpin(pendingResult, spinId)
      }
      return
    }

    const credit = selectedCredit ?? creditOptions[0]?.credit_per_spin
    if (credit == null) return

    pendingTimeoutsRef.current.forEach(clearTimeout)
    pendingTimeoutsRef.current = []
    pendingResultRef.current = null

    const currentSpinId = ++spinIdRef.current

    setSpinning(true)
    setShowResult(false)
    setResult(null)

    let playResult: PlayResult | null = null

    try {
      playResult = await playSlot({
        id: machineId,
        data: {
          credit_per_spin: credit,
          wildcard_credit: selectedWildcard ?? 0,
        },
      })
      await invalidateUser()
    } catch (e) {
      if (currentSpinId !== spinIdRef.current) return
      setSpinning(false)

      const { available_options } = await handleApiError(e)

      if (Array.isArray(available_options) && available_options.length > 0) {
        setFreespinOptions(available_options as FreespinOption[])
        return
      }

      return
    }

    if (currentSpinId !== spinIdRef.current) return

    pendingResultRef.current = { result: playResult, spinId: currentSpinId }

    const colSymbols = mapGrid(playResult.grid, symbolMap, wildcardImg)

    const colGolds = Array.from({ length: cols }, (_, c) =>
      Array.from(
        { length: rows },
        (_, r) => playResult!.gold.gold_grid[r]?.[c] ?? false,
      ),
    )

    let doneCount = 0
    reelRefs.current.forEach((reel, colIdx) => {
      const delay = colIdx * 360
      const tid = setTimeout(() => {
        if (!reel) {
          doneCount++
          if (doneCount === cols) finishSpin(playResult!, currentSpinId)
          return
        }
        reel.spinTo(
          colSymbols[colIdx] ?? [],
          colGolds[colIdx] ?? Array(rows).fill(false),
          () => {
            doneCount++
            if (doneCount === cols) finishSpin(playResult!, currentSpinId)
          },
        )
      }, delay)
      pendingTimeoutsRef.current.push(tid)
    })
  }

  return {
    machine,
    isLoading,
    jackpots,
    symbolImages,
    symbolSize,
    cols,
    rows,
    creditOptions,
    wildcardOptions,
    activeCreditOption,
    spinning,
    result,
    showResult,
    freespinOptions,
    jackpotSession,
    selectedCredit,
    selectedWildcard,
    setSelectedCredit,
    setSelectedWildcard,
    reelRefs,
    handleSpin,
    setFreespinOptions,
    setJackpotSession,
  }
}
