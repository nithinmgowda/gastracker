import { ethers } from 'ethers'

const UNISWAP_V3_POOL = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640' // ETH/USDC pool
const UNISWAP_V3_POOL_ABI = [
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)'
]

let cachedPrice = 0
let lastFetchTime = 0
const CACHE_DURATION = 10000 // 10 seconds

export async function getEthUsdPrice(provider: ethers.providers.Provider): Promise<number> {
  const now = Date.now()
  
  // Return cached price if it's still valid
  if (cachedPrice > 0 && now - lastFetchTime < CACHE_DURATION) {
    return cachedPrice
  }

  try {
    const poolContract = new ethers.Contract(
      UNISWAP_V3_POOL,
      UNISWAP_V3_POOL_ABI,
      provider
    )

    const { sqrtPriceX96 } = await poolContract.slot0()
    
    // Convert sqrtPriceX96 to price
    // Formula: price = (sqrtPriceX96 / 2^96)^2 * 10^12
    const price = (Number(sqrtPriceX96) ** 2 * (10 ** 12)) / (2 ** 192)
    
    cachedPrice = price
    lastFetchTime = now
    
    return price
  } catch (error) {
    console.error('Error fetching ETH/USD price:', error)
    // Return cached price if available, otherwise return 0
    return cachedPrice || 0
  }
}

// Alternative method using public RPC for fallback
export async function getEthUsdPriceFallback(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    return data.ethereum?.usd || 0
  } catch (error) {
    console.error('Error fetching ETH price from CoinGecko:', error)
    return 0
  }
}