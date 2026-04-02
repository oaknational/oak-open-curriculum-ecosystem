## Session 2026-04-02 — Post-distillation reset

### What Was Done

- Archived the previous napkin to
  `.agent/memory/archive/napkin-2026-04-02.md` and merged the new
  high-signal learnings into `distilled.md`.
- Archived the completed frontend practice plan to
  `.agent/plans/agentic-engineering-enhancements/archive/completed/`.
- Deleted the extracted platform plan copy after confirming no
  canonical documentation remained trapped there.
- Refreshed the continuity contract and seeded the first
  deep-consolidation evidence entry for continuity adoption.

### Next Session Notes

- Re-check the WS3 merge-plan security-hardening and fallback-policy
  items before starting widget UI work.
- Continuity adoption evidence is underway, but the window is still
  open: 5 resumptions, 3 `GO` sessions, and 2 deep consolidations
  are required before the promote/adjust/reject decision.

### Patterns to Remember

- When judging whether a practice experiment can be promoted, use the
  recorded evidence file as the authority, not conversational memory
  about how many times a workflow was "used".

### Surprise

- **Expected**: the repo record might already justify promoting the
  continuity experiment after the recent handoff/consolidation work
- **Actual**: the live evidence file still records only 1 session entry
  and 1 deep-consolidation entry, with no recorded `GO` session entries
- **Why expectation failed**: rollout events, implementation work, and
  real evidence-window usage are different things and need separate
  counting
- **Behaviour change**: when an experiment has an explicit evidence
  window, check the evidence log first and answer promotion questions
  from that file rather than from workflow recency or perceived usage

## Session 2026-04-02 — WS3 security closure and prerequisite split

### What Was Done

- Closed the shared observability gap for OAuth form bodies by teaching the
  redaction layer to treat form-encoded payloads as a first-class telemetry
  shape.
- Removed `userId` from both auth-success log paths and added explicit tests
  that prove the field is absent.
- Proved the non-UI fallback contract with boundary tests for
  `get-curriculum-model` and `user-search` instead of adding host-specific
  runtime branches.
- Split design-token implementation into a dedicated `current/` plan that now
  blocks WS3 Phase 4 and Phase 5.
- Recorded this session as both a real resumption and a `GO` session in the
  continuity evidence log.
- Ran the deep consolidation pass for the closure batch: archived the
  completed WS3 merge plan, promoted the redaction lesson into permanent
  docs/patterns, and advanced the continuation prompt so the token
  prerequisite is the next safe step.

### Next Session Notes

- Start `current/ws3-design-token-prerequisite.plan.md` before touching Phase 4
  or Phase 5 widget UI work.
- `pnpm qg` is the next canonical non-mutating readiness gate before commit.

### Patterns to Remember

- URL/query redaction and CLI argument redaction are not enough for OAuth
  flows; form-encoded request bodies need their own shared redaction path.
- When fallback behaviour already exists in a shared formatter, close the plan
  item with boundary proof rather than inventing a second implementation path.

### Surprise

- **Expected**: the WS3 blocker would mostly collapse into prompt and plan
  hygiene once the code was inspected
- **Actual**: the shared redaction layer still missed object-level `state` and
  `nonce`, and form-body handling needed its own policy branch
- **Why expectation failed**: earlier coverage proved URL/query redaction but
  did not exercise raw OAuth form bodies or the successful-auth log payloads
- **Behaviour change**: when a security-hardening item names shared
  observability, prove the common library against the exact wire format before
  assuming route-local coverage is enough

## Session 2026-04-02 — WS3 shell replacement and token foundation

### What Was Done

- Replaced the temporary widget scaffold with a live
  `@modelcontextprotocol/ext-apps/react` app using `useApp(...)`,
  `onAppCreated`, reducer-driven runtime state, and host-style synchronisation.
- Added `packages/design/design-tokens-core` for DTCG flattening, tier
  validation, and CSS custom-property emission.
