---
fitness_line_target: 200
fitness_line_limit: 400
fitness_char_limit: 24000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# mcp-agent-facing-content Next Session

## Thread Identity

Thread: `mcp-agent-facing-content`
Goal: make ALL repo-controlled content that reaches an MCP consumer (the effective prompt agents
receive from the Oak Curriculum MCP server) **discoverable, auditable, and routed to the right
expert reviewer** — then (future, owner-gated) design SSOT content workspace(s) that own it. Curriculum
DATA bytes from the Oak API / bulk export are EXEMPT; repo-authored framing/templates/guidance are in
scope. Distinct from `data-sources-governance` (which registers the DATA sources + ADR-157 licensing);
this thread is about the *authored framing/instructions/descriptions* Oak controls.

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude | claude-fable-5 (switched from claude-opus-4-8[1m] mid-session 2026-07-09; continuous seat per PDR-027) | 2bd86d | Beacon hunts Brilliance | analyst + implementer | 2026-07-09 | 2026-07-09 |
| claude-code | claude-fable-5 | 8c566b | Monsoon herds Airstream | pr-shepherd | 2026-07-13 | 2026-07-13 |
| codex | GPT-5 | 019f5b | Acacia wakes Sapling | explorer | 2026-07-13 | 2026-07-13 |
| claude-code | claude-fable-5 | b51773 | Urchin hunts Surf | implementer — MCP-103 phase (a): registry delta-refresh + workspace recommendation, PR #476 MERGED (240a598607b9) | 2026-07-22 | 2026-07-22 |
| codex | GPT-5 | 019f9f | Smelter rides Temper | implementer — MCP-103 phases (b)/(c), PR #582 shepherd | 2026-07-26 | 2026-07-27 |

## Urgent Handoff — PR #582 Is Pushed but the Reviewed Cure Is Local

**Custody transfers in full to Director Squall wakes Apex (459fd1) and the successor they name.**
Smelter rides Temper (019f9f) has stopped all source work and retired because the Codex credit
limit prevents further approved writes and live GitHub reads. The platform error was:
`Automatic approval review failed: You've hit your usage limit. Visit
https://chatgpt.com/codex/settings/usage to purchase more credits or try again at Aug 2nd, 2026
7:15 PM.`

The state has two distinct layers and is **not safe/complete**:

1. **Remote PR #582:** branch
   `jimcresswell/mcp-103-model-behaviour-content-workspace-all-repo-controlled-mcp`, last
   verified pushed head `SHA:11bfdf01e206c2d28e8f8d724d0a84cfc4333b2b`. The PR body describes
   that pushed head. Remote CI, current mergeability, latest `origin/main`, and any review
   activity after the credit failure are unverified.
2. **Local worktree:** locate the worktree for that branch with `git worktree list`. Its HEAD is
   the same `SHA:11bfdf01e206c2d28e8f8d724d0a84cfc4333b2b`, but it has six uncommitted
   tracked files containing the reviewed follow-up:
   - `.agent/reports/mcp-agent-facing-content-audit/current-source-delta-inventory.json`
   - `.gitleaks.toml`
   - `agent-tools/src/mcp-content-current-source/current-source-delta-inventory.unit.test.ts`
   - `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app.ts`
   - `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk.ts`
   - `agent-tools/src/mcp-content-current-source/semantic-source-sha256.ts`

Do not reset, clean, rebase, or replace that worktree before reading its diff. The local cure:

- hashes the full TypeScript token stream, including scalar AST properties/operators/flags that
  `forEachChild` missed;
- preserves deliberate invariance for redundant expression/type parentheses and JSDoc/trivia;
- adds an explicit optional-chain marker so grouping such as `(a?.b).c` is not collapsed into
  `a?.b.c`;
- mechanically refreshes the 53-entry delta ledger and the exact reviewed hashes;
- narrows the gitleaks exception from a path-wide exclusion to the exact generated
  `baselineSha256`/`tokenSha256` line shapes.

