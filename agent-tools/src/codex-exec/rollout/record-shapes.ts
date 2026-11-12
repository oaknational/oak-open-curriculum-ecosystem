import { z } from 'zod';

/** Fields the reader accesses before a record's typed payload is validated. */
export interface JsonRecord {
  readonly type?: unknown;
  readonly payload?: unknown;
  readonly id?: unknown;
  readonly turn_id?: unknown;
  readonly thread_id?: unknown;
  readonly thread_settings?: unknown;
  readonly item?: unknown;
  readonly aggregated_output?: unknown;
  readonly output?: unknown;
  readonly input?: unknown;
  readonly call_id?: unknown;
  readonly name?: unknown;
  readonly status?: unknown;
}

/** Narrow an untrusted JSON value to an object for field inspection. */
export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const networkSchema = z.enum(['restricted', 'enabled']);
const specialPathSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('root') }),
  z.strictObject({ kind: z.literal('minimal') }),
  z.strictObject({ kind: z.literal('tmpdir') }),
  z.strictObject({ kind: z.literal('slash_tmp') }),
  z.strictObject({ kind: z.literal('project_roots'), subpath: z.string().optional() }),
  z.strictObject({ kind: z.literal('unknown'), path: z.string(), subpath: z.string().optional() }),
]);
const fileSystemPathSchema = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('special'), value: specialPathSchema }),
  z.strictObject({ type: z.literal('path'), path: z.string().min(1) }),
  z.strictObject({ type: z.literal('glob_pattern'), pattern: z.string().min(1) }),
]);
const fileSystemEntrySchema = z.strictObject({
  path: fileSystemPathSchema,
  access: z.enum(['read', 'write', 'deny']),
  missing_path_behavior: z.literal('skip').optional(),
});
const fileSystemSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('restricted'),
    entries: z.array(fileSystemEntrySchema),
    glob_scan_max_depth: z.number().int().positive().optional(),
  }),
  z.strictObject({ type: z.literal('unrestricted') }),
]);
const permissionProfileSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('managed'),
    file_system: fileSystemSchema,
    network: networkSchema,
  }),
  z.strictObject({ type: z.literal('disabled') }),
  z.strictObject({ type: z.literal('external'), network: networkSchema }),
]);

const granularApprovalSchema = z.strictObject({
  granular: z.strictObject({
    sandbox_approval: z.boolean(),
    rules: z.boolean(),
    skill_approval: z.boolean().optional(),
    request_permissions: z.boolean().optional(),
    mcp_elicitations: z.boolean(),
  }),
});
/** Codex 0.156.1 accepts `on-failure` as an input alias for `on-request`,
 * but serializes the latter. See codex-rs/protocol/src/protocol.rs. */
const approvalPolicySchema = z.union([
  z.enum(['never', 'on-request', 'untrusted']),
  granularApprovalSchema,
]);
const sandboxPolicySchema = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('read-only'), network_access: z.boolean().optional() }),
  z.strictObject({ type: z.literal('danger-full-access') }),
  z.strictObject({ type: z.literal('external-sandbox'), network_access: networkSchema.optional() }),
  z.strictObject({
    type: z.literal('workspace-write'),
    writable_roots: z.array(z.string()).optional(),
    network_access: z.boolean().optional(),
    exclude_tmpdir_env_var: z.boolean().optional(),
    exclude_slash_tmp: z.boolean().optional(),
  }),
]);

// The rollout carries other turn metadata that this reader does not use.
// Only the nested policy values are strict, so new unrelated metadata is safe.
const turnContextSchema = z.object({
  turn_id: z.string().min(1),
  cwd: z.string().min(1),
  approval_policy: approvalPolicySchema,
  approvals_reviewer: z.enum(['user', 'auto_review']),
  sandbox_policy: sandboxPolicySchema,
  permission_profile: permissionProfileSchema,
  model: z.string().min(1),
  effort: z.string().min(1).optional(),
  workspace_roots: z.array(z.string().min(1)),
});

// Settings events can contain unrelated runtime fields; the compared fields
// must remain complete and typed.
const threadSettingsSchema = z.object({
  cwd: z.string().min(1),
  model: z.string().min(1),
  approval_policy: approvalPolicySchema,
  approvals_reviewer: z.enum(['user', 'auto_review']),
  permission_profile: permissionProfileSchema,
  reasoning_effort: z.string().min(1).optional(),
  runtime_workspace_roots: z.array(z.string().min(1)),
});

