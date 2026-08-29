import type { Product } from '@/types';
import { auditCorpus, mergeCorpusProduct, type ProductCorpus } from '@/lib/corpus';

export interface CorpusGrowthMetrics {
  discovered: number;
  canonical: number;
  acceptedNew: number;
  duplicates: number;
  rejected: number;
  before: number;
  after: number;
  added: number;
}

export interface CorpusGrowthOptions {
  maxNewProducts?: number;
}

export function canonicalizeIncomingProducts(incoming: Product[]) {
  const map = new Map<string, Product>();
  let rejected = 0;
  let duplicates = 0;

  for (const product of incoming) {
    const slug = product?.slug?.trim();
    if (!slug) {
      rejected++;
      continue;
    }

    const normalized = { ...product, slug };
    const existing = map.get(slug);

    if (!existing) map.set(slug, normalized);
    else {
      duplicates++;
      map.set(slug, mergeCorpusProduct(existing, normalized));
    }
  }

  return { products: [...map.values()], discovered: incoming.length, duplicates, rejected };
}

export function mergeProductsIntoCorpus(
  corpus: ProductCorpus,
  incoming: Product[],
  options: CorpusGrowthOptions = {},
) {
  const maxNewProducts = options.maxNewProducts ?? Number.POSITIVE_INFINITY;
  const before = corpus.products.length;
  const current = new Map(corpus.products.map((product) => [product.slug, product]));
  const canonical = canonicalizeIncomingProducts(incoming);
  const unseen: Product[] = [];
  const known: Product[] = [];

  for (const product of canonical.products) {
    if (current.has(product.slug)) known.push(product);
    else unseen.push(product);
  }

  unseen.sort((a, b) => {
    const dateDelta = (b.date ?? '').localeCompare(a.date ?? '');
    if (dateDelta !== 0) return dateDelta;
    const voteDelta = (b.votes ?? 0) - (a.votes ?? 0);
    if (voteDelta !== 0) return voteDelta;
    return a.slug.localeCompare(b.slug);
  });

  const acceptedNew = unseen.slice(0, maxNewProducts);

  for (const product of known) {
    current.set(product.slug, mergeCorpusProduct(current.get(product.slug), product));
  }
  for (const product of acceptedNew) {
    current.set(product.slug, mergeCorpusProduct(undefined, product));
  }

  const products = [...current.values()].sort((a, b) => {
    const voteDelta = (b.votes ?? 0) - (a.votes ?? 0);
    if (voteDelta !== 0) return voteDelta;
    const dateDelta = (b.date ?? '').localeCompare(a.date ?? '');
    if (dateDelta !== 0) return dateDelta;
    return a.slug.localeCompare(b.slug);
  });

  const audit = auditCorpus(products);
  const after = products.length;
  if (after < before) throw new Error(`corpus shrink detected: ${before} -> ${after}`);

  const report = {
    discovered: canonical.discovered,
    canonical: canonical.products.length,
    acceptedNew: acceptedNew.length,
    duplicates: canonical.duplicates + known.length,
    rejected: canonical.rejected + Math.max(0, unseen.length - acceptedNew.length),
    before,
    after,
    added: after - before,
    audit,
  };

  return {
    corpus: { ...corpus, generatedAt: new Date().toISOString(), products, audit },
    report,
  };
}

export function assertCorpusHealth(
  report: { after: number; audit: ReturnType<typeof auditCorpus> },
  minimumProducts = 100,
) {
  if (report.after < minimumProducts) {
    throw new Error(`corpus below safety floor: ${report.after} < ${minimumProducts}`);
  }
  if (report.audit.withRealComments < Math.floor(report.after * 0.5)) {
    throw new Error(`real-comment coverage unexpectedly low: ${report.audit.withRealComments}/${report.after}`);
  }
}
