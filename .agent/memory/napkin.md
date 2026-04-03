## Session 2026-04-03 — comprehensive review and scope correction

### What Was Done

- Closed WS3 design-token prerequisite: WS4 quality gates (`pnpm check`
  green), WS5 adversarial review (design-system, config, test, code
  reviewers), all findings fixed in commit `6743b384`.
- Ran comprehensive 5-reviewer cycle on the full branch diff (7 commits,
  356 files): code, type, fred, security, wilma.
- Fixed in-scope findings: restored StrictMode, added callback exception
  isolation, safe dispatch, exhaustive reducer (`assertNever`), TSDoc on
  widget exports, lib-dependency guard on design boundary rules, DTCG
  `$description` on all tokens, dark theme documentation.
- Identified and deferred out-of-scope SDK/CLI findings to a follow-up:
  `OakUrlAugmentable` `Record<string, unknown>`, `fakes.ts` type
  assertion, `bulk-rollup-builder` throw→Result, `threadSlug` void hack,
  `@security` tag restoration, ESLint config-level suppressions.
- User correction on scope creep: the comprehensive review spiralled from
  "review the design token work" into "fix every finding across every
  commit across the branch." Reverted out-of-scope fixes and separated
  the SDK/CLI work as a follow-up.
- User correction on `console` ban: the ban forces canonical logger usage,
  not fallback to `process.stderr.write`.

### Patterns to Remember

- When a review cycle produces findings across multiple commits, separate
  in-scope fixes (this session's work) from pre-existing issues (other
  commits). Don't conflate scope.
- `Record<string, unknown>` as a type is sometimes the honest structural
  constraint — investigate before replacing it.
- `console` is banned to force logger injection, not to use IO primitives.
- Build scripts that have no logger available should let errors propagate
  naturally rather than inventing custom error handling.

### Surprise

- **Expected**: the comprehensive review would mostly validate existing
  work with minor findings
- **Actual**: the review exposed significant pre-existing SDK type
  architecture issues (config-level ESLint suppressions masking forbidden
  patterns) that are architecturally real but belong to a different scope
- **Why expectation failed**: reviewing a 7-commit branch surface treats
  all commits as one scope, but the SDK commit predates the design token
  work by days and has its own architectural trade-offs
- **Behaviour change**: when asked for a comprehensive review, identify
  which findings are in-scope vs pre-existing, fix the in-scope ones,
  and report the pre-existing ones as tracked follow-ups rather than
  fixing everything in one session

## Session 2026-04-02 - semantic atlas exact-trace extraction

### What Was Done

- Added six focused semantic-atlas extraction notes under
  `.agent/research/developer-experience/novel/` for:
  - `Policy Spine` precedence and validation
  - `Package Fabric` activation, refresh, and rollback
  - `Worker Mesh` lane reintegration
  - `Ops Nerve` telemetry and redaction
  - `Role Foundry` versioning and repair
  - `Operator Shell` web-translation keyboard, focus, and announcement traces
- Used targeted source extraction rather than another broad survey, including a
  deeper pass on role-definition authority, validation, and repair because that
  surface looked especially doctrine-relevant.
- Consulted and then closed the accessibility and delegation-architecture
  specialists after incorporating their framing into the browser-translation
  and role-focused notes.
- Verified the six new notes with `markdownlint` from inside `novel/`.
- Re-ran the semantic scrub and confirmed there is still no literal
  `ccunpacked` domain reference anywhere in the repo.

### Patterns to Remember

- When a research set reaches the "one more pass" stage, the best increment is
  often a family of exact traces or ledgers rather than another umbrella note.
- Deeply relevant doctrine candidates benefit from a named distinction between
  authority, activation, diagnosis, and repair; otherwise versioning talk turns
  mushy very quickly.
- `markdownlint` against dotted paths is more reliable when run from inside the
  target directory than from repo root with hidden-path arguments.

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

## Session 2026-04-02 — semantic atlas reviewer pass

### What Was Done

- Reviewed the semantic atlas set from the MCP reviewer stance, using only the
  passes and frontier briefs needed to judge doctrine readiness.
- Resolved the user's abbreviated file placeholders to the actual
  `semantic-atlas-*` filenames before reading the frontier notes.
- Cross-checked the atlas gaps against the live MCP and MCP Apps
  documentation so the feedback stayed protocol-grounded rather than purely
  stylistic.

### Patterns to Remember

