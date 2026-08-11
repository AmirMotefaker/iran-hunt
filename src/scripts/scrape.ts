import { format } from 'date-fns';
import { analyzeProduct } from '@/lib/ai-analyzer';
import { PERIODS, scrapePeriod } from '@/lib/scraper';
import { saveDaily } from '@/lib/storage';
import type { PeriodsData } from '@/types';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const date = args[0] ?? format(new Date(), 'yyyy-MM-dd');
const skipAI = process.argv.includes('--no-ai') || (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY);

console.log(`🕷️  ایده‌جو scrape — ${date}`);
if (skipAI) console.log('⏭️  Skipping AI');

const periods = {} as PeriodsData;

for (const { key, en } of PERIODS) {
  console.log(`\n=== 📅 ${en} ===`);
  const products = await scrapePeriod(process.env.PH_API_TOKEN, key, date);
  console.log(`   🏆 Top ${products.length}:`);
  for (const p of products) console.log(`      ${p.rank}. ${p.name} — ${p.votes} votes`);

  // فقط محصولات امروز تحلیل AI میشن (جلوگیری از 429)
  if (!skipAI && key === 'today') {
    for (const p of products) {
      if (p.aiReview) { console.log(`      ⏭️  ${p.name} (already analyzed)`); continue; }
      console.log(`      🤖 AI: ${p.name}`);
      try {
        const ai = await analyzeProduct(p);
        p.faDescription = ai.faDescription;
        p.faComments = ai.faComments;
        p.iranEquivalent = ai.iranEquivalent;
        p.aiReview = ai.aiReview;
      } catch (e: any) {
        console.warn(`      ⚠️  AI failed: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 6000));
    }
  }

  periods[key] = products;
}

await saveDaily(date, periods);
console.log('\n🎉 Done!');
