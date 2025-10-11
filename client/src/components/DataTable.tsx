import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

interface DataItem {
  symbol: string;
  name: string;
  price: string;
  change: number;
  volume: string;
}

interface DataTableProps {
  title: string;
  data: DataItem[];
}

export default function DataTable({ title, data }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof DataItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof DataItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    console.log(`Sorting by ${field} ${sortDirection}`);
  };

  const handleViewChart = (symbol: string) => {
    console.log(`View chart for ${symbol}`);
  };

  const filteredData = data.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-4"
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
        <h1 className="text-3xl font-heading font-bold" data-testid="text-table-title">{title}</h1>
      </motion.div>

      <div className="relative">
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
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('symbol')}
                data-testid="header-symbol"
              >
                Symbol
              </TableHead>
              <TableHead data-testid="header-name">Name</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 text-right"
                onClick={() => handleSort('price')}
                data-testid="header-price"
              >
                Price
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 text-right"
                onClick={() => handleSort('change')}
                data-testid="header-change"
              >
                24h Change
              </TableHead>
              <TableHead className="text-right" data-testid="header-volume">Volume</TableHead>
              <TableHead className="text-right" data-testid="header-actions">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.symbol} className="hover-elevate" data-testid={`row-${item.symbol.toLowerCase()}`}>
                <TableCell className="font-mono font-semibold">{item.symbol}</TableCell>
                <TableCell className="text-muted-foreground">{item.name}</TableCell>
                <TableCell className="text-right font-mono">{item.price}</TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 ${
                    item.change >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {item.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-mono">
                      {item.change >= 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  {item.volume}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewChart(item.symbol)}
                    data-testid={`button-chart-${item.symbol.toLowerCase()}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {filteredData.length} of {data.length} items</p>
        <p>Updated: Just now</p>
      </div>
    </motion.div>
  );
}