- When a user gives abbreviated research filenames with `...`, verify the
  concrete filenames in the tree before reading; this repo often prefixes
  focused briefs with the full semantic-atlas stem.
- For MCP-facing review of external-system research, ask first for a protocol
  crosswalk and a clear host-vs-protocol boundary; those are the usual missing
  pieces before anything can inform doctrine.

## Session 2026-04-02 — report normalisation skill import

### What Was Done

- Imported the `chatgpt-report-normalisation` skill from the
  `algo-experiments` repo into Oak as a canonical skill with Cursor and Codex
  wrappers.
- Adapted the workflow to Oak's local conventions: pattern guidance now lives
  in `.agent/memory/patterns/`, the validation step names `pnpm exec
  markdownlint`, and the skill explicitly treats ignored import lanes as
  staging rather than canonical endpoints.
- Added the companion pattern note to the local patterns estate and refreshed
  the practice index and artefact inventory so the new capability is
  discoverable.

### Patterns to Remember

- Cross-repo skill import is usually a semantic port, not a literal copy:
  preserve the proven workflow, then retarget the references, validation
  commands, and estate names to the destination repo.
- For document-recovery workflows, keeping the editing target separate from the
  canonical target helps: ignored scratch lanes are fine for reconstruction,
  but the task is not complete until a tracked canonical markdown file is
  updated.

### Surprise

- **Expected**: Oak might already have an equivalent report-clean-up skill under
  a different name
- **Actual**: the capability lived only in `algo-experiments`, so importing it
  required both the skill and the supporting pattern note
- **Why expectation failed**: the remembered workflow was local to the machine,
  not local to this repo
- **Behaviour change**: when a remembered capability is "somewhere on this
  computer", search sibling repos and session traces before assuming the repo's
  own practice estate lost it

## Session 2026-04-02 — external semantic atlas Betty review

### What Was Done

- Reviewed the external semantic atlas research set through the Betty
  architecture lens, focusing on cohesion, coupling, evidence gates, and
  doctrine-fit.
- Confirmed the atlas is strongest when it names precedence, trust, operator
  visibility, and capture-layer distinctions, and weaker where change-cost and
  ownership boundaries remain implicit.

### Patterns to Remember

- For architecture-facing research, the next useful increment is often not more
  surface discovery but a sharper map of what changes together, what owns the
  change, and what evidence would justify doctrine promotion.

## Session 2026-04-02 — external semantic atlas frontier expansion

### What Was Done

- Compared the first three semantic-atlas passes against the wider external
  section map and identified the areas still underexplored after the original
  orchestration-focused work.
- Wrote four follow-on notes in
  `.agent/research/developer-experience/novel/`:
  `...frontier-map.md`,
  `...operator-shell-and-startup-surfaces.md`,
  `...control-plane-and-trust-surfaces.md`, and
  `...extension-and-ops-surfaces.md`.
- Kept the new notes semantic rather than branded by introducing frontier
  aliases such as `Startup Spine`, `Operator Shell`, `Remote Control Plane`,
  `Identity Plane`, `Policy Spine`, `Package Fabric`, `Recipe Forge`,
  `Role Foundry`, `Ops Nerve`, and `Health Probe`.
- Validated the new notes with residue sweeps for planning language and
  branded leakage, then fixed the remaining heading-spacing and line-length
  markdown issues.

### Patterns to Remember

- After a first-pass atlas settles the core loop, the highest-value follow-on
  work is often at the edges: startup, operator shell, remote control, policy,
  packaging, diagnostics, and lifecycle maintenance.
- It helps to separate "not yet explored" from "already explored but only as a
  latent edge"; that distinction makes the next research pass more targeted and
  avoids rehashing the core system map.
- If a branded operational term leaks into a semantic note, replace it with a
  function-first alias before doing the final validation sweep.

### Surprise

- **Expected**: the unexplored residue after the first three passes would be
  mostly presentation-layer garnish
- **Actual**: several of the untouched areas turned out to be structural:
  boot sequencing, remote integrity rules, managed-policy trust gates,
  extension lifecycle state, reusable-process capture, and diagnostics
- **Why expectation failed**: the early passes were strong on inner
  orchestration semantics, which made the outer shell and operational surfaces
  look thinner than they really were
- **Behaviour change**: when doing external-system synthesis, explicitly map
  what the first passes left outside scope before assuming the remaining site
  area is low-value packaging detail

## Session 2026-04-02 — specialist consensus and final sweep

### What Was Done

