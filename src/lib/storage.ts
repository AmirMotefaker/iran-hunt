import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { DailyData, PeriodKey, PeriodsData, Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// سقف هر بازه (تا دیتا هر روز رشد کنه ولی بی‌نهایت نشه)
const CAPS: Record<PeriodKey, number> = {
  today: 20, yesterday: 20, week: 50, month: 100, year: 200,
};

// ادغام دیتای قدیم + جدید (بدون تکرار، با بیشترین رأی)
function mergePeriods(oldP: PeriodsData | undefined, newP: PeriodsData): PeriodsData {
  const out = {} as PeriodsData;
  (Object.keys(CAPS) as PeriodKey[]).forEach((k) => {
    const map = new Map<string, Product>();
    for (const p of [...(oldP?.[k] ?? []), ...(newP?.[k] ?? [])]) {
      if (!p?.slug) continue;
      const prev = map.get(p.slug);
      if (!prev) map.set(p.slug, p);
      else {
        // merge عمیق: دیتای قدیمی حفظ میشه، دیتای جدید آپدیت میشه
        const m: any = { ...prev, ...p, votes: Math.max(prev.votes ?? 0, p.votes ?? 0) };
        if (!m.comments?.length && prev.comments?.length) m.comments = prev.comments;
        if (!m.faComments?.length && prev.faComments?.length) m.faComments = prev.faComments;
        if (!m.faDescription && prev.faDescription) m.faDescription = prev.faDescription;
        if (!m.aiReview && prev.aiReview) m.aiReview = prev.aiReview;
        if (!m.iranEquivalent && prev.iranEquivalent) m.iranEquivalent = prev.iranEquivalent;
        if (!m.description && prev.description) m.description = prev.description;
        if (!m.makerTwitter && prev.makerTwitter) m.makerTwitter = prev.makerTwitter;
        map.set(p.slug, m);
      }
    }
    out[k] = [...map.values()].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)).slice(0, CAPS[k]);
  });
  return out;
}

export async function saveDaily(date: string, periods: PeriodsData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const prev = await loadLatest();
  const merged = mergePeriods(prev?.periods, periods);
  const data: DailyData = {
    date,
    scrapedAt: new Date().toISOString(),
    periods: merged,
  };
  const file = path.join(DATA_DIR, `${date}.json`);
  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`💾 Saved (merged): ${file}`);
}

export async function loadLatest(): Promise<DailyData | null> {
  try {
    const files = (await readdir(DATA_DIR))
      .filter((f) => f.endsWith('.json'))
      .sort()
      .reverse();
    if (files.length === 0) return null;
    const raw = await readFile(path.join(DATA_DIR, files[0]), 'utf8');
    const parsed = JSON.parse(raw) as any;

    if (!parsed.periods) {
      const legacyProducts: Product[] = parsed.products ?? [];
      return {
        date: parsed.date,
        scrapedAt: parsed.scrapedAt,
        periods: {
          today: legacyProducts, yesterday: [], week: [], month: [], year: [],
        },
      };
    }
    if (!parsed.periods.year) parsed.periods.year = [];
    return parsed as DailyData;
  } catch {
    return null;
  }
}
