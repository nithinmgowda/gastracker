export type ChainId = 'ethereum' | 'polygon' | 'arbitrum'

export interface GasPrice {
  baseFee: number
  priorityFee: number
  timestamp: number
}

export interface GasPoint {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
}

export interface ChainState {
  currentGas: GasPrice
  history: GasPoint[]
}

export interface GasStore {
  mode: 'live' | 'simulation'
  chains: Record<ChainId, ChainState>
  ethUsdPrice: number
  transactionValue: number
  setMode: (mode: 'live' | 'simulation') => void
  updateGasPrice: (chainId: ChainId, price: GasPrice) => void
  updateEthPrice: (price: number) => void
  setTransactionValue: (value: number) => void
}