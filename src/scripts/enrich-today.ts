import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeProduct } from '@/lib/ai-analyzer';
import type { PHComment, Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PH_API = 'https://api.producthunt.com/v2/api/graphql';
const DELAY = 6000;

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

  // اگه API نام‌ها رو سانسور کرد، از HTML صفحه واقعی بخون
  if (fromApi.length && fromApi.every((c) => c.user.includes('REDACTED') || !c.user)) {
    try {
      const { load } = await import('cheerio');
      const htmlRes = await fetch(`https://www.producthunt.com/posts/${slug}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
      });
      if (htmlRes.ok) {
        const $ = load(await htmlRes.text());
        const names: string[] = [];
        $('a[href^="/@"]').each((_, el) => {
          const name = $(el).text().trim();
          if (name && !name.startsWith('@') && name.length > 2 && name.length < 40 && !name.includes('REDACTED') && /[A-Za-z]/.test(name)) names.push(name);
        });
        if (names.length) return fromApi.map((c, i) => ({ user: names[i] || c.user, text: c.text }));
      }
    } catch { /* ادامه */ }
  }
  return fromApi;
}

async function main() {
  const token = process.env.PH_API_TOKEN;
  if (!token) { console.error('❌ PH_API_TOKEN missing'); process.exit(1); }

  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.json')).sort().reverse();
  if (!files.length) { console.error('❌ no data'); process.exit(1); }
  const file = path.join(DATA_DIR, files[0]);
  const data = JSON.parse(await readFile(file, 'utf8'));

  const targets: Product[] = [...(data.periods.today ?? []), ...(data.periods.yesterday ?? [])].filter((p: Product) => !p.aiReview);
  console.log(`🌙 Enrich: ${targets.length} products (today + yesterday)`);

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
      done++;
      console.log('   ✅ enriched');
    } catch (e: any) {
      console.warn(`   ⚠️  failed: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, DELAY));
  }

  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n🎉 Enriched ${done} products → ${files[0]}`);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
