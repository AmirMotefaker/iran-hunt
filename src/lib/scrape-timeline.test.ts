import { describe, expect, test } from 'bun:test';
import { createTimelineEvent } from './scrape-timeline';

describe('scrape timeline', () => {
  test('calculates run duration', () => {
    const event = createTimelineEvent(
      'success',
      '2026-01-01T00:00:00.000Z',
      '2026-01-01T00:00:05.000Z',
    );

    expect(event.durationMs).toBe(5000);
    expect(event.status).toBe('success');
  });
});
