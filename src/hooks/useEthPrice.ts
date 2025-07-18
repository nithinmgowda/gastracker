import { useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import { useGasStore } from '../lib/store'
import { getEthUsdPrice, getEthUsdPriceFallback } from '../lib/getUsdPrice'

export function useEthPrice() {
  const updateEthPrice = useGasStore(state => state.updateEthPrice)
  const mode = useGasStore(state => state.mode)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (mode !== 'live') return

    const fetchEthPrice = async () => {
      try {
        // Try Uniswap V3 first
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_ETH_RPC || 'https://mainnet.infura.io/v3/abcdef1234567890abcdef1234567890'
        )
        
        const price = await getEthUsdPrice(provider)
        
        if (price > 0) {
          updateEthPrice(price)
        } else {
          // Fallback to CoinGecko
          const fallbackPrice = await getEthUsdPriceFallback()
          if (fallbackPrice > 0) {
            updateEthPrice(fallbackPrice)
          }
        }
      } catch (error) {
        console.error('Error fetching ETH price:', error)
        // Try fallback
        try {
          const fallbackPrice = await getEthUsdPriceFallback()
          if (fallbackPrice > 0) {
            updateEthPrice(fallbackPrice)
          }
        } catch (fallbackError) {
          console.error('Error fetching ETH price from fallback:', fallbackError)
        }
      }
    }

    // Initial fetch
    fetchEthPrice()

    // Set up periodic updates (every 30 seconds)
    intervalRef.current = setInterval(fetchEthPrice, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [mode, updateEthPrice])
} 