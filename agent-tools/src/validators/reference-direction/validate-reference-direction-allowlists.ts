/**
 * Stable-addressed-target allowlists for the reference-direction validator (PDR-105).
 *
 * PDR-105's stable-index corollary (generalised): a surface whose *address* is fixed by
 * construction while its *content* churns — a singleton registry, log, index, or schema
 * — is a safe dependency target, because the address out-lives the referrer and so the
 * link cannot rot. Per-item records (an individual pattern, plan, thread record, or one
 * file inside a stable directory) move, graduate, or are deleted, so they are NOT here:
 * reach them through the stable surface, never by a direct link.
 *
 * These allowlists are host-local data (the PDR body is portable; §Notes host-local
 * mirrors this set). The exemption they grant is durability-only — the portability axis
 * still refuses a portable-Core file citing any of these (repo-specific, absent on
 * arrival).
 *
 * @packageDocumentation
 */

/** Strip a leading `./` so allowlist comparison matches resolved repo-relative paths. */
function normalise(repoRelPath: string): string {
  return repoRelPath.replace(/^\.\//, '');
}

/**
 * The one stable index permitted to reference ephemeral thread records by path: its job
 * is to resolve thread identity → current location, localising lifecycle churn to one
 * surface.
 */
const STABLE_INDEX_PATHS: ReadonlySet<string> = new Set([
  '.agent/memory/operational/repo-continuity.md',
]);

/** True when the source path is the sanctioned stable index. */
export function isStableIndex(sourcePath: string): boolean {
  return STABLE_INDEX_PATHS.has(normalise(sourcePath));
}

/**
 * Stable-addressed operational *targets* a doctrine surface may link without a
 * durability violation. Singleton registries and logs (fixed file address), the
 * fixed-address index/convention READMEs of permanent directories, and the permanent
 * collaboration directories themselves (linking the directory names the stable surface;
 * a link to one file inside it is still a volatile per-item reference and stays flagged).
 *
 * Directory entries MUST carry a trailing slash in both this list and the markdown link
 * target: matching is exact (`Set.has`), so a link written `dir` (no slash)
 * resolves without one, does not match, and is flagged — the correct conservative
 * outcome (a bare directory link is rare; the trailing-slash form is the convention).
 */
const STABLE_ADDRESSED_STATE: ReadonlySet<string> = new Set([
  // Singleton registries and logs.
  '.agent/state/collaboration/active-claims.json',
  '.agent/state/collaboration/closed-claims.archive.json',
  '.agent/state/collaboration/shared-comms-log.md',
  // Fixed-address index/convention docs of permanent directories.
  '.agent/memory/active/patterns/README.md',
  '.agent/memory/operational/threads/README.md',
  '.agent/state/README.md',
  // Permanent collaboration/library directories (the surface, not the items within).
  '.agent/state/collaboration/conversations/',
  '.agent/state/collaboration/escalations/',
  '.agent/state/collaboration/comms/',
  '.agent/state/collaboration/handoffs/',
  '.agent/memory/active/patterns/',
]);

/**
 * True when an ephemeral target is a stable-addressed surface: an allowlisted singleton,
 * directory, or index README, or any `*.schema.json` (a schema is the stable abstraction
 * volatile records conform to, in DIP terms).
 */
export function isStableAddressedState(repoRelPath: string): boolean {
  const p = normalise(repoRelPath);
  return STABLE_ADDRESSED_STATE.has(p) || p.endsWith('.schema.json');
}
