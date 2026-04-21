## 2026-04-21 (open, memory-feedback-plan session) — Chat-text opener bypassed the authoritative next-session-opener.md

### Surprise

**What was expected**: when the owner asked for a "next-session opening statement" during the memory-feedback-plan session, the statement would be grounded in the authoritative `next-session-opener.md` file if it existed, or composed fresh against current operational state if it did not.

**What actually happened**: I authored the chat-text opener without reading `next-session-opener.md` first. My draft targeted §L-8 WS1 RED reviewer dispatch, drawn from the pre-landing text at `repo-continuity.md § Next safe step`. The authoritative file, already authored after `f9d5b0d2` landed §L-8 WS1+WS2+WS3.1 atomically, targets the Vercel preview acceptance probe for §L-8. The two are materially different; mine was stale.

**Why the expectation failed**: the operational surface has a canonical next-session-opener artefact (`next-session-opener.md`) and a stale-at-the-moment continuity text that mentions §L-8 WS1 pause. I read the continuity text and generated from it, instead of checking whether a more specific, newer artefact owned the question. The shape of this failure is the same shape the 2026-04-21 "fourth-half" napkin entry names: **passive guidance loses to the gravity of the artefact in front of the agent**. The continuity-text section was in front of me; the newer canonical opener was one `ls` call away and I did not make it.

### Pattern instance linkage

This is a second candidate instance of `passive-guidance-loses-to-artefact-gravity` (first: the perturbation mechanisms not firing against the 4th/5th/6th inherited-framing instances). The pattern is promotion-ready when a second *documented-but-not-enforced guardrail* produces a missed catch; this case extends the definition slightly — the "guardrail" here is *authority-order in operational memory* (per PDR-011 and the plane authority order), which I did not honour. Owner decides at next consolidation whether this counts as the second instance or a related-but-distinct pattern.

### What behaviour should change next time

Before authoring any operational artefact (next-session opener, continuity update, plan status note), run a named check: *"Does a canonical artefact already own this field? Is there a `next-session-opener.md`, a workstream brief, a plan status line, or an executive surface that is authoritative for this content?"* If yes, read it first; compose only against its current state, not against a different adjacent surface.

### Candidate tripwire

Extend the Phase 1.2 perturbation-mechanism-bundle PDR (in the memory-feedback execution plan) to include a rule: *"Before writing to any operational-memory surface or authoring session-close content, list the operational files in the relevant directory and verify no more-specific canonical surface owns the field being written."* Rule-layer tripwire per the 2026-04-21 fourth-half candidate-layer table.

### Outcome this session

- The chat-text opener is discarded (correctly — per PDR-011 authority order, the file wins).
- The authoritative `next-session-opener.md` stands unchanged.
- This napkin entry is the capture surface; the meta-pattern is added to `repo-continuity.md § Deep consolidation status` for the next consolidation pass.

---

## 2026-04-21 (open, fourth-half) — Perturbation mechanism is too passive; needs active tripwires

### Surprise

**What was expected**: the three-mechanism perturbation register installed on 2026-04-20 evening (first-principles metacognition prompt + standing-decision register + non-goal re-ratification ritual) would, by the time of the §L-8 atomic landing, have caught at least one of the three plan-body framings the agent inherited this two-session window.

