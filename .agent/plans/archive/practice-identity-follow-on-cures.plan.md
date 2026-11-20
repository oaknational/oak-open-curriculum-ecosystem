---
id: practice-identity-follow-on-cures
node_type: delivery
name: "Identity-lane follow-on cures: shell-quote consolidation and override-identity prefix hygiene"
overview: "Two small single-story cures accrued by the MCP-145 identity lane's reviews: consolidate the duplicated shellSingleQuote helper into one shared core util, and cure the override identity path's silent empty prefix plus the hand-typed recipient prefix on comms direct — by sourcing from the registry where it can answer, never by decoding values. Decision-complete; ratified 2026-08-01."
status: archived
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-01
ratified_where: "Owner action-moment card answered 'Ratify now' at 2026-08-01 ~13:45Z (first owner touch after the boundary-3 compaction), recorded at occurrence on the comms stream (event 7f182210-b42b-4550-a883-006b68d4ea70). Order stands: the visual-disambiguator plan's slice 3, then WS-B, then WS-A."
serves: first-major-release
impact_areas:
  - practice-and-estate
tickets: [MCP-145]
depends_on: []
last_updated: 2026-08-01
---

# Identity-lane follow-on cures

## Disposition (archived 2026-08-01)

Both workstreams discharged. WS-B merged at full condition: the
override path rejects a missing or empty `--session-prefix`; the
`comms direct` recipient prefix derives from fresh claim rows per the
Director's claim-rows-only ruling, with the membership plausibility
net, the closure-aware coverage restatement in decision 3, and the
PDR-027 derivation-source provenance clause as the ruling's permanent
home. WS-A — the `shellSingleQuote` consolidation into one exported
core util with its quoting-contract test — rides the same change as
this archive flip, exactly as the visual-disambiguator plan's flip
rode WS-B. Acceptance criteria 1–4 proven at their declared proof
types; the first-contact residual stands as decision 3 measures it.

Two bounded cures that the MCP-145 lane's review chain surfaced and
routed forward. Naming note (one series per surface): this plan's
workstreams are **WS-A** and **WS-B**; the lane's session records call
the same two items "story 3a" and "story 3b" — same objects, and this
sentence is the only mapping a reader needs. Ticket note: Linear is
under the owner's standing embargo and the no-new-tickets ruling; the
existing MCP-145 ticket carries both cures, exactly as it carried the
lane that surfaced them. Node-shape note, deliberate: two independent
PR-sized steps share one delivery node because each is residue of the
same lane with its own DoD below; splitting would spend more ceremony
than either diff. The deviation from one-step-per-node is stated here
on purpose.

## Goal

The override identity path cannot silently produce an empty or
blind-making `session_id_prefix`; the hand-typed recipient prefix on
`comms direct` is eliminated wherever the live registry can answer for
it (with the uncoverable residual stated below); and the estate
maintains exactly one shell-quoting implementation instead of two
drifting private copies.

## Mechanism

- **WS-A (shell-quote consolidation).** `shellSingleQuote` exists as
  two byte-identical private copies (`claude/session-identity-hook.ts`,
  `spawn/launch-command.ts` — the latter carries an in-code debt note
  prescribing exactly this cure) — the second consumer exists, so the
  consolidate-at-second-consumer rule binds. One exported util in
  `agent-tools/src/core/` removes the drift surface; a
  quoting-contract test pins the behaviour both hosts rely on (POSIX
  single-quoting including the embedded-quote escape and the empty
  string).
- **WS-B (override-identity prefix hygiene).** Two related defects on
  the OVERRIDE identity path and the directed-send recipient block:
  - `resolveSelfIdentity`'s explicit `--agent-name` path defaults
    `session_id_prefix` to the empty string when `--session-prefix`
    is omitted. The harm is concrete on both sides: the watcher
    writes that identity into its heartbeat file — a PDR-125 wire
    shape whose schema demands `minLength: 1` — producing a
    wire-invalid file a peer estate's strict validator refuses; and
    the self-match id derives from `<name>|""`, so an override-mode
    `comms inbox`/`comms watch` silently misses every message
    addressed to the real identity. A further stake: the claims JSON
    schema carries no `minLength` on the prefix while the Zod read
    boundary enforces `min(1)`, so one empty row written today would
    make the whole registry unreadable at the read boundary — the
    empty-write guard protects the estate's read path, not cosmetics.
  - `comms direct` requires the operator to hand-type
    `--to-session-prefix` even though `--to-id` is required and is
    the sole routing weight. Identity values are derived from the
    observable record at time of use: where the registry can answer,
    the tool should read the prefix from the row it would otherwise
    have to validate against.

### WS-B decisions, made here — none remain open

1. **Empty means error on the override path, never default and never
   the sentinel.** A missing or trimmed-empty `--session-prefix` on
   the explicit `--agent-name` path is a teaching error naming the
   flag and the wire role. The estate's `'unknown'` sentinel is for
   HARNESS absence (a hook that could not expose the value); on an
   operator-supplied override the operator knows the prefix, so
   absence is operator error — defaulting would convert a typo into
   silent comms blindness.
