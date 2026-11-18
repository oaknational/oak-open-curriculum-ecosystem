# Resonance Practice Knowledge — oak's re-sourced durable copy

**What this is.** Oak's own, self-contained record of the transferable Practice
knowledge the resonance estate produced and taught oak during the 2026-07-05→06
inter-Practice exchange. It exists so oak does **not** depend on the resonance
checkout ever being present on this filesystem: the substance is here, in oak's
tree, re-expressed in oak's words. Per the exchange concepts-vs-pointers layering,
this is a **concept payload** — pin-free, no commit SHAs, no cross-repo file paths
that rot. Resonance doctrine is cited by its stable identifiers (PDR-125/129/130)
as concept anchors only; the substance below stands without dereferencing them.

**Provenance.** Re-sourced first-hand on 2026-07-06 (Orchid binds Verdure / oak;
= Vining Rustling Dew on resonance, prefix 51a331) from three resonance artefacts
read directly while the resonance checkout was present: the plan-estate re-founding
**process report**, the **r6 execution runbook** §Results, and the 2026-07-05
**teaching bundle** delivered into oak's `.agent/practice-core/incoming/`. This
document is oak's re-expression, not a verbatim transcript; it supersedes the
"re-sourced from the sibling estate's HEAD at port time" deferral recorded in the
WS6 adoption assessment (an OCE report of 2026-07-05, in that estate's
`.agent/reports/agentic-engineering/`) and graduates the teaching bundle's
substance out of the transient incoming box into a permanent home. The "why it
all converged" companion is the shared-model synthesis (an OCE report of
2026-07-06, in the same directory there);
that document is the **why**, this one is the **how**.

**Why oak wants it.** Oak's planning-estate rewrite (ADR-200, the living idea-graph)
faces the same problem resonance solved on a smaller estate: keeping a large body of
recorded intent true, conserving every valuable idea across a re-organisation, and
proving no loss. Resonance's methods are directly transplantable design inputs to
oak's ADR-200 workstreams; §Integration map ties each to its workstream.

---

## 1. The conservation method — re-organise a corpus and prove nothing was lost

Resonance re-founded its whole plan estate (organised by provenance → organised by
destination) in one arc, and proved "nothing was lost" as an **auditable chain** —
each link recomputable rather than asserted, except the adversarial-challenge link,
which is by design a *semantic* pass mechanical checks cannot perform:

**mechanical freeze → byte-identity proof → line-level denominator →
two-direction state verdict per line → tiling ledger over every line →
adversarial challenge of every mapping (including the clean ones) →
repoint-before-retire in one commit → gate-enforced landing → post-commit re-proof.**

**The mandate's boundary — conserve concepts, not structure.** Conservation is of
*ideas and content*, never of organisational structure. Structure the audit exposes
as artificial (in their run, an artificial design-system / design-practice split) is
**removed by owner ruling**, not carried forward. Oak's "conserve every valuable
idea" must be read this way: the idea-graph conserves ideas; the old estate's
folder/lane taxonomy is discarded, not preserved.

The load-bearing rules under the chain:

- **Freeze mechanically, before reading anything.** The source set was *every*
  plan-lane file, the roadmap, every next-session brief — chosen by a mechanical
  rule, never a subjective "which files matter" filter, because that filter was
  identified as **the single biggest conservation risk**. Verbatim copies into a
  dated archive, byte-identity proven by `diff -r`, live originals bannered so no
  mid-transformation reader mistakes them for execution queues. The freeze creates
  the **stable denominator** everything downstream measures against (their run:
  4,452 source lines). A freeze's read-only-forever contract is **disciplinary, not
  mechanical** — so it wants a *standing* diff-gate over the frozen directory (fail
  on any diff), not only the one-time byte-identity proof.
