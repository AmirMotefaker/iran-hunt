export type EvolutionSignal =
  | 'stable'
  | 'improve'
  | 'evolve';

export type EvolutionContext = {
  reliabilityScore: number;
  optimizationNeeded: boolean;
  consecutiveFailures: number;
};

export function getEvolutionSignal(
  context: EvolutionContext
): EvolutionSignal {
  if (context.consecutiveFailures >= 3) return 'evolve';
  if (context.optimizationNeeded || context.reliabilityScore < 0.9) {
    return 'improve';
  }
  return 'stable';
}
