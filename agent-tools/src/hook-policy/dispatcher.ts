import type { PolicyDecision } from './evaluate.js';
import { parseHookInput, readStreamText } from './hook-input.js';
import { POLICY_URL, REPO_ROOT } from './policy-loader.js';
import { loadPolicySnapshot, type PolicySnapshot } from './policy-snapshot.js';
import {
  diskPriorReadEdge,
  priorContentReader,
  REQUEST_READ_BUDGET,
} from './prior-content-read.js';
import { otherRepositoryTest } from './repository-identity.js';
import type { RawBlockedPattern, ScopedContentBlockGroup } from './types.js';

/**
 * Bounded arbitration for the unified PreToolUse hook: read one payload,
 * select exactly one route by shape, evaluate it against the canonical
 * policy, and render the decision through the injected renderer.
 *
 * The dispatcher owns no host or route semantics: routes carry their own
 * shape predicates and evaluation, the renderer carries the host output
 * contract. Zero or multiple matching routes fail closed — real payloads are
 * disjoint across routes, so ambiguity is only ever synthetic and refusing
 * to arbitrate is the truthful response.
 *
 * @packageDocumentation
 */

/**
 * Per-request context handed to the matched route's evaluation: the parsed
 * payload, the injected policy sections (which win over the snapshot), the
 * memoised snapshot accessor for un-injected sections, the prior-content
 * reader for Write payloads, and the test for a file in another repository.
 */
export interface PolicyRouteContext {
  /** The parsed hook stdin payload. */
  readonly hookInput: unknown;
  /** Memoised snapshot accessor — the policy file loads at most once per request. */
  readonly getSnapshot: () => Promise<PolicySnapshot>;
  /** Injected Bash section; when present the bash route never loads the snapshot. */
  readonly bashPatterns: readonly RawBlockedPattern[] | undefined;
  /** Injected flat content patterns; wins over the snapshot section. */
  readonly contentPatterns: readonly string[] | undefined;
  /** Injected scoped doctrine blocks; wins over the snapshot section. */
  readonly scopedBlocks: readonly ScopedContentBlockGroup[] | undefined;
  /** Prior-content reader for Write payloads (real filesystem by default). */
  readonly readPriorContent: (filePath: string) => string | null;
  /** Whether an absolute path lies in a git repository other than the session's (disk by default). */
  readonly isInOtherRepository: (filePath: string) => boolean;
}

/**
 * One dispatchable policy route: a shape-based match predicate over the raw
 * payload plus the evaluation that turns the payload and policy sections into
 * a canonical {@link PolicyDecision}. `tool_name` is never consulted — the
 * recorded regression fixtures include tool_name-less payloads.
 */
export interface PolicyRoute {
  /** Stable route name, surfaced in the fail-closed ambiguity error. */
  readonly name: string;
  /** Shape-based predicate over the parsed payload. */
  readonly matches: (hookInput: unknown) => boolean;
  /** Evaluate the payload against the policy sections in the context. */
  readonly evaluate: (context: PolicyRouteContext) => Promise<PolicyDecision>;
}

/**
 * Minimal writable surface for the dispatcher's stdout/stderr seams —
 * structurally identical to the renderer's writer contract, declared here so
 * the generic dispatcher never imports a host-specific module.
 */
interface HookOutputWriter {
  write(text: string): void;
}

/** Render one canonical decision into a host's stdout contract. */
export type RenderPolicyDecision = (decision: PolicyDecision, stdout: HookOutputWriter) => void;

/**
 * Injectable seams for the unified PreToolUse dispatcher (testing +
 * composition). Injected policy sections win over the snapshot; `loadSnapshot`
 * exists so tests can count loads and simulate failures.
 */
export interface RunPreToolUseDispatchOptions {
  readonly stdin?: AsyncIterable<string | Buffer>;
  readonly stdout?: HookOutputWriter;
  readonly stderr?: HookOutputWriter;
  readonly policyUrl?: URL;
  readonly bashPatterns?: readonly RawBlockedPattern[];
  readonly contentPatterns?: readonly string[];
  readonly scopedBlocks?: readonly ScopedContentBlockGroup[];
  readonly readPriorContent?: (filePath: string) => string | null;
  readonly isInOtherRepository?: (filePath: string) => boolean;
  readonly loadSnapshot?: (policyUrl: URL) => Promise<PolicySnapshot>;
}

