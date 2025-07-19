import { useEffect, useRef } from 'react'
import { WebSocketProvider } from '@ethersproject/providers'
import { useGasStore } from '../lib/store'
import { ChainId, GasPrice } from '../lib/types'

// RPC URLs - use environment variables for Infura endpoints
const RPC_URLS = {
  ethereum: process.env.NEXT_PUBLIC_INFURA_WSS || 'wss://mainnet.infura.io/ws/v3/YOUR_INFURA_KEY',
  polygon: process.env.NEXT_PUBLIC_POLYGON_RPC || 'wss://polygon-mainnet.infura.io/ws/v3/YOUR_INFURA_KEY',
  arbitrum: process.env.NEXT_PUBLIC_ARBITRUM_RPC || 'wss://arbitrum-mainnet.infura.io/ws/v3/YOUR_INFURA_KEY',
}

export function useWebSocketProvider() {
  const providers = useRef<Partial<Record<ChainId, WebSocketProvider>>>({});
  const updateGasPrice = useGasStore(state => state.updateGasPrice);
  const updateEthPrice = useGasStore(state => state.updateEthPrice);
  const mode = useGasStore(state => state.mode);

  useEffect(() => {
    if (mode !== 'live') return;

    const setupProvider = async (chainId: ChainId, url: string) => {
      try {
        const provider = new WebSocketProvider(url);
        providers.current[chainId] = provider;

        // Handle new blocks
        provider.on('block', async (blockNumber) => {
          try {
            const [block, feeData] = await Promise.all([
              provider.getBlock(blockNumber),
              provider.send('eth_maxPriorityFeePerGas', [])
            ]);

            const gasPrice: GasPrice = {
              baseFee: block.baseFeePerGas?.toNumber() ?? 0,
              priorityFee: Number(feeData) / 1e9, // Convert wei to gwei
              timestamp: block.timestamp * 1000
            };

            updateGasPrice(chainId, gasPrice);
          } catch (error) {
            console.error(`Error fetching data for ${chainId}:`, error);
          }
        });

        // Handle WebSocket errors and reconnect
        provider.on('error', (error: Error) => {
          console.error(`WebSocket error for ${chainId}:`, error);
          setTimeout(() => setupProvider(chainId, url), 5000);
        });

        // Initial data fetch
        try {
          const [block, feeData] = await Promise.all([
            provider.getBlock('latest'),
            provider.send('eth_maxPriorityFeePerGas', [])
          ]);

          const gasPrice: GasPrice = {
            baseFee: block.baseFeePerGas?.toNumber() ?? 0,
            priorityFee: Number(feeData) / 1e9, // Convert wei to gwei
            timestamp: block.timestamp * 1000
          };

          updateGasPrice(chainId, gasPrice);
        } catch (error) {
          console.error(`Error fetching initial data for ${chainId}:`, error);
        }

      } catch (error) {
        console.error(`Failed to setup provider for ${chainId}:`, error);
        // Retry after 5 seconds
        setTimeout(() => setupProvider(chainId, url), 5000);
      }
    };

    // Initialize providers for all chains
    Object.entries(RPC_URLS).forEach(([chainId, url]) => {
      setupProvider(chainId as ChainId, url as string);
    });

    return () => {
      // Cleanup providers
      Object.values(providers.current).forEach(provider => {
        try {
          provider?.removeAllListeners();
          provider?.destroy?.();
        } catch (error) {
          console.error('Error during provider cleanup:', error);
        }
      });
      providers.current = {};
    };
  }, [mode, updateGasPrice, updateEthPrice]);
}