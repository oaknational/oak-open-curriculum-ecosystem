---
classification: situational
description: EEF corpus grounding — when authoring or editing a claim about the EEF corpus (EEF_TOOLKIT_DATA), cite the source path it derives from or tag it agent-side; a claim that can do neither is left out.
trigger: surface:eef-corpus — Authoring/editing a claim about the EEF corpus or EEF-thread work
globs:
  - packages/sdks/graph-corpus-sdk/**
---

# EEF Corpus Grounding: Cite or Tag

Operationalises [ADR-038 (Compilation-Time Revolution)](../../docs/architecture/architectural-decisions/038-compilation-time-revolution.md)
for the EEF corpus, and applies [`verify-dont-trust`](verify-dont-trust.md) and
[`no-tombstones-for-removed-ideas`](no-tombstones-for-removed-ideas.md) at
EEF-corpus authoring time.

**Classification: trigger-loaded.** This rule is EEF-scoped, not part of the
always-applied baseline. Read and apply it when the trigger below fires; outside
EEF work it does not load.

## Trigger

You are authoring or editing a document, comment, plan, or code that makes a
claim about the EEF corpus — a field, value, vocabulary, mapping, relationship,
or cardinality — or you are otherwise touching `EEF_TOOLKIT_DATA`.

## Source Strategy Is Owner-Shaped

When a new authoritative source overlaps this corpus (owner-settled
2026-06-12, the DfE statistics API): the repo's posture is **multi-source
complementarity** — each source stays whole and authoritative for what it
is (an evidence synthesis and a statistics estate are different epistemic
objects even where fields overlap). Never frame an overlapping source as
a replacement: which sources a product draws on is source strategy, an
owner decision like feature shaping. Sweep drafts for "replacement",
"supersede", or "relieve X of carrying" framing before presenting; flag
any genuine supersession question as an owner decision to ask, never
assert.

## Action

The EEF corpus (`EEF_TOOLKIT_DATA`, declared `as const` in
[`eef-toolkit.external-data.ts`](../../packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts))
is the single source of truth: what the file holds is exactly what exists. Types
and lists are deterministic projections of it (ADR-038).

Every claim a document or comment makes about the corpus is one of two things,
and says which:

- **Cite.** A claim derived from the corpus names the `EEF_TOOLKIT_DATA` source
  path it comes from. The
  source-path table
  is the canonical citation surface; a new corpus claim either appears there or
  names its path inline.
- **Tag.** A concept that is the invoking agent's reasoning rather than corpus
  data is marked agent-side. (Decision 10 of the live EEF plan governs what the
  agent reasons about — for example, mapping a teacher's key stage to a phase is
  agent-side, because the corpus holds phase and key stage as two independent
  fields with no mapping between them.)

A claim that can do neither — cite a real path or carry an agent-side tag — has
no basis and is left out.

When editing EEF documents or code, run a disposition pass over the changed
claims:

1. Each corpus claim cites a path or carries an agent-side tag (this rule).
2. The prose states the present design positively
   ([`no-tombstones-for-removed-ideas`](no-tombstones-for-removed-ideas.md)): a
   removed shape is described once as an instruction to act and then left out; it
   is not named again in order to reject it.

## Failure mode this prevents

A plausible-but-ungrounded claim — a key-stage → phase mapping the corpus does
not contain — was carried into the canonical EEF plan and survived several review
sweeps, caught only by chance. Prose review alone does not reliably catch a claim
that reads as sensible but has no basis in the data. Citing or tagging at write
time makes grounding explicit, so an ungrounded claim is visible as the one
assertion that can do neither.

Deleting failed content is itself a contamination risk: carry nothing forward
from a deleted or superseded artefact unless it independently re-grounds by cite
or tag.
