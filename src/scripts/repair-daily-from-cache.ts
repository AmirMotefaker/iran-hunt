import { loadCorpus } from '@/lib/corpus';
import { assertValidPeriods } from '@/lib/scrape-validation';
import { TOP_COUNT } from '@/lib/scraper';
import { saveDaily } from '@/lib/storage';
import { dateInTehran, startOfProductHuntDayUtc } from '@/lib/tehran-date';
import type { PeriodKey, PeriodsData, Product } from '@/types';

const now = new Date();

function selectPeriod(products: Product[], key: PeriodKey): Product[] {
  let after: Date;
  let before: Date;

  switch (key) {
    case 'today':
      after = startOfProductHuntDayUtc(now, 0);
      before = now;
      break;
    case 'yesterday':
      after = startOfProductHuntDayUtc(now, 1);
      before = startOfProductHuntDayUtc(now, 0);
      break;
    case 'week':
      after = new Date(now.getTime() - 7 * 86_400_000);
      before = now;
      break;
    case 'month':
      after = new Date(now.getTime() - 30 * 86_400_000);
      before = now;
      break;
    case 'year':
      after = new Date(now.getTime() - 365 * 86_400_000);
      before = now;
      break;
  }

  const unique = new Map<string, Product>();
  for (const product of products) {
    if (!product.slug || !product.featuredAt || (product.votes ?? 0) <= 0) continue;
    const featuredAt = new Date(product.featuredAt);
    if (Number.isNaN(featuredAt.getTime()) || featuredAt < after || featuredAt >= before) continue;
    const existing = unique.get(product.slug);
    if (!existing || (product.votes ?? 0) > (existing.votes ?? 0)) unique.set(product.slug, product);
  }

  return [...unique.values()]
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0) || a.slug.localeCompare(b.slug))
    .slice(0, TOP_COUNT)
    .map((product, index) => ({ ...product, id: `ph-${key}-${index + 1}`, rank: index + 1 }));
}

const corpus = await loadCorpus();
const periods = {
  today: selectPeriod(corpus.products, 'today'),
  yesterday: selectPeriod(corpus.products, 'yesterday'),
  week: selectPeriod(corpus.products, 'week'),
  month: selectPeriod(corpus.products, 'month'),
  year: selectPeriod(corpus.products, 'year'),
} satisfies PeriodsData;

console.log('♻️  Rebuilding daily snapshot from persisted Product Hunt evidence');
for (const [key, products] of Object.entries(periods)) {
  console.log(`   ${key}: ${products.length} trusted products`);
}

assertValidPeriods(periods);
await saveDaily(dateInTehran(now), periods, { replaceCurrent: true });
console.log('✅ Cached evidence recovery produced a valid daily snapshot.');