- Consulted the full local specialist roster on what they would still want
  from the external semantic-atlas resource after the first three passes and
  the frontier briefs.
- Wrote a new closing note at
  `.agent/research/developer-experience/novel/`
  `2026-04-02-external-agent-system-semantic-atlas-specialist-consensus-and-final-sweep.md`
  that records the per-lens asks, the repeated consensus themes, and the final
  distinction between external-site residue and internal Oak promotion work.
- Ran a repo-wide literal-domain sweep and confirmed the checked external-site
  domain does not appear anywhere in the repository.
- Validated the new note with markdown lint.

### Patterns to Remember

- A large reviewer roster often converges faster than expected: once several
  lenses independently ask for provenance, landing zones, evaluation surfaces,
  and explicit exclusions, that is usually the real missing work.
- After enough exploratory passes, more external browsing stops being the main
  blocker; the missing artefacts become internal promotion tools such as
  problem registers, ownership maps, and evidence-led adoption tables.
- When a user asks to purge a specific external reference from the repo, verify
  the literal string directly with a repo-wide search rather than assuming the
  semantic rewrite work already removed it.

### Surprise

- **Expected**: the full specialist roster would produce a broad spread of new
  domain-specific asks
- **Actual**: most of the roster converged on the same compact set of needs:
  provenance, local landing zones, evaluation traces, reintegration edges, and
  explicit "keep this out of doctrine" boundaries
- **Why expectation failed**: once the atlas was mature enough, the unresolved
  questions were less about discovering new external areas and more about
  deciding what Oak could safely promote
- **Behaviour change**: after a mature external synthesis, ask the specialist
  roster for the missing promotion artefacts before defaulting to another wide
  browsing pass

## Session 2026-04-02 — multi-export report consolidation

### What Was Done

- Applied the new `chatgpt-report-normalisation` workflow to the three
  `Agent Coordination Systems in Multi-Agent AI` exports under the ignored
  `novel/` lane.
- Used the Markdown export as the strongest body scaffold and the DOCX export
  as the reference-recovery layer, then promoted a new tracked consolidated
  note into `.agent/research/developer-experience/`.
- Ran a local link-resolution sweep on the deduplicated recovered URL set and
  carried the unresolved legacy links forward with explicit notes instead of
  silently dropping them.

### Patterns to Remember

- For imported research reports, "consolidated" is often better than "perfectly
  reconstructed": preserve the substance, clean the structure, and replace
  fragile internal markers with a deduplicated bibliography.
- When local PDF tools are available, run a real PDF pass before closing the
  document: confirm whether the PDF is text-based, compare it against the
  Markdown and DOCX surfaces, and separate true extra material from line-break
  artefacts in dumped URL appendices.
- When a skill depends on optional Python helpers, record the environment
  pattern in the skill itself: dedicated virtual environment, explicit
  interpreter path, no assumption of system-level packages.
- A source-note style with a full bibliography is often more readable than
  attaching a citation to every sentence when normalising long LLM-generated
  research reports.

### Surprise

- **Expected**: the PDF might reveal missing citations or extra body text that
  the Markdown and DOCX copies had dropped
- **Actual**: once local PDF tools were installed, the PDF proved to be a
  text-based export with substantially the same body content plus a noisy raw
  URL appendix
- **Why expectation failed**: the apparent "extra" references were mostly
  line-break or truncation variants of links already recoverable from the DOCX
- **Behaviour change**: treat PDF URL dumps as a verification layer, not as a
  better bibliography, unless comparison shows genuinely new targets

## Session 2026-04-02 — report-normalisation doc consolidation

### What Was Done

- Ran the deep-consolidation sweep after the Oak report-normalisation import
  and the first local multi-export recovery pass.
- Graduated the proven PDF-handling lesson from session memory into the
  canonical skill and the permanent pattern note.
- Confirmed no relevant non-repo platform plans or platform memory files
  contained additional grounding for this slice.
- Ran `pnpm practice:fitness:informational`, fixed the touched
  `artefact-inventory` line-width issue, and left broader pre-existing fitness
  warnings untouched.

### Patterns to Remember

- When a newly imported skill is proven locally, refresh the canonical skill
  and permanent pattern note immediately; do not leave the sharper local
  guidance trapped in napkin memory.
- For report-normalisation work, the durable deliverable is the source-faithful
  clean copy itself. Do not encode "consolidated report" as an alternate skill
  mode.
