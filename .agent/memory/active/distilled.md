---
fitness_line_target: 350
fitness_line_limit: 500
fitness_char_limit: 28000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
fitness_rationale: "Raised 2026-05-17 (Swift Winging Gust) per owner direction after the structural pass: the 2026-05-14 multi-agent deep-dive and 2026-05-17 gate-green cascade landed durable substance that, after archiving the graduations-log and back-cite blocks, leaves ~455 lines of high-signal cross-session learning. Previous limits (target 200 / limit 275 / chars 16500) were calibrated when distilled content volume was lower; substance growth is legitimate and preservation outranks fitness pressure. The new envelope keeps refinement pressure on without forcing premature graduation of recent (still-ripening) entries. Falsifiability: if substance later compresses naturally below the previous envelope, the limits should be lowered again at the next consolidation."
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before
every session. Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-16.md` through `napkin-2026-05-10.md`
(sessions 2026-02-10 to 2026-05-10).

**Permanent documentation**: Entries graduate to permanent docs
when stable and a natural home exists. Always graduate useful
understanding — fitness management handles the consequences. What
remains here is repo/domain-specific context with no natural
permanent home, plus entries explicitly held pending validation.

**Earlier graduations audit-trail archived (2026-05-22)**: the
2026-05-06, 2026-05-09 (Woodland Sheltering Glade), 2026-05-10
(Quiet Lurking Mask), and 2026-05-11 (Verdict-not-menu Flamebright
Burning Lava) graduation blocks moved to
[`archive/distilled-graduations-log-2026-05-14.md`](archive/distilled-graduations-log-2026-05-14.md)
§ "Backfill rotation 2026-05-22 — earlier graduations blocks moved
from distilled.md". Substance lives at named permanent homes
(PDR-057, PDR-058, PDR-018 amendment, PDR-026 amendment,
`agent-collaboration.md` directive amendments,
`.agent/rules/present-verdicts-not-menus.md`,
`.agent/rules/practice-core-portability.md`,
`.agent/rules/directive-file-context-budget.md`,
`.agent/rules/validators-must-recompute-not-just-record.md`,
`.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`,
`.agent/rules/no-moving-targets-in-permanent-docs.md`,
`docs/governance/development-practice.md` § Documentation Practice,
`.agent/memory/operational/collaboration-state-lifecycle.md`).

**Meta-observation (2026-05-09 historical-napkin-synthesis)**: the
fitness-as-trim impulse is doctrine-resistant under context
pressure. Three independent corrections in 2026-05-06 → 2026-05-09
on the same shape — agents reflexively trimming substance when
fitness signals fire. Two structural cures captured as
pending-graduations entries: lifecycle-aware fitness model and
active inline discipline-reminder text in fitness-validator output
at non-healthy zones. Source: §F1 of the synthesis report under
`research/agentic-engineering/continuity-memory-and-knowledge-flow/`.

---

## Recently Distilled — 2026-05-22 owner-profile observations from `.remember/` plugin (Wooded INPUT-curation pass)

These observations were extracted by the `.remember/` plugin's Haiku
distillation pass over owner messages spanning 2026-04-24 → 2026-05-13
and surfaced as `IDENTITY CANDIDATE` rows in `.remember/recent.md`.
Owner directed (2026-05-22) that they be promoted to `distilled.md` as
durable cross-session collaboration knowledge. Each observation names a
working pattern of this owner and what it implies for any agent
collaborating with them.

### Phased gated activation beats big-bang integration

Owner prefers staged rollout of new infrastructure (plugins,
frameworks, multi-agent topologies) gated on validation evidence
before broad adoption. When proposing new infrastructure, present
plans with explicit gates between stages, not monolithic integration
sequences. Expect "let's prove this in a corner first" feedback on
broad introductions; offer the corner explicitly. Source:
`.remember/recent.md` IDENTITY CANDIDATE 1.

### Wire tools into the existing capture-and-distil flow, not parallel to it

Owner invests in feedback-loop tooling that converts observation into
durable substance: `.remember/` → `/jc-consolidate-docs`, napkin →
distilled → graduate → enforce, comms-event → graduation. When
proposing new tooling, the first question is "does this hook into the
existing capture/distil/graduate flow?" not "what shape does this take
in isolation". Parallel tracking surfaces are anti-pattern. Source:
`.remember/recent.md` IDENTITY CANDIDATE 2.

### Surface emergent patterns for graduation as soon as they're clear

Owner formalises repeated patterns through the explicit graduation
process rather than leaving them tacit. When a behaviour repeats
across two sessions and the substance is clear, surface it for
graduation; don't wait for a folkloric "third confirmed instance"
gate if the doctrine is already evident. The pending-graduations
buffer absorbs the ambiguity. Source: `.remember/recent.md` IDENTITY
CANDIDATE 3.

### Pause for missing validation rather than proceed on assumed evidence

Owner is willing to PAUSE a workstream rather than advance on
assumed validation or unresolved external blockers. If the evidence
an action depends on is not yet in hand, the right move is "we
should pause until X arrives" rather than "we can proceed assuming
X". State the assumed evidence explicitly and let owner choose;
don't quietly bridge the gap. Source: `.remember/recent.md` IDENTITY
CANDIDATE 4.

### Multi-agent friction is an infrastructure problem, not a workaround occasion

Owner treats coordination friction as a protocol-level concern
requiring infrastructure solutions (commit-queue, claim model,
comms-events, sidebars, gate-runner election). When surfacing a
coordination friction, frame it as "what protocol gap does this
reveal?" rather than "how do we work around this once?" Workaround
proposals consistently get redirected to structural cure. Source:
`.remember/recent.md` IDENTITY CANDIDATE 5.

### Principle violations get reverted, not deferred

Owner will undo substantive work to maintain principle compliance
rather than land a compromised state. Never offer "we could ship
this with a known principle violation and clean it up later" — the
clean-up-later path is consistently rejected. Cure shapes must be
principled at the moment of landing; if the principled cure is not
ready, the work waits. Source: `.remember/recent.md` IDENTITY
CANDIDATE 6.

### Destructive incidents cure through structure, not through more care

After destructive incidents (lost work, accidental commits, hook
bypass), owner's cure is structural: new rules, new hooks, new
SKILL amendments, new schema constraints — not exhortations to "be
more careful". When surfacing a near-miss, propose a structural
cure (hook, rule, schema, protocol change), not a behavioural
intention. Capability is preserved by gating, not by removal.
Source: `.remember/recent.md` IDENTITY CANDIDATE 7.

### Consolidation surfaces are first-class observability infrastructure

Owner treats `pending-graduations.md`, frictions register, napkin,
distilled, repo-continuity as observable infra, not bookkeeping.
Lifecycle tags (`pending` / `due` / `overdue` / `graduated`) carry
load-bearing meaning; HARD-zone fitness warnings are signals to act,
not nags to ignore. Keep these surfaces accurate as-you-go;
out-of-date status fields produce silent doctrine drift. Source:
`.remember/recent.md` IDENTITY CANDIDATE 8.

## Recently Distilled — 2026-05-22 multi-agent dual-lane + compaction-boundary window

### Read `--help` first on any agent-tools CLI before its first use in a session

Cheap (~1s); cure for silent type confusion when flag naming mismatches
verb-vs-noun convention (`claims close --closed`, `comms send` without
`--thread`/`--to` flags, `comms reply` body-parsing layered failures). The
agent-tools CLI surface grew rapidly during 2026-05-21/22 — assumed-flags
from a sister command often miss. Multiple sessions hit the same shape
(Soaring, Salty, Foamy, Wooded). Source: napkin 2026-05-22 archive L116,
L279, L856.

### Re-ground git state immediately before staging on any session running > ~1h

Parallel-cohort branches mutate in real time even during "solo" sessions; the
all-channels watcher catches it but if the watcher is deferred (plan-mode
work), the pre-stage `git log -8` + `git status` re-ground is the substitute.
Soaring jumped HEAD from `38b49645` to `ac893ca7` (4 commits) during one
session and almost staged against stale grounding. Source: napkin 2026-05-22
archive L69.

### Hyphenate `PR-#NNN` (or rewrap so `#` is mid-line) when referencing issues in prose

