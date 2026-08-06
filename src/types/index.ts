export type PeriodKey = 'today' | 'yesterday' | 'week' | 'month' | 'year';

export interface PeriodsData {
  today: Product[];
  yesterday: Product[];
  week: Product[];
  month: Product[];
  year: Product[];
}

export interface PHComment { user: string; text: string; }

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
  faDescription?: string;
  category: string;
  url: string;
  thumbnail?: string;
  votes: number;
  websiteUrl: string;
  comments?: PHComment[];
  faComments?: PHComment[];
  iranEquivalent?: IranEquivalent;
}

export interface DailyData {
  date: string;
  scrapedAt: string;
  periods: PeriodsData;
}
