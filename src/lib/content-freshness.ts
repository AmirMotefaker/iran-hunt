import type { Product } from '@/types';

export type FreshnessStatus = 'fresh' | 'aging' | 'stale' | 'unknown';

export type FreshnessSignal = {
  status: FreshnessStatus;
  score: number | null;
  dataDate?: string;
  ageDays?: number;
};

export type AggregateFreshness = {
  status: FreshnessStatus;
  score: number | null;
  latestDataDate?: string;
  freshCount: number;
  agingCount: number;
  staleCount: number;
  unknownCount: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeDate(value?: string): Date | null {
  if (!value?.trim()) return null;
  const date = new Date(`${value.trim()}T00:00:00Z`);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function classifyFreshness(dataDate?: string, now = new Date()): FreshnessSignal {
  const date = normalizeDate(dataDate);
  if (!date) return { status: 'unknown', score: null };

  const normalizedNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const ageDays = Math.floor((normalizedNow.getTime() - date.getTime()) / DAY_MS);

  if (ageDays < 0) return { status: 'unknown', score: null, dataDate };

  const status: FreshnessStatus = ageDays <= 7 ? 'fresh' : ageDays <= 30 ? 'aging' : 'stale';
  const score = Math.max(0, Math.min(100, 100 - ageDays * 2));

  return { status, score, dataDate, ageDays };
}

export function productFreshness(product: Product, now = new Date()): FreshnessSignal {
  return classifyFreshness(product.date, now);
}

export function aggregateFreshness(products: Product[], now = new Date()): AggregateFreshness {
  const signals = products.map((product) => productFreshness(product, now));
  const dated = signals.filter((signal) => signal.dataDate && signal.score !== null);
  const scores = dated.map((signal) => signal.score as number);
  const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;

  const latestDataDate = dated
    .map((signal) => signal.dataDate as string)
    .sort((a, b) => b.localeCompare(a))[0];

  const freshCount = signals.filter((signal) => signal.status === 'fresh').length;
  const agingCount = signals.filter((signal) => signal.status === 'aging').length;
  const staleCount = signals.filter((signal) => signal.status === 'stale').length;
  const unknownCount = signals.filter((signal) => signal.status === 'unknown').length;

  const status: FreshnessStatus =
    signals.length === 0 || unknownCount === signals.length
      ? 'unknown'
      : staleCount > signals.length / 2
        ? 'stale'
        : agingCount + staleCount > signals.length / 2
          ? 'aging'
          : 'fresh';

  return {
    status,
    score: average,
    latestDataDate,
    freshCount,
    agingCount,
    staleCount,
    unknownCount,
  };
}

export function freshnessLabel(status: FreshnessStatus): string {
  if (status === 'fresh') return 'داده تازه';
  if (status === 'aging') return 'داده در حال قدیمی‌شدن';
  if (status === 'stale') return 'داده قدیمی';
  return 'تازگی نامشخص';
}
