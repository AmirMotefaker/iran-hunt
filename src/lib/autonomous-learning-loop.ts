export type LearningOutcome = {
  signal: "reinforce" | "adjust" | "escalate";
  score: number;
};

export function evaluateLearningOutcome(input: {
  success: boolean;
  confidence: number;
  repeatedFailure?: boolean;
}): LearningOutcome {
  if (input.repeatedFailure) return { signal: "escalate", score: 20 };
  if (input.success && input.confidence >= 80) return { signal: "reinforce", score: 90 };
  return { signal: "adjust", score: 55 };
}
