import { auditCorpus, loadCorpus } from '@/lib/corpus';

async function main() {
  const corpus = await loadCorpus();
  const audit = auditCorpus(corpus.products);

  console.log('📊 IdehJo Corpus Audit');
  console.log(`products: ${audit.products}`);
  console.log(`real comments: ${audit.withRealComments}`);
  console.log(`total real comments: ${audit.totalRealComments}`);
  console.log(`Persian comments: ${audit.withPersianComments}`);
  console.log(`Persian descriptions: ${audit.withPersianDescription}`);
  console.log(`AI reviews: ${audit.withAiReview}`);
  console.log(`Iranian equivalents: ${audit.withIranEquivalent}`);

  if (audit.products < 100) throw new Error(`corpus safety floor failed: ${audit.products}`);
}

main().catch((error) => {
  console.error('❌ corpus audit failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
