# Provenance UUID Migration

> **Status**: Proposal — adopted in agent-collaboration, ready for
> upstream consideration
> **Date**: 2026-04-03
> **Origin**: agent-collaboration

## What Changed

Replaced sequential `index` integer fields in `provenance.yml` with
UUID v4 `id` fields. Updated the provenance field specification in
`practice-lineage.md` accordingly (`index` → `id`).

## Why

Sequential indices create three problems that UUIDs solve:

1. **Implied hierarchy.** `index: 17` reads as "more evolved than
   index: 5." The provenance chain is a timeline, not a ranking —
   repos evolve independently and a later entry does not imply
   superiority. UUIDs carry no ordinal suggestion. The timeline is
   still readable from the array order and `date` field.

2. **Merge conflicts during exchange.** When two repos evolve
   independently and their provenance chains diverge, sequential
   indices collide. Repo A might have entries 0–20, Repo B might
   have entries 0–18 plus 3 new ones. Merging requires renumbering.
   UUIDs are collision-free by design — chains can be concatenated
   or interleaved without renumbering.

3. **Cross-reference fragility.** If any future mechanism references
   a specific provenance entry (e.g. linking a changelog entry to
   the provenance record that created it), sequential indices break
   when entries are inserted or reordered. UUIDs are stable
   identifiers that survive structural changes.

## What to Change in a Receiving Repo

### provenance.yml

Replace every `index: N` with `id: <uuid-v4>`. Generate a fresh UUID
for each entry — do not reuse UUIDs from other repos. Existing
entries keep their `repo`, `date`, and `purpose` fields unchanged.

Before:

```yaml
practice.md:
  - index: 0
    repo: my-repo
    date: 2026-01-15
    purpose: 'Initial Practice installation'
  - index: 1
    repo: my-repo
    date: 2026-02-20
    purpose: 'Integrated round-trip from other-repo'
```

After:

```yaml
practice.md:
  - id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
    repo: my-repo
    date: 2026-01-15
    purpose: 'Initial Practice installation'
  - id: f9e8d7c6-b5a4-3210-fedc-ba9876543210
    repo: my-repo
    date: 2026-02-20
    purpose: 'Integrated round-trip from other-repo'
```

### practice-lineage.md

Update the provenance field specification table:

| Before | After |
| --- | --- |
| `index` — Position in the chain. 0 is the origin. | `id` — UUID identifying this entry. Unique across all chains. |

Update prose that references "index 0", "a higher index", or
"the chain tracks origin (index 0)":

- "origin (index 0)" → "origin (first entry)"
- "a higher index does not imply superiority" → "a later entry does
  not imply superiority"

### Validation scripts

If you have validation scripts that check provenance structure, update
field expectations from `index` (integer) to `id` (string matching
UUID v4 format: `[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}`).

## Backwards Compatibility

Receiving repos that have not yet migrated will have `index` fields.
During integration, convert incoming `index` entries to `id` at the
same time — generate UUIDs for all entries in one pass. There is no
need to maintain both fields or support mixed format.

## How to Apply the Three-Part Bar

1. **Validated by real work?** Yes — applied in agent-collaboration
   during initial Practice adaptation. No issues encountered.
2. **Would its absence cause a recurring mistake?** The implied
   hierarchy problem is subtle but real — agents and humans read
   "index: 17" as "version 17" and infer progression. The merge
   conflict problem becomes acute as the Practice propagates to more
   repos.
3. **Stable?** Yes — UUID v4 is a well-understood standard. The
   migration is a one-time operation per repo. No ongoing churn.
