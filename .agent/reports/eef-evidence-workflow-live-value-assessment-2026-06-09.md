# EEF Evidence Workflow — Live Value Assessment

**Date**: 2026-06-09
**Author session**: Incandescent Smouldering Brazier (claude / Opus 4.8)
**Branch**: `assess/evidence_workflows`
**Method**: Release-and-observe. The shipped EEF surface was exercised against the
**live production MCP** (`oak-prod`, `curriculum-mcp-alpha.oaknational.dev`,
`v1.16.1`) through realistic teacher workflows and edge probes. Every claim below
is grounded in real production output captured this session, not in tests or code
reading.

## 1. Scope and what was exercised

The assessment drove the intended **Oak → EEF teacher loop** end to end, plus
deliberate edge and failure probes:

| Surface | Call | Outcome |
| --- | --- | --- |
| Orientation | `get-curriculum-model` | Full domain model returned; required-first-call contract honoured. |
| Interpretation resource | `eef://interpretation` (resource read) | Full methodology, caveats, complete 30-strand index, agent-reasoning guidance, graph field reference. |
| Discovery | `search` (KS2 maths, fractions) | Real lessons returned with embedded misconceptions and teacher tips. |
| Evidence — single strand | `get-eef-evidence` `inspect-strand` `eef-tl-feedback` | Rich, faithful envelope (impact, cost, evidence strength, mechanisms, phase/application splits, study count, PP relevance, frontier). |
| Evidence — broad axis | `get-eef-evidence` `evidence-for-move` `priority=closing_disadvantage_gap` | 15 full strand objects + 24 `related_strand` edges + frontier. |
| Evidence — narrow axis | `get-eef-evidence` `evidence-for-move` `priority=metacognition_and_self_regulation` + `phase=secondary` | 2 strands + frontier of 4. |
| Evidence — debunked strand | `get-eef-evidence` `inspect-strand` `eef-tl-learning-styles` | `impact_months: null`, evidence strength `Insufficient`, findings explicitly debunk the approach. |
| Failure path | `get-eef-evidence` `evidence-for-move` (no selector) | Clean fail-fast error: "requires at least one selector". |

**Not exercisable from this client**: the `adapt-lesson` **prompt**. This MCP
client exposes tools and resources but not prompt invocation, so the prompt
surface was not driven here. It was exercised live in the prior shipping session
(per the `eef` thread record); this assessment does not re-confirm it.

## 2. Value delivered (verified live)

1. **Faithful evidence transmission.** Every envelope carried impact, cost,
   evidence strength, mechanisms, caveats, and the full EEF attribution
   (organisation, source URL, and author citation) intact — the
   attribution-pass-through decision holds in production. Caveats travel once per
   envelope and are complete (population-average warning, effect-size conversion,
   implementation-quality moderation, "absence is not ineffectiveness").

2. **Honest handling of weak and debunked evidence.** `learning-styles` returned a
   genuine `null` impact with `Insufficient` strength and findings that debunk the
   approach — no fabricated figure, no false precision. This is the hardest case
   for a naive evidence tool and the surface handled it correctly.

3. **The graph envelope is genuinely useful.** `members` / `edges` / `frontier`
   together do real work: `frontier` points the agent to adjacent strands outside
   the matched set, and `edges` expose the relatedness structure (e.g. feedback ↔
   metacognition ↔ reading-comprehension). The frontier directly compensates for
   partial axis curation (see §3.B).

4. **The teacher loop produces value for a concrete lesson.** The KS2 fractions
   search surfaced the real, embedded misconception *"when adding or subtracting
   fractions with different denominators, you just add or subtract the
   denominators."* The feedback strand's own stated mechanism — *"Can correct
   misconceptions before they become embedded"* — and its task-level-feedback
   finding give an evidence-calibrated, faithfully-caveated option a teacher can
   act on. The loop delivered, for this case.

5. **Deterministic, finite-domain inputs with fail-fast errors.** Closed enums for
   strand ids and axes; a missing selector fails loudly and specifically. ADR-191
   (deterministic data; the agent is the only reasoner) is observable in the
   surface's behaviour.

## 3. Where it falls short (observed, grounded)

### A. The Oak → EEF bridge is entirely agent-mediated and unaided

