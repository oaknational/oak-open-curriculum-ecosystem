# EEF corpus-grounding rule: cite or tag

A thread-scoped rule, not an always-on one. It applies whenever you author or
edit a document or code that makes a claim about the EEF corpus — read it when
working the EEF thread or touching `EEF_TOOLKIT_DATA`.

## Why this rule exists

The EEF corpus (`EEF_TOOLKIT_DATA`, `as const`, in
`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`) is
the single source of truth: what the file holds is exactly what exists. A
plausible-but-ungrounded concept — a key-stage → phase mapping the corpus does
not contain (phase and key stage are two independent fields) — was carried into
the canonical plan and survived several review sweeps, caught only by chance.
Prose review alone does not reliably catch a claim that reads as sensible but
has no basis in the data. This rule makes the grounding explicit at write time.

## The rule

Every claim a document or comment makes about the EEF corpus — a field, value,
vocabulary, mapping, relationship, or cardinality — is one of two things, and
says which:

- **Cite.** A claim derived from the corpus names the `EEF_TOOLKIT_DATA` source
  path it comes from. The
  [source-path table](../current/eef-d2-source-path-table.md) is the canonical
  citation surface; a new corpus claim either appears there or names its path
  inline.
- **Tag.** A concept that is the invoking agent's reasoning rather than corpus
  data is marked agent-side (Decision 10 of the live plan governs what the agent
  reasons about — e.g. mapping a teacher's key stage to a phase is agent-side).

A claim that can do neither — cite a real path or carry an agent-side tag — has
no basis and is left out.

## When editing EEF documents or code

Run a disposition pass over the changed claims:

1. Each corpus claim cites a path or carries an agent-side tag (this rule).
2. The prose states the present design positively
   ([`no-tombstones-for-removed-ideas`](../../../../rules/no-tombstones-for-removed-ideas.md)):
   a removed shape is described once as an instruction to act and then left out;
   it is not named again in order to reject it.

## Anchors

- The corpus is the single source of truth; types and lists are deterministic
  projections of it (the live plan's Known-vs-Unknown doctrine, ADR-038).
- Deleting failed content is itself a contamination risk: carry nothing forward
  from a deleted artefact unless it independently re-grounds by cite or tag.
