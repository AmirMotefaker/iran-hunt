import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildCorpusFromHistory } from '@/lib/corpus';

const DATA_DIR = path.join(process.cwd(), 'data');
const CORPUS_FILE = path.join(DATA_DIR, 'corpus.json');

async function main() {
  const corpus = await buildCorpusFromHistory();

  if (corpus.products.length < 100) {
    throw new Error(`corpus recovery safety gate failed: only ${corpus.products.length} unique products`);
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(CORPUS_FILE, JSON.stringify(corpus, null, 2), 'utf8');

  console.log('✅ Historical corpus recovered');
  console.log(`   source files: ${corpus.sourceFiles}`);
  console.log(`   unique products: ${corpus.audit.products}`);
  console.log(`   with real comments: ${corpus.audit.withRealComments}`);
  console.log(`   Persian comments: ${corpus.audit.withPersianComments}`);
  console.log(`   Persian descriptions: ${corpus.audit.withPersianDescription}`);
  console.log(`   AI reviews: ${corpus.audit.withAiReview}`);
  console.log(`   Iranian equivalents: ${corpus.audit.withIranEquivalent}`);
  console.log(`   total real comments: ${corpus.audit.totalRealComments}`);
  console.log(`   output: ${CORPUS_FILE}`);
}

main().catch((error) => {
  console.error('❌ corpus recovery failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
