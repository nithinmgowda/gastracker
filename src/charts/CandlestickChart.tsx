"use client";

import { createChart, CrosshairMode, CandlestickSeries, Time } from 'lightweight-charts';
import { useEffect, useRef, useMemo } from 'react';
import { useGasStore } from '../lib/store';
import type { ChainId, GasPoint } from '../lib/types';

interface CandlestickChartProps {
  chain?: ChainId;
  chains?: ChainId[];
  chainColors?: Partial<Record<ChainId, string>>;
}

// Convert gas history to OHLC candlestick data
function createCandlestickData(gasHistory: GasPoint[]) {
  if (gasHistory.length === 0) return [];

  // Group data into 15-minute intervals
  const intervals: { [key: string]: GasPoint[] } = {};
  
  gasHistory.forEach(point => {
    const timestamp = new Date(point.timestamp);
    const intervalKey = new Date(
      timestamp.getFullYear(),
      timestamp.getMonth(),
      timestamp.getDate(),
      timestamp.getHours(),
      Math.floor(timestamp.getMinutes() / 15) * 15
    ).getTime();

    if (!intervals[intervalKey]) {
      intervals[intervalKey] = [];
    }
    intervals[intervalKey].push(point);
  });

  // Convert intervals to OHLC format
  return Object.entries(intervals).map(([timestamp, points]) => {
    const prices = points.map(p => p.close);
    return {
      time: Math.floor(parseInt(timestamp) / 1000) as Time,
      open: points[0].open,
      high: Math.max(...prices),
      low: Math.min(...prices),
      close: points[points.length - 1].close
    };
  }).sort((a, b) => (a.time as number) - (b.time as number));
}

const DEFAULT_CHAIN_COLORS: Record<ChainId, string> = {
  ethereum: '#627EEA',
  polygon: '#8247E5',
  arbitrum: '#28A0F0',
};

export function CandlestickChart({ chain, chains, chainColors }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const store = useGasStore();

  // Support both single and multi-chain mode
  const chainList = useMemo(() => chains || (chain ? [chain] : ['ethereum']), [chains, chain]);
  const colors = chainColors || DEFAULT_CHAIN_COLORS;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
      timeScale: {
        borderColor: '#2B2B43',
      },
    });

    // Add a candlestick series for each chain
    chainList.forEach((c) => {
      const color = colors[c] || '#888';
      const s = chart.addSeries(CandlestickSeries, {
        upColor: color,
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: color,
        wickDownColor: '#ef5350',
      });
      const chainState = store.chains[c];
      const candlestickData = createCandlestickData(chainState?.history || []);
      if (candlestickData.length > 0) {
        s.setData(candlestickData);
      }
    });

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [chainList, colors, store.chains]);

  // Show a legend and loading state
  const hasAnyData = chainList.some((c) => store.chains[c]?.history?.length > 0);

  if (!hasAnyData) {
    return (
      <div className="flex flex-col items-center justify-center h-72">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="text-gray-400">No data for selected chain(s). Check your RPC endpoints and try again.</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px]">
      <div ref={chartContainerRef} style={{ width: '100%', height: 300 }} />
      <div className="absolute top-2 left-2 flex gap-4 bg-gray-900/80 rounded px-3 py-1 text-xs font-semibold shadow">
        {chainList.map((c) => (
          <span key={c} className="flex items-center gap-1" style={{ color: colors[c] }}>
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: colors[c] }}></span>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}