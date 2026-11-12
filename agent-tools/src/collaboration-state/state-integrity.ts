import { basename, join } from 'node:path';

import { isLegacyActiveClaimsText } from './active-claims-legacy-migration.js';
import { checkCommitQueueEntryExpiry } from './commit-queue-expiry.js';
import {
  createCollaborationJsonSchemaValidator,
  type CollaborationJsonSchemaValidator,
} from './collaboration-json-validation.js';
import { parseCommitQueueIntentText } from './registry-entry-parser.js';
import { jsonSurfaces, readSurfaceText, type JsonSurface } from './state-integrity-surfaces.js';
import { checkCollaborationSurfaceContract, isContractSchemaId } from './surface-contract.js';

interface CollaborationStateIntegrityFinding {
  readonly path: string;
  readonly message: string;
}

export interface CollaborationStateIntegrityReport {
  readonly checkedCount: number;
  readonly findings: readonly CollaborationStateIntegrityFinding[];
}

export async function validateCollaborationStateIntegrity(input: {
  readonly repoRoot: string;
  /** The ADR-197 coordination home the machine-local surfaces live at. */
  readonly coordinationHome: string;
}): Promise<CollaborationStateIntegrityReport> {
  const surfaces = await jsonSurfaces(input.repoRoot, input.coordinationHome);
  const validator = await createCollaborationJsonSchemaValidator();
  const findings = (
    await Promise.all(
      surfaces.map((surface) => validateJsonSurface(input.repoRoot, validator, surface)),
    )
  ).flat();

  return {
    checkedCount: surfaces.length,
    findings,
  };
}

export function formatCollaborationStateIntegrityReport(
  report: CollaborationStateIntegrityReport,
): string {
  if (report.findings.length === 0) {
    return `collaboration-state validate: OK (${report.checkedCount} JSON file(s) checked)\n`;
  }

  return [
    `collaboration-state validate: ${report.findings.length} invalid JSON file(s) found:`,
    '',
    ...report.findings.map((finding) => `- ${finding.path}: ${finding.message}`),
    '',
  ].join('\n');
}

async function validateJsonSurface(
  repoRoot: string,
  validator: CollaborationJsonSchemaValidator,
  surface: JsonSurface,
): Promise<readonly CollaborationStateIntegrityFinding[]> {
  // Findings for surfaces rooted away from the invoking checkout print
  // their absolute path: an operator in a worktree must be pointed at the
  // coordination home's file, not a repo-relative name that resolves to
  // the local decoy.
  const findingPath = surface.root === repoRoot ? surface.path : join(surface.root, surface.path);
  const text = await readSurfaceText(surface);
  if (text === undefined) {
    // Optional-when-absent surface not present in this checkout — the clean state.
    return [];
  }

  try {
    JSON.parse(text);
  } catch (error) {
    return [finding(findingPath, jsonError(error))];
  }

  const contract = contractFindings(surface, findingPath, text);
  if (contract.length > 0) {
    return contract;
  }

  const correspondence = filenameCorrespondenceFindings(surface, findingPath, text);
  if (correspondence.length > 0) {
    return correspondence;
  }

  const validated = validator.validateText(surface.schemaId, text);
  if (validated.ok) {
    return [];
  }
  return [finding(findingPath, errorMessage(validated.error))];
}

/**
 * The runtime-contract half of a surface check. A legacy flat-queue
 * active-claims file is pending-migration, not corrupt: the runtime
 * migrates it once on first contact, and the schema's version enum
 * deliberately validates the legacy shape in non-runtime flows — only the
 * RUNTIME contract pin (exact current version) is suspended for it; Ajv
 * still runs after this check, so genuine corruption stays loud.
 */
function contractFindings(
  surface: JsonSurface,
  findingPath: string,
  text: string,
): readonly CollaborationStateIntegrityFinding[] {
  if (!isContractSchemaId(surface.schemaId)) {
    return [];
  }
  if (surface.schemaId === 'active-claims.schema.json' && isLegacyActiveClaimsText(text)) {
    return [];
  }
  const checked = checkCollaborationSurfaceContract({
    schemaId: surface.schemaId,
    path: findingPath,
    text,
  });
  if (checked.ok) {
    return [];
  }
  // Byte-parity with the deleted seam's catch: the original parser
  // error's message, whichever failure kind carried it.
  return [finding(findingPath, checked.error.causeError.message)];
}

/**
 * Filename↔content correspondence for the commit-queue surface: the store
 * finds an intent BY its filename (`<intent_id>.json`) and deletes by that
 * path, so a file named for one id and carrying another is unreachable
 * through the store's own API — and it makes every read of the whole
 * directory throw. Content-only validation cannot see it: such a file
 * satisfies both its schema and its contract parser exactly. The expiry
 * relation (`expires_at` is exactly `updated_at` plus the TTL) is judged
 * here by the store's own check for the same reason: the schema sees two
 * well-formed timestamps, and only the runtime's read refuses their drift.
 *
 * Home decision: this lives here rather than in `surface-contract.ts`
 * because CONTRACT_PARSERS is a deliberately compile-time-typed seam whose
 * `(text) => Result<Domain, Error>` signature would have to widen to carry
 * a filename for one surface's benefit — losing the property that seam
 * exists for.
 */
function filenameCorrespondenceFindings(
  surface: JsonSurface,
  findingPath: string,
  text: string,
): readonly CollaborationStateIntegrityFinding[] {
  if (surface.schemaId !== 'commit-queue-intent.schema.json') {
    return [];
  }
  const parsed = parseCommitQueueIntentText(text, findingPath);
  if (!parsed.ok) {
    // Unreachable in practice: the contract gate above reports and returns
    // on exactly this failure. Kept total rather than asserted away.
    return [];
  }
  const expected = `${parsed.value.intent_id}.json`;
  if (expected === basename(surface.path)) {
    const expiry = checkCommitQueueEntryExpiry(parsed.value, findingPath);
    return expiry.ok ? [] : [finding(findingPath, expiry.error.message)];
  }

  return [
    finding(
      findingPath,
      `filename disagrees with its intent_id: this file must be named ${expected}. ` +
        `Commit-queue files are machine-local ephemera (owner ruling QUEUE-LOCAL) — ` +
        `delete the mismatched file to clear it.`,
    ),
  ];
}

function finding(path: string, message: string): CollaborationStateIntegrityFinding {
  return { path, message };
}

function jsonError(error: unknown): string {
  return `malformed JSON: ${errorMessage(error)}`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
