---
id: quality-gate-ledger
node_type: delivery
name: "Quality-gate ledger — a register that recomputes"
overview: "Replace hand-maintained quality-gate lists with a schema-validated ledger whose derived half is recomputed from the invocation surfaces and whose authored half carries the judgement a machine cannot hold: why each gate exists, what its failure means, and the cure. Establishes quality gates as the fourth lever corpus under the one descriptive framework, and supersedes ADR-121's coverage matrix with a generated view."
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-08-04
ratified_where: >-
  In-session owner ratification at the Wyvern lifts Kindling seat
  (1da2b1), 2026-08-04, in the message opening "I ratify the plan" —
  which also set the standing expectation that bringing visible
  structure to the gates will itself surface valuable discoveries.
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets:
  - MCP-491
depends_on: []
owner_gates: []
last_updated: 2026-08-04
---

# Quality-gate ledger — a register that recomputes

## Goal

A session, a reviewer, or the owner can answer four questions about any quality
gate from one place — **what gates exist, where each runs, why it exists, and what
to do when it fails** — and the answer cannot silently go stale, because the
machine-knowable half is recomputed from the invocation sites on every run.

The harm this removes is observed, not hypothetical: on 2026-08-04 the repository
owner had to ask an agent whether skill validation ran in the hooks, and the agent
could answer only by grepping four separate surfaces.

## Mechanism

### Why a ledger works where the matrix did not

ADR-121 already holds a coverage matrix whose stated purpose is *"makes gaps
visible and auditable"*. Its own change log records a manual repair —
*"Reconciled matrix with actual gate implementations"* (2026-04-11) — and it is
stale again today: five surfaces claimed against six live, two standing CI-only
exceptions named against three. Diligence was applied and the artefact decayed
anyway, twice. **The mechanism is the defect, not the care.**

The ledger differs in one property that does the whole job: it is split by who
can know the fact.

- **Derived** — which gates exist, where each is invoked, whether failure blocks.
  These are facts the repository already contains. The validator recomputes them
  from the invocation surfaces and fails on drift in **both** directions: a gate
  with no entry, and an entry naming no live invocation site. This is
  `validators-must-recompute-not-just-record` applied to the gate corpus; a
  validator that only checked the ledger's own schema would reproduce exactly the
  failure it replaces.
- **Authored** — why the gate exists, what a failure actually means, how to tell a
  genuine finding from a crashed checker, and where the cure lives. A machine
  cannot derive these, and they are the fields a reader needs most at the moment of
  failure.

### Two scales of feedback, and which artefact owns each

Cure guidance has two scales, and collapsing them would sink this lane. An ESLint
gate can fail in hundreds of ways; no ledger entry can enumerate them, and one that
tried would be wrong within a month.

- **Gate scale (the ledger entry)** — stable, one per gate: what this gate is for,
  its classes of failure, how to tell a finding from a crash, and where the specific
  cure will be found. Low cardinality, changes rarely.
- **Instance scale (the emitted message)** — high cardinality, and the emitter is
  the only thing that knows which rule fired on which line. For every gate **we**
  author — custom validators, custom lint rules — we control that emitter, so its
  output can name the exact failure and the exact cure. For third-party tools we do
  not control the emitter, but we do control the **wrapper**, and a wrapper must
  never invent a cause the tool did not report.

Today's evidence for the split, both first-hand: the portability validator refused a
push naming the precise missing entry and its cure — cost to resolve, about ninety
seconds, no ledger lookup needed. The staged-prettier hook echo reported "formatting
issues found" when the checker had crashed and never ran — cost, roughly twenty
minutes, and it induced a *wrong* action (re-formatting an already-clean file, then
a false theory about a dependency pin). A bad message is worse than a silent
failure, because it spends the reader's trust in a specific wrong direction.

The ledger therefore carries an **output-quality** field on each entry: is this
emitter self-curing, or does it need the ledger to explain it? That makes the ledger
the measure of the estate's feedback debt — the inventory already found four gates
whose failure output misattributes its cause — and gives the paying-down programme a
number to drive toward zero. **Rewriting emitters is not this lane's work**; it is
the sibling programme this field feeds.

Duplication is the decay mechanism, so the human-readable cross-surface view is
**generated from the ledger**, never authored beside it. ADR-121 keeps what only it
holds — the surface definitions and the pre-push ≡ CI principle — and its matrix
becomes that generated view rather than a second authority.

### Gates as the fourth lever corpus

The owner ruled on 2026-08-02 that skills, rules, and subagents "are all aspects of
an underlying descriptive framework", each exposing a name and description to the
one constant consumer: the what-applies-now routing decision. Quality gates are a
fourth corpus of exactly that kind, and the moment of need is sharper than for the
other three — a session meets a gate when it has just failed one. Each entry
therefore carries a description meeting the same three targets (discovery,
applicability, best-practice/bad-practice), and gate failure output points **into**
the ledger so the routing works from the failure moment outward.

