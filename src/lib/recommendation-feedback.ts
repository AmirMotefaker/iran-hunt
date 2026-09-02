import type { PersonalizedDiscovery } from './dashboard-personalization';

export type RecommendationFeedbackState = {
  dismissed: string[];
  useful: string[];
};

export const EMPTY_RECOMMENDATION_FEEDBACK: RecommendationFeedbackState = {
  dismissed: [],
  useful: [],
};

export function recommendationFingerprint(item: PersonalizedDiscovery): string {
  return [item.source, item.label, item.query].map((part) => part.trim().toLocaleLowerCase('fa-IR')).join('::');
}

export function normalizeRecommendationFeedback(value: unknown): RecommendationFeedbackState {
  if (!value || typeof value !== 'object') return EMPTY_RECOMMENDATION_FEEDBACK;
  const input = value as Partial<RecommendationFeedbackState>;
  const normalizeList = (items: unknown) => Array.isArray(items)
    ? [...new Set(items.filter((item): item is string => typeof item === 'string' && item.trim().length > 0))]
    : [];
  return {
    dismissed: normalizeList(input.dismissed),
    useful: normalizeList(input.useful),
  };
}

export function applyRecommendationFeedback(
  items: PersonalizedDiscovery[],
  feedback: RecommendationFeedbackState,
): PersonalizedDiscovery[] {
  const normalized = normalizeRecommendationFeedback(feedback);
  const dismissed = new Set(normalized.dismissed);
  const useful = new Set(normalized.useful);

  const visible = items.filter((item) => !dismissed.has(recommendationFingerprint(item)));
  const ranked = visible
    .map((item, index) => ({ item, index, useful: useful.has(recommendationFingerprint(item)) ? 1 : 0 }))
    .sort((a, b) => b.useful - a.useful || a.index - b.index)
    .map(({ item }) => item);

  if (ranked.length > 0) return ranked;

  return [{
    source: 'fallback',
    label: 'ایده‌های تازه برای بررسی',
    reason: 'پیشنهادهای قبلی را کنار گذاشتی؛ از مسیر عمومی کشف ادامه بده.',
    query: '',
  }];
}

export function updateRecommendationFeedback(
  feedback: RecommendationFeedbackState,
  item: PersonalizedDiscovery,
  action: 'useful' | 'dismiss',
): RecommendationFeedbackState {
  const current = normalizeRecommendationFeedback(feedback);
  const fingerprint = recommendationFingerprint(item);
  const dismissed = new Set(current.dismissed);
  const useful = new Set(current.useful);

  if (action === 'dismiss') {
    dismissed.add(fingerprint);
    useful.delete(fingerprint);
  } else {
    useful.add(fingerprint);
    dismissed.delete(fingerprint);
  }

  return { dismissed: [...dismissed], useful: [...useful] };
}