**What actually happened**: zero of the three mechanisms fired before the agent had committed to the inherited framing. All three pattern instances (4th, 5th, 6th) were caught by *external* friction — owner mid-flight intervention (4th), pre-commit hook rejection (5th), type-check failure (6th). The mechanisms are noted in the napkin and in `repo-continuity.md`, but they sit there as *passive guidance* the agent reads (or doesn't) at session-start. None of them is a tripwire that fires automatically on the conditions that produce the failure.

**Why the expectation failed**: passive guidance loses to the gravity of the artefact in front of the agent. The plan body is concrete, present, and prescriptive; the perturbation register is abstract, ambient, and easy to read past. The Heath brothers (Decisive, ch. 9; Switch, ch. 8) name this directly: a tripwire is a pre-committed rule that converts a continuous decision (am I drifting?) into a discrete trigger event (this specific condition just fired, therefore stop and re-evaluate). Tripwires beat vigilance because they offload the watchfulness to the environment.

### What behaviour should change next time

Promote at least some of the three perturbation mechanisms from passive register entries to **active tripwires** — environmental triggers that fire on a named condition without requiring the agent to remember to check. Candidates spanning the available mechanism layers, ordered by cost-to-install (low → high):

| Layer | Tripwire shape | Fires when |
| --- | --- | --- |
| **Always-applied rule** (`.cursor/rules/*.mdc` + `.agent/rules/*.md`) | "Before authoring tests prescribed by a plan body, run the three-clause first-principles check (test-shape, file-naming-vs-landing-path, vendor-API-literals) and surface any failure to the owner before writing code." | Always loaded; checks on test-authoring entry |
| **Pre-commit hook** | "If a commit message claims to satisfy a plan body, refuse to commit until a one-line `Plan-check:` trailer naming the three clauses is present." | Every commit that touches plan-implementation files |
| **Skill** (`.agent/skills/plan-body-tripwires/`) | Codify the three-clause check as a runnable skill that can be invoked from `start-right-thorough` and the GO loop, not just remembered. | Session start + per-WS boundary |
| **Standing-decision register surface** | Lightweight repo-local file (`.agent/memory/operational/standing-decisions.md`) read explicitly by `start-right-quick`/`start-right-thorough`, with each entry carrying an expiry condition and a "supersedes plan non-goals" marker. | Session start, before any plan read |
| **Owner-contradicts-plan friction-ratchet count** | Reviewer dispatch logic that increments a counter when an owner statement contradicts a plan non-goal, then forces an `assumptions-reviewer` pass when the counter passes a threshold. | Mid-session, on owner-correction events |
| **Hook on plan-file open** | Cursor hook that, when a `.plan.md` file is opened in agent context, injects a top-of-file reminder listing the three clauses inline. | Plan file is read |

Variety across layers is itself a perturbation per the existing register entry (2026-04-20 evening) — routinising a single ritual blunts its jogging effect. The right move is to install **at least two complementary tripwires** so that no single failure mode (forgot to read the rule; pre-commit hook bypassed; skill not invoked) leaves the agent fully exposed.

### Pattern instance count

- The 4th, 5th, and 6th instances of `inherited-framing-without-first-principles-check` all happened *after* the perturbation mechanisms were named. The mechanisms themselves are not the failure; their *passive* installation is. This observation is its own pattern candidate: **`passive-guidance-loses-to-artefact-gravity`** — when a guardrail is documented but not environmentally enforced, it does not fire under the precise conditions it was designed to catch. Single-instance observation here (the perturbation register is the artefact under test); promotion-ready when a second documented-but-not-enforced guardrail produces a third missed catch.

### Promotion candidates

- **EXPLORATION CANDIDATE** (next consolidation pass): *"Active tripwires for the perturbation mechanism — design the rule/hook/skill mix that converts the three perturbation mechanisms from passive register entries into environmental triggers. Reference the Heath brothers' tripwire concept (Decisive, ch. 9; Switch, ch. 8) for the underlying decision-theory framing. Sequence: pick two layers from the table above (highest cost-to-install ratio first), draft them, test against the 4th/5th/6th instance conditions, then iterate."* Owner directed this exploration to be noted; not blocking the immediate work.
- **PRINCIPLE CANDIDATE** (`.agent/principles.md` once promoted): *"Guardrails earn their cost only when environmentally enforced. A guardrail that lives only as documented guidance is a watchlist item; a guardrail that fires on a named condition without agent recall is a tripwire."*

### Action this session

- Captured the observation in the napkin (this entry).
- Added the exploration to the queue; not pursued in-flight to keep the §L-8 vercel-probe + session-close work moving per owner direction.
- The two complementary tripwires are NOT being installed in this session — they need a deliberate design pass that surveys the existing rule/hook/skill surfaces against each candidate layer before anything is committed.

---

## 2026-04-21 (open, third-half) — Sixth `inherited-framing-without-first-principles-check` instance: trusted plan-body literal without checking vendor API

### Surprise

**What was expected**: implementing the GREEN body for `createMcpEsbuildOptions` would mechanically translate the plan-body's listed esbuild keys into the factory return value. The plan body (and the test I authored from it) names `sourcemap: 'hidden'`.

**What actually happened**: type-check failed — `'hidden'` is not a valid esbuild `sourcemap` value. The esbuild API is `boolean | 'linked' | 'inline' | 'external' | 'both'`. Sentry's docs use the *word* "hidden" to describe the security posture (`.map` written, no `sourceMappingURL` comment in `.js`), and that posture maps to esbuild's `'external'` mode. The plan's text borrowed the Sentry-doc word as if it were the esbuild value.

**Why the expectation failed**: same pattern, sixth instance. I trusted the plan body's literal token for a vendor API value without checking the vendor's actual API surface. The test I authored from the plan body therefore inherited the same bad token, so it would have masked the type error if I'd written the factory body to satisfy the test's `expect(...).toBe('hidden')` first. Type-check caught it before the build ran.

### Pattern instance count

- **Sixth** instance of `inherited-framing-without-first-principles-check` in this two-session window.
- Now distinct enough as a vendor-API-literal subclass to warrant its own check on the consolidation queue: when authoring tests AND implementations from a plan body that quotes vendor API values, verify those values against the vendor's current type definition before encoding them.

### What behaviour should change next time

Add to the one-line first-principles check a third clause: *"Does this literal token in the plan body match the vendor's current API surface, or is it a doc-level word the plan borrowed?"* The check now has three clauses (test-shape, file-naming/landing-path, vendor-API-literals).

### Action this session

- Replaced `sourcemap: 'hidden'` with `sourcemap: 'external'` in factory + test + TSDoc (both files), with a comment naming the Sentry-docs vs esbuild-API gap so the next reader sees the seam.
- Verified the runtime contract: `tail -3 dist/index.js` shows no `sourceMappingURL` comment; `.map` files are on disk for plugin upload. The Sentry "hidden source map" posture is preserved exactly; only the API value is corrected.

---

## 2026-04-21 (open, second-half) — Fifth `inherited-framing-without-first-principles-check` instance: missed the documented RED file-naming directive

### Surprise

**What was expected**: with RED tests written, type-check + lint clean, and 24/24 failing for the unambiguous expected reason, `git commit` would land the RED-only commit per the spec's WS1 acceptance criteria. The standard TDD red-then-green cadence assumed.

**What actually happened**: pre-commit hook (correctly) refused the commit because the new RED tests fail. Searching the directives revealed `testing-strategy.md` lines 364–369 explicitly states: *"Write RED-phase specs that specify not-yet-implemented behaviour in `*.e2e.test.ts` files, not `*.unit.test.ts`. The pre-commit hook runs only unit tests; a RED unit test blocks every commit until it goes green."* I named the files `*.unit.test.ts` because they ARE unit-shaped (pure function factories with no IO) — but that file extension carries a contract with the pre-commit hook that I didn't check before authoring.

**Why the expectation failed**: same pattern, fifth instance. I inherited the framing "RED-then-GREEN as separate commits" from generic TDD literature without checking the repo's documented RED-landing protocol. The spec named the RED phase as a separate WS1 deliverable, and I assumed that meant a standalone commit. The directive says: in this repo, RED-only landing requires `*.e2e.test.ts` (CI-gated, not pre-commit-gated). RED unit tests must land **with their GREEN bodies** in a single commit.

### Pattern instance count

- **Fifth** instance of `inherited-framing-without-first-principles-check` across the two recent sessions.
- Friction-ratchet threshold for assumptions-reviewer is now reached. The pattern is no longer a "graduation candidate" — it is the dominant failure mode and earns its place at the top of the consolidation queue.

### What behaviour should change next time

Add to the one-line first-principles check, before authoring tests prescribed by a plan body: *"Does the file extension I'm about to use carry a tooling contract (pre-commit, CI gate, lint config) that constrains how/when this file can land?"* The check now has two clauses: (1) is the test-shape right for the Oak behaviour being proven, AND (2) does the test-file naming match the landing path the plan implies.

### Action this session

- Surface the conflict to the owner; present landing-path options A/B/C/D.
- Owner chose (A) go-green-atomic: land WS1 RED + WS2 GREEN + WS3.1 ADR-163 §6 amendment in one commit.
- Capture the 5th instance in napkin BEFORE doing the GREEN work (so the metacognition isn't lost in the implementation rush).

---

## 2026-04-21 (open) — Fourth `inherited-framing-without-first-principles-check` instance caught BEFORE code was written

### Surprise

**What was expected**: execute §L-8 WS1 RED by authoring the three test files the spec lists. Mechanical translation of the spec.

**What actually happened**: while reading the spec against the testing-strategy directive, I noticed all three tests would assert *configuration* or *vendor behaviour*, not Oak-authored product behaviour. I was about to mitigate by inventing a `buildMcpAppEsbuildOptions(env, pluginFactory)` wrapper with an injected fake plugin factory — the exact "complex test setup signals architectural problem" trap the testing-strategy warns against. Owner caught it in-flight before any code was written, citing the same testing-strategy and asking for the "most canonical, idiomatic" esbuild config possible.

**Why the expectation failed**: the spec's three-test framing was itself an inherited shape — the prior session authored §L-8 WS1 with the assumption that integration tests at the build-config boundary were the right level of proof. They are not. The Oak-authored logic worth testing is just the env-to-plugin-config translator (a pure function). The build itself is canonical vendor wiring whose proof is a Vercel preview deployment + Sentry UI state, not an in-process build assertion.

### Pattern instance count

- This is the **fourth** instance of `inherited-framing-without-first-principles-check` across two sessions.
- Three were product-code/test-shape; one was assertion-kind in a probe rewrite.
- Pattern is **graduated** — it has earned a permanent home in `.agent/memory/active/patterns/`. Next consolidation pass owns the move.

### What behaviour should change next time

Before authoring tests prescribed by a plan body, run a one-line first-principles check: *"What Oak-authored behaviour does this test prove? Could a single pure-function unit test prove the same thing simpler?"* If the answer is "no Oak behaviour, just configuration or vendor wiring," the test belongs in a smoke phase against the live system, not in a RED phase that drives in-process implementation.

### Action this session

- Pause WS1 RED execution.
- Dispatch test-reviewer + architecture-reviewer-betty + assumptions-reviewer in parallel as intent-reviews against the proposed simplification (one pure-function unit test + canonical esbuild config; smoke evidence in WS4/WS5).
- Resume execution against the revised plan once findings synthesised.

---

## 2026-04-20 (evening close) — Memory taxonomy, prompt dissolution, and the testing-strategy violation caught mid-flight

### Surprise

**What was expected**: porting a health-probe check from the legacy
continuation prompt to the new `repo-continuity.md` would be a
path-and-field-name rename. Mechanical.

**What actually happened**: the rewrite faithfully preserved the
*kind* of assertion the old code made — "these specific section
headings must exist in the markdown file" — and that kind of
assertion is a testing-strategy violation (configuration-assertion,
not behaviour-assertion). Owner caught it mid-flight, citing
`testing-strategy.md`: tests prove product behaviour, not
implementation or configuration.

**Why the expectation failed**: inherited-framing pattern, third
instance this session. First: tsup-retention non-goal inherited from
prior plan draft. Second: agent talked itself out of owner's
three-day-standing esbuild decision. Third: agent translated old
probe assertion shape forward without asking whether the assertion
*kind* was right. Each time the failure mode was the same — the
artefact in front of the agent outweighed a first-principles check
of whether the artefact's shape was correct.

### What behaviour should change next time

Pattern has clarified enough to name as `inherited-framing-without-first-principles-check`.
Applies especially to:

- Non-goals in drafted plans
- Assertion-kind in legacy tests or probes being rewritten
- Any "translate old X to new X" exercise

Countermeasure: when rewriting an existing artefact, before editing,
ask "what is this artefact *for*? Is its current shape the right
shape for that purpose?" Not "what did it look like before?"

### Promotion candidates

- Pattern graduation candidate: `inherited-framing-without-first-principles-check`
  as a named learning-loop pattern. Already three instances in one
  session, which passes the repeats bar. Next consolidation pass
  extracts to `.agent/memory/active/patterns/`.
- **Docs-as-DoD invariant landed** at `.agent/memory/operational/repo-continuity.md § Repo-wide invariants / non-goals`
  (no separate docs phase; every lane's REFACTOR gate carries the
  docs sub-tasks).
- **Testing-strategy invariant made explicit** in the same block:
  "Tests prove product behaviour, not configuration."
- **PDR-026 Per-Session Landing Commitment** graduated to Practice Core.
- **Orientation directive** installed; layering contract now
  doctrine, not prompt copy.

### Session work summary (for the next session's ground check)

Landed this session across multiple commits:

1. **OAC Phase 4 close** (`d876506c`) — continuation prompt retired
   to 145 lines, portability posture decided (no promotion), six
   surfaces propagated, PDR-011 amended.
2. **Plan drift sanitisation** (`363037af`) — tsup-framed plan
   content reverted; owner-beats-plan invariant installed.
3. **§L-8 re-plan** (`effa6cd6`, `d771ec73`, `8945e1e6`) —
   esbuild-native migration folded into the maximisation plan's
   §L-8; plan-time assumptions-reviewer pass applied; Phase 3a/3b
   alpha-vs-beta-gate split propagated.
4. **Observability deferrals** (`62efc55c`) — L-9, L-12, L-13, L-14
   deferred to public beta with specific reopen conditions.
5. **Perturbation-mechanism framing** (`d50412f0`) — three
   candidates noted as complementary layers.
6. **Memory taxonomy restructure** (`feba4a12`) — three-mode
   `active/operational/executive` split; ~200 reference
   propagation.
7. **Prompt dissolution** (`b637346c`) — session-continuation prompt
   deleted; doctrine to PDR-026 and orientation directive; rituals
   to start-right-quick and session-handoff.
8. **Wiring review remediation** (this commit) — reviewer findings
   applied to practice-index, OAC plan, roadmap, ADR-125, ADR-144,
   consolidate-docs, go.md, AGENT.md, tracks README, .gitignore,
   .agent/README, observability-strategy-restructure.

Next session opens on Sentry integration at §L-8 WS1 RED.

---

## 2026-04-20 (late) — The original note turned out to be the right structural brief

### What Was Done

- After the fourth, more audience-shaped update missed the owner's desired
  feel, created a fifth document at
  `.agent/reference/work-to-date/oak-ecosystem-work-to-date-summary-2026-04-20.md`
  by returning much more directly to the original note's structure.
- Removed the research-instruction wrapper, kept the note-style sectioning
  (`Already done`, `Currently working on`, `Next directions`, `Future`),
  added only a small number of highlights surfaced by the longer report,
  and lightly tidied the wording.

### Lesson

- **When the owner provides a note-shaped brief, the note's structure may
  itself be part of the requirement**: later editorial "improvements" can
  solve the wrong problem if they replace the original organising shape
  instead of clarifying it.

---

## 2026-04-20 (late) — Audience-first update needed a fresh artefact, not more patching

### What Was Done

- Implemented a fourth document at
  `.agent/reference/work-to-date/oak-ecosystem-progress-update-2026-04-20.md`
  as the new audience-facing progress update, written from scratch
  rather than by iterating again on the snapshot.
- Updated the outward reader routes in `README.md` and
  `docs/foundation/README.md` so the main guidance now points at the
  new update instead of the heavier report.

### Lesson

- **When the audience model changes, the document often needs to change
  identity as well as wording**: a patch can improve tone, but if the
  underlying frame is still repo-first the result keeps pulling back
  towards insider language and structure. Fresh artefact, fresh frame.

---

## 2026-04-20 (late) — Separate value layers must be named, even in short docs

### What Was Done

- Re-read the note, long report, and compact snapshot after owner
  feedback that the snapshot still underplayed two distinct value
  layers: the deliberately modular engineering structure as leverage
  for future innovation, and the Practice as a transferable agentic
  engineering support system in its own right.
- Revised the snapshot to name both explicitly without letting the
  document expand back into report form.

### Lesson

- **Compactness is not the same as flattening**: a short synthesis can
  stay light and upbeat while still naming the separate sources of
  value, as long as each is expressed once, clearly, and in the right
  place.

---

## 2026-04-20 (late) — Snapshot != report

### What Was Done

- Re-read the original work-to-date note and the longer progress report
  after owner feedback that the report had missed the brief.
- Authored a third artefact,
  `.agent/reference/work-to-date/oak-ecosystem-progress-snapshot-2026-04-20.md`,
  designed as the thing the note had actually asked for: compact,
  upbeat, accurate, and lighter in tone.

### Lesson

- **Document form must match the job, not just the available insight**:
  a concise progress snapshot and a flagship report are different
  artefacts, even when they draw on the same underlying understanding.
  Better insight should sharpen a light document, not automatically turn
  it into a heavier one.

---

## 2026-04-20 (late) — Work-to-date artefacts consolidated under reference

### What Was Done

- Moved the current progress report and the original request note into
  `.agent/reference/work-to-date/` so the "work to date" artefacts now
  live together.
- Updated live references in root surfaces, continuity, and active plan
  artefacts to point at the new paths.

---

## 2026-04-20 (late) — Plan-surface integration for 8 direction-of-travel uplift candidates

### What Was Done

- Executed plan-surface integration session against the prompt at
  `.agent/prompts/agentic-engineering/governance-planes-research-and-reporting.prompt.md`.
  Answered the top unresolved question from the practice-aligned
  direction-of-travel research: "is the existing
  `agentic-engineering-enhancements/` plans surface sized to absorb
  the 8 uplift candidates?"
- Answer: **yes — because 6 of 8 are not plan-shaped work.** Only
  Candidate 1 (reviewer-systems cluster) expands an existing plan's
  scope. Only Candidate 6 (MCP governance deep dive) justifies a new
  plan file. The other 6 are research notes, scope checks, artefact
  refreshes, or route to a different lane.
- Landed 6 actions:
  1. Expanded `reviewer-gateway-upgrade.plan.md` with three
     direction-of-travel scope items (machine-readable reviewer
     artefact, per-team learning loop, RFC 9728 PRM audit)
  2. Archived two completed execution plans (ACH, GCM) from
     `active/` to `archive/completed/`
  3. Created `future/mcp-governance-deep-dive.plan.md` with
     explicit promotion trigger
  4. Routed vocabulary-alignment candidate to OAC Phase 4 Task 4.3
  5. Added durable integration routing register to the analysis
     baseline (8-row table with dispositions and trigger conditions)
  6. Added direction-of-travel integration section to lane README

### Correction — "defer" is not durable without recording

**What I initially proposed**: "defer with trigger condition" as a
disposition — but with the trigger condition recorded only in the
plan file, not in any durable surface the deferred candidate lives in.

**Owner correction**: "defer needs to be record and defer, otherwise
the information will be lost."

**Causal mechanism**: a "defer" decision that exists only in the
session plan file or conversation is ephemeral. The next session
working on the analysis baseline or plans surface won't find the
trigger condition because it's in a different file (the plan) that
isn't on the read path for that surface. The fix: record the trigger
condition in the analysis baseline itself, co-located with the
candidate it governs.

**Pattern candidate**:
**`defer-decisions-must-live-where-the-candidate-lives`** — when
deferring a candidate, record the trigger condition in the same
artefact that defines the candidate, not in a session plan or
conversation. Single-instance observation; repeats criterion is a
second deferred candidate whose trigger condition was discovered
missing from its home artefact.

### Surprise — Planning complexity may justify the planning specialist

**Expected**: the 60-artefact plans surface is manageable with manual
routing and the existing `docs-adr-reviewer` for documentation aspects.

**Actual**: this integration session required reading all 60 artefacts,
classifying 8 candidates across 5 disposition types, updating 7 files,
archiving 2 plans, creating 1 new plan, and recording a durable
routing register. The `docs-adr-reviewer` handles documentation quality
but lacks the plan-architecture lens (lifecycle stages, promotion
triggers, scope-and-sequencing, density invariants, absorption-vs-new-
plan decisions). Owner observed this is the level of complexity that
justifies a specialist planning sub-agent.

**Evidence for promotion of `future/planning-specialist-capability.plan.md`**:
The plan's prerequisites are "recurring plan-quality issues plus a
stable planning architecture." This session provides one data point
for "recurring plan-quality issues" (plan-surface routing is complex
enough to benefit from specialist review). The planning architecture
itself is stable (ADR-117 lifecycle, roadmap + active/current/future
structure, status legend, documentation sync discipline). A second
plan-surface integration session that independently surfaces the same
need would meet the repeats criterion.

### Additional action — Planning specialist promoted

Owner approved promotion of `planning-specialist-capability.plan.md`
from `future/` to `current/` (QUEUED). Scope expanded to include
integration routing, trigger condition durability, archival hygiene,
and backlog health. Promotion evidence, scope expansion, and next
execution trigger recorded in the plan. Roadmap, lane README, current/
README, and future/ README all updated.

### Watchlist

- **`defer-decisions-must-live-where-the-candidate-lives`** — single
  instance. Repeats criterion: second deferred candidate whose trigger
  condition is found missing from its home artefact.

---

## 2026-04-20 (final) — Metacognitive report revision

### What Was Done

- Deep metacognitive examination of the repo using five parallel
  exploration agents (Practice/memory, agent infrastructure, technical
  architecture/ADRs, product/search/MCP implementation, research
  pipeline). Identified significant underconveyed novelty across all
  four achievement arenas.
- Revised `.agent/reference/work-to-date/oak-ecosystem-progress-and-direction-2026-04-20.md`
  to surface mechanisms behind claimed properties: plasmid exchange
  with provenance chain, three-type continuity model, fitness functions
  on governance documents, experience records, compile-time
  accessibility compliance, MCP-aware Sentry rewriting, Result-type
  exhaustiveness, non-mutating env resolution, non-bypassable
  redaction barrier, friction-ratchet counter, cross-platform session
  takeover, automated portability enforcement. Added new "research
  pipeline" section with scale figures and notable future directions
  (Finnish curriculum, EEF evidence, knowledge graphs).
- Replaced quantitative MRR claims with qualitative descriptions per
  owner direction that ground-truth/evaluation systems are still being
  refined.

### Correction

- **Quantitative search claims are premature**: owner flagged that MRR
  figures are approximate and should not be reported until the
  ground-truth and related systems are refined. Replaced with
  qualitative language ("strong retrieval quality", "reliably surfacing
  the correct lesson in the top results"). This applies to any
  future external-facing document.

### Lessons

- **Metacognition as a report-quality tool**: the metacognitive process
  (thoughts → reflections → insights) surfaced the gap between
  "describing properties" and "revealing mechanisms" — the distance
  between a pitch and evidence. Reports that claim self-improvement
  or portability without naming the engineering that makes the claim
  true read as aspirational. The revised report names specific
  mechanisms for every claim.
- **Five parallel exploration agents is an effective examination
  strategy**: dividing exploration by concern (Practice, agent infra,
  technical arch, product depth, research pipeline) produced
  complementary findings with minimal overlap. Each agent found things
  the others missed.

---

## 2026-04-20 (evening) — Owner-beats-plan invariant + perturbation-mechanism learning

### Surprise

**What was expected**: a session running with the `4bccba71` guardrails
(build-vs-buy attestation, friction-ratchet, sunk-cost-phrase detector,
plan-time reviewer scheduling) would resist drifting back into the
sunk-cost protection of a prior plan's non-goals.

**What actually happened**: the agent (this session) folded a drafted
plan whose non-goals included *"Do NOT replace tsup with raw esbuild"*
and carried that non-goal forward as a constraint, despite the owner
having stated for three days that the decision is to switch to esbuild.
When the owner asked "just checking the intent is to switch to esbuild"
the agent answered "No, keep tsup" — precisely backwards.

**Why the expectation failed**:

1. The plan file's drafted non-goals outweighed the owner's stated
   decision in conversation. Mechanism: each new agent session loads
   the plan text fresh and treats its non-goals as inherited
   constraints; the owner's standing decision lives in conversation
   history that the plan file does not reference.
2. "No more fantasising optionalities" was mis-read as "stick to the
   plan as written." The owner meant the opposite — stop generating
   tsup-retention alternatives against the esbuild decision.
3. Asymmetric burden of proof: "keep tsup" became the default requiring
   no argument, "switch to esbuild" became the change requiring
   justification. The owner had already decided; the asymmetry should
   have been the opposite.
4. Sunk-cost detector applied to one half ("953 lines of bespoke is not
   a retention reason") but blinded to the other half ("tsup config
   already exists is not a retention reason when the plugin doesn't
   work with it"). Same anti-pattern, caught on one side only.
5. Verification stopped at API surface ("tsup exposes `esbuildPlugins:
   Plugin[]`"), missing the runtime integration failure the owner had
   lived through for three days. Confirmed via GitHub issues
   sentry-bundler #614, #608, tsup #1260 — stub resolution breaks plus
   source-map upload silently uploads nothing because `onEnd` fires
   before tsup writes files.

### What behaviour should change next time

1. **Owner's word beats plan. Always.** When a plan's non-goals, design
   decisions, or scope contradict an owner statement, the owner wins
   without argument. Non-goals are not load-bearing against owner
   direction.
2. **Non-goals are suspect by default.** Non-goals are where previous
   agent sessions' sunk-cost reasoning hides. Every session executing
   against a plan with non-goals must re-read them with the owner
   before acting.
3. **Friction-ratchet should count owner-contradicts-plan as a
   first-class signal.** Currently counts tactical friction against a
   shape. Should also count "owner has said X, plan says not-X".
4. **Perturbation mechanisms needed** (plural, complementary) to jog
   the agent out of plan-text-inherited local minima. The three
   candidates below address DIFFERENT failure modes at DIFFERENT
   session phases and are **complements, not alternatives**. Variety
   of perturbations is itself a perturbation — routinising a single
   ritual blunts its jogging effect over time.

   | Mechanism | Fires when | Failure mode caught |
   | --- | --- | --- |
   | First-principles metacognition prompt — "what would I be doing if I hadn't read the plan?" | Before reading anything in the session | Framing collapse before the agent's own reasoning is primed |
   | Standing-decision register — a repo-local surface recording owner decisions with expiry conditions, read BEFORE the plan | During grounding, before plan read | Owner decisions stated in conversation that haven't landed in a plan yet |
   | Non-goal re-ratification ritual — for each plan with a non-goals section, list the non-goals and confirm against recent owner direction | While reading a plan, per non-goal encountered | Non-goals inherited from prior plan drafts that contradict current owner direction (this session's specific failure mode) |

   **Rationale for "all three, not one"**: defence in depth against a
   class of drift that is costly when it slips through; each
   mechanism addresses a distinct failure mode the others don't
   cover; use-time selection lets sessions apply what fits; empirical
   use picks favourites better than design-time reasoning.
   Earlier framing of this entry said "pick one" — that was
   premature optimisation for parsimony when the real target is
   preventing a class of drift.

### Promotion candidates

- **INVARIANT** (authoritative, repo-continuity): *"Owner's stated
  direction outranks any plan's non-goals, design decisions, or scope.
  When a plan and the owner disagree, the plan is wrong."* LANDED at
  `.agent/memory/operational/repo-continuity.md §Repo-wide invariants` this session.
- **RULE candidate** (always-applied): a rule forcing the non-goal
  re-ratification ritual before execution against any plan with a
  non-goals section. Draft for next consolidation pass.
- **PRINCIPLE candidate** (`principles.md`): generalise the owner-
  beats-plan invariant into a Practice-level principle about standing
  decisions vs. artefact text.
- **PDR candidates** (all three, drafted as complements): promote
  the three perturbation mechanisms to Practice Core as a bundle —
  one PDR for the layered model itself (defence-in-depth against
  plan-inherited framing) plus three lightweight artefacts (one per
  mechanism). Next consolidation pass owns this drafting.

---

## 2026-04-20 (later) — `docs/foundation/` overhaul to timeless-only + ecosystem progress report delivered

### What Was Done

- Authored `.agent/reference/work-to-date/oak-ecosystem-progress-and-direction-2026-04-20.md`
  end-to-end: synthesised vision / plans / roadmaps / Practice
  surfaces into a self-contained, public-audience progress and
  direction report. Two reviewer passes (`docs-adr-reviewer` +
  `assumptions-reviewer`) caught factual errors (M2 lane status,
  KG audit, Clerk shipped/specialist confusion, version number,
  Practice fitness gate, gate classifications) and tonal drift
  (overclaim softening; safeguarding scope reframed as a current
  roadmap boundary; "frontier for years" softened to "multi-year
  option pipeline"; leverage phrasing made punchier without
  overclaim).
- Overhauled `docs/foundation/` to a **timeless-only** boundary
  per owner direction. Deleted `strategic-overview.md` (subsumed
  by `VISION.md` + reports + plan) and `quick-start.md` (redundant
  with root `README.md` Quick Start + `CONTRIBUTING.md`).
  Surgically rewrote `VISION.md` to remove all dated content
  (capability status table, "What Changes At Public Alpha" section,
  Current-baselines snapshot, ADR/MRR/gate counts) while keeping
  the timeless mission/audience/value/non-goals/three-orders/
  positioning frame. Added the no-learner-facing-surfaces boundary
  to the non-goals list. Slimmed `docs/foundation/README.md` to a
  30-line index pointing at `VISION.md` + `agentic-engineering-system.md`
  + Practice surfaces. Bumped `last_reviewed` on the Practice doc.
- Redirected ~17 active surfaces away from the deleted docs:
  root `README.md`, `CONTRIBUTING.md`, `docs/README.md`,
  `docs/architecture/README.md`, `docs/architecture/openapi-pipeline.md`,
  `docs/operations/environment-variables.md`,
  `docs/governance/README.md`, `docs/domain/curriculum-guide.md`,
  `docs/engineering/build-system.md`,
  `apps/oak-curriculum-mcp-streamable-http/README.md`,
  `apps/oak-search-cli/README.md`, `.agent/HUMANS.md`, three
  active plans (sentry-otel-integration, doc-architecture phase A,
  onboarding-simulations), and both onboarding-reviewer adapter
  templates (`.agent/sub-agents/templates/` and `.claude/agents/`).
  Historical material in `.agent/memory/active/archive/`, `.agent/plans/archive/`,
  and `.agent/research/documentation-audit-report.md` deliberately
  left untouched as historical record.
- Closed a discoverability gap from the deletion by adding a
  pointer in the root `README.md` "Next steps" block to
  `docs/domain/DATA-VARIANCES.md` and the schema-first execution
  section of `docs/architecture/openapi-pipeline.md`.

### Surprise — Active plans contain residual prescriptions, not just links

**Expected**: redirecting cross-document links would close the
overhaul. After updating ~14 surfaces with simple link fixes I
was ready to declare done.

**Actual**: the second-pass `docs-adr-reviewer` flagged that two
active plans (`doc-architecture-phase-a-immediate.plan.md` and
`onboarding-simulations-public-alpha-readiness.md`) didn't just
*link* to the deleted `quick-start.md` — they *prescribed edits
against it* (where to place a C4 diagram; which doc owned a
quality-attribute register; an open finding `N15` whose
remediation target was the deleted file). Pure link-redirection
would have left those plans pointing future contributors at a
file that no longer exists.

**Causal mechanism**: link redirection treats every reference as
a navigation target. But active plans use references in two
distinct modes: navigation (where to read context) and
prescription (where to edit). Prescriptive references against a
deleted file silently turn into "do impossible thing"
instructions. The first pass swept for the navigation mode and
missed the prescription mode entirely.

**Pattern candidate**:
**`when-deleting-a-doc-sweep-active-plans-for-prescriptions-not-just-links`**
— before declaring a doc-deletion done, search active plans
specifically for instructions whose *target* is the deleted file
(not just whose context mentions it). Single-instance
observation; repeats criterion is a second deletion where a
prescription survived a link-only pass.

### Corrections / learnings

- **Reviewer phasing for documentation work mirrors the code-work
  pattern**: dispatching `docs-adr-reviewer` and
  `architecture-reviewer-barney` *in parallel* against the new
  structure caught complementary classes of finding —
  docs-adr-reviewer found residual references and discoverability
  gaps; architecture-reviewer-barney challenged whether the
  reduction was real or merely displaced. Single dispatch would
  have caught one class only.
- **Cursor-side plans are platform-ephemeral, canonical artefact
  is the deliverable**: the foundation-overhaul and progress-report
  plans live in `.cursor/plans/`. Per the consolidate-docs
  guidance ("delivered platform plans should be referenced as
  canonical artefact, not as the plan path"), these plans are
  delivered evidence; future references should point at the
  `docs/foundation/` shape and the report file, not the plan
  paths.
- **Markdownlint `--fix` runs across staged area**: running
  markdownlint on a small set of files actually fixed several
  unrelated repo-wide whitespace nits. Not a problem; worth
  knowing that the fix flag has wider blast radius than the
  argv list suggests.

### Out of scope (explicit non-actions)

- Did **not** touch the OAC Phase 4 / plugin-migration lane.
- Did **not** trigger deep consolidation; the existing "due"
  status with OAC/observability framing is unchanged and the
  consolidation pass should be run deliberately from that lane.
- Did **not** edit ADRs, the high-level plan, or any other
  governance content beyond the `docs/foundation/` boundary and
  link-target updates.

---

## 2026-04-20 (evening) — OAC Phase 1–3 executed; tracks-are-tracked correction; plugin-migration plan drafted

### What Was Done

- Promoted `operational-awareness-and-continuity-surface-separation.plan.md`
  `current/` → `active/` (commit `153fc9aa`) with a 2026-04-20 addendum
  to the Phase 0 baseline reflecting the bespoke-to-plugin pivot,
  `4bccba71` guardrail installation, and deep-consolidation-due status.
  Cross-references updated across 9 surfaces (collection READMEs,
  roadmap, adjacent plans, deep-dives, analysis baseline,
  session-continuation prompt, integration report).
- Marked OAC Phase 1 complete (`d0cd54e2`): Design Contract +
  operational-awareness-and-state-surfaces.md deep-dive already
  satisfied Task 1.1 + 1.2 before promotion.
- Reconciled L-7 and L-8 in sentry-observability-maximisation-mcp.plan.md
  (`1fb4ac66`): L-7 bespoke → `completed`; L-8 `dropped` → `pending`
  (un-dropped as the forward lane). L-8 section body rewritten to name
  the prior `PARKED` rationale as the sunk-cost framing the `4bccba71`
  guardrails are designed to catch.
- Executed OAC Phase 2 (`ffcad2aa`): created `.agent/memory/operational/`
  (`repo-continuity.md` + `workstreams/`) + `.agent/memory/operational/tracks/`
  scaffolding, added OAC-Pilot sections to `session-handoff` + `GO` +
  `session-continuation.prompt.md` with explicit pilot-phase framing.
- Drafted sentry-esbuild-plugin migration plan (`4cbc8843`) as task #22
  using the new `feature-workstream-template.md`. Build-vs-Buy
  Attestation filled in with six surveyed integrations; Reviewer
  Scheduling ordered plan-time → mid-cycle → close; WS0 dispatches
  `assumptions-reviewer` + `sentry-reviewer` PRE-ExitPlanMode. Flagged
  plan-density-invariant tension for owner decision (fold into
  maximisation §L-8 vs pair-archive).
- Executed OAC Phase 3 pilot (`9a973939`): ran scenarios 1, 4, 5, 6
  deliberately; evidence at
  `.agent/analysis/operational-awareness-pilot-evidence.md`. All four
  pass. Calibration decision: PROMOTE.
- Owner-authored artefacts committed: `84abfeb8` (work-to-date brief),
  `d20fc397` (ecosystem progress report + Cursor plan pair).

### Surprise — Tracks-are-tracked, not gitignored (design-shape inversion)

**Expected**: tactical track cards are runtime, thread-aware,
session-local state that shouldn't propagate across checkouts — the
Phase 2 design treated them as gitignored with only `.gitkeep`
preserved.

**Actual**: owner correction mid-Phase-3: "multiple agents and devs in
multiple locations could be collaborating on a track via git". The
collaboration channel IS git; single-writer-per-card still holds;
multiple cards per collaborative track disambiguate via the
`<workstream>--<agent>--<branch>.md` naming convention.

**Causal mechanism**: the Phase 2 design inherited "tactical
coordination = runtime = ephemeral = local" as a tacit chain. Each
link sounds right in isolation but the "= local" conclusion was never
examined against the actual collaboration shape (cross-location,
multi-agent, multi-session). This is the same class of error as the
L-7 build-vs-buy miss: a shape decision made without checking the
collaboration / vendor-integration assumption at the decision moment.

**Pattern candidate**:
**`collaboration-shape-is-an-unexamined-assumption-in-new-artefact-types`**
— when introducing a new artefact type, explicitly check the
collaboration shape (single-process / cross-process / cross-location /
cross-agent / cross-session) before defaulting to a lifecycle
treatment. Single-instance observation; repeats criterion is a
second design where collaboration shape surfaced as a mid-cycle
correction.

### Surprise — Menu-ification of clear decisions

**Expected**: AskUserQuestion with 3–4 options per question is the
right shape when owner decisions are ambiguous.

**Actual**: owner pushed back: "what are you talking about, we know
exactly how to proceed". The three questions I posed were
manufacturing optionality on decisions the owner had already made
clearly in the previous messages.

**Causal mechanism**: the plan-mode Phase 1–5 workflow encourages
structured clarification via AskUserQuestion. But structured
clarification becomes menu-ification when the options I list include
paths that are not live — the owner's direction implicitly rules out
at least one option, and posing it again signals inattention to the
direction given.

**Pattern candidate**:
**`ask-the-minimum-not-the-maximum-when-direction-is-clear`** —
AskUserQuestion is the right tool when decisions are genuinely open;
it is the wrong tool for walking the owner through options they've
already closed. When in doubt, state what I think the next action is
and let the owner correct, rather than listing alternatives they've
already foreclosed. Single-instance; repeats criterion is a second
moment where a 3-option question is better served by a declarative
"next I'll do X" statement.

### Corrections / learnings

- **Commitlint `subject-case`**: subjects must not be sentence/start/
  pascal/upper-case. "OAC" in a subject line fails. Lowercase the
  subject; use uppercase freely in the body. Watch for this in any
  future acronym-heavy commit title.
- **Track card rotation rule holds**: the resolve/promote/delete
  discipline works mechanically in the scenario-4 exercise. No helper
  needed for markdown-first; automated expiry check is a Phase 4
  refinement candidate, not a pilot blocker.
- **Plan-density invariant bit at the execution boundary**: authoring
  the plugin-migration plan required a new file in the observability
  directory, triggering the density rule. The substance was
  un-blocked (the plan exists, drafted cleanly), but the file-count
  invariant is in tension with "one plan per execution lane" at the
  boundary where an un-dropped lane needs its own plan. Owner's
  resolution pending next session: fold into maximisation §L-8 vs
  retain standalone with pair-archive.

### Key insight

The two surprises name the same structural pattern at different
layers: **a choice made without checking its implicit assumption**.
The track-card gitignore assumption (local-only collaboration) and
the menu-ification assumption (owner-decision-is-still-open) are
both instances of "the shape wasn't wrong; the question that shaped
it wasn't asked". This is the same root as the L-7 build-vs-buy
miss. The `4bccba71` guardrails address the build-vs-buy instance
specifically; the broader pattern — "check the implicit assumption
at the shape-decision moment" — is worth watching for a third
instance before promoting.

### Lessons for next session

- Resume from `.agent/memory/operational/repo-continuity.md`, not from
  `.agent/prompts/session-continuation.prompt.md`'s `Live continuity
  contract`. The prompt's contract section is legacy as of OAC Phase 3
  PROMOTE decision; the state surfaces are authoritative.
- Start Phase 4 by deciding the plugin-migration plan-density-
  invariant resolution (fold vs pair-archive) — that decision is
  blocking for plugin-migration WS0 dispatch.
- Phase 4 folds in four pilot refinements: rename primary-brief
  field, clarify authority-order language, decide on expiry-check
  helper, decide on napkin-promotion helper.
- Plugin-migration WS0 reviewers (`assumptions-reviewer` +
  `sentry-reviewer`) fire PRE-ExitPlanMode per the new guardrails.

---

## 2026-04-20 — L-7 bespoke orchestrator built then pivoted + guardrails installed

### What Was Done

- Landed L-7 Sentry release/commits/deploy linkage bespoke orchestrator (commits `7f3b17e9` + `6f5acd17` + `ecee9801`): resolver split (`resolveSentryEnvironment` + `resolveSentryRegistrationPolicy`), OTel tag rename `git_sha` → `git.commit.sha`, four-file TypeScript orchestrator invoked by `tsx` from Vercel Build Command, 21 integration tests with fakes-as-arguments, ADR-163 §6.0 probe amendment, Vercel wiring. ~900 lines total.
- Owner surfaced in one question that `@sentry/esbuild-plugin` (the vendor's first-party bundler plugin) would eliminate most of this bespoke code. Pivot decision: delete the orchestrator, switch to the plugin. Bespoke commits kept as signal; plugin-migration plan queued.
- Installed six metacognition lessons as process guardrails (commit `4bccba71`) across four repo surfaces: `assumptions-reviewer`, `code-reviewer`, `docs-adr-reviewer`, three plan templates.
- Committed research-thread cross-lane direction-of-travel work (commit `162f767e`, owner-authored).
- Committed sentry doc-drift snapshot (`89bf86ab`) before plugin migration — signal, not throwaway.

### Patterns to Remember

- **Build-vs-buy precedes build-shape.** Weighed `.sh` vs `.mjs` vs `.ts` at plan time. Three bespoke shapes. Never asked "should we write our own?" The vendor plugin was the cheapest option and was never on the list. ADR-163 §6's six CLI commands were inherited as the problem statement rather than questioned as one realisation of a spec.
- **ADRs that prescribe HOW not WHAT foreclose alternatives.** ADR-163 §6 listed six specific `sentry-cli` invocations with per-step abort/warn postures. Once written, "amend the ADR to match implementation" became the path of least resistance. When the ADR was amended for the §6.0 probe, the calcification deepened. ADRs should state the outcome the vendor must reach; the realisation belongs in the implementing plan.
- **Friction is aggregate signal, not per-point friction.** Five ratchets fired against the bespoke shape: lint size/complexity caps triggering file splits; type-import cycle; reviewer finding requiring MORE code (the §6.0 probe); ADR amendment; eslint-config ignores exception. Each was individually principled; cumulatively they were the repo telling me the shape was wrong. A counter at three+ would have fired.
- **Sunk-cost reasoning leaks into recommendations.** Final defence was "we'd need to verify the plugin supports our `--release + -e <env>` combination exactly" — protecting the shape of argv we chose. Argv shape was never the requirement; Sentry UI state was. When hedging on whether vendor-canonical meets a spec we invented, that's sunk-cost framing in recommendation form.
- **Review phase matters as much as review volume.** Plan had every reviewer tranche scheduled post-commitment. `assumptions-reviewer` was LAST (after docs). Owner had to request a mid-session "extra tranche" which caught the commit-attribution-overwrite issue — but even that ran inside the frame "is this orchestrator sound?" not "should this orchestrator exist?". Owner's extra-tranche request was a phase-misalignment signal, not a volume signal.
- **Vercel `vercel.json.buildCommand` overrides the Dashboard UI.** Per official docs: "This value overrides the Build Command in Project Settings." One reviewer agent earlier had muddled this and I repeated it unchecked. Verified in the actual Vercel docs page, corrected. Lesson: reviewer output is not authoritative on vendor behaviour — always check the vendor's own docs before asserting.

### Mistakes Made

- Inherited ADR-163's implementation framing without questioning whether the ADR was asking the right question. The whole orchestrator was wrong-shape; every reviewer I invoked operated inside that frame; none asked "should this exist?"
- Scheduled `assumptions-reviewer` last in the plan's reviewer matrix. That is maximally expensive to act on a shape finding. Owner had to manually request it mid-session.
- Defended argv shape as if it were the requirement, when it was an implementation detail I had chosen. Sunk-cost preservation disguised as technical rigour.

### Key Insight

**The reviewer tranche the caller dispatches inherits the caller's frame.** If the frame is "is this orchestrator well-structured?", downstream reviewers answer that question. "Should this orchestrator exist?" dies at the dispatch point or nowhere. Solution-class challenge must be framed by the caller, and must happen pre-ExitPlanMode, because that is the only phase where acting on "this should not exist" is cheap. Installing this as a rule (assumptions-reviewer new Triggering Scenarios + Key Principles + "Not This Agent When" mid-session rejection) is the structural fix.

### Lessons for Next Session

- The session-continuation prompt is now 1545 lines — its own complexity is the self-referential drift risk the owner flagged. First task next session: find + apply the decomposition plan.
- Deep consolidation is DUE. Not running it in this handoff per owner direction to move to a fresh session. The decomposition work in the next session is the natural carrier for the consolidation pass — do both together.
- Plugin-migration plan MUST use the new `feature-workstream-template.md` with Build-vs-Buy Attestation + Reviewer Scheduling filled in. This tests whether the guardrails work in practice.

---

## 2026-04-20 — practice-aligned project-directions research (broad-before-deep)

### What Was Done

- Implemented the `practice-aligned_project_directions_research_ea215686.plan.md`
  end-to-end across four slices + analysis baseline + routing.
- Slice A: trajectory analysis for 15 governance-plane projects with
  five cross-project trajectory patterns and per-project repo-local
  implications. Roadmaps/RFC/SEP records preferred; release notes as
  fallback; `trajectory weak` flagged where neither present (Prow,
  Bee/Beeai).
- Slice B: practice-methodology ecosystem reconnaissance (AGENTS.md,
  Agent Skills as the open standard, plugin marketplaces, AAIF as
  steward, cross-tool path normalisation). One note in
  `operating-model-and-platforms/`; no new lane.
- Slice D: adjacent-enabler reconnaissance (evals/scorers, context
  engineering, agent-native observability, agent-native code review,
  agent-native VCS). One cross-cutting note in
  `operating-model-and-platforms/` with explicit per-lane
  cross-references. No new lane.
- Slice C: cross-lane survey at the lane root, one section per
  existing lane, evidence linked back to A/B/D source notes rather
  than re-cited.
- Phase 2: `practice-aligned-direction-and-gap-baseline.md` analysis
  with two matrices (direction-signal × practice-intention; lane ×
  signal coverage) re-using the
  `governance-concepts-and-mechanism-gap-baseline.md` status legend
  and shape so the two baselines compose.
- Phase 3: explicit decision to produce **no new report this
  session**, with prerequisites named (no upstream
  direction-of-travel deep dive yet; baseline untested by any plan).
- Phase 4: routing surfaces updated (research lane README,
  governance-planes README, operating-model README, analysis README,
  governance integration report back-link, governance-concepts
  baseline back-link).

### Surprise

- **Expected**: Slice A's 15 governance-plane projects would show
  divergent direction signals; the research would have to pick winners.
- **Actual**: Five direction signals recur across all four slices —
  hardened persistence, schema-first declarative surfaces, identity/
  OAuth modernisation, three-primitive convergence under AAIF, and
  telemetry/evals/supervision merging. The ecosystem is converging,
  not diverging. The repo's intention surface is **directionally
  well-aligned** with the convergence; the interesting work is
  mechanism uplift, not direction change.
- **Causal mechanism**: the slices were chosen to cut the same
  ecosystem from four angles (governance-plane projects;
  practice-methodology primitives; adjacent enablers; cross-lane
  re-routing). Convergent signals across all four cuts is stronger
  evidence than convergence inside any single cut.

### Corrections / learnings

- **Assumptions-reviewer pre-pass paid off twice**: (i) it caught
  proportionality drift in the original four-way fan-out and forced
  parent-led reconnaissance with deferred subagent use, saving
  significant agent dispatch; (ii) it added the "no new lane until
  evidence proves it stable, non-overlapping, and beneficial for
  discovery" fence, which in turn justified placing Slice B and Slice
  D in `operating-model-and-platforms/` instead of inventing two new
  lanes that would have churned the lane map.
- **The Practice five-file package is conceptually a plugin**: Claude
  Code and Cursor independently arrived at: manifest at root,
  namespaced skills, bundled artefacts, marketplace with manual
  review, team-controlled subset. The bootstrap-script propagation in
  ADR-124 sits in the same conceptual category as the plugin format.
  This is a noted-but-not-acted-on alignment opportunity (Slice B
  routing recommendation only).
- **Two principles transferable without external dependency**:
  "treat persisted state as untrusted by default" (MS Agent Framework
  `1.0.1`, LangGraph `4.0.2`, Dapr April 2026) and "policy engine
  performs no normalisation; normalise once at the perimeter" (Dapr).
  Both are recorded as principles in the analysis baseline; both
  are deferred until applicability surfaces emerge.
- **`derived-memory-and-graph-navigation` lane has the thinnest
  external direction signal of any lane**: not because the lane is
  undirected, but because the four slices under-sample the
  graph-memory ecosystem. A future research pass scoped specifically
  to that ecosystem would close the gap. Recorded as a routing
  recommendation only.

### Watchlist (single-instance, not yet ready to distil)

- **`assumptions-reviewer-pre-pass-shrinks-fan-out-and-tightens-fences`** —
  running an assumptions-reviewer pass on a multi-slice research plan
  before launch produces (a) proportionality reduction and (b)
  doctrine fences that pay off during execution. Not yet a pattern
  candidate; needs a second instance.
- **`convergent-direction-across-multiple-research-cuts-is-stronger-evidence`** —
  when four parallel research slices all surface the same direction
  signals, the convergence itself is the finding. Repeat criterion:
  observe a second cross-cut research effort whose convergent
  patterns match this one, then promote.
- **`practice-five-file-package-is-conceptually-a-plugin`** —
  watchlist for whether plugin-format wrappers should ship alongside
  the bootstrap script. Trigger condition: a downstream consumer
  asks for plugin-marketplace install of the Practice package.
- **`reviewer-systems-cluster-is-the-densest-uplift-cluster`** —
  three high-signal candidates (machine-readable handoff, per-team
  learning loop, RFC 9728 audit) all point at the same plan
  (`reviewer-gateway-upgrade.plan.md`). If the plan absorbs them
  cleanly, the cluster shape itself is a routing pattern worth
  promoting.

### Pattern To Remember

- All four candidates above are **single-instance** observations from
  this session and stay on the watchlist. Not yet promotion-ready.

### Unresolved

- **Top unresolved question** (recorded in the analysis baseline):
  is the existing `agentic-engineering-enhancements/` plans surface
  sized to absorb the eight high-impact uplift candidates without
  churning into low-signal work? A scope-and-sequencing pass on the
  plans surface should precede picking up any candidate.

---

## 2026-04-20 — reflection on "repos as governance planes"

### What Was Done

- Read `.agent/research/agentic-engineering/governance-planes-and-supervision/repos-as-governance-planes.md`
  and compared its framing against the repo's lived governance surfaces:
  `AGENT.md`, the start-right workflow, `practice-core/index.md`,
  `practice-index.md`, ADR-119, ADR-124, ADR-125, the cross-platform
  agent surface matrix, and the completed observability-primitives
  consolidation plan.

### Surprise

- **Expected**: the research note would mostly describe future-state
  infrastructure that this repo only gestures toward.
- **Actual**: this repo already behaves much more like a governance
  plane than many "agent frameworks" do. The governance is versioned,
  executable, portable, and layered across canonical content,
  platform adapters, entry points, reviewer dispatch, plans, memory,
  and validation surfaces.

### Corrections / learnings

- **This repo is stronger where the note says the ecosystem is weak**:
  the note identifies a missing open standard for machine-readable
  contribution contracts; this repo approximates one locally through
  directives, rules, commands, skills, ADRs, plans, hooks, platform
  matrices, and portability contracts. The contract is repo-native
  rather than ecosystem-standard.
- **The repo's distinctive move is portability of governance itself**:
  ADR-124 and ADR-125 turn governance artefacts into a travelling
  package plus local bridge, so the repo is not only governed; it can
  propagate its governance model to other repos.
- **The strongest evidence is closure discipline, not just file count**:
  the completed observability-primitives plan shows governance as an
  execution surface with reviewer routing, invariants, proof, and
  closure evidence, not a passive documentation layer.

## 2026-04-19 — L-7 adjudication + ADR-163 authored and Accepted (post-rotation session)

### What Was Done

- Owner adjudicated 6 L-7 open questions (release identity, SHA
  provenance, release-creation location, source-map interaction,
  deploy-event scope, pipeline boundary) during the consolidation
  closeout.
- Verified the owner's intended mechanism against Sentry + Vercel
  current docs via `sentry-reviewer` agent + direct WebFetch calls.
  Owner redirected mid-research: "use the proper tools, not arbitrary
  scripts" — switched from dispatching the `vercel:deployment-expert`
  agent to direct WebFetch for Vercel docs.
- Authored initial ADR-163 draft. Owner pushback: "unacceptable
  degree of uncertainty; Sentry documentation is clear; all decisions
  and all uncertainties must be resolved and recorded in the
  appropriate plans and documents." Rewrote ADR-163 to eliminate
  every open question by naming previously-implicit decisions
  (CLI noun form, per-step error handling, pipeline attachment shape,
  idempotency posture, runtime contract changes, hotfix policy).
- L-7 lane body in maximisation plan fully rewritten as a mechanical
  transcription of ADR-163 §6 with explicit RED/GREEN/REFACTOR,
  orchestrator script shape, and acceptance criteria.
- Fixed documentation drift in 6 surfaces:
  `docs/operations/sentry-deployment-runbook.md` (SENTRY_RELEASE
  fallback said SHA; corrected to semver),
  `docs/operations/sentry-cli-usage.md` (added release-linkage
  sequence), `upload-sourcemaps.sh` (WHEN-TO-RUN now says semver only),
  `apps/.../docs/observability.md`, `apps/.../docs/vercel-environment-config.md`,
  `packages/libs/sentry-node/README.md`.
- Owner accepted ADR-163 in same session ("1 yes, 2 yes"). Status
  flipped Proposed → Accepted with History entry. L-7 implementation
  authorised. All stale "Proposed" references to ADR-163 cleaned up
  across session-continuation prompt + ADR index.

### Surprise

- **Expected**: an ADR that recorded the owner's 6 adjudicated answers
  would be sufficient to close the uncertainty.
- **Actual**: the 6 answers implicitly settled 6 more decisions
  (CLI form choice, abort-vs-continue posture per step, pipeline
  attachment shape, idempotency of `releases new`, per-env-var
  runtime contract additions, hotfix discipline). Owner pushback
  "all decisions and all uncertainties must be resolved" forced a
  second pass that enumerated every latent decision, not just the
  explicitly-asked ones.
- **Causal mechanism**: a list of questions frames the uncertainty
  the asker is *aware of*. Answering that list resolves those
  questions but leaves downstream decisions the questions did not
  name. An ADR that is genuinely decision-complete must sweep for
  decisions the questioner did not think to ask. Pattern candidate:
  **`decision-complete-adr-enumerates-implied-questions`** — when
  adjudicating a named question list, enumerate every downstream
  decision that the explicit answers *require* and record each
  explicitly, even ones the asker did not raise.

### Corrections / learnings

- **Agent-vs-WebFetch for doc research**: Owner's direction "use
  the proper tools, not arbitrary scripts" interpreted as: prefer
  direct `WebFetch` for authoritative-doc research over dispatching
  a specialist agent that will itself fetch the docs. `WebFetch` is
  the cheaper, more legible path when the need is "read doc X and
  extract facts Y, Z". Agents are right when the need is genuinely
  interpretive (reviewer judgement, cross-source synthesis). Pattern
  candidate: **`prefer-webfetch-for-doc-citation-prefer-agent-for-
  judgement`**.

- **Sentry CLI noun-form drift is real**: the legacy
  `sentry-cli releases deploys VERSION new -e ENV` form still works
  but the current CLI reference documents `sentry-cli deploys new
  --release VERSION -e ENV`. Codifying ONE form only (ADR-163 §6.6
  rejects the legacy form) eliminates drift between docs and
  scripts. Watchlist: **`prefer-one-form-over-both-work-drift-
  avoidance`**.

- **Debug IDs are THE symbolication key; `--release` on sourcemaps
  upload is optional but kept**: Sentry's Debug-ID era means the
  symbolication key is embedded in the JS itself, not the release
  string. `--release` on `sourcemaps upload` creates a weak
  association (UI navigation benefit). Oak keeps it for the UI
  benefit but ADR-163 §6.4 documents that Debug IDs alone would
  suffice. Watchlist: **`symbolication-key-vs-ui-association-are-
  separate-concerns`**.

- **The existing GitHub release workflow + Vercel ignoreCommand
  already enforce the "one version-bump commit per production
  build" invariant**: L-7 scope does NOT change `release.yml` or
  `vercel-ignore-production-non-release-build.mjs`. L-7 only adds
  the Sentry CLI sequence inside the Vercel Build Command. This
  was a discovery surprise — the plan body had previously implied
  L-7 would touch the GitHub workflow; it will not.

- **Vercel has no post-deploy hook**: everything happens inside the
  Build Command. The single-orchestrator shape (ADR-163 §7) flows
  from this constraint — pre/post-build hooks don't exist, and
  chaining CLI steps with bash `&&` cannot express per-step
  abort-vs-continue postures.

### Pattern To Remember

- **`decision-complete-adr-enumerates-implied-questions`** (new,
  single instance) — promotion-ready if a second instance occurs
  where an explicit adjudication-question list left downstream
  decisions unnamed.

- **`prefer-webfetch-for-doc-citation-prefer-agent-for-judgement`**
  (new, single instance) — calibrates when to use agent dispatch
  vs direct doc fetching.

---

## 2026-04-19 — napkin rotation (second rotation of the day)

### What Was Done

- Archived outgoing napkin to `archive/napkin-2026-04-19b.md`
  (~1679 lines — well above the 500-line rotation threshold). The
  morning's first rotation already landed as `napkin-2026-04-19.md`;
  today's evening session required a second rotation because the
  primitives-consolidation planning + execution + three-sink wiring
  surprises all accumulated on the same day.
- Previous rotation: 2026-04-19 (morning) at the end of the
  observability-planning-restructure session.
- This rotation preserves: the primitives-consolidation EXECUTION
  session (top), the PLANNING session, the three-sink wiring
  session, the L-DOC initial session, the L-EH initial session, and
  the Phase-5 honest-evaluation conclusions. Each lives in the
  archive for durable reference.

### Watchlist carried forward (single-instance, not yet ready to distil)

These live on this new napkin as the active observation set. They
move to distilled only on a second independent instance in a later
session. Ordered by how structurally load-bearing each candidate is
if it recurs.

- **`work-stream-dissolution-via-upstream-fix`** — a fix-to-root-cause
  can absorb a downstream remediation listed as a separate work
  stream. Planning should check after each upstream step lands
  whether the downstream item is still needed. (From the WS6
  dissolution in the primitives-consolidation execution.)
- **`reviewer-matrix-completeness-is-not-absolute`** — plan-level
  reviewer lists are discretionary, not prescriptive; owner
  concurrency control and the law of diminishing returns shape
  actual dispatch. (From the mid-session owner "stop all streams"
  interrupt.)
- **`turbo-cache-hides-prettier-drift-until-pre-commit`** — trust the
  pre-commit hook for the authoritative format verdict; turbo's
  cached `format:root` can say "nothing to do" while pre-commit
  prettier finds drift. (From the first commit attempt failure.)
- **`amend-not-honour-when-simplification-surfaces-post-decision`** —
  an ADR decision made without the full consumer graph visible can
  be amended when a later review with the broader view finds it
  over-decomposed. Architectural excellence trumps ADR honour.
  (From the ADR-160 fold amendment.) **Strong candidate to
  graduate to PDR on second instance.**
- **`duplicate-type-load-bearing-at-three-consumers`** — a duplicated
  type across two workspaces is tolerated until the third import
  site; at three, canonicalisation is forced. (From the JsonValue /
  TelemetryValue unification pressure.) **Strong candidate for
  `.agent/memory/active/patterns/` on second instance — general engineering
  observation.**
- **`core-tier-means-primitive-not-just-dependency-pure`** — workspace
  tier is about primitive-ness as well as dependency purity. A
  composition-only workspace does not meet core-tier's "atomic
  primitive" spirit even when its deps are all in core. (From the
  139-LOC composition workspace rejection.)
- **`safety-layers-stack-not-nest`** — a harness-level safety hook
  (e.g. `scripts/check-blocked-patterns.mjs`) is not automatically
  subordinate to in-conversation owner authorisations. Safety
  layers stack; they do not nest under permission. (From the
  `--no-verify` attempt.)
- **`git-status-is-a-snapshot`** — session-open `git status` is a
  snapshot; parallel agents may have staged substantial work by
  mid-session. Re-read status fresh before any destructive git
  operation. (From the 47-file staged-parallel-work incident.)
- **`closure-principles-absorb-cardinality-changes`** — when an ADR
  is phrased as a closure principle (all fan-out paths apply the
  redactor) rather than an enumeration (five named hooks),
  cardinality changes (three sinks, not two) land without ADR
  amendment. (From the three-sink wiring against ADR-160 / ADR-162.)
- **`reviewer-as-option-cartographer-not-decision-maker`** — reviewer
  findings frame the option space; owner rulings settle within
  it. The reviewer's job is to surface the alternative; it is not
  to prescribe which alternative wins. (From the two BLOCKER
  overrides during three-sink wiring.)
- **`date-suffixed-frontmatter-is-a-smell`** — novel frontmatter
  fields earn their place by being reusable across documents and
  across edits; date-suffixed fields lock the document to its
  authoring moment. Renamed `companion_explorations_2026_04_19:` to
  `informed_by:`.
- **`tier-scope-must-be-explicit-for-shared-vocabulary-invariants`** —
  invariants written for one tier (plans) get conscripted into
  governing adjacent tiers (explorations) unless the scope is named
  explicitly. Plan Density Invariant required a "Scope
  clarification" addition.
- **`code-embodied-policy-without-explicit-ruling-needs-tsdoc-pointer`** —
  when code embodies an unwritten policy decision, the holding
  pattern is: TSDoc at the call site points at the open exploration
  that owns the ruling. (From `observability.setUser({ id: userId })`
  in `mcp-handler.ts`.)
- **`forward-pointing-planning-references-need-planned-markers`** —
  plans that cross-reference workspaces, files, or dirs that do not
  yet exist on disk must label those references explicitly. Readers
  should not infer existence from a reference. (Moved from distilled
  2026-04-19 as still single-instance — re-watchlist on second
  occurrence.)
- **`in-place-supersession-markers at section anchors`** — when a
  doc receives a status reframe, in-place markers are needed at
  every section-level anchor that external surfaces reference, not
  only at the document head. (From the capability-matrix §7 /
  Q6 reviewer finding.) **Third instance reached — promotion-ready
  per the previous napkin's annotation.**
- **`fork-cost-surfaces-in-doc-discipline-layer`** — three-instance
  pattern where architectural forks propagate as doc-discipline
  issues before they surface as architectural ones. **Third
  instance reached — promotion-ready.**

### Promotion-ready (already ≥2 cross-session instances — surfaced to owner at this consolidation)

These sit above the napkin and should be graduated this pass per
step 7 of `jc-consolidate-docs`. See the consolidation report in
this session's response to the owner for the graduation list and
proposed destinations.

- **`reviewer-findings-applied-in-close` (three instances: L-EH
  initial, L-DOC initial, primitives consolidation execution)** —
  reviewer findings land in the closing atomic commit as the
  default, not as follow-up queue items. Deferral requires written
  rationale.
- **`E2E-flakiness-under-parallel-pnpm-check-load` (three cross-
  session instances)** — first aggregate `pnpm check` run fails on
  an E2E test; isolation rerun passes 161/161; second aggregate
  run passes. Third instance 2026-04-19. **Name a test-stability
  lane.**
- **`reviewer-catches-plan-blind-spot` (≥2 instances, now
  promotion-ready)** — reviewer real-code audit catches a plan's
  own blind spot that the plan's decomposition did not anticipate.
- **`externally-verifiable-output-beats-plan-compliance` (already in
  distilled from single-instance observation; now multiple
  confirmations)** — forward-motion assurance is an external
  artefact (cell populated, test passes, command exits 0), not
  plan-compliance narrative.

---

Previous rotation: 2026-04-19 (morning) at ~500 lines.
Today's second rotation: 2026-04-19 (evening) at ~1679 lines.
