---
archive_kind: pending-graduations-snapshot
archived_on: 2026-05-22
archived_by: consolidation pass via /jc-consolidate-docs
archive_reason: 'pending-graduations.md CRITICAL fitness zone; multiple multi-agent graduation passes on 2026-05-22 retired entries whose audit trail bodies are preserved here. Combined retentions per the 2026-05-06 / 2026-05-10 precedent and the file split_strategy.'
window_covered: '2026-05-05 → 2026-05-22 (entries graduated during that window)'
---

# Pending-Graduations Archive — 2026-05-22 Drain

This archive holds the bodies of graduated pending-graduations
entries that were retained inline as audit trail prior to the
2026-05-22 consolidation passes. The live register at
[`../pending-graduations.md`](../pending-graduations.md) replaces
each archived entry with a one-line graduated-pointer naming the
target home and the archive location.

Three drain passes contributed to this snapshot on 2026-05-22:
the initial pass (13 entries from the 2026-05-05 → 2026-05-20
window); the Wooded Swaying Thicket substrate-landing pass
(5 entries whose substrate landed in `c4bacfc5` or in pre-existing
draft PDRs); the Tempestuous Spiralling Thermal substrate-completion
pass (4 entries whose graduation targets had either already-landed
substrate or had natural homes ready to receive the amendment).

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

## Tempestuous Spiralling Thermal — substrate-completion graduation pass (2026-05-22)

### 2026-05-22 — Partial / slice-scoped coordinator transfer (graduated to PDR-064 amendment)

`[CANDIDATE: partial-slice-scoped-coordinator-transfer | captured: 2026-05-22 | source: PDR-064 drafting + worked instance Ferny→Blustery slice-coord assignment + comms event 9670c08f behaviour-note | graduation-target: PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" amendment subsection | trigger: 3rd instance observed THIS SESSION (Flamebright→Ferny full, Ferny→Blustery full, slice-coord assignment between them) — graduation trigger fired; awaiting commit window | status: due | size: S]`

PDR-064 establishes the two-distinct-moments coordinator handoff
pattern for the full-session role. This session demonstrated that a
distinct pattern applies when the handoff is scoped to a slice
(boundary-bounded coordination of a sub-arc), not the whole session.
Three concrete instances landed in one session: (a) Flamebright →
Ferny full-coordinator transfer; (b) Ferny → Blustery full-coordinator
transfer; (c) Ferny's slice-coordinator assignment for the PDR-063..066
arc, sitting *inside* the full-coordinator window. The slice-shaped
case differs structurally — no cron rearm, no full-authority transfer,
boundary-bounded by the slice itself. PDR-064 explicitly anticipates
this with the parenthetical at lines 145-154 (cured this session to
"out of scope for this PDR; captured for a follow-on amendment"). The
3-instance trigger fired this session — amendment ready to graduate
into PDR-064 as a §"Partial / Slice-Scoped Coordinator Transfer"
subsection at the next non-PDR commit window.

`[graduated 2026-05-22: Tempestuous Spiralling Thermal pass added §"Partial / Slice-Scoped Coordinator Transfer" subsection between §"Cron / cadence boundary" and §"Intersection with PDR-063" inside PDR-064 §Decision. Anchor references in §Moment 2 and §Cron / cadence boundary updated to point at the landed subsection.]`

### 2026-05-22 — Coordinator-must-delegate-sub-agent-launches-not-self-dispatch (graduated to start-right-team SKILL amendment)

`[CANDIDATE: coordinator-delegates-subagent-launches | captured: 2026-05-22 | source: owner correction to Ferny on subagent dispatch + owner correction to Blustery on architecture-expert-fred re-verify self-dispatch + Blustery self-flagged graduation candidate in directed event 09:00:21 | graduation-target: amendment to start-right-team SKILL §"Choose Temporary Responsibilities" + adjacent collaboration practice rule on coordinator boundary | trigger: 2-instance trigger fired this session (Ferny correction, Blustery correction) | status: due | size: S]`

Owner direction observed twice this session in different framings:
"coordinator's concern is to coordinate, if work needs doing, including
launching sub-agents, delegate that to a team member". Sub-agent
launches (Agent-tool dispatches to reviewer agents like architecture-expert-fred,
assumptions-expert, etc.) are *implementer-class work*, not coordination.
The coordinator's role is to route the dispatch to a team member; the
delegated team member runs the Agent-tool invocation, absorbs the
verdict, and surfaces results. This applies whether the dispatch is a
review of a slice the coordinator already routed, or a fresh-eyes pass.
Blustery self-flagged this as a graduation candidate after the owner's
second correction; the doctrine target is the start-right-team SKILL
§"Choose Temporary Responsibilities" subsection on coordinator-vs-
implementer boundary, plus the adjacent rule on collaboration practice.