Two worked examples are already in hand and belong in the corpus as the calibration
pair:

- **Best practice** — the portability validator refuses a push naming the exact
  missing entry and the cure, so the reader needs nothing else.
- **Bad practice** — the staged-prettier gate reported "formatting issues found"
  when the checker itself had crashed and never ran, sending its reader to
  re-format an already-formatted file.

### The self-test

The ledger's validator is a quality gate, so it carries an entry in the ledger. If
it does not, the ledger is provably incomplete at birth. This is cheap and it is a
real completeness probe rather than a joke.

### What the recomputed inventory found (2026-08-04, evidence for every claim above)

A read-only enumeration across hooks, CI workflows, root and workspace scripts,
turbo tasks, and custom validators, reconciled against every document that claims
to list the gates:

- **88 distinct gates.** ADR-121's matrix has 24 rows and structurally cannot
  express 45 of them — the 20 `repo-validators` leaves, 11 gates buried inside
  turbo tasks, and 14 defined-but-ungated scripts.
- **44 are invisible from root pnpm scripts** — 24 unreachable entirely, 20 only
  through an opaque aggregate. The owner's claim is exact.
- **13 gates run in CI but not hooks; 8 run in hooks but not CI.**
- **14 gates are defined and wired to nothing.** One, `practice:vocabulary`, is
  listed in `AGENT.md` as a common entrypoint and in the build-system doc under
  "Practice health commands". Nothing runs it, anywhere.
- **3 non-blocking gates sit inside blocking surfaces**, against a foundation
  document's flat statement that "all gates are always blocking — there is no
  'non-blocking warning' category inside the gate set".
- **13 documented disagreements** between what the docs claim and what runs, each
  with file:line. Two are load-bearing: CodeQL is a *required* merge check that
  appears in no ADR-121 row or sentence and falsifies its no-CI-only-checks
  principle; and two documents directly contradict each other on whether
  `pnpm check` is exhaustive.
- **The existing parity guard has a hole that proves the thesis.**
  `validate-check-ci-parity` treats `repo-validators:check` as a single opaque
  token and never recurses — **any of the 20 leaf validators could be deleted from
  the chain and it would still report OK.** It is also one-directional (a CI step
  with no local counterpart is never a gap) and hard-pinned to `ci.yml`, so it can
  never see CodeQL. Parity is validated, and inventory is still unknown.
- **4 gates report a failure whose cause is ambiguous**, including two that
  attribute an unrelated package's broken build to a validator, and one that counts
  schema failures on well-formed JSON as "invalid JSON file(s) found".

### The falsifier this resolves, and the boundary it exposes

The plan's core falsifier — *if most gates are not mechanically discoverable, the
recompute half is unbuildable* — is **answered in the proposal's favour**: all 88
were enumerated from the repository with file:line citations.

But the same pass exposed a real boundary. Several gates live in **GitHub settings,
not the repository**: the required-check contexts on the ruleset, the SonarCloud
app, and `required_deployments: [Preview]`. They could not be confirmed without an
authenticated network read, which ADR-161 keeps out of the PR-check path. So gates
fall into three tiers, and the ledger must say which tier each entry is in:

1. **Repo-derivable** — recomputed in the blocking validator. The large majority.
2. **API-derivable** — GitHub ruleset and app configuration; reconciled
   out-of-band, never in the blocking path, and marked with the date last verified.
3. **Authored-only** — no mechanical source; carries its evidence inline.

Tier 2 entries going stale is a *known* limitation with a visible timestamp, which
is categorically different from today's state, where staleness is invisible.

## Acceptance criteria

| # | Criterion | Proof |
| - | --------- | ----- |
| 1 | Every gate discoverable at an invocation surface has a ledger entry, and every entry names a live invocation site. | `repo-safe` — the validator fails a deliberately introduced gate with no entry, and a deliberately orphaned entry. Both directions proven by test. |
| 2 | The ledger's schema is enforced, and a malformed entry fails the gate. | `repo-safe` — schema-violation fixture rejected. |
| 3 | The ledger's own validator appears in the ledger. | `repo-safe` — asserted by test. |
| 4 | ADR-121's coverage matrix is generated from the ledger, not authored. | `repo-safe` — regenerating produces the committed matrix byte-for-byte; drift fails the gate. |
| 5 | Every disagreement between ADR-121's current claims and recomputed reality is recorded with a disposition, none silently absorbed. | `owner-held` — the owner reads the disagreement list and confirms nothing was quietly dropped. |
| 6 | A reader meeting a gate failure can reach its ledger entry from the failure output. | `owner-held` — the owner's judgement on one worked failure. |

## Out of scope

- **Changing what any gate does.** This work registers and describes gates; it does
  not add, remove, retune, or re-sequence one. The owner's constraint on 2026-08-04
  was explicit — prefer the change that cannot break the working system.
