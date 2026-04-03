## Session 2026-04-03 — consolidate-docs gate-surface sweep

### What Was Done

- Ran `jc-consolidate-docs` after the root gate simplification and found
  remaining live `pnpm qg` references in milestones, roadmaps,
  active/current/future plans, and the local Claude project memory.
- Updated those live surfaces to standardise on `pnpm check`, while leaving
  archive/history material and explanatory removal notes untouched.
- Tightened `consolidate-docs` so repo-level command renames now trigger an
  explicit sweep across live plans, milestones, templates, and platform
  memory.
- Verified the remaining `pnpm qg` mentions are historical or explanatory
  only.

### Patterns to Remember

- Removing a canonical root command requires a sweep across live plans,
  roadmaps, milestones, and platform memory; if you only fix the canonical
  docs, operational guidance keeps teaching the retired command.

## Session 2026-04-03 — napkin rotation and consolidation

### What Was Done

- Rotated napkin after reaching 632 lines (threshold: 500). Archived to
  `napkin-2026-04-03.md`. Merged 5 new behaviour-changing entries into
  `distilled.md`: review scope separation, Turbo override completeness,
  MCP Apps single callback slot, `console` ban meaning, and the
  `rg -uu` ignored-estate rule from the prior session.
- Extracted the "UX predates visual design" pattern to
  `.agent/memory/patterns/ux-predates-visual-design.md` — the first
  session with visual UI revealed that audience-facing UX decisions had
  been accumulating unnamed across CLIs, SDKs, MCP tools, and
  documentation for months.
- Updated session-continuation.prompt.md: deferred review findings are
  now a gate (must be resolved before Phase 4), each with an honest
  assessment of whether it's genuinely pre-existing or could have been
  fixed in this session.
- Found 5 skills missing from `.claude/settings.json` permissions
  allowlist: `jc-session-handoff`, `jc-go`, `jc-metacognition`,
  `jc-gates`, `jc-review`. The portability validator checks adapter
  existence but not platform permission authorisation — a validation
  gap.
- Split `.claude/settings.json` into project (tracked) and
  `settings.local.json` (gitignored). Project config defines the
  agentic system contract: skill permissions, safety hooks, plugin
  state. User-specific paths and one-off permissions move to local.
  Arrays concatenate across scopes per Claude Code merge semantics.
- Graduated the settings portability principle to permanent docs:
  ADR-125 now has a "Platform Configuration" section, distilled.md
  has a behaviour-changing entry, and a new pattern
  "platform-config-is-infrastructure" was extracted.
- Follow-up still needed: extend portability validator to check skill
  permission entries (validator gap, not doctrine gap).

## Session 2026-04-03 — research shortlist implementation

### What Was Done

- Implemented the external-concept promotion pack in the
  `agentic-engineering-enhancements` evidence template and added a
  pilot evidence bundle with three research-derived proposals
  (promotion discipline, delegation snapshot, health probe).
- Upgraded reviewer/delegation doctrine locally: layered triage,
  explicit review depth, coverage tracking, delegation snapshot fields,
  and reintegration wording now live in the directive, rule, gateway
  template, and `parallel-agents` skill.
- Named the hook precedence model as a local `Policy Spine` in the hook
  README and cross-platform surface matrix, then tightened the
  portability helper test to require that terminology plus
  `override/prune/block` semantics.
- Added `claude-agent-ops health`, implemented as a summary-first
  agent-infrastructure probe with deterministic checks for command
  adapters, reviewer adapters/registrations, hook-policy coherence,
  practice-box state, and continuity-prompt freshness.
- Extended takeover bundles with an explicit reintegration contract and
  documented the new health surface across `AGENT.md`, `AGENTS.md`,
  `CLAUDE.md`, `.agent/README.md`, the artefact inventory, repo
  README, and `agent-tools/README.md`.
- Verification passed: `pnpm --filter @oaknational/agent-tools lint`,
  `pnpm --filter @oaknational/agent-tools build`,
  `pnpm --filter @oaknational/agent-tools test`, and
  `pnpm test:root-scripts`.
- Live health result is intentionally `WARN`, not `PASS`: the new probe
  found a real continuity drift where
  `.agent/prompts/session-continuation.prompt.md` still says the
  practice box has 18 incoming items while
  `.agent/practice-core/incoming/` currently has 0.

## Session 2026-04-03 — report normalisation and research index cleanup

### What Was Done

- Confirmed the `chatgpt-report-normalisation` skill should be applied as a
  repair-first workflow, not an editorial rewrite. The canonical target is the
  existing markdown scaffold when it already preserves the best structure.
