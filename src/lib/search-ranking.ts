import type { PeriodKey, PeriodsData, Product } from '@/types';

const PERIOD_PRIORITY: Record<PeriodKey, number> = {
  today: 5,
  yesterday: 4,
  week: 3,
  month: 2,
  year: 1,
};

const normalize = (value: string | undefined) =>
  (value ?? '')
    .normalize('NFKC')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('fa-IR');

const fieldScore = (value: string | undefined, query: string, weights: [number, number, number]) => {
  const text = normalize(value);
  if (!text) return 0;
  if (text === query) return weights[0];
  if (text.startsWith(query)) return weights[1];
  if (text.includes(query)) return weights[2];
  return 0;
};

export type SearchResult = Pick<Product, 'slug' | 'name' | 'tagline' | 'votes' | 'thumbnail'> & {
  faTagline?: string;
};

export function rankSearchResults(periods: PeriodsData, rawQuery: string, limit = 8): SearchResult[] {
  const query = normalize(rawQuery);
  if (query.length < 2) return [];

  const candidates = new Map<string, { product: Product; score: number; periodPriority: number }>();

  for (const period of ['today', 'yesterday', 'week', 'month', 'year'] as const) {
    for (const product of periods[period] ?? []) {
      if (!product?.slug) continue;

      const score = Math.max(
        fieldScore(product.name, query, [1000, 900, 800]),
        fieldScore(product.faTagline, query, [760, 700, 620]),
        fieldScore(product.tagline, query, [720, 660, 580]),
        fieldScore(product.categoryFa, query, [540, 500, 460]),
        fieldScore(product.category, query, [500, 460, 420]),
        fieldScore(product.faDescription, query, [380, 340, 300]),
        fieldScore(product.description, query, [340, 300, 260]),
        fieldScore(product.faLongDescription, query, [240, 220, 200]),
        fieldScore(product.longDescription, query, [220, 200, 180]),
      );

      if (score === 0) continue;

      const current = candidates.get(product.slug);
      const candidate = { product, score, periodPriority: PERIOD_PRIORITY[period] };
      if (
        !current ||
        score > current.score ||
        (score === current.score && (product.votes ?? 0) > (current.product.votes ?? 0)) ||
        (score === current.score && (product.votes ?? 0) === (current.product.votes ?? 0) && candidate.periodPriority > current.periodPriority)
      ) {
        candidates.set(product.slug, candidate);
      }
    }
  }

  return [...candidates.values()]
    .sort((a, b) =>
      b.score - a.score ||
      (b.product.votes ?? 0) - (a.product.votes ?? 0) ||
      b.periodPriority - a.periodPriority ||
      a.product.slug.localeCompare(b.product.slug),
    )
    .slice(0, limit)
    .map(({ product }) => ({
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      faTagline: product.faTagline,
      votes: product.votes,
      thumbnail: product.thumbnail,
    }));
}
