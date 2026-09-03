import type { Product } from '@/types';

export type DecisionGuide = {
  slug: string;
  label: string;
  signal: string;
  products: Product[];
};

const normalize = (value?: string) => (value ?? '').trim();

function primarySignal(product: Product): string {
  return normalize(product.categoryFa) || normalize(product.category);
}

function guideSlug(signal: string): string {
  return signal
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export function rankGuideProducts(products: Product[], limit = 12): Product[] {
  return [...products]
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0) || a.slug.localeCompare(b.slug))
    .slice(0, limit);
}

export function buildDecisionGuides(
  products: Product[],
  minimumProducts = 5,
): DecisionGuide[] {
  const groups = new Map<string, Product[]>();

  for (const product of products) {
    const signal = primarySignal(product);
    if (!signal || !product.slug) continue;
    const current = groups.get(signal) ?? [];
    current.push(product);
    groups.set(signal, current);
  }

  return [...groups.entries()]
    .filter(([, items]) => items.length >= minimumProducts)
    .map(([signal, items]) => ({
      slug: guideSlug(signal),
      label: signal,
      signal,
      products: rankGuideProducts(items),
    }))
    .filter((guide) => Boolean(guide.slug))
    .sort((a, b) => b.products.length - a.products.length || a.slug.localeCompare(b.slug));
}

export function findDecisionGuide(products: Product[], slug: string): DecisionGuide | null {
  return buildDecisionGuides(products).find((guide) => guide.slug === slug) ?? null;
}
