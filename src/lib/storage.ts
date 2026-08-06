import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { DailyData, PeriodsData, Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function saveDaily(date: string, periods: PeriodsData): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const data: DailyData = {
    date,
    scrapedAt: new Date().toISOString(),
    periods,
  };
  const file = path.join(DATA_DIR, `${date}.json`);
  await writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`💾 Saved: ${file}`);
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

    // Legacy format support (old single-list files)
    if (!parsed.periods) {
      const legacyProducts: Product[] = parsed.products ?? [];
      return {
        date: parsed.date,
        scrapedAt: parsed.scrapedAt,
        periods: {
          today: legacyProducts,
          yesterday: [],
          week: [],
          month: [],
          year: [],
        },
      };
    }

    // Ensure year field exists (backwards compat)
    if (!parsed.periods.year) parsed.periods.year = [];

    return parsed as DailyData;
  } catch {
    return null;
  }
}
