import { format } from 'date-fns';
import { analyzeProduct, type AIAnalysis } from '@/lib/ai-analyzer';
import { PERIODS, scrapePeriod, TOP_COUNT } from '@/lib/scraper';
import { saveDaily } from '@/lib/storage';
import type { PeriodsData } from '@/types';

const date = process.argv[2] ?? format(new Date(), 'yyyy-MM-dd');

console.log(`🕷️  IranHunt scrape — ${date} (4 periods)`);

const periods = {} as PeriodsData;
const aiCache = new Map<string, AIAnalysis>();

for (const { key, en } of PERIODS) {
  console.log(`\n=== 📅 ${en} ===`);
  const products = await scrapePeriod(process.env.PH_API_TOKEN, key, date);

  console.log(`   🏆 Top ${products.length}:`);
  for (const p of products) {
    console.log(`      ${p.rank}. ${p.name} — ${p.votes} votes`);
  }

  // AI analysis (cached across periods to save quota)
  for (const p of products) {
    if (aiCache.has(p.name)) {
      const cached = aiCache.get(p.name)!;
      p.faDescription = cached.faDescription;
      p.faComments = cached.faComments;
      p.iranEquivalent = cached.iranEquivalent;
      console.log(`      ♻️  AI cached: ${p.name}`);
      continue;
    }

    console.log(`      🤖 AI: ${p.name}`);
    const ai = await analyzeProduct(p);
    p.faDescription = ai.faDescription;
    p.faComments = ai.faComments;
    p.iranEquivalent = ai.iranEquivalent;
    aiCache.set(p.name, ai);

    await new Promise((r) => setTimeout(r, 1500));
  }

  periods[key] = products;
}

await saveDaily(date, periods);
console.log('\n🎉 Done!');
