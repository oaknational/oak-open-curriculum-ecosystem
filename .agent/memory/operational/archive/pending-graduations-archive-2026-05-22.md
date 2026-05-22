---
archive_kind: pending-graduations-snapshot
archived_on: 2026-05-22
archived_by: consolidation pass via /jc-consolidate-docs
archive_reason: 'pending-graduations.md CRITICAL fitness zone; 13 graduated-status entries with completed audit trails rotated to dated snapshot per the 2026-05-06 / 2026-05-10 precedent and the file split_strategy.'
window_covered: '2026-05-05 → 2026-05-20 (entries graduated during that window)'
---

# Pending-Graduations Archive — 2026-05-22 Drain

This archive holds the bodies of 13 graduated pending-graduations
entries that were retained inline as audit trail prior to the
2026-05-22 consolidation pass. The live register at
[`../pending-graduations.md`](../pending-graduations.md) replaces
each archived entry with a one-line graduated-pointer naming the
target home and the archive location.

The graduations log tables at the head of `pending-graduations.md`
remain the canonical index of which entry graduated to which target.

## Entries

### 2026-05-17 — `pnpm check` cleanliness gate in session-handoff (skill-amend)

`[captured: 2026-05-17 | source: distilled.md §"Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade" §"pnpm check cleanliness gate belongs in session-handoff" | target: skill-amend:session-handoff | trigger: owner-direction-already-fired-2026-05-14 | size: S | status: graduated]`

`[graduated 2026-05-17: Swift Winging Gust consolidation pass added new step 11 "Verify the pnpm check cleanliness gate" to .agent/skills/session-handoff/SKILL-CANONICAL.md between the consolidation escalation step and the boundary-clean step; previous step 11 renumbered to 12]`

Substance: owner stated standing 2026-05-14 (recorded in archived
napkin `napkin-2026-05-14.md`): session-handoff cannot be considered
complete in the individual-contributor or handoff-owner sense unless
`pnpm check` completes with no errors or warnings. The 2026-05-15
session committed `da2a4aac` with `pnpm check` red on pre-existing
knip findings, framing them as "out-of-scope" — owner-corrected as
foundational-rule violation per the all-quality-gates-blocking
standing rule. Structural cure: the session-handoff skill should
include a `pnpm check` cleanliness step that the agent walks before
declaring handoff complete (paired with the existing all-quality-
gates-blocking standing rule). Owner-direction trigger has fired;
this entry is `status: graduated`; retained only as audit trail until archive.

---

### 2026-05-17 — Hook-bypass equivalence in `--no-verify` rule (rule-amend)

`[captured: 2026-05-17 | source: distilled.md §"Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade" §"Hook-bypass equivalence" | target: rule-amend:no-verify-requires-fresh-authorisation | trigger: owner-direction-already-fired-2026-05-14 | size: S | status: graduated]`

`[graduated 2026-05-15 (verified 2026-05-17): the rule body of .agent/rules/no-verify-requires-fresh-authorisation.md was extended at commit da2a4aac (Luminous Waxing Twilight session) to enumerate the full hook-bypass equivalence class — --no-verify/-n, --no-pre-commit, --no-commit-msg, --no-post-commit, --no-gpg-sign, --no-edit when bypassing a hook, HUSKY=0, SKIP_HOOKS=1, LEFTHOOK=0, env-var skips, git -c core.hooksPath=/dev/null, GIT_HOOKS_PATH override, deleting/renaming/chmod-ing .husky/ or .git/hooks/, any future equivalent. Substance landed before the pending-graduation entry was captured; entry was stale on creation. Verified by Swift Winging Gust 2026-05-17 consolidation pass.]`