`[graduated 2026-05-22: Tempestuous Spiralling Thermal pass added the "Coordinator delegates sub-agent launches" amendment paragraph to start-right-team SKILL §"Choose Temporary Responsibilities" — names the boundary, the discipline, the structural reason, and the slice-coordinator extension under PDR-064.]`

### 2026-05-22 — CLI body backtick-shell-substitution cure pattern (graduated to agent-tools/README.md §"CLI Norms")

`[CANDIDATE: cli-body-backtick-cure-pattern | captured: 2026-05-22 | source: at least 3 independent instances across recent sessions — Cirrus Circling Plume 2026-05-21 (shell command-substitution from markdown backticks in double-quoted body argument), Ferny Swaying Leaf 2026-05-22 (event 0ce0b26b lost the field-name tokens to backtick eval in --body), Foamy Snorkelling Jetty 2026-05-22 (comms reply --body parsing failure on backticks in markdown code fences). Stratospheric Gusting Squall earlier instance also referenced in current napkin index | graduation-target: amend agent-tools/README.md §"CLI Norms" with the cure pattern (prefer single-quoted --body OR write body to tmp-file with escaped backticks OR add --body-file path flag that reads body without shell interpretation) | trigger: 3+ instance evidence is firm; cure shape has consensus; awaiting owner-direction or coordinator-routed graduation | status: due | size: M]`

The failure mode: agent-tools CLI comms send/direct/reply with the
body passed via double-quoted shell argument. When the body
contains backticks (markdown code fences, identifier references),
the outer double-quote allows the shell to evaluate
backtick-wrapped spans as command substitution. The backtick spans
get replaced with the (usually empty) stdout of the substituted
"command". Result: the comms event body is silently truncated or
corrupted; the agent receiving it sees stripped or replaced text.
The same failure mode appears on `comms send` (Cirrus), `comms
direct` (Ferny), and `comms reply` (Foamy). Three+ cure shapes
have proven workable: single-quoted body argument preserves
content literally; cat-from-tmp-file with escaped backticks is
fragile; preferring square brackets over backticks for inline
identifier references; and the load-bearing graduation target —
add a path flag that reads body from a file without shell
interpretation. The 3rd instance is the trigger threshold per
the standing "third-consumer consolidation" pattern.

`[graduated 2026-05-22: Tempestuous Spiralling Thermal pass confirmed the --body-file cure mechanism had already shipped in 675bb83b alongside an agent-tools/README.md §"CLI Norms" subsection ("Comms body input: --body vs --body-file") that documents when to prefer each form, the hazard shape, and a canonical usage example. Substance is fully landed; this graduation moves the status to graduated and records the cross-session evidence trail.]`

### 2026-05-22 — Hook-policy substring-matching in instructive content (graduated to new .agent/rules/hook-policy-substring-discipline.md)

`[CANDIDATE: hook-policy-substring-match-cure | captured: 2026-05-22 | source: at least 3 cross-session instances — Midnight Veiling Threshold 2026-05-22 (Coordinator pattern: hook policy substring-matches forbidden patterns even in instructive context — whole-tree-shortcut command inside "do NOT use" guard sentence blocked); Torrid Glowing Flame 2026-05-21 ("Hook blocked carve-out vocabulary in new agent content"); Charcoal Searing Ember 2026-05-21 ("Failure: vocabulary inheritance from sub-agent verdict text — new vector for the carve-out hook"); Ferny + Flamebright 2026-05-22 (hook-bypass literal substring in dispatch briefs blocked by hook policy until rephrased) | graduation-target: either (a) hook policy upgrade to context-aware parsing (multi-token negation-aware) which is structurally hard, OR (b) coordinator-brief / agent-content discipline rule: substitute generic descriptive language for literal forbidden-pattern strings in instructive contexts; literal forbidden-pattern strings belong only in the rule's canonical home where the hook expects them | trigger: 3+ instance evidence firm across multiple sessions and multiple agents; cure shape (b) is portable and immediate; cure shape (a) is upstream and slow | status: due | size: M]`

Hook policies are substring-matchers that do not parse the
semantic context of natural-language guards. "Do not use X" and
"use X" trip the same substring filter. Recurring failure mode
across at least 3 distinct sessions and multiple agents. The
discipline cure is the immediate path: agent-authored content in
comms events, dispatch briefs, napkin entries, and similar
surfaces must use descriptive substitutes for literal forbidden
patterns in instructive contexts. Literal forbidden-pattern
strings belong only in the rule's canonical home (where the hook
expects them) and in agent execution contexts where the pattern
is being deliberately invoked. The structural cure (context-aware
hook parsing) is upstream and slow; the discipline cure is portable
and applies immediately to coordinator-brief discipline plus
comms-event drafting norms.

