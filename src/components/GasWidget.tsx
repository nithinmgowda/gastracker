"use client";

import React from "react";
import { useGasStore } from "../lib/store";
import type { ChainId } from "../lib/types";

const CHAIN_ICONS: Record<ChainId, string> = {
  ethereum: "🟦",
  polygon: "🟪",
  arbitrum: "🟦"
};
const CHAIN_COLORS: Record<ChainId, string> = {
  ethereum: "#627EEA",
  polygon: "#8247E5",
  arbitrum: "#28A0F0"
};

interface GasWidgetProps {
  chain: ChainId;
}

export const GasWidget: React.FC<GasWidgetProps> = ({ chain }) => {
  const chainState = useGasStore((state) => state.chains[chain]);
  const ethUsdPrice = useGasStore((state) => state.ethUsdPrice);

  const isLoading = !chainState || !chainState.currentGas || ethUsdPrice === 0;
  const { baseFee = 0, priorityFee = 0 } = chainState?.currentGas || {};
  const totalGas = baseFee + priorityFee;
  const gasLimit = 21000;
  const gasCostInEth = (totalGas * gasLimit) / 1e9;
  const gasCostInUsd = gasCostInEth * ethUsdPrice;

  return (
    <div
      className="bg-gray-800 border border-blue-700 rounded-xl shadow-lg p-5 flex flex-col items-start transition-all duration-300 hover:scale-[1.02] min-h-[120px]"
      style={{ boxShadow: `0 2px 16px 0 ${CHAIN_COLORS[chain]}22` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-3 rounded-full" style={{ background: CHAIN_COLORS[chain] }}></span>
        <span className="text-lg font-bold capitalize tracking-wide" style={{ color: CHAIN_COLORS[chain] }}>{chain}</span>
        {isLoading && <span className="ml-2 animate-pulse text-blue-400">●</span>}
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-400 animate-pulse">
          <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
          <span>Loading gas data…</span>
        </div>
      ) : (
        <>
          <div className="text-sm">⛽ Base Fee: <span className="font-mono">{baseFee.toFixed(2)} Gwei</span></div>
          <div className="text-sm">⚡ Priority Fee: <span className="font-mono">{priorityFee.toFixed(2)} Gwei</span></div>
          <div className="text-sm font-bold text-green-400">💸 Est. Cost: ${gasCostInUsd.toFixed(4)}</div>
        </>
      )}
    </div>
  );
};
