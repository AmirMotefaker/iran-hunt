import { format } from 'date-fns';
import { analyzeProduct, type AIAnalysis } from '@/lib/ai-analyzer';
import { PERIODS, scrapePeriod } from '@/lib/scraper';
import { saveDaily } from '@/lib/storage';
import type { PeriodsData } from '@/types';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const date = args[0] ?? format(new Date(), 'yyyy-MM-dd');
const skipAI = process.argv.includes('--no-ai') || !process.env.GROQ_API_KEY;

console.log(`🕷️  ایده‌جو scrape — ${date}`);
if (skipAI) console.log('⏭️  Skipping AI (will be filled by GitHub Actions from US IP)');

const periods = {} as PeriodsData;
const aiCache = new Map<string, AIAnalysis>();

for (const { key, en } of PERIODS) {
  console.log(`\n=== 📅 ${en} ===`);
  const products = await scrapePeriod(process.env.PH_API_TOKEN, key, date);

  console.log(`   🏆 Top ${products.length}:`);
  for (const p of products) console.log(`      ${p.rank}. ${p.name} — ${p.votes} votes`);

  if (!skipAI) {
    for (const p of products) {
      if (aiCache.has(p.name)) {
        const cached = aiCache.get(p.name)!;
        p.faDescription = cached.faDescription;
        p.faComments = cached.faComments;
        p.iranEquivalent = cached.iranEquivalent;
        continue;
      }
      console.log(`      🤖 AI: ${p.name}`);
      const ai = await analyzeProduct(p);
      p.faDescription = ai.faDescription;
      p.faComments = ai.faComments;
      p.iranEquivalent = ai.iranEquivalent;
        p.aiReview = ai.aiReview;
      aiCache.set(p.name, ai);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  periods[key] = products;
}

await saveDaily(date, periods);
console.log('\n🎉 Done!');
