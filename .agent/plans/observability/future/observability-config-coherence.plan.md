---
name: Observability Config Coherence — sink registry unification, env-layer validation, and build-log signal
overview: >
  Strategic brief consolidating four related architectural concerns:
  (a) two parallel sink configuration mechanisms (`LoggerSinkConfig`
  for stdout/file plus `additionalSinks` for Sentry), (b) Sentry
  validation living one layer below where it should (in
  `createSentryConfig` instead of at the env-resolution boundary),
  (c) absent locality classification (local vs remote sinks) so the
  runtime cannot answer "is anything emitting off-box on this preview
  build", (d) absent build-log + startup signal making it hard to
  verify Sentry is correctly wired without opening Sentry. Also
  brackets a parallel exploration of configuration-management
  platforms (Doppler / Infisical / Vercel Edge Config). Does NOT
  itself execute; produces the surface a promotion-time owner
  decision can act on.
todos:
  - id: design-gate-decisions
    content: "Owner-directed decisions on the four open design questions below before promotion to current/."
    status: pending
  - id: ws-a-promotion
    content: "Promote WS-A (sink registry unification) to current/ once design questions 1–2 are resolved."
    status: pending
  - id: ws-b-promotion
    content: "Promote WS-B (env-layer Sentry validation + warnings channel) to current/ once design question 3 is resolved."
    status: pending
  - id: ws-c-promotion
    content: "Promote WS-C (build-log + runtime sink-locality summary) to current/ after WS-A and WS-B land."
    status: pending
  - id: ws-d-promotion
    content: "Promote WS-D (ServerInstrumenter port) to current/ after WS-A registry shape is fixed."
    status: pending
  - id: ws-e-exploration
    content: "Schedule WS-E (config-management platform exploration) as an independent owner-directed exploration session."
    status: pending
isProject: false
---

# Observability Config Coherence

**Status**: 🔵 STRATEGIC BRIEF — produces the surface a promotion-time
owner decision can act on; does not itself execute.

**Authored**: 2026-04-30 by `Vining Ripening Leaf` after a
metacognition + plan session triggered by the question "what happens
if a necessary Sentry env is missing — do we get a nice warning?"
which surfaced the gap between current behaviour and the principle
in ADR-162 (vendor-independent observability with stdout fallback).

**Related**:

- ADR-116 (`resolveEnv` pipeline) — env-resolution layer
- ADR-143 (coherent structured fan-out) — sink model
- ADR-160 (non-bypassable redaction barrier) — emission contract
- ADR-162 (observability-first) — vendor independence + the open
  question on `wrapMcpServerWithSentry` direct import
- ADR-163 (Sentry release identifier + Vercel attribution) —
  build-time identity boundary
- `current/multi-sink-vendor-independence-conformance.plan.md` —
  enforcement test for the principle this plan structurally enables
- `current/sentry-preview-validation-and-quality-triage.plan.md` —
  runtime validation surface; partial overlap with WS-C (resolved at
  promotion via merge, not duplication)

---

## Why this exists

The 2026-04-30 review surfaced four concrete gaps between current
code and the architectural principles already recorded:

1. **Dual sink configuration mechanism.** The logger today exposes
   `LoggerSinkConfig.{stdout,file}` driven by env vars
   (`MCP_LOGGER_*`), while the Sentry sink is wired via a separate
   `additionalSinks` parameter from
   `apps/oak-curriculum-mcp-streamable-http/src/observability/http-observability.ts:97-104`.
   Two construction paths, no single registry, no shared type.
   ADR-143 §"Single coherent sink model" assumes a single contract;
   the code partially satisfies this in spirit but not in shape.

