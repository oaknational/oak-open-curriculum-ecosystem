# Next-Session Opener — Sentry Integration for Public Alpha

**Authored**: 2026-04-20 session close.
**Consumed at**: next session open.
**Lifecycle**: delete on session close once its landing target has
been reported (per PDR-026); rewrite if the landing target needs
re-stating for a further session.

---

## Impact (metacognition lens)

The work shifts the MCP server's operational posture from *"errors
captured without attribution"* to *"errors attributed to release,
tool context, and request state, with runtime health visible."* This
is the quality bar for public alpha.

The bridge from action to impact is three lanes:

1. **§L-8** (next-session target): esbuild-native build + Sentry
   plugin wiring + bespoke L-7 orchestrator deletion + ADR-163 §6
   amendment. Unblocks release attribution and sourcemap linkage.
2. **Phase 3a** (L-1 + L-2 + L-3, parallel after §L-8): free-signal
   integrations, delegates extraction, MCP request-context
   enrichment. Unblocks runtime-health visibility + request-level
   attribution.
3. **L-15** + **L-EH final** (can land during alpha): strategy
   close-out ADR + `prefer-result-pattern` ESLint rule.

After the three lanes, public-alpha Sentry integration is complete.
Events-workspace + L-4b metrics + Phase 4 siblings + deferred L-9 /
L-12 / L-13 / L-14 form the public-beta gate.

## Grounding order at session open

Follow [`start-right-quick`](../../skills/start-right-quick/shared/start-right.md)
Ground First steps 1–6 in order:

1. `.agent/directives/AGENT.md` → `principles.md` → `testing-strategy.md` → `schema-first-execution.md` → `orientation.md`
2. Start-Here 5 ADRs block in the ADR index; open any ADR whose slug matches observability work
3. `.agent/memory/active/distilled.md` + `.agent/memory/active/napkin.md` (the most recent entry is this session's close)
4. `.agent/memory/operational/repo-continuity.md` → `workstreams/observability-sentry-otel.md`
5. `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md` §L-8 (the executable sub-plan; WS0 findings applied inline)
6. `git status --short && git log --oneline --decorate -5`

## Landing target (per PDR-026)

State at session open:

> **Target**: `§L-8 WS1 RED` — failing integration tests for
> esbuild-native build + plugin lifecycle + build-output
> equivalence authored and committed.

Tests to author (per §L-8 WS1):

- `apps/oak-curriculum-mcp-streamable-http/build-scripts/plugin-build-output.integration.test.ts`
  — `pnpm build` with `SENTRY_AUTH_TOKEN=<fake>` + ADR-163 §3 env
  pair inputs produces dist bundles carrying Debug IDs; build logs
  confirm plugin's release-registration + sourcemap-upload +
  deploy-event evidence.
- `packages/libs/sentry-node/src/policy-invocation.integration.test.ts`
  — `resolveSentryEnvironment` and `resolveSentryRegistrationPolicy`
  are invoked exactly once per build and outputs feed the plugin
  config.
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/build-output-equivalence.integration.test.ts`
  — contract-surface diff against pre-swap baseline: entry-point
  filenames, external-package boundary, top-level exports, source-
  map presence and linkage, `format` (esm), `target` (es2022),
  `platform` (node). Deliberate divergence: `sourcemap: 'hidden'`
  omits the `sourceMappingURL` comment (Sentry-recommended posture;
  NOT part of the equivalence contract).

Plus the WS1 acceptance Vercel build-env smoke: push a probe branch
that logs `VERCEL_ENV`, `VERCEL_GIT_COMMIT_SHA`,
`VERCEL_GIT_REPO_SLUG` from inside the esbuild config at
config-load time. Confirms all three populate at that stage before
WS2 wiring lands.

## Standing decisions (owner-beats-plan invariant protects these)

- **Build tool for the MCP app**: **raw esbuild**, NOT tsup.
  `@sentry/esbuild-plugin` + `tsup` is known-broken at runtime
  (Sentry issues 608 + 614; tsup issue 1260). Other workspaces stay
  on tsup.
- **Plugin**: `@sentry/esbuild-plugin`, first-party, ADOPTED.
- **L-7 bespoke orchestrator** (953 lines across 5 files): DELETE
  in WS2, atomic with WS3.1 ADR amendment.
- **ADR-163 §6**: AMEND from HOW (six `sentry-cli` invocations) to
  WHAT (Sentry UI outcome). Same commit as WS2 deletion.
- **`@sentry/cli` devDep**: DELETE from BOTH `apps/oak-curriculum-mcp-streamable-http/`
  AND `apps/oak-search-cli/` (dormant copy per §L-8 WS2.4).

## Non-goals (do not re-open)

- Do NOT migrate any other workspace off tsup.
- Do NOT re-open the tsup-vs-esbuild decision.
- Do NOT defer the ADR-163 §6 rewrite (it is atomic with WS2).

## Session shape

1. State the landing target (above) explicitly at open.
2. WS1 RED — author the three tests; all must fail for the expected
   reason (no esbuild config yet).
3. Commit RED.
4. Proceed to WS2 GREEN atomically with WS3.1 ADR-163 §6 amendment
   (same commit; same PR minimum) if session capacity allows.
   Otherwise stop at RED commit and record the next-session target
   per PDR-026's unlanded-case structure.

## What's after this session

- Phase 3a in parallel: L-1, L-2, L-3 — all schema-independent;
  three small lanes that close public-alpha Sentry integration.
- L-15 strategy close-out + L-EH final (author `prefer-result-pattern`
  rule + first-tranche adoption).

## Session-close discipline reminder (PDR-026)

Close this session by either:

- **Landed**: record the commit SHA + evidence link; delete this
  file.
- **Unlanded**: record attempted / prevented / next-session-re-attempts
  in `repo-continuity.md § Next safe step`; rewrite the Target block
  above for the next session.
