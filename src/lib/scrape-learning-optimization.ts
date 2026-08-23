export type OptimizationSignal =
  | 'stable'
  | 'optimize'
  | 'investigate';

export type LearningContext = {
  successRate: number;
  averageDurationMs: number;
  consecutiveFailures: number;
};

export function getOptimizationSignal(
  context: LearningContext
): OptimizationSignal {
  if (context.consecutiveFailures >= 3) {
    return 'investigate';
  }

  if (context.successRate < 0.9 || context.averageDurationMs > 60000) {
    return 'optimize';
  }

  return 'stable';
}
