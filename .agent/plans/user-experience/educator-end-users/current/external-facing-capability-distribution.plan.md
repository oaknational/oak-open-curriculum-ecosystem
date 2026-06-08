---
name: "External-facing capability distribution — synthesise our plan estate into one coherent set"
collection: user-experience
audience: educator-end-users
lane: current
status: current
type: executable
last_updated: 2026-06-08
---

# External-facing capability distribution — plan-estate synthesis

> **Executable, queued (`current/`).** The deliverable is a **coherent,
> up-to-date set of our own plan documents** for distributing Oak's
> external-facing curriculum-assistance capability — synthesised from the
> relocated [`../previous-materials/`](../previous-materials/README.md) and the
> seed review [`../external-facing-skills-and-mcp-surfaces-review.report.md`](../external-facing-skills-and-mcp-surfaces-review.report.md).
> This is plan-estate consolidation, **not** a product/distribution decision: it
> captures verified facts, reconciles inconsistencies, and **frames** the open
> decisions — it does **not** resolve where the capability source-of-truth lives
> or which hosts ship first, and it does **not** assume `oaknational/oak-skills`
> remains the source of truth.

## Problem and intent

Our forward intent for external-facing curriculum-assistance is currently
scattered and internally inconsistent across the relocated previous-materials
(four discovery skills-lane docs, the education-skills MCP surface plan, the
Cursor plugins plan, the directory-submission compliance plan) plus the seed
review report. The set predates verified findings (the cross-vendor plugin-bundle
convergence; the EEF c4/c5 MCP surfaces; the default-on flag change) and contains
concrete contradictions — e.g. the skill count (the seed report says seven,
including `oak-accessibility`; the relocated `agent-skills-discovery.plan.md` says
six, predating `oak-accessibility`). A future executor cannot pick this up as one
coherent strategy.

**Intent:** produce one coherent, current, internally-consistent set of plan
documents a future session can act on — capturing what is verified, reconciling
what conflicts, and naming the open decisions cleanly — without prejudging the
downstream product decisions.

## End goal, mechanism, and means

- **End goal.** A coherent current strategy for external-facing
  curriculum-assistance capability distribution that reads true in one pass:
  verified facts grounded, contradictions reconciled, open decisions named (not
  made), and the relocated previous-materials superseded as forward intent (but
  retained as inputs).
- **Mechanism.** Synthesise in place: this plan is the consolidated home; its
  todos reconcile and ground the estate; the previous-materials become cited
  inputs with a supersession pointer.
- **Means.** The six cycles below, executable now — no external dependency
  blocks the synthesis of our own documents.

## Verified facts to carry (grounded first-hand 2026-06-08; re-verify platform facts at use)

- Oak holds two external-facing packagings of curriculum-assistance: the
  `oaknational/oak-skills` library (Agent Skills + a Claude plugin, a separate
  repo not edited from here) and this repo's MCP server (incl. EEF c4/c5
  `eef://interpretation` resource + `adapt-lesson` prompt).
- The **plugin bundle** is the cross-vendor packaging layer: Claude plugins and
  OpenAI Codex plugins both bundle skills + MCP via a marketplace; MCP is the
  common runtime; `SKILL.md` is the portable skill format.
- The EEF surface is **default-ON in this repo** (commit `d3109d7c`); the live
  gate is **deployment** to the Oak Curriculum MCP, not the repo flag.
- The EEF↔oak-skills reciprocal announcement splits across the repo boundary;
  the oak-skills-side half is an upstream request
  ([`reference-eef-evidence-once-live.md`](../../../upstream-feature-requests/oak-skills/reference-eef-evidence-once-live.md)).

These are current-state facts. They are **not** assumptions about the future —
in particular, that `oak-skills` is *currently* the external generator is a fact;
that it *remains* the source of truth is an open decision (below), not carried here.

## Todos

