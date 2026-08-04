---
id: upstream-update-lane-completion
node_type: delivery
name: "Upstream update lane — both PRs to validated and merged"
overview: "Complete the upstream update lane through the release window: drive the MCP-462 spec-alignment PR (#735) through Matt's validation to a full-condition merge, then build and land the MCP-463 bulk work (ADR-222 interim template truing, owner-co-designed, plus the untracked-data freshness check) to the same bar. The lane is the only moving lane during Matt's clear run; the executing seat continues across a compaction boundary and this node is its resume map."
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-08-03
ratified_where: >-
  In-session AskUserQuestion card at the Birch holds Seedling seat
  (e48fe2), 2026-08-03 ~11:05Z, in the four-answer batch that also set
  the phase-2 build-now-land-post-release shape, the agent-run UAT, and
  the interleaved residue sequencing.
serves: first-major-release
impact_areas:
  - served-surface
  - practice-and-estate
tickets:
  - MCP-462
  - MCP-463
depends_on: []
owner_gates: []
# The truing co-design gate was CLEARED by owner word 2026-08-03 ~11:00Z
# ("clear all wait for owner legs now, I don't want to be blocking on any
# of this work from this moment on") — the lane executes autonomously
# under the estate's own review machinery; ADR-222's authority ordering
# still governs the HOW.
last_updated: 2026-08-03
---

# Upstream update lane — completion

