import { loadScrapeHealth } from '@/lib/scrape-health';
import { decideScrapeRecovery } from '@/lib/scrape-recovery';
import { chooseRecoveryAction } from '@/lib/scrape-recovery-runner';

const MAX_ATTEMPTS = 3;
const noAI = process.argv.includes('--no-ai');

function sleep(minutes: number): Promise<void> {
  const overrideMs = Number(process.env.SCRAPE_RECOVERY_WAIT_OVERRIDE_MS);
  const waitMs = Number.isFinite(overrideMs) && overrideMs >= 0
    ? overrideMs
    : minutes * 60_000;

  console.log(`⏳ Recovery wait: ${minutes} minute(s)`);
  return new Promise((resolve) => setTimeout(resolve, waitMs));
}

async function runScrape(): Promise<number> {
  const args = ['bun', 'run', 'scrape'];
  if (noAI) args.push('--', '--no-ai');

  const child = Bun.spawn(args, {
    cwd: process.cwd(),
    env: process.env,
    stdout: 'inherit',
    stderr: 'inherit',
    stdin: 'inherit',
  });

  return child.exited;
}

let attempts = 0;

while (attempts < MAX_ATTEMPTS) {
  attempts += 1;
  console.log(`\n🔁 Scrape attempt ${attempts}/${MAX_ATTEMPTS}`);

  const exitCode = await runScrape();
  const health = await loadScrapeHealth();
  const decision = decideScrapeRecovery(
    health.consecutiveFailures,
    health.lastFailureAt,
  );
  const action = chooseRecoveryAction(exitCode, decision, {
    attempts,
    maxAttempts: MAX_ATTEMPTS,
  });

  if (action.type === 'success') {
    console.log('✅ Scrape recovered successfully.');
    process.exit(0);
  }

  if (action.type === 'stop') {
    console.error(`🛑 Recovery stopped: ${action.reason}`);
    process.exit(exitCode || 1);
  }

  await sleep(action.waitMinutes);
}

process.exit(1);