The last narrowing correctly exposed one remaining false positive, and that is the **only known
local gate blocker**: C436 contains
`"indexToken": "ineffectiveness"` in
`current-source-anchors.json`; gitleaks classifies it as `generic-api-key`. Add a second
`[[allowlists]]` entry with `condition = "AND"`, the same exact anchors path, `regexTarget =
"line"`, and an exact line regex matching only the `indexToken` value `ineffectiveness`.
Every other source-derived index token must remain scanned. The attempted patch was rejected by
the credit limit and is not present.

### Evidence at the Local Cure

- focused semantic unit file: 8/8 pass;
- `pnpm --dir agent-tools type-check`: pass;
- targeted ESLint: zero errors, one pre-existing test warning;
- `pnpm --dir agent-tools validate-mcp-content-current-source`: pass, 725 current items and
  HTTP registration root walked;
- full agent-tools tests: 333 files, 3,449 tests pass;
- `pnpm repo-validators:check`, `pnpm knip`, `pnpm depcruise`,
  `pnpm format-check:root`, and `git diff --check`: pass;
- code-gateway re-review: APPROVE;
- MCP-semantics re-review: APPROVE after the optional-chain correction;
- full `pnpm secrets:scan`: fails only on the C436 false positive above.

These are local observations, not evidence about the current remote head. No fresh whole-repo
`pnpm check` was run at closeout; this seat was not the team closeout owner, and the known
secret-scan red prevents a green claim.

### Review and Continuation Order

The last verified unresolved actionable GitHub review threads were:

- `PRRT_kwDOPUA_4M6UCVfY` — semantic digest omitted scalar AST/operator/flag information;
- `PRRT_kwDOPUA_4M6UCVf0` — gitleaks path-only allowlist was too broad.

Two earlier threads were fixed, replied to, and resolved:
`PRRT_kwDOPUA_4M6UB6YI` and `PRRT_kwDOPUA_4M6UB6Yu`.

Resume in this order:

1. Read the local diff and add only the exact C436 line allowlist. **Falsifier:** any credential-
   shaped index-token fixture escapes scanning, or secrets scan reports more than the known
   classified line.
2. Run the full secret scan, regenerate/validate the current-source artefacts if the edit affects
   them, and repeat the proportional gates above. **Falsifier:** artefact count differs from 725,
   the inventory differs from 53 entries, or any gate is red/warning-bearing beyond the recorded
   pre-existing ESLint warning.
3. Fetch the latest code before integrating because the owner explicitly chose latest main.
   Reconcile without discarding the worktree. **Falsifier:** main advanced into overlapping files
   or the branch cannot be reconciled cleanly.
4. Commit through the coordination queue, push, update the PR body, then reply to and resolve the
   two threads only with evidence at the pushed head. **Falsifier:** GitHub still reports any
   unresolved review thread or the pushed SHA does not match local HEAD.
5. Wait for exact-head CI and a final settled read. Merge only under the Director/owner's current
   standing rule. **Falsifier:** any check is pending/red, review is unresolved, mergeability is
   not clean, or the Director has changed the freeze ruling.

### Concept-Exploration Result and Metaloss Closure

The handoff problem is custody across a discontinuity, not code completion. The harmful failure
would be a successor trusting the pushed PR as the reviewed state, erasing the local cure, or
resolving review before exact-head evidence. The assumption that changed was “pushed means
current”: it does not while a reviewed six-file cure remains uncommitted. A second changed
assumption was that narrowing the secret allowlist would simply turn the gate green; instead it
surfaced one legitimate false positive that now needs a line-exact exception.

Metaloss pass 1 recovered the remote/local split, unknown remote CI and latest-main state, the
single gitleaks error signature, the optional-chain semantic edge, stale PR body, and the dead
watcher. Pass 2 recovered where each fact now lives, transferred the promise to shepherd PR #582,
and bounded the blind spot created by unavailable live GitHub access. Scratch refresh and fixture
files were deliberately context-only; the tracked diff and commands above are the durable
continuation. A third pass would only re-find the indexed homes and stated external blind spots;
recursion closes here.

