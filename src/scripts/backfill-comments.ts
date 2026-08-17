import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeProduct } from '@/lib/ai-analyzer';
import type { PHComment, Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PH_API = 'https://api.producthunt.com/v2/api/graphql';
const DELAY = 6000;
const MAX = 50;
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
  return edges
    .map((e: any) => ({ user: e.node?.user?.name || e.node?.user?.username || '', text: stripHtml(e.node?.body ?? '') }))
    .filter((c: PHComment) => c.text.length > 10);
}

async function main() {
  const token = process.env.PH_API_TOKEN;
  if (!token) { console.error('❌ PH_API_TOKEN missing'); process.exit(1); }

  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.json')).sort().reverse();
  const file = path.join(DATA_DIR, files[0]);
  const data = JSON.parse(await readFile(file, 'utf8'));

  const uniq = new Map<string, Product>();
  for (const k of KEYS) {
    for (const p of data.periods[k] ?? []) {
      if (!uniq.has(p.slug)) uniq.set(p.slug, p);
    }
  }

  const targets = [...uniq.values()]
    .filter((p) => !p.faComments?.length)
    .slice(0, MAX);

  console.log(`🔄 Backfill: ${targets.length} products need comments`);

  let done = 0;
  for (const p of targets) {
    console.log(`\n🤖 ${p.name}`);
    try {
      const fresh = await fetchComments(token, p.slug);
      if (fresh.length) p.comments = fresh;
      const ai = await analyzeProduct(p);
      p.faDescription = ai.faDescription;
      p.faComments = ai.faComments;
      p.iranEquivalent = ai.iranEquivalent;
      p.aiReview = ai.aiReview;

      for (const k of KEYS) {
        for (const t of data.periods[k] ?? []) {
          if (t.slug === p.slug) {
            t.faDescription = p.faDescription;
            t.faComments = p.faComments;
            t.iranEquivalent = p.iranEquivalent;
            t.aiReview = p.aiReview;
            if (p.comments?.length) t.comments = p.comments;
          }
        }
      }
      done++;
      console.log(`   ✅ [${done}/${targets.length}] ${p.faComments.length} comments`);
    } catch (e: any) {
      console.warn(`   ⚠️  ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, DELAY));
  }

  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n🎉 Backfilled ${done} products`);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
