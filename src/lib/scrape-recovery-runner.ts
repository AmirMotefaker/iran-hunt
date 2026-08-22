import type { RecoveryDecision } from './scrape-recovery';

export interface RecoveryRunState {
  attempts: number;
  maxAttempts: number;
}

export type RecoveryAction =
  | { type: 'success' }
  | { type: 'stop'; reason: string }
  | { type: 'retry'; waitMinutes: number };

export function chooseRecoveryAction(
  exitCode: number,
  decision: RecoveryDecision,
  state: RecoveryRunState,
): RecoveryAction {
  if (exitCode === 0) return { type: 'success' };

  if (state.attempts >= state.maxAttempts) {
    return { type: 'stop', reason: 'attempt-limit' };
  }

  if (decision.reason === 'limit-reached' || decision.reason === 'not-needed') {
    return { type: 'stop', reason: decision.reason };
  }

  if (decision.reason === 'cooldown') {
    return { type: 'retry', waitMinutes: Math.max(0, decision.delayMinutes) };
  }

  if (decision.shouldRetry) {
    return { type: 'retry', waitMinutes: Math.max(0, decision.delayMinutes) };
  }

  return { type: 'stop', reason: decision.reason };
}