Deep consolidation is not due: this is an incomplete single-PR slice, and its thread-specific
execution knowledge is conserved here rather than promoted into cross-session doctrine.

## Landing Target For Next Session (trued 2026-07-13, Monsoon herds Airstream)

**The owner-commissioned concept exploration is complete as an exploration artefact, not as an
architecture decision or implementation plan:**
[`2026-07-13-mcp-agent-influence-content-organisation-exploration.md`](../../../../../docs/explorations/2026-07-13-mcp-agent-influence-content-organisation-exploration.md)
records the leading hypothesis of a canonical content estate plus typed concern-assurance areas.
Human review and automated evaluation share concern scope, stable identities, and coverage, while
remaining distinct products; pedagogy-like stewardship domains may earn primary boundaries,
safety remains cross-cutting, and broad accuracy must be decomposed into accountable claims. The
topology remains falsifiable through expert validation, concern-denominator research, editable
round-trip usability, and evaluation-methodology research.

**The Monday brief's one live task is DISCHARGED: PR #338 MERGED to main 2026-07-13 08:15Z
(`SHA:7ef8a8a3a`)** — the `effectiveness-and-impact` plan collection, the assessment-methodology
research plan, the plans-README wiring, and the rescued `#337` truings commit are all on `main`.
The final review round's Copilot finding (plan cited a repo-tracked `.mcp.json`; the file is
machine-local and gitignored) was verified real and fixed at `SHA:9cff508da` (capability-locus
truing); all review threads resolved with verified dispositions; 18/18 checks green at the
declaration instant; normal non-admin merge (merge commit).

Remaining, IN ORDER:

1. **Land the exploration before follow-on work:** verify PR #345 is merged and the exploration
   artefact above exists on `main`; do not treat review-ready or conflict-free state as landing.
