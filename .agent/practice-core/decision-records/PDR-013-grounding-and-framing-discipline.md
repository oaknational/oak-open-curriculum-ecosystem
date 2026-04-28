---
pdr_kind: governance
---

# PDR-013: Grounding and Framing Discipline

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(findings that emerge from ungrounded framing are routed per
PDR-012; a pattern of ungrounded framing is itself a surfacable
finding).

## Context

Framing — how a problem, proposal, or finding is described — shapes
what comes next. A framing that sounds coherent can be wrong in
load-bearing ways without the wrongness being visible from the
framing itself. Three distinct failure modes occur when framing
precedes grounding in the actual artefacts:

1. **Scope claims inferred from externals, not from the composition
   root.** An integration pivot is proposed based on what a library
   exports or what its documentation describes, without reading the
   code where the library is actually wired in the repo. The
   proposal names integrations as "missing" that are in fact already
   wired. The framing survives to commit messages, plans, and ADRs;
   the ground truth is discovered later, often at reviewer stage.
2. **Tool output adopted as plan structure.** A static-analysis tool
   (knip, depcruise, ESLint, etc.) produces groupings, counts, and
   categories. These are artefacts of how the tool reports, not
   verified facts about the codebase. When the tool's framing
   becomes the plan's framing, the plan inherits whatever the tool's
   aggregation choices happened to be — which may be materially
   different from what the work actually needs.
3. **Classification before evidence.** A tool reports findings; the
   agent labels them (false positive / likely leftover / needs
   investigation) based on plausible-sounding narratives. The labels
   become plan structure. No investigation happens; the labels are
   inherited as if verified. Downstream work treats the labels as
   classification rather than as pre-classification hypothesis.

Underlying cause: framing is cheap to produce; grounding is
expensive. Under time pressure or with a bias toward progress,
framing races ahead of grounding and the gap is invisible until
someone who knows the ground corrects the framing — often at the
cost of rework.

## Decision

**Grounding precedes framing. Before a scope claim, an integration
proposal, a plan structure adopting tool output, or a classification
of findings, the grounding read must have happened and the grounded
evidence must inform the framing.**

### The three discipline points

**1. Composition root before scope.** Before proposing what a system
uses or doesn't use from a library or external surface, read the
**composition root** — the file(s) where the external surface is
initialised, configured, and integrated. SDK exports and library
documentation describe what _could_ be used; the composition root
reveals what _is_ used. Examples of composition roots: a Node
application's entry point plus its bootstrap chain; a web app's
root component mount and its provider tree; a CLI's command
dispatch plus its dependency-graph assembly.

**2. Tool output is input, not structure.** When a static-analysis
tool produces findings, the tool's groupings, counts, and categories
are _inputs_ to planning, not plan structure. Before a plan adopts
tool framing:

- **Counts** — re-run the tool; parse every finding; verify the
  count independently.
- **Categories** — challenge each category. "Unused" may mean
  "unused at compile time but consumed dynamically"; "circular" may
  mean "intentionally coupled by design."
- **Aggregations** — the tool aggregates by its convenience. Plans
  aggregate by work cost, risk, or owner. These may not align.

**3. Evidence before classification.** Every finding from an analysis
tool is **unclassified** until investigation produces evidence.
Classification is the _output_ of investigation, not a label assigned
in advance by plausibility. A plan that classifies findings without
investigation encodes untested hypotheses as facts and makes the
resulting prioritisation structurally unreliable.

### What grounding reads produce

A grounded framing cites specific evidence — file paths with line
numbers, tool outputs, observed behaviour — not inferences from
generic knowledge. Ungrounded framing uses phrases like "typically",
"generally", "the library exposes" without naming a specific
verified artefact.

Grounded framing uses phrases like "the composition root at
`<path>:<line>` shows the integration already registered via
`<call>`", "tool re-run with `<flags>` produces N findings of which
X match pattern Y", "investigation confirmed the finding by
`<method>`."

### Investigation before labels

