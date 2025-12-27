
export enum AssetType {
  CRYPTO = 'Crypto',
  STOCK = 'Stock',
  METAL = 'Metal',
  CASH = 'Cash'
}

export type Language = 'en' | 'cn';
export type Currency = 'USD' | 'CNY';

export type MBTI = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';
export type UserGender = 'male' | 'female';

export interface WardrobeItem {
  id: string;
  name: { en: string; cn: string };
  price: number;
  category: 'head' | 'body' | 'legs' | 'accessory';
  svgSnippet: string; // Dynamic SVG part to overlay
}

export interface UserStats {
  gender: UserGender;
  personality: MBTI;
  tokens: number;
  ownedItemIds: string[];
  equippedItemIds: string[];
  rank?: number; // Platform ranking
}

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
