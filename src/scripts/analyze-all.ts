import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeProduct } from '@/lib/ai-analyzer';
import type { Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const BATCH_SIZE = 15; // هر بار 15 محصول
const DELAY = 6000; // 4 ثانیه بین هر محصول

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function enrichComments(token: string, products: Product[]): Promise<void> {
  const { load } = await import('cheerio');
  for (const p of products) {
    if ((p.comments ?? []).length > 0 && !p.comments!.every((c) => c.user.includes('REDACTED'))) continue;
    try {
      const q = `query { post(slug: "${p.slug}") { comments(first: 6) { edges { node { body user { name username } } } } } }`;
      const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) continue;
      const json: any = await res.json();
      const edges = json.data?.post?.comments?.edges ?? [];
      const fromApi = edges
        .map((e: any) => ({ user: e.node?.user?.name || e.node?.user?.username || '', text: stripHtml(e.node?.body ?? '') }))
        .filter((c: any) => c.text.length > 10);

      if (fromApi.every((c: any) => c.user.includes('REDACTED'))) {
        const htmlRes = await fetch(`https://www.producthunt.com/posts/${p.slug}`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        });
        if (htmlRes.ok) {
          const html = await htmlRes.text();
          const $ = load(html);
          const names: string[] = [];
          $('a[href^="/@"]').each((_, el) => {
            const name = $(el).text().trim();
            if (name && !name.startsWith('@') && name.length > 2 && name.length < 40 && !name.includes('REDACTED') && /[A-Za-z]/.test(name)) {
              names.push(name);
            }
          });
          p.comments = fromApi.map((c: any, i: number) => ({ user: names[i] || c.user, text: c.text }));
        }
      } else {
        p.comments = fromApi;
      }
    } catch { /* ادامه */ }
  }
}

async function main() {
  const token = process.env.PH_API_TOKEN;
  if (!token) { console.error('❌ PH_API_TOKEN not set'); process.exit(1); }

  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.json')).sort().reverse();
  console.log(`📦 Found ${files.length} data files`);

  let total = 0;
  let done = 0;
  const toAnalyze: { product: Product; file: string }[] = [];

  for (const file of files) {
    const data = JSON.parse(await readFile(path.join(DATA_DIR, file), 'utf8'));
    for (const key of ['today', 'yesterday', 'week', 'month', 'year']) {
      for (const p of data.periods[key] ?? []) {
        total++;
        if (!p.aiReview) toAnalyze.push({ product: p, file });
      }
    }
  }

  console.log(`\n🎯 Total products: ${total.toLocaleString('fa-IR')}`);
  console.log(`🎯 To analyze: ${toAnalyze.length.toLocaleString('fa-IR')}\n`);

  // پردازش دسته‌ای
  for (let i = 0; i < toAnalyze.length; i += BATCH_SIZE) {
    const batch = toAnalyze.slice(i, i + BATCH_SIZE);
    console.log(`\n=== Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(toAnalyze.length / BATCH_SIZE)} (${batch.length} products) ===`);

    await enrichComments(token, batch.map((b) => b.product));

    for (const { product, file } of batch) {
      if (product.aiReview) { done++; continue; }
      try {
        const ai = await analyzeProduct(product);
        product.faDescription = ai.faDescription;
        product.faComments = ai.faComments;
        product.iranEquivalent = ai.iranEquivalent;
        product.aiReview = ai.aiReview;

        // ذخیره در فایل
        const data = JSON.parse(await readFile(path.join(DATA_DIR, file), 'utf8'));
        for (const key of ['today', 'yesterday', 'week', 'month', 'year']) {
          const p = (data.periods[key] ?? []).find((x: any) => x.slug === product.slug);
          if (p) {
            p.faDescription = product.faDescription;
            p.faComments = product.faComments;
            p.iranEquivalent = product.iranEquivalent;
            p.aiReview = product.aiReview;
            p.comments = product.comments;
          }
        }
        await writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf8');
        done++;
        console.log(`   ✅ [${done}/${toAnalyze.length}] ${product.name}`);
      } catch (e: any) {
        console.warn(`   ⚠️  ${product.name}: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, DELAY));
    }
  }

  console.log(`\n🎉 Done! Analyzed ${done} products.`);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
