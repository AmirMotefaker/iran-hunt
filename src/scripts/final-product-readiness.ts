import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadCorpus } from '@/lib/corpus';
import { auditFinalProductReadiness, type ReadinessIssue } from '@/lib/final-product-readiness';
import type { DailyData } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DAILY_FILE = /^\d{4}-\d{2}-\d{2}\.json$/;

function tehranDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tehran',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

async function latestDailyState() {
  const files = (await readdir(DATA_DIR)).filter((name) => DAILY_FILE.test(name)).sort();
  const latestFile = files.at(-1) ?? null;
  if (!latestFile) return { latestFile: null, daily: null as DailyData | null };
  const daily = JSON.parse(await readFile(path.join(DATA_DIR, latestFile), 'utf8')) as DailyData;
  return { latestFile, daily };
}

function percent(value: number, total: number): string {
  return total > 0 ? `${((value / total) * 100).toFixed(1)}%` : 'n/a';
}

const corpus = await loadCorpus();
const report = auditFinalProductReadiness(corpus.products);
const expectedDate = process.env.READINESS_EXPECTED_DATE?.trim() || tehranDate();
const { latestFile, daily } = await latestDailyState();
const freshnessBlockers: ReadinessIssue[] = [];

if (!latestFile || latestFile !== `${expectedDate}.json`) {
  freshnessBlockers.push({
    severity: 'blocker',
    code: 'stale-daily-dataset',
    field: 'data',
    message: `Expected daily dataset ${expectedDate}.json but latest repository dataset is ${latestFile ?? 'missing'}.`,
  });
}
if (daily && daily.date && daily.date !== expectedDate) {
  freshnessBlockers.push({
    severity: 'blocker',
    code: 'daily-date-mismatch',
    field: 'date',
    message: `Latest DailyData.date is ${daily.date}; expected ${expectedDate}.`,
  });
}
if (!daily?.periods?.today?.length) {
  freshnessBlockers.push({
    severity: 'blocker',
    code: 'empty-today-products',
    field: 'periods.today',
    message: 'Latest daily dataset has no products in periods.today.',
  });
}

const blockers = [...freshnessBlockers, ...report.blockers];
const ready = blockers.length === 0;
const m = report.metrics;

console.log('\n=== IDEHJO FINAL PRODUCT READINESS ===');
console.log(`Expected Tehran date: ${expectedDate}`);
console.log(`Latest daily file: ${latestFile ?? 'missing'}`);
console.log(`Corpus products: ${m.totalProducts}`);
console.log(`Persian descriptions: ${m.withPersianDescription}/${m.totalProducts} (${percent(m.withPersianDescription, m.totalProducts)})`);
console.log(`AI reviews: ${m.withAiReview}/${m.totalProducts} (${percent(m.withAiReview, m.totalProducts)})`);
console.log(`Iran recommendations: ${m.withIranEquivalent}/${m.totalProducts} (${percent(m.withIranEquivalent, m.totalProducts)})`);
console.log(`Products with source comments: ${m.productsWithSourceComments}`);
console.log(`Complete comment translations: ${m.withCompleteCommentTranslation}/${m.productsWithSourceComments} (${percent(m.withCompleteCommentTranslation, m.productsWithSourceComments)})`);
console.log(`Official websites: ${m.withOfficialWebsite}/${m.totalProducts}`);
console.log(`Thumbnails: ${m.withThumbnail}/${m.totalProducts}`);
console.log(`Screenshots: ${m.withScreenshots}/${m.totalProducts}`);
console.log(`Malformed products: ${m.malformedProducts}`);
console.log(`Duplicate slugs: ${m.duplicateSlugs}`);
console.log(`Duplicate source URLs: ${m.duplicateUrls}`);
console.log(`Blockers: ${blockers.length}`);
console.log(`Warnings: ${report.warnings.length}`);
console.log(`READY_FOR_PRODUCTION=${ready ? 'YES' : 'NO'}`);

if (blockers.length) {
  console.log('\n--- BLOCKERS (first 100) ---');
  for (const issue of blockers.slice(0, 100)) {
    console.log(`[${issue.code}] ${issue.productSlug ? `${issue.productSlug}: ` : ''}${issue.message}`);
  }
}

if (report.warnings.length) {
  console.log('\n--- WARNINGS (first 50) ---');
  for (const issue of report.warnings.slice(0, 50)) {
    console.log(`[${issue.code}] ${issue.productSlug ? `${issue.productSlug}: ` : ''}${issue.message}`);
  }
}

if (!ready) process.exit(1);
