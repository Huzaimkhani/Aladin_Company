import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = "http://localhost:8000/api";

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  price_chg: number;
  image: string;
}

export default function Charts() {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [selectedCoinName, setSelectedCoinName] = useState("Bitcoin");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState(7);
  const [chartData, setChartData] = useState<any>(null);
  const [cryptoList, setCryptoList] = useState<CryptoAsset[]>([]);
  const [filteredList, setFilteredList] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const timeframes = [
    { label: "1D", days: 1 },
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
    { label: "1Y", days: 365 },
  ];

  // Fetch crypto list
  useEffect(() => {
    fetchCryptoList();
  }, []);

  // Fetch chart when coin or timeframe changes
  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [selectedCoin, timeframe]);

  // Filter list based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredList(cryptoList.slice(0, 20));
    } else {
      const filtered = cryptoList.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredList(filtered.slice(0, 20));
    }
  }, [searchQuery, cryptoList]);

  const fetchCryptoList = async () => {
    try {
      const response = await fetch(`${API_BASE}/crypto/list?limit=100`);
      const data = await response.json();
      setCryptoList(data.data || []);
      setFilteredList((data.data || []).slice(0, 20));
    } catch (error) {
      console.error("Failed to fetch crypto list:", error);
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/charts/crypto/${selectedCoin}?days=${timeframe}`);
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoinSelect = (coin: CryptoAsset) => {
    setSelectedCoin(coin.id);
    setSelectedCoinName(coin.name);
    setSearchQuery("");
  };

  const formatChartData = () => {
    if (!chartData?.prices || chartData.prices.length === 0) return [];

    return chartData.prices.map(([timestamp, price]: [number, number]) => {
      const date = new Date(timestamp);
      let timeLabel = "";

      if (timeframe === 1) {
        // For 1 day, show time (e.g., "10:00 AM")
        timeLabel = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      } else if (timeframe <= 7) {
        // For 7 days, show day and time (e.g., "Mon 10 AM")
        timeLabel = date.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit" });
      } else {
        // For longer periods, show date (e.g., "Jan 15")
        timeLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      return {
        time: timeLabel,
        price: parseFloat(price.toFixed(2)),
        rawPrice: price
      };
    });
  };

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Search */}
      <motion.div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Real-Time Crypto Charts</h1>
          <p className="text-muted-foreground">Track cryptocurrency prices and trends</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search crypto (e.g., Bitcoin, ETH)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Chart Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          {/* Chart Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-heading font-bold">{selectedCoinName}</h2>
                {chartData?.current_price && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-3xl font-mono font-bold">
                      ${chartData.current_price.toLocaleString()}
                    </p>
                    <Badge
                      variant="secondary"
                      className={chartData.change_24h >= 0 ? "text-success" : "text-danger"}
                    >
                      {chartData.change_24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {chartData.change_24h?.toFixed(2)}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex gap-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf.label}
                  variant={timeframe === tf.days ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf.days)}
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Chart */}
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : formatChartData().length === 0 ? (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">No chart data available. Try selecting 1Y timeframe.</p>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatChartData()}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    interval="preserveStartEnd"
                    minTickGap={30}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => {
                      if (value >= 1000) {
                        return `$${(value / 1000).toFixed(1)}k`;
                      } else if (value >= 1) {
                        return `$${value.toFixed(0)}`;
                      } else {
                        return `$${value.toFixed(2)}`;
                      }
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                            <p className="text-sm text-muted-foreground mb-1">{payload[0].payload.time}</p>
                            <p className="text-lg font-semibold font-mono">
                              ${parseFloat(payload[0].value as string).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}

          {/* Stats */}
          {chartData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-sm text-muted-foreground">Market Cap</p>
                <p className="text-lg font-semibold font-mono">
                  ${(chartData.market_cap / 1e9).toFixed(2)}B
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-lg font-semibold font-mono">
                  ${(chartData.volume_24h / 1e9).toFixed(2)}B
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h High</p>
                <p className="text-lg font-semibold font-mono">
                  ${(chartData.current_price * 1.05).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Low</p>
                <p className="text-lg font-semibold font-mono">
                  ${(chartData.current_price * 0.95).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Crypto List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-heading font-semibold mb-4">
            {searchQuery ? "Search Results" : "Top Cryptocurrencies"}
          </h3>
          <div className="grid gap-3">
            {filteredList.map((crypto, index) => (
              <motion.div
                key={crypto.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  onClick={() => handleCoinSelect(crypto)}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCoin === crypto.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {crypto.image && (
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    )}
                    <div>
                      <p className="font-semibold">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold">${crypto.price.toLocaleString()}</p>
                    <p
                      className={`text-sm font-mono ${
                        crypto.price_chg >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {crypto.price_chg >= 0 ? "+" : ""}
                      {crypto.price_chg.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}