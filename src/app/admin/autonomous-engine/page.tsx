import { getAutonomousDashboardState } from "@/lib/autonomous-dashboard";

export default function AutonomousEnginePage() {
  const state = getAutonomousDashboardState();
  const items = [
    ["System Health", state.systemHealth],
    ["Current Reasoning", state.reasoning],
    ["Selected Strategy", state.strategy],
    ["Planned Action", state.plannedAction],
    ["Execution Status", state.executionStatus],
  ];

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 20px" }}>
      <h1>Autonomous Intelligence Engine</h1>
      <p>Operational visibility for IdehJo&apos;s autonomous intelligence stack.</p>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "24px" }}>
        {items.map(([label, value]) => (
          <article key={label} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "18px" }}>
            <h2 style={{ fontSize: "16px", marginTop: 0 }}>{label}</h2>
            <p style={{ marginBottom: 0 }}>{value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