The workflow guide instructs the agent to surface Oak signals (search,
misconceptions, prior knowledge), **name the pedagogical move**, then choose EEF
strand ids. Nothing in the data connects an Oak lesson or misconception to an EEF
strand — no shared vocabulary, no mapping, no Oak-side "this is a feedback
opportunity" signal. The leap from *"pupils add the denominators"* to
*"eef-tl-feedback"* is made entirely by the calling model's pedagogical reasoning.

This is **by design** (ADR-191 keeps the agent as the only reasoner), and for the
worked case the bridge held. But it means the "workflow" is really two
well-built but disconnected tools that the agent bridges unaided. The reliability
and value of the whole therefore rests on model judgement that is neither
constrained nor assisted by the data. **This is the central question for the
re-assessment**: is the unaided bridge dependable enough, or does it warrant a
connecting signal (e.g. Oak-side pedagogical-move tags, or a worked Oak↔EEF
crosswalk in guidance)?

### B. Axis filters return surprisingly narrow sets; discovery leans on the frontier

`priority=metacognition_and_self_regulation` + `phase=secondary` matched only
**2 strands**, even though many strands relate to metacognition. The
interpretation guide is explicit that only 17 of 30 strands carry school-context
tags and that *"absence of a tag is not evidence of inapplicability"* — but a
teacher or agent filtering naively by axis under-discovers, and recovery depends
on actively following the `frontier`. The honesty is well-documented; the
**ergonomic risk** is that the axis filter reads as "the evidence for this
context" when it is "the curated subset tagged for this context."

### C. Broad axis queries return large, full-verbosity payloads

`priority=closing_disadvantage_gap` returned **15 full strand objects** with all
nested detail plus 24 edges in a single envelope. There is no headline-only or
summary projection on the tool itself (the interpretation resource's strand index
is the only lightweight view, and it is a separate read). On an MCP host with a
token budget this is heavy, and it echoes the known bulk-tool overflow concern
recorded for `get-keywords` and the graph tools. A terse projection mode would
reduce the cost of broad discovery.

### D. EEF answers "which approach has evidence", never "how to teach this topic"

The corpus is pedagogy-general by nature. For a KS2 fractions lesson the relevant
strands (feedback, metacognition, mastery-learning) speak to *how* to teach, never
to fractions specifically. This is inherent to the EEF Toolkit, not a defect — but
it bounds the value: the surface cannot answer subject-specific "how do I teach
this" questions, only "what pedagogical approach is evidenced." Worth naming so
expectations for the workflow are set correctly.

## 4. Verdict

The shipped EEF surface is **sound and delivering its intended value**: faithful,
caveated, attribution-complete evidence with an honest treatment of weak/debunked
strands, a genuinely useful graph envelope, and correct fail-fast behaviour, all
confirmed live in production. The build arc's quality bar held through to the
running system.

The open value question is not the surface's correctness but the **Oak → EEF
bridge** (§3.A): it is unaided model reasoning, and whether that is sufficient — or
should be assisted by a connecting signal — is a product-shaping decision for the
owner. §3.B–§3.D are smaller, real ergonomic and expectation-setting observations
that the re-assessment can weigh.

## 5. Decision options named for the re-assessment

These name decisions; they do not make them (the choice is the owner's).

1. **Strengthen the Oak → EEF bridge** — investigate giving the agent a connecting
   signal (Oak-side pedagogical-move signals, a worked Oak↔EEF crosswalk in the
   interpretation guidance, or a small set of grounded exemplar loops) so the
   bridge depends less on unaided judgement.
2. **Stand up outcome evaluation** — execute
   `eef-outcome-evaluation-infrastructure.plan.md` to measure delivered value
   against independent ground truth, converting "potential value shown" into
   "delivered value measured."
3. **Ergonomic refinements** — consider a terse/headline projection on
   `evidence-for-move` (§3.C) and clearer framing that axis filters return a
   curated subset, not the full applicable set (§3.B).
4. **Accept as-is and observe** — treat the surface as complete, set expectations
   per §3.D, and let real-world usage on production surface the next priority.

## 6. Provenance and grounding

- All tool output captured live from `oak-prod` on 2026-06-09 in the authoring
  session.
- EEF figures, attribution, and caveats are the
  [EEF Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit)
  snapshot as carried by the corpus; this assessment reports the surface's
  behaviour, not new evidence claims.
- Surface authority: ADR-191 (deterministic data; the agent is the only reasoner),
  ADR-193 (system↔vendor type boundary). Thread: `eef`.