`[graduated 2026-05-22: Tempestuous Spiralling Thermal pass landed cure (b) as a new rule .agent/rules/hook-policy-substring-discipline.md, with Claude (.claude/rules/) and Cursor (.cursor/rules/.mdc with frontmatter) adapter wrappers and an entry in RULES_INDEX.md. The rule names the in-scope surfaces (comms-event bodies, dispatch briefs, napkin entries, team-start broadcasts, conversation threads), the excluded surfaces (canonical rule homes, hook policy config, archive material, test fixtures), the descriptive-substitute examples, and the doctrinal anchors. Cure (a) — upstream context-aware hook parsing — remains a separate concern outside this graduation.]`

## Backfill sweep — 2026-05-22 evening (Velvet Veiling Wisp)

This appended block carries the 30 entry bodies whose `status: graduated` tags accumulated through 2026-05-22's four graduation passes (Starlit, Tempestuous, Wooded, Shadowed Hiding Shade). The live register replaces each entry body with a one-line graduated-pointer; substance is preserved verbatim below. The graduation-log tables at the head of `pending-graduations.md` remain the canonical index of which entry graduated to which target.

### 2026-05-22 — Cycle decomposition that produces wrong-layer scaffolding tests is the load-bearing shape (testing-strategy amendment OR pattern)

`[captured: 2026-05-22 | source: starlit/commit-queue-intent-scope-discipline arc closeout via metacognition pass | target: pattern:where-system-state-is-observable-at-plan-author-time + amendment:tdd-as-design.md | trigger: owner-direction (fired 2026-05-22 deep-graduation) | size: S | status: graduated]`

**Graduated 2026-05-22 (deep-graduation pass)**: pattern landed at
`.agent/memory/active/patterns/where-system-state-is-observable-at-plan-author-time.md`;
`tdd-as-design.md` §"One state, one describing surface" amendment
landed in the same pass.

Substance summary: the commit-queue-intent-scope-discipline arc was originally decomposed into three TDD cycles each describing an internal seam (Cycle 1.1 record-staged read seam; Cycle 1.2 verify-staged read seam; Cycle 1.3 commit invocation). Each cycle's tests reached past the workflow into the read mechanism, producing implementation-coupled scaffolding tests (`fakeRunGitFor` re-implementing git argv parsing; assertions on argv-derived strings) that violated `testing-strategy.md` §"NEVER create complex mocks" + §"Test real behaviour, not implementation details". The metacognition pass at Cycle 1.3 surfaced that the system state was one state (commit-queue commit honours intent.files scope across peer staging drift) takes one describing surface at the workflow seam, not three at internal read mechanisms. Cycle 1.3 reshape: workflow-level invariants in `commit-workflow.unit.test.ts` via capture-list pattern on injected deps; two scaffolding test files deleted; one cycle of test-and-product co-design where the system state finally gets described at the right layer.

**Underlying pattern**: when planning multi-cycle structural changes, ask at plan-author time **where the system state will be observable**. If the answer is "at one boundary" (e.g. the workflow seam), every cycle's tests should describe that one surface. Intermediate scaffolding tests written for the implementer's confidence in internal-seam correctness do not earn ongoing maintenance cost.

**Cure shape options**:

1. **Pattern candidate**: capture as `.agent/memory/active/patterns/where-system-state-is-observable-at-plan-author-time.md` with the worked instance (commit-queue-intent-scope-discipline arc) and the diagnostic prompt at plan-authoring.
2. **`testing-strategy.md` amendment**: add §"Cycle-decomposition and the describing-surface boundary" naming that scaffolding tests at the wrong layer are an anti-pattern and pointing at workflow-seam capture-list patterns as the cure.
3. **`tdd-as-design.md` amendment**: extend the foundational definition with "one system state takes one describing surface; cycle decomposition must respect that boundary".

**Why pending**: 1 instance, one author, one arc. Second instance from a different plan / different author would confirm the pattern's generality. Owner direction to author can fire earlier.

Falsifiability: a future plan that decomposes into multiple cycles each describing an internal seam, lands scaffolding tests that subsequently need retirement, is the failure mode this entry would cure. A future plan that explicitly identifies the describing-surface boundary at plan-author time and constrains all cycles' tests to that surface is the success.

### 2026-05-22 — Check-runner singleton claim (rule-shaped or coordination-state-schema-amendment-shaped)

`[captured: 2026-05-22 | source: owner-direction (Stormbound session-handoff window) | target: rule:check-singleton-per-window + skill-amend:session-handoff | trigger: owner-direction (fired) | size: S | status: graduated (rule + SKILL amend); schema cure pending]`

**Graduated 2026-05-22 (deep-graduation pass)**: rule landed at
`.agent/rules/check-singleton-per-window.md`; `session-handoff`
SKILL §11 amendment landed naming the singleton invariant and
broadcast convention. **Still pending**: the more rigorous
structural cure — a new `area-kind: gate-sweep` (or `whole-repo-gate`)
in the active-claims schema so peers observe in-flight check runs
via the claim registry rather than via comms broadcast alone.