2. **Sentry validation lives in the wrong layer.** `SentryEnvSchema`
   in `packages/core/env/src/schemas/sentry.ts:11-25` deliberately
   declines cross-field validation ("belongs in the shared config
   builder"). The DSN-required-when-mode-sentry rule then surfaces
   inside `createSentryConfig`
   (`packages/libs/sentry-node/src/config.ts:131-156`), AFTER env
   resolution has already returned ok. Operators see two distinct
   failure modes for "missing config" depending on which env var:
   schema-level for plain env shape, runtime-level for cross-field.
   ADR-116 already documents the right pattern for this case
   (`superRefine` for conditional Clerk keys); Sentry just hasn't
   adopted it.

3. **No sink-locality classification.** `LoggerSinkConfig` does not
   distinguish "logs land on this Vercel function" (local) from
   "logs land off-box in Sentry / a warehouse / PostHog" (remote).
   So the runtime cannot answer "this is preview, did anyone
   configure a remote sink?" — exactly the early-warning the owner
   wants. Locality is implicit in which property is set, not typed.

4. **No build-log or startup-log signal of sink configuration.** The
   `esbuild.config.ts` composition root emits one of three console
   lines (`Sentry plugin enabled / skipped / disabled`) but Vercel's
   build-log API showed (on dpl_wTvPsL48u6bCn89Vscw29uot8M9H) that
   the line is buried under sdk-codegen cache-replay and not
   discoverable in the visible window. There is no top-level
   "Observability sinks: …" summary line at either build-time or
   runtime startup.

Two ADR-recorded principles describe what the code should look like:

- **ADR-162 §Vendor-Independence Clause**: minimum functionality
  (structured stdout/err) persists in the absence of any third-party
  backend; consumers couple to the observability core, never to
  vendor SDKs.
- **ADR-143 §Single coherent sink model**: one sink contract, one
  fan-out path.

The architecture is sound; the operational maturity is mid-flight.
This plan closes the named gaps in priority order.

---

## Workstream priority — debt-first, then risk × DX impact

Per owner direction (2026-04-30): prioritise **(1) remove the dual
system, then (2) move verification to the right layer, then split
remaining work by risk and developer-experience impact**.

### WS-A — Unify the sink registry (debt removal: dual system)

**Priority**: 1 — foundational; blocks WS-C and WS-D.

**Intent**: Replace the parallel `LoggerSinkConfig.{stdout,file}` /
`additionalSinks` pair with one typed `SinkRegistry`. Each registered
sink declares `{ kind: 'local' | 'remote', name, transport, config }`.
The logger's fan-out reads the registry; consumers register sinks
through one API.

**Why this first**: WS-C (locality warning) and WS-D (instrumenter
port) both want the registry shape settled before they can land
cleanly.

**Scope**:

- New `SinkRegistry` type in `@oaknational/observability` (NOT in the
  logger — locality is an observability concern, the logger is a
  fan-out engine).
- Migrate `LoggerSinkConfig.{stdout,file}` into registry entries
  (`kind: 'local'`).
- Migrate `createSentryLogSink` injection into a registry entry
  (`kind: 'remote'`).
- Codemod or single-file migration of all consumers in apps + libs.
- ADR delta: amend ADR-143 to record the registry shape and the
  locality field, OR write a sibling ADR if the change is large
  enough.

**Risk**: high. Touches every observability composition root.
Mitigation: TDD — registry behaviour proved before any consumer
migrates; unit + integration tests assert the migration is
behaviour-preserving.

**DX impact**: moderate. New construction shape; clean migration
path. Day-2 experience improves (one place to look for sink
configuration).

### WS-B — Move Sentry validation up to the env layer (debt removal: wrong layer)

**Priority**: 2 — independently landable; unblocks WS-C's warning
channel.

**Intent**: Conditional Sentry requirements live where the rest of
conditional env validation lives — at the schema layer, via
`superRefine`, surfacing through `EnvResolutionError`. Add a
warnings channel to the env-resolution Result so "supplied config
but mode=off, possible mistake" cases have a representation.

**Why this second**: independent of WS-A; can land in parallel.
Settles the type shape that WS-C needs for non-fatal diagnostics.

**Scope**:

- New helper in `@oaknational/env`:
  `composeWithMode(schema, modeKey, requiredKeysWhenLive)`. Generic;
  Sentry uses it but it isn't Sentry-specific.
- Apply to `HttpEnvSchema` in
  `apps/oak-curriculum-mcp-streamable-http/src/env.ts`:
  `SENTRY_MODE='sentry'` requires `SENTRY_DSN` (and other vital
  fields per ADR-163).
- Extend `EnvResolutionError` / the resolveEnv Result shape:
  success becomes `Result<{ data, warnings: EnvWarning[] }, EnvResolutionError>`.
  Additive on the success path (warnings defaults to `[]`); no
  change to error semantics.
- Apply the warning rule "supplied SENTRY_DSN/SENTRY_AUTH_TOKEN but
  SENTRY_MODE!='sentry' — possible mistake".
- Update `createSentryConfig` so its DSN check becomes a defensive
  invariant (assertion + clear error if reached), not the primary
  validation path.
- Documentation in three places: `@oaknational/env` README,
  `@oaknational/env-resolution` README, the consuming app's
  `runtime-config.ts` TSDoc.
- ADR delta: amend ADR-116 to record the warnings channel and the
  conditional-Sentry pattern (alongside the existing Clerk
  precedent).

**Risk**: medium. Changes the Result shape returned by `resolveEnv`;
all callers need a one-line update. Mitigation: type-driven
migration (compile errors guide every callsite); non-breaking on the
data path (warnings is `[]` by default).

**DX impact**: high. Operators see the right diagnostic at the right
layer; the env-resolution error message names the conditional rule
(today they see two different failure modes).

### WS-C — Build-log + runtime sink-locality summary (priority 3 — low risk, high DX)

**Priority**: 3 — depends on WS-A (registry) + WS-B (warnings
channel).

**Intent**: One unambiguous build-log line and one runtime startup
line that say which sinks are wired and what their locality is, so
the operator can verify the configuration without opening Sentry.
Plus the locality validation rule.

**Scope**:

- Build-time emission from `esbuild.config.ts`:
  `[esbuild.config] Observability sinks → local: stdout; remote: sentry (release=1.7.0, env=preview, dsn=https://…)`
  emitted as a single line that survives Turbo's task prefix.
- Runtime startup emission from
  `apps/oak-curriculum-mcp-streamable-http/src/index.ts`:
  `[startup] Observability sinks → local: stdout; remote: sentry`
- Locality validation rule (uses WS-B warnings channel): in
  `preview` or `production`, if `registry.remote.length === 0` →
  emit warning "logging is local-only on this build; off-box
  emissions will be lost on function recycle."
- Vercel preflight is explicitly **out of scope** per owner
  direction (2026-04-30): build-log signal is the only required
  channel.
- Documentation: `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
  gets a "How to verify Sentry is wired in this build" section.

**Risk**: low. Additive console output + one warning rule.

**DX impact**: high. Directly answers "how do I know Sentry is
working for the preview release?" — the answer becomes "search the
build log for `Observability sinks →`".

### WS-D — `ServerInstrumenter` port (debt cleanup)

**Priority**: 4 — depends on WS-A registry being fixed; resolves an
ADR-162 Open Question.

**Intent**: Move `wrapMcpServerWithSentry` direct vendor SDK import
out of `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:98`
and behind a `ServerInstrumenter` port injected from
`@oaknational/observability`. Allows the principle "adding,
replacing, or removing a vendor adapter MUST NOT require changes in
consumer code" to become a structural property, not a
documentation claim.

**Scope**:

- Define `ServerInstrumenter` port in `@oaknational/observability`.
- Implementation in `@oaknational/sentry-node` registers the
  instrumenter via WS-A's registry as the "remote" sink's bound
  server-wrap operation.
- Migrate `core-endpoints.ts` to consume the injected instrumenter,
  not the vendor SDK directly.
- Remove the composition-root carve-out for this specific file from
  ADR-162's allowlist (the carve-out narrows by one entry).
- Update `current/multi-sink-vendor-independence-conformance.plan.md`
  to assert this seam in its conformance test.

**Risk**: medium. Touches MCP wrapping; verified via E2E that the
Sentry instrumentation still attaches.

**DX impact**: low. Visible only to vendor-adapter authors; the win
is structural, not surface.

### WS-E — Configuration-management platform evaluation

**Priority**: independent — pure exploration; can run anytime.

**Intent**: Investigate whether moving secrets / env management onto
a managed platform (Doppler, Infisical, 1Password Secrets, Vercel
Edge Config) would reduce the fragmentation of `.env × app × env
scope × Vercel × CI` and simplify the conditional-validation surface
this plan exists to fix.

**Scope**: pure investigation brief, output is a recommendation
document. No code work in this WS.

**Risk**: nil.

**DX impact**: TBD by the evaluation.

---

## Sequencing

```text
WS-A (registry)         ─┐
                         ├─→ WS-C (build-log + locality)
WS-B (env validation)   ─┘
WS-A → WS-D (instrumenter port)
WS-E (exploration) — independent, anytime
```

WS-A and WS-B can land in parallel (they touch different packages).
WS-C cannot land until both are in. WS-D blocks on WS-A only.

---

## Open design questions (must resolve before any promotion)

1. **Sink registry location** — `@oaknational/observability` core
   (recommended; locality is an observability concern), or
   `@oaknational/logger` (simpler but conflates fan-out with
   locality classification)?

2. **Locality enforcement strength** — preview/production missing a
   remote sink: warn-only, or fail-closed? Strong recommendation:
   warn in preview, fail-closed in production. Owner call.

3. **Warnings channel shape** — extend `EnvResolutionError` (rename
   to `EnvResolutionDiagnostic` with severities), or add a sibling
   `warnings: EnvWarning[]` field on the success Result (additive,
   minimum disruption)? Strong recommendation: sibling field.

4. **Helper placement** — `composeWithMode` in `@oaknational/env`
   (shared) or per-app (Sentry-specific superRefine inline)?
   Recommendation: shared in `@oaknational/env`, generic over the
   mode discriminator.

5. **Overlap with existing plans** — fold WS-C's "verify Sentry in
   preview" into `current/sentry-preview-validation-and-quality-triage.plan.md`,
   or keep separate? Recommendation: fold at promotion time so the
   preview-validation surface stays single-owned.

---

## Success signals (would justify promotion)

- A new contributor opening a Vercel build log can find the
  observability sink summary in under 30 seconds without ctrl-F
  knowledge of `[esbuild.config]`.
- A misconfigured `SENTRY_MODE=sentry` without `SENTRY_DSN` fails at
  env-resolution with a single specific message naming the
  conditional rule, not at runtime startup with a different
  message.
- A misconfigured `SENTRY_DSN` set without `SENTRY_MODE=sentry`
  produces a warning at env-resolution naming the likely mistake.
- A preview build with `SENTRY_MODE=off` produces a warning at
  startup that logging is local-only, not silent success.
- ADR-162 §Open Question on `wrapMcpServerWithSentry` is resolved
  by structural change (not by documentation amendment).
- `current/multi-sink-vendor-independence-conformance.plan.md`'s
  conformance test passes against the unified registry.

---

## Risks and unknowns

| Risk | Likelihood | Mitigation |
|---|---|---|
| WS-A registry change cascades into all consumers in one PR (large diff) | high | Split into two PRs: introduce registry alongside; switch consumers; remove old API. |
| WS-B Result shape change breaks every `resolveEnv` callsite | medium | Type-driven migration (compile errors guide); land warnings field empty-by-default first, populate per-app second. |
| WS-D MCP wrapping breaks E2E silently | medium | E2E + integration test asserting Sentry transport actually attaches under the port pattern. |
| Overlap with `multi-sink-vendor-independence-conformance.plan.md` creates duplicate ownership | medium | At promotion, decide ownership: this plan ships the structural change, that plan ships the conformance test. |
| Locality enforcement turning fail-closed bricks production deploys | low (caught by tests) | Decision question 2 must resolve before WS-C lands fail-closed. |

---

## Promotion triggers

- **WS-A**: design questions 1 and 2 resolved + an owner-directed
  decision that the registry change is worth the diff cost.
- **WS-B**: design question 3 resolved + an owner-directed decision
  on the warnings-channel migration shape (additive vs rename).
- **WS-C**: WS-A and WS-B both landed.
- **WS-D**: WS-A landed; coordinate with
  `current/multi-sink-vendor-independence-conformance.plan.md`
  ownership.
- **WS-E**: independent of all of the above; promote when an
  owner-confirmed evaluation question appears or an external trigger
  (security review, secret-leak incident) raises the value.

---

## Documentation propagation (when each WS lands)

| WS | Touches |
|---|---|
| WS-A | ADR-143 amendment (or sibling ADR); `@oaknational/observability` README; `@oaknational/logger` README; consumer composition-root TSDoc |
| WS-B | ADR-116 amendment; `@oaknational/env` README; `@oaknational/env-resolution` README; `apps/*/runtime-config.ts` TSDoc |
| WS-C | `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`; the corresponding doc for any app that adopts the registry |
| WS-D | ADR-162 §Open Questions resolved-entry; the conformance plan's allowlist updated |
| WS-E | New ADR if a platform is selected; `docs/explorations/` brief otherwise |

---

## Non-goals (explicitly NOT in scope)

- Vercel API preflight / `pnpm env:audit` (owner-directed: build-log
  signal is sufficient).
- Adding new sinks (warehouse, PostHog) — that's
  `future/second-backend-evaluation.plan.md`'s scope; this plan
  prepares the registry shape they will land on.
- Implementing the vendor-independence conformance test —
  `current/multi-sink-vendor-independence-conformance.plan.md`
  already owns it.
- Replacing the Sentry SDK or transport layer — pure structural
  consolidation only.

---

## Lifecycle note

This is a `future/` strategic brief. Implementation decisions are
finalised only at promotion to `current/`. Each WS gets its own
executable plan when promoted, with TDD phases and quality gates
per the executable-plan template.
