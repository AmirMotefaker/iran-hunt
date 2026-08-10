import { format } from 'date-fns';
import { analyzeProduct, type AIAnalysis } from '@/lib/ai-analyzer';
import { PERIODS, scrapePeriod } from '@/lib/scraper';
import { saveDaily } from '@/lib/storage';
import type { PeriodsData } from '@/types';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const date = args[0] ?? format(new Date(), 'yyyy-MM-dd');
const skipAI = process.argv.includes('--no-ai') || (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY);

console.log(`🕷️  ایده‌جو scrape — ${date}`);
if (skipAI) console.log('⏭️  Skipping AI (will be filled by GitHub Actions)');

const periods = {} as PeriodsData;
const aiCache = new Map<string, AIAnalysis>();

for (const { key, en } of PERIODS) {
  console.log(`\n=== 📅 ${en} ===`);
  const products = await scrapePeriod(process.env.PH_API_TOKEN, key, date);

  console.log(`   🏆 Top ${products.length}:`);
  for (const p of products) console.log(`      ${p.rank}. ${p.name} — ${p.votes} votes`);

  if (!skipAI) {
    for (const p of products) {
      // اگه قبلاً تحلیل شده، skip کن (دیتا هر روز تکمیل‌تر میشه، نه تکراری)
      if (p.aiReview) { console.log(`      ⏭️  ${p.name} (already analyzed)`); continue; }
      if (aiCache.has(p.name)) {
        const cached = aiCache.get(p.name)!;
        p.faDescription = cached.faDescription;
        p.faComments = cached.faComments;
        p.iranEquivalent = cached.iranEquivalent;
        p.aiReview = cached.aiReview;
        continue;
      }
      console.log(`      🤖 AI: ${p.name}`);
      try {
        const ai = await analyzeProduct(p);
        p.faDescription = ai.faDescription;
        p.faComments = ai.faComments;
        p.iranEquivalent = ai.iranEquivalent;
        p.aiReview = ai.aiReview;
        aiCache.set(p.name, ai);
      } catch (e: any) {
        // یک محصول خراب نشه کل اجرا رو نمی‌کشه
        console.warn(`      ⚠️  AI failed for ${p.name}: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  periods[key] = products;
}

await saveDaily(date, periods);
console.log('\n🎉 Done!');
