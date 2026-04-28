export type SlotPlayFreeSpinResponseType =
  | {
      triggered: false
      hits: number
      partial_hits?: Record<string, number>
    }
  | {
      triggered: true
      hits: number
      scatter_symbol: string
      scatter_symbol_id: number
      options: {
        index: number
        free_spins: number
        wild_card_multiplier: number[]
      }[]
    }
  | {
      triggered: true
      hits: number
      scatter_symbol: string
      scatter_symbol_id: number
      bonus_spins: number
    }
  | {
      triggered: false
      hits: number
      bonus_spins: 0
      scatter_symbol?: string
      scatter_symbol_id?: number
    }

export type SlotPlayGoldResponseType = {
  gold_grid: boolean[][]
  full_gold_cols: number
  col_gold_lengths: number[]
  consecutive_full_gold_cols: number
  jackpot_picker_eligible: boolean
}

export type SlotPlayJackpotResponseType =
  | {
      triggered: true
      session_id: string
      reveal_sequence: string[]
      winner_position: number
      full_gold_cols: number
      winner_jackpot_id: string
    }
  | null

export interface SlotPlayResponseType {
  grid: number[][]
  credits_won: string
  free_spin: SlotPlayFreeSpinResponseType
  wildcard_multiplier: number | null
  purchased_wildcard_cols: number[]
  gold: SlotPlayGoldResponseType
  jackpot: SlotPlayJackpotResponseType
}