- Cleaned two new protocol/interoperability reports under
  `.agent/research/developer-experience/novel/` by using the markdown copies
  as the structural base and the DOCX relationship layer plus `pandoc` output
  only to recover live links and strip export artefacts.
- The winning recovery method was block-preserving normalisation with targeted
  manual repairs for the few sections where DOCX/pandoc citation placement
  drifted or collapsed adjacent markdown blocks.
- Updated the novel research guide so it now distinguishes source-faithful
  report recoveries from the de-branded semantic-atlas lane.
- Added `.agent/research/developer-experience/README.md`, updated the
  top-level research index with a developer-experience section, and repaired
  stale cross-links in the 2026-04-02 coordination report pair.

## Session 2026-04-03 — report normalisation protocol correction

### What Was Done

- Applied the user's correction fully: the
  `chatgpt-report-normalisation` skill now states explicitly that, for
  paired exports, the existing markdown is the primary source for
  structure and content, while the DOCX is the primary source for
  repairing real hyperlink targets.
- Tightened the paired pattern doc to make the working method explicit:
  repair citations marker-by-marker inside the markdown scaffold, use
  pandoc only as a secondary diagnostic lens, and do not let DOCX-first
  or pandoc-first rebuilds override a stronger markdown structure.
- Captured the concrete failure mode from the temp report work:
  over-broad heuristic citation remapping creates giant citation
  bundles, dropped support, and misattached links even when the overall
  document shape survives.
- Confirmed the practical method that worked: original markdown
  scaffold + DOCX relationship targets is the right recovery surface
  for minimal, source-faithful repair.

## Session 2026-04-03 — report repair output-contract and wording lessons

### What Was Done

- Reprocessed the two protocol/interoperability reports as sibling
  `-clean.md` outputs inside the ignored `novel/` lane instead of
  overwriting the re-imported raw markdown or pretending that promotion
  into tracked canon had already happened.
- Used the raw markdown as the structure/content scaffold, the DOCX as
  the hyperlink-recovery surface, and local manual cleanup for the
  known citation traps where DOCX/pandoc introduced wrong inline links
  or lost list-bullet citations.
- Updated the local and tracked research indexes so they no longer
  promise promoted report copies that do not currently exist outside
  `novel/`.
- Captured the next doctrine refinement: repair workflows need an
  explicit output contract (`overwrite`, `sibling clean copy`, or
  `promote later`) in addition to explicit source precedence.

### Reflections

- The word `normalise` still carries rewrite energy unless the skill
  immediately constrains it with non-goals and source precedence.
- `Canonical` is also overloaded: it can mean "best reading surface for
  this lane" or "final tracked repo home". The skill needs to name which
  one is intended.
- Validation instructions need the same specificity as output
  instructions. A generic markdownlint step can be wrong if a repo
  deliberately excludes a doc estate from markdownlint.

## Session 2026-04-03 — open mechanisms report repair

### What Was Done

- Repaired `Open mechanisms for agentic LLM systems` into a sibling
  `-clean.md` output in the local `novel/` lane, keeping the raw markdown as
  the structural scaffold and recovering inline citation links from the DOCX
  export via the pandoc body.
- Confirmed the report follows the same local output contract as the other
  repaired reports in this lane: raw imports remain intact and the clean copy
  becomes the reading surface.
- Updated the local `novel/README.md` guide so it now lists the new clean
  copy alongside the earlier protocol reports.

### Patterns to Remember

- For this report, the usable citation sequence was the pandoc body **before**
  the trailing horizontal-rule bibliography dump. Counting links after that
  point overstates the usable citation set and breaks one-to-one mapping with
  the raw markdown markers.
- Pandoc again attached bogus links directly to exported entity names
  (`Google Cloud`, `Linux Foundation`, `OpenAI`, `Microsoft`, `Hugging Face`,
  `OWASP`, `IETF`). When that happens, drop the entity-attached citation links,
  keep the entity text plain, and map only the remaining DOCX-derived citation
  links onto the raw markdown `cite` markers.

## Session 2026-04-03 — open mechanisms over time report repair

### What Was Done

- Repaired `Open Mechanisms for Improving LLM Agent Systems Over Time`
  into a sibling `-clean.md` output in the local `novel/` lane, keeping the
  raw markdown as the structural scaffold and recovering inline citation links
  from the DOCX export without carrying over the trailing bibliography dump.
- Updated the local `novel/README.md` guide so the new clean copy is listed as
  the lane's reading surface beside the earlier report recoveries.

### Patterns to Remember

- If the raw markdown cite-marker count plus the raw entity-marker count equals
  the DOCX body's inline citation count after trimming the pandoc
  bibliography dump, the report is a strong candidate for sequential
  source-faithful repair from the existing markdown scaffold.
