---
classification: core
description: Validators must recompute and compare derived values (hashes, fingerprints, manifests); storing without recomputing cannot detect drift
---

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

The general form of this rule — no list is ever hand-kept; it is computed from
its source or gated by a recomputing validator — is
[`compute-dont-hope`](compute-dont-hope.md) (owner ruling 2026-09-13).

A validator that scans its own outputs needs a DECLARED regeneration
order: a census parity gate failed its first run because `render`
rewrote the matrix its `facts` sweep then scanned — the canonical order is
render, then facts, then check — found by running the instrument on
itself, the cheapest adversary there is (2026-08-17). Regenerate LAST,
true the prose, then re-check prose written EARLIER in the same round: a
plan's trail denominator went stale against artefacts regenerated after
the sentence was written (2026-08-18).

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
| "Count the messages, reviews or tokens for a report" | A one-off script over one surface's records, read as one-to-one with the thing counted | A tested instrument with a cell per known error: records are not one-to-one with what they count (peer messages recorded as user turns, 417 for 145; bot thread replies counted as reviews, 123 for 133 after pagination; several content blocks carrying one message's usage, 35.8M for 8.35M, all in one retrospective, 2026-09-15) |

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
- **Counts in tracked reports** — a count stands only where a reader at
  the default tip can recompute it: the script that produced a tracked
  count lands beside its output, and a record cites only what the tip
  can read, or quotes the content. A generator in a gitignored session
  directory makes its report's count a number, not a count (three
  instances on 2026-10-02).

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

## Worked instances — proofs that checked something else

- A strict-YAML round trip proved the container valid, not the values: a comma splitter had
  broken brace groups and the round trip still passed. A proof script that copies the parser's
  own logic proves the copy and repeats its bugs; a derivation that reaches the values by
  another route is the oracle this rule asks for.
- A census validator's contract put the run's provenance (`generatedAt`, `sourceCommit`)
  inside the payload it compared with a fresh derivation, so it could never pass across two
  runs. Provenance sits outside the compared payload.
- A merge resolver's test had the merge sides reversed, and the first run in the real
  orientation refused. Run a new check once against the real input shape before its verdict
  is trusted.
- Inside one instrument, a fact is read by one route. Where an instrument reads one fact by
  two routes and they disagree (two git commands gave two answers for a dangling symbolic
  ref), remove a route; a third check that reconciles them is a third route. This is about
  how an instrument reads, not about recomputing a recorded value, which this rule requires.
- Evidence is taken at the moment and on the bytes it describes. A figure read before a push,
  a rebase or a compaction describes that earlier state, so an instrument is tested for the
  integrity of its evidence as well as for its function (2026-09-28).

## Enforcement

There is no global hook for this rule because the failure mode is
shape-of-validator-specific. Authoring agents apply the rule at
validator-design time; reviewers apply it at validator-review time;
the rule is a checklist item for any new check-shaped tool.
