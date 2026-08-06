import { format } from 'date-fns';
import { analyzeProduct } from '@/lib/ai-analyzer';
import { scrapeProductHunt } from '@/lib/scraper';
import { saveDaily } from '@/lib/storage';

const date = process.argv[2] ?? format(new Date(), 'yyyy-MM-dd');

console.log(`🕷️  IranHunt scrape — ${date}`);

const products = await scrapeProductHunt(date);
console.log(`\n✅ Scraped ${products.length} products (ranked by votes):`);
for (const p of products) {
  console.log(`   ${p.rank}. ${p.name} — ${p.votes} votes`);
}

console.log('\n🤖 Running AI analysis (Persian + Iranian equivalent)...');
for (const p of products) {
  console.log(`   → ${p.name}`);
  const ai = await analyzeProduct(p);
  p.faDescription = ai.faDescription;
  p.faComments = ai.faComments;
  p.iranEquivalent = ai.iranEquivalent;

  // Wait between products to avoid rate limit
  if (products.indexOf(p) < products.length - 1) {
    console.log(`      ⏳ Waiting 2s before next product...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

await saveDaily(date, products);
console.log('\n🎉 Done!');