- **Extraction by overlapping blind nets; verify by full-set equality.** Extraction
  was fanned out to read-only workers running **multiple deliberately-overlapping
  blind nets** (their run: three per source — structure, list/table rows, a fixed
  keyword pattern) whose **set-difference surfaces what any one net missed** —
  neither net knows about the other, which is what makes the comparison a real
  omission detector. Verification was **full-set equality**, line-for-line and
  byte-for-byte against an independent dispatcher recomputation. The measured
  lesson: **count-parity-plus-sampling passes work that full-set equality rejects**
  (worker fidelity is length-correlated, so long replies drift). Calibration: a task
  with a cheap dispatcher-side known-answer check uses count-parity; a task **without**
  one must be paired with an **independent re-derivation** — do not presume a cheap
  check always exists.
- **Prove the loss-detector can detect, before trusting its zero.** A residue audit
  clustered every uncaptured source line, and a **planted synthetic orphan** was
  injected to prove the detector discriminates *before* the zero-orphan result was
  trusted. A "found nothing" is worthless until the finder is shown to find.
- **A surviving orphan is a disposition candidate, not an automatic loss.** Each
  orphan the detector surfaces is *individually adjudicated* into one of:
  **cure-by-amending-its-destination** / **owner-ruled-still-live** /
  **register-routed** (parked in the right register) / **already-absorbed
  elsewhere**. Their run: 19 orphans → 9 cured / 4 owner-ruled-live / 5
  register-routed / 1 already-absorbed. WS7 must dispose each surviving orphan this
  way, never treat every orphan as a defect.
- **Two-direction state verdict per line.** Every inventory item got a code-proven
  verdict in **both** divergence directions: claimed-done items had to produce an
  artefact or gate proof; claimed-pending items were probed for having **already
  landed**. Their measured result was asymmetric — 7 pending-but-done, 0
  done-but-pending — making "the repo state, not the plans, is the source of truth"
  a measured fact. The under-reported-completion direction is the one every CI
  culture leaves unguarded.
- **Conservation as a tiling proof.** A ledger maps the corpus in block rows that
  **tile every anchored line with zero gaps and zero overlaps** (union-count parity
  + exact tiling), independently recomputed by a critic agent. Zero gaps = the
  completeness assertion; zero overlaps = no double-counting.
- **Challenge the clean mappings, not just the flagged ones.** Fresh-context
  adversarial challengers attacked *all* mapping rows including the clean ones and
  overturned zero — which is what converts "we mapped everything" from a claim into
  a **survived attack**. Verification scoped only to flagged items leaves
  false-negatives untouched.
- **Repoint before retire, in one commit.** Every consumer of a retiring file was
  re-derived at execution (a prior as-of list treated as an accelerant, never an
  input), repointed, and only then were the originals removed — as ONE commit, so
  the link validators only ever evaluated the finished state.

### Operational detail for the repoint/retire step (WS7)

Two pieces of resonance's execution method oak's WS7 retire step needs, or it will
either rewrite history or stall on ambiguity:

- **The reference-class classifier** decides what to do with each reference to a
  retiring surface: a **path meaning "the work to do"** → repoint to the successor;
  a **path meaning "where X was recorded"** → repoint to the frozen copy; a
  **name-only historical mention** (no path) → **leave unedited** (history stays
  true); **anything unclassifiable** → **STOP and ask the owner**. The name-only
  residue class and the STOP-and-ask default are what keep the step from
  over-editing history or improvising a cure.
- **The coexistence-window two-way banners.** During the transformation, the new
  surface names what it supersedes **and** every superseded original points at its
  successor, so no fresh reader ever faces an unsigned estate. For oak's
  idea-graph/prose migration window: the new node names the superseded doc, and the
  superseded doc points at its idea-graph successor.
- **The five-wave edit-verification harness** (the concrete template, not just its
  economics): (1) independent worker re-derivation of the consumer map → (2)
  pre-edit anchor byte-quoting → (3) post-edit old-absent / new-present checks → (4)
  retirement absence probes → (5) fresh-context adversarial semantic pass.

Two hard-won lessons that generalise beyond their run:

- **Plans encode beliefs; gates encode facts.** Their carefully-authored,
  reviewer-verified runbook still carried two false premises; only execution-time
  gates caught them. A runbook's quality is not never being wrong — it is **failing
  loudly and stopping at the first contradiction**. (Oak's
  `plan-body-first-principles-check` rule is the same instinct.)
