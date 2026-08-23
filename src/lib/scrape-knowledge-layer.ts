export type KnowledgeSignal = "learn" | "retain" | "observe";

export function knowledgeLayer(input: {
  incidents: number;
  improvements: boolean;
}): KnowledgeSignal {
  if (input.incidents > 0) return "learn";
  if (input.improvements) return "retain";
  return "observe";
}
