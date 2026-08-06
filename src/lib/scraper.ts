import * as cheerio from 'cheerio';
import type { PeriodKey, PHComment, Product } from '@/types';
import { translateCategories } from '@/lib/translate';

export const TOP_COUNT = 10;
const API_URL = 'https://api.producthunt.com/v2/api/graphql';
const ATOM_URL = 'https://www.producthunt.com/feed';

const COMMON_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'application/atom+xml, application/xml, text/xml, */*',
  'Accept-Language': 'en-US,en;q=0.9',
};

export const PERIODS: Array<{ key: PeriodKey; en: string; fa: string }> = [
  { key: 'today', en: 'Today', fa: 'امروز' },
  { key: 'yesterday', en: 'Yesterday', fa: 'دیروز' },
  { key: 'week', en: 'Last Week', fa: 'هفته گذشته' },
  { key: 'month', en: 'Last Month', fa: 'ماه گذشته' },
  { key: 'year', en: 'Last Year', fa: 'یک سال گذشته' },
];

function iso(d: Date): string { return d.toISOString(); }
function startOfDayUTC(offsetDays = 0): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offsetDays, 0, 0, 0));
}

function periodBounds(key: PeriodKey): { after: string; before: string } {
  const now = new Date();
  switch (key) {
    case 'today': return { after: iso(startOfDayUTC(0)), before: iso(now) };
    case 'yesterday': return { after: iso(startOfDayUTC(1)), before: iso(startOfDayUTC(0)) };
    case 'week': return { after: iso(new Date(now.getTime() - 7 * 864e5)), before: iso(now) };
    case 'month': return { after: iso(new Date(now.getTime() - 30 * 864e5)), before: iso(now) };
    case 'year': return { after: iso(new Date(now.getTime() - 365 * 864e5)), before: iso(now) };
  }
}

function stripHtml(html: string): string { return cheerio.load(html).text().replace(/\s+/g, ' ').trim(); }

function isSpamComment(text: string): boolean {
  const spamPatterns = [
    /https?:\/\/(?!www\.producthunt\.com)[^\s]+\.(xyz|top|click|ru|cn|tk)/i,
    /click here|check out|visit now/i,
  ];
  return spamPatterns.some((p) => p.test(text));
}

function extractSlug(url: string): string | null {
  const match = url.match(/\/(?:products|posts)\/([^/?#]+)/);
  return match ? match[1] : null;
}

const listQuery = (after: string, before: string) => `
query {
  posts(first: 50, order: VOTES, postedAfter: "${after}", postedBefore: "${before}") {
    edges {
      node {
        name tagline description votesCount website url slug featuredAt
        thumbnail { url }
        media { url }
        topics(first: 5) { edges { node { name } } }
        makers { name headline }
      }
    }
  }
}`;

const slugQuery = (slug: string) => `
query {
  post(slug: "${slug}") {
    website
    description
    comments(first: 8) { edges { node { body user { name username } } } }
  }
}`;

async function gql(token: string, query: string): Promise<any> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'IdehYab/3.0 (+https://iranhunt.vercel.app)',
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`API HTTP ${res.status}`);
  const json = (await res.json()) as any;
  if (json.errors) throw new Error(`GraphQL: ${json.errors[0]?.message}`);
  return json.data;
}

async function getRealWebsiteUrl(redirectUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(redirectUrl, { redirect: 'follow', headers: COMMON_HEADERS, signal: controller.signal });
    clearTimeout(timeout);
    return res.url.includes('producthunt.com') ? redirectUrl : res.url;
  } catch { return redirectUrl; }
}

