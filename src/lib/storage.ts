import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Product } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface DailyData {
  date: string;
  scrapedAt: string;
  products: Product[];
}

export async function saveDaily(date: string, products: Product[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const data: DailyData = {
    date,
    scrapedAt: new Date().toISOString(),
    products,
  };
  await writeFile(
    path.join(DATA_DIR, `${date}.json`),
    JSON.stringify(data, null, 2),
    'utf8',
  );
}

export async function loadLatest(): Promise<DailyData | null> {
  try {
    const files = (await readdir(DATA_DIR))
      .filter((f) => f.endsWith('.json'))
      .sort()
      .reverse();
    if (files.length === 0) return null;
    const raw = await readFile(path.join(DATA_DIR, files[0]), 'utf8');
    return JSON.parse(raw) as DailyData;
  } catch {
    return null;
  }
}
