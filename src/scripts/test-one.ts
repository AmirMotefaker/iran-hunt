import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeProduct } from '@/lib/ai-analyzer';
import type { PHComment } from '@/types';

const TARGET_SLUG = process.env.TARGET_SLUG || 'coldtea';
const DATA_DIR = path.join(process.cwd(), 'data');
const PH_API = 'https://api.producthunt.com/v2/api/graphql';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// خواندن کامنت‌های واقعی از خود ProductHunt
async function scrapeCommentsFromHtml(slug: string): Promise<PHComment[]> {
  const { load } = await import('cheerio');
  const res = await fetch(`https://www.producthunt.com/posts/${slug}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
  });
  if (!res.ok) return [];
  const html = await res.text();
  const $ = load(html);
  const out: PHComment[] = [];
  // نام‌های کاربران معمولاً در data-test="comment-author" یا لینک‌های پروفایل هستند
  $('a[href^="/@"]').each((_, el) => {
    const name = $(el).text().trim();
    if (
      name && !name.startsWith('@') && name.length > 2 && name.length < 40 &&
      !name.includes('REDACTED') && /[A-Za-z]/.test(name) && !/^\d+$/.test(name)
    ) {
      out.push({ user: name, text: '' });
    }
  });
  return out;
}

async function fetchRealComments(token: string, slug: string): Promise<PHComment[]> {
  const query = `query { post(slug: "${slug}") { comments(first: 8) { edges { node { body user { name username } } } } } }`;
  const res = await fetch(PH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) { console.warn(`   ⚠️  PH comments HTTP ${res.status}`); return []; }
  const json: any = await res.json();
  const edges = json.data?.post?.comments?.edges ?? [];

  const fromApi: PHComment[] = edges
    .map((e: any) => ({
      user: e.node?.user?.name || e.node?.user?.username || '',
      text: stripHtml(e.node?.body ?? ''),
    }))
    .filter((c: PHComment) => c.text.length > 10);

  // اگر همه نام‌ها REDACTED بود، از scraping استفاده کن
  const allRedacted = fromApi.every((c) => c.user.includes('REDACTED') || !c.user);
  if (allRedacted) {
    console.log('   🔍 Scraping HTML for real usernames...');
    const scraped = await scrapeCommentsFromHtml(slug);
    if (scraped.length) {
      return fromApi.map((c, i) => ({
        user: scraped[i]?.user || c.user,
        text: c.text,
      }));
    }
  }

  return fromApi;
}

async function main() {
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.json')).sort().reverse();
  if (!files.length) { console.error('❌ No data file'); process.exit(1); }

  const file = path.join(DATA_DIR, files[0]);
  const data = JSON.parse(await readFile(file, 'utf8'));

  let target: any = null;
  for (const key of ['today', 'yesterday', 'week', 'month', 'year']) {
    const found = (data.periods[key] ?? []).find((p: any) => p.slug === TARGET_SLUG);
    if (found) { target = found; break; }
  }
  if (!target) { console.error(`❌ ${TARGET_SLUG} not found`); process.exit(1); }

  console.log(`\n🎯 ${target.name} (${target.votes} votes)`);

  // 1) کامنت‌های واقعی از ProductHunt
  if (process.env.PH_API_TOKEN) {
    console.log('   📥 Fetching real comments from ProductHunt...');
    const fresh = await fetchRealComments(process.env.PH_API_TOKEN, TARGET_SLUG);
    if (fresh.length) target.comments = fresh;
  }
  target.comments = (target.comments ?? []).filter((c: any) => !String(c.user).includes('REDACTED'));
  console.log(`   💬 Real comments: ${target.comments?.length ?? 0}`);

  // 2) ترجمه + پیشنهاد ایرانی با AI
  console.log('   🤖 Translating + analyzing...');
  const ai = await analyzeProduct(target);

  target.faDescription = ai.faDescription;
  target.faComments = ai.faComments;
  target.iranEquivalent = ai.iranEquivalent;
  target.aiReview = ai.aiReview;

  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n✅ faComments: ${ai.faComments.length} نظر ترجمه شد`);
  console.log(`✅ مشابه ایرانی: ${ai.iranEquivalent.productName}`);
  console.log(`💾 Saved to ${files[0]}`);
  console.log('🎉 Done!');
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
