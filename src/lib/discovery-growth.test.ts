import { describe, expect, test } from 'bun:test';
import { buildDiscoveryTopics, findDiscoveryTopic } from './discovery-growth';
import type { Product } from '@/types';

const product = (slug: string, category: string, votes: number): Product => ({
  id: slug,
  date: '2026-09-03',
  rank: 1,
  name: slug,
  slug,
  tagline: category,
  description: category,
  category,
  url: `https://example.com/${slug}`,
  votes,
  websiteUrl: `https://example.com/${slug}`,
});

describe('P57 discovery growth engine', () => {
  const products = [
    product('ai-1', 'Artificial Intelligence', 10),
    product('ai-2', 'AI', 30),
    product('ai-3', 'Machine Learning', 20),
    product('travel-1', 'Travel', 5),
  ];

  test('publishes only topics that meet the quality threshold', () => {
    const topics = buildDiscoveryTopics(products, 3);
    expect(topics.some((topic) => topic.slug === 'llms')).toBe(true);
    expect(topics.some((topic) => topic.slug === 'travel')).toBe(false);
  });

  test('orders topic products by evidence signal', () => {
    const topic = findDiscoveryTopic(products, 'llms', 3);
    expect(topic?.products.map((item) => item.slug)).toEqual([
      'ai-2',
      'ai-3',
      'ai-1',
    ]);
  });

  test('uses stable public slugs', () => {
    const topic = findDiscoveryTopic(products, 'llms', 3);
    expect(topic?.slug).toBe('llms');
  });
});
