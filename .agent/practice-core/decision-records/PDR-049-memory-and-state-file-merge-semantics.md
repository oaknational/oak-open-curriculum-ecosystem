---
pdr_kind: governance
---

# PDR-049: Memory and State File Merge Semantics

**Status**: Accepted
**Date**: 2026-05-06
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(consolidation and knowledge-flow — defines the layered surfaces this
PDR governs at merge time);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads and sessions — names the unit of coordination that *is not* the
unit of git history; the gap between those two units is the structural
cause this PDR addresses);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(perturbation mechanisms — Family A Class A.3 names the shared-git-
transaction tripwire; this PDR specifies the *post-divergence* discipline
when the tripwire was correctly observed but two branches still produced
conflicts in shared state);
[PDR-035](PDR-035-collaboration-state-ownership.md)
(collaboration-state ownership — names which agents own which surfaces;
this PDR composes by adding *merge ownership* on top of edit ownership);
[PDR-046](PDR-046-layered-knowledge-processing.md)
(layered knowledge processing — the staircase whose Layer-0 / Layer-1 /
Layer-2 surfaces accumulate the diverging content this PDR resolves);
[PDR-050](PDR-050-state-memory-substrate-contracts.md)
(state and memory substrate contracts — the broader surface-contract and
immune-layer doctrine that this merge-time PDR serves).

## Context

Practice-bearing repos accumulate sessions in parallel branches. Every
session touches *shared global memory and state surfaces*: the napkin,
the shared communication log, the active and closed claims registries,
the pending-graduations register, the repo-continuity index, per-thread
next-session records, and adjacent files. These surfaces evolve through
every session and every consolidation pass.

The Practice's coordination primitives partition work by **thread**:
the host's active-claims registry records which agent is operating on
which thread, with which intent. The host bridge names the concrete
registry path for this repository.
Threads are the contract that makes parallel work safe at the *intent*
layer. Two sessions on disjoint threads are non-overlapping by
construction.

But git records persistence by **file**. The Practice's shared memory
and state surfaces are global files that every thread writes to. Two
sessions on disjoint threads can both append a session-handoff entry to
the same `repo-continuity.md`, both archive a claim into the same
`closed-claims.archive.json`, both add a comms event that renders into
the same `shared-comms-log.md`. Each session is correct in isolation;
both push to their respective branches; the merge produces a file-level
conflict.

The conflict is **structural**, not a coordination failure. Threads
coordinate intent; files coordinate persistence; the gap between the
two units is unavoidable for any Practice that retains long-running
parallel branches with shared global state. This PDR names the discipline
that closes the gap at merge time.

## Decision

### Git topology is part of the merge contract

These semantics govern conflict resolution inside a real git merge. They do
not replace git.

A memory/state reconciliation that copies files, cherry-picks content,
rebases away the integration, or otherwise lands as a single-parent snapshot
is not a completed merge for this PDR. The resolver MUST start from a git merge
operation, preferably:

```bash
git merge --no-commit --no-ff <target-ref>
```

Then resolve the conflicts with the per-file semantics below and land a merge
commit with both parents, unless the owner explicitly chooses a different git
topology. After committing, verify both the parent shape and ancestry:

```bash
git show --no-patch --pretty=raw HEAD
git merge-base --is-ancestor <target-ref> HEAD
```

The semantic union preserves the Practice's memory content; the merge commit
preserves Git's parent links, merge-base calculations, and future conflict
resolution behaviour. Both are required.

### Per-file-class merge semantics

Memory and state files fall into four merge classes plus one
no-merge case. Each class has a defined merge semantic that a
reviewer applies when resolving a conflict, and a canonical
`merge_class` token (see §File-Level Metadata Contract).

| Class (`merge_class:`) | Examples | Shape | Merge semantic |
|---|---|---|---|
| `append-only-narrative` | napkin entries; shared-comms-log narrative | Dated/timestamped headed sections, ordered by the file's own convention (newest-first or oldest-first) | **Union by section identity (date + agent + heading).** Both sides' new sections survive. Order follows the file's natural ordering rule. Conflicts on the *same* section are rare and indicate two agents wrote the same heading independently — investigate and merge their contents, never silently discard either. |
| `append-only-structured-by-<key>` | closed-claims archive (`by-claim_id`); per-decision-thread conversation files (`by-entry_id`) | Records keyed by a stable identifier; the `<key>` token names the field carrying the identity | **Union by stable key.** Both sides' new entries survive. Duplicate keys after union are not random collisions (UUID v4 makes random collision astronomically unlikely) — they signal **legitimate concurrent archival**: the underlying entry existed on the merge-base, both branches independently transitioned it, and each wrote its own closure / resolution metadata. See §Conflict Investigation Discipline for resolution. |
| `mostly-append-register` | pending-graduations register; per-thread participating-agent identity tables | Structured entries with a stable schema; entries are added far more often than they are edited | **Union by entry identity.** New entries on either side survive. Edits to the *same existing entry* on both sides are genuine conflicts requiring per-entry semantic merging — apply the field-level rules from the surface's own conventions when present, otherwise route to the entry's owning agent or the next-session reviewer. |
| `index-narrative-tables` | repo-continuity (per-thread tables, narrative session-close notes, status fields, deep-consolidation status) | Multiple sections, each with its own shape | **Section-aware reconciliation.** Treat each section as belonging to its own class above and apply that class's semantic. Tables merge row-by-row by stable row key (e.g. thread name). Narrative blocks union by identity. Status fields prefer the more recent timestamped status; older statuses move into the file's chronological history if the file maintains one. |
| `exclusive-create-fragments` | per-event comms-event JSON files; per-session experience files | One file per event/session, written exactly once with a UUID filename, never modified | **No merge needed.** Concurrent branches write disjoint files. Git sees two adds in different paths — there is no conflict by construction. Recorded as a `merge_class` value so directory-level conventions are explicit and so audit tooling can confirm "no edits after creation". |

