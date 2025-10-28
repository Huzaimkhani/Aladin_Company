import { useState } from "react";
import { Search, MessageSquare, BarChart, CandlestickChart, Landmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "./ui/button";

const quickTopics = [
  {
    title: "Ask Finance Question",
    description: "Comprehensive financial research",
    icon: MessageSquare,
    view: "ask",
  },
  {
    title: "Live Crypto Table",
    description: "Live cryptocurrency data & insights",
    icon: BarChart,
    view: "crypto_table",
  },
  {
    title: "Live Stock Table",
    description: "Real-time stock market data",
    icon: CandlestickChart,
    view: "stock_table",
  },
  {
    title: "Live Forex Table",
    description: "Major foreign exchange rates",
    icon: Landmark,
    view: "forex_table",
  },
];

interface HomePageProps {
  queriesUsed?: number;
  queriesLimit?: number;
}

export default function HomePage({ queriesUsed = 47, queriesLimit = 100 }: HomePageProps) {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      // Navigate to the /search page with the query as a URL parameter
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleTopicClick = (viewPath: string) => {
    // Navigate to the specified view path
    setLocation(`/${viewPath}`);
  };

  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation(); // wouter hook for navigation

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 -mt-16">
      <div className="w-full max-w-4xl space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-gradient-brand">
            Discover Magic Search at Aladin.AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore Personalized Insights in Crypto, Finance, and Stocks.
          </p>
        </motion.div>

        <Card className="p-6 sm:p-8 shadow-lg border-card-border">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-heading">🧞‍♂️ Talk to Aladin AI</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="e.g., What's the current trend for Bitcoin?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-background border-input"
                  data-testid="input-search"
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-brand text-primary-foreground text-lg">
                ✨ Get Magic Insights
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-2xl font-heading font-semibold text-center mb-6">Or Explore Markets Directly</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTopics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="h-full"
            >
              <Card
                className="p-6 hover-elevate-2 active-elevate-2 cursor-pointer h-full flex flex-col items-center justify-center text-center"
                onClick={() => handleTopicClick(topic.view)}
                data-testid={`card-topic-${topic.view}`}
              >
                <topic.icon className="w-10 h-10 mb-3 text-primary" />
                <h3 className="font-heading font-semibold mb-1">{topic.title}</h3>
                <p className="text-sm text-muted-foreground">{topic.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