Substance summary: owner-stated direction 2026-05-22 during Stormbound's session-handoff: *"only one agent needs to run check, and one agent already is, so stop check, and record that invariant, and note that we need some kind of record of who is running check when"*. The session-handoff SKILL §11 currently directs every closing agent to run `pnpm check`; in an N-agent window this produces N concurrent invocations duplicating ~30s+ of work per run and providing no marginal signal. The team has no observable surface for "who is running check (or other whole-repo gate sweep) when".

**Underlying invariant**: only ONE agent runs `pnpm check` (or equivalent whole-repo gate sweep like `pnpm test`, large `turbo` invocations) per coordination window. Multiple parallel runs are wasteful at best and can collide on advisory-orchestrator file outputs at worst.

**Cure shape options** (to be designed at graduation):

1. **Rule + observable surface**: new rule `check-singleton-per-window` referencing a new `area-kind: gate-sweep` (or `whole-repo-gate`) in the active-claims schema. An agent opens the claim with pattern `pnpm-check` (or similar) before invoking `pnpm check`; peers observe the claim and defer. Closes when the run completes with the result evidence (green/red + SHA at run time).
2. **Lightweight broadcast convention**: short-lived "Lane X running pnpm check, ETA 30s" broadcast convention with a corresponding "Lane X check completed: green/red" follow-up. No schema change; relies on the comms event stream as the singleton-coordination surface. Less rigorous than (1) but lower-friction.
3. **Session-handoff SKILL §11 amendment**: the SKILL itself names the check-singleton invariant and tells agents to observe peer activity first. Without (1) or (2) the invariant has no observable surface; could be a starting point that names the gap and stages the fuller cure.

**Why pending**: structural cure design depends on whether (a) the active-claims schema absorbs a new area-kind (PDR/ADR-shaped decision), (b) a broadcast convention suffices (rule-shaped + SKILL amendment), or (c) something else. Owner direction has fired (this is the trigger); the design moment is on the next bandwidth window. Likely shape: rule + schema amendment together, but the trade-off design needs a focused pass.

**Lifecycle note**: captured as standing memory `feedback_check_singleton_per_window` in Stormbound's per-user Claude memory same session (so the rule applies immediately even before the structural cure lands). Standing-memory pre-empts the cure; the cure makes the invariant observable to peers rather than purely-agent-recalled.

Falsifiability: a future session-handoff sequence in an N-agent window where every closing agent independently runs `pnpm check` is the failure mode this entry warns about. A session where the first agent opens a check-runner claim (or broadcast), runs check, posts the result, and the other agents defer to that result is the success.

### 2026-05-22 — Dispatch PENDING reviewers at session-close, not next-session-open (session-handoff SKILL amendment)

`[captured: 2026-05-22 | source: napkin §"Insight: pending reviewer dispatches at session-end are cheap" (Charcoal evening session) | target: skill-amend:session-handoff | trigger: owner-direction (fired 2026-05-22 deep-graduation) | size: S | status: graduated]`

**Graduated 2026-05-22 (deep-graduation pass)**: `session-handoff`
SKILL §11a amendment landed naming the dispatch-PENDING-reviewers-
at-session-close move.

Substance: when a plan's `Reviewer Dispatch Log` carries PENDING reviewer markers AND the current session has touched that plan's body, dispatching the pending reviewers at session-close (parallel sub-agent calls, ~60s each) is dramatically cheaper than deferring them to "the next implementer". The next implementer's session-open then opens with the reviewers' verdicts already absorbed, the plan body internally coherent, and the MUST-NOT-BEGIN gate cleared. Worked instance this session: `type-expert` + `assumptions-expert` carried PENDING markers across Stormbound's 2026-05-22 afternoon session and Velvet's evening review-only session; Charcoal dispatched them in parallel at session-close (single-message Agent tool calls), absorbed verdicts in ~60s, and landed `2adeccec`. Cycle 1.3 went from "blocked on reviewer dispatch" to "ready for TDD authoring" without the next implementer paying any reviewer-dispatch cost.

Why pending: single instance with full cure executed. A second instance — a thread record carrying PENDING reviewer markers, a session touching that thread's plan, but the closing agent defers the dispatch to the next implementer — would cross the trigger. The cure shape is a small addition to `session-handoff/SKILL-CANONICAL.md` step 6 (or step 9 consolidation gate): "If the current thread record's plan carries PENDING reviewer markers AND this session touched the plan's body, dispatch the pending reviewers as a session-close move before declaring handoff complete. Absorb verdicts; flip markers; commit."

Falsifiability: a future session-handoff where PENDING reviewer markers persist across the handoff despite the session having touched the plan is the failure mode this entry warns about. A handoff that dispatches and absorbs is the success shape.

