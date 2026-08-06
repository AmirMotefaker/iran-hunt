import * as cheerio from 'cheerio';
import type { Product } from '@/types';

const BASE = 'https://www.producthunt.com';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

export async function scrapeProductHunt(date: string): Promise<Product[]> {
  console.log('🌐 Fetching producthunt.com ...');
  const html = await fetchHtml(BASE);
  const $ = cheerio.load(html);

  let items = $('[data-test="post-item"]');
  if (items.length === 0) {
    items = $('section:has(a[href^="/posts/"])');
  }
  console.log(`📦 Found ${items.length} product items`);

  const products: Product[] = [];

  items.each((_, el) => {
    if (products.length >= 5) return false;
    const $el = $(el);
    const name = $el.find('[data-test="post-name"]').text().trim();
    if (!name) return;

    const tagline = $el.find('[data-test="post-tagline"]').text().trim();
    const category = $el
      .find('[data-test="post-topic"]')
      .map((_, t) => $(t).text().trim())
      .get()
      .join(' • ');
    const votesRaw = $el
      .find('[data-test="post-votes-count"], [data-test="vote-button"]')
      .first()
      .text()
      .replace(/[^\d]/g, '');
    const href = $el.find('a[href^="/posts/"]').first().attr('href') ?? '';
    const slug = href.split('?')[0];

    products.push({
      id: `ph-${date}-${products.length + 1}`,
      date,
      rank: products.length + 1,
      name,
      tagline,
      description: '',
      category: category || 'General',
      url: slug ? `${BASE}${slug}` : BASE,
      votes: parseInt(votesRaw, 10) || 0,
      websiteUrl: '',
    });
  });

  // Enrich each product with its detail page (og meta tags)
  await Promise.all(
    products.map(async (p) => {
      try {
        const detail = await fetchHtml(p.url);
        const d = cheerio.load(detail);
        p.description =
          d('meta[property="og:description"]').attr('content')?.trim() || p.tagline;
        p.websiteUrl = d('a[data-test="website-link"]').attr('href') ?? '';
        const thumb = d('meta[property="og:image"]').attr('content');
        if (thumb) p.thumbnail = thumb;
      } catch {
        console.warn(`⚠️  detail fetch failed for: ${p.name}`);
      }
    }),
  );

  return products;
}
