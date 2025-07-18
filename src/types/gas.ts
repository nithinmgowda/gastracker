import { ChainId } from '../constants/chains'

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

export interface ChainGasState {
  currentGas: GasPrice
  history: GasPoint[]
  usdPrice?: number
}

export interface SimulationState {
  amount: number
  estimatedCosts: Record<ChainId, {
    gasUsd: number
    totalUsd: number
  }>
}