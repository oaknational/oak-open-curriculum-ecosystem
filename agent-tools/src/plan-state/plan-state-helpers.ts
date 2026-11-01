import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { scanArgs, type ValueHandler } from '../core/cli-arg-parser.js';
import { parseWithSchema } from '../core/schema-parse.js';
import { resolveRepoRoot } from '../core/repo-root.js';
import { parseJsonDocument } from '../refounding/refounding-artefacts.js';
import {
  resolveReadPathWithinRepo,
  resolveWriteTargetWithinRepo,
} from '../core/flag-path-resolve.js';
import { extractAuditClaimsRequired } from './plan-state-audit-adapter.js';
import { extractGateClaimsAll, type PlanFileInput } from './plan-state-gate-adapter.js';
import { type PlanStateInput } from './plan-state-engine.js';
import { serialisePlanStateReport } from './plan-state-verdict.js';
import {
  evidenceVerdictSchema,
  parsePlanStateTable,
  PLAN_STATE_REPORT_BASENAME,
  type ClaimRow,
  type EvidenceVerdict,
  type PlanStateReport,
  type PlanStateTable,
} from './plan-state-model.js';
import { STATUS_MAPPING_TABLE_V1, STATUS_MAPPING_V1_RATIFICATION } from './status-mapping/v1.js';

/**
 * `plan-state` CLI helpers: flag parsing plus the IO phase (reads, table and
 * evidence loading, the atomic report write). The entry (`plan-state.ts`)
 * composes these; every verdict decision stays pure in
 * `plan-state-engine.ts` (the census helpers-module split).
 *
 * @packageDocumentation
 */

const repoRoot = resolveRepoRoot(import.meta.url);

const PLAN_STATE_USAGE =
  'usage: plan-state (--plan <path> [--plan <path>...] | --census <path>) ' +
  `[--status-mapping <path>] [--evidence <path>] [--report <path>, e.g. ${PLAN_STATE_REPORT_BASENAME}]`;

/** The parsed plan-state CLI flags (empty string = flag not supplied). */
export interface PlanStateArgs {
  planPaths: string[];
  censusPath: string;
  statusMappingPath: string;
  evidencePath: string;
  reportPath: string;
}

const VALUE_OPTIONS: Readonly<Record<string, ValueHandler<PlanStateArgs>>> = {
  '--plan': (state, value) => {
    state.planPaths.push(value);
  },
  '--census': (state, value) => {
    state.censusPath = value;
  },
  '--status-mapping': (state, value) => {
    state.statusMappingPath = value;
  },
  '--evidence': (state, value) => {
    state.evidencePath = value;
  },
  '--report': (state, value) => {
    state.reportPath = value;
  },
};

/** Parse the flags; exactly one of the two modes must be selected. */
export function parseArgs(argv: readonly string[]): Result<PlanStateArgs, Error> {
  const scanned = scanArgs<PlanStateArgs>(
    argv,
    { planPaths: [], censusPath: '', statusMappingPath: '', evidencePath: '', reportPath: '' },
    { flags: {}, valueOptions: VALUE_OPTIONS, helpText: PLAN_STATE_USAGE },
  );
  if (!scanned.ok) {
    return err(new Error(scanned.error));
  }
  const gateMode = scanned.state.planPaths.length > 0;
  const auditMode = scanned.state.censusPath !== '';
  if (gateMode === auditMode) {
    return err(new Error(`exactly one of --plan or --census is required\n${PLAN_STATE_USAGE}`));
  }
  return ok(scanned.state);
}

