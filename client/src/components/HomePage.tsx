import { useState } from "react";
import { Search, TrendingUp, LineChart, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const quickTopics = [
  {
    title: "Crypto Trends",
    description: "Latest cryptocurrency market movements",
    icon: TrendingUp,
    color: "text-chart-1",
  },
  {
    title: "Stock Analysis",
    description: "Real-time stock market insights",
    icon: LineChart,
    color: "text-chart-2",
  },
  {
    title: "Forex Rates",
    description: "Live foreign exchange data",
    icon: DollarSign,
    color: "text-chart-3",
  },
];

interface HomePageProps {
  queriesUsed?: number;
  queriesLimit?: number;
}

export default function HomePage({ queriesUsed = 47, queriesLimit = 100 }: HomePageProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search query:", query);
  };

  const handleTopicClick = (topic: string) => {
    console.log("Topic clicked:", topic);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-heading font-bold text-gradient-brand" data-testid="text-logo">Aladin.AI</h1>
        </div>
        <Badge variant="secondary" data-testid="badge-query-counter">
          {queriesUsed}/{queriesLimit} queries today
        </Badge>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        <div className="w-full max-w-3xl space-y-8">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight" data-testid="text-hero-title">
              Ask Aladin anything finance-related
            </h2>
            <p className="text-muted-foreground text-lg">
              Get AI-powered insights on crypto, stocks, forex, and more
            </p>
          </motion.div>

          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="e.g., What's the current Bitcoin price?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-16 text-lg bg-card border-card-border"
                data-testid="input-search"
              />
            </div>
          </form>

          <div className="grid md:grid-cols-3 gap-4">
            {quickTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="p-6 hover-elevate active-elevate-2 cursor-pointer h-full"
                  onClick={() => handleTopicClick(topic.title)}
                  data-testid={`card-topic-${topic.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <topic.icon className={`w-10 h-10 mb-3 ${topic.color}`} />
                  <h3 className="font-heading font-semibold mb-1">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-muted-foreground">
        <p>Disclaimer: Not financial advice. Always do your own research.</p>
      </footer>
    </div>
  );
}
