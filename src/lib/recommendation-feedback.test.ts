import { describe, expect, test } from 'bun:test';
import {
  applyRecommendationFeedback,
  EMPTY_RECOMMENDATION_FEEDBACK,
  recommendationFingerprint,
  updateRecommendationFeedback,
} from './recommendation-feedback';

const saved = {
  source: 'saved' as const,
  label: 'مشابه Ledgerly',
  reason: 'بر اساس ذخیره‌های تو',
  query: 'فین تک',
};

const profile = {
  source: 'profile' as const,
  label: 'برای مدیر محصول',
  reason: 'بر اساس پروفایل تو',
  query: 'مدیر محصول هوش مصنوعی',
};

describe('recommendation feedback', () => {
  test('dismissed recommendation is suppressed', () => {
    const feedback = updateRecommendationFeedback(EMPTY_RECOMMENDATION_FEEDBACK, saved, 'dismiss');
    const items = applyRecommendationFeedback([saved, profile], feedback);
    expect(items).toEqual([profile]);
  });

  test('useful recommendation moves ahead of neutral candidates', () => {
    const feedback = updateRecommendationFeedback(EMPTY_RECOMMENDATION_FEEDBACK, profile, 'useful');
    const items = applyRecommendationFeedback([saved, profile], feedback);
    expect(items[0]).toEqual(profile);
  });

  test('feedback actions are mutually exclusive', () => {
    const useful = updateRecommendationFeedback(EMPTY_RECOMMENDATION_FEEDBACK, saved, 'useful');
    const dismissed = updateRecommendationFeedback(useful, saved, 'dismiss');
    const fingerprint = recommendationFingerprint(saved);
    expect(dismissed.dismissed).toContain(fingerprint);
    expect(dismissed.useful).not.toContain(fingerprint);
  });

  test('safe fallback remains when every candidate is dismissed', () => {
    let feedback = updateRecommendationFeedback(EMPTY_RECOMMENDATION_FEEDBACK, saved, 'dismiss');
    feedback = updateRecommendationFeedback(feedback, profile, 'dismiss');
    const items = applyRecommendationFeedback([saved, profile], feedback);
    expect(items[0]?.source).toBe('fallback');
    expect(items[0]?.query).toBe('');
  });
});
