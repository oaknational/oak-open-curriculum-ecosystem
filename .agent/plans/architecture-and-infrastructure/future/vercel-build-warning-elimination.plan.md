# Vercel Build Warning Elimination

**Status**: 🔵 STRATEGIC BRIEF (not yet executable)
**Last Updated**: 2026-04-29

## Problem and Intent

Two warning categories surface on every Vercel build (verified against `dpl_GNc9FUTSPy3D7T3jKmUWV98QH7cj`, full 4006-event log read 2026-04-29). Per the `no-warning-toleration` principle and the owner's "external system catches → fix or raise with effort/risk/ROI" principle, both warrant addressing in a focused follow-up.

### Warning 1 — pnpm `@humanfs/node` bin-symlink failure (1 instance per install)

**Symptom**:

```text
 WARN  Failed to create bin at /vercel/path0/node_modules/.bin/node.
       ENOENT: no such file or directory, open '/vercel/path0/node_modules/@humanfs/node/bin/node'
```

**Cause**: the transitive dependency `@humanfs/node` declares a `node` binary in its `package.json` `bin` field pointing at `bin/node`, but that file is not present in the published package. pnpm tries to create the symlink and fails. Defect is upstream in `@humanfs/node`.

**Impact**: cosmetic only. Build succeeds. The symlink would shadow the real `node` if it were created, so the absence is arguably better than the intended behaviour. But the warning is emitted on every install (local and CI), and per `no-warning-toleration` it cannot be left.

**Local detection**: already emitted by `pnpm install` locally; the gap is a gate that fails on it. After root-cause fix, the warning stops emitting and toleration becomes moot.

### Warning 2 — Turbo env-vars not declared in `turbo.json` (54 instances per build)

**Symptom**:

```text
 WARNING  finished with warnings
Warning - the following environment variables are set on your Vercel project,
but missing from "turbo.json". These variables WILL NOT be available to your
application and may cause your build to fail.
```

Followed by 54 individual `[warn]` entries: 3 env vars × 18 task scopes:

| Env var | Verified usage |
|---|---|
| `SENTRY_ORG` | Sentry source-map upload (build log line 3918: `[sentry-esbuild-plugin] Info: Successfully uploaded source maps to Sentry`) |
| `SENTRY_PROJECT` | Sentry source-map upload (same) |
| `TEST_ERROR_SECRET` | Test fixture / error-handling validation; declared on Vercel project |

Affected tasks: every `#build` task across 17 packages plus `sdk-codegen#sdk-codegen`. Includes the app's `oak-curriculum-mcp-streamable-http#build`.

**Cause**: Vercel project has these env vars declared. `turbo.json` does not list them in `globalEnv` or per-task `env`. Turbo's caching keys include declared env vars; un-declared env vars do not bust cache when they change.

**Impact**: real correctness issue, not just cosmetic. If `SENTRY_ORG` or `SENTRY_PROJECT` change between Vercel project configurations, Turbo can serve stale cached build artefacts. Currently Sentry upload is succeeding (the var IS reaching the build) — but cache correctness is broken.

**Local detection**: already emitted by `pnpm build` locally after Turbo runs; same gap as Warning 1 — toleration, not detection.

## Domain Boundaries and Non-Goals

**In scope** for the migration this brief covers:

- Root-cause fix for both warnings.
- `turbo.json` updates (`globalEnv` or per-task `env`).
- `.pnpmfile.cjs` patch (or alternative: `pnpm.overrides` pin) for `@humanfs/node`.
- Verification: `pnpm install --frozen-lockfile` produces no `WARN`; `pnpm build` produces no Turbo `WARNING`.
- A short ADR amendment or note on `no-warning-toleration` rule wording, if applicable.

**Out of scope**:

- Wider Vercel build optimisation.
- Tightening Turbo's env-var policy beyond declaring the three named vars.
- Sentry configuration changes.
- Adding a CI gate that fails on stderr WARN lines (separate plan; useful, but heavier and higher-risk than the root-cause fix).

## Dependencies and Sequencing Assumptions

- PR-90 should land first; this work is post-PR-90 baseline.
- Verify the env vars listed in the warning still match Vercel project state at start of work (they may have changed).
- Check `@humanfs/node` upstream for a fixed release; if available, dependency bump is preferable to a `.pnpmfile.cjs` patch.

## Success Signals (what would justify promotion)

- A second build-warning class accumulates. The principle threshold is "anything that surfaces twice".
- Owner directs starting the work.
- Sentry source-map upload starts producing stale artefacts because cache invalidation isn't keying on the right env vars.

## Risks and Unknowns

- **Frozen-lockfile semantics**: `.pnpmfile.cjs` patches mutate the install. Need to verify this works under `pnpm install --frozen-lockfile` (the Vercel install command). May require lockfile regeneration.
- **Per-task vs globalEnv trade-off**: declaring `SENTRY_ORG`/`SENTRY_PROJECT`/`TEST_ERROR_SECRET` as `globalEnv` is one line but invalidates ALL task caches when any of them change. Per-task `env` arrays are more targeted but more lines of `turbo.json`. Choose at promotion-time after measuring cache hit rates.
- **TEST_ERROR_SECRET semantics**: the name suggests deliberate error-injection fixture. Confirm with owner before declaring as `globalEnv` (might leak the test secret's existence into more cache keys than intended).
- **`@humanfs/node` ownership**: if upstream fixes the bin entry, our patch becomes a no-op and could be removed. Track upstream.

## Promotion Trigger into `current/`

Promote when **either** condition is met:

1. Owner directs starting the work.
2. A third Vercel build warning class is observed, indicating the toleration is compounding.

## Implementation Detail (Reference Context Only — Not Yet Executable)

### Warning 1 fix

Cheapest path: `.pnpmfile.cjs` `readPackage` hook stripping the broken `bin` entry on `@humanfs/node`.

```javascript
// .pnpmfile.cjs (skeleton; verify before landing)
function readPackage(pkg) {
  if (pkg.name === '@humanfs/node' && pkg.bin) {
    delete pkg.bin;
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
```

Alternative: pin a working version via `pnpm.overrides` in root `package.json` if upstream has fixed the issue in a newer release.

### Warning 2 fix

Cheapest path: `turbo.json` `globalEnv` declaration.

```jsonc
{
  "globalEnv": ["TEST_ERROR_SECRET", "SENTRY_ORG", "SENTRY_PROJECT"],
  // ... existing config
}
```

More targeted alternative: declare per-task `env` arrays only on tasks that consume the vars (`#build` tasks of each package using Sentry). Owner choice at promotion time.

### Verification

```bash
# Local
pnpm install --frozen-lockfile 2>&1 | grep -E "WARN|warn" | grep -v "no-warning-toleration"
# Expected: no matches

pnpm build 2>&1 | grep -iE "WARNING|warn" | grep -v "no-warning-toleration"
# Expected: no matches

# Vercel (after merge to a deploy branch)
# Re-fetch build log via Vercel MCP get_deployment_build_logs;
# verify "WARN" / "WARNING" counts are 0.
```

## References

- Source build log: deployment `dpl_GNc9FUTSPy3D7T3jKmUWV98QH7cj` (PR #90, commit `21189eca`); 4006 events; full warning catalogue extracted 2026-04-29.
- `.agent/rules/no-warning-toleration.md`
- `principles.md §Code Quality → No warning toleration, anywhere`
- Turbo env-var docs: <https://turborepo.dev/docs/crafting-your-repository/using-environment-variables#platform-environment-variables>
- pnpm `.pnpmfile.cjs` docs: <https://pnpm.io/pnpmfile>