const truncationMarker =
  /Warning: truncated output|Total output lines: \d+|…\d+ (?:tokens|chars) truncated…|\.\.\. \d+ bytes omitted \.\.\./u;

/** Recognised permission-profile structures from codex-cli 0.156.1. */
type RecordedPermissionProfile = z.infer<typeof permissionProfileSchema>;
/** The approval policy that the runtime recorded for one turn. */
type RecordedApprovalPolicy = z.infer<typeof approvalPolicySchema>;
/** The legacy sandbox policy that the runtime recorded for one turn. */
type RecordedSandboxPolicy = z.infer<typeof sandboxPolicySchema>;

/** The turn's recorded context, kept separate from dialogue-turn's composition context. */
export interface RecordedTurnContext {
  readonly turnId: string;
  readonly cwd: string;
  readonly approvalPolicy: RecordedApprovalPolicy;
  readonly approvalsReviewer: 'user' | 'auto_review';
  readonly sandboxPolicy: RecordedSandboxPolicy;
  readonly permissionProfile: RecordedPermissionProfile;
  readonly model: string;
  /** Absent when the run did not pin a reasoning effort. */
  readonly effort: string | undefined;
  readonly workspaceRoots: readonly string[];
}

/** Applied thread settings reported by an event, projected onto compared fields. */
export interface RecordedThreadSettings {
  readonly cwd: string;
  readonly model: string;
  readonly approvalPolicy: RecordedApprovalPolicy;
  readonly approvalsReviewer: 'user' | 'auto_review';
  readonly permissionProfile: RecordedPermissionProfile;
  readonly effort: string | undefined;
  readonly workspaceRoots: readonly string[];
}

/**
 * Detect the harness's explicit truncation markers in a `CommandExecution`
 * item's `aggregated_output`. Each has a path into that field on codex-cli
 * 0.157.0 (paths under `codex-rs/`):
 * - `... N bytes omitted ...`: the unified-exec output cap
 *   (`core/src/unified_exec/mod.rs`, the head/tail buffer);
 * - `…N tokens truncated…` and `…N chars truncated…`: a refused call's
 *   message, truncated and written as a declined item's output
 *   (`core/src/tools/events.rs`, `truncate_rejection_message`);
 * - `Warning: truncated output` and `Total output lines: N`: the formatter
 *   behind a sandbox denial's message (`core/src/unified_exec/process.rs`,
 *   `formatted_truncate_text`); a failed command's record appends its failure
 *   message to its output (`core/src/unified_exec/async_watcher.rs`).
 *
 * A command output carrying any of them reads as inconclusive.
 */
export function hasTruncationMarker(value: string): boolean {
  return truncationMarker.test(value);
}

/** Validate the fields the probe needs, leaving unrelated turn metadata alone. */
export function parseTurnContext(value: unknown): RecordedTurnContext | undefined {
  const parsed = turnContextSchema.safeParse(value);
  if (!parsed.success) {
    return undefined;
  }
  return {
    turnId: parsed.data.turn_id,
    cwd: parsed.data.cwd,
    approvalPolicy: parsed.data.approval_policy,
    approvalsReviewer: parsed.data.approvals_reviewer,
    sandboxPolicy: parsed.data.sandbox_policy,
    permissionProfile: parsed.data.permission_profile,
    model: parsed.data.model,
    effort: parsed.data.effort,
    workspaceRoots: parsed.data.workspace_roots,
  };
}

/** Validate an applied settings event and project the fields compared with a turn. */
export function parseThreadSettings(value: unknown): RecordedThreadSettings | undefined {
  const parsed = threadSettingsSchema.safeParse(value);
  if (!parsed.success) {
    return undefined;
  }
  return {
    cwd: parsed.data.cwd,
    model: parsed.data.model,
    approvalPolicy: parsed.data.approval_policy,
    approvalsReviewer: parsed.data.approvals_reviewer,
    permissionProfile: parsed.data.permission_profile,
    effort: parsed.data.reasoning_effort,
    workspaceRoots: parsed.data.runtime_workspace_roots,
  };
}
