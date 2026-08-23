export type StrategySignal = {
  opportunityScore: number;
  recommendation: string;
};

export function evaluateStrategy(input: {
  reliability: number;
  failures: number;
}): StrategySignal {
  if (input.failures > 3) {
    return {
      opportunityScore: 80,
      recommendation: "prioritize reliability improvements",
    };
  }

  return {
    opportunityScore: Math.max(0, 100 - input.reliability),
    recommendation: "continue strategic optimization",
  };
}