async function fetchPeriodList(token: string, key: PeriodKey): Promise<Product[]> {
  const { after, before } = periodBounds(key);
  const data = await gql(token, listQuery(after, before));
  const nodes: any[] = data?.posts?.edges?.map((e: any) => e.node).filter(Boolean) ?? [];

  const seen = new Set<string>();
  const pool = nodes
    .filter((n) => n.featuredAt && n.name && !seen.has(n.name) && (seen.add(n.name), true))
    .sort((a, b) => (b.votesCount ?? 0) - (a.votesCount ?? 0))
    .slice(0, TOP_COUNT);

  return pool.map((n, i) => {
    const slugFromGql = n.slug ?? extractSlug(n.url ?? '') ?? '';
    const categoryEn = (n.topics?.edges ?? []).map((t: any) => t.node?.name).filter(Boolean).join(' • ') || 'General';
    const screenshots = (n.media ?? [])
      .map((m: any) => m.url)
      .filter(Boolean)
      .filter((u: string) => !u.endsWith('.mp4'));
    const maker = n.makers?.[0]?.name ?? '';
    const makerTitle = n.makers?.[0]?.headline ?? '';

    return {
      id: `ph-${key}-${i + 1}`,
      date: (n.featuredAt ?? '').slice(0, 10),
      rank: i + 1,
      name: n.name,
      slug: slugFromGql,
      tagline: n.tagline ?? '',
      description: n.description ?? n.tagline ?? '',
      category: categoryEn,
      categoryFa: translateCategories(categoryEn),
      url: n.url ?? 'https://www.producthunt.com',
      thumbnail: n.thumbnail?.url,
      screenshots,
      maker,
      makerTitle,
      featuredAt: n.featuredAt ?? '',
      votes: n.votesCount ?? 0,
      websiteUrl: n.website ?? '',
      comments: [],
    };
  });
}

async function enrichWithDetails(token: string, products: Product[]): Promise<void> {
  for (const p of products) {
    try {
      if (!p.slug) continue;
      const data = await gql(token, slugQuery(p.slug));
      const post = data?.post;
      if (!post) continue;

      let websiteUrl = post.website ?? p.websiteUrl;
      if (websiteUrl.includes('producthunt.com/r/')) {
        const real = await getRealWebsiteUrl(websiteUrl);
        if (!real.includes('producthunt.com')) websiteUrl = real;
      }
      p.websiteUrl = websiteUrl;
      if (post.description && post.description.length > (p.description?.length ?? 0)) {
        p.longDescription = post.description;
      }

      p.comments = (post.comments?.edges ?? [])
        .map((c: any) => ({
          user: c.node?.user?.name || c.node?.user?.username || 'Hunter',
          text: stripHtml(c.node?.body ?? ''),
        }))
        .filter((c: PHComment) => c.text.length > 10 && !isSpamComment(c.text)) as PHComment[];
    } catch { /* ignore */ }
    await new Promise((r) => setTimeout(r, 250));
  }
}

async function fetchViaAtom(date: string): Promise<Product[]> {
  console.log('   📡 Atom feed fallback...');
  const res = await fetch(ATOM_URL, { headers: COMMON_HEADERS });
  if (!res.ok) throw new Error(`Atom feed HTTP ${res.status}`);
  const $ = cheerio.load(await res.text(), { xmlMode: true });
  const products: Product[] = [];
  $('entry').each((i, el) => {
    if (products.length >= TOP_COUNT) return false;
    const $el = $(el);
    const content = $el.find('content').text().trim();
    const tagline = cheerio.load(content)('p').first().text().trim();
    const url = $el.find('link[href]').first().attr('href') ?? '';
    const slug = extractSlug(url) ?? `entry-${products.length + 1}`;
    products.push({
      id: `ph-today-${products.length + 1}`,
      date, rank: products.length + 1,
      name: $el.find('title').text().trim(),
      slug, tagline: tagline || $el.find('title').text().trim(),
      description: stripHtml(content),
      category: 'General', categoryFa: 'عمومی',
      url, votes: 0, websiteUrl: '', comments: [],
    });
  });
  return products;
}

export async function scrapePeriod(token: string | undefined, key: PeriodKey, date: string): Promise<Product[]> {
  if (!token) { if (key === 'today') return fetchViaAtom(date); return []; }
  try {
    const products = await fetchPeriodList(token, key);
    console.log(`   ✅ Got ${products.length} featured products`);
    if (products.length < 3 && (key === 'today' || key === 'yesterday')) {
      const atom = await fetchViaAtom(date);
      if (atom.length > products.length) return atom;
    }
    await enrichWithDetails(token, products);
    return products;
  } catch (err) {
    console.warn(`   ⚠️  Period ${key} failed (${err})`);
    if (key === 'today') return fetchViaAtom(date);
    return [];
  }
}

