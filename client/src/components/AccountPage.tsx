import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Crown, LogOut } from "lucide-react";

// TODO: remove mock functionality
const searchHistory = [
  { id: 1, query: "What's the current Bitcoin price?", timestamp: "2 hours ago" },
  { id: 2, query: "Ethereum price prediction 2024", timestamp: "5 hours ago" },
  { id: 3, query: "Best forex pairs to trade today", timestamp: "1 day ago" },
  { id: 4, query: "Apple stock analysis", timestamp: "2 days ago" },
  { id: 5, query: "USD to EUR exchange rate", timestamp: "3 days ago" },
];

interface AccountPageProps {
  queriesUsed?: number;
  queriesLimit?: number;
  planName?: string;
  planExpiry?: string;
}

export default function AccountPage({
  queriesUsed = 47,
  queriesLimit = 100,
  planName = "Free",
  planExpiry = "N/A",
}: AccountPageProps) {
  const usagePercentage = (queriesUsed / queriesLimit) * 100;

  const handleRerun = (query: string) => {
    console.log("Rerun query:", query);
  };

  const handleDelete = (id: number) => {
    console.log("Delete query:", id);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" data-testid="text-account-title">Account Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Query Usage</p>
              <p className="text-2xl font-bold" data-testid="text-query-usage">
                {queriesUsed}/{queriesLimit}
              </p>
            </div>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">Resets daily</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-chart-2/10 rounded-lg">
              <Crown className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-2xl font-bold" data-testid="text-plan-name">{planName}</p>
            </div>
          </div>
          <Badge variant="outline" className="mt-2">Active</Badge>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Plan Expiry</p>
            <p className="text-lg font-semibold" data-testid="text-plan-expiry">{planExpiry}</p>
          </div>
          <Button variant="ghost" className="mt-2 p-0 h-auto" data-testid="link-upgrade">
            Upgrade Plan →
          </Button>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Search History</h2>
        <div className="space-y-3">
          {searchHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg hover-elevate border border-border"
              data-testid={`history-item-${item.id}`}
            >
              <div className="flex-1">
                <p className="font-medium">{item.query}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.timestamp}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRerun(item.query)}
                  data-testid={`button-rerun-${item.id}`}
                >
                  Rerun
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  data-testid={`button-delete-${item.id}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
