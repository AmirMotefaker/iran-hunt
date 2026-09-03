import type { Metadata } from 'next';
import { productFreshness } from '@/lib/content-freshness';
import { buildEvidenceStructuredFields } from '@/lib/evidence-layer';
import type { Product } from '@/types';

export const SITE_URL = 'https://idehjo.ir';
export const SITE_NAME = 'ایده‌جو';

const cleanText = (value?: string | null) =>
  (value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const truncate = (value: string, max = 160) =>
  value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;

export function getProductCanonical(slug: string): string {
  return `${SITE_URL}/product/${encodeURIComponent(slug)}`;
}

export function getProductDescription(product: Product): string {
  const primary =
    cleanText(product.faDescription) ||
    cleanText(product.faTagline) ||
    cleanText(product.description) ||
    cleanText(product.tagline);

  if (primary) return truncate(primary);

  return truncate(`${product.name}؛ محصول ثبت‌شده و تحلیل‌شده در ایده‌جو.`);
}

export function buildProductMetadata(product: Product): Metadata {
  const canonical = getProductCanonical(product.slug);
  const description = getProductDescription(product);
  const title = product.faTagline?.trim()
    ? `${product.name} — ${product.faTagline.trim()}`
    : product.name;
  const image = product.thumbnail || '/favicon.svg';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'fa_IR',
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function buildProductEntityGraph(product: Product) {
  const canonical = getProductCanonical(product.slug);
  const description = getProductDescription(product);
  const categories = (product.categoryFa || product.category)
    .split('•')
    .map((value) => value.trim())
    .filter(Boolean);
  const provenance = buildEvidenceStructuredFields(product);
  const freshness = productFreshness(product);

  const productId = `${canonical}#product`;
  const applicationId = `${canonical}#software`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': canonical,
        url: canonical,
        name: product.name,
        description,
        inLanguage: 'fa-IR',
        dateModified: freshness.dataDate || provenance.dateModified,
        isBasedOn: provenance.isBasedOn,
        citation: provenance.citation,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': productId },
      },
      {
        '@type': 'Product',
        '@id': productId,
        name: product.name,
        description,
        url: canonical,
        image: product.thumbnail || undefined,
        category: categories,
        brand: { '@type': 'Brand', name: product.name },
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'IdeaJo votes',
            value: product.votes,
          },
          {
            '@type': 'PropertyValue',
            name: 'IdeaJo evidence quality',
            value: provenance.evidenceQuality,
          },
          {
            '@type': 'PropertyValue',
            name: 'IdeaJo evidence id',
            value: provenance.evidenceId,
          },
          {
            '@type': 'PropertyValue',
            name: 'IdeaJo freshness status',
            value: freshness.status,
          },
          ...(typeof freshness.score === 'number'
            ? [
                {
                  '@type': 'PropertyValue',
                  name: 'IdeaJo freshness score',
                  value: freshness.score,
                },
              ]
            : []),
          ...(product.maker
            ? [
                {
                  '@type': 'PropertyValue',
                  name: 'Maker',
                  value: product.maker,
                },
              ]
            : []),
        ],
        subjectOf: { '@id': applicationId },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': applicationId,
        name: product.name,
        description,
        url: product.websiteUrl || canonical,
        applicationCategory: categories[0] || 'BusinessApplication',
        inLanguage: ['fa-IR', 'en'],
        sameAs: [product.websiteUrl, product.url].filter(Boolean),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: SITE_NAME,
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'محصولات',
            item: `${SITE_URL}/products`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: canonical,
          },
        ],
      },
    ],
  };
}