### File-Level Metadata Contract

Each in-scope file declares its merge class inline so the doctrine is
co-located with the file and so future tooling (investment-staircase
level 3) can read the class without an external lookup table.

**Markdown files** with existing YAML frontmatter add a single key:

```yaml
---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "..."
merge_class: append-only-narrative
---
```

**JSON files** with a sibling JSON Schema declare the class on the
**schema**, not the data file, so the metadata travels with the type
contract:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": ".../closed-claims.schema.json",
  "$merge_class": "append-only-structured-by-claim_id",
  ...
}
```

`active-claims.schema.json` uses `index-narrative-tables` because its
top-level object contains multiple keyed registers. Merge `claims[]` by
`claim_id` and `commit_queue[]` by `intent_id`. If one side closed or
completed an entry and the corresponding evidence exists in the closed archive
or commit history, do not resurrect it as active merely because it still
appears on the other side.

**Per-event JSON fragment directories** (one file per event, never
modified after creation) declare the class on the directory's
`README.md` frontmatter as `merge_class: exclusive-create-fragments`.
Individual fragments need no metadata.

The five permitted values are exactly the five `merge_class` tokens
named in the per-class table above:
`append-only-narrative`,
`append-only-structured-by-<key>`,
`mostly-append-register`,
`index-narrative-tables`,
`exclusive-create-fragments`.

For `append-only-structured-by-<key>`, the `<key>` token names the
field carrying the entry identity (e.g.
`append-only-structured-by-claim_id`). This makes the merge semantic
unambiguous at file-read time.

A file in scope for this PDR but lacking a `merge_class` declaration
is a **doctrine gap** to be closed at the next consolidation pass — not
permission to fall back to git's default 3-way merge.

### Authority-of-the-most-recent does not override semantic union

Naive 3-way merges that pick "ours" or "theirs" wholesale silently
discard one side's correct contribution. Doctrine forbids that resolution
shape for these files. The *cheapest legitimate* resolution is the
semantic union; it is also the one that preserves the most evidence.

The merge resolver MUST:

1. Identify each file's class (above).
2. Apply the class's semantic.
3. Read the merged file end-to-end before staging — the semantic union
   may produce a file that parses but is internally incoherent (e.g.,
   two different status entries in the same status field). End-to-end
   reading is the human-or-agent verification gate.
4. Verify that the merged file's structural validators still pass
   (markdown lint, JSON schema, fitness counters as applicable).

### Forbidden resolutions

- `git checkout --ours` or `--theirs` on these files: silent loss.
- `git merge -X ours/theirs`: same shape, same loss, made global.
- "Take whichever is longer": longer-is-not-always-superset; only a
  semantic check confirms supersedence.
- Removing entries to fit a fitness target during merge resolution:
  fitness pressure routes to a separate consolidation pass per
  PDR-046 — never resolves through merge-time deletion.
- Auto-resolving JSON-array conflicts by concatenation without
  duplicate-key check: hides the coordination bugs the duplicate-key
  signal would otherwise surface.

### Conflict investigation discipline

When a same-key, same-section, or same-entry collision appears, treat it
as a coordination signal, not as a merge nuisance.

The canonical structured-key collision is **legitimate concurrent
archival** of a pre-existing active entry. Concretely, with two
same-`claim_id` archive entries:

1. At merge-base time, the claim existed in the host active-claims
   registry with that `claim_id`.
2. Branch A's session ran an explicit close; archive entry written
   with `closure.kind: "explicit"`.
3. Branch B's consolidation pass independently observed the same
   claim past its TTL and ran a stale archive; archive entry written
   with `closure.kind: "stale"`.
4. Both branches removed the entry from the host active-claims registry
   (matching shape — no conflict on the active side).
5. Both branches added a closed-claim entry with the **same
   `claim_id`** but **different closure metadata**.

This is *not* a UUID collision. UUID v4 carries 122 bits of entropy;
independent generation never produces the same id. A duplicate-key
case is therefore always a *concurrency-on-a-pre-existing-entry*
signal — branch B archived without seeing branch A's close intent.
Investigation question: *"did the agents have visibility of each
other's intended state transition before they each acted, and if not,
which coordination surface should have surfaced it?"* The answer
shapes the resolution: keep the more authoritative closure (typically
explicit over stale; closer-to-the-claimant over consolidator);
record the other in the conversation thread or shared comms log as
evidence of the parallel observation.

Other collision shapes (same-section narrative, same-entry register
edits) follow the same investigative posture: the merge surfaces a
parallel-action; resolve by preserving both pieces of evidence and
adopting the substantively-correct view, never by silently discarding
either side.

## Investment Staircase

This PDR commits the Practice to the *minimum doctrine* that prevents
information loss at merge time — the per-class semantics above plus the
forbidden-resolution list. Two further investment levels are available
and both remain optional, to be promoted under evidence:

1. **Codify only** *(this PDR's commitment)*. Reviewers apply the
   semantics manually when merging. Cost: agent discipline. Benefit:
   no setup; portable across all hosts immediately.
2. **Codify plus checklist partial.** Add a session-handoff partial that
   surfaces the per-class checklist whenever a merge involves these
   files. Cost: one additional partial, one trigger surface. Promote
   after the second instance of the same merge-class collision recurring.
3. **Codify plus custom merge drivers.** Register per-class git merge
   drivers in `.gitattributes` and host-local git config that
   auto-apply the union semantic with duplicate-key checking. Cost:
   driver authoring, per-checkout `git config` bootstrap, ongoing
   maintenance as schemas evolve. Promote when the cost of manual
   resolution exceeds the cost of driver maintenance — typically after
   evidence at N≥3 hosts or N≥5 collisions on a single host.

The staircase is intentional. Driver-level automation is harder to
audit than declarative doctrine; doctrine is the layer where the
substance lives, and automation is a productivity wrapper that costs
its own maintenance.

## Composition with Existing Collaboration-State Doctrine

The collaboration-state surface family already has three doctrine
documents that govern the *single-branch* lifecycle:

- **Conventions** — surface index, schema-evolution rules, write-safety
  contract.
- **Lifecycle** — operational recipes for open / refresh / close /
  archive.
- **Placement contract** — substance-kind-to-file routing.

This PDR is the *cross-branch* counterpart. Where the existing trio
governs how state is *written* on a single branch, PDR-049 governs how
state is *reconciled* when two branches that each followed the trio
correctly produce a divergence. The two layers compose: respect the
write-safety contract on each branch, then apply the merge semantics
when integrating.

A merge conflict on these surfaces is **never** evidence that the
single-branch doctrine was violated. It is evidence that two correct
single-branch sessions ran in parallel, which is the system working as
designed.

## Notes for Hosts Adopting This PDR

Each host repo will have its own concrete inventory of memory and state
files. The default mechanism is **per-file `merge_class` metadata**
(per §File-Level Metadata Contract) — declarative, co-located with the
file, and machine-readable.

When per-file metadata is insufficient — for example, when a host
introduces a file class outside the five-value vocabulary, or when a
host wants to record file-by-file merge nuances richer than a single
token (priority resolution rules, per-section overrides, host-specific
schema variants) — the host MAY add a dedicated host-local policy
surface. The host bridge names that surface when present.

The default order is therefore:

1. Per-file `merge_class` metadata (no policy file).
2. Policy file in operational memory if and when extra detail is
   needed.
3. Bridge-index pointer to the policy file when one exists.

Adding the policy file before evidence demands it is premature
centralisation — keep substance with the file unless the host has a
concrete reason to centralise.

When a host first encounters a memory/state merge conflict, it SHOULD:

1. Start from a real git merge operation.
2. Resolve the conflict using the per-class semantics above.
3. Record the file-to-class mapping in the host's bridge index if not
   already recorded.
4. Capture the incident in the host's napkin under the structured
   surprise format, naming any same-key / same-entry collisions as
   coordination signals to investigate.
5. Cite this PDR in the resolution commit's body as the authority.
6. Verify that the result is a merge commit and that the target branch is an
   ancestor of the result.

A host that observes its second instance of the same merge-class
collision SHOULD raise the investment-staircase question with the owner
— at that point, the checklist partial may be the right next step. A
host that observes coordination bugs (duplicate keys) SHOULD investigate
the upstream coordination flow, not deepen the merge-time discipline.

## Founding Instance

This PDR was authored at the moment of the first observed instance: five
shared memory and state files diverged on two parallel branches, all
conflicts were append-shape (no deletions on either side), and resolving
without doctrine would have risked silent loss of one side's
contributions to either the napkin, the shared communication log, the
closed-claims archive, the pending-graduations register, or the
repo-continuity index. The PDR was written *before* the merge resolution
to ensure the resolution follows the doctrine rather than the doctrine
being shaped to ratify the resolution after the fact — the
authoring-discipline rule from PDR-047.
