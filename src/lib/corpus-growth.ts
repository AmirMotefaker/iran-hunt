import type { Product } from '@/types';
import { auditCorpus, mergeCorpusProduct, type ProductCorpus } from '@/lib/corpus';

export function mergeProductsIntoCorpus(corpus: ProductCorpus, incoming: Product[]) {
  const map = new Map(corpus.products.map((p) => [p.slug, p]));
  const before = map.size;

  for (const product of incoming) {
    if (!product?.slug) continue;
    map.set(product.slug, mergeCorpusProduct(map.get(product.slug), product));
  }

  const products = [...map.values()].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
  const audit = auditCorpus(products);
  const after = products.length;

  if (after < before) throw new Error(`corpus shrink detected: ${before} -> ${after}`);

  return {
    corpus: { ...corpus, generatedAt: new Date().toISOString(), products, audit },
    report: { before, after, added: after - before, audit },
  };
}

export function assertCorpusHealth(report: { after: number; audit: ReturnType<typeof auditCorpus> }, minimumProducts = 100) {
  if (report.after < minimumProducts) {
    throw new Error(`corpus below safety floor: ${report.after} < ${minimumProducts}`);
  }
  if (report.audit.withRealComments < Math.floor(report.after * 0.5)) {
    throw new Error(`real-comment coverage unexpectedly low: ${report.audit.withRealComments}/${report.after}`);
  }
}
