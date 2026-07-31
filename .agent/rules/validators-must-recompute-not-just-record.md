# Validators Must Recompute, Not Just Record

A validator that *stores* a derived value (content hash, file
fingerprint, manifest checksum, generated-output digest) but does
*not* re-compute and compare on subsequent runs cannot detect
drift. Storage without recomputation is silent drift.

## The Rule

When a validator records a derived value as part of its output —
in a lock file, manifest, snapshot, or schema-versioned state —
the same validator (or a co-located checker) MUST also:

1. Recompute the same value from current inputs on the next run.
2. Compare the recomputed value against the stored value.
3. Fail (or surface a structured drift signal) on mismatch.

A validator that only records the value, never compares it, is a
recording surface, not a validation surface. Naming it "validator"
mis-advertises its function.

## Why

Recording without recomputation produces a system where:

- The lock file *looks* like it captures truth — it has hashes.
- The lock file *is* not enforced — nothing reads the hashes back.
- A hand-edit, a generator drift, or an ingestion-tooling change
  passes every active check.

The failure surface is the worst kind: silent and prolonged. Lock
files in this state degrade trust in the broader validation system
because the contract they appear to enforce is not enforced.

## Worked Failure-Mode Example

A portability validator records `(source, sourceType, computedHash)`
for every vendored canonical artefact in a lock manifest. The
validator's structural checks pass: every entry has the three
fields, the fields parse, the source files exist. A hand-edit to a
vendored artefact's content does NOT change the lock entry — the
hash field is now stale, but no recomputation happens, so no signal
fires.

The corrective is the natural one:

- recompute `localHash` from the current artefact content;
- compare `localHash` with the stored `computedHash`;
- fail on mismatch with a clear remediation message ("vendored
  artefact has been hand-edited; rerun the canonicalisation step").

## What to Do Instead

| Impulse | Wrong shape | Right shape |
|---|---|---|
| "Record the hash so we know what was vendored" | Lock entry has `computedHash`; validator only checks the entry exists | Lock entry has `computedHash`; validator recomputes `localHash` from current source and compares |
| "Snapshot the generated output" | Snapshot is written to disk; nothing reads it | Snapshot is written; the next-run validator re-generates and diffs |
| "Track the manifest checksum" | Manifest stores `checksum` field; field is never re-derived | Manifest stores `checksum`; manifest validator re-derives from current contents and compares |

## Scope

This rule applies to any validator-shaped or check-shaped tool that:

- Reads a stored derived value.
- Could (with the same inputs) recompute that value.
- Does not currently do so.

The rule extends beyond content hashes to **identity and reference
integrity at the touchpoint** (consolidated 2026-07-30 from the
identifier-integrity cluster — three instantiations the estate paid in
one week, one problem: the corpus records truth but nothing recomputes
it where it is used):

- **Liveness read from a stored status** — a claims/status row is a
  recording; freshness is recomputed against the clock at read time,
  never inherited from the row's own label.
- **Sequential identifiers at write time** — a register whose next id
  is "the last one plus one, by eye" gets duplicate ids under
  concurrent writers (F-150 assigned twice by different sessions);
  the writer recomputes the next id from the current corpus at write.
- **Id references at use** — an event/claim/ticket id typed from
  memory is a fabricated value of the right type; derive the id from
  the store in the same command that uses it, and read back the
  written artefact's reference after the write.

It does NOT apply to:

- Pure recording surfaces explicitly framed as audit logs (the
  napkin, the comms log, the closed-claims archive). These are
  *not* validators; they are append-only history.
- Provenance fields (e.g. `provenance.yml` UUIDs) that record
  identity rather than content.

## Doctrinal Anchors

- principles.md §Strict and Complete (full enforcement, no
  hand-wavy partial systems)
- principles.md §Fail FAST (validators must fail, not silently
  accept)
- `no-warning-toleration.md` (the related rule for warning-class
  signals: also fail, also do not defer)

## Worked instance — stored expiry nobody recomputes (2026-07-2x)

The claims registry stores `freshness_seconds` but no read surface
recomputed it: a stale Director claim ran ~28 hours beyond its freshness
bound with a completed handoff already recorded, and the commit queue
accumulated ~136 never-archived abandoned entries — raw-JSON readers bypass
any CLI-side cure, so the recompute must live in every read surface that
renders the state, not only in the writer. (Recorded by the 2026-07-31
comms-corpus run; the registry-side cure is tooling work for the
agent-tooling backlog.)

## Enforcement

There is no global hook for this rule because the failure mode is
shape-of-validator-specific. Authoring agents apply the rule at
validator-design time; reviewers apply it at validator-review time;
the rule is a checklist item for any new check-shaped tool.
