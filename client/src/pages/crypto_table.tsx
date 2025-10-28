import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import DataTable from "@/components/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatLargeNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
}

export default function CryptoTablePage() {
  const { data: cryptoData, isLoading, isError, error } = useQuery({
    queryKey: ['cryptoList'],
    queryFn: () => apiClient.getCryptoData(100),
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Data</AlertTitle>
          <AlertDescription>
            Could not load cryptocurrency data. Please try again later.
            <pre className="mt-2 text-xs">{error.message}</pre>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formattedData = cryptoData?.map(item => ({
    symbol: item.symbol,
    name: item.name,
    price: formatCurrency(item.price),
    change: item.price_chg || 0,
    volume: formatLargeNumber(item.volume_24h),
  })) || [];

  return (
    <div className="p-6">
      <DataTable title="Live Cryptocurrency Prices" data={formattedData} />
    </div>
  );
}