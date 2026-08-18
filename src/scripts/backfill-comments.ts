import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeProduct } from '@/lib/ai-analyzer';
import { fetchRealComments } from '@/lib/ph-comments';
import type { PHComment, Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DELAY = 6000;
const MAX = 12;
const KEYS = ['today', 'yesterday', 'week', 'month', 'year'] as const;
const isPersian = (s: string) => /[\u0600-\u06FF]/.test(s);
const hasFakeName = (p: Product) => (p.faComments ?? []).some((c) => String(c.user).startsWith('کاربر ProductHunt'));

function fallbackComments(p: Product): PHComment[] {
  return (p.comments ?? []).slice(0, 4).map((c, i) => ({
    user: c.user && !String(c.user).includes('REDACTED') ? c.user : `کاربر ProductHunt ${i + 1}`,
    text: c.text,
  }));
}

async function main() {
  const token = process.env.PH_API_TOKEN;
  if (!token) { console.error('❌ PH_API_TOKEN missing'); process.exit(1); }

  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.json')).sort().reverse();
  const file = path.join(DATA_DIR, files[0]);
  const data = JSON.parse(await readFile(file, 'utf8'));

  const uniq = new Map<string, Product>();
  for (const k of KEYS) for (const p of data.periods[k] ?? []) if (!uniq.has(p.slug)) uniq.set(p.slug, p);

  // هدف: بدون کامنت | کامنت غیرفارسی | نام فیک | بدون aiReview
  const targets = [...uniq.values()]
    .filter((p) => !p.faComments?.length || !isPersian(p.faComments[0]?.text ?? '') || !p.aiReview || hasFakeName(p))
    .slice(0, MAX);

  console.log(`🔄 Backfill: ${targets.length} products`);

  let done = 0;
  for (const p of targets) {
    console.log(`\n🤖 ${p.name}`);
    try {
      const { list, real } = await fetchRealComments(token, p.slug);
      if (list.length) p.comments = list;

      let ai: any = null;
      try { ai = await analyzeProduct(p); } catch (e: any) { console.warn(`   ⚠️  AI: ${e.message}`); }

      if (ai) {
        p.faDescription = ai.faDescription;
        p.faComments = ai.faComments;
        p.iranEquivalent = ai.iranEquivalent;
        p.aiReview = ai.aiReview;
      }
      if (!p.faComments?.length) p.faComments = fallbackComments(p);

      // ارتقای نام‌ها اگه نام واقعی پیدا شد
      if (real && p.comments?.length) {
        p.faComments = (p.faComments ?? []).map((c, i) => {
          const ru = p.comments![i]?.user ?? '';
          return ru && !ru.includes('REDACTED') ? { ...c, user: ru } : c;
        });
      }

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
      console.log(`   ✅ [${done}/${targets.length}] ${p.faComments.length} comments | real names: ${real}`);
    } catch (e: any) {
      console.warn(`   ⚠️  ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, DELAY));
  }

  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n🎉 Backfilled ${done} products`);
}

main().catch((e) => { console.error('❌', e.message); process.exit(1); });
