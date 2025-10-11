import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

// TODO: remove mock functionality
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    queries: "100 queries/day",
    features: [
      "Basic financial insights",
      "Access to crypto & stock data",
      "Standard support",
      "Includes ads",
    ],
    cta: "Current Plan",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Basic",
    price: "$1",
    period: "per month",
    queries: "500 queries/day",
    features: [
      "Enhanced AI responses",
      "Ad-free experience",
      "Priority API access",
      "Email support",
      "Export data (CSV)",
    ],
    cta: "Upgrade to Basic",
    variant: "default" as const,
    popular: true,
    solPrice: "0.05 SOL",
  },
  {
    name: "Premium",
    price: "$5",
    period: "per month",
    queries: "Unlimited queries",
    features: [
      "Everything in Basic",
      "Advanced chart tools",
      "Real-time WebSocket data",
      "Priority 24/7 support",
      "Custom API access",
      "Portfolio tracking",
    ],
    cta: "Upgrade to Premium",
    variant: "default" as const,
    popular: false,
    solPrice: "0.25 SOL",
  },
];

export default function PaymentPlans() {
  const handleSubscribe = (planName: string) => {
    console.log(`Subscribe to ${planName}`);
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-heading font-bold mb-4" data-testid="text-plans-title">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Unlock more insights with our flexible pricing options
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card
            className={`p-6 flex flex-col relative h-full ${
              plan.popular ? 'border-primary shadow-lg' : ''
            }`}
            data-testid={`card-plan-${plan.name.toLowerCase()}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" data-testid="badge-popular">
                Popular
              </Badge>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold" data-testid={`text-price-${plan.name.toLowerCase()}`}>
                  {plan.price}
                </span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              {plan.solPrice && (
                <p className="text-sm text-muted-foreground mt-1">
                  or {plan.solPrice} via Solana Pay
                </p>
              )}
            </div>

            <div className="mb-6">
              <p className="font-semibold mb-4">{plan.queries}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant={plan.variant}
              className="mt-auto w-full"
              onClick={() => handleSubscribe(plan.name)}
              data-testid={`button-subscribe-${plan.name.toLowerCase()}`}
            >
              {plan.cta}
            </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-12 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p>All plans include access to our AI-powered financial insights</p>
        <p className="mt-2">Payments processed securely via Stripe or Solana Pay</p>
      </motion.div>
    </motion.div>
  );
}
