import * as cheerio from 'cheerio';
import type { Product } from '@/types';

const ATOM_FEED_URL = 'https://www.producthunt.com/feed';

const COMMON_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'application/atom+xml, application/xml, text/xml, */*',
  'Accept-Language': 'en-US,en;q=0.9',
};

interface AtomEntry {
  title: string;
  link: string;
  content: string;
  published: string;
}

async function fetchAtomFeed(): Promise<AtomEntry[]> {
  console.log('🌐 Fetching ProductHunt Atom feed...');

  const res = await fetch(ATOM_FEED_URL, { headers: COMMON_HEADERS });
  if (!res.ok) {
    throw new Error(`Failed to fetch feed: HTTP ${res.status}`);
  }

  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const entries: AtomEntry[] = [];
  $('entry').each((_, el) => {
    const $el = $(el);
    // Atom: link is in href attribute, not text content
    const linkEl = $el.find('link[href]').first();
    const link = linkEl.attr('href') || '';

    const content =
      $el.find('content').text().trim() ||
      $el.find('summary').text().trim() ||
      '';

    entries.push({
      title: $el.find('title').text().trim(),
      link,
      content,
      published: $el.find('published, updated').first().text().trim(),
    });
  });

  return entries;
}

function cleanHtml(html: string): string {
  const $ = cheerio.load(html);
  return $.text().replace(/\s+/g, ' ').trim();
}

function extractTagline(html: string, fallback: string): string {
  const $ = cheerio.load(html);
  const firstP = $('p').first().text().trim();
  return firstP || fallback;
}

async function enrichProduct(p: Product): Promise<void> {
  try {
    const res = await fetch(p.url, {
      headers: COMMON_HEADERS,
      redirect: 'follow',
    });
    if (!res.ok) return;

    const html = await res.text();
    const $ = cheerio.load(html);

    // og:description
    const ogDesc = $('meta[property="og:description"]').attr('content');
    if (ogDesc) p.description = ogDesc.trim();

    // og:image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) p.thumbnail = ogImage;

    // Website link (redirect link with data-test or specific class)
    const websiteLink = $('a[data-test="website-link"]').attr('href')
      || $('a[rel="nofollow"]').first().attr('href');
    if (websiteLink) p.websiteUrl = websiteLink;

    // Categories from topics/tags
    const topics = $('[data-test="post-topic"], [data-test="topic-pill"]')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean);
    if (topics.length > 0) {
      p.category = topics.join(' • ');
    }

    // Votes
    const voteText = $('[data-test="vote-button"], [data-test="post-votes-count"]').first().text();
    const voteMatch = voteText.replace(/[^\d]/g, '');
    if (voteMatch) p.votes = parseInt(voteMatch, 10);
  } catch (err) {
    console.warn(`⚠️  Enrichment failed for: ${p.name} (${err})`);
  }
}

export async function scrapeProductHunt(date: string): Promise<Product[]> {
  const entries = await fetchAtomFeed();
  console.log(`📦 Found ${entries.length} entries in Atom feed, taking top 5`);

  if (entries.length === 0) {
    throw new Error('No entries found in Atom feed');
  }

  const products: Product[] = entries.slice(0, 5).map((entry, index) => {
    const cleanContent = cleanHtml(entry.content);
    const tagline = extractTagline(entry.content, entry.title);

    return {
      id: `ph-${date}-${index + 1}`,
      date,
      rank: index + 1,
      name: entry.title,
      tagline,
      description: cleanContent || tagline,
      category: 'General', // Will be enriched
      url: entry.link,
      votes: 0,
      websiteUrl: entry.link,
      thumbnail: undefined,
    };
  });

  // Enrich in parallel
  console.log('🔄 Enriching with detail pages...');
  await Promise.all(products.map(enrichProduct));

  return products;
}
