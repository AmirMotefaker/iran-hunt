import { format } from 'date-fns';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { analyzeProduct, type AIAnalysis } from '@/lib/ai-analyzer';
import { PERIODS, scrapePeriod } from '@/lib/scraper';
import { saveDaily } from '@/lib/storage';
import type { PeriodsData, Product } from '@/types';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const date = args[0] ?? format(new Date(), 'yyyy-MM-dd');
const skipAI = process.argv.includes('--no-ai') || (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY);

console.log(`🕷️  ایده‌جو scrape — ${date}`);
if (skipAI) console.log('⏭️  Skipping AI (will be filled by GitHub Actions)');

const periods = {} as PeriodsData;
const aiCache = new Map<string, AIAnalysis>();
const analyzedNow: string[] = [];

// تابع تحلیل یک محصول (با cache + خطاگیری)
async function analyzeOne(p: Product): Promise<boolean> {
  if (p.aiReview) return false;
  if (aiCache.has(p.name)) {
    const c = aiCache.get(p.name)!;
    p.faDescription = c.faDescription;
    p.faComments = c.faComments;
    p.iranEquivalent = c.iranEquivalent;
    p.aiReview = c.aiReview;
    return true;
  }
  try {
    const ai = await analyzeProduct(p);
    p.faDescription = ai.faDescription;
    p.faComments = ai.faComments;
    p.iranEquivalent = ai.iranEquivalent;
    p.aiReview = ai.aiReview;
    aiCache.set(p.name, ai);
    analyzedNow.push(p.name);
    return true;
  } catch (e: any) {
    console.warn(`      ⚠️  AI failed: ${e.message}`);
    return false;
  }
}

for (const { key, en } of PERIODS) {
  console.log(`\n=== 📅 ${en} ===`);
  const products = await scrapePeriod(process.env.PH_API_TOKEN, key, date);
  console.log(`   🏆 Top ${products.length}:`);
  for (const p of products) console.log(`      ${p.rank}. ${p.name} — ${p.votes} votes`);

  if (!skipAI) {
    for (const p of products) {
      if (p.aiReview) { console.log(`      ⏭️  ${p.name} (already analyzed)`); continue; }
      console.log(`      🤖 AI: ${p.name}`);
      await analyzeOne(p);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  periods[key] = products;
}

// Backfill: 5 محصول تحلیل‌نشده از فایل‌های قبلی
if (!skipAI) {
  console.log('\n🔁 Backfilling old products...');
  const files = (await readdir(path.join(process.cwd(), 'data'))).filter((f) => f.endsWith('.json')).sort().reverse().slice(1); // skip today
  let backfilled = 0;
  for (const file of files) {
    if (backfilled >= 5) break;
    const data = JSON.parse(await readFile(path.join(process.cwd(), 'data', file), 'utf8'));
    for (const key of ['today', 'yesterday', 'week', 'month', 'year']) {
      for (const p of data.periods[key] ?? []) {
        if (p.aiReview || backfilled >= 5) continue;
        console.log(`   🔄 Backfill: ${p.name}`);
        if (await analyzeOne(p)) {
          p.faDescription && (data.periods[key] = (data.periods[key] ?? []).map((x: any) => x.slug === p.slug ? p : x));
          await writeFile(path.join(process.cwd(), 'data', file), JSON.stringify(data, null, 2), 'utf8');
          backfilled++;
          await new Promise((r) => setTimeout(r, 3000));
          if (backfilled >= 5) break;
        }
      }
      if (backfilled >= 5) break;
    }
  }
  console.log(`   ✅ Backfilled ${backfilled} old products`);
}

await saveDaily(date, periods);
console.log(`\n🎉 Done! Analyzed ${analyzedNow.length} new products.`);
