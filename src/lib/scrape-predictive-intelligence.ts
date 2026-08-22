export type ScrapeSignal = {
  successRate: number;
  consecutiveFailures: number;
  averageDurationMs: number;
};

export type PredictiveRisk = 'low' | 'medium' | 'high';

export function getPredictiveRisk(signal: ScrapeSignal): PredictiveRisk {
  if (signal.consecutiveFailures >= 3 || signal.successRate < 0.5) {
    return 'high';
  }

  if (signal.consecutiveFailures > 0 || signal.successRate < 0.8) {
    return 'medium';
  }

  return 'low';
}
