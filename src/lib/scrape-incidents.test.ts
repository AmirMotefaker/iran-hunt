import { describe, expect, test } from 'bun:test';
import { deriveScrapeIncidents } from './scrape-incidents';

describe('scrape incidents', () => {
  test('derives incidents and escalates the third consecutive failure', () => {
    const incidents = deriveScrapeIncidents([
      { status: 'failed', startedAt: '3', finishedAt: '3', error: 'three' },
      { status: 'failed', startedAt: '2', finishedAt: '2', error: 'two' },
      { status: 'failed', startedAt: '1', finishedAt: '1', error: 'one' },
    ]);
    expect(incidents[0].severity).toBe('critical');
    expect(incidents).toHaveLength(3);
  });

  test('success resets incident escalation streak', () => {
    const incidents = deriveScrapeIncidents([
      { status: 'failed', startedAt: '3', finishedAt: '3', error: 'new' },
      { status: 'success', startedAt: '2', finishedAt: '2', error: null },
      { status: 'failed', startedAt: '1', finishedAt: '1', error: 'old' },
    ]);
    expect(incidents.every((incident) => incident.severity === 'warning')).toBe(true);
  });
});
