import { CATEGORY_TREE, MAIN_TOPICS, slugifyMainCategory } from '@/lib/categoryTree';
import type { Product } from '@/types';

export type DiscoveryTopic = {
  slug: string;
  name: string;
  fa: string;
  summary: string;
  products: Product[];
};

const normalize = (value?: string) => (value ?? '').toLowerCase().trim();

function productMatchesTopic(product: Product, topicName: string): boolean {
  const haystack = normalize([
    product.category,
    product.categoryFa,
    product.tagline,
    product.faTagline,
  ].filter(Boolean).join(' • '));

  const terms = [topicName, ...(MAIN_TOPICS[topicName] ?? [])]
    .map(normalize)
    .filter(Boolean);

  return terms.some((term) => haystack.includes(term));
}

export function buildDiscoveryTopics(
  products: Product[],
  minimumProducts = 3,
): DiscoveryTopic[] {
  return CATEGORY_TREE.map((category) => {
    const matches = products
      .filter((product) => productMatchesTopic(product, category.name))
      .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));

    return {
      slug: slugifyMainCategory(category.name),
      name: category.name,
      fa: category.fa,
      summary: `بهترین محصولات و ایده‌های ثبت‌شده ایده‌جو در حوزه ${category.fa}، با داده واقعی، رتبه‌بندی و تحلیل فارسی.`,
      products: matches,
    };
  }).filter((topic) => topic.products.length >= minimumProducts);
}

export function findDiscoveryTopic(
  products: Product[],
  slug: string,
  minimumProducts = 3,
): DiscoveryTopic | null {
  return (
    buildDiscoveryTopics(products, minimumProducts).find(
      (topic) => topic.slug === slug,
    ) ?? null
  );
}
