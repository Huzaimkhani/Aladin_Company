import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface SearchResultsProps {
  query?: string;
}

// TODO: remove mock functionality
const mockResponse = {
  summary: "Bitcoin (BTC) is currently trading at **$43,250** as of today. The cryptocurrency has shown a **2.3% increase** in the last 24 hours, with a total market cap of approximately **$845 billion**.",
  keyData: [
    { label: "Current Price", value: "$43,250" },
    { label: "24h Change", value: "+2.3%", positive: true },
    { label: "Market Cap", value: "$845B" },
    { label: "24h Volume", value: "$28.5B" },
  ],
  sources: [
    { id: 1, title: "CoinGecko - Bitcoin Price", url: "https://coingecko.com" },
    { id: 2, title: "CoinMarketCap - BTC Data", url: "https://coinmarketcap.com" },
    { id: 3, title: "Alpha Vantage - Crypto API", url: "https://alphavantage.co" },
  ],
};

export default function SearchResults({ query = "What's the current Bitcoin price?" }: SearchResultsProps) {
  const handleShare = () => {
    console.log("Share clicked");
  };

  const handleSourceClick = (url: string) => {
    console.log("Opening source:", url);
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto px-6 py-8 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p className="text-sm text-muted-foreground mb-2">Your question:</p>
          <h1 className="text-2xl font-heading font-semibold" data-testid="text-query">{query}</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleShare} data-testid="button-share">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4">Summary</h2>
          <div className="prose prose-invert max-w-none" data-testid="text-ai-response">
            <p>{mockResponse.summary}</p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4">Key Data</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {mockResponse.keyData.map((item, idx) => (
            <div key={idx} className="space-y-1" data-testid={`stat-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`text-xl font-semibold font-mono ${
                item.positive !== undefined 
                  ? item.positive ? 'text-success' : 'text-danger'
                  : ''
              }`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
        </Card>
      </motion.div>

      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-lg font-heading font-semibold">Sources</h2>
        <div className="space-y-2">
          {mockResponse.sources.map((source) => (
            <button
              key={source.id}
              onClick={() => handleSourceClick(source.url)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left"
              data-testid={`link-source-${source.id}`}
            >
              <Badge variant="outline" className="shrink-0">{source.id}</Badge>
              <span className="flex-1">{source.title}</span>
              <ExternalLink className="w-4 h-4 shrink-0" />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