- **Retirement never retires history.** Deleting a file removes it from the live
  tree, not from git history, so any history-scanning tool holds a permanent
  contract with retired paths. The tension between historical truth and live
  usefulness has a third-way cure that survived adversarial review: **additive
  supersession notes** — a dated blockquote routing the reader to the live home
  while the historical text below stays verbatim. (Note the seam with oak's
  `no-tombstones-for-removed-ideas`: they govern different surfaces — history records
  vs living doctrine vs graph nodes — and the reconciliation belongs in the WS0
  protocol PDR and ADR-200's evolution ops.)

### Verification economics (measured — the calibration oak inherits)

Their re-organisation's repoint-and-retire stage cost roughly 1.3M subagent tokens
across five waves, on top of the audit and ledger fan-outs. The per-layer accounting
is the reusable finding:

- **Mechanical waves are cheap insurance** — dispatcher probes and workers caught
  the mechanical facts; the workers "caught nothing the dispatcher missed but proved
  the map twice" (and their one fabricated entry was itself caught by full-set
  verification — the discipline paying for itself).
- **The adversarial pass is where new truth comes from** — it caught everything
  semantic that mechanical checks structurally cannot see. Budget accordingly: cheap
  mechanical coverage everywhere, expensive adversarial passes where meaning is at
  stake.

---

## 2. Recomputable state and the typed-proof taxonomy (PDR-129 / PDR-130)

**Recorded state is a cache, never the truth.** Every state claim in an executable
plan binds to a recomputation procedure, and a gate holds the claim and the
recomputation **equal in both divergence directions**:

- **recorded-done-but-red** — regression or false completion (the direction every CI
  culture guards); and
- **recorded-pending-but-green** — an unclosed completion (the direction nobody
  guards until it wastes a seat re-executing shipped work — resonance's founding
  instance).

**Why recomputation and not better discipline** (the decisive rejected alternative):
the surfaces that had drifted *had been handoff-updated* and drifted anyway — so
disciplined prose upkeep is demonstrably insufficient; **mechanical recomputation is
the cure**, not more diligence. This is the load-bearing warrant for the whole
approach, and it is exactly oak's own memory-drain finding one layer down.

Two design commitments make it honest:

- **The forcing function.** A criterion that resists proof-typing is thereby exposed
  as under-specified — sharpen it or mark it `attested`; silence is forbidden. This
  is TDD-as-design applied to plans: a plan describes a target system state, its
  proofs are the tests, the work is what greens them.
- **The honest boundary (the Goodhart guard).** Recomputation answers "has the
  system reached the described state," never "is the described state good" — **proofs
  check landing, reviews check worth.** The recompute layer must never be asked to
  certify quality.

The **closed six-kind proof taxonomy** every plan todo/criterion carries:

| Proof kind | Means | Recomputes by |
| --- | --- | --- |
| `artifact` | a named path exists | file existence |
| `gate` | a named script exits green | running it |
| `probe` | a deterministic command with an expected result | running it |
| `git-fact` | a ref/tag/merge truth | querying git |
| `ratified` | an owner-decision **record** exists | the record recomputes, never the decision |
| `attested` | explicitly non-recomputable; visible, counted, never silent | the honest escape hatch — its **count is a plan-quality signal** |

The gate is **mutation-probed**: a deliberately falsified status must go red, or the
gate is theatre. Wire recomputed state at session boundaries first, so grounding
reads recomputed state instead of prose.

**Team state (PDR-130)** is the same principle joined across three substrates, each
trusted only for what it can witness: **plan todos + proofs** (committed — what the
work is and whether it is done), the **claims registry** (live, untracked — who
holds what *right now*, never history; an untracked plane cannot witness its own
past), and **git facts** (ground truth of what landed). The join key: every
implementer claim carries a **plan-todo pointer** at open, so its definition-of-done
*is* that todo's typed proofs. Checked drift invariants: no open claim on a
recomputed-done todo (catches wasted-seat drift at claim time); no orphaned
`in_progress` todo without a live claim; lane progress = **N-of-M proofs green**
(distance-to-DoD as a number). Prose team surfaces backed by a recomputable
substrate become **rendered views over the recomputation**, never hand-maintained
tables — the structural cure for continuity-table drift.

