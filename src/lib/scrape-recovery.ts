export interface RecoveryDecision {
  shouldRetry: boolean;
  delayMinutes: number;
  reason: 'retry' | 'cooldown' | 'limit-reached' | 'not-needed';
}

const BACKOFF_MINUTES = [5, 15];

export function decideScrapeRecovery(
  consecutiveFailures: number,
  lastFailureAt: string | null,
  now = new Date(),
): RecoveryDecision {
  if (consecutiveFailures <= 0) return { shouldRetry: false, delayMinutes: 0, reason: 'not-needed' };
  if (consecutiveFailures > BACKOFF_MINUTES.length) {
    return { shouldRetry: false, delayMinutes: 0, reason: 'limit-reached' };
  }

  const delayMinutes = BACKOFF_MINUTES[consecutiveFailures - 1];
  if (!lastFailureAt) return { shouldRetry: true, delayMinutes, reason: 'retry' };

  const failedAt = new Date(lastFailureAt).getTime();
  if (!Number.isFinite(failedAt)) return { shouldRetry: true, delayMinutes, reason: 'retry' };

  const elapsedMinutes = (now.getTime() - failedAt) / 60000;
  if (elapsedMinutes < delayMinutes) {
    return { shouldRetry: false, delayMinutes: Math.ceil(delayMinutes - elapsedMinutes), reason: 'cooldown' };
  }

  return { shouldRetry: true, delayMinutes: 0, reason: 'retry' };
}
