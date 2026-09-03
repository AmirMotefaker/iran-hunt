import { expect, test } from 'bun:test';
import type { Product } from '@/types';
import { buildTopicalAuthorityGraph, recommendInternalLinks } from './topical-authority-graph';

function product(slug: string, votes: number): Product {
  return {
    id: slug,
    date: '2026-09-03',
    rank: 1,
    name: slug.toUpperCase(),
    slug,
    tagline: 'AI workspace',
    description: 'AI workspace for teams',
    faDescription: 'فضای کاری هوش مصنوعی برای تیم‌ها',
    category: 'AI',
    categoryFa: 'هوش مصنوعی',
    url: `https://www.producthunt.com/posts/${slug}`,
    votes,
    websiteUrl: `https://${slug}.example`,
  };
}

const products = [
  product('atlas', 100),
  product('nova', 90),
  product('orbit', 80),
  product('pulse', 70),
  product('quill', 60),
];

test('builds a deterministic evidence-backed topical graph', () => {
  const first = buildTopicalAuthorityGraph(products);
  const second = buildTopicalAuthorityGraph([...products].reverse());

  expect(first.nodes.map((node) => node.id)).toEqual(second.nodes.map((node) => node.id));
  expect(first.edges).toEqual(second.edges);
  expect(first.nodes.some((node) => node.id === 'topic:هوش-مصنوعی')).toBe(true);
  expect(first.nodes.some((node) => node.type === 'guide')).toBe(true);
  expect(first.nodes.some((node) => node.type === 'comparison')).toBe(true);
});

test('deduplicates graph edges and reports connected hubs', () => {
  const graph = buildTopicalAuthorityGraph(products);
  const keys = graph.edges.map((edge) => `${edge.from}|${edge.type}|${edge.to}`);

  expect(new Set(keys).size).toBe(keys.length);
  expect(graph.hubs.length).toBeGreaterThan(0);
  expect(graph.hubs[0].degree).toBeGreaterThan(0);
});

test('recommends internal links from graph relationships only', () => {
  const graph = buildTopicalAuthorityGraph(products);
  const recommendations = recommendInternalLinks(graph, 'product:atlas');

  expect(recommendations.length).toBeGreaterThan(0);
  expect(recommendations.every((node) => node.id !== 'product:atlas')).toBe(true);
  expect(recommendations.every((node) => graph.nodes.some((candidate) => candidate.id === node.id))).toBe(true);
});