Markdownlint MD018 (no-missing-space-atx) treats line-start `#NNN` as an ATX
heading marker missing its required space. Paragraph wrap can push such tokens
to line-start unpredictably. `PR-#108` is still legible and lint-stable.
Source: napkin 2026-05-22 archive L102.

### Owner-given unblock hints during selective pause need explicit scope

`[Ferny-only]` vs `[all-paused-may-use]`. Without explicit scope, paused agents
should stay paused and surface "I see an unblock for the unpaused agent; does
it apply to me?" rather than self-routing. Same-instant duplicate writes
(S4036 hotspot Ferny + Midnight) are the failure mode this rule prevents.
Source: napkin 2026-05-22 archive L556.

### Sonar MCP `show_security_hotspot.comments` is NOT the rationale carrier

The MCP mutation accepts a `comment` parameter, but `show_*` returns
`comments: []` and exposes no `changelog` field. Audit trails MUST be verified
via REST `/api/hotspots/show?hotspot=KEY | jq .changelog`, not via MCP. Plans
citing MCP `comments` for rationale visibility are wrong. Source: napkin
2026-05-22 archive L584.

### Plan-as-source-of-truth supersedes coordinator brief on workspace/path/key specifics

Coordinator briefs are short-form recall and can lose fidelity vs the plan
they cite. Implementer reflex on substance: re-read the plan section before
executing against the brief. Surface divergence as a routing-correction
event, proceed against plan, not brief. Source: napkin 2026-05-22 archive
L612.

### Docker MCP: check `docker mcp tools ls --format json` before declaring MCP namespace absent on Codex

When a Codex session reports "no `mcp__sonarqube__` namespace", the Docker
MCP gateway may still expose the same tools at a different surface. CLI
syntax is positional tool name + `key=value` arguments (NOT JSON payload).
When the secrets-engine socket is missing
(`/Users/jim/Library/Caches/docker-secrets-engine/engine.sock` absent), the
gateway starts the container with empty env and the container fails
initialize with EOF — the secrets-engine `ls` is the diagnostic, the EOF is
the symptom. Source: napkin 2026-05-22 archive L689, L637.

### Revision-tranche verification: re-read ORIGINAL defect location, not just intended-cure location