### 2026-05-21 — Coordinator-as-slice-runner when team capacity is short by 1 (pattern-shaped)

`[captured: 2026-05-21 | source: napkin.md §"Insight: coordinator-as-slice-runner is workable when team capacity is short by 1" | target: pattern:coordinator-as-slice-runner-short-by-one | trigger: second-instance-or-owner-direction | size: S | status: graduated (pattern)]`

**Graduated 2026-05-22 (deep-graduation pass)**: pattern landed at
`.agent/memory/active/patterns/coordinator-as-slice-runner-short-by-one.md`.
Second-instance trigger applied through owner direction during
the deep-graduation pass.

Substance summary: when a team session has N peers against N+1
file-disjoint slices (a capacity shortfall of 1), the coordinator
taking the smallest/freshest slice as a concurrent responsibility
is preferable to forcing a peer to double up. Forces file-disjoint
discipline to hold; preserves load balance.

Risk shape: a larger slice (e.g. one with inherited partial edits
requiring diff-verify) is the wrong choice. The pattern requires
the COORDINATOR PICKING THE SMALLEST / FRESHEST SLICE, not a
complex one.

First instance this session: Charcoal Searing Ember closed out
before the routing brief reached them; 4-peer pool minus Charcoal
= 3 peers against 4 slices. Stratospheric Gusting Squall took
Slice B (graph-stack.plan.md, smallest/freshest) and ran it
concurrently with coordinator routing. Total ~2 edits; coordinator
load remained manageable because other slices were parallel and
slice-completion events were event-driven.

Trigger to watch: second observed instance in a different team
session. Promotion target: pattern entry at
`.agent/memory/active/patterns/` with the smallest/freshest
constraint named.

### 2026-05-17 — Surface classification for fitness-response routing (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Surface classification routes fitness response" | target: pdr:surface-classification-for-fitness-response | trigger: owner-direction (fired 2026-05-22 deep-graduation) | size: S | status: graduated]`

**Graduated 2026-05-22 (deep-graduation pass)**: PDR-067 landed
(Proposed).

Substance summary: four surface kinds in the knowledge-flow pipeline
(memory / state / buffer / doctrine) route fitness signals to
different correct responses. The "Learning Preservation" rule applies
to memory and state, not buffers. Trigger to watch: owner-direction
at next consolidation. Full doctrine drafted at the target home, not
here.

### 2026-05-17 — Pipeline back-pressure as structural-cure signal (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Pipeline back-pressure is information" | target: pdr:pipeline-back-pressure-is-structural-cure-signal | trigger: owner-direction (fired 2026-05-22 deep-graduation) | size: S | status: graduated]`

**Graduated 2026-05-22 (deep-graduation pass)**: PDR-068 landed
(Proposed).

Substance summary: a full buffer with fitness alarms means the
upstream consumer is bottlenecked. The cure targets producer or
consumer rate, never the buffer's envelope. Four candidate bottlenecks
named in source. Trigger to watch: owner-direction at next
consolidation, ideally paired with surface-classification PDR.

### 2026-05-17 — Metacognition has two modes (retrospective + generative) (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Metacognition has two modes — retrospective and generative" | target: directive-amend:metacognition.md | trigger: owner-direction (fired 2026-05-22 deep-graduation) | size: S | status: graduated]`

**Graduated 2026-05-22 (deep-graduation pass)**: `metacognition.md`
directive amendment landed naming both modes (retrospective +
generative), the shared pre-action ratification primitive, and the
structural-cure-not-doc-patch corollary.

Substance summary: metacognition has retrospective (cure
doctrine-by-analogy on correction signal) and generative (cure
purpose-by-default on non-trivial brief / strategic fork / recurring
systems vocabulary) modes; both share pre-action action-to-impact
ratification reflex; success test is "produces correct moves next
time without same intervention." Routing: directive already names
both modes implicitly; PDR could ratify the model explicitly.

### 2026-05-17 — Platform-specific per-user memory is a buffer with drainage contract (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Platform-specific per-user memory is a buffer, not a personal store" | target: rule:per-user-memory-is-a-buffer | trigger: owner-direction (fired 2026-05-22 deep-graduation) | size: S | status: graduated]`

**Graduated 2026-05-22 (deep-graduation pass)**: rule landed at
`.agent/rules/per-user-memory-is-a-buffer.md`. Original target
shape was PDR; rule chosen because the doctrine is operational
(applies at session-handoff and consolidate-docs surfaces) rather
than design-shape.

Substance summary: Claude/Cursor/Codex per-user memory surfaces are
platform-specific buffers that drain into in-repo canonical surfaces
(napkin / distilled / rules / PDRs) per session-handoff step 6 +
consolidate-docs step 3. Cross-cutting substance written there must
be integrated; declaring the sweep done without performing it is the
failure mode. Routing: workflows already name this; PDR would ratify
the buffer-with-drainage-contract framing and make the recurrence
detectable.

