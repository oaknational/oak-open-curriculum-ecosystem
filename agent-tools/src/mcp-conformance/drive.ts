import { isErr, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseJsonText } from '../core/json.js';
import { parseWithSchema } from '../core/schema-parse.js';
import { boundedExcerpt, redactCredentials } from './bounded-excerpt.js';
import { deriveExampleArgs, type ExampleToolArgs } from './derive-example-args.js';
import { type McpjamSpawnResult } from './runner.js';

/**
 * The reviewer-pack drive leg (MCP-303): list every advertised tool, invoke
 * each with its ADVERTISED example inputs, and record one witness per tool.
 * The reviewer walkthrough is the rendered projection of one drive run, so
 * the pack's claims are traceable to the run by construction.
 *
 * Rides the same lockfile-pinned vendor CLI as the conformance suites
 * (`mcpjam tools list` / `tools call`, output shapes observed first-hand
 * 2026-07-28 against the served stubbed app — the fixtures beside the
 * tests are those captures verbatim).
 *
 * Tool-level success/failure detection delegates to the vendor's
 * `--validate-response --expect-success` flags (a CallToolResult with
 * `isError: true` exits non-zero). That delegation is exercised nowhere
 * in-suite — testing-strategy forbids spawning the vendor from tests — its
 * contract home is the owner-gated live drive run and the scheduled
 * unattended conformance workflow.
 */

/** Vendor `tools list --format json` output — observed shape, loose at the edges. */
const toolsListOutputSchema = z
  .object({
    tools: z.array(
      z
        .object({
          // Names are boundary-validated to the conventional MCP shape so the
          // pack's Markdown headings and the per-tool evidence filenames are
          // safe by construction — a server advertising anything else is an
          // unusable surface, loudly.
          name: z.string().regex(/^[A-Za-z0-9._-]+$/u),
          inputSchema: z.unknown().optional(),
          annotations: z.object({ readOnlyHint: z.boolean().optional() }).loose().optional(),
        })
        .loose(),
    ),
    nextCursor: z.string().optional(),
  })
  .loose();

/** One driven tool's outcome. */
export interface DriveWitness {
  readonly toolName: string;
  readonly args: ExampleToolArgs | undefined;
  readonly outcome: 'called-ok' | 'call-failed' | 'no-example' | 'not-read-only';
  /** Loud detail for the non-ok outcomes; empty on called-ok. */
  readonly detail: string;
}

export interface DriveOutcome {
  /** Set exactly when a usable tools list could not be obtained. */
  readonly listFailure?: string;
  readonly witnesses: readonly DriveWitness[];
}

/**
 * The IO seam the drive consumes: one method per vendor operation, so a
 * test fake is a branch-free lookup and the argv layout stays a private
 * concern of the adapter (composed by `composeDrive*Args`, proven by their
 * own unit tests). The real adapter also retains each call's stdout as a
 * per-tool evidence artefact — a completed call whose evidence cannot be
 * retained comes back as an error, never a silent success.
 */
export interface DriveIo {
  readonly listTools: () => Result<McpjamSpawnResult, Error>;
  readonly callTool: (
    toolName: string,
    toolArgs: ExampleToolArgs,
  ) => Result<McpjamSpawnResult, Error>;
}

export function composeDriveListArgs(input: {
  readonly target: string;
  readonly credentialsFile?: string;
}): readonly string[] {
  return [
    '--format',
    'json',
    '--quiet',
    'tools',
    'list',
    '--url',
    input.target,
    ...(input.credentialsFile === undefined ? [] : ['--credentials-file', input.credentialsFile]),
  ];
}

export function composeDriveCallArgs(input: {
  readonly target: string;
  readonly toolName: string;
  readonly toolArgs: ExampleToolArgs;
  readonly credentialsFile?: string;
}): readonly string[] {
  return [
    '--format',
    'json',
    '--quiet',
    'tools',
    'call',
    '--url',
    input.target,
    '--tool-name',
    input.toolName,
    '--tool-args',
    JSON.stringify(input.toolArgs),
    '--validate-response',
    '--expect-success',
    ...(input.credentialsFile === undefined ? [] : ['--credentials-file', input.credentialsFile]),
  ];
}

function callWitness(io: DriveIo, toolName: string, toolArgs: ExampleToolArgs): DriveWitness {
  const spawn = io.callTool(toolName, toolArgs);
  if (isErr(spawn)) {
    return {
      toolName,
      args: toolArgs,
      outcome: 'call-failed',
      detail: `the call could not be completed: ${spawn.error.message}`,
    };
  }
  if (spawn.value.exitCode !== 0) {
    // Under `--format json` the vendor reports the tool-level failure (the
    // CallToolResult with isError) on STDOUT; stderr carries launch-class
    // errors. Both ride the witness so the pack names causes, not just
    // outcomes (live-run finding 2026-07-28: seven failures whose stderr
    // was empty read as bare "the call failed").
    return {
      toolName,
      args: toolArgs,
      outcome: 'call-failed',
      detail:
        `the call failed (exit ${spawn.value.exitCode === undefined ? 'unknown' : String(spawn.value.exitCode)})` +
        `${boundedExcerpt('vendor stdout', spawn.value.stdout)}` +
        `${boundedExcerpt('vendor stderr', spawn.value.stderr)}`,
    };
  }
  return { toolName, args: toolArgs, outcome: 'called-ok', detail: '' };
}