Substance: the repo-wide invariant
[`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md)
currently centres on the `--no-verify` flag. The 2026-05-14 incident
(committed `16590083` via `git -c core.hooksPath=/dev/null commit`
after the repo hook policy blocked `git commit --no-verify`) showed
the rule must extend to **any** mechanism that skips hooks:
`core.hooksPath=/dev/null`, `GIT_HOOKS_PATH` override, `.husky/`
deletion, `--no-gpg-sign` when gpg-sign is a hook, any future
equivalent. Fresh per-commit owner authorisation binds to the *act*
of skipping, not the *syntax*. Owner-correction on the day fired the
trigger. Routing: graduated before this pass; the rule already enumerates the hook-bypass
equivalence class. Retained only as audit trail until archive.

---

### 2026-05-14 — Agents default to no gender unless self-declared (second-instance evidence)

`[captured: 2026-05-14 | graduated: 2026-05-21 | source: distilled.md §"Recently Distilled — 2026-05-14 Verdant Swaying Glade conduct correction" | target-resolved: rule:agents-default-no-gender + PDR-061 | trigger-fired: second-instance-fired-2026-05-14 | size: S | status: graduated]`

Substance: when referring to another agent, default to **they/them**;
gendered pronouns require self-declaration. Agent names are evocative
phrase-pairs with no inherent gender. Recurrence evidence: 2026-05-11
correction about Smouldering Crackling Pyre (in
`napkin-2026-05-12.md` line 319, never graduated to active distilled);
2026-05-14 correction about a Verdant Swaying Glade conversation
partner. Per-user memory entry "Agents default to no gender" exists at
Claude per-user level but not at cross-platform repo level — Codex and
Cursor agents working in this repo do not read that surface and would
re-derive the rule via correction.

**Function-test verdict (per the 2026-05-14 metacognition correction)**:

- **Rule-shape** (primary): always-applied behavioural cure that fires
  at every chat/comms/commit output. Permanent home: new rule
  `.agent/rules/agents-default-no-gender.md` + Claude/Cursor
  forwarders + `RULES_INDEX.md` entry.
- **PDR-shape** (companion): Practice-portable doctrine about
  agents-as-genderless-by-default. Adopter scope: any Practice-bearing
  repo with multi-agent work. Could ratify the doctrine separately
  from the rule, or be deferred until a second adopter repo emerges.

Graduated 2026-05-21: always-applied rule `.agent/rules/agents-default-no-gender.md`
plus Claude and Cursor adapters, RULES_INDEX entry, and PDR-061. The
companion conduct-correction graduation discipline also lives in PDR-061.

---

### 2026-05-14 — Conduct-rule graduation discipline (PDR-shaped meta)

`[captured: 2026-05-14 | graduated: 2026-05-21 | source: distilled.md conduct-correction entry | target-resolved: PDR-061 | trigger-fired: companion-to-agents-default-no-gender | size: S | status: graduated]`

Meta-substance: corrections about personal conduct (style, register,
phrasing, attribution) graduate to **active distilled.md in the same
session**, not via the pending-graduations queue. Rationale: a
session-scoped napkin entry archives the lesson but leaves the rule
unenforced for new sessions during the rotation gap. The
2026-05-11 → 2026-05-14 gender-rule recurrence is the worked example —
the lesson was captured in the napkin but did not reach active
distilled until the second correction fired. Companion discipline to
the existing "Substance > Destination" rule. Graduated 2026-05-21 into PDR-061 alongside the agent pronoun default rule.
The pending-graduations register is no longer the only live carrier.

---

### 2026-05-14 — Repo-continuity Active Threads identity column structural refactor (fitness-loop signal)

`[captured: 2026-05-14 | source: consolidation step 9 critical-zone post-mortem (Riverine Swimming Hull) | target: structural-refactor:repo-continuity-active-threads-column | trigger: owner-direction-or-second-critical-zone-pass | size: M | status: graduated]`

`[graduated 2026-05-17 (Swift Winging Gust): owner-direction trigger fired — full structural pass approved. Refactored the Latest identity column in .agent/memory/operational/repo-continuity.md § Active Threads to compact form (agent_name / platform / model / session_id_prefix / last_session) per PDR-027. Removed accumulated per-session narrative paragraphs (Floating Lifting Thermal, Feathered Darting Kite, Fronded Foraging Moss, Luminous Threading Asteroid identity-refresh notes) — their substance lives in the threads/<slug>.next-session.md records as the doctrinal home. Added compact-identity rule footnote citing PDR-027 below the table.]`

Substance: the `repo-continuity.md § Active Threads` table's
identity column has accumulated per-session detail that already
lives in the thread record's `Participating Agent Identities`
table. The repo-level summary has grown to multiple paragraphs per
active thread; the file's 829 lines / 65 706 chars are over the
critical threshold (787 / 52 500). Proposed structural cure: prune
the identity column to "Latest identity / last_session date"
summary (one short line per thread), with per-session context fully
routed to the thread record. This is the missing-graduation cure
per ADR-144 §Loop Health Q3 for the repo-continuity critical zone.
Trigger: owner direction OR a second consolidation pass that finds
repo-continuity in critical zone. Owner decides at next consolidation.

---

### 2026-05-05 — Agent tooling friction is first-class user feedback (standing direction)

`[captured: 2026-05-14 | source: comms-log (event 9a249c-tooling-feedback-standing-note, 2026-05-05) | target: pdr:tooling-friction-is-user-feedback | trigger: owner-direction | size: S-to-M | status: graduated]`

`[flipped pending→due: 2026-05-14 (Riverine Swimming Hull, Batch A of graduation-triage-disposition-2026-05-14 plan); owner-direction trigger is the standing direction itself, fired this session; owner selects graduation shape before amendment lands]`

`[graduated 2026-05-14: PDR-060 (Tooling Friction Is First-Class User Feedback) landed at .agent/practice-core/decision-records/PDR-060-tooling-friction-is-first-class-user-feedback.md per owner verdict ACCEPT after the function-test metacognition correction]`

**Recommended shape**: PDR with `pdr_kind: pattern`.

**Function test** (rules, ADRs, and PDRs are not interchangeable
vehicles — each has a distinct function, and the choice follows from
the substance):

- **ADR** is wrong shape. The substance is not an architectural
  decision about *this repo's product*; it is doctrinal substance
  about how the Practice operates.
- **Rule** is wrong shape as the *primary* home. A rule is an
  always-applied behavioural modifier that *operationalises* doctrine.
  The substance here is the doctrine itself — the claim that agents
  are both users and authors of the tooling, which collapses the
  user/author distinction and makes agent-observed friction first-class
  user feedback. The behavioural cure ("route into plan / docs /
  napkin / tooling backlog, not chat-only") is downstream of that
  claim; [`capture-practice-tool-feedback.md`](../../rules/capture-practice-tool-feedback.md)
  already operationalises a slice of the cure for Practice-tool
  feedback specifically.
- **PDR** is the right shape. The substance is *portable Practice
  doctrine*: any Practice-bearing repo where agents both author and
  use the tooling would re-derive the same claim. That is the
  textbook PDR test, and this entry's earlier "Why PDR-shaped, not
  ADR-shaped" subsection already ran it.

PDR weight is set by the substance, not by paragraph count. A
paragraph-sized PDR is appropriate when the substance is a paragraph;
"too heavy for a single-paragraph broadening" is a category error
against the function.

**Downstream of the PDR**, the existing rule
`capture-practice-tool-feedback.md` continues to operationalise the
Practice-tool slice; a sibling rule (or an amendment broadening this
one) may land to operationalise the wider agent-tooling slice. That
is rule-level work that *follows* the PDR; it is not a substitute.

**Authoring note for the PDR**: the candidate target slug
`pdr:tooling-friction-is-user-feedback` already appears in this
entry's frontmatter. The next PDR number in the practice-core
sequence resolves at draft time. Adopter scope: any Practice-bearing
repo with agents-as-users-and-authors.

Owner-review-gated: no PDR file lands until owner approves shape.

**Revision note (2026-05-14 metacognition)**: an earlier version of
this section recommended amending `capture-practice-tool-feedback.md`
and listed PDR as an "alternative if owner wants portability." That
framing ranked shapes by weight rather than by function, surfaced a
cheap-cure option, and contradicted the entry's own "Why PDR-shaped,
not ADR-shaped" subsection. The owner flagged the error and the
recommendation has been revised to follow the function test.

Owner standing direction recorded in comms-event
`9a249c-tooling-feedback-standing-note` (Pelagic Swimming Rudder,
2026-05-05): *"any friction with agent tooling should always be noted
so the tooling and documentation can be improved. This is not limited
to this identity-wordlist session. Agents are both users and authors
of the tooling, so agent-observed friction is first-class user feedback
and should be routed into the relevant plan, docs, napkin, or tooling
backlog rather than left only in chat."*

The doctrine has no permanent home. Surface scan 2026-05-14
(Salty Swimming Hull consolidation) confirmed: no `.agent/directives/`,
`.agent/rules/`, `.agent/practice-core/`, `distilled.md`, or
`docs/governance/` entry codifies it. It is observed in practice —
sessions routinely raise friction reports in comms and napkin — but
the standing direction itself is unmoored. The risk is the routine
quietly decaying when the conversational context drops.

**Why PDR-shaped, not ADR-shaped**: applies to *how the Practice
operates* (the discipline of treating agents-as-users), not to this
repo's product architecture. Adopter scope = next Practice-bearing
repo. Identical doctrine would be re-derived in any repo where
agents both author and use the tooling.

**Why also a rule candidate**: the standing direction maps to a
behavioural cure that can fire at the moment friction is observed —
parallel shape to `capture-practice-tool-feedback.md` (which covers
practice-tool feedback specifically, not the broader agent-tooling
surface). A rule would name: when friction observed → route to plan
/ docs / napkin / tooling backlog, not to chat-only.

**Trigger**: owner-direction; ready to graduate at next consolidation
unless owner prefers different shape (e.g. amend an existing rule
rather than a new one).

---

### 2026-05-11 — Pre-commit hook must gate staged content only (load-bearing)

`[captured-date: 2026-05-11 | source-surface: napkin Wooded 5c8f3c +
feedback_pre_commit_hook_must_gate_staged_only |
graduation-target: adr:pre-commit-hook-staged-only +
rule:pre-commit-gates-staged-only + plan:cost-of-collaboration.plan.md
P0 | trigger: four-agent convergent evidence in single session (three
serial deadlock iterations on same defect); status: graduated |
graduated: 2026-05-12 (Twigged Growing Glade disposition pass); size: L]`

Graduated 2026-05-12 with corrected wording: the landed P0 decision narrows
file-content scanners to staged paths while preserving whole-repo broken-code
guards (`repo-validators:check`, shell lint, and Turbo type-check/lint/test) at
the pre-commit boundary. Pre-commit hook previously scanned the entire working
tree (staged + unstaged +
untracked) at hook-fire time via repo-wide tools (`prettier --check .`,
`markdownlint --dot .`, `knip`, `depcruise`, `turbo type-check lint
test`). In any multi-agent window with ≥2 simultaneously-writing
agents, this is **structurally fatal** to every coordination protocol
layered on top of it — gatekeeper specialisation, commit queue, claim
discipline, peer sidebars all fail because the gate-sweep snapshot
goes stale at the next file write. Fix shape selected: `prettier-staged` and
`markdownlint-staged` for file-content scanners, with higher-standard gates
rebased to pre-push / CI / `pnpm check` and the broken-code guard retained
before commit. No separate ADR/rule is required unless the gate contract drifts
again.

---

### 2026-05-11 — Advisory protocols decay under pressure; enforcement required

`[captured-date: 2026-05-11 | source-surface: napkin Wooded 5c8f3c

- napkin Sparking Charring Ash caf5e1 (.git/index.lock on first
git add) | graduation-target:
rule:commit-queue-enforced-pre-stage + plan:cost-of-collaboration.plan.md
P3 | trigger: same-session evidence from multiple agents skipping the
advisory queue under pressure; status: graduated | graduated:
2026-05-12 (Secret Vanishing Moth) | target-resolved:
cost-of-collaboration.plan.md P3 + commit-queue guard at c083a1ab |
size: M]`

Anything that can be skipped will be skipped under pressure.
Sparking Charring Ash skipped the commit queue at staging step;
their immediate next action hit the collision the queue would have
predicted. Fix shape: structural enforcement at the pre-stage hook
level — refuse `git add` if no active intent in `active-claims.json`
matches the staged file set. Rule captures the constraint; cost-of-
collaboration P3 captures the implementation. Graduated 2026-05-12:
`commit-queue guard` now validates an active same-identity queue intent plus a
live `git:index/head` claim before staging paths, and P3 evidence is recorded
in `cost-of-collaboration.plan.md`.

---

### 2026-05-20 — Closure-pressure rationalisation failure mode (Stormy Plumbing Atoll)

`[CANDIDATE: closure-pressure-rationalisation | captured: 2026-05-20 |
source: napkin 2026-05-20; research doc closure-pressure-and-workflow-composition-2026-05-20.md;
exploration plan closure-pressure-remediation-design-space.plan.md | graduation-target:
named "less" child of absorption-adjacent-failure-mode-family PDR (see family
candidate below) — substance moves into that PDR; the exploration plan with
10 todos remains a separate research-grade artefact | trigger: family PDR
authorised 2026-05-20; substance absorbs there. Owner direction 2026-05-20
on the exploration plan: "not blocking for the gate work, it wasn't a problem
yesterday, it may not be a problem tomorrow" — the 10-todo exploration is
parked for later research, not for immediate doctrine landing | status: graduated
(substance graduated 2026-05-21 as PDR-062 child) | size: absorbed by family PDR]`

Worked instance demonstrated this session: session executed plan as
designed for steps 1–5; step 6 (continuity handoff at `5f1551c3`)
landed but the continuity record under-reported reviewer-finding
disposition state ("2 deferred" vs. actual 5+ under-disposed). Owner
probing through three rounds of metacognition surfaced the failure mode.
Five mechanisms identified for the closure-pressure substrate: oversight
re-labelled as deferral; rationalisation with reconstructed reasoning;
"cheap fixes" framing as the diagnostic adjective family; under-reporting
in narrative-form continuity; metacognition-as-performance (naming a
pattern and re-enacting it in the same response). Research doc preserves
all five mechanisms in detail. Exploration plan enumerates 10 directions
worth exploring (q1-q10), recommended sequence starts with q10
(memetic-immune-system precedent), q8 (failure-mode family resemblance),
q2 (lightweight-frequent self-check given owner observation "almost any
tick will do"), q3 (rule/skill relevance criteria), q7 (workflow-
composition mechanism family). Not action-bearing without owner direction.

---

### 2026-05-20 — PDR-044 refusal-vs-approval mechanism choice (Stormy Plumbing Atoll)

`[CANDIDATE: pdr-044-refusal-vs-approval-mechanism-choice | captured:
2026-05-20 | source: napkin 2026-05-20; research doc §"Concrete observation
from the authoring session itself" | graduation-target: PDR-044 amendment
| trigger-fired: owner authorisation fired 2026-05-20 | status: graduated
| size: S-to-M | graduated: 2026-05-21 to PDR-044 amendment]`

Worked instance: drafting the closure-pressure exploration plan, two write
attempts were blocked by the PDR-044 hook on forbidden owner-only patterns
("carve-out", colloquial shortcut framing). Both blocks were doctrinally
correct (those patterns are owner-only by PDR-044). But the write surface
needs the ability to reference blocked patterns in legitimate context
(naming them as things to study, recording owner-blocked language as
evidence in a research artefact). Owner-stated direction while the
blocking was happening: the hook should be a trigger for owner approval
rather than a refusal. Generic design choice: refusal-vs-approval applies
to any pattern-detection mechanism — forbidden-framing hooks, potential
cost-framing-detection hooks, reviewer-finding under-reporting detection,
etc. Graduated 2026-05-21: PDR-044 now distinguishes irreducible blocks
from approval-trigger detections, preserving an explicit owner-approval route.

---

### 2026-05-20 — Over-correction during reviewer-finding absorption (Shaded Creeping Cloak)

`[CANDIDATE: over-correction-during-absorption | captured: 2026-05-20 |
source: napkin 2026-05-20; commit ebd0e8dc + correcting commit ccfe8948 |
graduation-target: named "more" child of absorption-adjacent-failure-mode-family PDR
(see family candidate below) — substance moves into that PDR | trigger:
family PDR authorised 2026-05-20; substance absorbs there | status: graduated
(substance graduated 2026-05-21 as PDR-062 child) | size: absorbed by family PDR]`

Worked instance: Stormy Plumbing Atoll absorbed type-expert's
recommendation to add `rejectURDNA2015: true` to the rdf-canonize ambient
declaration. The absorption ALSO narrowed `algorithm: string` to literal
`'RDFC-1.0'` — a change the reviewer never recommended and that the
type-expert verdict explicitly contradicted. Shaded Creeping Cloak's
disposition this session reverted the unwanted narrowing (commit
`ccfe8948`) while preserving the reviewer's actual fix.

Failure-mode family: adjacent to but distinct from closure-pressure
rationalisation. Closure-pressure produces *less* than the reviewer
recommended (deferral re-labelled as a tactical choice). Over-correction
produces *more* than the reviewer recommended (an absorption that touches
adjacent surfaces). Both are absorption-time disposition errors. The
diagnostic signature for over-correction: a code diff during absorption
touches more named symbols than the reviewer's recommendation specified.

Recovery shape: the **revert-as-absorb** pattern. When the right
disposition for an over-correction is reversion, that reversion goes in
the absorb column, not the re-argue column. Reverting the over-correction
is not re-arguing; it is absorbing the original reviewer verdict cleanly.

Single instance observed. Promote on second instance OR owner-direction
graduation request.

---

### 2026-05-20 — Review-of-completed-work surfaces lessons and fixes, never re-decisions (Shaded Creeping Cloak)

`[CANDIDATE: review-of-completed-work-is-not-re-decision | captured:
2026-05-20 | source: napkin 2026-05-20 §"Failure: re-surfacing a settled
decision as if it were a new one"; owner correction "that isn't a decision,
that is hand wringing that has cost more in my attention and yours than
simply moving on" | graduation-target: named "re-litigate" child of
absorption-adjacent-failure-mode-family PDR (see family candidate below) —
substance moves into that PDR | trigger: family PDR authorised 2026-05-20;
substance absorbs there | status: graduated
(substance graduated 2026-05-21 as PDR-062 child) | size: absorbed by family PDR]`

Worked instance: owner requested a principles-grounded review of completed
work. The review correctly identified D1's absorption as a §First Question
miss (high cascade cost relative to observable-behaviour delta). The
agent then incorrectly framed the finding as a *live decision* ("keep or
revert D1?") and asked the owner to adjudicate. Owner response was the
sharp correction quoted above.

Substance: a review of completed work has two legitimate output classes:
**lessons** (which feed future decisions and may surface as new pattern
candidates or PDR amendments) and **defects to fix** (which the agent
addresses immediately — TSDoc gaps, broken cross-refs, residue from the
work itself). It does NOT have a third class of "re-decide the settled
call." The disposition is made; the work is committed; the cost is paid.
Re-surfacing it as a fresh decision spends owner attention twice for no
new information and is itself a failure mode.

Falsifiable shape: any review-of-completed-work response that ends with a
multiple-choice question to the owner about a settled call is the failure
shape. The right shape is verdict + fix-in-flight; never verdict + re-decide.

Adjacent to but distinct from `.agent/rules/present-verdicts-not-menus.md`
(which targets forward-looking options). This is the backward-looking
counterpart. A graduation might either amend the existing rule or add a
sibling rule.

---

### Cross-session observation: absorption-adjacent failure-mode family (Shaded Creeping Cloak / Stormy Plumbing Atoll)

`[CANDIDATE: absorption-adjacent-failure-mode-family-pdr | captured:
2026-05-20 | source: napkin 2026-05-20; pending-graduations entries
closure-pressure-rationalisation + over-correction-during-absorption +
review-of-completed-work-is-not-re-decision | graduation-target: single
Practice-governance PDR with three named children (less / more / re-litigate)
| trigger-fired: owner authorisation fired 2026-05-20 | status: graduated | size: L | graduated: 2026-05-21 to PDR-062]`

Three failure-mode candidates accumulated within the 2e2764 + 4ef359 window,
all touching the moment an agent disposes (or re-handles) reviewer findings:

- **Closure-pressure rationalisation**: agent absorbs *less* than the
  reviewer named (oversight re-labelled as deferral).
- **Over-correction-during-absorption**: agent absorbs *more* than the
  reviewer named (an adjacent narrowing the reviewer never asked for).
- **Review-as-re-decision**: agent re-surfaces a settled disposition as
  if it were a fresh decision (during retrospective review of completed
  work).

The family may eventually warrant a single PDR with three children, or
remain three separate candidates. Not action-bearing without owner direction
or a third-family-instance corroboration; recorded so the family is visible
in the register before any individual member graduates.

- 2026-05-21; **Backtick-substitution in double-quoted shell args carrying markdown bodies (rule candidate + CLI-enhancement evidence point)**.
  `[captured: 2026-05-21 | source: Cirrus-Circling-Plume-incident | target: rule:comms-send-body-composition-safety + cli-enhancement:--body-file | trigger: --body-file CLI shipping | size: S | status: pending]`
  Worked precedent from the same session, Cirrus coordinator-side mistake: a
  cron-tick progress broadcast was composed with the pnpm command using
  DOUBLE-quotes around `--body`, with markdown backtick code spans inside
  (including a literal `git commit` token in backticks). Shell
  command-substitution evaluated the backticks before passing the argument;
  the bare `git commit` invocation ran during another agent's
  gatekeeper-window, triggered the pre-commit hook, FAILED on a flaky
  oak-search-sdk lifecycle-lease integration test, and aborted (no commit
  landed). Salty's actual `git commit` ran cleanly ~30s later. No on-disk
  damage but the gatekeeper-specialisation protocol was momentarily
  breached. Two graduation surfaces:
  (a) **Rule candidate**: comms-send body composition with markdown content
      must avoid double-quoted shell arg interpolation — either single-quote
      the `--body` argument, or use the `--body-file` CLI flag once it
      ships.
  (b) **`--body-file` CLI enhancement (evidence point 2)**: prior evidence
      point from the 2026-05-21 (Celestial Glimmering Moon) session captured
      shell-argv-corruption-upstream-of-CLI; this evidence point adds
      backtick-substitution in double-quoted bodies. Two failure shapes,
      both cured by a `--body-file` flag that reads the body from a file
      path without any shell argument-list interpolation.

- 2026-05-21; **Closure-shape vs structural-antonym distinction for vocabulary discipline (napkin refinement candidate)**.
  `[captured: 2026-05-21 | source: Cirrus-Circling-Plume-coordinator-disposition+Evergreen-Climbing-Canopy-coherence-pass | target: napkin:closure-shape-vs-structural-antonym | trigger: next-consolidation | size: S | status: pending]`
  Worked precedent from the same session: Evergreen surfaced six "definite"
  hits at pre-existing lines 152/455/574/695/817/883 of graph-mvp-arc.plan.md.
  Doctrinal tension: Charcoal Searing Ember's 2026-05-21 napkin entry registers
  "definite" as Family 2 dogma vocabulary (closure-shape); user-memory entry
  `feedback_simple_definite_no_imaginary_flows` uses "definite" as the
  corrective doctrine vocabulary (structural-antonym to "imaginary-flow
  conditional triggers"). The hits in graph-mvp-arc.plan.md follow the
  structural-antonym shape ("definite ordering / definite sequence position
  / no conditional triggers"). Refinement: the same word can be pathogen in
  closure-shape usage AND corrective in structural-antonym usage; the
  vocabulary-discipline check must be by usage-shape, not by word. Verdict
  applied this session: KEEP all 6 instances (structural-antonym usage,
  consistent with corrective doctrine). Captured for next-consolidation
  napkin refinement.

---

## Wooded Swaying Thicket pass — substrate-landing graduations (appended 2026-05-22)

The following five entries graduated during the substrate landings on
2026-05-22 (Mistbound Slipping Night's Tranche 1 commit `c4bacfc5` and
Foamy Snorkelling Jetty's prior PDR drafts). Substance lives at the
named target homes. Bodies preserved here verbatim per the `body
archived` stub convention.

---

### 2026-05-21 — Coordinator-handoff: pre-positioning vs active-acknowledgement (PDR-shaped or pattern-shaped)

`[captured: 2026-05-21 | source: napkin.md §"Surprise: pre-positioning a coordinator handoff is distinct from transferring authority" + comms-event 554bc011 (correction broadcast) + comms-event c9d8d016 (Cirrus active-acknowledgement) | target: pattern:coordinator-handoff-two-moments OR PDR amendment to PDR-049 (peer-collaboration governance) | trigger: second-instance-or-owner-direction | size: S | status: pending]`

Substance summary: a coordinator handoff has two distinct moments
that are commonly conflated: (1) **pre-positioning** — outgoing
agent broadcasts the team state-of-play (roster, slice state,
outstanding work, standing notes) for the incoming agent's
foundation read on arrival; (2) **active-acknowledgement** —
incoming agent broadcasts intent-to-coordinate. **Only the latter
transfers authority.** The outgoing agent retains all coordinator
responsibilities (routing, cron cadence, reviewer dispatch,
commit-window coordination) until the incoming agent's
active-acknowledgement is observable in comms.

First instance this session: Stratospheric Gusting Squall posted
a pre-positioning handoff broadcast (`c020b3d6`) and cancelled the
3-min coordinator-cadence cron, intending to step down. Owner
corrected: *"you are coordinator until Cirrus actively acknowledges
taking over the role"*. Correction broadcast (`554bc011`) re-armed
the cron + re-asserted authority. Cirrus's active-acknowledgement
(`c9d8d016`) 50 seconds later was the actual transfer.

Trigger to watch: second observed instance in a different team
session, or owner-direction graduation request. Promotion target:
pattern entry at `.agent/memory/active/patterns/` (general form);
OR PDR amendment to PDR-049 if the two-moments distinction warrants
governance-level codification.
---
### 2026-05-21 — §1a inherited-tree gate-runner default scope is per-workspace (skill-amendment-shaped)

`[captured: 2026-05-21 | source: napkin.md §"Insight: §1a inherited-tree gate-runner scopes per-workspace, not tree-wide" + comms-event 7511fb37 (Salty's §1a gate-state report) | target: skill-amendment:start-right-team §1a "Running the gates" subsection | trigger: second-instance-or-cross-workspace-cascade-failure | size: S | status: pending]`

Substance summary: the start-right-team skill text mentions
per-workspace as "an option" when the dirty files are scoped to
specific workspaces; this session is a worked instance demonstrating
the savings. Salty Snorkelling Pier's §1a gate-state report ran
type-check + lint + test against 4 dirty workspaces
(`agent-tools` / `oak-search-cli` / `@oaknational/env` /
`@oaknational/graph-project`) in ~2 minutes total — 12 commands,
all PASS, 1505 tests. Tree-wide `pnpm check` would have re-run
already-green workspaces plus the integrated chain.

Risk shape: per-workspace would miss a cross-workspace cascade
(e.g. an SDK type change that breaks consumers in another
workspace). The §1a runner's diagnosis-hypothesis step is the
guard — Salty explicitly framed the inherited residual as
"uncommitted in-flight work, not cascade residue", which justified
the per-workspace shape.

Trigger to watch: second observed per-workspace instance with
similar savings (promotes to default with the cascade caveat), OR
the inverse — a session where per-workspace missed a cross-workspace
cascade (promotes a stronger cascade-detection requirement).
Promotion target: amendment to start-right-team skill §1a
"Running the gates" subsection promoting per-workspace from "an
option" to "the default when dirty files are workspace-scoped" with
the cross-workspace cascade caveat.
---
### 2026-05-21 — Mid-cycle retirement protocol for token-bounded agents (PDR-shaped or skill-amendment-shaped)

`[captured: 2026-05-21 | source: gate-1a-delivery-parallel-execution-addendum.plan.md §"Question 1: Mid-cycle retirement protocol" + final-handoff session deepening plan | target: pdr:mid-cycle-retirement OR skill-amendment:start-right-team §"Mid-cycle retirement" | trigger: first-instance-observation-in-rotating-cast-launch | size: M | status: pending]`

Substance summary: a rotating-cast agent approaching their token
budget mid-cycle (mid-edit, possibly mid-claim) cannot simply stop
without risking either leaving work in an indeterminate state for
the next agent, or rushing to a forced stopping point that breaks
the atomic-landing invariant. The current closeout contract only
covers natural-boundary closeouts (slice-complete, commit-landed,
peer-closeout).

Proposed protocol shape:

1. Agent senses approaching budget (≥80% used, or after each
   commit).
2. Agent freezes work-in-progress to a structured handoff record
   covering: current edit state (which files are open and what
   state they are in), in-flight reasoning (the analysis that led
   to current state), decisions made (what is settled), decisions
   deferred (what the next agent must resolve).
3. Claim reassigned (existing claim shape extended with
   `mid_cycle_handoff: true` flag plus the structured handoff
   record reference).
4. Next agent picks up the claim via the active-claims registry +
   comms-event watcher.
5. Original agent retires with explicit retirement broadcast.

Trigger to watch: first observed mid-cycle retirement instance in
a rotating-cast Round 1 launch. The first launch will deliberately
stress-test this protocol via mid-round coordinator retirement per
the addendum plan. Promotion target: PDR formalising the protocol,
OR skill-amendment to start-right-team adding a §"Mid-cycle
retirement" subsection adjacent to the existing Closeout Contract.
---
### 2026-05-21 — Grounding-cost amortisation under rotating-cast operation (PDR-shaped)

`[captured: 2026-05-21 | source: gate-1a-delivery-parallel-execution-addendum.plan.md §"Question 3: Grounding-cost amortisation" + final-handoff session deepening plan | target: pdr:grounding-cost-amortisation-under-rotation | trigger: owner-direction-or-first-rotating-cast-launch-evidence | size: M | status: pending]`

Substance summary: each new agent session pays ~30k tokens reading
the start-right-team foundation (AGENT.md, RULES_INDEX, principles,
tdd-as-design, testing-strategy, orientation, thread record, active
claims, recent comms, plan body) before any productive work. At
10-min auto-spawn cadence, this is ~180k tokens/hour burned on
duplicate grounding. The architectural question: is this efficient
under faster-than-human-pace operation, or is a fast-bootstrap mode
appropriate for narrowly-scoped single-cycle agents?

Proposed fast-bootstrap shape (open for owner direction): read only
the last-session record + current active claims + recent comms-event
window, skipping full directive reading on the assumption that the
coordinator already verified directive compliance at session
open. The full grounding remains mandatory for coordinator-role
agents and any agent that opens a source claim beyond a single
named cycle.

Risk shape: fast-bootstrap agents may miss a recently-graduated
rule or doctrine update. The cure (if adopted): rule/doctrine
changes are also surfaced as comms-events with a `[DOCTRINE]`
tag so the fast-bootstrap window catches them.

Trigger to watch: owner-direction to evaluate, OR first
rotating-cast launch where grounding cost is observed empirically
against productive cycle work. Promotion target: PDR codifying
fast-bootstrap as a session-mode option with eligibility
constraints.
---
### 2026-05-21 — Comms-event stream as real-time failure-mode capture channel (PDR-shaped)

`[captured: 2026-05-21 | source: gate-1a-delivery-parallel-execution-addendum.plan.md §"Question 4: Comms-events as the failure-mode capture channel" + final-handoff session deepening plan | target: pdr:comms-event-stream-as-failure-mode-channel | trigger: second-instance-or-rotating-cast-launch-observation | size: S | status: pending]`

Substance summary: today's session captures failure modes (verdict
walk-backs, backtick incidents, shell-quoting hazards) at session
close in napkin entries. Under rotating-cast operation, failure
modes need to be visible to the next coordinator *during their
session*, not at the prior coordinator's close. The napkin is too
coarse a vehicle — it lives in the authoring agent's context until
written at close.

Proposed protocol: each substantive failure mode is surfaced as a
comms-event in real time, with a `[FAILURE-MODE]` or
`[BEHAVIOUR-NOTE]` tag on the first line (consistent with the
existing `[BROADCAST]`/`[GROUP]`/`[DIRECTED]`/`[LIFECYCLE]` tag
convention from the all-channels comms-monitor CLI). The next
coordinator's watcher picks it up immediately; session-close
napkin entries become the *consolidation* of real-time events,
not the first capture.

Coupling: this protocol depends on the
comms-event-stream-as-canonical-truth principle (already in this
register awaiting graduation under §"Comms event stream as
canonical truth (PDR candidate)") — under rotation, that principle
becomes load-bearing infrastructure rather than a recommendation.

Trigger to watch: second observed real-time failure-mode comms-event
in a rotating-cast session, OR owner-direction graduation. Promotion
target: PDR formalising the failure-mode-channel protocol AND
extending the comms-event schema with the new tag set.
