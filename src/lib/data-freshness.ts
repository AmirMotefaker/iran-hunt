import type { PeriodKey, PeriodsData } from '@/types';

const PERIOD_PRIORITY: PeriodKey[] = ['today', 'yesterday', 'week', 'month', 'year'];

export type FreshnessState = 'fresh' | 'stale' | 'unknown';

export function selectDefaultPeriod(periods: PeriodsData): PeriodKey {
  return PERIOD_PRIORITY.find((key) => (periods[key] ?? []).length > 0) ?? 'today';
}

export function getFreshnessState(scrapedAt: string, now = new Date()): FreshnessState {
  const scrapedTime = new Date(scrapedAt).getTime();
  if (!Number.isFinite(scrapedTime)) return 'unknown';

  const ageMs = now.getTime() - scrapedTime;
  if (ageMs < 0) return 'unknown';
  return ageMs <= 36 * 60 * 60 * 1000 ? 'fresh' : 'stale';
}

export function formatTehranTimestamp(scrapedAt: string): string | null {
  const date = new Date(scrapedAt);
  if (!Number.isFinite(date.getTime())) return null;

  return new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