- When DOCX or pandoc output is used as the citation-bearing base, add an
  explicit block-normalisation pass for headings, lists, tables, and `Sources:`
  lines before calling the copy clean.

### Surprise

- **Expected**: the consolidation pass might need a new outgoing practice note
  or a plan-doc extraction
- **Actual**: the durable homes already existed, so the right move was to
  sharpen the existing skill/pattern pair rather than create a second layer of
  documentation
- **Why expectation failed**: the recent work produced a refinement of an
  existing capability, not a new Practice structure
- **Behaviour change**: prefer strengthening the established canonical doc
  surface before creating new documentation estates

## Session 2026-04-02 — clean-copy mode correction

### What Was Done

- Applied user correction to the report-normalisation workflow: the skill now
  treats the source-faithful clean copy as its only deliverable mode.
- Folded the fresh recovery refinements into the canonical skill and pattern
  note: readable `[[n]](...)` citation links, raw-appendix stripping, and a
  required markdown block-normalisation pass after automated conversion.
- Regenerated the `Agent Coordination Systems in Multi-Agent AI` normalised
  copy with those refinements so the output behaves like a clean copy rather
  than a second report.

### Patterns to Remember

- If the user says a skill has only one mode, reflect that literally in the
  canonical instructions; do not preserve softer optional branches out of
  habit.

### Surprise

- **Expected**: separating "default mode" from "optional mode" would be a clear
  enough way to keep the clean-copy workflow primary
- **Actual**: the optional mode itself was the mistake; it encouraged drift
  away from the real deliverable
- **Why expectation failed**: the workflow boundary was narrower than the
  imported wording implied
- **Behaviour change**: when a recovery skill is meant to preserve a document,
  encode the preservation boundary as a hard rule, not a preference

## Session 2026-04-02 — semantic pass planning split

### What Was Done

- Replaced the scaffold-only second-pass note in the external semantic-atlas
  lane with a real repo-facing planning brief.
- Added a third-pass planning brief that generalises beyond the repo and treats
  the completed second pass as a subtraction step before portable lessons are
  claimed.
- Tightened the planning prose so even local repo surfaces are described
  semantically rather than by their literal surface labels.

### Patterns to Remember

- In multi-pass external-system research, separate the repo-facing comparison
  from the portable-system generalisation pass. The second pass decides local
  fit; the third pass decides what still travels after local needs are
  subtracted.
- If the user asks for fully semantic writing, apply that rule to local repo
  surfaces as well as to external branded surfaces.

## Session 2026-04-02 — WS3 design-token prerequisite review closure

### What Was Done

- Ran adversarial review cycle (design-system, config, test, code reviewers)
  against the design-token prerequisite implementation.
- Fixed 23 tier violations in widget CSS by adding component-tier tokens for
  layout spacing, state colours, alert styling, and page-level resets.
- Fixed dark theme token collisions: `text-inverse` now contrasts against
  accent backgrounds, `accent-strong` is visually distinct from `accent`.
- Added Turbo `type-check`, `lint`, `lint:fix` overrides for
  `design-tokens-core` (previously fell through to generic tasks).
- Removed redundant `prebuild` from `oak-design-tokens` (Turbo handles it).
- Expanded tier-validation tests to cover all three enforcement branches.
- Split the chained 4-action widget state test into 7 individual tests
  covering every action type including previously untested `tool-input`,
  `runtime-error`, and `tool-cancelled`.
- Added App tests for error display (alert role) and connected state.
- Deleted the misclassified `index-css.unit.test.ts` (filesystem IO in a
  unit test); the build itself proves the import works.

### Patterns to Remember

- When specialist reviewers find tier violations, the fix is to add missing
  tokens at the correct tier, not to document the violation as an exception.
- Turbo overrides REPLACE generic tasks completely: if a workspace has any
  override, it needs overrides for ALL task types it uses.
- `projectService: false` is the established ESLint pattern for small
  packages (`core/`, `libs/`, `design/`); SDKs and apps use `true`.

### Surprise

- **Expected**: the review cycle might find cosmetic issues and minor
  test gaps
- **Actual**: 23 tier violations in the widget CSS, 3 Turbo config gaps,
  2 dark theme colour collisions, and 5 untested state transitions
- **Why expectation failed**: the implementation focused on getting the
  architecture right at the package level but underfilled the component
  token tier and the dark theme edge cases
- **Behaviour change**: when adding a three-tier token system, audit the
  consumption CSS for tier-skipping before declaring GREEN