- **Fixing the gate defects the inventory surfaces.** Holes found (for instance a
  checker that prints `ERROR` and exits 0) are recorded as ledger entries with
  their real failure semantics and routed to their own tickets. Curing them here
  would make this an unbounded lane.
- **Eval suites for gate descriptions.** The description contract is adopted; its
  measurement rides the commissioned evals pilot that already owns that question.
- **Any hook or CI reordering.**

## Todos

Sliced so each is a single-story PR.

1. **Inventory, recomputed.** Enumerate every gate across hooks, CI workflows, root
   and workspace scripts, turbo tasks, and custom validators, plus the reconciliation
   against what documentation currently claims. Deliverable is the evidence table and
   the disagreement list. **ADR-121 is not an input to this step** — the owner's
   direction on 2026-08-04 is to assume it is badly out of date, so it is a test case
   for the finished validator, never a seed for the ledger.
2. **The PDR** — the practice decision: gates are a registered lever corpus, an
   unregistered gate is a defect, the description contract binds, and each gate names
   an owner.
3. **The ADR** — the architecture: the ledger artefact and its schema, the
   recomputing validator, the generated-view relationship, and the supersession of
   ADR-121's matrix. States the should-be; the means stay here.
4. **Schema and ledger, seeded from the inventory** — the data artefact with its
   schema, populated from step 1's recomputed reality.
5. **The validator** — schema conformance plus bidirectional parity, with the
   red-first tests acceptance criteria 1–3 name, wired into the gate surfaces it
   itself describes.
6. **The generated view** — ADR-121's matrix rendered from the ledger, its authored
   copy retired, and the disagreement dispositions from step 1 landed.

## Where the first-principles check fires

Per `plan-body-first-principles-check`: at step 4, on the question *could this be
simpler* — specifically whether the ledger needs its own schema file at all, or
whether the validator's types are the schema. And at step 5, on the friction
ratchet: if recomputation proves impossible for a meaningful share of gates (dynamic
dispatch, gates expressed only in vendor config), that is the shape-reconsideration
signal, and the honest fallback is a smaller ledger covering only what can be
recomputed rather than a large one that quietly returns to being a list.

## Discovery is an expected output, not a side effect

Owner expectation at ratification (2026-08-04): *"I fully expect as we start to
bring visible structure to the quality gates we will make valuable discoveries."*

The inventory already bears this out before a line of the ledger exists — fourteen
gates wired to nothing, one of them documented as a common entrypoint; three
non-blocking gates inside surfaces a foundation document says contain none; a parity
guard blind to twenty of its own leaves. Each was invisible precisely because no
artefact made the set visible.

So findings are a first-class deliverable of every step, not noise to be suppressed
in service of finishing. Each one gets a recorded disposition — cured here, ticketed
out, or accepted with reasons — and none is silently absorbed to keep a step tidy.
Where a finding is a live gate defect, it routes to its own ticket rather than
widening this lane; that routing IS the discipline, not an evasion of it.

## Falsifiers held open

- If the inventory finds most gates are **not** mechanically discoverable, the
  recompute half is unbuildable and this plan's core claim fails. The fallback is
  narrower coverage, never a hand-maintained ledger wearing a schema.
- If no gate failure output ever routes a reader into the ledger, the description
  contract is overhead here and should be dropped to a bare register.

## Tier-2 shape superseded (2026-08-04, owner-directed discussion)

The §Mechanism tier-2 clause above ("reconciled out-of-band … marked with the
date last verified") is **superseded**. The owner's repo-vs-instance lifecycle
point, two commissioned multi-agent analyses (Wyvern's eleven-agent panel; this
seat's eight-leg fleet, adjudicated in comms event `97b6ba5c`), and the owner's
correction — *"if it's tracked it's not local; tracked means shared between ALL
copies"* — settle it as:

- The tracked register carries **repo-stratum content only**: the gate, its
  mechanism files, and a tier/provenance marker. No instance descriptor, no
  `verified_at`, no stored observation of live external state, ever (the cure
  for invisible drift is no copy — `validators-must-recompute`).
- The **enforcement expectation for a named deployment lives with the
  instance itself** (the forge's own variable/settings store), readable by a
  **non-blocking scheduled reconciler** that asserts its execution context IS
  that instance (`GITHUB_REPOSITORY` equality — never `git remote` parsing),
  reads the live ruleset (run token, unauthenticated fallback — the anonymous
  read verified first-hand 2026-08-04: HTTP 200, four required contexts),
  compares in both directions against a closed expectation, and exits
  verified-pass / verified-fail / could-not-check per the ratified three-outcome
  rule. The result lives in the check run, nowhere else.
- Every non-instance checkout renders **could-not-check** for forge-enforced
  entries — visibly, never as silence.
- Open at re-entry: the instance-store mechanism choice (variable vs
  environment vs app config) and its auditability; the run-token read
  verification; ADR-204's prose-vs-live divergences (route to owner as a
  QUESTION — the strict-policy setting may be deliberate, not drift).
