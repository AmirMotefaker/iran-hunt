import type { Product } from '@/types';

export function getEnrichmentCompleteness(product: Product) {
  const faDescription = Boolean(product.faDescription?.trim());
  const faComments = (product.faComments?.length ?? 0) > 0 &&
    (product.faComments ?? []).some((c) => /[\u0600-\u06FF]/.test(c.text ?? ''));
  const aiReview = Boolean(product.aiReview?.trim());
  const iranEquivalent = Boolean(product.iranEquivalent);
  const completeFields = [faDescription, faComments, aiReview, iranEquivalent].filter(Boolean).length;
  return { faDescription, faComments, aiReview, iranEquivalent, completeFields, missingFields: 4 - completeFields };
}

export function needsEnrichment(product: Product): boolean {
  return getEnrichmentCompleteness(product).missingFields > 0;
}

export function selectEnrichmentBacklog(products: Product[], limit: number) {
  return products
    .filter((p) => p?.slug && needsEnrichment(p))
    .map((product) => ({ product, completeness: getEnrichmentCompleteness(product) }))
    .sort((a,b) => {
      const m=b.completeness.missingFields-a.completeness.missingFields;
      if(m) return m;
      const d=(a.product.date??'').localeCompare(b.product.date??'');
      if(d) return d;
      const v=(b.product.votes??0)-(a.product.votes??0);
      if(v) return v;
      return a.product.slug.localeCompare(b.product.slug);
    })
    .slice(0, Math.max(0, limit));
}

export function countEnrichmentBacklog(products: Product[]) {
  const incomplete=products.filter(needsEnrichment);
  return {
    totalProducts: products.length,
    backlog: incomplete.length,
    complete: products.length-incomplete.length,
    missingFaDescription: incomplete.filter((p)=>!getEnrichmentCompleteness(p).faDescription).length,
    missingFaComments: incomplete.filter((p)=>!getEnrichmentCompleteness(p).faComments).length,
    missingAiReview: incomplete.filter((p)=>!getEnrichmentCompleteness(p).aiReview).length,
    missingIranEquivalent: incomplete.filter((p)=>!getEnrichmentCompleteness(p).iranEquivalent).length,
  };
}
