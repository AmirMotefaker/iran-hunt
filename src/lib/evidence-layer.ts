import type { Product } from '@/types';

export type EvidenceQuality = 'strong' | 'moderate' | 'limited';

export type ProductEvidence = {
  id: string;
  productSlug: string;
  sourceUrl?: string;
  websiteUrl?: string;
  maker?: string;
  category?: string;
  votes?: number;
  dataDate?: string;
  hasStoredDescription: boolean;
  quality: EvidenceQuality;
  signals: string[];
  limitations: string[];
};

const clean = (value?: string) => value?.trim() || undefined;

export function buildProductEvidence(product: Product): ProductEvidence {
  const sourceUrl = clean(product.url);
  const websiteUrl = clean(product.websiteUrl);
  const maker = clean(product.maker);
  const category = clean(product.categoryFa) || clean(product.category);
  const hasStoredDescription = Boolean(
    clean(product.faDescription) ||
      clean(product.faLongDescription) ||
      clean(product.description) ||
      clean(product.longDescription),
  );

  const signals: string[] = [];
  if (sourceUrl) signals.push('source-url');
  if (websiteUrl) signals.push('official-website');
  if (maker) signals.push('maker');
  if (category) signals.push('category');
  if (Number.isFinite(product.votes) && product.votes >= 0) signals.push('votes');
  if (product.date) signals.push('data-date');
  if (hasStoredDescription) signals.push('stored-description');

  const score = signals.length;
  const quality: EvidenceQuality = score >= 6 ? 'strong' : score >= 4 ? 'moderate' : 'limited';

  const limitations = [
    'ایده‌جو قیمت، سهم بازار، عملکرد یا قابلیت‌هایی را که در داده ذخیره‌شده وجود ندارند تأیید نمی‌کند.',
  ];

  if (!maker) limitations.push('اطلاعات سازنده در داده فعلی ثبت نشده است.');
  if (!sourceUrl && !websiteUrl) limitations.push('لینک منبع یا وب‌سایت رسمی در داده فعلی موجود نیست.');
  if (!hasStoredDescription) limitations.push('توضیح متنی کافی برای این محصول در Corpus موجود نیست.');

  return {
    id: `evidence:${product.slug}`,
    productSlug: product.slug,
    sourceUrl,
    websiteUrl,
    maker,
    category,
    votes: Number.isFinite(product.votes) ? product.votes : undefined,
    dataDate: clean(product.date),
    hasStoredDescription,
    quality,
    signals,
    limitations,
  };
}

export function evidenceQualityLabel(quality: EvidenceQuality): string {
  if (quality === 'strong') return 'شواهد کامل‌تر';
  if (quality === 'moderate') return 'شواهد متوسط';
  return 'شواهد محدود';
}
