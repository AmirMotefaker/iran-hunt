export type LearningAction = "observe" | "improve" | "retrain";

export function orchestrateLearning(input: {
  failures: number;
  opportunities: boolean;
}): LearningAction {
  if (input.failures >= 3) return "retrain";
  if (input.opportunities) return "improve";
  return "observe";
}
