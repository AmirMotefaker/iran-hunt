import { format } from 'date-fns';
import { analyzeIranEquivalent } from '@/lib/ai-analyzer';
import { scrapeProductHunt } from '@/lib/scraper';
import { saveDaily } from '@/lib/storage';

const date = process.argv[2] ?? format(new Date(), 'yyyy-MM-dd');

console.log(`🕷️  IranHunt scrape — ${date}`);

const products = await scrapeProductHunt(date);
console.log(`\n✅ Scraped ${products.length} products:`);
for (const p of products) {
  console.log(`   ${p.rank}. ${p.name} (${p.votes} votes) — ${p.category}`);
}

console.log(`\n🤖 Running AI analysis...`);
for (const p of products) {
  console.log(`   → ${p.name}`);
  p.iranEquivalent = await analyzeIranEquivalent(p);
}

await saveDaily(date, products);
console.log('\n🎉 Done!');