```yaml
todos:
  - id: t1-reconcile-inventory
    content: >-
      Reconcile factual contradictions across the previous-materials + seed report
      against authoritative live sources. Named instance: the skill count (7 incl
      oak-accessibility vs 6) — resolve against the live oaknational/oak-skills
      directory as authoritative (ADR-125 drift discipline: the directory, not a
      doc's prose count, is the authority). Acceptance: no contradictory factual
      claim survives in the coherent set; counts/inventory defer to the live
      directory with a cited as-of date. Validation: grep the set for skill-count
      and inventory claims; one consistent statement or an explicit defer-to-source.
    status: pending
  - id: t2-synthesise-coherent-strategy
    content: >-
      Author the coherent current strategy body (verified facts above + the
      capability-first / packaging-second framing + the audience-led ADR-189
      placement). Every forward claim is either grounded first-hand (cited) or
      tagged as a named open decision. Do NOT assume oak-skills remains the source
      of truth, a specific packaging, or a specific host. Acceptance: each
      load-bearing claim carries a citation or a decision-tag; zero unsupported
      future assumptions. Validation: each claim line resolves to a source or a
      t3 decision id.
    status: pending
    depends_on: [t1-reconcile-inventory]
  - id: t3-frame-open-decisions
    content: >-
      Enumerate the open owner decisions the coherent set surfaces — where the
      capability source-of-truth lives (oak-skills, a layer above it, or a new
      home); packaging (plugin bundle vs other); which hosts/marketplaces first
      (note the UK/EEA ChatGPT-Apps gap); first-tranche capability scope — each as
      a named decision with its considerations and the evidence that would resolve
      it. Acceptance: every decision is named not made (research-outputs-name-not-
      make-decisions); none is pre-answered. Validation: each entry has
      considerations + a resolution-evidence line and no verdict.
    status: pending
    depends_on: [t1-reconcile-inventory]
  - id: t4-supersede-and-crossref
    content: >-
      Mark the previous-materials' forward intent superseded by this set (retain
      them as inputs; add a supersession pointer per the consolidate-docs
      supersession discipline). Wire cross-refs that do NOT duplicate: the
      discovery parent owns the layer map; ADR-189 owns the taxonomy; the EEF
      thread owns the MCP surface. Acceptance: previous-materials README carries a
      "superseded-by" pointer; no layer-map duplication; all links resolve.
      Validation: link-resolve check; grep for duplicated layer-map content.
    status: pending
    depends_on: [t2-synthesise-coherent-strategy, t3-frame-open-decisions]
  - id: t5-update-indexes
    content: >-
      Update the educator-end-users README and repo-continuity Active-threads /
      next-safe-step to point at this plan as the current external-facing-capability
      home. Acceptance: both reference this plan; the next session can pick it up
      from the indexes alone. Validation: links resolve; repo-continuity names the
      next safe step as this plan.
    status: pending
    depends_on: [t4-supersede-and-crossref]
  - id: t6-coherence-validation
    content: >-
      Whole-set coherence pass: pnpm markdownlint + format + link-resolve green on
      the set; a one-pass internal-consistency read (no surviving contradictions;
      every forward claim grounded or decision-tagged). Acceptance: gates green and
      the set reads true in one pass. Validation: pnpm markdownlint:root + the
      repo link check on the touched files; self-review pass recorded in the
      closeout.
    status: pending
    depends_on: [t5-update-indexes]
```

## Open owner decisions (named here, resolved at a later product step — NOT by this plan)

1. Where does the external-facing capability source-of-truth live — `oak-skills`,
   a capability-manifest layer above it, or a new home? (We do not assume
   `oak-skills`.)
2. Packaging: a cross-vendor plugin bundle, or another shape?
3. Which hosts/marketplaces first (the UK/EEA ChatGPT-Apps availability gap bears
   on this)?