2. **Source, don't validate: `--to-session-prefix` becomes optional
   on `comms direct`.** When the supplied `--to-id` resolves to a
   FRESH CLAIM row in the live registry, the recipient prefix is
   READ from that row; a value the operator still supplies is
   honoured only if it exactly matches the derived prefix, else a
   teaching error. "Resolves" is defined mechanically AND by
   provenance (restated at execution per the Director's 2026-08-01
   claim-rows-only ruling, lens-resolved before a line was coded):
   derivation reads claim rows only, because claim identities are
   seed-derived at claim open while commit-queue identity fields are
   operator-typed flags — a right-typed value of the wrong
   provenance is never a source. The claim∪queue union
   (`liveAgentIdentities`, read through the existing canonical
   reader) is retained as EVIDENCE only — the all-agree disagreement
   test, a membership plausibility net over a supplied value, and
   the queue-only-vs-unresolvable error choice: if the union's rows
   disagree on the prefix for that id, the derivation is skipped and
   the flag is required (all-agree-or-derive-nothing — the registry
   never guesses), and a supplied value must then match one of the
   observed live rows (a value matching none is refused as a
   probable typo — evidence, never authority). An id whose only live
   rows are commit-queue intents falls to the flag-required arm
   exactly like an unresolvable id, and in those uninformed arms a
   supplied value is written as-is — the pre-derivation contract,
   unchanged. The exact-match rule binds only where a prefix was
   derived.
3. **The residual is named, with its measurement.** Re-measured on
   the claim-rows-only basis at execution (2026-08-01, superseding
   the authoring-time union-based figures of 81%/72.5% over 571
   events): of 598 directed events carrying `to.id`, 82.1% have the
   id in claims history — IDENTICAL to the claims+queue percentage,
   so restricting derivation to claim rows costs nothing on the
   id-resolution axis. Instant coverage is CLOSURE-AWARE 66.1% — a
   fresh claim row still OPEN at the send instant, which is what the
   live `--active` registry the mechanism reads can actually hold —
   with 73.8% as the closure-blind upper bound; archived rows retain
   only their final heartbeat, so true coverage lies between the
   two. Zero prefix disagreements among fresh claim rows at any send
   instant. (Consumed commit-queue entries are not retained on disk,
   so the union basis has no separately computable instant coverage;
   the id-axis identity above bounds the difference.) The single
   historical prefix-typo event predates its recipient's first claim
   by 7m09s — first contact is exactly when the registry cannot
   answer, and no boundary mechanism can cover it. The cure's claim
   is therefore: the typo class is REMOVED for the resolvable band
   (~66% of historical directed sends, closure-aware) and UNCHANGED
   for first contact, where the display-only help warning (shipped
   in slice 2c) remains the only guard.
4. **No token detection at any boundary.** The display token is
   non-injective over a schema-unbounded prefix; no decoder or
   detector over the value can be correct (the slice-2b refutation).
   The guard is the empty check, the derive-or-exact-match rule, and
   the display-only doctrine — never pattern-matching a value's
   shape.
5. **No read-side schema change.** The wire and event schema floors
   (`min(1)`) are untouched; historical events and fixtures must
   keep parsing exactly as today.

## Acceptance criteria

1. Exactly one `shellSingleQuote` implementation remains, exported
   from a shared core module; both prior hosts import it; the
   quoting contract (embedded single quote, empty string, plain
   value) is pinned by unit test — `repo-safe`.
2. The override path rejects a missing or trimmed-empty
   `--session-prefix` with a teaching error, proven red-first —
   `repo-safe`.
3. `comms direct` derives the recipient prefix from a cleanly
   resolving `--to-id` (flag omitted) while reading the
   operator-named registry exactly once, honours an exactly-matching
   supplied value, errors on a mismatch, skips derivation on
   registry disagreement (flag required when omitted; a supplied
   value must match one observed live row and is refused when it
   matches none), requires the flag for a queue-only id
   (operator-typed provenance) and for an unresolvable, stale-claim,
   or id-less-row id — writing a supplied value as-is in those
   uninformed arms — rejects a malformed or case-variant `--to-id`
   before resolution plus an empty `--to-id` or supplied-empty
   prefix, keeps `comms reply` on the single guarded registry read,
   and pins the derivation contract in `comms direct --help` and the
   display-only token warning in `comms peer-liveness --help` — each
   behaviour arm proven red-first at its introduction, with
   current-behaviour pins recorded as pins — `repo-safe`.
4. No read-path behaviour change: the full agent-tools suite stays
   green and the existing historical-fixture tests still parse —
   `repo-safe`.

## Out of scope

- Token detection or decoding at any boundary (decision 4).
- Read-side schema changes of any kind (decision 5).
- Covering the first-contact residual (decision 3 names it and its
  measurement; no boundary mechanism can reach it).
- A global identity index or any new registry surface.
- Changing the prefix's derivation, value, or join-key role.

## Todos

Two single-story PRs, each with round budget 2 (PDR-132; a third
review round opening is the stop-and-reslice signal). Definite order,
by importance: the visual-disambiguator plan's slice 3 first, then
WS-B, then WS-A. Sequencing note, stated rather than assumed: WS-B's
registry read rides `state-file-readers`/`state-io`, which Badger's
validator-lane story 2b is converting to `Result` under live claims —
a beneficial ordering, not a block (no plan node exists to reference,
so this sentence is the dependency record). Minimum shippable without
it: WS-B builds against whatever read contract main carries at its
open; the first-principles check below re-grounds the call shape
either way.

- **WS-B PR** — red-first tests per arm (acceptance 2-3), the
  teaching errors, the derive-or-match logic through the canonical
  registry reader, help text naming the arms. DoD: acceptance 2, 3,
  and 4 proven; merged at full condition (all required checks green
  per the rulesets API at merge time, zero unresolved threads,
  MERGEABLE, bot REST merge-commit); zero new lint findings.
- **WS-A PR** — the shared util, both hosts converted, duplicates
  deleted, the quoting-contract test. DoD: acceptance 1 and 4
  proven; merged at full condition (same definition); zero new lint
  findings.

## First-principles check

At each PR's open: re-grep the `shellSingleQuote` consumer set and
the override/directed-send call sites first-hand (line references in
this plan are authoring-time observations, not execution-time facts);
read the then-current `liveAgentIdentities` and state-reader call
shapes before wiring decision 2 (Badger's conversion may have landed);
never add a new registry parser.
