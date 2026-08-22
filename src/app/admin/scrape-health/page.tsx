import { loadScrapeHealth } from '@/lib/scrape-health';

export default async function ScrapeHealthPage() {
  const health = await loadScrapeHealth();

  return (
    <main>
      <h1>Scrape Health</h1>
      <p>Status: {health.status}</p>
      <p>Failure streak: {health.consecutiveFailures}</p>
    </main>
  );
}
