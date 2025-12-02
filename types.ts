
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  images?: string[];
  inStock: boolean;
  company?: string;
  quantity?: number;
  suitableSoil?: string;
  ratings?: number[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface User {
  name: string;
  phone: string;
}

export enum AppView {
  HOME = 'HOME',
  PRODUCTS = 'PRODUCTS',
  ADVISOR = 'ADVISOR',
  SCHEMES = 'SCHEMES',
  ADVISORY = 'ADVISORY',
  CONTACT = 'CONTACT',
  LOGIN = 'LOGIN',
  VISITORS = 'VISITORS'
}

export interface MarketRate {
  id: string;
  date: string;
  crop: string;
  market: string;
  price: string;
  trend: string;
  isAiVerified?: boolean;
}

export interface BullionRate {
  id: string;
  date: string;
  metal: string;
  price: string;
  trend: string;
  isAiVerified?: boolean;
}

export interface FarmerProfile {
  id: string;
  name: string;
  location: string;
  achievement: string;
  image: string;
  year: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface CropSchedule {
  stage: string;
  timing: string;
  activities: string[];
}

export interface CropGuide {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  preparation: string[];
  sowing: {
    period: string;
    method: string;
    seedRate: string;
  };
  fertilizer: CropSchedule[];
  spraying: CropSchedule[];
  diseases: {
    name: string;
    symptoms: string;
    solution: string;
  }[];
  irrigation: string[];
  yieldEstimate: string;
}

export interface Visitor {
  id: string;
  name: string;
  mobile: string;
  village: string;
  date: string;
}

export interface DailyWeather {
  date: string;
  day: string;
  temp: number;
  condition: string;
  rainChance: number;
  windSpeed: number;
  humidity: number;
  isSpraySafe: boolean;
}

export type Language = 'en' | 'mr';