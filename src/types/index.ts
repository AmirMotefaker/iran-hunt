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
  slug: string;
  tagline: string;
  description: string;
  longDescription?: string;        // توضیحات کامل HTML
  faDescription?: string;
  faLongDescription?: string;      // ترجمه توضیحات کامل
  faTagline?: string;
  category: string;
  categoryFa?: string;
  url: string;
  thumbnail?: string;
  screenshots?: string[];          // تصاویر محصول
  maker?: string;                  // سازنده
  makerTitle?: string;             // عنوان سازنده
  featuredAt?: string;             // تاریخ انتشار
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
