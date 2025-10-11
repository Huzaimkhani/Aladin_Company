import DataTable from '../DataTable'

// TODO: remove mock functionality
const mockCryptoData = [
  { symbol: "BTC", name: "Bitcoin", price: "$43,250", change: 2.3, volume: "$28.5B" },
  { symbol: "ETH", name: "Ethereum", price: "$2,280", change: -1.2, volume: "$12.3B" },
  { symbol: "SOL", name: "Solana", price: "$98.50", change: 5.7, volume: "$2.1B" },
  { symbol: "ADA", name: "Cardano", price: "$0.52", change: 3.4, volume: "$890M" },
  { symbol: "AVAX", name: "Avalanche", price: "$36.80", change: -2.1, volume: "$640M" },
];

export default function DataTableExample() {
  return <DataTable title="Cryptocurrency Prices" data={mockCryptoData} />
}
