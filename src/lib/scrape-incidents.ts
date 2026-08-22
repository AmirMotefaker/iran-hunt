import type { ScrapeRunRecord } from './scrape-health';

export type IncidentSeverity = 'warning' | 'critical';

export interface ScrapeIncident {
  startedAt: string;
  finishedAt: string;
  severity: IncidentSeverity;
  error: string;
}

export function deriveScrapeIncidents(runs: ScrapeRunRecord[]): ScrapeIncident[] {
  let streak = 0;
  return [...runs].reverse().reduce<ScrapeIncident[]>((items, run) => {
    if (run.status === 'success') {
      streak = 0;
      return items;
    }
    streak += 1;
    items.unshift({
      startedAt: run.startedAt,
      finishedAt: run.finishedAt,
      severity: streak >= 3 ? 'critical' : 'warning',
      error: run.error ?? 'Unknown scrape failure',
    });
    return items;
  }, []);
}
