# Code Pattern Schema for Discoverability

**Origin**: oak-open-curriculum-ecosystem, 2026-03-23
**Context**: Comparison discovered during code-pattern exchange in the
algo-experiments round-trip integration

## Two Schemas, Different Strengths

The portable Practice Core specifies a code-pattern frontmatter schema in
`practice-bootstrap.md` §Code Patterns:

```yaml
---
name: {Pattern Name}
domain: {domain}
proven_by: {brief description}
prevents: {comma-separated failure modes}
---
```

Oak-mcp-ecosystem independently developed a richer schema focused on
**discoverability** — making it easy for agents to find the right pattern
at the right moment:

```yaml
---
name: "Human-readable pattern name"
use_this_when: "One sentence: the situation where this pattern applies"
category: type-safety | validation | architecture | testing | error-handling
proven_in: "file path where pattern was first applied or proven"
proven_date: YYYY-MM-DD
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "What mistake this prevents"
  stable: true
---
```

## Why the Richer Schema

### `use_this_when` vs `name`

The `use_this_when` field is the primary **discovery mechanism**. It
describes the moment an engineer should think "I have seen this before."
Compare:

- `name: "Drift Detection Validation"` — you need to already know the
  pattern exists to search for it
- `use_this_when: "A manually maintained list should match a canonical
  source but cannot be derived"` — you can find this by describing your
  situation

### `barrier` as explicit checklist

The four-field `barrier` object makes the three-part bar (validated?
prevents recurring mistake? stable?) into an explicit checklist that
must be filled in at creation time. The simpler `proven_by` / `prevents`
fields are easier to write but don't enforce the "broadly applicable"
and "stable" criteria.

### `proven_in` with file path

A specific file path (not just a description) means an agent can
navigate to the proof. "Proven by cross-platform skills review" is
weaker evidence than "Proven in
`apps/oak-search-cli/src/lib/elasticsearch/index-meta.ts`".

## Suggested Convergence

The richer schema is backwards-compatible with the simpler one:

- `name` → keep as-is
- `domain` → map to `category`
- `proven_by` → map to `proven_in` + `proven_date`
- `prevents` → map to `barrier.prevents_recurring_mistake`
- Add `use_this_when` (the discoverability gain)
- Add `barrier` (the entry-criteria enforcement)

## Porting Advice

- If you adopt this schema, update your code-patterns `README.md` to
  document it (the `use_this_when` field is the key addition)
- Existing patterns can be migrated incrementally — add the new fields
  when you next touch the file
- The portable Core's `practice-bootstrap.md` §Code Patterns template
  could carry both schemas (simple for POC repos, rich for production)
