export const CHAINS = {
  ethereum: {
    name: 'Ethereum',
    rpc: process.env.NEXT_PUBLIC_ETH_RPC!,
    gasUnits: 'GWEI',
    color: '#627EEA'
  },
  polygon: {
    name: 'Polygon',
    rpc: process.env.NEXT_PUBLIC_POLYGON_RPC!,
    gasUnits: 'GWEI',
    color: '#8247E5'
  },
  arbitrum: {
    name: 'Arbitrum',
    rpc: process.env.NEXT_PUBLIC_ARBITRUM_RPC!,
    gasUnits: 'GWEI',
    color: '#28A0F0'
  }
} as const

export type ChainId = keyof typeof CHAINS