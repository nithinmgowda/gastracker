# ⛽ Cross-Chain Gas Tracker

A modern, real-time dashboard for tracking gas prices, simulating transaction costs, and visualizing gas trends across Ethereum, Polygon, and Arbitrum.

---

## 🚀 Features

- **Live Gas Price Widgets**: Real-time base fee, priority fee, and USD cost for each chain.
- **Interactive Candlestick Chart**: Visualize gas price history for any chain, with 15-min OHLC aggregation.
- **Multi-Chain Comparison Chart**: Compare gas price trends for Ethereum, Polygon, and Arbitrum side by side.
- **Transaction Simulator**: Instantly estimate transaction costs across all chains in both native and USD.
- **Dark Mode UI**: Clean, accessible, and visually appealing interface.
- **Zustand State Management**: Fast, reliable state for all live data.

---

## 🛠️ Setup

1. **Clone the repo & install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd zen
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory with:
   ```env
   NEXT_PUBLIC_INFURA_WSS=wss://mainnet.infura.io/ws/v3/YOUR_INFURA_KEY
   NEXT_PUBLIC_POLYGON_RPC=wss://polygon-mainnet.infura.io/ws/v3/YOUR_INFURA_KEY
   NEXT_PUBLIC_ARBITRUM_RPC=wss://arbitrum-mainnet.infura.io/ws/v3/YOUR_INFURA_KEY
   ```
   > Get your keys from [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/).

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Usage

- **Chain Selector:** Switch between Ethereum, Polygon, and Arbitrum for focused charting.
- **Multi-Chain Chart:** Scroll down to compare all three chains in one chart.
- **Live Gas Info:** See up-to-date gas stats and USD cost for each chain.
- **Transaction Simulator:** Enter a transaction amount and instantly see cost estimates for all chains.

---

## ⚙️ Customization

- **Colors & Branding:**
  - Edit `src/app/page.tsx` and `src/charts/CandlestickChart.tsx` for chain colors.
- **Chart Intervals:**
  - Change the aggregation interval in `createCandlestickData` in `CandlestickChart.tsx`.
- **Add More Chains:**
  - Add to the `CHAIN_COLORS`, `CHAIN_LABELS`, and update the Zustand store/types.

---

## 🐛 Troubleshooting

- **No data?**
  - Check your `.env.local` for correct WebSocket URLs and keys.
  - Make sure your Infura/Alchemy project is enabled for all networks.
  - Restart your dev server after any `.env.local` changes.
- **Chart not updating?**
  - Check browser console for errors.
  - Ensure WebSocket connections are not blocked by your firewall or browser.

---

## 📦 Tech Stack
- Next.js 15 (App Router)
- React 19
- Zustand
- ethers.js
- lightweight-charts
- Tailwind CSS

---

## 📄 License
MIT