---

## 3. Zero-judgement task workers, and the adversarial-verification doctrine (PDR-125)

**The worker class** (resonance *implementation*, generator-enforced — taught in the
teaching bundle, not itself PDR-125 doctrine): a cheap-model agent rendered with an
**explicit tools allowlist**. Load-bearing safety facts, each a real footgun:

- An **omitted** tools list inherits **all** tools — the opposite of least
  privilege; a worker MUST carry the explicit allowlist.
- A **shell is a universal capability, never "read-only"** — the read-only grant is
  file-read/grep/glob and nothing else.
- **Zero-tools is valid** and expressible. Class-aware validators enforce tool-name
  membership and forbid a lean worker loading full estate doctrine (minimum context
  is the point).

**The brief discipline.** Workers do TASKS, never reasoning. Every brief is
decision-complete: one mechanical verb, one named file scope, one exact output
format, completeness ("every match, in file order, no deduplication, no skipping
what you deem trivial"), verbatim fidelity ("including errors"), and a **REFUSAL
clause** — if the task would require assessing, deciding, interpreting, ranking, or
summarising, output `JUDGEMENT-REQUIRED: <what>` and nothing else. A refusal means
the *task* was mis-designed: pull it back, never re-word to squeeze judgement out of
a cheap narrow context — that loses vital information silently.

**The adversarial-verification doctrine (PDR-125 proper — three clauses):**

1. **Acceptance means verified, never reported.** No delegated result is accepted,
   acted on, or propagated until verified against the source it claims to describe;
   convergence of delegates validates a diagnosis at most, never a prescription.
2. **Verification authority follows what the verifier can see.** A context-isolated
   verifier can check artefacts against a repo and against each other — but
   **loss-detection** ("what does the live context hold that the artefacts do
   *not*?") is **structurally exclusive to the context-holder**: delegating a
   loss-scan returns *an artefact audit wearing a loss-scan's name*. Delegates verify
   the written record; the context-holder assesses each delegate result against
   context; **neither substitutes for the other.** (This is the clause that governs
   how oak's WS7 audit may be split — see §5.)
3. **Verify the flagged findings AND adversarially challenge the clean bills** — a
   verification layer scoped to positives leaves false-negatives untouched.

The verification protocol run on **100% of delegated replies** (this is
`verify-dont-trust` applied to delegated work): (i) **format conformance** —
nonconforming gets one re-dispatch with the deviation named, then the task is pulled;
(ii) **count parity** — the dispatcher recomputes the expected count cheaply;
(iii) **sampled byte-fidelity** — random lines re-read and compared byte-for-byte;
(iv) **absence re-derivation** — a worker's "not found" is a claim about **its
search, never about the world**; the dispatcher re-derives every negative.

---

## 4. The recomputable-edge unification (oak's synthesis of §2 into ADR-200)

Resonance's typed proofs and oak's idea-graph edges are the same construct seen from
two sides. A resonance typed proof (`probe`/`gate`/`git-fact`/…) is a
machine-checkable **edge from a state claim to the ground facts that realise it, with
a recompute procedure attached**. An oak `realised_by` / `validated_by` edge is a
pointer from an idea to where it became real — a proof *without its recompute
procedure yet*. So oak's WS2 idea-node schema should define **one primitive — the
recomputable edge** — of which acceptance proofs, realisation edges, and evidence
edges are all instances, **content-addressed** (full recomputation will not scale, so
incremental/dirty-tracking is forced — and content-addressing also cures proof-rot,
where a proof rots because a path or script renamed). This fuses both estates'
inventions and gives the triad **intent / state / history** one grammar: intent is
the durable canonical layer; state is recomputable edges checked in both directions,
projected-from-a-system-of-record or recomputed-from-repo-facts by whoever owns the
truth of that axis, and expiring; history is append-only,
superseded-never-overwritten. (Full argument in the shared-model synthesis
§"triad → three planes".)

---

## 5. Integration map — where each method feeds oak's planning-estate work

Workstream numbers below are the **planning-estate-rewrite plan's** todos (WS2/WS6/WS7);
they realise ADR-200's §Sequence (schema / harvest / synthesise-and-audit) and its §5
no-loss decision.

| Resonance method (§) | Oak workstream | How it integrates |
| --- | --- | --- |
| Typed-proof taxonomy + two-direction gate (§2) + recomputable-edge unification (§4) | **WS2** — idea-node schema | model acceptance/realisation/evidence as ONE content-addressed recomputable-edge primitive; carry the six-kind proof taxonomy on acceptance fields; mutation-probe the frontmatter↔store validator from day one |
| Worker fan-out + brief discipline + 4-step verification + economics (§1, §3) | **WS6** — deep harvest | the harvest pipeline is a worker fan-out with decision-complete briefs + refusal clauses; overlapping blind nets for no-known-answer extraction; verify every reply by the 4-step protocol; budget mechanical waves as cheap insurance, adversarial passes for meaning |
| The conservation method + retire operational detail (§1) | **WS7** — no-loss audit + retire | freeze (+ standing diff-gate) → byte-identity → tiling ledger → challenge-the-clean → planted synthetic orphan (+ orphan-disposition taxonomy) → repoint-before-retire (+ reference-class classifier + two-way banners + five-wave harness); full-set equality over sampling; conserve concepts not structure |
| **Loss-detection is non-delegable (§3 clause 2)** | **WS7** — audit split | the re-expression / fidelity direction (graph → corpus) MAY go to a fresh-context reviewer; the **harvest-recall / loss direction** (source → graph: "what valuable span has no node?") MUST stay with the harvest context-holder — a fresh reviewer can only audit the written graph, not detect what the harvest never captured |
| Worker class + verification doctrine (§3) | **oak sub-agent estate** (new lane, per the WS6 assessment) | `agent_class` discriminator, generator-enforced tools allowlist, refusal-clause brief convention, standing reply-verification protocol; composes with PDR-122 and `agentic-judgment-conserve-by-default` |
| Team-state recomputation (§2) | **team-tooling / OQ5 lane** | the claims⋈plans⋈git join answers oak's F-44 freshness≠liveness defect; sequenced on OQ5 composed-liveness |

**Standing constraint (do not lose this):** oak integrates these by re-expressing
them against oak's own architecture — never by importing resonance code, and never
by pointing an oak plan at a resonance file. This document is the durable oak-side
substance; when a workstream executes, it cites *this* doc (and the synthesis), not
the resonance checkout.

---

## 6. Provenance and exchange-hygiene notes

- **Pin-free by design.** No commit SHAs appear above; resonance PDR numbers are
  concept anchors, not dependencies. If a future agent wants resonance's exact
  landings, that is a time-bound lookup for the exchange comms record, never a
  dependency of this substance — the concepts-vs-pointers layering the exchange runs
  on (its neutral-vocabulary / donor-hygiene companion is resonance's PDR-127; oak
  carries no reciprocal donor constraint, so this oak-side copy names resonance
  freely).
- **This graduates the incoming-box teaching bundle.** The substance of the
  2026-07-05 teaching bundle is now homed here and in the WS6 assessment's routing.
  The incoming-box copy has served its staging purpose and is a candidate for
  clearing at the next consolidation (Box-flow: clear-only-after-integration; it
  stays tracked and safe until then). Note the box copy still carries resonance's
  *delivery-time* PDR numbers (128/129 for the recomputable-state pair); this
  document uses the *current* numbers (129/130) after resonance's fork-union renumber.
- **Fidelity.** Every method above was read first-hand from resonance's artefacts
  while its checkout was present, re-expressed rather than transcribed, and
  adversarially verified against the sources before landing (2026-07-06 verification:
  fidelity + completeness + filesystem-independence + integration lenses; the
  material findings — the restored PDR-125 clause 2, the blind-net extraction method,
  the reference-class + orphan-disposition taxonomies, and the conserve-concepts-not-structure
  boundary — are folded in above). Where oak's own convergent doctrine already covers
  a method (`verify-dont-trust`, `validators-must-recompute-not-just-record`,
  `plan-body-first-principles-check`, PDR-122), the note names the seam rather than
  duplicating the rule.