When a finding's classification is not immediately obvious from
evidence, the plan carries the finding in its unclassified state
with a named investigation step. The plan does **not** assign a
plausibility label in the meantime — the unlabelled state is honest
about what is and isn't known.

## Rationale

**Why grounding beats framing consistently.** Framing draws on
generic knowledge (what libraries typically do, what tools usually
report). Grounding draws on the specific state of this repo at this
commit. When generic knowledge and specific state conflict, the
specific state wins because it is the thing being worked on. Framing
that does not consult specific state has no error-correction when
generic knowledge is outdated, mis-applied, or assumes a different
context.

**Why composition roots are the right grounding target.** A
composition root is where configuration becomes behaviour — where
the abstract "could use X" becomes the concrete "does use X, with
config C." Reading documentation tells you the library's
possibilities; reading the composition root tells you which
possibilities are exercised here.

**Why tool output is input, not structure.** Tool outputs are
optimised for the tool's internal aggregations, not for plan
ergonomics. A knip-reported list of 96 unused files is one framing;
the plan might need four groupings (in-flight refactor residue,
dynamically-consumed exports, test-support utilities, genuinely
unused) that knip does not produce. Inheriting the tool's framing
skips the analysis step that produces the useful framing.

**Why evidence before classification.** Plausibility is a hypothesis;
evidence is a test. A plan that labels findings by plausibility
encodes hypotheses as facts. When downstream work acts on those
labels (deferring "likely leftover" items, deprioritising "false
positives"), it acts on untested hypotheses. Plans collapse when
enough of the untested hypotheses turn out to be wrong.

Alternatives rejected:

- **Ground partially, frame quickly**. Fails under pressure: "partial"
  grounding tends toward the minimum that lets the framing proceed,
  which is often zero.
- **Trust expertise**. Expertise includes generic knowledge; it does
  not substitute for specific-state reads. Experts get specifics
  wrong when they frame first and check later.
- **Trust tools**. Tools are useful at what they do, but their
  output reflects their internal concerns, not the plan's.

## Consequences

### Required

- Every scope claim about what a system uses/doesn't use cites a
  grounding read of the composition root.
- Every plan built on tool output cites a verification run of the
  tool and an independent count.
- Every finding classified in a plan cites evidence, or is carried
  in an unclassified state with an investigation step.
- Reviewer findings about ungrounded framing are actioned under
  PDR-012's routing discipline — not dismissed as stylistic.

### Forbidden

- Scope claims that reference the library/SDK exports as authority
  without reading the composition root.
- Plans whose structure mirrors a tool's output sections without
  independent verification of counts and categories.
- Classifications ("false positive", "likely leftover", "low
  priority") assigned without investigation.
- "Typically X happens" as justification in a plan; specific
  citations only.

### Accepted cost

- Grounding reads take time. A composition root read may take 15-30
  minutes; a proper tool-output verification may take an hour. The
  payoff is reliable framing that does not require rework.
- Unclassified findings in a plan look messier than pre-labelled
  ones. The honest messiness is better than confident wrongness.

## Notes

### Why this PDR is governance, not a pattern

These disciplines govern how Practice work is done (how agents
ground their claims, how plans are structured, how findings are
classified). They are not engineering patterns about code — they are
process disciplines about cognition and planning. The PDR shape
(Context / Decision / Rationale / Consequences) captures that
substance better than the pattern shape would.

### Host-local context (this repo only)

Proven instances, retained as pattern files with `related_pdr:
PDR-013`:

- `.agent/memory/active/patterns/ground-before-framing.md` — Sentry
  observability maximisation pivot: `wrapMcpServerWithSentry` was
  already wired at `core-endpoints.ts:98` but claimed missing until
  the composition root was read.
- `.agent/memory/active/patterns/tool-output-framing-bias.md` — depcruise
  triage plan (2026-04-12): 3 of 4 knip assumptions and 4 of 12
  depcruise assumptions were materially wrong when investigated.
- `.agent/memory/active/patterns/evidence-before-classification.md` — Knip
  triage plan (2026-04-11): 96 unused files and 749 unused exports
  initially labelled without investigation; owner-corrected.
