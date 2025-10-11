import DataTable from "@/components/DataTable";

// TODO: remove mock functionality
const mockCryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: "$43,250", change: 2.3, volume: "$28.5B" },
  { symbol: "ETH", name: "Ethereum", price: "$2,280", change: -1.2, volume: "$12.3B" },
  { symbol: "SOL", name: "Solana", price: "$98.50", change: 5.7, volume: "$2.1B" },
  { symbol: "ADA", name: "Cardano", price: "$0.52", change: 3.4, volume: "$890M" },
  { symbol: "AVAX", name: "Avalanche", price: "$36.80", change: -2.1, volume: "$640M" },
  { symbol: "DOT", name: "Polkadot", price: "$7.85", change: 1.8, volume: "$320M" },
  { symbol: "MATIC", name: "Polygon", price: "$0.89", change: -0.5, volume: "$450M" },
  { symbol: "LINK", name: "Chainlink", price: "$14.60", change: 3.2, volume: "$580M" },
];

export default function Library() {
  return (
    <div className="p-6">
      <DataTable title="Cryptocurrency Market Data" data={mockCryptoData} />
    </div>
  );
}
