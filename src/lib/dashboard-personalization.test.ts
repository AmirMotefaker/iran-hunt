import { describe, expect, test } from 'bun:test';
import { buildPersonalizedDiscovery, personalizedDiscoveryHref } from './dashboard-personalization';

describe('dashboard behavioral personalization', () => {
  test('prioritizes saved-product category context when present', () => {
    const items = buildPersonalizedDiscovery(
      { role: 'مدیر محصول', expertise: 'فین‌تک' },
      [{ name: 'Ledgerly', categoryFa: 'مالی', faTagline: 'مدیریت مالی هوشمند' }],
    );

    expect(items[0]?.source).toBe('saved');
    expect(items[0]?.label).toContain('Ledgerly');
    expect(items[0]?.query).toContain('مالی');
    expect(items[0]?.query).toContain('فین‌تک');
  });

  test('uses real category fields before fallback tagline text', () => {
    const items = buildPersonalizedDiscovery(
      { expertise: 'هوش مصنوعی' },
      [{ name: 'AgentKit', category: 'Developer Tools', tagline: 'AI agents for teams' }],
    );

    expect(items[0]?.query.startsWith('Developer Tools')).toBe(true);
  });

  test('falls back to profile-only discovery without bookmarks', () => {
    const items = buildPersonalizedDiscovery({ role: 'بنیان‌گذار', expertise: 'سلامت دیجیتال' });

    expect(items[0]?.source).toBe('profile');
    expect(items[0]?.query).toBe('سلامت دیجیتال بنیان‌گذار');
  });

  test('provides a clean generic fallback with no context', () => {
    const items = buildPersonalizedDiscovery({});

    expect(items).toEqual([
      {
        label: 'ایده‌های تازه برای بررسی',
        reason: 'برای شروع مسیر کشف، از تازه‌ترین ایده‌های ایده‌جو استفاده کن',
        query: '',
        source: 'fallback',
      },
    ]);
    expect(personalizedDiscoveryHref('')).toBe('/products');
  });

  test('encodes personalized search links', () => {
    expect(personalizedDiscoveryHref('هوش مصنوعی')).toBe('/search?q=%D9%87%D9%88%D8%B4%20%D9%85%D8%B5%D9%86%D9%88%D8%B9%DB%8C');
  });
});
