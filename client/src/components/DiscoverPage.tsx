import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Newspaper, LineChart, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

// TODO: remove mock functionality
const topics = [
  {
    category: "Top",
    items: [
      {
        title: "Bitcoin Reaches New High",
        description: "BTC surpasses $44,000 amid institutional buying pressure",
        icon: TrendingUp,
        badge: "Trending",
      },
      {
        title: "Federal Reserve Interest Rate Decision",
        description: "Markets anticipate policy updates affecting forex and stocks",
        icon: Newspaper,
        badge: "Breaking",
      },
    ],
  },
  {
    category: "Finance",
    items: [
      {
        title: "Crypto Market Analysis",
        description: "Deep dive into altcoin performance and market trends",
        icon: LineChart,
        badge: "Analysis",
      },
      {
        title: "USD Strengthens Against Euro",
        description: "Dollar gains momentum as EUR/USD hits monthly low",
        icon: DollarSign,
        badge: "Forex",
      },
    ],
  },
  {
    category: "Tech & Innovation",
    items: [
      {
        title: "AI in Financial Trading",
        description: "How machine learning is transforming market predictions",
        icon: TrendingUp,
        badge: "Technology",
      },
    ],
  },
];

export default function DiscoverPage() {
  const handleTopicClick = (title: string) => {
    console.log("Topic clicked:", title);
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-6 py-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-heading font-bold mb-2" data-testid="text-discover-title">Discover</h1>
        <p className="text-lg text-muted-foreground">
          Explore curated financial topics and trending insights
        </p>
      </motion.div>

      {topics.map((section, sectionIndex) => (
        <motion.div 
          key={section.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + sectionIndex * 0.1 }}
        >
          <h2 className="text-2xl font-heading font-semibold mb-4" data-testid={`text-category-${section.category.toLowerCase()}`}>
            {section.category}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {section.items.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                className="p-6 hover-elevate active-elevate-2 cursor-pointer h-full"
                onClick={() => handleTopicClick(item.title)}
                data-testid={`card-topic-${idx}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <Badge variant="secondary" className="shrink-0">
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
