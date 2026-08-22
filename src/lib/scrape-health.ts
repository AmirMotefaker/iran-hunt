import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');
const HEALTH_FILE = path.join(DATA_DIR, 'scrape-health.json');
const MAX_RECENT_RUNS = 20;

export type ScrapeHealthStatus = 'idle' | 'running' | 'success' | 'failed';
export type CompletedScrapeStatus = 'success' | 'failed';

export interface ScrapeRunRecord {
  status: CompletedScrapeStatus;
  startedAt: string;
  finishedAt: string;
  error: string | null;
}

export interface ScrapeHealth {
  status: ScrapeHealthStatus;
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  lastFailureReason: string | null;
  consecutiveFailures: number;
  recentRuns: ScrapeRunRecord[];
}

export const EMPTY_SCRAPE_HEALTH: ScrapeHealth = {
  status: 'idle', lastAttemptAt: null, lastSuccessAt: null, lastFailureAt: null,
  lastFailureReason: null, consecutiveFailures: 0, recentRuns: [],
};

function normalizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/\s+/g, ' ').trim().slice(0, 500) || 'Unknown scrape failure';
}

function appendRun(previous: ScrapeHealth, record: ScrapeRunRecord): ScrapeRunRecord[] {
  return [record, ...(previous.recentRuns ?? [])].slice(0, MAX_RECENT_RUNS);
}

export function startScrapeHealth(previous: ScrapeHealth, at = new Date().toISOString()): ScrapeHealth {
  return { ...previous, status: 'running', lastAttemptAt: at };
}

export function succeedScrapeHealth(previous: ScrapeHealth, at = new Date().toISOString()): ScrapeHealth {
  const startedAt = previous.lastAttemptAt ?? at;
  return { ...previous, status: 'success', lastAttemptAt: startedAt, lastSuccessAt: at,
    lastFailureReason: null, consecutiveFailures: 0,
    recentRuns: appendRun(previous, { status: 'success', startedAt, finishedAt: at, error: null }) };
}

export function failScrapeHealth(previous: ScrapeHealth, error: unknown, at = new Date().toISOString()): ScrapeHealth {
  const startedAt = previous.lastAttemptAt ?? at;
  const failureReason = normalizeError(error);
  return { ...previous, status: 'failed', lastAttemptAt: startedAt, lastFailureAt: at,
    lastFailureReason: failureReason, consecutiveFailures: Math.max(0, previous.consecutiveFailures) + 1,
    recentRuns: appendRun(previous, { status: 'failed', startedAt, finishedAt: at, error: failureReason }) };
}

export async function loadScrapeHealth(): Promise<ScrapeHealth> {
  try {
    const raw = await readFile(HEALTH_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<ScrapeHealth>;
    return { ...EMPTY_SCRAPE_HEALTH, ...parsed,
      consecutiveFailures: Number.isFinite(parsed.consecutiveFailures) ? Math.max(0, Number(parsed.consecutiveFailures)) : 0,
      recentRuns: Array.isArray(parsed.recentRuns) ? parsed.recentRuns.slice(0, MAX_RECENT_RUNS) : [] };
  } catch { return { ...EMPTY_SCRAPE_HEALTH }; }
}

export async function saveScrapeHealth(health: ScrapeHealth): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(HEALTH_FILE, JSON.stringify(health, null, 2), 'utf8');
}