/** Read one repo-constrained file as UTF-8 (fs failures Result-translated). */
async function readRepoFile(flagPath: string): Promise<Result<string, Error>> {
  const resolved = resolveReadPathWithinRepo(repoRoot, flagPath);
  if (isErr(resolved)) {
    return resolved;
  }
  try {
    return ok(await readFile(resolved.value, 'utf8'));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read '${flagPath}': ${message}`));
  }
}

/**
 * The injected or default status-mapping table. Audit mode on the DEFAULT
 * table is mechanically gated on OG-2: until
 * `STATUS_MAPPING_V1_RATIFICATION.status` is `ratified`, the run refuses —
 * the prose constraint in `status-mapping/v1.ts` enforced in code (an
 * explicitly injected `--status-mapping` table is the operator's own call).
 */
async function loadTable(args: PlanStateArgs): Promise<Result<PlanStateTable, Error>> {
  if (args.statusMappingPath === '') {
    if (args.censusPath !== '' && STATUS_MAPPING_V1_RATIFICATION.status !== 'ratified') {
      return err(
        new Error(
          'audit mode refuses the default status-mapping table before OG-2 ratification ' +
            `(STATUS_MAPPING_V1_RATIFICATION.status = '${STATUS_MAPPING_V1_RATIFICATION.status}'); ` +
            'inject --status-mapping explicitly or await the sitting',
        ),
      );
    }
    return ok(STATUS_MAPPING_TABLE_V1);
  }
  const text = await readRepoFile(args.statusMappingPath);
  if (isErr(text)) {
    return text;
  }
  const document = parseJsonDocument('status-mapping table', text.value);
  if (isErr(document)) {
    return document;
  }
  return parsePlanStateTable(document.value);
}

/** The injected evidence verdicts (empty without the flag). */
async function loadEvidence(
  args: PlanStateArgs,
): Promise<Result<readonly EvidenceVerdict[], Error>> {
  if (args.evidencePath === '') {
    return ok([]);
  }
  const text = await readRepoFile(args.evidencePath);
  if (isErr(text)) {
    return text;
  }
  const document = parseJsonDocument('evidence file', text.value);
  if (isErr(document)) {
    return document;
  }
  return parseWithSchema({
    label: 'evidence file',
    schema: z.array(evidenceVerdictSchema),
    value: document.value,
  });
}

/** The claim rows for the selected mode. */
async function loadClaims(args: PlanStateArgs): Promise<Result<readonly ClaimRow[], Error>> {
  if (args.censusPath !== '') {
    const text = await readRepoFile(args.censusPath);
    if (isErr(text)) {
      return text;
    }
    return extractAuditClaimsRequired(text.value);
  }
  const inputs: PlanFileInput[] = [];
  for (const planPath of args.planPaths) {
    const text = await readRepoFile(planPath);
    if (isErr(text)) {
      return text;
    }
    inputs.push({ path: planPath, content: text.value });
  }
  return extractGateClaimsAll(inputs);
}

/** Load and compose the engine's full input for the selected mode. */
export async function loadInputs(args: PlanStateArgs): Promise<Result<PlanStateInput, Error>> {
  const table = await loadTable(args);
  if (isErr(table)) {
    return table;
  }
  const evidence = await loadEvidence(args);
  if (isErr(evidence)) {
    return evidence;
  }
  const claims = await loadClaims(args);
  if (isErr(claims)) {
    return claims;
  }
  return ok({ claims: claims.value, evidence: evidence.value, table: table.value });
}

/**
 * Write the report when requested — after a successful derivation only,
 * atomically (temp-then-rename, so an interrupt never strands a partial
 * report), creating the parent directory in this tool's write phase.
 */
export async function writeReportIfRequested(
  args: PlanStateArgs,
  report: PlanStateReport,
): Promise<Result<null, Error>> {
  if (args.reportPath === '') {
    return ok(null);
  }
  const target = resolveWriteTargetWithinRepo(repoRoot, args.reportPath);
  if (isErr(target)) {
    return target;
  }
  const temp = `${target.value}.tmp-${String(process.pid)}`;
  try {
    await mkdir(path.dirname(target.value), { recursive: true });
    await writeFile(temp, serialisePlanStateReport(report), 'utf8');
    await rename(temp, target.value);
    return ok(null);
  } catch (error: unknown) {
    await rm(temp, { force: true }).catch(() => undefined);
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot write report '${args.reportPath}': ${message}`));
  }
}