A BLOCKER fix that adds new content without removing the contradicting
original content leaves a regression. Spot-verify must re-read the
defect area in the new file, not just the new-content area.
architecture-expert-fred caught the regression on PDR-066 L242 ("Strict
readers ignore unknown optional fields by construction") that the first-pass
BLOCKER fix was supposed to remove. Source: napkin 2026-05-22 archive L438.

### assumptions-expert on a PDR-SET (not per-PDR) surfaces cross-PDR coupling defects

Per-PDR reviewers (architecture-expert-fred) check correctness in isolation;
set-scope reviewer surfaces cross-coupling defects — PDR-065 imports PDR-066
`tags` namespace as hard dependency AND adds a third tag value within the
same Proposed-status window, foreclosing PDR-066 §Open Question 1 before its
second-instance trigger. When drafting a related PDR set in one session,
dispatch the proportionality reviewer against the set. Source: napkin
2026-05-22 archive L839.

### Compaction-boundary handoff differs from session-close handoff

Compaction replaces conversation history with a summary; the SAME session
continues post-compaction. The handoff's priority is
**conversation-only-substance flushing** — load-bearing context (cron
expressions, /loop instructions, topology agreements, verbatim prompts)
MUST land in durable surfaces (thread record, napkin, repo-continuity)
BEFORE the compaction, because the summary does not preserve it reliably.
Empirical: persistent-monitor contracts may or may not survive compaction
(non-deterministic — Shaded and Mistbound monitors both invalidated;
Wooded's monitor survived once but cannot be relied on). Post-compaction
agents MUST verify cron + monitor on first wake-up. Source: napkin
2026-05-22 archive L1019, L1108.

### Metacognition produces structural cure, not doc patch

When a defect's root cause is "documentation surface can drift from
implementation", default the cure to "make documentation generated by the
implementation" (executable bootstrap CLI emitting canonical invocation),
not "fix the current copy of the documentation". Doc patches are once-cures;
structural cures amortise across future agents. The `/jc-metacognition`
directive — *"the bridge from action to impact"* — forces evaluating cures
by whether they recur-proof, not whether they fix today's instance. Source:
napkin 2026-05-22 archive L945.

### Dual peer-primary topology is structurally distinct from coordinator+helpers

Two primary agents on file-disjoint lanes, each running its own /loop +
watcher, each owning its own sub-agent fan-out, no coordinator mediating.
Routing is direct peer-to-peer via comms; owner is the only escalation
surface above. Distinguishes from coordinator+helpers (one authority,
helpers don't own lanes) and from specialists+generalists (stratification
by capability scope). The /loop heartbeat + claim discipline are
load-bearing — without them silent-peer detection and file-collision
prevention break. Falsifiability: repeated cross-peer claim collisions or
owner spending more attention routing between peers than a coordinator
would, falsifies the topology. Source: napkin 2026-05-22 archive L970,
L1051.

### Catalogue-not-block resolves SKILL/standing-memory tension on advisory fitness

Standing memory `all-quality-gates-blocking-always` and SKILL §commit
advisory carve-out are NOT contradictory when classified correctly: the
carve-out applies when (a) the failure is the advisory sub-check, (b) the
bundle introduces zero new violations, (c) the bundle drains pre-existing
signal, (d) the catalogue is recorded in the commit body. Standing memory
fires against DISMISSAL or NEW violations; it does NOT fire against
drain-with-catalogue. Worked instances: `5b8635c4` (Blustery Stage 1a),
`77463a22` (Flamebright Cycle 1). Source: napkin 2026-05-22 archive L329,
L755.

### `--body-file <path>` is the cure for shell-quoting hazards on agent-tools CLI bodies

When body content contains backticks (markdown code fences, inline-code
spans), double-quoted `--body "..."` triggers shell command-substitution
even on substituted file content. Cures: (a) single-quoted `--body '...'`,
(b) `--body-file /tmp/path.md` (the CLI reads the file literally, bypassing
shell interpretation). The agent-tools CLI now exposes `--body-file` on
`comms append/send/direct/reply`. Default to it when authoring any
non-trivial event body. Source: napkin 2026-05-22 archive L409, L856.

---

## Recently Distilled — 2026-05-17 Swift Winging Gust pipeline-reframe

### Surface classification routes fitness response — buffers are not memory

The knowledge-flow pipeline has **four distinct surface kinds**, each
with a different correct response to fitness pressure:

| Surface kind | Examples | What fitness pressure means | Correct response |
|---|---|---|---|
| **Memory** | napkin, distilled, patterns/ | Substance has matured; needs durable home | Graduate upward (per PDR-046 Move 3) |
| **State** | repo-continuity, threads, claims, conversations, comms log | Historical prose accumulated | Archive per `split_strategy` |
| **Buffer** | pending-graduations, capture queues | **Downstream consumer is bottlenecked** | Pipeline diagnostic at producer or consumer; never extend the buffer |
| **Doctrine** | ADRs, PDRs, rules, principles, governance docs | Doc outgrew its split point | Split along its axis |

The "Learning Preservation Overrides Fitness Pressure" rule enumerates
memory and state surfaces; it does **not** apply to buffers. Buffer
substance is supposed to be transient — accumulation past envelope IS
the structural signal worth listening to, never an instruction to grow
the envelope.

### Pipeline back-pressure is information, not a defect

`capture → distil → graduate → enforce` is a flow with rates, not a
chain of files. A full buffer with fitness alarms means producer-rate
is exceeding consumer-rate over the consolidation window. Four
candidate bottlenecks to diagnose (not all hold for every instance):

- **Consumer cadence too low**: graduation only fires at consolidation
  passes. Non-consolidation sessions never drain. Cure: lighter-weight
  trigger-scan pass that any session can run.
- **Trigger conditions unscannable**: many entries gate on
  "owner-direction" or "second-instance-fired-elsewhere" but nothing
  systematically scans for fired triggers across sessions. Cure:
  capture-time discipline on trigger conditions that can actually be
  re-checked.
- **Producer doctrine-drafting in the buffer**: entries grow to
  60-150 lines with function-tests and "Recommended shape" verdicts.
  The buffer entry becomes a draft for the eventual artefact. Cure:
  buffer-shape contract at capture time — tag header + ≤15 lines of
  trigger-to-watch-for, doctrine drafting at the target home.
- **Capture over-eagerness**: not every promising idea needs a register
  entry. Ripe candidates should graduate immediately; substance-but-
  not-yet-stable belongs in distilled.md as held-pending-validation.

Worked instance 2026-05-17 (Swift Winging Gust): I framed
pending-graduations.md's CRITICAL fitness signal as a substance-
preservation question and proposed a modest limit raise. Owner
reframed twice — first that the file had become "an essay" not a
buffer; second that the right question is "why has the pipeline
become a broken accumulator instead of a flow-control mechanism."
The substance-preservation rule had over-reached its surface scope.
Falsifiability: a repeat consolidation pass that runs producer-rate
vs consumer-rate diagnostic and identifies a specific upstream
bottleneck demonstrates the reframe. Routing: PDR candidates in
pending-graduations register; consumer-cadence and capture-shape
cures are pipeline-repair work for a future session under owner
direction.

### Doctrine-first vs first-principles is cognitive-approach diversity

Owner observation 2026-05-17: when corrections recur, they often
follow a recognisable shape — agent applies a doctrine-match move
(fast, consistent, transferable); owner reframes at the structural
layer (slow, novel, doctrine-extending). This is **diversity, not
deficiency**. Both reasoning shapes have evolutionary fit:

- **Doctrine-first** scales when doctrine is complete and the
  situation is in-distribution. Failure mode: when the rule has a
  hole or the situation is out-of-distribution, lexical match reaches
  for the nearest rule even when none fits structurally.
- **First-principles** scales when the situation is novel or doctrine
  is incomplete; produces structural insights that grow the doctrine.
  Failure mode: slow, doesn't transfer well, re-derives established
  knowledge unnecessarily.

The pair compounds when both are present. When the owner is not
present, the agent operates doctrine-first alone, and the
doctrine-by-analogy failure mode becomes the dominant risk. Cure
shape: a pre-action first-principles checkpoint — *what kind of
thing is in front of me, and is this rule shaped for it?* — fires
before any response-menu is applied. When a signal recurs (second
limit-raise, second correction of the same shape), the agent must
treat the doctrine answer itself as a candidate failure mode and
ask: *what is the upstream cause of this signal recurring?*
Falsifiability: at the next equivalent fitness-response decision, the
agent surfaces a surface-classification verdict before proposing a
response, and routes recurring signals to upstream-cause diagnosis
rather than menu-application. Routing: PDR candidate in pending-
graduations register.

### Metacognition has two modes — retrospective and generative

The metacognition directive and skill body name both modes; my prior
application collapsed them into one. Both modes share one structural
move — **pre-action ratification of the action-to-impact bridge** —
but their triggers and cure targets differ:

- **Retrospective metacognition** fires on a correction signal. Cure
  target: doctrine-by-analogy. A rule was reached for that didn't
  fit; step back, re-examine, update reflexes so the next equivalent
  decision goes differently.
- **Generative metacognition** fires when the purpose under an action
  is non-obvious or load-bearing. Cure target: purpose-by-default.
  The surface ask has an obvious interpretation, but the deeper
  impact the user actually needs may be wider, sharper, or
  differently shaped. Triggers: non-trivial brief whose impact space
  is wider than the obvious one; strategic fork where the right move
  depends on what is really being built; open-ended ask where direct
  execution would foreclose the real question; concept that recurs in
  unexpected places (often systems-level vocabulary surfacing inside
  a surface-level task).

When uncertain, generative is the safer default for non-trivial work:
it costs a brief first-principles pause and protects against the
doctrine-by-analogy failure mode pre-emptively. The success test for
either mode is the same: **does the model produce correct moves next
time without needing the same intervention?** Owner-stated 2026-05-17
*"that is exactly right"* on the model-not-edits framing; then
broadened with *"metacognition is not just about learning from
mistakes, it can also be about intellectual deep dives to uncover the
real impact or purpose that we are trying to achieve... it's not
always retrospective."* The broadening exposed that the same session
I was processing as recovery had actually been generative throughout.
Routing: PDR candidate in pending-graduations register;
[`.agent/directives/metacognition.md`](../../directives/metacognition.md)
already names both modes implicitly via *"consider the impact you
have been asked to bring about"* (forward-looking) and
*"pre-action or boundary reflection"* (both modes).

### Platform-specific per-user memory is a buffer, not a personal store

Vendor-managed per-user memory surfaces — Claude Code
`~/.claude/projects/<project>/memory/`, Cursor `~/.cursor/chats/`
plus `prompt_history.json`, Codex `~/.codex/memories/` —
are **platform-specific buffers** that drain into the in-repo
canonical surfaces (`napkin.md`, `distilled.md`, rules, PDRs) where
all agents can see the substance. Substance written there with
cross-platform value MUST be integrated into in-repo surfaces during
`session-handoff` step 6 (mirror at session close) or `consolidate-
docs` step 3 (cross-platform ingestion at thread-scoped depth). The
workflows make this clear; the failure mode is treating the per-user
surface as a *personal accumulator* rather than as a *buffer with a
drainage contract*.

Worked instance 2026-05-17 (Swift Winging Gust): I authored two
feedback memories at Claude per-user level during the session
(`pending-graduations-is-buffer-not-dump` carrying the buffer-vs-
memory diagnostic; `metacognition-impact-test` carrying the two-mode
model) and declared `consolidate-docs` step 3 done without ever
sweeping that surface for cross-cutting substance. Owner correction:
*"part of the function of the session handoff and the document
consolidation flows is to sweep vendor specific memories and
integrate them into our learning loop, so that all agents working on
the repo can benefit from the understanding."* Recurrence pattern:
the **same** buffer-as-dump failure mode I diagnosed for
`pending-graduations.md` earlier in the session, applied to a
different buffer surface — strong evidence the failure mode is a
general anti-pattern, not specific to one file. Falsifiability: at
the next session close, the agent's `session-handoff` step 6 sweep
of own-platform per-user memory should produce either a positive
finding (substance mirrored to napkin/distilled with a named in-
repo destination) or a justified empty result; declaring the sweep
done without performing it is the recurrence the rule blocks.
Routing: this entry is itself the integration; PDR-shaped
"per-user-memory-is-a-buffer" candidate added to pending-graduations.

---

## Recently Distilled — 2026-05-21 multi-agent graph and consolidation window

### Transport shape determines E2E classification

HTTP-transport systems can have valid in-process Supertest E2E tests when the
runner harness boots a real HTTP listener and drives it through protocol
framing. The earlier separate-process intuition belongs to STDIO transport,
where the exposure boundary is process-level. For HTTP MCP servers, the
operative question is whether the harness boots and drives a running system;
do not propose reclassifying Supertest E2E files merely because product code is
imported in-process.

### Coordinator handoff has two distinct moments

Pre-positioning a coordinator handoff is not the same act as transferring
authority. The outgoing coordinator may broadcast state-of-play for the
incoming agent, but authority transfers only when the receiving agent actively
acknowledges taking the role. Until that acknowledgement is observable in
comms, the outgoing coordinator retains routing, cadence, and commit-window
responsibility.

### Verdict reasoning must be substance, not citation

At a decision point, citing a plan, memory entry, reviewer verdict, or prior
agreement is not itself reasoning. Citations are pointers to inspect; reasons
must explain why the current substance supports the verdict. A verdict whose
"reasons" are mostly references is dogma-shaped. Re-render the citations into
substantive reasoning, or mark them as flags to verify.

### Vocabulary discipline applies when absorbing inputs

Hooks catch some problematic words at write time, but multi-agent work imports
vocabulary through reviewer verdicts, prior plan text, owner paraphrases, and
peer comms before the agent writes anything. Absorption requires re-vocabulary:
carry forward the structural recommendation, not the source phrasing. A hook-
blocked word whose first appearance was in a reviewer or peer artefact is the
diagnostic signature for inbound vocabulary inheritance.

### Per-workspace inherited-tree gates are the default for workspace-scoped dirt

For `start-right-team` inherited-tree verification, per-workspace gates are the
default when dirty files are clearly workspace-scoped and the runner's
diagnosis rules out cross-workspace cascade residue. Tree-wide gates still
apply when the dirty state could affect generated SDK contracts, shared types,
root configuration, or cross-workspace consumers.

### Bare timer races leak unless cleaned up

`Promise.race([p, setTimeout(reject, n)])` without cleanup is a leak by
construction; the timer survives even when `p` wins. If the ready promise
cannot remain unsettled, the race is dead safety code and should be deleted.
If it can remain unsettled, clear the timer in `finally` or use an abortable
timeout shape.

---

## Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade

### Gates hide gates — failure surface is a stack, not a list

`pnpm check`'s serial chain (each gate's `&&` means downstream gates do
not run while an upstream gate is red) shields each failed gate from
the next. The shielding holds at test-level too: a flaky test prevents
the test below it from being trusted. **Diagnostic discipline**: when
a gate clears, *expect* the next downstream gate to surface a previously
hidden problem; treat each green gate as a magnifying glass aimed at
the next. Worked instance 2026-05-17: knip clearing surfaced a
parallel-load MCP e2e flake; the e2e deletions surfaced a missing
Playwright binary; installing the binary surfaced two pre-existing
circular type imports in depcruise that had been latent for weeks.
Falsifiability: a `pnpm check --continue` mode would reveal the full
latent stack at once; periodic continue-mode runs catch this earlier.
Routing: pending-graduations entry pending second-instance trigger.

### Test-design lens precedes shared-state hunt on flaky suites

When a test flakes, the **test-design lens is the first move**;
the shared-state hunt is the second. Tests at the right level cross
less shared-state surface than tests at the wrong level, so applying
the lens often surfaces both the cure and the flake source
simultaneously. Worked instance 2026-05-17: I spent context chasing
"find the Sentry/MCP shared mutation causing MCP e2e flakes" before
owner reframed via `testing-strategy.md`. Every failing test was a
duplicate of existing unit/integration coverage at the wrong level,
booting the entire Express app to assert constants and stub-data
shapes. Deletion was the cure. Graduated this session as the
[`test-coverage-review-lens`](patterns/test-coverage-review-lens.md)
pattern (commit `0c083409`); first worked instance at commit
`96fd3e61`.

### Supertest tests are integration by classification, not e2e

Per `testing-strategy.md` §Test Types (authoritative): *"A test
that imports product code into the test process is an integration
test even if named `.e2e.test.ts`."* Supertest is in-memory; no
separate running system. Filing supertest tests under `e2e-tests/`
routes them through the e2e setup file (`test.setup.no-network.ts`
which mutates `globalThis.fetch`) and schedules them alongside
Playwright loads, inflating their shared-state surface for no proof
gain. **Doctrinal conflict to surface**:
`docs/engineering/testing-patterns.md` currently classifies
supertest as E2E — direct conflict with `testing-strategy.md` which
it itself names authoritative. Owner-surface candidate at next
consolidation: align `testing-patterns.md` with the strategy doc.
Routing: pending-graduations entry,
target `doc-amend:testing-patterns`.

### `pnpm check` cleanliness gate belongs in session-handoff (carry-forward from 2026-05-15)

Owner stated standing 2026-05-14: session-handoff cannot be
considered complete in the individual-contributor or handoff-owner
sense unless `pnpm check` completes with no errors or warnings.
The 2026-05-15 session committed `da2a4aac` with `pnpm check` red
on pre-existing knip findings, framing them as "out-of-scope" —
owner-corrected as foundational-rule violation per the
all-quality-gates-blocking standing rule. Structural cure landed
this session through gate-green forced via seven commits; the
session-handoff skill should grow a `pnpm check` cleanliness step
to make the standing direction structurally enforced rather than
agent-recalled. Routing: pending-graduations entry,
target `skill-amend:session-handoff`.

### Hook-bypass equivalence — `--no-verify` covers more than the flag (carry-forward from 2026-05-14)

The repo-wide invariant
[`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md)
must extend to **any** mechanism that skips hooks:
`core.hooksPath=/dev/null`, `GIT_HOOKS_PATH` override, `.husky/`
deletion, `--no-gpg-sign` when gpg-sign is a hook, any future
equivalent. Fresh per-commit owner authorisation binds to the *act*
of skipping, not the *syntax*. Falsifiability: if any future agent
reaches for any of those mechanisms without fresh per-commit owner
authorisation for the exact commit, the rule has been violated.
Routing: pending-graduations entry,
target `rule-amend:no-verify-requires-fresh-authorisation`.

---

## Recently Distilled — 2026-05-14 Verdant Swaying Glade conduct correction

### Agents have no gender unless they self-declare (default they/them)

- **Owner correction**: *"agents do not have gender unless they decide
  they do."* This is the second instance of the same correction; the
  first (2026-05-11, about Smouldering Crackling Pyre) is recorded in
  [`napkin-2026-05-12.md`](archive/napkin-2026-05-12.md) line 319 but
  was never graduated to active distilled, allowing recurrence.
- **Rule**: when referring to any other agent, default to **they/them**.
  Gendered pronouns require self-declaration from that agent (in their
  identity record, comms event, or thread-record entry). Agent names
  are evocative phrase-pairs with no inherent gender; do not infer
  gender from the name.
- **Scope**: applies everywhere the agent's voice persists — chat
  output, commit messages, comms event JSON bodies, napkin entries,
  active claims `intent` fields, thread-record narrative, ADR
  attribution, plan documents. *Including* working-tree edits that
  have not yet been committed.
- **Sweep on correction**: when corrected, sweep every persisted
  surface touched in the current session (active comms events,
  shared-comms-log, claim intents, thread records, napkin) and amend
  in place; regenerate any surfaces derived from those primaries
  (`shared-comms-log.md` is rendered from `comms/*.json`).
- **Graduation discipline for conduct rules**: corrections about
  personal conduct (style, register, phrasing, attribution) graduate
  to **active distilled.md in the same session**, not via the
  pending-graduations queue. Rationale: a session-scoped napkin entry
  archives the lesson but leaves the rule unenforced for new sessions
  during the rotation gap. The 2026-05-11 → 2026-05-14 recurrence is
  the worked example. Companion to the existing "Substance > Destination"
  discipline: substance-rules tolerate queueing; conduct-rules do not.

## Recently Distilled — 2026-05-14 Sylvan Budding Forest deep-dive consolidation

Behaviour-changing entries distilled from the 2026-05-14 napkin rotation
(archived at [`napkin-2026-05-14.md`](archive/napkin-2026-05-14.md)). The
rotation covers eight sessions across two threads — the multi-agent P8 team
(Pearly Drifting Jetty controller plus Nebulous, Arboreal, Torrid, Fronded,
Embered) and three Cursor / Codex closeouts (Luminous Glowing Moon plan
promotion; continuation-pointer clarification; agent onboarding flow patch).
The full session-by-session capture lives in the archived napkin; the
durable doctrine below is what changes behaviour next session, regardless
of who picks the work up.

### Coordination role discipline (multi-agent evidence)

- **Roles emerge from live pressure, not from a fixed menu.** The useful
  multi-agent topology in the P8 window (controller, marshal, reviewer,
  implementer, scout, standby) was selected from the scarce resource at
  the time — git/index/queue contention drove marshal value; bounded
  GO/BLOCK challenge drove reviewer value; an exact file bundle drove
  implementer ownership. Static role menus are useful as *prompts* for
  what shape might fit, but treating them as canonical topology risks
  premature structure and silent over-coordination. Naming a role
  costs nothing; naming the obligation plus the handoff proof is what
  actually pays off.
- **Every role description must carry its handoff proof.** "Marshal"
  worked because it meant *watching exact staged pathspecs and queue
  state*. "Reviewer" worked because it meant *GO/BLOCK on a bounded
  slice plus focused-test evidence*. "Controller" worked when it meant
  *allocator and sequencer*; it would become harmful if it slid into
  *central permission for every judgement*. When a role appears in a
  team plan, the next sentence should name what artefact proves the
  handoff.
- **Treat scout responses as input, not as permission.** Read-only
  scouts after a source commit are valuable when they preserve
  momentum into the next slice. They are *not* implicit licence to
  open a new implementation claim during closeout; the next slice
  needs fresh live grounding and an explicit route.
- **Pre-closeout sweep ritual is now a controller invariant.** Before
  hardening any "final status" sentence, sweep all six surfaces in
  this order: active claims, active commit queue, staged files,
  `git status --short`, shared comms, directed inbox (plus late
  scout/reviewer replies arriving after the last source commit).
  Discrepancies between these surfaces are status-worthy even when
  the session has no implementation assignment. "Empty claims and
  queue" is never the whole state during a closeout window.
- **Closeout comms can perturb the closeout bundle.** During a
  closeout commit window: one explicit marshal verification event is
  fine; further verification should be local-only unless a blocker
  appears. New comms events written after record-staged force the
  closeout bundle owner to re-enqueue or accept residue.

### Commit-window operational sharpening

- **`git:index/head` commit-queue claim pattern syntax**: when opening a
  commit-window claim, use `--area-kind git --area-pattern "index/head"`
  (bare, no `git:` prefix). The `git:` prefix is the symbolic name of
  the resource; the stored pattern is the bare path. The guard
  (`claimCoversGitIndexHead`) does exact-element match on the
  normalized list, so `["git:index/head"].includes("index/head")` is
  false. Mistake source: Luminous Glowing Moon 2026-05-14; behaviour
  change recorded so the next agent does not repeat it.
- **CLI flag-shape drift under coordination pressure**: the
  collaboration-state surface has moved. `comms inbox` takes
  `--agent-name`/`--comms-dir`, not `--agent`. `commit-queue` is a
  top-level `agent-tools` topic (`pnpm agent-tools:commit-queue --
  list --queue-status active`), not a `collaboration-state` topic.
  `comms send` is shared-log; directed routing belongs to
  `comms direct` with `--to-agent-name`, `--to-platform`,
  `--to-model`, `--to-session-prefix`. Check topic-specific help in
  every resumed or compacted session before relying on muscle memory.
- **Run formatting proof before the commit hook for new modules.** The
  Slice A landing burned a shared git/index window because Prettier
  fired inside the hook on a new module. The cheap cure is
  `pnpm agent-tools:repo-check -- prettier-staged` (or targeted
  Prettier) immediately before `git commit` when the bundle creates a
  new file. Re-record the queue fingerprint after the format, then
  retry the commit.

### Plan-author discipline reinforcement

- **DECISION-COMPLETE is the readiness gate, not paperwork after
  execution.** When the owner asks for an implementation plan, every
  execution-time vendor literal, output schema, interface signature,
  exit-code/sort-order/encoding decision, and help-text shape that
  *can* be settled at plan-author time *must* be settled there. The
  `plan-body-first-principles-check` vendor-literal clause permits a
  deferral only when the dep is added inside the same WS, and even
  then the plan must pin the call shape so the WS becomes
  drift-detection rather than decision-making. "Verify at execution
  time" is the failure mode this discipline forbids.
- **Verify vendor call shapes against installed-or-published docs at
  plan-author time.** "Well-known utility library" is not permission
  to pin a call shape from memory. Stable API across a v0.x line is
  necessary but insufficient evidence the call shape *I remember*
  matches the *current* shape (worked example: tinyglobby was
  documented as `glob({ patterns, ... })` from memory; actual current
  export is `glob(patterns, options)` positional). Cheap at
  plan-author time; expensive at WS execution.
- **Acceptance value-proxies must compare against independent
  ground-truth measures.** Reproducing a baseline value does not
  validate the CLI is correct if the baseline was itself produced by
  the same method (chars/4 reproducing chars/4 proves nothing).
  Compare against a method-independent measure (e.g. `wc -c` for
  chars, then chars/4 becomes mechanical). Acceptance proxies
  framed as "agrees with prior baseline ±N%" are tautological and
  fail under normal churn.

### Continuation surfaces

- **Skill text carries durable routing behaviour; continuation
  records carry volatile facts.** Branch, plan, next-step, commit ids,
  team expectation — every fact that changes between sessions belongs
  in the thread record, not in the skill body. The skill's job is to
  fire the routing on arrival; the record's job is to provide the
  current state for that routing to act on.
- **"Ready to land" is dangerous in continuation records after a
  commit window.** Use it only when the work is genuinely uncommitted
  and pending. Once the work lands, replace the phrase with commit
  evidence (`bfa26e01`, `498edcc2`, etc.). Stale "ready to land"
  wording in a continuation record is an actionable defect, not a
  wrapper.
- **When a collaboration skill changes session entry or exit
  behaviour, audit root README and platform onboarding adapters in
  the same closeout.** The specialised skill text is correct only
  half the story; a new agent can enter through README, a teammate
  prompt, or a Cursor/Codex rule and miss the new routing entirely.
  Routing surfaces are co-load-bearing with the skill body.

### Read-only support pattern (Torrid evidence)

- **For a read-only review or scout assignment, send two notes.**
  Send a *readiness note to the implementer* (naming likely risk
  surfaces, the minimum proof set, and the boundary that distinguishes
  this slice from adjacent work) *before* implementation. Send a
  *completion note to the controller* afterwards (with exact
  commands and evidence). Two notes give the controller a routable
  signal without requiring another claim.

---

## Held Pending Validation

### Hypothesis-Layer Routing for Multi-Agent Cures → `hypothesis.md` family

Multi-agent collaboration cures route through the hypothesis layer
before graduating to doctrine. Substance lives at
[`hypothesis.md`][n-agent-hypothesis] (per-primitive coordination
cures), [`falsification-criteria.md`][n-agent-falsify]
(per-primitive falsifiability), and [`experiments.md`][n-agent-experiments]
(empirical validation at N≥3). Capture → hypothesis → empirical
validation → graduate. Treated-as-hypothesis they get tested;
shipped-as-design they get defended. Substrate validated at N=2;
not yet at N≥3.

[n-agent-hypothesis]: ../../prompts/agentic-engineering/collaboration/hypothesis.md
[n-agent-falsify]: ../../prompts/agentic-engineering/collaboration/falsification-criteria.md
[n-agent-experiments]: ../../prompts/agentic-engineering/collaboration/experiments.md

---

## Recently Distilled — 2026-05-13 Three-Napkin Synthesis

Substance routing for the three-rotation corpus
(`napkin-2026-05-12.md` + `napkin-2026-05-12b.md` + `napkin-2026-05-13.md`)
lives in the [historical synthesis report][synth-2026-05-13]. That report
carries ten numbered findings (F1-F10), evidence arcs, rejected
near-patterns, and routing decisions.

[synth-2026-05-13]: ../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-13.md

- **F1 is the cross-cutting constraint** — passive-guidance loses to artefact
  gravity at the granularity of single decisions, with N=6 fresh corpus
  instances on top of the four already in the existing
  [`passive-guidance-loses-to-artefact-gravity`][f1-pattern] pattern and
  [PDR-029][f1-pdr]. The behaviour-shape for every NEW cure designed after
  2026-05-13: when choosing between a documented-but-not-enforced cure and
  a mechanical cure that fires at the surface where the misshape would
  otherwise land, prefer the mechanical cure. Passive guidance alone is a
  watchlist item; pair it with a tripwire or do not call it a cure.

[f1-pattern]: patterns/passive-guidance-loses-to-artefact-gravity.md
[f1-pdr]: ../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md

- **F2–F10 are routed to candidate destinations** —
  [`pending-graduations.md`](../operational/pending-graduations.md)
  carries explicit candidates with trigger conditions. Highest-value
  next-touch items: PDR candidate `coordinator-role-as-allocator-not-
  gatekeeper` (Ferny + Wooded + Brazen evidence, two failure modes
  converging); rule candidate `boundary-design-strictness` for the
  owner four-part doctrine; `agent-collaboration.md § Treat Commit as
  a Short-Lived Shared Transaction Surface` amendment for mutual
  mechanical verification + hook authority; thread-record-routing-
  surfaces-drift amendment.

---

## Recently Distilled — 2026-05-09 Napkin Rotation

Most entries from the 2026-05-09 rotation graduated during the
2026-05-14 Verdant Swaying Glade Route C-iv pass. The entries listed
below remain held for a destination decision in a future consolidation.

### PR Closeout Discipline

- **PR closeout has two distinct evidence loops.** Gate state (checks,
  Sonar, CI) and reviewer-comment state are independent. A green PR can
  still need a comment-harvest pass — top-level comments, review
  summaries, and threads marked resolved/outdated may carry live
  feedback outside the check surface. Fetch and classify before the
  next edit.
- **PR title/body are an active review surface.** Branch scope drift
  makes stale metadata an actionable defect, not a wrapper. Rewrite
  title/body after `origin/main...HEAD` comparison before disposing
  any metadata-shaped review comment as `fixed`.
- **For planning PRs, report two verdicts separately.** PR technical
  readiness and plan decision-completeness are independent gates. A
  green PR must not collapse unresolved planning questions (topology
  findings, slice-plan findings, plan-internal contradictions) into
  implicit acceptance.
- **Remote metadata transitions are part of state handoff.** When a
  closeout moves from local/pending to pushed, refresh the live PR
  body and next-session records in the same handoff pass so the next
  session does not inherit stale blockers.

### Generator And Tooling Discipline

- **Self-lint surfaces deprecated helper drift.** Adding new candidate
  rules in the plugin self-lint lane catches maintenance drift early.
  When core ESLint helper types reject a locally-typed plugin, split
  the config at the type boundary rather than weakening the plugin
  type.

### Multi-Reviewer Dispatch Discipline

- **Each reviewer lens shrinks a different part of the audit-shape
  surface.** Parallel WS0 reviewers (test, fred, docs-adr) are not
  redundant; each catches BLOCKERs the others cannot see. Test caught
  literal-text assertions; fred caught a deferred boundary decision;
  docs-adr caught propagation-surface omissions. Plan WS0 dispatch
  expecting concrete cycle-shape correctives, not just nudges.

*"Decide at write time" deferrals are unmade load-bearing decisions*
graduated 2026-05-10 to the host pattern
[`deferred-at-write-time-is-unmade-load-bearing-decision`][def-at-write].

[def-at-write]: patterns/deferred-at-write-time-is-unmade-load-bearing-decision.md
