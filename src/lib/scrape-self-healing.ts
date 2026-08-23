export type RemediationAction =
  | 'none'
  | 'retry'
  | 'refresh'
  | 'escalate';

export type FailureContext = {
  reason: string;
  consecutiveFailures: number;
  staleData: boolean;
};

export function decideRemediation(
  context: FailureContext
): RemediationAction {
  if (context.consecutiveFailures >= 3) {
    return 'escalate';
  }

  if (context.staleData) {
    return 'refresh';
  }

  if (context.reason.includes('timeout')) {
    return 'retry';
  }

  return 'none';
}