- For table-driven reports, strip pandoc's bogus first-cell entity citations
  before taking the DOCX body as the citation stream; otherwise every
  subsequent citation shifts out of alignment.

### Mistakes Made

- Assumed `python` was available in the shell; on this machine the usable
  interpreter is `python3`, so quick analysis helpers should default to that.

## Session 2026-04-03 — consolidate-docs convergence refresh

### What Was Done

- Applied `jc-consolidate-docs` to the current documentation and memory
  surfaces rather than treating the earlier report-repair work as already
  converged by default.
- Pruned three `distilled.md` entries that had already graduated into
  permanent homes in `consolidate-docs` and ADR-125, reducing distilled from
  200 lines to 186.
- Realigned the local Claude project memory summary and its reviewer-findings
  feedback note with the canonical "review scope separation" rule so the
  platform memory no longer says to fold all pre-existing findings into the
  current scope.
- Refreshed the session-continuation prompt's deep-consolidation status to
  mention the repair-workflow wording-clarity work and the doctrine pruning.

### Patterns to Remember

- When a distilled entry now has a real permanent home in an ADR, command, or
  governance doc, remove it from `distilled.md`; distilled is a refinement
  layer, not a second permanent archive.
- Platform-specific memory can lag behind canonical doctrine after a user
  correction. A consolidation pass should audit and realign those summaries if
  they now contradict the repo's current rules.

### Fixes

- `pnpm practice:fitness` still fails, but the remaining failures are a
  broader pre-existing batch in long-standing docs
  (`AGENT.md`, `principles.md`, `schema-first-execution.md`,
  `testing-strategy.md`, `CONTRIBUTING.md`, `development-practice.md`,
  `typescript-practice.md`, `troubleshooting.md`). The files touched in this
  pass are within threshold.

## Session 2026-04-03 — quality-gate surface canonicalisation

### What Was Done

- Promoted `pnpm check` to the explicit canonical aggregate gate in
  `AGENT.md` and ADR-121, then removed `pnpm qg` entirely to avoid
  competing gate narratives.
- Added root `test:widget` and `test:a11y` scripts, plus Turbo
  `test:a11y` support, so the documented gate surface matches executable
  commands.
- Split the landing-page Playwright suite so `test:ui` excludes the tagged
  accessibility assertion and `test:a11y` runs it separately.
- Updated `pnpm check` to run `pnpm sdk-codegen` explicitly before
  `pnpm build`, then the full sequential gate chain.

### Patterns to Remember

- When quality-gate doctrine drifts, treat root `package.json` scripts and
  live hook/workflow surfaces as source of truth, then repair the command
  surface and the canonical docs together rather than editing prose alone.

## Session 2026-04-03 — pre-Phase-4 gates and design conversation

### What Was Done

- Completed all three pre-Phase-4 gates: portability validator Check 11
  (skill permissions), deferred review findings (threadSlug removal,
  bulk-rollup-builder→Result, OakUrlAugmentable tracked, fakes.ts accepted),
  and the design conversation.
- Design conversation reframed Phase 4 as a brand banner (not data
  renderer) and Phase 5 as user-first search with `callServerTool` +
  `updateModelContext` + `visibility: ["app"]`.
- Wrote ADR-151 (MCP App Styling Independence). Three architecture
  reviewers found: inaccurate "same colours" claim (palettes diverge),
  missing negative consequence (no shared component layer), ADR-045
  cross-reference gap. All fixed.
- Wrote contrast validation prerequisite plan. Architecture confirmed by
  Betty (cohesion), Fred (ADR compliance), design-system (data model).
  Key decision: no write-back to source JSON — contrast data is a build
  artefact in `dist/`.
- Wider trawl of 7 repos found no reusable contrast/token/styling code.
  Nothing meets the bar. Build from W3C spec.
- Extracted `buildBulkOps` to `bulk-ops-builder.ts` for max-lines
  compliance (proper file split, not formatting compression).

### Patterns to Remember

- Triadic contrast (text + button surface + page background): WCAG only
  defines bilateral contrast. When three elements interact, all three
  pairwise ratios must pass. Candidate for pattern extraction once the
  contrast validation tool is implemented and proves the model.
- When a file exceeds max-lines, extract by responsibility with TDD.
  Never compress formatting (single-line interfaces, collapsed constants)
  to fit — that is a hack.
- "Shared tokens" does not mean "same values". The MCP token palette and
  oak-components use different hex values. Say "authored with reference
  to" not "same as" when the values are not generated from a common
  source.

### Mistakes Made

- Compacted `EnrichmentTracker` interface and `DEFAULT_CONFIG` to single
  lines to fit under max-lines. User caught this — principles say split
  by responsibility, not compress formatting.