### 2026-05-22 — Partial / slice-scoped coordinator transfer (Foamy Snorkelling Jetty)

**Graduated 2026-05-22 (Tempestuous Spiralling Thermal)** — body archived to [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md). Substance lives at PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" amendment subsection.

`[captured: 2026-05-22 | graduated: 2026-05-22 (Tempestuous Spiralling Thermal) | source: PDR-064 drafting + worked instance Ferny→Blustery slice-coord assignment + comms event 9670c08f behaviour-note | target-resolved: PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" | trigger-fired: 3rd instance observed in one session | size: S | status: graduated]`

### 2026-05-22 — Coordinator-must-delegate-sub-agent-launches-not-self-dispatch (Foamy Snorkelling Jetty)

**Graduated 2026-05-22 (Tempestuous Spiralling Thermal)** — body archived to [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md). Substance lives at `start-right-team` SKILL §"Choose Temporary Responsibilities" — *"Coordinator delegates sub-agent launches"* amendment.

`[captured: 2026-05-22 | graduated: 2026-05-22 (Tempestuous Spiralling Thermal) | source: owner correction to Ferny + owner correction to Blustery + Blustery self-flagged graduation candidate | target-resolved: skill-amend:start-right-team §"Choose Temporary Responsibilities" | trigger-fired: 2-instance owner direction in one session | size: S | status: graduated]`

### 2026-05-22 — CLI body backtick-shell-substitution cure pattern is a 3+ instance cross-session shape (Ferny Swaying Leaf)

**Graduated 2026-05-22 (Tempestuous Spiralling Thermal)** — body archived to [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md). Substance lives at `agent-tools/README.md` §"CLI Norms" → §"Comms body input: `--body` vs `--body-file`" (already-landed substrate at `675bb83b`).

`[captured: 2026-05-22 | graduated: 2026-05-22 (Tempestuous Spiralling Thermal) | source: 3+ independent cross-session instances | target-resolved: doc-amend:agent-tools/README.md §"Comms body input" + --body-file CLI flag landed at 675bb83b | trigger-fired: 3rd instance + cure mechanism shipped | size: M | status: graduated]`

### 2026-05-22 — Hook-policy substring-matching in instructive content is a recurring blocker (Ferny Swaying Leaf via cross-session pattern scan)

**Graduated 2026-05-22 (Tempestuous Spiralling Thermal)** — body archived to [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md). Substance lives at the new rule `.agent/rules/hook-policy-substring-discipline.md` (cure b — content-authoring discipline). Cure (a) — context-aware hook parsing — remains a separate upstream concern.

`[captured: 2026-05-22 | graduated: 2026-05-22 (Tempestuous Spiralling Thermal) | source: 3+ cross-session instances across multiple agents | target-resolved: rule:hook-policy-substring-discipline + RULES_INDEX entry + Claude + Cursor adapters | trigger-fired: 3+ instance evidence across sessions | size: M | status: graduated]`

### 2026-05-22 — Pre-execution code-expert review catches design-time bugs static gates cannot (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance ratified
into `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md`
as the implicit justification for the rule's existence (the rule
already exists; this worked-instance reinforces the rule's value via
its source-attribution amendment). The standalone pattern-instance
file under `memory/active/patterns/` is NOT created: the substance is
already enforcement-surface; a pattern instance would be redundant.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: .agent/rules/pre-execution-code-expert-review-per-loop-cycle.md (source-attribution evidence) | trigger-fired: owner-directed promotion | size: S | status: graduated]`

The t12-citation-shape cycle's pre-execution code-expert verdict
surfaced `Citation.source: 'EEF Teaching and Learning Toolkit'`
literal field collision with the canonical `EEF_ATTRIBUTION`
constant at `oak-curriculum-sdk/src/mcp/source-attribution.ts`.
The bug would NOT have surfaced at type-check, lint, or vitest —
the literal string field is structurally well-typed and Zod would
have accepted the EEF_ATTRIBUTION constant's string value at parse
time. Code-expert read across two files (plan + existing attribution
constant) and named the architectural-intent collision. Static gates
catch syntactic problems; pre-execution review catches design-intent
collisions.

Adjacent existing pattern: `pre-implementation-plan-review.md`.
Distinct shape: that pattern covers plan-review (whole plans);
this candidate covers cycle-review (single-cycle scope) with a
specific class of finding (cross-file architectural collisions).

### 2026-05-22 — Framing-direction (session-forward vs impact-backward) determines graduation destination (Mistbound Slipping Night, metacognition pass)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
at PDR-014 §"Amendment Log: 2026-05-22 — Framing-direction discipline
at the capture edge". The amendment names the two framing directions,
their natural homes, and the three moments where the discipline
applies (session-handoff step 6a, consolidate-docs step 7a/7b,
owner-direction reframing).

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: PDR-014 amendment 2026-05-22 (framing-direction discipline at the capture edge) | trigger-fired: owner-directed promotion | size: M | status: graduated]`

