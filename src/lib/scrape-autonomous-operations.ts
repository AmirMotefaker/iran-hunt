export type OperationAction =
  | 'continue'
  | 'retry'
  | 'pause'
  | 'escalate';

export type OperationSignal = {
  risk: 'low' | 'medium' | 'high';
  consecutiveFailures: number;
};

export function decideOperation(signal: OperationSignal): OperationAction {
  if (signal.risk === 'high' && signal.consecutiveFailures >= 3) {
    return 'escalate';
  }

  if (signal.risk === 'high') {
    return 'pause';
  }

  if (signal.risk === 'medium') {
    return 'retry';
  }

  return 'continue';
}
