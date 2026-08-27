import {
  evaluateGovernance,
  type GovernanceContext,
} from "./autonomous-governance";
import {
  evaluatePolicy,
  type PolicyState,
} from "./autonomous-policy-engine";

export type CommandAction =
  | "optimize"
  | "stabilize"
  | "observe"
  | "blocked";

export type CommandExecutionMode =
  | "execute"
  | "require-approval"
  | "observe-only"
  | "blocked";

export type AutonomousCommand = {
  id: string;
  requestedAction: Exclude<CommandAction, "blocked">;
  policyState: PolicyState;
  governance: GovernanceContext;
};

export type CommandExecutionDecision = {
  commandId: string;
  mode: CommandExecutionMode;
  action: CommandAction;
  allowed: boolean;
  requiresApproval: boolean;
  reason: string;
};

function normalizeGovernanceDecision(
  decision: string,
): Exclude<CommandAction, "blocked"> {
  if (decision === "optimize") return "optimize";
  if (decision === "stabilize") return "stabilize";
  return "observe";
}

function normalizePolicyAction(action: string): CommandAction {
  if (action === "optimize") return "optimize";
  if (action === "stabilize") return "stabilize";
  if (action === "observe") return "observe";
  return "blocked";
}

export function decideCommandExecution(
  command: AutonomousCommand,
): CommandExecutionDecision {
  const policy = evaluatePolicy(command.policyState);
  const governance = evaluateGovernance(command.governance);

  const governanceAction = normalizeGovernanceDecision(
    governance.decision,
  );

  const policyAction = normalizePolicyAction(
    policy.action,
  );

  if (!policy.allowed) {
    return {
      commandId: command.id,
      mode: "blocked",
      action: "blocked",
      allowed: false,
      requiresApproval: true,
      reason: "policy blocked autonomous execution",
    };
  }

  if (!governance.allowed) {
    return {
      commandId: command.id,
      mode: "require-approval",
      action: governanceAction,
      allowed: false,
      requiresApproval: true,
      reason: governance.reason,
    };
  }

  if (policy.requiresApproval) {
    return {
      commandId: command.id,
      mode: "require-approval",
      action: policyAction,
      allowed: false,
      requiresApproval: true,
      reason: "policy requires human approval before execution",
    };
  }

  if (
    command.requestedAction === "observe" ||
    governanceAction === "observe"
  ) {
    return {
      commandId: command.id,
      mode: "observe-only",
      action: "observe",
      allowed: true,
      requiresApproval: false,
      reason: governance.reason,
    };
  }

  if (policyAction !== command.requestedAction) {
    return {
      commandId: command.id,
      mode: "blocked",
      action: "blocked",
      allowed: false,
      requiresApproval: true,
      reason: "requested action conflicts with active policy",
    };
  }

  return {
    commandId: command.id,
    mode: "execute",
    action: command.requestedAction,
    allowed: true,
    requiresApproval: false,
    reason: "policy and governance authorize autonomous execution",
  };
}