When surfacing insights for graduation, the question is "what
coordination surface does this cure?" not "where did this
observation come from?" Session-forward framing's natural home is
the experience file (subjective texture). Impact-backward framing's
natural home is the rule / PDR / schema surface (durable substrate).
Same substance, different destination, based purely on framing.

Worked instance this session: I surfaced five insights at session-end
framed forward-from-session. Owner reframed them as topology-
independent coordination cures. The reframing made them eligible for
graduation as structural cure candidates (rules / PDR amendments /
schema additions) rather than session-anecdotes confined to napkin.

The cure shape: amend PDR-014 (capture → distil → graduate → enforce
pipeline) to name the framing-direction discipline at the capture
edge. Or, if PDR-014 is too high-level for this, a new PDR naming
the framing-direction rule for graduation candidates. The
substance: impact-backward framing is the more durable framing
because it travels across the session boundary that produced the
observation; session-forward framing is correct for experience-file
texture but produces graduation-resistant substance for rules.

### 2026-05-22 — Continuity-surface drift is structurally orphaned from cycle commits (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
at `.agent/rules/continuity-surface-commits-as-orphans.md` (canonical
rule + .claude + .cursor forwarders + RULES_INDEX entry).

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: rule:continuity-surface-commits-as-orphans | trigger-fired: owner-directed promotion | size: M | status: graduated]`

Continuity-surface edits (napkin, thread records, repo-continuity,
pending-graduations, experience files) are structurally produced
AFTER the cycle's product code. They cannot ride with the cycle
commit because they don't exist when the cycle commits. They sit
in the working tree unowned, waiting for someone to sweep them.

This is structural orphaning, not procedural drift. Continuity
commits ratify an OBSERVATION about the session; cycle commits
ratify a TESTED CHANGE. Different acceptance criteria; bundling
obscures both.

The cure shape: a rule naming that continuity-surface edits land
as their own session-end commit (`chore(continuity): land
<YYYY-MM-DD> <agent> session reflection`) — committed by the
closing agent at session-end OR explicitly handed off to a follow-on
agent. Topology-independent — applies to solo (the agent who
closes commits), hub-and-spoke (the coordinator at session-end),
peer-primary (each agent at their close), cursor-multitask (the
main brief at close).

Adjacent: the current `session-handoff` SKILL step 11 (`pnpm check`
cleanliness gate) and the check-singleton-per-window candidate.
Continuity-orphan-commit pattern would land as a new step OR as
amendment to existing step 8 (close collaboration lifecycle).

### 2026-05-22 — Reviewer dispatch has two shapes: fan-from-brief vs fan-from-verdict (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
as amendment to `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md`
§"Two dispatch shapes — fan-from-brief vs fan-from-verdict", with
named decision rule (plan-named reviewer set → fan-from-brief;
contingent → fan-from-verdict).

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: rule-amendment:pre-execution-code-expert-review-per-loop-cycle §"Two dispatch shapes" | trigger-fired: owner-directed promotion | size: S | status: graduated]`

The current pre-execution review rule prescribes fan-from-verdict:
brief code-expert, absorb verdict, dispatch any specialists they
name. This is correct for unknown scopes where the reviewer set
must be discovered.

For named-set cycles (plan-named per-cycle reviewer set), code-
expert is rubber-stamping the named set rather than discovering it.
The serialised hop adds wall-clock without adding signal.

The cure shape: amend the pre-execution review rule to distinguish:

- **Fan-from-brief**: named-set cycles. All plan-named reviewers
  dispatched in parallel from cycle-open. Code-expert runs alongside
  as architectural reviewer, not as router.
- **Fan-from-verdict**: unknown-scope cycles. Code-expert briefed
  first; specialists named in their verdict; specialists dispatched
  after verdict absorbed.

Decision rule: check the plan's per-cycle reviewer set. If
named, fan-from-brief. If contingent/unknown, fan-from-verdict.

Topology-independent. Saves ~one wall-clock hop per named-set
cycle; compounds over sessions.

