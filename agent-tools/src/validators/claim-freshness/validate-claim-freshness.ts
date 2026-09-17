import fs from 'node:fs/promises';
import path from 'node:path';

import { isJsonObject } from '../../core/json.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeLine, writeErrorLine } from '../../core/terminal-output.js';

import { assessFreshnessRows, decideFreshnessOutcome } from './validate-claim-freshness-helpers.js';

/**
 * Standalone validator for the perishable-claim freshness contract (ADR-223)
 * over registered surfaces. Deterministic and clock-free: it enforces only
 * completeness and integrity of the freshness metadata (`grounded_at`, the
 * closed `pin` declaration, and `review_by`) — defects in the record being
 * edited. Landing 1 also emits a report-only inventory of pinned monitoring
 * obligations and declared not-tracked rows. Expiry, pin drift, and
 * enforcement are session-open concerns owned by landing 2.
 *
 * Wired into root `repo-validators:check`, so it runs on every pre-commit,
 * pre-push, and CI run alongside the sibling validators.
 *
 * @packageDocumentation
 */

/**
 * The registered perishable surfaces and their risk-classified review-interval
 * ceilings (referent hazard × reliance impact — ADR-223). Adding a surface is
 * a reviewed change to this list.
 */
const REGISTERED_SURFACES = [
  {
    id: '.agent/hooks/policy.json platform_support',
    policyPath: '.agent/hooks/policy.json',
    /** Fast-referent × high-reliance: the 30-day owner-ruled ceiling. */
    maxIntervalDays: 30,
  },
] as const;

const repoRoot = resolveRepoRoot(import.meta.url);

/** Extract `platform_support` from parsed policy, or undefined. */
function platformSupportFrom(policy: unknown): unknown {
  return isJsonObject(policy) ? policy.platform_support : undefined;
}

async function main(): Promise<void> {
  let failed = false;
  for (const surface of REGISTERED_SURFACES) {
    const filePath = path.join(repoRoot, surface.policyPath);
    const parsed: unknown = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const assessment = assessFreshnessRows(platformSupportFrom(parsed), surface.maxIntervalDays);
    const outcome = decideFreshnessOutcome(assessment);
    if (outcome.exitCode !== 0) {
      failed = true;
      writeErrorLine(
        `validate-claim-freshness: freshness-metadata integrity check failed for ${surface.id}:\n\n` +
          `${outcome.reportLines.join('\n')}\n\n` +
          `Every claim on a registered perishable surface carries grounded_at (the date it was last ` +
          `verified first-hand), a strict pin declaration (pinned with a version, or not-tracked ` +
          `with a reason), and review_by (at most ${String(surface.maxIntervalDays)} days after ` +
          `grounded_at for this surface). See ADR-223 and .agent/hooks/README.md.`,
      );
    } else {
      for (const line of outcome.reportLines) {
        writeLine(line);
      }
    }
  }
  if (!failed) {
    return;
  }
  process.exitCode = 1;
}

await main();
