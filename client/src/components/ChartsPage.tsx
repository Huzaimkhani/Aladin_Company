import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { motion } from "framer-motion";

// TODO: remove mock functionality
const generateMockData = (days: number) => {
  const data = [];
  const basePrice = 43000;
  for (let i = 0; i < days; i++) {
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: basePrice + Math.random() * 5000 - 2500,
    });
  }
  return data;
};

const timeframes = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

export default function ChartsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState(30);
  const chartData = generateMockData(selectedTimeframe);

  const chartConfig = {
    price: {
      label: "Price",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-6 py-8 space-y-6"
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
          <h1 className="text-3xl font-heading font-bold mb-2" data-testid="text-chart-title">Bitcoin Price Chart</h1>
          <p className="text-muted-foreground">Historical price data and trends</p>
        </div>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf.label}
              variant={selectedTimeframe === tf.days ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(tf.days)}
              data-testid={`button-timeframe-${tf.label.toLowerCase()}`}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="text-3xl font-bold font-mono" data-testid="text-current-price">$43,250</p>
          </div>
          <Badge variant="secondary" className="text-success">
            +2.3% Today
          </Badge>
        </div>

        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltipContent />} />
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
        </Card>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">24h High</p>
          <p className="text-xl font-semibold font-mono" data-testid="text-high">$44,120</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">24h Low</p>
          <p className="text-xl font-semibold font-mono" data-testid="text-low">$42,580</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
          <p className="text-xl font-semibold font-mono" data-testid="text-volume">$28.5B</p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