4. First-tranche capability scope (lesson adaptation + evidence framing are the
   strongest candidates given EEF, but the scope call is the owner's).

These are recorded so the coherent set frames them; resolving them is a separate
product decision with its own prerequisites (publication intent; EEF deployment;
cross-repo agreement).

## Non-goals

- Do not resolve the open decisions above; frame them only.
- Do not assume `oak-skills` is or remains the source of truth, or any specific
  packaging/host outcome.
- Do not edit `oak-skills` (separate repo; upstream requests only).
- Do not duplicate the discovery parent's layer map or the ADR-189 taxonomy.
- Do not build or design a generator/registry here — that is downstream of the
  source-of-truth decision.

## Prerequisite classification

- The synthesis of our own documents has **no blocking external prerequisite** —
  it is executable now. The previous-materials and the seed report are present and
  read; the verified facts are grounded.
- **`beneficial`** — a live check against the `oaknational/oak-skills` directory
  for t1's inventory reconciliation. *Without it:* defer the count to "the live
  directory as of execution" rather than asserting a number.

## Quality gates

Per-cycle: the validation line in each todo. Whole-set (t6): `pnpm markdownlint:root`,
`pnpm format:root` (or the staged-file equivalents), and the repo link-resolve
check on the touched files, plus a one-pass internal-consistency read. The commit
runs the full pre-commit gate.

## Acceptance / proof contract

Proof level **non-code**. Done when: every contradiction in the inputs is
reconciled (t1); the coherent strategy carries only grounded-or-decision-tagged
claims with no future assumptions (t2/t3); the previous-materials are superseded
with a pointer and inputs retained (t4); the indexes route to this plan (t5); and
markdownlint/format/link gates are green with a recorded one-pass coherence read
(t6). Completion is the coherent set + the commit, not a count.

## Risks and unknowns

| Risk / unknown | Impact | Mitigation |
| --- | --- | --- |
| Re-importing stale forward intent from previous-materials | Incoherence returns | t2 carries only grounded-or-decision-tagged claims; previous-materials are inputs, not authority |
| Smuggling a downstream assumption (e.g. oak-skills-as-source-of-truth) back in | The exact frame error this reframe corrects | t3 keeps the source-of-truth question open; t2 forbids future assumptions |
| Platform facts drift | Vendor specifics go stale | Verified-facts block is dated; re-verify platform facts at use |
| Over-reach into product design | Scope creep into a decision this plan must only frame | Non-goals + the "frame not resolve" contract |

## Foundation alignment

`principles.md` (replace-don't-bridge, no special cases, YAGNI),
`testing-strategy.md` (validation-as-proof, here non-code), ADR-189 (audience-led
taxonomy), ADR-191 (deterministic data; agent reasons), the discovery parent
(layer map), `consolidate-docs` supersession discipline, and
`research-outputs-name-not-make-decisions`.

## Plan-body first-principles check

Fires per [`../../../../rules/plan-body-first-principles-check.md`](../../../../rules/plan-body-first-principles-check.md):
**shape** — `current/` executable is correct: synthesising our own documents has
no blocking external dependency, unlike the downstream product strategy (which is
genuinely owner/EEF/cross-repo gated and is framed here, not executed).
**landing-path** — one docs commit producing the coherent set; each todo ends
markdownlint/link green. **vendor-literal** — the verified-facts block was
grounded first-hand 2026-06-08; platform specifics are re-verified at use.

## First Question

Could it be simpler without compromising quality? **Yes — and the reframe is the
simplification.** The deliverable is coherence of our own estate, achievable now
and independent of every unresolved downstream decision. The plan resists the
heavier shape (designing the product/distribution strategy, pre-committing a
source-of-truth) precisely because that work is gated and not needed to make our
documents coherent.

## Readiness reviewers

`assumptions-expert` reviewed the prior (mis-scoped `future/`) draft and validated
the underlying facts + flagged the skill-count inconsistency (now t1). This
reframe to a `current/` synthesis-of-our-documents plan addresses the one frame
issue it could not (altitude is the owner's call, now set). Re-dispatch a focused
`assumptions-expert` pass on execution if the synthesis surfaces new scope.

## Learning loop & lifecycle triggers

On completion: run `oak-consolidate-docs`; supersede the previous-materials'
forward intent; update repo-continuity to point at the coherent set; route any
durable doctrine (e.g. the capability-first / reciprocal-announcement framing) to
its permanent home if it stabilises. Lifecycle triggers per
[`../../../templates/components/lifecycle-triggers.md`](../../../templates/components/lifecycle-triggers.md).
