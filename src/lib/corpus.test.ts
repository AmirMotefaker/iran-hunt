import { expect, test } from 'bun:test';
import { auditCorpus, mergeCorpusProduct } from './corpus';
import type { Product } from '@/types';

const base = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  date: '2026-08-01',
  rank: 1,
  name: 'Example',
  slug: 'example',
  tagline: 'Example tagline',
  description: 'Old description',
  category: 'AI',
  url: 'https://producthunt.com/example',
  votes: 10,
  websiteUrl: 'https://example.com',
  ...overrides,
});

test('corpus merge preserves richer historical enrichment', () => {
  const historical = base({
    comments: [{ user: 'Alice', text: 'Useful product and clear launch.' }],
    faDescription: 'توضیح فارسی',
    aiReview: 'تحلیل',
    iranEquivalent: {
      productName: 'نمونه',
      description: 'نمونه ایرانی',
      marketOpportunity: 'بازار',
      estimatedBudget: '100',
      targetAudience: 'تیم‌ها',
      challenges: [],
      monetization: [],
      techStack: [],
      confidence: 90,
    },
  });

  const fresh = base({
    date: '2026-08-26',
    votes: 50,
    description: 'Fresh description',
    comments: [],
  });

  const merged = mergeCorpusProduct(historical, fresh);
  expect(merged.votes).toBe(50);
  expect(merged.description).toBe('Fresh description');
  expect(merged.comments?.length).toBe(1);
  expect(merged.faDescription).toBe('توضیح فارسی');
  expect(merged.aiReview).toBe('تحلیل');
  expect(merged.iranEquivalent?.productName).toBe('نمونه');
});

test('corpus audit reports coverage', () => {
  const products = [
    base({ slug: 'a', comments: [{ user: 'A', text: 'comment one' }], faDescription: 'فارسی' }),
    base({ slug: 'b', comments: [{ user: 'B', text: 'comment two' }], aiReview: 'review' }),
  ];

  const audit = auditCorpus(products);
  expect(audit.products).toBe(2);
  expect(audit.withRealComments).toBe(2);
  expect(audit.withPersianDescription).toBe(1);
  expect(audit.withAiReview).toBe(1);
  expect(audit.totalRealComments).toBe(2);
});
