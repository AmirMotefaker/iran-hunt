import { describe, expect, test } from 'bun:test';
import { chooseRecoveryAction } from './scrape-recovery-runner';

describe('recovery runner decisions', () => {
  test('stops immediately after success', () => {
    expect(chooseRecoveryAction(
      0,
      { shouldRetry: false, delayMinutes: 0, reason: 'not-needed' },
      { attempts: 1, maxAttempts: 3 },
    )).toEqual({ type: 'success' });
  });

  test('waits through cooldown and retries', () => {
    expect(chooseRecoveryAction(
      1,
      { shouldRetry: false, delayMinutes: 5, reason: 'cooldown' },
      { attempts: 1, maxAttempts: 3 },
    )).toEqual({ type: 'retry', waitMinutes: 5 });
  });

  test('never exceeds max attempts', () => {
    expect(chooseRecoveryAction(
      1,
      { shouldRetry: true, delayMinutes: 0, reason: 'retry' },
      { attempts: 3, maxAttempts: 3 },
    )).toEqual({ type: 'stop', reason: 'attempt-limit' });
  });

  test('stops when policy reaches retry limit', () => {
    expect(chooseRecoveryAction(
      1,
      { shouldRetry: false, delayMinutes: 0, reason: 'limit-reached' },
      { attempts: 2, maxAttempts: 3 },
    )).toEqual({ type: 'stop', reason: 'limit-reached' });
  });
});