### 2026-05-22 — Handoff messages must be self-contained (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
at `.agent/rules/handoff-messages-self-contained.md` (canonical rule

- .claude + .cursor forwarders + RULES_INDEX entry). The rule names
  the forbidden patterns, the receiver-cannot-read-transcript principle,
  and the compaction-boundary self-handoff case explicitly.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: rule:handoff-messages-self-contained | trigger-fired: owner-directed promotion | size: M | status: graduated]`

Receiving agents (peer agents, future self after compaction,
cross-platform agents) cannot read the sending agent's transcript.
The handoff message IS the entire information transfer. Without
an explicit rule, the discipline is implicit and inconsistent
across agents.

The cure shape: a rule "handoff-messages-self-contained" enforcing:

- Every fact the receiver needs to act NAMED in the message.
- Every decision NAMED with WHO + WHEN.
- Every artefact named by FILE PATH (not "the earlier discussion").
- Receiver should be able to act WITHOUT a clarifying question back.

Topology-independent. Particularly acute for:

- Cross-platform handoffs (Claude → Codex, etc.).
- Compaction-boundary self-handoffs (my future self cannot read
  current transcript reliably).
- Cross-session peer handoffs (the queue-pickup case).

Adjacent: `start-right-team` SKILL §Continuation Pointer Contract
covers the continuation-record-as-pointer case; the cure here is
broader (every handoff message, not just start-right-team
continuations) and could either amend that section or land as a
distinct rule.

Distinct from "comms event stream canonical truth" (about the
channel) — this is about the substance carried.

### 2026-05-22 — Queue-wait dependency state should be observable (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion, broadened scope)** —
substance landed at `.agent/rules/agent-state-observable.md` (canonical
rule + .claude + .cursor forwarders + RULES_INDEX entry). The rule
broadens the queue-wait-specific case to the general principle "agent
state that affects another agent's next action must be observable",
with queue-wait, long-running sub-agent dispatch, blocked-on-owner,
and gate-runner-role as named applications.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed, broadened) | source: napkin | target-resolved: rule:agent-state-observable (broader principle; queue-wait is one named application) | trigger-fired: owner-directed promotion | size: S → M (broadened) | status: graduated]`

When agent A is blocked behind agent B's commit-queue intent,
A's wait state lives only in A's session reasoning. No external
observable. If A crashes (compaction, network), the wait state
vanishes — B doesn't know A was waiting. If a third agent
arrives, they cannot see A is queued.

The cure shape: when an agent enters "waiting on intent X"
state, emit a directed comms-event to the upstream agent +
audience addition for awareness:

- kind: `directed` (current schema supports it)
- subject: "Waiting on intent X"
- body: my intent ID, my files, expected wait condition
- (eventually) tags: `['queue-wait']` once ADR-183 substrate lands

Makes the dependency graph observable to peers and owner.

Topology-independent. The intent-scope-discipline plan reduces
queue waits structurally; until that lands, the waits exist and
should be visible.

### 2026-05-22 — Owner attention is gated at action-moments (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed experiment)** — substance landed
at `.agent/rules/owner-attention-at-action-moments.md` (canonical rule

- .claude + .cursor forwarders + RULES*INDEX entry) under provisional
  status. Owner direction at promotion:*"if the framing is useful let's
  try it, if it doesn't work we can always change it"\_. Rule is in
  force; friction observed in practice routes back through the
  graduation pipeline for amendment or retirement.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed experiment) | source: napkin §"Insight (9th)" surfaced as question; owner answered to try the framing | target-resolved: rule:owner-attention-at-action-moments (provisional status) | trigger-fired: owner-directed experimental promotion | size: M | status: graduated]`

### 2026-05-22 — Post-compaction resumption needs explicit "did prior edits land?" validation (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
at PDR-063 §"Receiving agent's pickup contract" amendment + new
§"Discontinuity-boundary validation step". The amendment names four
validation checks (prior-edit landing, claim-closure, queue-state,
sub-agent transcript recovery) and makes them mandatory before the
receiver's acknowledgement event. Topology-independence named:
applies to solo session resumption, mid-cycle peer pickup,
compaction-boundary self-resumption, and post-crash recovery.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: PDR-063 amendment 2026-05-22 (discontinuity-boundary validation step) | trigger-fired: owner-directed promotion | size: M | status: graduated]`

Compaction-boundary (and any session-reentry — solo resumption,
mid-cycle pickup, cross-session handoff) is a discontinuity. Prior-
session reasoning is summarised; volatile facts (working-tree state,
recent peer activity) are stale.

My napkin handoff had 7 resumption first-moves. None was "verify
my prior session's edits actually landed somewhere." I assumed
loss; only by grepping file content did I discover prior edits had
been swept into a peer commit. Avoidable redo of work.

The cure shape: extend PDR-063's mid-cycle pickup contract (step 5
in the canonical SKILL "First Moves" section) with a pre-action
validation step:

- If you had staged content at boundary: `git log --since "<boundary>" -- <files>` to check for commits during pause.
- If you had open claims at boundary: check closed-claims archive for closures during pause.
- If you had queued intents at boundary: check queue status for phase transitions during pause.
- If you had pending sub-agent dispatches: check transcript recovery path (per `feedback_subagent_transcript_recovery`).

Topology-independent. Applies to solo resumption (your future self
cannot trust their assumed prior state), mid-cycle peer pickup
(the receiver inherits a stale working tree picture), and
compaction-boundary self-resumption (you are the receiver).

