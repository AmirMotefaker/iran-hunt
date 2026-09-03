import type { Product } from '@/types';

export type ComparisonCandidate = {
  left: Product;
  right: Product;
  sharedSignals: string[];
};

export type ComparisonPair = {
  slug: string;
  leftSlug: string;
  rightSlug: string;
};

const normalize = (value?: string) => (value ?? '').toLowerCase().trim();

function productSignals(product: Product): string[] {
  return [product.category, product.categoryFa, product.tagline, product.faTagline]
    .flatMap((value) => (value ?? '').split('•'))
    .map(normalize)
    .filter(Boolean);
}

export function normalizeComparisonPair(leftSlug: string, rightSlug: string): ComparisonPair {
  const pair = [leftSlug.trim(), rightSlug.trim()]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return {
    leftSlug: pair[0] ?? '',
    rightSlug: pair[1] ?? '',
    slug: pair.length === 2 ? `${pair[0]}-vs-${pair[1]}` : '',
  };
}

export function parseComparisonSlug(slug: string): ComparisonPair | null {
  const separator = '-vs-';
  const index = slug.indexOf(separator);
  if (index <= 0) return null;

  const left = slug.slice(0, index);
  const right = slug.slice(index + separator.length);
  if (!left || !right) return null;

  return normalizeComparisonPair(left, right);
}

export function sharedProductSignals(left: Product, right: Product): string[] {
  const rightSignals = new Set(productSignals(right));
  return [...new Set(productSignals(left).filter((signal) => rightSignals.has(signal)))];
}

export function isComparisonEligible(left: Product, right: Product): boolean {
  if (!left.slug || !right.slug || left.slug === right.slug) return false;
  return sharedProductSignals(left, right).length > 0;
}

export function buildComparisonCandidate(
  left: Product,
  right: Product,
): ComparisonCandidate | null {
  if (!isComparisonEligible(left, right)) return null;

  const pair = normalizeComparisonPair(left.slug, right.slug);
  const orderedLeft = left.slug === pair.leftSlug ? left : right;
  const orderedRight = right.slug === pair.rightSlug ? right : left;

  return {
    left: orderedLeft,
    right: orderedRight,
    sharedSignals: sharedProductSignals(orderedLeft, orderedRight),
  };
}

export function rankAlternatives(
  target: Product,
  products: Product[],
  limit = 8,
): Product[] {
  return products
    .filter((candidate) => candidate.slug !== target.slug)
    .map((candidate) => ({
      candidate,
      shared: sharedProductSignals(target, candidate).length,
      votes: candidate.votes ?? 0,
    }))
    .filter((item) => item.shared > 0)
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        b.votes - a.votes ||
        a.candidate.slug.localeCompare(b.candidate.slug),
    )
    .slice(0, limit)
    .map((item) => item.candidate);
}

export function findComparisonProducts(
  products: Product[],
  leftSlug: string,
  rightSlug: string,
): ComparisonCandidate | null {
  const pair = normalizeComparisonPair(leftSlug, rightSlug);
  if (!pair.leftSlug || !pair.rightSlug) return null;

  const left = products.find((product) => product.slug === pair.leftSlug);
  const right = products.find((product) => product.slug === pair.rightSlug);
  if (!left || !right) return null;

  return buildComparisonCandidate(left, right);
}

export function buildEligibleAlternativeTargets(
  products: Product[],
  minimumAlternatives = 3,
): Product[] {
  return products
    .filter((product) => rankAlternatives(product, products, minimumAlternatives).length >= minimumAlternatives)
    .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0) || a.slug.localeCompare(b.slug));
}

export function buildEligibleComparisonPairs(
  products: Product[],
  comparisonsPerProduct = 2,
): ComparisonPair[] {
  const seen = new Set<string>();
  const pairs: ComparisonPair[] = [];

  for (const product of buildEligibleAlternativeTargets(products)) {
    for (const alternative of rankAlternatives(product, products, comparisonsPerProduct)) {
      const pair = normalizeComparisonPair(product.slug, alternative.slug);
      if (!pair.slug || seen.has(pair.slug)) continue;
      seen.add(pair.slug);
      pairs.push(pair);
    }
  }

  return pairs.sort((a, b) => a.slug.localeCompare(b.slug));
}
