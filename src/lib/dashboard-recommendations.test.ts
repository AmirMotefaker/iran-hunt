import { describe, expect, test } from 'bun:test';
import { buildDashboardRecommendations, recommendationHref } from './dashboard-recommendations';

describe('dashboard recommendations', () => {
  test('prioritizes profile expertise and role', () => {
    const items = buildDashboardRecommendations({ role: 'بنیان‌گذار', expertise: 'هوش مصنوعی' });
    expect(items[0]?.query).toBe('هوش مصنوعی بنیان‌گذار');
    expect(items[0]?.label).toContain('هوش مصنوعی');
  });

  test('uses saved discovery context when available', () => {
    const items = buildDashboardRecommendations(
      { role: 'مدیر محصول', expertise: 'فین‌تک' },
      [{ name: 'Ledgerly', tags: ['Finance'] }],
    );
    expect(items.some((item) => item.label.includes('Ledgerly'))).toBe(true);
    expect(items.some((item) => item.query.includes('Finance'))).toBe(true);
  });

  test('falls back cleanly without profile or bookmarks', () => {
    const items = buildDashboardRecommendations({});
    expect(items).toEqual([
      {
        label: 'ایده‌های تازه برای بررسی',
        reason: 'برای شروع دوباره مسیر کشف ایده‌ها',
        query: '',
      },
    ]);
    expect(recommendationHref('')).toBe('/products');
  });

  test('encodes recommendation search links', () => {
    expect(recommendationHref('هوش مصنوعی')).toBe('/search?q=%D9%87%D9%88%D8%B4%20%D9%85%D8%B5%D9%86%D9%88%D8%B9%DB%8C');
  });
});
