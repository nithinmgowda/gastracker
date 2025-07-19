import { create } from 'zustand'
import { GasStore } from './types'

const DEFAULT_GAS_STATE = {
  currentGas: { baseFee: 0, priorityFee: 0, timestamp: Date.now() },
  history: []
}

export const useGasStore = create<GasStore>((set) => ({
  mode: 'live',
  chains: {
    ethereum: DEFAULT_GAS_STATE,
    polygon: DEFAULT_GAS_STATE,
    arbitrum: DEFAULT_GAS_STATE
  },
  ethUsdPrice: 0,
  transactionValue: 0,

  setMode: (mode) => set({ mode }),
  
  updateGasPrice: (chainId, price) => set((state) => ({
    chains: {
      ...state.chains,
      [chainId]: {
        currentGas: price,
        history: [...state.chains[chainId].history, {
          timestamp: price.timestamp,
          open: price.baseFee + price.priorityFee,
          high: price.baseFee + price.priorityFee,
          low: price.baseFee + price.priorityFee,
          close: price.baseFee + price.priorityFee
        }].slice(-60) // Keep last 60 points (15 minutes at 15s intervals)
      }
    }
  })),

  updateEthPrice: (price) => set({ ethUsdPrice: price }),
  setTransactionValue: (value) => set({ transactionValue: value })
}))