2. **Branch cleanup (owner confirm, not agent action):** `docs/mcp-agent-facing-content-registry`
   (merged via #337), `docs/effectiveness-and-impact-assessment-research` (merged via #338), and
   `docs/mcp-content-338-closeout` (this truing, once merged) are deletable; deletion has
   historically been an owner action here — confirm rather than assume.
3. **Then STOP — everything else is owner-gated.** Do NOT start unprompted:
   - **Plan creation:** this is the next distinct stage when the owner starts it. Use the
     exploration as evidence without promoting its leading hypothesis into a settled architecture.
   - **Research execution** (the plan in §Owning plan(s)): first move when the owner clears it =
     dispatch the three PENDING readiness reviewers (assumptions-expert, mcp-expert, test-expert)
     on the plan body, absorb verdicts, then WS0 (P1 contamination quiz; P2 MCPJam expressiveness).
   - **Content-workspace build** (report §7 direction): its design questions get carded when the
     owner schedules it.
   - **Production analytics / tier-3**: gated on the `mcp-product-analytics` lane promotion.
4. **Standing, non-blocking items** (do only if owner asks): the confirmed content defects
   (report §8.1 — classNotes PII/injection, two typos, stale wording, idempotentHint, graph-tools/
   toolCategories mismatch) are small independent fixes, partly upstream in the OCA spec; the
   published claude.ai artifact of `content-registry.html` predates the review-round fixes (stale)
   — NOTE: the committed file now carries a full HTML document shell, and the artifact publisher
   wraps body-only content, so strip the shell before any republish (generator comment says this).

## Current State — VISIBILITY + PLANNING DELIVERABLES ON MAIN (2026-07-13)

The concept-exploration session adds the concern-assurance model linked in §Landing Target. Its
outcome narrows the later design space but deliberately leaves package topology, concern
denominators, evaluation instruments, and migration mechanics undecided. The next session must
verify the exploration has landed on `main` before beginning the separately owner-gated planning
stage; no content move, schema, generator, evaluation suite, or implementation follows directly
from this record.

**PR #337 MERGED to main 2026-07-09 15:03Z (`SHA:5f3c1f472`)** — the registry, report, rendered-wholes,
HTML browser, and generators are live on `main`. One commit missed the merge window (a known
stranding pattern: pushed to the branch moments after the owner merged): the report §7 count fix +
continuity pointers, commit `SHA:2af1ce9cb` — rescued by cherry-pick onto PR #338 (`SHA:e63f36cda`) and
**landed on `main` when PR #338 merged (2026-07-13, `SHA:7ef8a8a3a`)**. A **visibility-only**
deliverable — no product code changed, no validator, no evals built. Under
`.agent/reports/mcp-agent-facing-content-audit/`:

- `registry.json` — machine-readable **SSOT snapshot** of the corpus: **716 items across 143 files**,
  each tagged `impact_tier` (697 high-impact / 19 simple-config), `review_domain`, `source_locus`,
  `extraction_kind`, risk `flags`, provenance, snippet. This is the durable source; the views regenerate
  from it. (The raw two-pass audit outputs were ephemeral scratchpad files — GONE; registry.json is the snapshot.)
- `registry.md` — human index grouped by review domain, with reviewer pointers.
- `report.md` — the analysis, scope boundary, i18n reframe, findings, gaps, and the owner-decided direction (§7).
- `rendered-wholes.md` — surfaces **assembled as an agent receives them** (server instructions, all 42 tools,
  the 7 prompts, resources), rendered from the BUILT SDK (`generators/render-wholes.mjs` re-runs it).
- `content-registry.html` — self-contained WCAG 2.2 AA filterable browser. Published as a claude.ai artifact
  (private): <https://claude.ai/code/artifact/3485e961-d11c-41ef-963b-3cb2e7664459> (owner shares when ready).
- `generators/` — the deterministic scripts (registry.json is built by `build-registry.mjs` from the now-gone
  audit outputs; md/html/wholes regenerate from registry.json / the SDK).

**Owner decisions (report §7, authoritative):** (1) review WILL happen; (2) variety of reviews by
intent+audience, not one; (3) controlled content moves into SEPARATE content workspace(s) to lower
cognitive load; (4) stratify by `impact_tier`, REQUIRE review + eval protocols for high-impact, simple
config (branding/UI) exempt from protocols; (5) upstream in-house content is HIGHLIGHTED not wrapped
(monorepo consolidation eventually, not now); (6) the workspace(s) are **SSOT not copies** (consumers read
from them — which is why they cannot hold upstream content); (7) design **l10n-ready** (no translation now,
no rebuild later). **Eval protocols must follow strict researched best practice from authoritative sources.**
Lifecycle order that reconciles evals with the "no validator yet" ruling: review-protocol (ratify shape)
→ eval-protocol (measure behaviour) → drift-guard last.

**Source-locus provenance (where reviewers go; distinct from the exemption boundary — upstream ≠ exempt):**
`this-repo` (589); `upstream-in-house-api` (116 tool/param base prose from the **Oak Open Curriculum API (OCA)**
OpenAPI spec in `oaknational/oak-api`, local snapshot `packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json`;
the "bulk download" is the SAME OCA data/repo presented differently, NOT a separate source; owner-floated future
rename not adopted: "Open Resource Curriculum API" → Orca); `upstream-in-house-skills`
(2 prompts — `lesson-planning`←oak-lesson-builder, `curriculum-mapping`←oak-curriculum-mapper, in
`oaknational/oak-skills`); `external-third-party` (9 — verbatim EEF corpus items only, exempt;
the EEF file's Oak-authored framing is classified by item provenance and routes to pedagogy / this-repo,
PR #337 review fix). Locus = where the WORDS are edited, never data provenance: the `OAK_KG` attribution
wording (C009) and the generated tool-annotation blocks are authored in THIS repo (emit-index.ts), so both
are `this-repo`; the graph corpora's DATA derives from `oaknational/oak-curriculum-ontology`, documented in
report §4.1 prose. Cross-links: ADR-157 + the `data-sources-governance` thread own the DATA-source side.

**Highest-leverage content:** the orient-first directive ("call `get-curriculum-model` first") — the
per-response `OAK_CONTEXT_HINT` and codegen `DOMAIN_PREREQUISITE_GUIDANCE` restatements are since removed
(MCP-300/MCP-366). Source of truth for server
instructions is `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`.

**Confirmed defects (verified first-hand; fixable independently of any larger decision — report §8.1):**
`classNotes` teacher free-text interpolated unsanitised into the `continue-progression` prompt (PII/injection,
C196/C204); `kalan`→`Kalam` font-URL typo (C163); "Use the **this** type" typo in 3 asset tools (C507/C555/C585);
stale "lessons" wording on question `limit` params (C624); `download-asset` `idempotentHint:true` but non-idempotent
(C166); graph tools named in `SERVER_INSTRUCTIONS` but absent from `toolCategories`.

## Lane State

- **Owning plan(s):** the eval/assessment-methodology research is owned by
  [`mcp-content-assessment-methodology-research.plan.md`](../../../../plans-backlog-2026-07/effectiveness-and-impact/current/mcp-content-assessment-methodology-research.plan.md)
  (new `effectiveness-and-impact` area, owner-named 2026-07-09; plan authored + landed 2026-07-09,
  status 🟡 PLANNING — readiness reviewers assumptions-expert/mcp-expert/test-expert PENDING, owner
  directed copy-only landing). The content-workspace build plan would be authored when owner-scheduled.
- **Current objective:** visibility delivered; awaiting owner direction on next phase.
- **Blockers / low-confidence areas:** the content-workspace build is owner-gated ("further thought before we
  decide"). The `impact_tier` derivation is a conservative heuristic (any behaviour-shaping surface = high-impact;
  any flag forces high-impact) — a real review may re-tier some items.
- **Next safe step:** see below.
- **Promotion watchlist:** the content-workspace SSOT architecture is an ADR candidate; "content as a first-class
  governed surface" + "visibility before validation" are PDR/pattern candidates (see pending-graduations).
- **Follow-ups from the workspace generator's landing (fork `engraph`, PR #42, merged `7cd25a921` on
  2026-09-05; mirrored here 2026-09-06 from the lane-closed comms event, which is untracked):** for the next
  seat that touches `refresh-mcp-content-current-source-anchors` or the workspace generator — (1) a per-tier
  split of each domain page's ownership sections, or tier-specific views: the audit contract's decision 4 asks
  for the separation and leaves the stratification axis open, and the tier is on every item today
  (dispositioned on the PR's round five); (2) fold
  `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace` into the current-source refresh
  workflow so a governed content change regenerates the 25 pages in the same step (`--check` already guards
  drift in `repo-validators:check`).

## Next Safe Step

**The §Landing Target at the top of this record is the authoritative next-step list** — the PR #338
shepherd is discharged; what remains is branch-cleanup confirmation, then owner-gated stops.
Supplementary detail the list references:

- **Research execution (owner-gated).** The plan (§Owning plan(s)) is authored with owner answers
  absorbed (expert hours arrangeable; full output set; NO pilot; `effectiveness-and-impact` home).
  When cleared: dispatch PENDING reviewers → WS0 (P1 contamination quiz; P2 MCPJam expressiveness
  via the repo's `@mcpjam/cli`) → WS-V vertical slice.
- **Content-workspace build (owner-gated).** When scheduled, the report §11 design questions become
  live and MUST be carded (per `surface-user-decisions-as-questions`): the partition axis, the
  SSOT→consumer flow (generator inversion; some SSOT content is structured data that COMPOSES a
  string, e.g. `agent-support-tool-metadata.ts` → `SERVER_INSTRUCTIONS`), whether simple-config
  also relocates, and the review/eval protocol definitions. Design l10n-ready.
- The confirmed defects (report §8.1) can be fixed anytime as small independent PRs; the two typos +
  stale wording are partly upstream (OCA OpenAPI spec in `oak-api`) — fix at source, cross-repo.
