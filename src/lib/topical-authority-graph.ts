import type { Product } from '@/types';
import { buildDecisionGuides } from '@/lib/decision-guides';
import { buildEligibleComparisonPairs, rankAlternatives } from '@/lib/comparison-engine';

export type AuthorityNodeType = 'product' | 'topic' | 'guide' | 'comparison';
export type AuthorityEdgeType = 'belongs-to' | 'guided-by' | 'alternative-to' | 'compared-with';

export type AuthorityNode = {
  id: string;
  type: AuthorityNodeType;
  label: string;
  href: string;
};

export type AuthorityEdge = {
  from: string;
  to: string;
  type: AuthorityEdgeType;
  evidence: number;
};

export type TopicalAuthorityGraph = {
  nodes: AuthorityNode[];
  edges: AuthorityEdge[];
  orphanNodeIds: string[];
  hubs: Array<{ nodeId: string; degree: number }>;
};

const normalize = (value?: string) => (value ?? '').trim();
const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');

function categories(product: Product): string[] {
  return [...new Set([product.categoryFa, product.category]
    .filter(Boolean)
    .flatMap((value) => (value ?? '').split('•'))
    .map((value) => value.trim())
    .filter(Boolean))];
}

export function buildTopicalAuthorityGraph(products: Product[]): TopicalAuthorityGraph {
  const nodes = new Map<string, AuthorityNode>();
  const edges = new Map<string, AuthorityEdge>();

  const addNode = (node: AuthorityNode) => nodes.set(node.id, node);
  const addEdge = (edge: AuthorityEdge) => {
    const key = `${edge.from}|${edge.type}|${edge.to}`;
    if (!edges.has(key)) edges.set(key, edge);
  };

  for (const product of products) {
    if (!product.slug) continue;
    const productId = `product:${product.slug}`;
    addNode({ id: productId, type: 'product', label: product.name, href: `/product/${product.slug}` });

    for (const category of categories(product)) {
      const topicSlug = slugify(category);
      if (!topicSlug) continue;
      const topicId = `topic:${topicSlug}`;
      addNode({ id: topicId, type: 'topic', label: category, href: `/discover/${topicSlug}` });
      addEdge({ from: productId, to: topicId, type: 'belongs-to', evidence: 1 });
    }
  }

  for (const guide of buildDecisionGuides(products)) {
    const guideId = `guide:${guide.slug}`;
    addNode({ id: guideId, type: 'guide', label: guide.label, href: `/guides/${guide.slug}` });
    const topicId = `topic:${guide.slug}`;
    if (nodes.has(topicId)) addEdge({ from: topicId, to: guideId, type: 'guided-by', evidence: guide.products.length });
  }

  for (const product of products) {
    if (!product.slug) continue;
    for (const alternative of rankAlternatives(product, products, 3)) {
      if (!alternative.slug) continue;
      const [left, right] = [`product:${product.slug}`, `product:${alternative.slug}`].sort();
      addEdge({ from: left, to: right, type: 'alternative-to', evidence: 1 });
    }
  }

  for (const pair of buildEligibleComparisonPairs(products)) {
    const comparisonId = `comparison:${pair.slug}`;
    addNode({ id: comparisonId, type: 'comparison', label: pair.slug.replace('-vs-', ' vs '), href: `/compare/${pair.slug}` });
    addEdge({ from: `product:${pair.leftSlug}`, to: comparisonId, type: 'compared-with', evidence: 1 });
    addEdge({ from: `product:${pair.rightSlug}`, to: comparisonId, type: 'compared-with', evidence: 1 });
  }

  const nodeList = [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id));
  const edgeList = [...edges.values()].sort((a, b) => `${a.from}|${a.type}|${a.to}`.localeCompare(`${b.from}|${b.type}|${b.to}`));
  const degree = new Map(nodeList.map((node) => [node.id, 0]));
  for (const edge of edgeList) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }

  const orphanNodeIds = nodeList.filter((node) => (degree.get(node.id) ?? 0) === 0).map((node) => node.id);
  const hubs = [...degree.entries()]
    .map(([nodeId, value]) => ({ nodeId, degree: value }))
    .filter((item) => item.degree > 0)
    .sort((a, b) => b.degree - a.degree || a.nodeId.localeCompare(b.nodeId));

  return { nodes: nodeList, edges: edgeList, orphanNodeIds, hubs };
}

export function recommendInternalLinks(graph: TopicalAuthorityGraph, nodeId: string, limit = 6): AuthorityNode[] {
  const score = new Map<string, number>();
  const adjacent = graph.edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
  const direct = new Set<string>();

  for (const edge of adjacent) {
    const other = edge.from === nodeId ? edge.to : edge.from;
    direct.add(other);
    score.set(other, (score.get(other) ?? 0) + edge.evidence * 10);
  }

  for (const neighbor of direct) {
    for (const edge of graph.edges) {
      if (edge.from !== neighbor && edge.to !== neighbor) continue;
      const candidate = edge.from === neighbor ? edge.to : edge.from;
      if (candidate === nodeId || direct.has(candidate)) continue;
      score.set(candidate, (score.get(candidate) ?? 0) + edge.evidence);
    }
  }

  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]));
  return [...score.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([id]) => nodeMap.get(id))
    .filter((node): node is AuthorityNode => Boolean(node));
}