type ListedTools = z.infer<typeof toolsListOutputSchema>;

/**
 * Obtain a USABLE tool list or a loud refusal. Refusals cover: launch
 * failure, non-zero vendor exit (the vendor's structured error rides
 * stderr — discarding it and parsing empty stdout would misreport an
 * unreachable or unauthenticated server as a format problem), non-JSON
 * output, shape mismatch, pagination (this drive reads a single page and
 * must not silently under-report), and an empty list (a drive over zero
 * tools certifies nothing — that is a wrong-target signal, not a green).
 */
function obtainToolList(io: DriveIo): { readonly failure?: string; readonly listed?: ListedTools } {
  const spawn = io.listTools();
  if (isErr(spawn)) {
    return { failure: `tools/list could not be launched: ${spawn.error.message}` };
  }
  if (spawn.value.exitCode !== 0) {
    return {
      failure:
        `tools/list failed (exit ${spawn.value.exitCode === undefined ? 'unknown' : String(spawn.value.exitCode)})` +
        `${boundedExcerpt('vendor stderr', spawn.value.stderr)}` +
        `${boundedExcerpt('vendor stdout', spawn.value.stdout)}`,
    };
  }
  let parsedJson: unknown;
  try {
    parsedJson = parseJsonText(spawn.value.stdout, 'mcpjam tools list output');
  } catch (error) {
    // Parse errors embed vendor stdout (a SyntaxError snippet; a Zod issue's
    // key names) — vendor text, redacted; these ride into the reviewer pack.
    return { failure: redactCredentials(error instanceof Error ? error.message : String(error)) };
  }
  const listed = parseWithSchema({
    label: 'mcpjam tools list output',
    schema: toolsListOutputSchema,
    value: parsedJson,
  });
  if (isErr(listed)) {
    return { failure: redactCredentials(listed.error.message) };
  }
  const unusable = unusableListReason(listed.value);
  if (unusable !== undefined) {
    return { failure: unusable };
  }
  return { listed: listed.value };
}

/** A well-formed list can still be unusable: paginated, empty, or ambiguous. */
function unusableListReason(listed: ListedTools): string | undefined {
  // Case-insensitively: per-tool evidence lands on filesystems whose
  // storage key folds case, so 'Read' and 'read' are the same artefact.
  const names = listed.tools.map((tool) => tool.name.toLowerCase());
  const duplicates = [...new Set(names.filter((name, index) => names.indexOf(name) !== index))];
  if (duplicates.length > 0) {
    return `the tool list advertises duplicate names (case-insensitively compared: ${duplicates.join(', ')}) — an ambiguous surface cannot be driven honestly: witnesses and retained evidence would silently overwrite each other`;
  }
  if (listed.nextCursor !== undefined) {
    return 'the tool list is paginated (nextCursor present) — this drive reads a single page and refuses to under-report the surface; teach it pagination before trusting a run against this server';
  }
  if (listed.tools.length === 0) {
    return 'the server advertised zero tools — a drive over nothing certifies nothing; this reads as a wrong target rather than a healthy empty surface';
  }
  return undefined;
}

/**
 * Drive every advertised tool once with its advertised example inputs.
 * Per-tool failures are loud witnesses, never aborts — the pack must name
 * exactly which tools could and could not be exercised. Only tools
 * advertising `readOnlyHint: true` are invoked — a guard against OUR OWN
 * surface growing a write tool nobody thought about, not a security
 * boundary: the hint is server-supplied and untrusted per the MCP spec, so
 * a hostile target could lie its way past it. This drive is an instrument
 * for surfaces we operate.
 */
export function runDrive(io: DriveIo): DriveOutcome {
  const list = obtainToolList(io);
  if (list.listed === undefined) {
    return { listFailure: list.failure ?? 'tools/list produced no usable result', witnesses: [] };
  }
  const witnesses = list.listed.tools.map((tool): DriveWitness => {
    if (tool.annotations?.readOnlyHint !== true) {
      return {
        toolName: tool.name,
        args: undefined,
        outcome: 'not-read-only',
        detail:
          'the tool does not advertise readOnlyHint: true — this drive invokes tools blindly and refuses any tool not declared read-only',
      };
    }
    // No fallback: a tool advertising NO inputSchema is underivable — inventing
    // an empty object schema here would let the pack claim an exercise that no
    // advertised metadata supports.
    const derived = deriveExampleArgs(tool.name, tool.inputSchema);
    if (isErr(derived)) {
      return { toolName: tool.name, args: undefined, outcome: 'no-example', detail: derived.error };
    }
    return callWitness(io, tool.name, derived.value);
  });
  return { witnesses };
}
