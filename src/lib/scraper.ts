import * as cheerio from 'cheerio';
import type { PHComment, Product } from '@/types';

export const TOP_COUNT = 10;

const API_URL = 'https://api.producthunt.com/v2/api/graphql';
const ATOM_URL = 'https://www.producthunt.com/feed';

const COMMON_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'application/atom+xml, application/xml, text/xml, */*',
  'Accept-Language': 'en-US,en;q=0.9',
};

function stripHtml(html: string): string {
  return cheerio.load(html).text().replace(/\s+/g, ' ').trim();
}

// Spam detection
function isSpamComment(text: string): boolean {
  const spamPatterns = [
    /https?:\/\/(?!www\.producthunt\.com)[^\s]+\.(xyz|top|click|ru|cn|tk)/i,
    /myloweslife|kronos-login/i,
    /click here|check out|visit now/i,
  ];
  return spamPatterns.some((pattern) => pattern.test(text));
}

function extractSlug(url: string): string | null {
  const match = url.match(/\/(?:products|posts)\/([^/?#]+)/);
  return match ? match[1] : null;
}

async function getRealWebsiteUrl(redirectUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(redirectUrl, {
      redirect: 'follow',
      headers: COMMON_HEADERS,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.url.includes('producthunt.com')) {
      return res.url;
    }
    return redirectUrl;
  } catch {
    return redirectUrl;
  }
}

const buildSlugQuery = (slug: string) => `
query {
  post(slug: "${slug}") {
    name
    tagline
    description
    votesCount
    website
    url
    featuredAt
    thumbnail { url }
    topics(first: 5) { edges { node { name } } }
    comments(first: 8) { edges { node { body user { name username } } } }
  }
}`;

async function fetchPostDetails(token: string, slug: string): Promise<any> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'IranHunt/1.0 (+https://iranhunt.vercel.app)',
    },
    body: JSON.stringify({ query: buildSlugQuery(slug) }),
  });

  if (!res.ok) throw new Error(`API HTTP ${res.status}`);
  const json = (await res.json()) as any;
  if (json.errors) throw new Error(`GraphQL: ${json.errors[0]?.message}`);
  return json?.data?.post ?? null;
}

async function getTodaysProducts(): Promise<Array<{ name: string; slug: string; phUrl: string; tagline: string; atomDescription: string }>> {
  console.log('📡 Step 1: Fetching Atom feed for today\'s products...');
  const res = await fetch(ATOM_URL, { headers: COMMON_HEADERS });
  if (!res.ok) throw new Error(`Atom feed HTTP ${res.status}`);

  const $ = cheerio.load(await res.text(), { xmlMode: true });
  const items: Array<{ name: string; slug: string; phUrl: string; tagline: string; atomDescription: string }> = [];

  $('entry').each((i, el) => {
    if (items.length >= TOP_COUNT) return false;
    const $el = $(el);
    const name = $el.find('title').text().trim();
    const rawUrl = $el.find('link[href]').first().attr('href') ?? '';
    const content = $el.find('content').text().trim();
    const tagline = cheerio.load(content)('p').first().text().trim() || name;

    const slug = extractSlug(rawUrl);
    if (!slug) return;

    if (!items.some((item) => item.slug === slug)) {
      items.push({
        name,
        slug,
        phUrl: rawUrl,
        tagline,
        atomDescription: stripHtml(content),
      });
    }
  });

  console.log(`   ✅ Got ${items.length} today's products from Atom feed`);
  return items;
}

async function enrichFromGraphQL(
  token: string,
  items: Array<{ name: string; slug: string; phUrl: string; tagline: string; atomDescription: string }>,
  date: string,
): Promise<Product[]> {
  console.log('🔑 Step 2: Enriching with GraphQL API (votesCount, topics, comments)...');

  const products: Product[] = [];

  for (const item of items) {
    try {
      const details = await fetchPostDetails(token, item.slug);

      if (!details) {
        console.warn(`   ⚠️  No details for ${item.name}`);
        continue;
      }

      // Get real website URL
      let websiteUrl = details.website ?? '';
      if (websiteUrl.includes('producthunt.com/r/')) {
        const realUrl = await getRealWebsiteUrl(websiteUrl);
        if (!realUrl.includes('producthunt.com')) {
          websiteUrl = realUrl;
        }
      }

      // Use GraphQL description or fallback to Atom description
      const description =
        details.description?.trim() || item.atomDescription || details.tagline || item.tagline;

      // Filter spam comments and use real username
      const comments = (details.comments?.edges ?? [])
        .map((c: any) => ({
          user: c.node?.user?.name || c.node?.user?.username || 'Hunter',
          text: stripHtml(c.node?.body ?? ''),
        }))
        .filter((c: PHComment) => c.text.length > 10 && !isSpamComment(c.text)) as PHComment[];

      products.push({
        id: `ph-${date}-${products.length + 1}`,
        date,
        rank: products.length + 1,
        name: details.name ?? item.name,
        tagline: details.tagline ?? item.tagline,
        description,
        category:
          (details.topics?.edges ?? [])
            .map((t: any) => t.node?.name)
            .filter(Boolean)
            .join(' • ') || 'General',
        url: details.url ?? item.phUrl,
        thumbnail: details.thumbnail?.url,
        votes: details.votesCount ?? 0,
        websiteUrl,
        comments,
      });

      console.log(
        `   ✅ ${details.name} — ${details.votesCount ?? 0} votes, ${(details.topics?.edges ?? []).length} topics, ${comments.length} comments`,
      );
    } catch (err) {
      console.warn(`   ⚠️  Failed to enrich ${item.name}: ${err}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // Sort by votes descending
  products.sort((a, b) => b.votes - a.votes);
  products.forEach((p, i) => (p.rank = i + 1));

  return products;
}

async function fetchViaAtomOnly(date: string): Promise<Product[]> {
  console.log('📡 Fallback: Atom feed only (no API token)...');
  const res = await fetch(ATOM_URL, { headers: COMMON_HEADERS });
  if (!res.ok) throw new Error(`Atom feed HTTP ${res.status}`);

  const $ = cheerio.load(await res.text(), { xmlMode: true });
  const products: Product[] = [];

  $('entry').each((i, el) => {
    if (products.length >= TOP_COUNT) return false;
    const $el = $(el);
    const content = $el.find('content').text().trim();
    const tagline = cheerio.load(content)('p').first().text().trim();

    products.push({
      id: `ph-${date}-${products.length + 1}`,
      date,
      rank: products.length + 1,
      name: $el.find('title').text().trim(),
      tagline: tagline || $el.find('title').text().trim(),
      description: stripHtml(content),
      category: 'General',
      url: $el.find('link[href]').first().attr('href') ?? '',
      votes: 0,
      websiteUrl: '',
      comments: [],
    });
  });

  return products;
}

export async function scrapeProductHunt(date: string): Promise<Product[]> {
  const token = process.env.PH_API_TOKEN;

  if (!token) {
    console.warn('⚠️  PH_API_TOKEN not set, using Atom feed only');
    return fetchViaAtomOnly(date);
  }

  try {
    const items = await getTodaysProducts();
    if (items.length === 0) throw new Error('No products from Atom feed');
    return await enrichFromGraphQL(token, items, date);
  } catch (err) {
    console.warn(`⚠️  Combined approach failed (${err}), falling back to Atom only`);
    return fetchViaAtomOnly(date);
  }
}
