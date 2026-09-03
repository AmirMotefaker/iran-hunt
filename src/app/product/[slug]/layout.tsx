import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DiscoveryReturnLink } from '@/components/DiscoveryReturnLink';
import { ProductEvidenceBlock } from '@/components/ProductEvidenceBlock';
import { loadCorpusProduct } from '@/lib/corpus';
import {
  buildProductEntityGraph,
  buildProductMetadata,
} from '@/lib/seo-geo';

type ProductLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadCorpusProduct(slug);

  if (!product) {
    return {
      title: 'ایده پیدا نشد',
      robots: { index: false, follow: false },
    };
  }

  return buildProductMetadata(product);
}

export default async function ProductLayout({
  children,
  params,
}: ProductLayoutProps) {
  const { slug } = await params;
  const product = await loadCorpusProduct(slug);
  const entityGraph = product ? buildProductEntityGraph(product) : null;

  return (
    <>
      {entityGraph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entityGraph) }}
        />
      )}
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <DiscoveryReturnLink />
      </div>
      {children}
      {product && <ProductEvidenceBlock product={product} />}
    </>
  );
}