/**
 * Apply default seams so the orchestrator stays under the complexity cap.
 */
function applyDispatchDefaults(options: RunPreToolUseDispatchOptions) {
  return {
    stdin: options.stdin ?? process.stdin,
    stdout: options.stdout ?? process.stdout,
    stderr: options.stderr ?? process.stderr,
    policyUrl: options.policyUrl ?? POLICY_URL,
    bashPatterns: options.bashPatterns,
    contentPatterns: options.contentPatterns,
    scopedBlocks: options.scopedBlocks,
    readPriorContent:
      options.readPriorContent ?? priorContentReader(diskPriorReadEdge, REQUEST_READ_BUDGET),
    isInOtherRepository: options.isInOtherRepository ?? otherRepositoryTest(REPO_ROOT),
    loadSnapshot: options.loadSnapshot ?? loadPolicySnapshot,
  };
}

/** Render a caught error's message for the stderr surface. */
function formatGuardError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown PreToolUse hook failure.';
}

/**
 * Memoise the snapshot load so every route section unwrap in one request
 * shares a single policy read.
 */
function createSnapshotAccessor(
  loadSnapshot: (policyUrl: URL) => Promise<PolicySnapshot>,
  policyUrl: URL,
): () => Promise<PolicySnapshot> {
  let cached: Promise<PolicySnapshot> | undefined;
  return () => {
    cached ??= loadSnapshot(policyUrl);
    return cached;
  };
}

/**
 * Select the single route whose shape predicate accepts the payload. Zero or
 * multiple matches throw a truthful arbitration error, which the dispatcher
 * boundary converts to the fail-closed stderr + exit 2 contract.
 */
function selectRoute(routes: readonly PolicyRoute[], hookInput: unknown): PolicyRoute {
  const matched = routes.filter((route) => route.matches(hookInput));
  const only = matched[0];
  if (matched.length === 1 && only !== undefined) {
    return only;
  }
  if (matched.length === 0) {
    throw new Error('PreToolUse hook input did not match any policy route; failing closed.');
  }
  const names = matched.map((route) => route.name).join(', ');
  throw new Error(
    `PreToolUse hook input matched ${matched.length} policy routes (${names}); failing closed.`,
  );
}

/**
 * Execute the unified PreToolUse dispatch using Claude's stdin/stdout hook
 * contract.
 *
 * Exit code semantics stay the closed runner set:
 * - `0`: hook completed; stdout carries exactly one decision line (deny or
 *   explicit allow).
 * - `2`: hook failed closed; stderr explains why the host should stop.
 *
 * Any failure — parse, arbitration, extraction, evaluation, or rendering —
 * is caught at this boundary and rendered as stderr + exit 2.
 */
export async function dispatchPreToolUse(
  routes: readonly PolicyRoute[],
  render: RenderPolicyDecision,
  options: RunPreToolUseDispatchOptions = {},
): Promise<{ exitCode: number }> {
  const seams = applyDispatchDefaults(options);

  try {
    const hookInput = parseHookInput(await readStreamText(seams.stdin));
    const route = selectRoute(routes, hookInput);
    const decision = await route.evaluate({
      hookInput,
      getSnapshot: createSnapshotAccessor(seams.loadSnapshot, seams.policyUrl),
      bashPatterns: seams.bashPatterns,
      contentPatterns: seams.contentPatterns,
      scopedBlocks: seams.scopedBlocks,
      readPriorContent: seams.readPriorContent,
      isInOtherRepository: seams.isInOtherRepository,
    });
    render(decision, seams.stdout);
    return { exitCode: 0 };
  } catch (error) {
    seams.stderr.write(`${formatGuardError(error)}\n`);
    return { exitCode: 2 };
  }
}
