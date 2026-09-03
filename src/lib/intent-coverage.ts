import type { Product } from '@/types';
import { buildDecisionGuides } from '@/lib/decision-guides';
import {
  buildEligibleAlternativeTargets,
  buildEligibleComparisonPairs,
} from '@/lib/comparison-engine';

export type IntentType =
  | 'navigational'
  | 'informational'
  | 'comparison'
  | 'alternatives'
  | 'category-discovery'
  | 'decision-guide';

export type IntentCandidate = {
  key: string;
  type: IntentType;
  label: string;
  productSlugs: string[];
  evidenceCount: number;
  priority: number;
  coveredBy?: string;
};

export type IntentCoverageSurfaceIndex = {
  alternativeSlugs: Set<string>;
  comparisonSlugs: Set<string>;
  guideSlugs: Set<string>;
};

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[\u200c\u200f\u202a-\u202e]/g, '');

const slugify = (value: string) =>
  normalize(value)
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

function categoryLabels(product: Product): string[] {
  const raw = [product.categoryFa, product.category].filter(Boolean).join('•');
  return raw
    .split('•')
    .map((value) => value.trim())
    .filter(Boolean);
}

export function buildIntentKey(type: IntentType, label: string): string {
  return `${type}:${slugify(label)}`;
}

export function buildIntentCoverageSurfaceIndex(products: Product[]): IntentCoverageSurfaceIndex {
  return {
    alternativeSlugs: new Set(buildEligibleAlternativeTargets(products).map((product) => product.slug)),
    comparisonSlugs: new Set(buildEligibleComparisonPairs(products).map((pair) => pair.slug)),
    guideSlugs: new Set(buildDecisionGuides(products).map((guide) => guide.slug)),
  };
}

export function deriveIntentCandidates(products: Product[]): IntentCandidate[] {
  const map = new Map<string, IntentCandidate>();
  const surfaces = buildIntentCoverageSurfaceIndex(products);

  const add = (
    type: IntentType,
    label: string,
    productSlug: string,
    coveredBy?: string,
  ) => {
    const cleanLabel = label.trim();
    if (!cleanLabel) return;

    const key = buildIntentKey(type, cleanLabel);
    const current = map.get(key) ?? {
      key,
      type,
      label: cleanLabel,
      productSlugs: [],
      evidenceCount: 0,
      priority: 0,
      coveredBy,
    };

    if (!current.productSlugs.includes(productSlug)) {
      current.productSlugs.push(productSlug);
      current.evidenceCount += 1;
    }

    if (!current.coveredBy && coveredBy) current.coveredBy = coveredBy;
    map.set(key, current);
  };

  for (const product of products) {
    add('navigational', product.name, product.slug, `/product/${product.slug}`);
    add(
      'informational',
      product.faDescription || product.faTagline || product.description || product.tagline || product.name,
      product.slug,
      `/product/${product.slug}`,
    );

    add(
      'alternatives',
      product.name,
      product.slug,
      surfaces.alternativeSlugs.has(product.slug) ? `/alternatives/${product.slug}` : undefined,
    );

    for (const category of categoryLabels(product)) {
      const categorySlug = slugify(category);
      add('category-discovery', category, product.slug, `/discover/${categorySlug}`);
      add(
        'decision-guide',
        category,
        product.slug,
        surfaces.guideSlugs.has(categorySlug) ? `/guides/${categorySlug}` : undefined,
      );
    }
  }

  for (const pair of buildEligibleComparisonPairs(products)) {
    add('comparison', pair.slug.replace('-vs-', ' vs '), pair.leftSlug, `/compare/${pair.slug}`);
    add('comparison', pair.slug.replace('-vs-', ' vs '), pair.rightSlug, `/compare/${pair.slug}`);
  }

  for (const candidate of map.values()) {
    const evidenceWeight = Math.min(50, candidate.evidenceCount * 8);
    const surfaceWeight = candidate.coveredBy ? 20 : 0;
    candidate.priority = evidenceWeight + surfaceWeight;
  }

  return [...map.values()].sort(
    (a, b) => b.priority - a.priority || b.evidenceCount - a.evidenceCount || a.key.localeCompare(b.key),
  );
}

export function findIntentGaps(products: Product[], minimumEvidence = 3): IntentCandidate[] {
  return deriveIntentCandidates(products)
    .filter((candidate) => !candidate.coveredBy && candidate.evidenceCount >= minimumEvidence)
    .sort((a, b) => b.priority - a.priority || b.evidenceCount - a.evidenceCount || a.key.localeCompare(b.key));
}

export function summarizeIntentCoverage(products: Product[]) {
  const candidates = deriveIntentCandidates(products);
  const covered = candidates.filter((candidate) => candidate.coveredBy);
  const gaps = findIntentGaps(products);

  const byType = Object.fromEntries(
    (['navigational', 'informational', 'comparison', 'alternatives', 'category-discovery', 'decision-guide'] as IntentType[]).map(
      (type) => {
        const typeCandidates = candidates.filter((candidate) => candidate.type === type);
        const typeCovered = typeCandidates.filter((candidate) => candidate.coveredBy);
        return [
          type,
          {
            total: typeCandidates.length,
            covered: typeCovered.length,
            gaps: typeCandidates.length - typeCovered.length,
            ratio: typeCandidates.length ? typeCovered.length / typeCandidates.length : 0,
          },
        ];
      },
    ),
  ) as Record<IntentType, { total: number; covered: number; gaps: number; ratio: number }>;

  return {
    totalIntents: candidates.length,
    coveredIntents: covered.length,
    gapIntents: gaps.length,
    coverageRatio: candidates.length ? covered.length / candidates.length : 0,
    byType,
    gaps,
  };
}
