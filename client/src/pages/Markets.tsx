import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, BarChart3, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type MarketType = "crypto" | "forex" | "stock";

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  price_chg: number;
  volume_24h: number;
  market_cap: number;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  change_percent: string;
  volume: number;
}

interface ForexData {
  pair: string;
  price: number;
  change: number;
}

type MarketData = CryptoData | StockData | ForexData;

const fetchForexData = async () => {
  const response = await fetch(
      `${import.meta.env.VITE_API_URL}/forex?apikey=${import.meta.env.ALPHA_VANTAGE_KEY}`
  );
  const data = await response.json();
  return data;
};

const fetchStockData = async () => {
  const response = await fetch(
      `${import.meta.env.VITE_API_URL}/stocks?apikey=${import.meta.env.ALPHA_VANTAGE_STOCK_KEY}`
  );
  const data = await response.json();
  return data;
};

export default function Markets() {
  const { toast } = useToast();
  const [selectedMarket, setSelectedMarket] = useState<MarketType>("crypto");
  const [searchQuery, setSearchQuery] = useState("");
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [forexData, setForexData] = useState<ForexData[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchMarketData = async (market: MarketType) => {
    setLoading(true);
    try {
      let endpoint = "";
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
      
      switch (market) {
        case "crypto":
          endpoint = `${API_BASE}/api/crypto/list?limit=100`;
          break;
        case "stock":
          endpoint = `${API_BASE}/api/stocks/list`;
          break;
        case "forex":
          endpoint = `${API_BASE}/api/finance/market-data`;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${market} data`);
      }

      const data = await response.json();
      
      // Handle different response structures
      if (market === "forex") {
        setMarketData(data.forex || []);
      } else {
        setMarketData(data.data || []);
      }
      
      setLastUpdate(new Date());
      
      toast({
        title: "Data Updated",
        description: `${market.charAt(0).toUpperCase() + market.slice(1)} data refreshed successfully`,
      });
    } catch (error) {
      console.error(`Error fetching ${market} data:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch ${market} data. Please try again.`,
      });
      setMarketData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData(selectedMarket);
  }, [selectedMarket]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchForexData();
      setForexData(data);
    };
    fetchData();

    const interval = setInterval(async () => {
      const data = await fetchForexData();
      setForexData(data);
    }, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
        const stockData = await fetchStockData();
        console.log("Stock Data:", stockData); // Log stock data
        setStockData(stockData);

        const forexData = await fetchForexData();
        console.log("Forex Data:", forexData); // Log forex data
        setForexData(forexData);
    };
    fetchData();
  }, []);

  const handleMarketChange = (market: MarketType) => {
    setSelectedMarket(market);
    setSearchQuery("");
  };

  const handleRefresh = () => {
    fetchMarketData(selectedMarket);
  };

  const filteredData = marketData.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    
    if (selectedMarket === "crypto" || selectedMarket === "stock") {
      const cryptoOrStock = item as CryptoData | StockData;
      return (
        cryptoOrStock.symbol?.toLowerCase().includes(searchLower) ||
        ("name" in cryptoOrStock && cryptoOrStock.name?.toLowerCase().includes(searchLower))
      );
    } else if (selectedMarket === "forex") {
      const forex = item as ForexData;
      return forex.pair?.toLowerCase().includes(searchLower) ?? false;
    }
    
    return false;
  });

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    } else if (price < 100) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    } else if (volume >= 1e3) {
      return `$${(volume / 1e3).toFixed(2)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  };

  const renderTableHeaders = () => {
    if (selectedMarket === "crypto") {
      return (
        <TableRow>
          <TableHead data-testid="header-symbol">Symbol</TableHead>
          <TableHead data-testid="header-name">Name</TableHead>
          <TableHead className="text-right" data-testid="header-price">Price</TableHead>
          <TableHead className="text-right" data-testid="header-change">24h Change</TableHead>
          <TableHead className="text-right" data-testid="header-volume">Volume (24h)</TableHead>
          <TableHead className="text-right" data-testid="header-market-cap">Market Cap</TableHead>
        </TableRow>
      );
    } else if (selectedMarket === "stock") {
      return (
        <TableRow>
          <TableHead data-testid="header-symbol">Symbol</TableHead>
          <TableHead className="text-right" data-testid="header-price">Price</TableHead>
          <TableHead className="text-right" data-testid="header-change">Change</TableHead>
          <TableHead className="text-right" data-testid="header-volume">Volume</TableHead>
          <TableHead className="text-right" data-testid="header-actions">Actions</TableHead>
        </TableRow>
      );
    } else {
      return (
        <TableRow>
          <TableHead data-testid="header-pair">Pair</TableHead>
          <TableHead className="text-right" data-testid="header-price">Price</TableHead>
          <TableHead className="text-right" data-testid="header-change">Change</TableHead>
        </TableRow>
      );
    }
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading {selectedMarket} data...</span>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (filteredData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
            No {selectedMarket} data available
          </TableCell>
        </TableRow>
      );
    }

    if (selectedMarket === "crypto") {
      return filteredData.map((item) => {
        const crypto = item as CryptoData;
        return (
          <TableRow key={crypto.symbol} className="hover-elevate" data-testid={`row-${crypto.symbol.toLowerCase()}`}>
            <TableCell className="font-mono font-semibold">{crypto.symbol}</TableCell>
            <TableCell className="text-muted-foreground">{crypto.name}</TableCell>
            <TableCell className="text-right font-mono">{formatPrice(crypto.price)}</TableCell>
            <TableCell className="text-right">
              <div className={`flex items-center justify-end gap-1 ${
                crypto.price_chg >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {crypto.price_chg >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-mono">
                  {crypto.price_chg >= 0 ? '+' : ''}{crypto.price_chg.toFixed(2)}%
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {formatVolume(crypto.volume_24h)}
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {formatVolume(crypto.market_cap)}
            </TableCell>
          </TableRow>
        );
      });
    } else if (selectedMarket === "stock") {
      return filteredData.map((item) => {
        const stock = item as StockData;
        const changePercent = parseFloat(stock.change_percent);
        return (
          <TableRow key={stock.symbol} className="hover-elevate" data-testid={`row-${stock.symbol.toLowerCase()}`}>
            <TableCell className="font-mono font-semibold">{stock.symbol}</TableCell>
            <TableCell className="text-right font-mono">{formatPrice(stock.price)}</TableCell>
            <TableCell className="text-right">
              <div className={`flex items-center justify-end gap-1 ${
                changePercent >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {changePercent >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-mono">
                  {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right font-mono text-muted-foreground">
              {stock.volume ? stock.volume.toLocaleString() : "N/A"}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => console.log(`View chart for ${stock.symbol}`)}
                data-testid={`button-chart-${stock.symbol.toLowerCase()}`}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return filteredData.map((item) => {
        const forex = item as ForexData;
        return (
          <TableRow key={forex.pair} className="hover-elevate" data-testid={`row-${forex.pair.toLowerCase().replace('/', '-')}`}>
            <TableCell className="font-mono font-semibold">{forex.pair}</TableCell>
            <TableCell className="text-right font-mono">{forex.price.toFixed(4)}</TableCell>
            <TableCell className="text-right">
              <div className={`
                forex.change >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {forex.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-mono">
                  {forex.change >= 0 ? '+' : ''}{forex.change.toFixed(4)}
                </span>
              </div>
            </TableCell>
          </TableRow>
        );
      });
    }
  };

  return (
    <motion.div 
      className="p-6 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2" data-testid="text-table-title">Markets</h1>
          <p className="text-muted-foreground">Real-time market data across all asset classes</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          data-testid="button-refresh"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant={selectedMarket === "crypto" ? "default" : "outline"}
              onClick={() => handleMarketChange("crypto")}
              data-testid="button-market-crypto"
            >
              Crypto
            </Button>
            <Button
              variant={selectedMarket === "forex" ? "default" : "outline"}
              onClick={() => handleMarketChange("forex")}
              data-testid="button-market-forex"
            >
              Forex
            </Button>
            <Button
              variant={selectedMarket === "stock" ? "default" : "outline"}
              onClick={() => handleMarketChange("stock")}
              data-testid="button-market-stock"
            >
              Stock
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-table-search"
            />
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                {renderTableHeaders()}
              </TableHeader>
              <TableBody>
                {renderTableRows()}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
            <p>Showing {filteredData.length} of {marketData.length} items</p>
            <p>Last updated: {lastUpdate.toLocaleTimeString()}</p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}