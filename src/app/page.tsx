"use client";

import { useState } from "react";
import { GasWidget } from '../components/GasWidget'
import { WalletSimulator } from '../components/WalletSimulator'
import { CandlestickChart } from '../charts/CandlestickChart'
import { useWebSocketProvider } from '../hooks/useWebSocket'
import { useEthPrice } from '../hooks/useEthPrice'

const CHAIN_COLORS = {
  ethereum: '#627EEA',
  polygon: '#8247E5',
  arbitrum: '#28A0F0'
} as const;

const CHAIN_LABELS = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum'
} as const;

export default function Home() {
  useWebSocketProvider();
  useEthPrice();
  const [selectedChain, setSelectedChain] = useState<'ethereum' | 'polygon' | 'arbitrum'>('ethereum');

  return (
    <main className="min-h-screen p-0 bg-gray-950 text-white">
      <header className="w-full px-8 py-6 bg-gray-900 border-b border-gray-800 shadow">
        <h1 className="text-4xl font-bold tracking-tight mb-1">⛽ Cross-Chain Gas Tracker</h1>
        <p className="text-gray-400 text-lg">Real-time gas prices, cost simulation, and live charts for Ethereum, Polygon, and Arbitrum</p>
      </header>
      <div className="flex flex-col md:flex-row gap-8 px-8 py-8">
        {/* Main Chart Section */}
        <section className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold">Gas Price Chart</h2>
            <div className="flex gap-2 ml-auto">
              {Object.keys(CHAIN_LABELS).map((chain) => (
                <button
                  key={chain}
                  className={`px-4 py-1 rounded-full border transition-colors text-sm font-medium ${selectedChain === chain ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}
                  onClick={() => setSelectedChain(chain as 'ethereum' | 'polygon' | 'arbitrum')}
                >
                  {CHAIN_LABELS[chain as keyof typeof CHAIN_LABELS]}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-4 min-h-[340px] flex items-center justify-center">
            <CandlestickChart chain={selectedChain} chainColors={{ [selectedChain]: CHAIN_COLORS[selectedChain] }} />
          </div>
          {/* Multi-chain comparison chart */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Multi-Chain Gas Comparison</h3>
            <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-4 min-h-[340px] flex items-center justify-center">
              <CandlestickChart chains={['ethereum', 'polygon', 'arbitrum']} chainColors={CHAIN_COLORS} />
            </div>
          </div>
        </section>
        {/* Sidebar with divider and background */}
        <aside className="w-full md:w-[370px] flex flex-col gap-6 relative">
          <div className="hidden md:block absolute -left-6 top-0 h-full w-1 bg-gradient-to-b from-blue-900/40 to-transparent rounded-full" />
          <div className="bg-gray-900/80 rounded-2xl shadow-xl border border-gray-800 p-6 fade-in">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Live Gas Info</h2>
            <div className="flex flex-col gap-4">
              <GasWidget chain="ethereum" />
              <GasWidget chain="polygon" />
              <GasWidget chain="arbitrum" />
            </div>
            <h2 className="text-xl font-semibold mt-8 mb-2 text-gray-200">Transaction Simulator</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow p-4 mt-2">
              <WalletSimulator />
            </div>
          </div>
        </aside>
      </div>
      <style jsx global>{`
        .fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </main>
  )
}
