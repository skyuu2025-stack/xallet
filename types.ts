
export enum AssetType {
  CRYPTO = 'Crypto',
  STOCK = 'Stock',
  METAL = 'Metal',
  CASH = 'Cash'
}

export type Language = 'en' | 'cn';
export type Currency = 'USD' | 'CNY';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: AssetType;
  amount: number;
  price: number; // Stored in USD base
  change24h: number;
  icon: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Expense {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
}

export interface IncomeRecord {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: string;
}
