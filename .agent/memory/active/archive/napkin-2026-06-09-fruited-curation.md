---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
fitness_content_role: drainable-buffer
---

## 2026-06-09 — graph promotion + MCP-surface evaluation; a type-review miss; licence precision (Brazen Roasting Cinder, cont.)

Post-merge continuation (PR #142 → v1.17.0; on `feat/graph-migration-part-1`). Promoted
`graph-tools-value-redesign`, evaluated the 5 served MCP prompts + the served resources, captured an
MCP-surface-rationalisation strand (resources/prompts/skills) in the plan.

- **A union of two types where one is a structural subtype of the other COLLAPSES — flag it in type
  review.** Copilot caught a nit my 5-reviewer A-i/C pass missed: `EefEvidenceResult`'s success union
  `EefEvidenceEnvelope | EefEvidenceEnvelope<EefStrandHeadline>` collapses (`EefStrand` is assignable
  to the headline `Pick`), carrying no extra static info. My pass screened the familiar risks
  (casts/widening/the wrong-Zod precedent) but not the subtype-collapse axis. AND — critically assess
  the INFERENCE, not just the facts: Copilot's facts were right but its suggested nested-union fix
  collapses identically (unhelpful). Parallel-reviewer/bot redundancy catches the tail a single pass
  misses; both halves of critical assessment fire (don't dismiss the real nit; don't apply the
  unhelpful fix). Sibling of [[feedback_validate_specialist_findings_before_acting]].
- **MCP-resource single-source drift — derive-or-remove, never duplicate.** `curriculum://model` is
  the one canonical source (domain model + tool guidance + workflows + tips); `docs://oak/tools.md`,
  `workflows.md`, and `getting-started`'s Tips block DUPLICATE it verbatim and drift. Same
  derive-don't-bridge / single-source principle, applied to the resource surface. Captured in the
  plan's §A.
- **Ground a licence boundary precisely — over-caution is as wrong as over-permission.** I read
  oak-skills' "© Oak, all rights reserved" as use-prohibition and pre-excluded `oak-tone-of-voice`;
  owner corrected — the skill content is Oak's to use, the real constraint is preserving the
  external-research attribution to the same extent as the originals (each skill's
  `references/sources.md`), and tone-of-voice is open, not excluded. Read the LICENSE scope note AND
  the per-skill terms; a convenient over-restriction deserves the same suspicion as a convenient
  permission. Sibling of [[feedback_ground_convenient_claims]].
- **Surfacing real scope early lets the owner right-size.** The promotion-depth question + the
  two-strand observation let the owner reduce scope twice (full-settle → structural-promote →
  decision-complete-but-stop-at-plan) and enumerate the strands. Surface scope before over-investing.
- **Don't pile new scope onto a plan that is pending its readiness review — it conflates the review
  and grows the next session's job.** I promoted `graph-tools-value-redesign` (a plan whose whole
  pending job was review → decision-complete → execution-ready) and THEN added 10 surface items on
  top (owner-directed, but I executed it without flagging the consequence sharply enough); the owner
  spotted that the next session's readiness review now has to certify a *growing* target. Reflex:
  when scope lands on a not-yet-ready plan, immediately fence it as a separate strand AND recommend
  splitting it to its own plan so the readiness review stays on the original scope; and require
  **small-PR delivery** so "is it ready?" becomes "is each small unit ready?", never a mega-block
  judgement (no more mega-PRs; PR #142 was the last). Siblings: [[feedback_consolidate_estate_decouple_execution]],
  the small-PR/push-often cadence.

## 2026-06-09 — A-i/C deferred reviews + estate completeness (Brazen Roasting Cinder)

Ran the deferred A-i/C specialist reviews (the prior session's owner-sanctioned defer). 5 reviewers
fanned out as a workflow; every finding adjudicated FIRST-HAND against source. Verdict: the A-i/C code
is sound (D4 overlap structural, egress cast-free, answerType correct across all shapes, tests
behaviour-shaped with no type-mirrors). Landed `4f15d7df` (review-surfaced test coverage) + `747023fd`
(doc/plan accuracy fixes), both full-gate green.

- **markdown TABLE cells: a bare `|` — even inside inline-code backticks, even as TS union syntax
  `<EefStrand | EefStrandHeadline>` — breaks MD056 column-count; escape it `\|`.** My own mistake:
  fixing a mono→union type-tie inside a plan's proof-contract TABLE, the unescaped pipe split the row
  into 4 cells and markdownlint caught it on the pre-commit auto-fix pass. Sibling of the distilled
  "wrapped-line list-marker trap" — a bare markdown metacharacter at the wrong position. distilled
  candidate (markdown-gotcha family).
- **Clean 2nd instance of fan-out-for-verify / gatekeeper-for-execute** (distilled, 2026-06-09): the
  workflow's reviewers were samplers; I owned adjudication. First-hand grounding refuted TWO
  out-of-scope nits — a pre-existing tags-guard line NOT in the reviewed commit, and a "use the same
  selector in both tests" suggestion that would REDUCE coverage — and a grep confirmed a reviewer's
  exact line-attribution before editing (a discrepancy claim, the highest-risk relay class). Landed
  only verified findings; neither deferred nor dismissed. Strengthens that entry's graduation case.
- **One owner-decision surfaced (did NOT decide it)**: `graph-tools-value-redesign`'s promotion
  trigger (EEF D6+D7) has FIRED but the plan still read PARKED — landed a trigger-fired freshness
  note; promote-vs-hold is the owner's call.

## 2026-06-09 — closeout notes: pre-review feat commit + decision-authority refinement (Incandescent Smouldering Brazier)

- **The product principle's real axis is decision authority, not initiation.** First draft of
  ADR-194 forbade "pedagogical approaches unless the teacher explicitly asks" — owner corrected:
  presenting evidenced *options* (proactively or on request) is informing and is encouraged; what
  is forbidden is *making the pedagogical decision* that belongs to the teacher. The line is "who
  decides," not "who asks." A principle drafted on the wrong axis reads plausible but mis-governs;
  re-derive the axis from the owner's words, not the convenient framing. Homed in ADR-194.
- **A-i/C feat code was committed without specialist review** (code/type/test experts not invoked
  — gates + self-review + live-MCP proof only), owner-directed to defer the reviews to the next
  session. Recorded honestly in the eef thread banner + repo-continuity so the next session does
  NOT inherit it as a hidden gap. This is a deliberate owner-sanctioned deferral, not a silent skip
  — the distinction matters (`no-backfill-reviews` is the default; this is an explicit exception).
- **answerType taxonomy was constrained by the D4 overlap invariant.** The obvious taxonomy
  (single-strand vs explicit-set) would have broken `inspectStrand(id) === evidenceForMove({strandIds:[id]})`;
  the invariant-safe distinction is coverage (`strand-lookup` vs `context-subset`). A landed
  invariant in the code you're extending is a hard constraint on a new field's shape — check it
  before designing the field, not after.

## 2026-06-09 — expectTypeOf mirrors are config, not behaviour (Incandescent Smouldering Brazier)

Adding A-i/C to the EEF tool, I wrote `expectTypeOf<EefEvidenceEnvelope['answerType']>().toEqualTypeOf<EefAnswerType>()`
— copying the file's existing `strict-type-flow invariants` block by analogy. Owner challenged it:
"is using Vitest to prove type design correct?" testing-strategy.md §"Do not test types" is explicit —
*types cannot be tested; if a test only tests types, delete it.* An `expectTypeOf<Field>().toEqualTypeOf<Declared>()`
**mirrors the declaration** (configuration), and `type-check` (tsc) is the correct tool for type correctness;
vitest proves runtime behaviour. Cure: deleted ALL type-only assertions (mine + the pre-existing block it
modelled — existence-is-not-correctness), kept the runtime behaviour tests (`answerType` value per query shape;
headline projection drops deep fields), and rely on tsc for the type proof. Behaviour change: when adding a test,
check the proof against "correct tool" — types→tsc, behaviour→vitest — and never mirror a type declaration in a
test framework. Sibling of [[feedback_test_the_flag_engine_not_the_configuration]].

## Session: 2026-06-08 — napkin rotated (Ferny Ripening Meadow curation pass)

Rotated the 2026-06-06 → 2026-06-07 window during a dedicated knowledge-curation
pass. The processed window is preserved verbatim at
[`napkin-2026-06-08-ferny-curation.md`](archive/napkin-2026-06-08-ferny-curation.md).
Every behaviour-changing entry was verified live in a permanent home before
rotation; the commit and those homes are the record. Fresh capture continues
below.

## 2026-06-09 — PR review: sweep the defect class, not just the flagged line (Starless Prowling Veil, 4863ac)

### Surprise

- **Expected**: fixing the bot-flagged instance of a defect resolves it.
- **Actual**: after I fixed a stale "open decision #1" cross-reference Bugbot flagged in
  Direction A, Bugbot's next review found a **second** instance of the same bug in a
  different file (plugin-package w0) that my first pass missed.
- **Why expectation failed**: a review comment names ONE location of a defect *class*; the
  same error often recurs elsewhere the reviewer hasn't (yet) flagged.

### Correction / lesson

- When a review comment reveals a defect **class** (a stale cross-reference, a wrong
  number, a mislabel), sweep the whole corpus for the class and grep the pattern
  repo-wide — don't just patch the flagged line.
- Bot/reviewer output is dual-use: **input-to-verify** (never applied blindly) AND a
  **sampler** that surfaces a class you then exhaustively close. The critical-assessment
  reflex must catch over-escalation without sliding into dismissal — both halves matter.
- Thread resolution: cursor[bot] auto-resolves on re-review after a fix; Copilot threads
  need manual GraphQL `resolveReviewThread`. Verify 0-unresolved via **GraphQL** before
  merge (REST `/pulls/comments` does not expose resolved state). Candidate for distilled /
  a review-discipline pattern.

## 2026-06-08 — a "to be synthesised" holding pen swept in live intent (Starless Prowling Veil, 4863ac)

### Surprise

- **Expected**: `previous-materials/` was a holding pen of spent synthesis inputs,
  safe to delete once conclusions were conserved (the owner's working hypothesis).
- **Actual**: Per-file verification (a conservation fan-out + an adversarial-skeptic
  pass + first-hand checks) showed most files were **live cross-collection intent**,
  not spent. The 984-line compliance plan was a live plan (governance ADR, privacy,
  graph token-efficiency) mis-filed as a distribution input — the canary. Four more
  (the discovery Agent Skills lane, cursor-plugins, education-skills) were also live.
- **Why expectation failed**: a "relocate to synthesise" sweep silently absorbs
  adjacent-collection live intent, then the holding-pen framing presents it all as
  disposable.

### Correction / lesson

- Before deleting a "to be synthesised" holding pen, verify per-file conservation,
  separating useful-forward intent from spent working-out. **Migrate-don't-drop on
  any judgment call** — migration is cheap and reversible; deletion is the loss.
  Restore live intent to its value-home (often origin); delete only genuinely-spent
  working-out whose conclusions are conserved elsewhere.
- Second-order trap: restoring whole files re-resolves their internal sibling links,
  but deleting *some but not all* of a coherent set orphans the survivors' companion
  links (the discovery plans cited the two reports — caught on a repo-wide sweep).
- Agent/workflow output is input-to-verify: the "channels report deletion-safe"
  verdict was right in the educator-corpus frame but wrong once the discovery plans
  were restored as live; overrode it on first-hand reassessment.

## 2026-06-08 — Vining support watcher correction (Opalescent Gliding Aurora, 019ea7)

### Surprise

- **Expected**: Starting `comms watch` plus a heartbeat loop meant I was monitoring
  team messages while working.
- **Actual**: The watcher process stayed alive, but I only consumed backlog when I
  manually polled; the owner correctly observed that my monitor was not working and
  that Veil was no longer active.
- **Why expectation failed**: I confused process liveness with attended monitoring
  and let the useful-work lane sit behind a passive status surface.
- **Behaviour change**: In team sessions on Codex, treat `comms watch` as a feed to
  actively poll/read at the cadence promised; if it is not waking the session, say so,
  switch to explicit polling, and stop any background watcher before closeout rather
  than leaving misleading liveness.
- **Source plane**: operational

## 2026-06-08 — EEF go-live verified + landing-page resources fix (Galactic Drifting Twilight, 64c8e4 — cont.)

After the D7 closeout below: watched the merge → CI → semantic-release chain land **v1.16.0** and
the Vercel production deploy go READY (the EEF surface live by default in prod, owner-confirmed on
the landing page). Then found + fixed a landing-page defect on `feat/skills-planning` (009e5481,
preview verified, owner saw 8 resources).

- **To check pushed-state, resolve the upstream via `@{u}` — never hand-construct `origin/<branch>`.**
  I typed `origin/feat-graph-tooling-tidyup` (hyphen) for a branch named `feat/graph-tooling-tidyup`
  (slash) → `git merge-base --is-ancestor … origin/feat-graph-tooling-tidyup` errored (unknown
  revision) → I read the errors as false negatives and **escalated a "your push didn't land / 5
  commits unpushed" alarm to the owner before verifying**. `@{u}` showed everything was already
  pushed (HEAD == upstream == PR head). Cure: use `git rev-parse --abbrev-ref @{u}` / `@{u}...HEAD`
  for pushed-state, and never escalate a push/sync "discrepancy" to the owner until it is confirmed
  against the authoritative ref. Homed in [[feedback_check_pushed_state_via_upstream_ref]].
- **`candidate:` derive-don't-drift for multi-section listing surfaces.** The MCP landing page
  derived its prompts and tools sections from full SDK catalogues but the resources section from a
  narrow `DOCUMENTATION_RESOURCES` const → it silently under-listed (3 of 8; missing
  `eef://interpretation` + graph + model resources). Cure: a single canonical catalogue
  (`ALL_MCP_RESOURCES`) consumed by the page, plus a drift-guard test tying the listing to the
  registered surface. Reusable for any "list what's registered" UI; capture pending a second instance.
- **Foreign git lock on a non-quiescent branch — worked instance.** Committing the fix on
  `feat/skills-planning` collided with `.git/index.lock` held by the owner's terminal mid-burst
  (3 docs commits landed). Per doctrine I did NOT delete the lock or poll-loop; surfaced it, and the
  explicit-pathspec retry landed clean once the lock cleared. Reinforces never-delete-lock +
  explicit-pathspec; "sole agent" can still mean concurrent owner-terminal commits.
- **release-and-observe, closed by the owner's own eyes.** The value proof for both the EEF surface
  and the landing-page fix was the owner viewing real output (prod + preview), not a test —
  [[feedback_value_proven_by_release_not_test]] in action.

## 2026-06-08 — EEF UAT + inspector + D7 closeout (Galactic Drifting Twilight, 64c8e4)

Arc: live-exercised the EEF surface over the authenticated MCP; rewrote the MCP manual
test guide (renamed `agent-preview-test-checklist.md` → `manual-uat-guide.md`, any-server,
EEF section, discoverability); ran the whole UAT live (sections A–H) and fixed it from the
results; demonstrated the **MCP Inspector CLI** driving the local server end to end; validated
the SDK e2e suite (130 green, pre-push-gated); added `get-keywords` to the graph-tools
migration plan; filed an upstream alt-text-quality feedback doc; **marked EEF D7 complete**
(D0–D7 delivered) and authored an agent-tools `mcp-inspector-smoke` plan.

- **Owner: a "could we add X" is an exploration — never veto on absence.** I reached for "agent-tools
  has no MCP dep / single consumer / we already have an adjacent thing" as reasons NOT to add the
  inspector. All absence-based vetoes. Object on **substance** (value/risk/engineering), not on
  not-being-there-yet; new deps are allowed. Homed in [[feedback_explore_means_explore_not_veto_on_absence]].
- **Owner: value is proven by release-and-observe, NOT a codified value-proxy test.** D7's
  "value-proxy test" obligation was reshaped — engineering-complete + ship-live + a real
  LLM-mediated demonstration is the bar; delivered-value is the deferred outcome-eval plan. Homed in
  the D7 banner + [[feedback_value_proven_by_release_not_test]].
- **A peer's blind wildcard staging can sweep MY uncommitted work, not just theirs.** A parallel
  agent committed `787dc21c "fix(mcp): fixing prompt and resource registration"` that swept all my
  uncommitted MCP-app edits (guide, README, 4 comment files) under a message describing none of
  them. Nothing lost (verified verbatim) but mislabeled + entangled. Cure that held:
  **explicit-pathspec staging + `git commit -- <paths>`** kept every one of my commits clean while
  HEAD moved under me 3×. Reinforces stage-by-explicit-pathspec from the other direction.
- **"Untried/unknown" ≠ "doesn't exist", and existence-of-code ≠ verified value.** I overstated the
  e2e suite as "CI-gated, regression-grade" before validating it; ran it → 130 green, genuinely
  gated. Verify before citing in-repo existence as evidence either for OR against a move.
- **Inspector findings (grounded):** `--cli <url> --transport http --method …` works headless;
  wrap it via **pinned npx, not a dependency** (it's a heavyweight UI app); its CLI **does not
  parallelise** (batched sequential runs emptied the output files — its internal proxy); auth-on
  server → `Unauthorized`, so local exercise uses the no-auth dev server (`PORT` override boots a
  second instance on :3334).
- **Live UAT found two real product gaps (homed, not fixed here):** bulk tools overflow the MCP host
  token cap (`get-keywords` ~205 KB, graph tools ~1.5 MB+) → added `get-keywords` to
  `graph-tools-value-redesign` ("a list is a simple DAG"); auto-generated quiz-image `alt` text is
  broken (repetition/hallucination/function-blind) → upstream feedback doc with reproducible examples.

**Metacognition (closeout):** the session's manual work (UAT + inspector round trip) WAS the D7
value-proxy, executed by hand — which is exactly why the owner's "release, don't test" reshape
lands: a real LLM did the round trip, so potential value is shown; codifying it as a synthetic test
would prove less. Marking D7 complete was an action with bridges (fires the graph-tools promotion
trigger, opens the merge), not a status tick.

## 2026-06-08 — continuity-surface consolidation (Cosmic Illuminating Planet)

Dedicated curation session (this one). Curated the four critical thread records (`eef`,
`agentic-engineering-enhancements`, `observability`, `connecting-oak`) to their pickup
function per `continuity-practice.md` §Disposition — conserving each live pickup + the
additive identity trail + un-homed insight (e.g. Briny's "decisions held in my context"),
deleting homed/superseded session narrative (git retains the literal record). Also reflowed
`agent-collaboration-research` (live research spec, just over-wide) and de-drifted the
`repo-professionalism` opener.

- **The disposition doctrine works per-content-block, not per-file.** The clean question is
  "what is the state of the work this block describes?" — live → verbatim; finished → conserve
  to its home, verify, delete. The identity table is durable content (not residue); the
  session *narrative* is the residue.
- **Critical-zone post-mortem (ADR-144):** the records flagged critical because fitness was
  only just wired onto continuity surfaces (Lofty, 2026-06-08) — detection surfaced
  *accumulated* debt, not a new failure. Limits are function-derived and correct; the content
  was wrong-shaped (append-logs, not pickup surfaces).
- **Identity-trail rule that emerged:** active thread with a coherent arc (`eef`) → keep the
  full trail (the session_id_prefixes live only there); large or paused threads → keep the
  recent stretch + a git/ledger pointer (git is the doctrine's own retention mechanism).
- **`pending-graduations` is a drainable buffer, NOT a continuity surface** (the §Disposition
  scope is `repo-continuity` + thread records only). Its ~25 `status: graduated` tombstones
  violate `no-provenance-pointers` and should leave cleanly — but that is a dedicated
  register-drain, not part of the continuity-surface focus. Its owner-gated backlog legitimately
  stays per its `lifecycle_model`.
- **Proportionality on width (owner: "fitness is a signal not a goal"):** most small-record
  over-width lines are link/URL-dominated (the checker discounts them) or barely-over prose;
  micro-rewrapping 104→100 is the number-chasing to avoid. Fixed only genuine readability/drift
  defects.

**Metacognition (closeout, ultrathink):**

- **The correction reflex fired post-commit, not pre-commit — a live instance of
  "corrections are high-risk re-instantiation, no immunity gradient" (PDR-089 §Decision 6).** I
  had just READ that register entry, then committed before→after line counts in the commit
  message + repo-continuity + this napkin — the exact `no-provenance-pointers` violation, in the
  surfaces I was curating *per that doctrine*. A self-check caught it; I amended (unpushed).
  Reading the lesson did not fire the reflex — a deliberate post-hoc scan did (textbook
  `passive-guidance-loses-to-artefact-gravity`). Behaviour change: when curating per a doctrine,
  run that doctrine's own check over my OWN commit message + continuity edits *before* committing.
  `candidate:` the `no-moving-targets` write-time hook did NOT catch the count-citations in
  repo-continuity / napkin / the commit message — verify whether it covers those surfaces; if not,
  that is a gap for the next register-drain to assess.
- **Held the surface-class distinction loosely under a transient owner answer.** The register is a
  drainable buffer (a curator-pass surface), categorically NOT a continuity surface; the plan said
  "don't force-drain" it. An interim "drain now" answer pulled me into execution-deliberation
  (full-vs-partial, read-cost, Write-vs-Edit) before the owner reconsidered: "normal processing →
  next session" — which validated the plan's original stance. Behaviour change: hold the
  surface-class distinction firmly; a buffer-drain is a dedicated effort even when picked "now", not
  something to cram into a continuity-surface session's tail.
- **The disposition doctrine was the session's generator AND graduated in the same session** —
  captured by Lofty, exercised then lifted to PDR-011 by this pass. A good doctrine *produces*
  correct moves (keep/delete, which identity rows survive), not merely filters them; the
  capture→enforce loop closed in one session.

## 2026-06-08 — PR #131 Sonar + cross-repo boundary correction (Stormbound Streaming Zephyr)

**Landed (PR #131, branch `feat/graph-tooling-tidyup`, all UNPUSHED):** `76f5855d`
typedoc devDep (unblocks a pre-existing knip failure: oak-sdk-codegen used the
`typedoc` binary undeclared); `072375e1` 22 SonarCloud new-code fixes (agent-tools +
graph-corpus-sdk S7770); `bebca689` EEF `get-eef-evidence` gated at registration;
`e6cd45eb` continuity checkpoint. Sonar PR #131 dispositions via MCP: 2× S4036 PATH
hotspots REVIEWED/SAFE; S4323 (subjects enum inlined 8× in generated SDK types)
ACCEPTED and tracked upstream.

**Correction — never write to a sibling workspace repo without authorisation.** I
created + committed a feature-request doc in the **`oak-openapi`** repo (`02ff619`)
unprompted. Owner caught it; reverted with `git reset --hard` (unpushed, zero trace
on origin). oak-openapi is a separate owned repo: this repo records upstream requests
and hands them over; it must not edit oak-openapi. `candidate:` an explicit rule for
the multi-repo workspace boundary (respect-active-agent-claims covers intra-repo; the
cross-repo authorisation scope is the gap).

**Correction — "a fresh document" means a new discoverable home, not a buried insert.**
I first stuck the upstream request as item E4 in the middle of the historic
`ooc-api-wishlist` pack ("where it will never be found"). Owner: archive the whole
folder, create a new folder + fresh doc. Done — `ooc-api-wishlist/` → `archive/`;
new `sector-engagement/upstream-api-feature-requests/README.md` (item 1 = reusable
enum `$ref` components), registered in `sector-engagement/README.md`.

## 2026-06-08 — EEF type boundary → ADR-193 + the egress membrane (Evergreen Blossoming Copse)

**Decision landed.** The strict-types-vs-MCP-vendor question resolved into
[ADR-193](../../../docs/architecture/architectural-decisions/193-system-vendor-type-boundary-membrane.md)
(system↔vendor type boundary): strict domain types hold from the `as const` corpus
to a per-primitive egress function; the vendor's `Record<string, unknown>` is the
external contract at the membrane, never in domain code. EEF tool egress
(`eefEvidenceToCallToolResult`) built + green. Committed `496ea7ca` (egress) +
`83d791e8` (ADR-193).

**Surprise — the membrane sits lower than the vendor call.** Expected to thread
strict types through executor/auth/registration to `registerTool` (a generic spine).
Actual: executor/auth/registration are vendor-facing TRANSPORT (auth errors ARE
`CallToolResult`), so the membrane is the domain→transport seam — one egress function,
no spine refactor, no union-dispatch problem. The clean shape was hidden ~1.5 days
because every prior attempt anchored on preserve-to-wire (impossible) or generic-spine
(complex).

**Correction-pattern (5 owner corrections → one root).** I repeatedly reached for a
general-codebase reflex where this repo demands maximal architectural rigour:
proof-at-construction-is-enough → scope-the-lint-rule → adapter-around-the-vendor →
index-sig fallback → solve-the-instance-not-the-boundary. Root: the LTAE lens must be
the PRIMARY GENERATOR of moves, not a post-hoc filter; the incoming validation
boundary (ADR-032) has a symmetric OUTGOING egress mirror I kept missing; and when I
NAME a lever ("the SDK version is in our power"), PULL it — don't park it. A
convenient *interpretation* deserves the same suspicion as a convenient *fact*.

**Grounded knowledge (the next agent re-derives otherwise):**

- **dist-gotcha:** `oak-curriculum-sdk` type-checks `graph-corpus-sdk` via built
  `dist`; focused cross-package type-checks are STALE until
  `pnpm --filter @oaknational/graph-corpus-sdk build`. This masked the vendor-carrier
  wall until I rebuilt.
- SDK 1.29.0 (latest): `ToolCallback` hard-codes `CallToolResult`; `outputSchema` is
  NOT tied to the callback return type (runtime-validated only, `mcp.js:200-201`).
- The spread `{ ...env }` is `Record`-assignable (fresh object); a clean named
  interface is not; a generic `<T extends object>` spread is not — egress is
  per-concrete-type.
- Three under-described safety commits (`2cd529b5`, `496ea7ca` "chore: safety commit",
  `83d791e8` "--amend" — a mangled message) carry EEF work mixed with peer/other-thread
  content; decoded in `threads/eef.next-session.md`.

**Closeout learnings (handoff):**

- **`--no-verify` is OFF (owner directive, this session).** The remaining EEF commits
  must land GREEN — gating (c6) clears the only red (app e2e parity); do not reach for
  `--no-verify`.
- **The agentic hook blocks the *agent's* `git commit --no-verify` even with in-chat
  owner authorisation** — the owner must run the commit (or `! <command>`). In-chat
  authorisation is necessary but the hook still intercepts the agent's invocation.
- **Staging a file that holds another agent's uncommitted work sweeps it.** My
  `napkin.md` carried Ferny's rotation entangled with my entry in one file, so it rode
  into `1917f0ea`; explicit pathspec protects against staging the *wrong files*, not
  against multiple agents' edits *within one file*. The rotated-out window is recoverable
  from `496ea7ca`; its archive `archive/napkin-2026-06-08-ferny-curation.md` is untracked
  (dangling link in the committed napkin).
- **Uncommitted doc-polish carried into the handoff (this turn):** the
  `repo-continuity.md` Current-State EEF bullet (re-pointed from the dead carrier-fix to
  ADR-193) and this napkin addendum are UNCOMMITTED (gate red, `--no-verify` off). The
  next session should stage them into its first GREEN commit (after gating).

**Over-generalisation correction (Lofty Spiralling Plume, 2026-06-08):**

- **Expected:** owner rejecting "archive/rotate" as the disposition for continuity
  surfaces meant the archive apparatus + `/archive/` fitness exclusion were wrong.
  **Actual:** owner scoped it — the strategy was unsuitable *for continuity surfaces
  only*; the apparatus is fine. **Why it failed:** I escalated a surface-scoped note
  correction into a system-wide condemnation (doctrine-by-analogy: "big systemic cure"
  when the situation was "narrow surface note"). I had written a blanket "archiving is
  not knowledge preservation" into `continuity-practice.md` §Disposition and was about to
  propose flipping the checker's `/archive/` exclusion. **Behaviour change:** when an
  owner rejects a strategy for a named surface type, scope the correction to that surface
  type; the fitness checker only *surfaces signals*, agents act — strategy notes are
  guidance for the agent, not apparatus law. Cure landed: §Disposition re-scoped to
  continuity surfaces; no fitness-system code touched.

- **Follow-on (same session): classify by intended function, not current stats.** Asked
  to "find balance" for thread-record fitness limits, I curve-fit the numbers to the
  current file-size distribution — which bakes existing bloat into the "healthy" band and
  drifts as the corpus drifts. Owner: "classify by intended function, not current stats."
  The limit is a property of the surface's *function class* (a thread-continuation record =
  compact pickup surface: identity + current state + landing target + standing decisions +
  the latest still-live handoff banner), derived from what that function should occupy, set
  once, independent of today's sizes. The bloated full-log records are function violations,
  not large healthy threads — they *should* trip the signal. Behaviour change: derive
  fitness thresholds from the documented function of the surface; never reverse-engineer
  them from the measured corpus. Use the apparatus's own function vocabulary
  (`fitness_content_role`) to make the classification explicit.

## 2026-06-08 — pending-graduations drain + precedence-is-not-approval (Coppery Crackling Crucible)

- **I treated a prior agent's annotation as owner approval — the worked instance behind
  PDR-091.** Draining graduated tombstones, I correctly verified every `graduated` item's home
  first-hand before removal (the label was a routing prompt, not authority). But on the one
  `status: duplicate` item annotated "withdraw-ready, owner holding", I LEFT it — treating that
  prior-agent annotation as a live owner gate, when the verification it carried had already
  settled it. The owner asked "why would we want a duplicate?" and stated the requirement
  *Precedence is NOT approval*. Behaviour change now homed in
  [PDR-091](../../practice-core/decision-records/PDR-091-precedence-is-not-approval.md) + the
  always-applied rule: a prior decision/annotation/label is a prompt to re-derive, never a
  warrant; locate the live approving authority (owner, or the proving surface) and check it.
- **Two parallel agents on one tree with no registered claims → collision invisible until the
  shared gate caught it.** My commit was blocked three times by Briny's in-flight EEF c4/c5 work
  (knip → `Object.values` lint → import-unresolved lint) because the full-tree pre-commit gate
  runs over the whole working tree. Neither session had registered an active claim, so the
  parallel work was invisible until the gate failed; the owner relayed between us. Not new
  doctrine — it's the existing `register-active-areas-at-session-open` / `git:index/head`
  claim discipline that both sessions skipped. The owner-relay was the stopgap a registered
  area/commit-window claim would have removed (per `feedback_owner_action_is_not_a_cure`).
- **The right move under repeated transient-red collisions is to HOLD, not thrash the gate.** I
  stopped re-attempting on each transient red and handed coordination back via a green-ping ask;
  both commits landed once Briny's tree greened. Re-attempting per-red is wasted ~34s cycles and
  noise.

## 2026-06-08 — external-facing skills relocation + plugin-bundle synthesis seed (Zephyrous Buffeting Falcon)

Reviewed `oak-skills` + the discovery skills docs; web-researched Claude/Codex plugin packaging;
relocated the external-facing skills/plugin/MCP-skill-like materials into
`user-experience/educator-end-users/{,previous-materials/}` with a seed review report (`6101a946`);
cross-linked the EEF↔oak-skills upstream request and corrected a stale "flag-gated OFF" line (EEF is
now default-ON in-repo, `d3109d7c`). The domain finding (plugins are the cross-vendor bundling layer;
Codex plugins = the OpenAI equivalent) is homed in the report +
`[[project_external_facing_skills_synthesis_seeded]]`, not here.

- **Explicit-pathspec commit excludes already-staged FOREIGN content, not just unstaged wrong
  files.** A prior session's `pending-graduations.md` sat STAGED in the shared index; `git commit --
  <my paths>` committed only my paths and left it untouched — no unstage needed. This sharpens
  `stage-by-explicit-pathspec`: the pathspec on `git commit` is the protection when foreign content
  is already in the index — and `git restore`/`git reset` are hook-blocked as worktree-destruction
  anyway, so a forward pathspec-commit is the move, never an unstage.
- **Same parallel-collision dynamics Coppery logged above** — HEAD moved under me twice mid-session
  (parallel sessions committed EEF + upstream-feature-requests); my pathspec commits stayed clean.
  Cure remains the registered area/commit-window claim both sessions skipped
  (`feedback_owner_action_is_not_a_cure`); not re-captured.
- **Repo markdownlint enforces MD049 asterisk emphasis** (`*x*`, not `_x_`); the linter
  auto-normalises the working tree, but a file staged BEFORE normalisation fails the hook — re-stage
  after the linter touches it.
- **Authored the external-facing-capability synthesis plan** (`current/external-facing-capability-distribution.plan.md`,
  `fccc8607`) — executable, consolidates our scattered external-facing skills/plugin/MCP plan docs
  into one coherent set; `assumptions-expert` reviewed the prior draft (validated facts; flagged the
  7-vs-6 skill count → now `t1`).
- **Altitude correction (owner-directed, "good catch").** Asked to "plan the next steps", I first
  planned the downstream PRODUCT (a `future/` Oak-plugin-bundle strategy) and baked "extend
  oak-skills' generator" in as the load-bearing thesis. Owner reframed: the executable next step is
  synthesising OUR plan estate into a coherent set (`current/`, no blocking dep), and "do not assume
  the external skills repo remains the source of truth." Homed in
  `[[feedback_surface_altitude_before_planning]]`: surface the altitude fork before drafting; keep
  open decisions named, never baked as a thesis. A reviewer validated my facts but cannot catch a
  wrong altitude — frame is the owner's.