- Added `packages/design/oak-design-tokens` with DTCG JSON sources and a built
  `index.css` entrypoint consumed by the widget.
- Wired the new design workspaces into `pnpm-workspace.yaml`, Turbo, ESLint
  boundary rules, and the HTTP app package graph.
- Updated WS3/current-plan docs so Phase 4 and Phase 5 treat the prerequisite
  shell and token package as the canonical starting point.

### Patterns to Remember

- `useHostStyleVariables(app, app?.getHostContext())` is not additive with a
  separate `app.onhostcontextchanged` assignment; the SDK currently exposes one
  host-context callback slot, so the final handler must compose both style
  application and local runtime-state updates.
- Standalone workspace scripts that import another workspace through its
  built export need either the dependency built first or an explicit prebuild
  step; Vitest may resolve source via development conditions, while `tsx`
  package builds may still target `dist`.
- User correction on gate workflow: `pnpm check` is always mandatory; `pnpm qg`
  is informational for the user and must never be treated as a substitute or
  as the first half of a required sequence.
- Quality-gate failures are always blocking, even when they surface in files
  that predate the current edit slice.

### Surprise

- **Expected**: the host-style hook and local runtime state could each register
  their own host-context listener without interference
- **Actual**: the host-style hook owns the same `app.onhostcontextchanged`
  setter as the local runtime code
- **Why expectation failed**: the ext-apps SDK uses a single convenience
  setter per notification rather than a multi-listener subscription model
- **Behaviour change**: when using `useHostStyleVariables`, compose any
  runtime-state work into the final host-context handler instead of assuming
  listener fan-out

### Repo Gate State

- Working rule for this repo is now explicit and tested in practice:
  `pnpm check` is the only mandatory gate, `pnpm qg` is informational for Jim,
  and every quality-gate issue is blocking even when a tool exits zero.
- Cleared the remaining `packages/sdks/oak-sdk-codegen` blocker set by:
  - replacing banned inline `eslint-disable` comments with package-scoped
    ESLint overrides for the genuinely long/static files,
  - fixing TSDoc parser issues in authored and generated MCP-tool contract text,
  - removing assertion-only test patterns and `@ts-expect-error` usage from the
    completion-context regression coverage.
- Verified locally:
  - `pnpm --filter @oaknational/sdk-codegen lint:fix`
  - `pnpm --filter @oaknational/sdk-codegen type-check`
  - `pnpm --filter @oaknational/sdk-codegen test`
- Verified repo-wide:
  - `pnpm check` passed clean on 2026-04-02 after the stricter gate policy was
    applied end-to-end.

## Session 2026-04-02 — external semantic atlas capture

### What Was Done

- Created a first-pass semantic atlas and a second-pass companion stub under
  `.agent/research/developer-experience/` for an external agent-system review.
- Kept the first pass strictly descriptive and replaced branded source terms
  with a stable semantic lexicon before writing the system map.
- Planned targeted validation around markdown linting, evaluative-language
  leaks, and branded terminology leaks instead of treating the note as an
  unstructured essay.

### Patterns to Remember

- For exploratory external-system synthesis, `.agent/research/` is the correct
  estate; `.agent/analysis/` is for narrower repo or product investigations.
- When the source surface is heavily branded, define the semantic glossary
  first; the naming pass prevents brand leakage in later sections.
- Some source-indexed wiki pages are easier to reach by extracting their slug
  URLs from the page HTML than by relying on the browser tool's click surface.

### Surprise

- **Expected**: `.agent/analysis/` might be the natural home because the task
  was analytical in style
- **Actual**: `.agent/research/` is the better fit because the Practice
  defines it as the home for exploratory synthesis, while `analysis/` is a
  narrower report surface
- **Why expectation failed**: the first instinct followed task shape rather
  than the repo's artefact taxonomy
- **Behaviour change**: choose the estate from Practice definitions first, then
  confirm it against nearby examples
