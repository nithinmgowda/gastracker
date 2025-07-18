"use client";

import React, { useState } from "react";
import { useGasStore } from "../lib/store";
import type { ChainId } from "../lib/types";

export const WalletSimulator: React.FC = () => {
  const [amount, setAmount] = useState<number>(0.5); // Transaction value in ETH/MATIC/etc.
  const ethUsdPrice = useGasStore((state) => state.ethUsdPrice); // ETH/USD price
  const chains = useGasStore((state) => state.chains); // gas data from all chains

  const isLoading = ethUsdPrice === 0;

  // Calculate USD cost of sending a transaction
  const calculateUsdCost = (baseFee: number, priorityFee: number) => {
    const gasLimit = 21000; // typical gas for ETH transfer
    const totalFeeInGwei = baseFee + priorityFee;
    const totalFeeInEth = (totalFeeInGwei * gasLimit) / 1e9; // Convert from Gwei to ETH
    return totalFeeInEth * ethUsdPrice;
  };

  return (
    <div className="bg-gray-800 border border-blue-700 rounded-xl shadow-lg p-6 fade-in transition-all duration-300 hover:scale-[1.01]">
      <h2 className="text-lg font-bold mb-4 text-blue-300 flex items-center gap-2">
        <span className="inline-block w-5 h-5 bg-blue-500 rounded-full mr-1" />
        Transaction Simulator
      </h2>
      <div className="flex items-center gap-3 mb-6">
        <label className="text-sm">Transaction Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          className="border px-2 py-1 w-24 text-sm rounded bg-gray-900 border-gray-700 text-white focus:ring-2 focus:ring-blue-400"
          step="0.01"
          min="0"
        />
        <span className="text-sm text-gray-400">ETH / MATIC / etc</span>
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-gray-400">Loading ETH price…</span>
        </div>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left p-2">Chain</th>
              <th className="text-left p-2">Base Fee (Gwei)</th>
              <th className="text-left p-2">Priority Fee (Gwei)</th>
              <th className="text-left p-2">Estimated USD Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(chains).map(([chain, data]) => (
              <tr key={chain} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                <td className="capitalize p-2 font-semibold text-blue-200">{chain}</td>
                <td className="p-2">{data.currentGas.baseFee.toFixed(2)}</td>
                <td className="p-2">{data.currentGas.priorityFee.toFixed(2)}</td>
                <td className="p-2 font-medium text-green-400">
                  ${calculateUsdCost(data.currentGas.baseFee, data.currentGas.priorityFee).toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!isLoading && (
        <div className="mt-4 p-3 bg-blue-900/40 rounded-md">
          <p className="text-sm text-blue-200">
            💡 ETH Price: ${ethUsdPrice.toFixed(2)} | Transaction Value: {(amount * ethUsdPrice).toFixed(2)} USD
          </p>
        </div>
      )}
      <style jsx global>{`
        .fade-in { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};
