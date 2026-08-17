import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeProduct } from '@/lib/ai-analyzer';
import type { PHComment, Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PH_API = 'https://api.producthunt.com/v2/api/graphql';
const DELAY = 6000;
const MAX_PER_NIGHT = 20; // سقف هر شب (جلوگیری از 429)
const KEYS = ['today', 'yesterday', 'week', 'month', 'year'] as const;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchComments(token: string, slug: string): Promise<PHComment[]> {
  const query = `query { post(slug: "${slug}") { comments(first: 8) { edges { node { body user { name username } } } } } }`;
  const res = await fetch(PH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) return [];
  const json: any = await res.json();
  const edges = json.data?.post?.comments?.edges ?? [];
  const fromApi = edges
    .map((e: any) => ({ user: e.node?.user?.name || e.node?.user?.username || '', text: stripHtml(e.node?.body ?? '') }))
    .filter((c: PHComment) => c.text.length > 10);

  if (fromApi.length && fromApi.every((c: PHComment) => c.user.includes('REDACTED') || !c.user)) {
    try {
      const { load } = await import('cheerio');
      const htmlRes = await fetch(`https://www.producthunt.com/posts/${slug}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      });
      if (htmlRes.ok) {
        const $ = load(await htmlRes.text());
        const names: string[] = [];
        // چندین سلکتور مختلف برای یافتن نام‌ها
        $('a[href^="/@"], [data-test="comment-author"], [class*="author"]').each((_, el) => {
          const name = $(el).text().trim().replace(/^@/, '');
          if (name && name.length > 2 && name.length < 40 && !name.includes('REDACTED') && /[A-Za-z]/.test(name)) {
            if (!names.includes(name)) names.push(name);
          }
        });
        if (names.length) return fromApi.map((c: PHComment, i: number) => ({ user: names[i] || c.user, text: c.text }));
      }
    } catch { /* ادامه */ }
  }
  return fromApi;
}

// انتشار نتیجه به همه بازه‌هایی که این محصول رو دارن
function propagate(data: any, slug: string, src: Product) {
  for (const k of KEYS) {
    for (const t of data.periods[k] ?? []) {
      if (t.slug === slug && t !== src) {
        t.faDescription = src.faDescription;
        t.faComments = src.faComments;
        t.iranEquivalent = src.iranEquivalent;
        t.aiReview = src.aiReview;
        if (src.comments?.length) t.comments = src.comments;
        t.votes = Math.max(t.votes ?? 0, src.votes ?? 0);
      }
    }
  }
}

async function main() {
  const token = process.env.PH_API_TOKEN;
  if (!token) { console.error('❌ PH_API_TOKEN missing'); process.exit(1); }

  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.json')).sort().reverse();
  if (!files.length) { console.error('❌ no data'); process.exit(1); }
  const file = path.join(DATA_DIR, files[0]);
  const data = JSON.parse(await readFile(file, 'utf8'));

  // یکتاسازی محصولات بین بازه‌ها
  const uniq = new Map<string, Product>();
  for (const k of KEYS) {
    for (const p of data.periods[k] ?? []) {
      const ex = uniq.get(p.slug);
      if (!ex) uniq.set(p.slug, p);
      else ex.votes = Math.max(ex.votes ?? 0, p.votes ?? 0);
    }
  }

  const todaySet = new Set<string>((data.periods.today ?? []).map((p: Product) => p.slug));

  // اولویت: 1) امروز/دیروز بدون AI  2) backlog بدون AI  3) امروز با کامنت خالی
  const targets = [...uniq.values()]
    .filter((p) => !p.aiReview || (!(p.faComments?.length) && (p.comments?.length ?? 0) === 0))
    .sort((a, b) => {
      const at = todaySet.has(a.slug) ? 2 : (a.votes ?? 0) > 300 ? 1 : 0;
      const bt = todaySet.has(b.slug) ? 2 : (b.votes ?? 0) > 300 ? 1 : 0;
      return bt - at;
    })
    .slice(0, MAX_PER_NIGHT);

  console.log(`🌙 Enrich: ${targets.length} products (backlog-aware)`);

  let done = 0;
  for (const p of targets) {
    console.log(`\n🤖 ${p.name}`);
    try {
      const fresh = await fetchComments(token, p.slug);
      if (fresh.length) { p.comments = fresh; console.log(`   💬 ${fresh.length} real comments`); }
      const ai = await analyzeProduct(p);
      p.faDescription = ai.faDescription;
      p.faComments = ai.faComments;
      p.iranEquivalent = ai.iranEquivalent;
      p.aiReview = ai.aiReview;
      propagate(data, p.slug, p);
      done++;
      console.log('   ✅ enriched + propagated');
    } catch (e: any) {
      console.warn(`   ⚠️  failed: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, DELAY));
  }

  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n🎉 Enriched ${done} products → ${files[0]}`);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