> **State at the 2026-08-03 ~17:00Z boundary (second compaction).** The
> lane is no longer the only moving work: a deployment-reliability
> programme opened out of two same-day outages and now carries four
> sibling delivery nodes (`deploy-config-fails-the-build`,
> `release-redeploy-recovery`, `boot-failure-observability`,
> `production-liveness-detection`; tickets MCP-475/479/480/481, PR
> #746). Lane state: #735 has Matt's code-owner review with TWO REAL
> generator findings to cure at the generator (`maximum: 300` dropped
> from the MCP input boundary; `oakUrl` advertised on keyword responses
> the runtime cannot decorate), its preview is healthy and
> boot-verified, and the merge gate is now exhaustive preview
> validation rather than Matt's approval (owner word). MCP-463 is built
> by the pair seat and waits on #735 merging. Monitors and crons all
> stopped at owner word; re-arm on resume. The napkin's 2026-08-03
> ~17:00Z entry is the full boundary record.

The executing seat is Birch holds Seedling (e48fe2), claude-code /
claude-fable-5, lane claim `186e6899` (retained through the compaction
boundary), session home worktree
`.claude/worktrees/upstream-spec-probe` (branch
`jimcresswell/upstream-spec-probe`). The fleet is quiesced for Matt's
clear run; the Director is dark; blockers card the owner directly. Owner
questions go via AskUserQuestion cards. Solo-session monitor posture:
no heartbeat (consumer-absent exemption) and no comms watcher needed
until a second seat returns; re-arm both on any fleet resumption.

## Step 1 — drive PR #735 (MCP-462, spec alignment) to merged

State at the boundary: draft PR
<https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/735>,
head `bcdc62373`, base main, bot-authored, 52 files. Matt (`mantagen`)
is assignee AND requested reviewer; Copilot review requested (both
verified on the REST `requested_reviewers` surface). MCP-462 is In
Progress with the PR attached. The body carries the beginner-explicit
validation walkthrough (Vercel preview → host connect → UAT runbook
smoke subset → three PR-specific checks).

The drive, in order:

0. RUN THE UAT MYSELF (owner card 2026-08-03: "I run it now + Matt
   reviews"): once the Vercel preview builds, connect a host to
   `{preview-origin}/mcp` (Clerk OAuth; if agent OAuth is blocked that
   is a blocker to card the owner), execute the runbook's smoke subset
   (`apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md`,
   record template) plus the three PR-specific checks (keywords paging
   note + behaviour; lessons per-unit wording; keyword-graph pair), and
   POST THE RESULTS ON #735 so Matt reviews with evidence in front of
   him. His code-owner approval remains the merge gate.
1. Watch for and adjudicate review feedback: Copilot's findings
   (including the SUPPRESSED comment block — it has carried real
   findings 7-of-7 in recent estate history), Matt's review, and the
   UAT results he or his agent posts. Root-cause-first triage; batch
   cures into one push per adjudicated round (PDR-132 two-round
   budget); re-fetch every surface after every push. The pre-open
   gateway reviews (code-expert, test-expert, docs-adr-expert, all
   cured) do not count against PR rounds.
2. Checks to green: the repo's full-condition set is derived from the
   rulesets API per name (CodeQL, SonarCloud, run-quality-gates,
   Vercel), read per-name, never column-parsed. The Vercel check also
   yields the preview origin Matt's validation needs.
3. SUPERSEDED (owner word 2026-08-03 ~16:1xZ): "I don't think we
   should block 735 on Matt, but we should test the hell out of that
   preview to prove that a merge will not result in Matt being
   blocked." Matt's approval is NO LONGER the merge gate; the gate is
   exhaustive preview-hosted validation (the runbook's FULL MATRIX
   against the live preview, evidence on the PR). Matt reviews on his
   own clock, welcome but not blocking. Un-draft when the full-matrix
   evidence is posted.
4. Merge at FULL condition: every check green on the cured head, every
   thread resolved, Matt's approval present, AND the owner's gate
   refinement satisfied (mid-turn word 2026-08-03: "Landing the PRs is
   gated on the validation and the skill creation" — the UAT validation
   evidence posted and the two upstream-update skills landed) — then a
   REST merge (merge commit, NEVER squash) under a minted bot token
   (`pnpm --silent agent-tools merge-bot mint-token --scope
   pull-request-work 2>/dev/null`, assign-then-use; export GH_TOKEN and
   single-quote any credential-helper string so `$GH_TOKEN` expands at
   helper-execution time, not composition time). Verify the merge SHA
   on main first-hand.
5. After merge: MCP-462 → Done; comment the merge SHA on the ticket.

## Step 2 — build and land the MCP-463 PR (bulk surface)

Two halves, one ticket; two small single-story PRs are sanctioned if
the diff grows (agreed at activation).

**Half A — ADR-222 phase-1 interim truing (owner gates CLEARED
2026-08-03 ~11:00Z — execute autonomously; gateway reviewers replace the
co-design pass).** True the hand-written Zod bulk templates
(`packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/schema-templates.ts` +
`-part2.ts` + `-part3.ts`) against upstream's published bulk JSON
Schema. The comparison source is the schema shipped IN the fresh bulk
bundle (verified identical to upstream's source): the probe worktree
holds the fresh data at `apps/oak-search-cli/bulk-downloads/`
(gitignored data + tracked `manifest.json`, downloadedAt
2026-08-03T08:50:47Z). Authority ordering is constitutive (ADR-222): a
data-vs-schema mismatch is an UPSTREAM BUG REPORT (Linear, MCP OKR
project, plain language, agent-driven marker — the MCP-464 precedent),
never validation-loosening; local validation may be deliberately
stricter. The subjects list stays hardcoded pre-submission (confirmed
correct, 32 match); post-submission it reads from the schema. The
worktree's dirty `apps/oak-search-cli/ground-truths/generated/*` files
are this half's regen companions — adjudicate them into the PR
deliberately.

**Half B — the untracked-data freshness contract (agent-designable,
presented with Half A).** Owner requirement ("we need to handle that
case in future"): bulk data is downloaded per-checkout and untracked,
so checkouts silently diverge in data vintage (worked instance
2026-08-03: June data on the principal, August in worktrees). Design: a
staleness check surfacing `manifest.json`'s `downloadedAt` wherever
consumers read bulk data (ingest, ground-truth generation), failing
loud past a named age or on manifest absence — mechanism-shaped,
red-first TDD, no type changes.

Both halves: ticket already minted (MCP-463, Matt-tagged, blast-radius
and the owner's personal note carried); PR(s) bot-authored from a
branch cut off origin/main AFTER #735 merges (sequencing: the truing
builds on the merged spec alignment); Copilot at open; gateway
code-expert + test-expert (Opus) pre-merge; full-condition merge as
Step 1.4; then MCP-463 → Done and the lane claim closes.

## Standing constraints (carried verbatim across the boundary)

- ALL owner-wait legs CLEARED (owner word 2026-08-03 ~11:00Z: "clear
  all wait for owner legs now, I don't want to be blocking on any of
  this work from this moment on"). The earlier type-walkthrough
  contract is lifted for this lane's remaining work; the lane
  adjudicates type questions itself under the estate's doctrine and
  gateway reviewers. The KeywordsResponseSchema promotion question is
  now lane-adjudicable if it arises.
- Still SEQUENCED post-release by their own rationale (the release
  window's foundational-mechanism stability, ADR-222's phasing — NOT
  an owner-wait): ADR-222 phase-2 full derivation; the invoker-level
  next-page signal (the pagination P1 on the upstream-api-alignment
  thread).
- Matt-priority: nothing this lane does churns Matt's surfaces without
  his visibility; he is tagged on every ticket and PR.
- Pacing: slow, deliberate, serial. Priority means importance, never
  speed.
- Fleet surfaces (napkin, thread records, this plan) are edited on the
  PRIMARY checkout only — the worktree's copies are pre-fold stale and
  a worktree-side edit would stale-capture-revert the fold at merge.

## Step 3 — build-now, land-post-release (owner card 2026-08-03)

Owner answer at the boundary card: ADR-222 phase 2 (the bulk contract
fully DERIVED from upstream's published JSON Schema) and the
invoker-level next-page signal are BUILT NOW behind the interim
mechanism and MERGE ONLY at release completion — stability held, no
idle waiting. Develop both on their own branches (generation-fidelity
questions: JSON-Schema draft semantics, $defs composition, constraint
preservation in Zod; the next-page signal is ADR-shaped — author the
ADR with the design). Neither lands in-window.

## Interleaved owned steps (owner card: interleave, not after)

Worked in the gaps while reviews/checks run, each a named deliverable:

1. The two upstream-update SKILLS the owner asked for (~10:45Z note):
   distil the sdk-codegen README §Responding to Upstream Spec Changes
   runbook + this lane's worked instances into
   `update-upstream-api-spec` and `update-bulk-download-schema` skills
   (canonical + adapters, skill-naming rules, evals per the
   skills-SSOT-with-evals ruling). PROMOTED TO MERGE GATE by owner word
   2026-08-03 (mid-turn): "Landing the PRs is gated on the validation
   and the skill creation" — no lane PR merges before these skills land.
2. The sentinel-taxonomy clause into testing-strategy §Prove-behaviour
   (the ratified discriminator: a literal content pin is admissible
   only as a designed sentinel carrying a named decision) via the
   new-rule-vs-pdr-clause process.
3. The rendered-wholes frozen-at date line — fixed at its GENERATOR
   (never a hand edit of the artefact), audit-lane surface.
4. The KeywordsResponseSchema promotion question — now
   lane-adjudicable: investigate whether any consumer hand-duplicates
   the newly named generated schema; consolidate per schema-first if
   so; record the no-op if not.
5. The submission-review plan's MCP-441 premise truing (done at the
   boundary if context allowed, else first interleave).
6. The keywords-finer-grained-control backlog item: DISPOSED BY RECORD
   (bounding half delivered upstream — MCP-464 + ADR-222 carry it;
   ranking half still open upstream); the conserved backlog file is
   append-never, so the record lives here and in MCP-464.

## Acceptance

Both PRs merged to main at full condition with Matt's approval; MCP-462
and MCP-463 Done with merge SHAs recorded; no validation loosened
anywhere; the wait-for-owner legs still untouched; the
upstream-api-alignment thread record updated with the completion state.
