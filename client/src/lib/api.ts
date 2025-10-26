const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface SearchResponse {
  summary: string;
  keyData: Array<{
    label: string;
    value: string;
    positive?: boolean;
  }>;
  sources: Array<{
    id: number;
    title: string;
    url: string;
  }>;
}

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  price_change_24h: number;
  volume_24h: number;
  market_cap: number;
  market_cap_rank?: number;
}

interface BitcoinPrice {
  price: number;
  change_24h: number;
  volume_24h: number;
  market_cap: number;
}

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // AI endpoints
  async askQuestion(query: string): Promise<SearchResponse> {
    return this.request('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // Crypto endpoints
  async getCryptoData(limit: number = 100): Promise<CryptoData[]> {
    return this.request(`/crypto/data?limit=${limit}`);
  }

  async getBitcoinPrice(): Promise<BitcoinPrice> {
    return this.request('/crypto/bitcoin');
  }

  // Finance endpoints
  async getFinancialNews(query: string = '', limit: number = 5) {
    return this.request(`/finance/news?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async searchFinance(query: string) {
    return this.request(`/finance/search?query=${encodeURIComponent(query)}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
export type { SearchResponse, CryptoData, BitcoinPrice };