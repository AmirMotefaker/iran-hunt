export interface IranEquivalent {
  productName: string;
  description: string;
  marketOpportunity: string;
  estimatedBudget: string;
  targetAudience: string;
  challenges: string[];
  monetization: string[];
  techStack: string[];
  confidence: number;
}

export interface Product {
  id: string;
  date: string;
  rank: number;
  name: string;
  tagline: string;
  description: string;
  category: string;
  url: string;
  thumbnail?: string;
  votes: number;
  websiteUrl: string;
  iranEquivalent?: IranEquivalent;
}

export interface DailyData {
  date: string;
  scrapedAt: string;
  products: Product[];
}
