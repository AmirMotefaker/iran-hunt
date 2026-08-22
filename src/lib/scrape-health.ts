import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const HEALTH_FILE = path.join(DATA_DIR, 'scrape-health.json');

export type ScrapeHealthStatus = 'idle' | 'running' | 'success' | 'failed';

export interface ScrapeHealth {
  status: ScrapeHealthStatus;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastFailureReason: string | null;
  consecutiveFailures: number;
}

export const EMPTY_SCRAPE_HEALTH: ScrapeHealth = {
  status: 'idle',
  lastAttemptAt: null,
  lastSuccessAt: null,
  lastFailureAt: null,
  lastFailureReason: null,
  consecutiveFailures: 0,
};

function normalizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/\s+/g, ' ').trim().slice(0, 500) || 'Unknown scrape failure';
}

export function startScrapeHealth(previous: ScrapeHealth, at = new Date().toISOString()): ScrapeHealth {
  return { ...previous, status: 'running', lastAttemptAt: at };
}

export function succeedScrapeHealth(previous: ScrapeHealth, at = new Date().toISOString()): ScrapeHealth {
  return {
    ...previous,
    status: 'success',
    lastAttemptAt: previous.lastAttemptAt ?? at,
    lastSuccessAt: at,
    lastFailureReason: null,
    consecutiveFailures: 0,
  };
}

export function failScrapeHealth(previous: ScrapeHealth, error: unknown, at = new Date().toISOString()): ScrapeHealth {
  return {
    ...previous,
    status: 'failed',
    lastAttemptAt: previous.lastAttemptAt ?? at,
    lastFailureAt: at,
    lastFailureReason: normalizeError(error),
    consecutiveFailures: Math.max(0, previous.consecutiveFailures) + 1,
  };
}

export async function loadScrapeHealth(): Promise<ScrapeHealth> {
  try {
    const raw = await readFile(HEALTH_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ScrapeHealth>;
    return {
      ...EMPTY_SCRAPE_HEALTH,
      ...parsed,
      consecutiveFailures: Number.isFinite(parsed.consecutiveFailures)
        ? Math.max(0, Number(parsed.consecutiveFailures))
        : 0,
    };
  } catch {
    return { ...EMPTY_SCRAPE_HEALTH };
  }
}

export async function saveScrapeHealth(health: ScrapeHealth): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(HEALTH_FILE, JSON.stringify(health, null, 2), 'utf8');
}
