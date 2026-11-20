---
id: practice-identity-visual-disambiguator
node_type: delivery
name: "Identity visual disambiguator: prefix-anchored display token beside the session-id prefix"
overview: "Render a derived visual-disambiguator token on identity display surfaces so seats started in the same UUIDv7 time window stay human-distinguishable, without changing the session-search prefix, its cross-estate join-key role, the derived-uuid anchor, or any stored schema."
status: archived
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-31
ratified_where: "Owner in-session word to the Director seat (Falcon hunts Flight, 52841f), 2026-07-31: the prefix work routed to Moss calls Loam 'if the conclusion is that work is required'; the conclusion was confirmed the same day by a fable-xhigh assumptions review plus the Director's critical assessment. The plan's mint-at-pickup ticket clause is waived by the owner's 2026-07-31 no-new-Linear-tickets ruling; the existing MCP-145 ticket stands."
serves: first-major-release
impact_areas:
  - practice-and-estate
tickets: [MCP-145]
depends_on: []
last_updated: 2026-08-01
---

# Identity visual disambiguator

## Disposition (archived 2026-08-01)

Definition of done fully discharged. Slice 1 (the total
`visualDisambiguator` derivation with its fixture matrix), slices
2a–2d (the renderer inventory closed by the Revision-4 shape rule,
with the statusline as a DELIBERATE hold-out), and slice 3 (the
PDR-027/PDR-125 doctrine amendments, the PDR-029 audit-coverage
true-up, the practice-core CHANGELOG entry, ADR-211 mirror, token
docs, and the anchored drift test) are all merged — PRs #677, #679,
#682, #687, #690, #694. Every acceptance criterion is proven at its declared
proof type; schema byte-identity (acceptance 4) is proven by the
merged diffs. The two residual cures the lane's reviews surfaced are
carried by the ratified `practice-identity-follow-on-cures` plan
(WS-A / WS-B), whose WS-B PR carries this archive flip.

Owner-directed 2026-07-24 (working session with Deimos tracks Perigee,
73e4ab): "we are going to need this enhancement in OCE", and, on its
placement: condoned into the first-major-release subtree as a
**low-priority, non-blocking** step — it "removes a minor friction to
allowing Codex instances to contribute to the work, and we absolutely
need that perspective for the OpenAI work". Priority and scheduling live
on the Linear ticket, minted at pickup (required before ratification);
born sketch per the estate contract.

Revision 2 (2026-07-24): reworked after the PR's three-reviewer round.
The derivation now anchors on the UUIDv5 `id` (total for every seed
shape; head equals the existing prefix verbatim; entropy independent
of vendor UUIDv7 `rand_b` behaviour), `naming_schema_version` is
untouched, the prefix's PDR-125 cross-estate join-key role is
preserved explicitly, and the renderer inventory and canonical
operational docs are enumerated in scope.

Revision 3 (2026-07-24): **render-time reframe, owner-accepted** on a
full decision-lens run (lenses 1–2: long-term architectural
excellence; strict, everywhere, all the time). The token is a PURE
DERIVATION of two fields every identity block already carries, so it
is never persisted: no schema gains a field, nothing stored can go
stale, and the review rounds' consistency machinery (schema-version
bumps, producer propagation, desync validation, historical promotion
paths) dissolves rather than being answered. This supersedes the
stored-field mechanism of Revisions 1–2 and moots the earlier
coordinated schema-version-bump ruling (no schemas change). Still
standing from today's rulings: the honest-probabilistic goal wording,
the §Warrant arithmetic and its scope paragraph, the PDR-125 join-key
retention, and the PDR-125 display-clause amendment with its twin
disposition.

Revision 4 (2026-08-01): **single-identity hold-out, review-driven** —
the slice-2d pre-execution review refuted statusline adoption: the
statusline renders exactly ONE identity, so the disambiguator has
nothing to separate there, and the statusline is the operator's paste
source for the join key — the value shown must BE the join key. The
Mechanism-5 inventory and acceptance 3 now bind by the SHAPE RULE: the
token adopts where two or more identity blocks share one rendered
view; single-identity views render the bare join key; keying sites
never adopt (the token is never a key). The statusline is the sole
hold-out, recorded in TSDoc at both statusline sites
(`statusline-segments`, `statusline-indicators`); slice 3 codifies the
shape rule as the PDR-125 clause-5 general form. Slice 3 also decides
whether an agent-AUTHORED heartbeat subject line (`<name>
(<session_id_prefix>)` per PDR-078 and the liveness rule) counts as a
"rendered identity surface" under the amended clause — else the next
sweep re-opens those two doc sites.

Revision 5 (2026-08-01): **slice-3 execution plan, decision-complete
at owner word** — §"Slice 3 execution" below carries the sliced work,
a disposition for every finding the slice-2 reviews routed here, an
explicit definition of done, and the PDR-132 round budget. The open
questions Revision 4 deferred are decided in that section; none
remain.

**Evidence enrichment (2026-07-31, multi-perspective review — two
independent Opus lenses converged on this plan's design over six
invented alternatives; figures re-measured the same day by a
fable-xhigh assumptions reviewer and independently reproduced by the
Director):** measured over the unique (`session_id_prefix`, `id`)
pairs in every identity block across all JSON surfaces of
`.agent/state/collaboration/` (comms, comms-archive, archive, claims,
conversations), 8 of 19 UUIDv7-family prefixes collide (42%), hiding
17 seats behind the first seat shown — `019fb9` alone covers 7
distinct seats; non-v7 prefixes collide at ~2% (3 of 171). Vendor
`rand_a` bits are decisively non-uniform on both samples measured:
1,009 store-local Codex thread ids yield 624 distinct `rand_a` values
where uniform predicts ~894, and an earlier 1,712-id sample gave 829
where uniform predicts ~1,400 — the same signal at both scales,
vindicating Revision 2's choice to anchor entropy on the UUIDv5 `id`
rather than v7 tail bits. Renderer width was checked as a flip risk
and falsified (no truncation budget in the statusline surfaces). The
prefix derivation exists in THREE implementations
(`collaboration-state/identity.ts` canonical;
`codex/session-identity-hook.ts` and
`cursor/oak-session-identity-hook.ts` carry behaviourally identical
private copies; only the Claude hook imports canonical) — convergence
(MCP-457) is warranted parallel hygiene but does NOT gate this build:
the token derives verbatim from the STORED `session_id_prefix` and
`id` fields (Mechanism 1), and the hooks cannot render it because no
UUIDv5 `id` exists at hook time.

## Goal

Two agent seats whose session ids share the 6-character
`session_id_prefix` are distinguishable at a glance — in all but
~1-in-4096 same-window pairs, the residual §Warrant accepts for a
display field — on every renderer in the enumerated display inventory
(closed by repo-wide sweep — see acceptance 3), while
`session_id_prefix` keeps its value and BOTH its jobs — session-store
search key AND the required cross-estate join key of the
inter-Practice wire protocol (PDR-125,
`inter-practice-wire.schema.json`) — and the UUIDv5 `id` keeps its job
as the collision-proof anchor. Today that glance-distinction does not
exist: on 2026-07-24 two Codex seats started 90 minutes apart (Pegasus
wakes Redshift, then Lupin turns Xylem) both derived prefix `019f93`,
because Codex thread ids are UUIDv7 and the first 6 hex characters are
purely the high bits of a millisecond timestamp.

## Warrant (the collision arithmetic)

UUIDv7 ids begin with 48 bits (12 hex chars) of Unix-epoch
milliseconds; each hex position of prefix divides the collision window
by 16:

| Prefix length | Timestamp bits | Collision window |
| ------------- | -------------- | ---------------- |
| 6 (current)   | 24             | ~4.66 hours      |
| 8             | 32             | ~65 seconds      |
| 12            | 48 (all)       | 1 ms             |

No timestamp-derived prefix can guarantee uniqueness (same-millisecond
fleet forks collide on all 12 timestamp digits), and — reviewer
finding, accepted — the UUIDv7 spec does not guarantee that a vendor
fills the trailing `rand_b` bits with independent uniform randomness
(conforming monotonic-counter constructions exist). The cure is to
take the disambiguating material from a value the estate already
controls: the **UUIDv5 `id`** is a deterministic SHA-1-derived hash of
the full seed, present on every derived identity block, with uniformly
distributed hex by construction. Twelve bits of it yields pairwise
collision 1/4096 for seats in the same prefix window regardless of
vendor id-generation behaviour; residual birthday risk ≈ n²/8192 for n
same-window seats (~1% at ten simultaneous forks) is acceptable for a
display field because the anchor stays the full `id` — a display
collision can never corrupt state.

**Scope of the distinctness guarantee.** It covers session-derived
identities, whose `id` hashes a unique session/thread seed. It does NOT
cover two `deriveOverrideCollaborationIdentity` seats given the *same*
`agent_name` and the same prefix: that path derives `id` from
`<agent_name>|<session_id_prefix>` alone, so identical configuration
yields an identical `id` and therefore an identical token — by design,
because identical override configuration denotes the same declared
identity, not two seats to tell apart (and by PDR-027's
`(agent_name, id)` key such seats ARE one identity; the estate does
not guard against deliberately naming two sessions the same thing —
owner word, 2026-07-24). The acceptance criteria state this exclusion
explicitly rather than claiming a guarantee the override path cannot
give.

## Mechanism

1. **A pure render-time derivation, never a stored field.** One
   function in the identity module — `visualDisambiguator(agentId)` —
   returns `session_id_prefix + "-" + id.slice(-3)` (the stored
   prefix VERBATIM: raw first-6, no lowercasing or hyphen-stripping,
   so the token's head equals every historical prefix by
   construction; a joining dash; the last 3 hex characters of the
   canonical lowercase UUIDv5 `id` string). When the block carries no
   `id` (legacy rows, migration output from
   `comms-migration-records.ts`, relay blocks that omitted it) the
   function returns nothing and the renderer shows the bare prefix —
   no fabrication, no fallback machinery, just the derivation's
   honest domain. Example: `019f93-b60` vs `019f93-caa`.
2. **Always current by construction.** Because the token is computed
   at render from the block's own fields, it can never desync from
   them — a post-derivation prefix or id replacement (e.g. the
   `resolveSelfIdentity` `--session-prefix` override path) is
   reflected at the next render with no recomputation contract, and
   no stored value exists to validate, propagate, backfill, or
   promote.
3. **No schema changes of any kind.** The JSON state schemas, the
   canonical Zod schemas in `agent-id.ts`, the inter-Practice wire
   schema, and `naming_schema_version` are all byte-untouched; no
   `schema_version` moves anywhere. (The earlier
   coordinated-minor-bump ruling applied to the superseded
   stored-field mechanism and is mooted by this reframe —
   owner-accepted, 2026-07-24.) Comms events, claims, and wire
   payloads carry exactly what they carry today.
4. **Field-role doctrine (PDR-027 amendment)**: `id` — the identity
   anchor; `session_id_prefix` — session search key AND the
   inter-Practice cross-estate join key (PDR-125's join-key clause
   unchanged; the amendment cites it explicitly so no later sweep
   demotes the prefix); the visual disambiguator — a DERIVED display
   token, never data, never a join or lookup key. PDR-125's DISPLAY
   clause (clause 5: every rendered identity surface shows
   `<name> (<session_id_prefix>)`) is amended to the token render
   with bare-prefix fallback — owner-ruled via Director card,
   2026-07-24, twin disposition `their-lane-owns-coordinate` (PDR-125
   clause 6's enumerated vocabulary; the sibling estate's own lane
   lands its twin, coordinated at the next exchange window).
5. **Display surfaces — enumerated inventory, closed by sweep**:
   comms watch render, claims registry render, shared-comms-log
   render, `cli-comms-query` summaries, `comms-event-format`,
   `commit-queue/guard` output, `active-agent-routing`/`formatAgent`
   (feeds TUI comms and queue views), and `tui/snapshot`. Each adopts
   the derivation function. The Claude statusline
   (`statusline-indicators`) is the Revision-4 hold-out: a
   single-identity view rendering the bare join key. A repo-wide
   sweep for `session_id_prefix` render sites closes the set by the
   Revision-4 shape rule (two-plus identity blocks in one rendered
   view); any multi-identity renderer found by the sweep joins the
   inventory and its test.
6. **Documentation slice**: PDR-027 amendment (the derivation, the
   role doctrine, this warrant), the PDR-125 display-clause amendment
   (item 4), PLUS the canonical operational docs agents actually
   consult — `agent-tools/docs/agent-identity.md` (preflight block
   example, platform hook output, Codex block shape) and
   `agent-tools/README.md` (identity output examples) — updated in
   the same slice, with a generated-example drift test AUTHORED IN
   the slice (no such check exists today) that regenerates the doc
   examples from the live derivation and diffs them against the
   committed docs.

## Acceptance criteria (each with a proof — required)

1. The derivation function is total and pinned: unit tests cover
   blocks derived from UUIDv4 and UUIDv7 session-id seeds, an
   arbitrary non-UUID conversation-id seed, an uppercase/
   hyphen-bearing seed, an override identity, and an id-less legacy
   block (returns nothing) — token-bearing cases each yielding
   `<prefix>-<last3-of-id>`, with two same-window UUIDv7 fixtures
   whose tokens differ AND an identical-override fixture asserting
   token EQUALITY (same configured identity, same token — the
   §Warrant scope exclusion stated as a proof) — `repo-safe`:
   identity-module unit tests with fixed seed vectors.
2. Determinism and currency: the function is pure (same block, same
   token) and a block whose `session_id_prefix` or `id` is replaced
   renders the token of its FINAL fields with no intermediate state —
   `repo-safe`: unit tests including a prefix-override fixture.
3. Every multi-identity renderer in the §Mechanism-5 inventory (all
   but the Revision-4 statusline hold-out) displays the token for
   id-bearing blocks and the bare prefix for id-less blocks, and a
   repo-wide sweep recorded in the landing PR shows no multi-identity
   render site outside the inventory — `repo-safe`: render unit tests
   per surface plus the sweep evidence. Re-cited 2026-08-01 against
   the amended PDR-125 clause-5 shape rule: the per-surface render
   tests and sweep stand, and one inventory member binds differently
   BY DESIGN — the routing-key label (`formatRoutingKey`, the TUI
   active-agents surface and routing-key diagnostics) is id-shaped,
   rendering `name / id:<id>` with no prefix field; token adoption
   there would be a field change, out of scope; the claims CLI
   listings serialise full identity blocks, prefix included — so
   this criterion binds the prefix-rendering members of the
   inventory. The commit-queue guard IS a prefix-rendering member: it
   renders identity only through the shared `formatAgent` helper and
   inherits the token with no per-site decision (PR #674 id-routed
   its OWNERSHIP comparison, not its rendering).
4. Nothing stored changed: the state schemas, Zod schemas, wire
   schema, and all persisted fixtures are byte-identical before and
   after the landing PRs, and the full existing validator suite
   passes untouched — `repo-safe`: the landing PR's diff (no schema
   file in it) + the existing gates, cited.
5. Inter-Practice wire conformance is unchanged and the prefix
   remains the join key; the PDR-125 display-clause amendment carries
   its `their-lane-owns-coordinate` twin disposition in the amendment
   text — `repo-safe`: existing PDR-125 wire conformance tests re-run
   and cited, plus the amendment diff showing the join-key clause
   untouched. Discharged in the doctrine-slice PR (2026-08-01): the
   amendment leaves the join-key sentence and
   `.agent/practice-core/protocol.json` untouched (`protocol_version`
   1.0.0, `tier_floor` tier-1), the Status-block note carries the
   twin disposition, and the wire-conformance suites
   (`agent-tools/tests/protocol-wire/wire.unit.test.ts`,
   `agent-tools/tests/collaboration-state/session-id-prefix-across-host-identity-hooks.unit.test.ts`)
   are re-run and cited in that PR.
6. Canonical identity docs match the live derivation output —
   `repo-safe`: the generated-example drift test authored in the
   documentation slice, cited in the landing PR. Discharged
   2026-08-01: the drift test
   (`agent-tools/tests/collaboration-state/visual-disambiguator-docs-drift.unit.test.ts`)
   rebuilds the documented example block from the live renderer,
   proven red-first against the pre-section docs, and fails CI on any
   drift.

## Todos (ordered; each a single-story PR, default round budget)

- Slice 1 — the derivation function: `visualDisambiguator` in the
  identity module + the acceptance-1/2 unit tests. Nothing else
  changes.
- Slice 2 — renderers: the enumerated inventory adopts the function +
  sweep closure + render tests with id-less fallback.
- Slice 3 — doctrine and docs: the PDR-027 amendment, the PDR-125
  display-clause amendment (twin: their-lane-owns-coordinate), the
  agent-identity.md and README examples, and the generated-example
  drift test; lands last so doctrine describes shipped behaviour.

## Out of scope

- **Changing `session_id_prefix`** — value, derivation (raw first-6),
  search-key job, and PDR-125 cross-estate join-key job all unchanged.
- **Persisting the token** — no schema anywhere gains the field; a
  stored copy of a pure derivation is denormalisation demanding
  consistency enforcement forever (the superseded Revisions 1–2
  mechanism). Falsifier, recorded: raw JSON files carry no token by
  design — a raw-file reader has the `id` in the same block and can
  compute it — and if raw-file glance-distinction ever proves needed
  in practice, persisting this function's output becomes a one-slice,
  evidence-based decision taken then.
- **Rewriting historical records** — nothing is written, so nothing
  historical changes; the token's head equals the old prefix by
  construction, so head-greps match both eras regardless.
- **Anchor changes** — the UUIDv5 `id` derivation is untouched; this
  plan adds a display derivation only.
- **Versioning machinery** — no `naming_schema_version` change, no
  state-schema `schema_version` change, no new block-version field.

## Slice 3 execution (decision-complete, 2026-08-01)

One single-story documentation-and-doctrine PR. Round budget
(PDR-132): one review round expected, two budgeted; a third round
opening is the stop-and-reslice signal.

### Decisions, made here — none remain open

1. **PDR-125 clause 5 rewrites to the shape rule in its general
   form**, never a re-enumeration: the token adopts where two or more
   identity blocks share one rendered view; single-identity views
   render the bare join key; keying sites never adopt (the token is
   never a join, lookup, or parse key). The statusline hold-out
   (Revision 4) is the rule's worked single-identity example; the
   twin disposition stays `their-lane-owns-coordinate` (clause 6
   vocabulary).
2. **Heartbeat subject lines are disposed by the shape rule itself —
   no new category.** A heartbeat subject renders exactly ONE
   identity, so it is a single-identity view and keeps the bare join
   key by the same reasoning as the statusline hold-out. The
   amendment cites PDR-078's own words (the subject-line rendering as
   "the chat-readable short form") and reconciles them with the
   clause so the two portable PDRs classify the object identically
   and no future sweep re-opens the liveness rule or the team-start
   SKILL formats.
3. **The authored-surface identity-row obligation is doctrinal, not
   parsed — and it covers BOTH routed rules.** Hand-authored
   `session_id_prefix` cells carry the bare wire prefix, never the
   display token; the PDR-027 amendment states the obligation for
   thread-record rows AND for the Notion edit-ledger row format
   (`notion-page-edits-update-ledger` — the second rule the slice-2
   routing note named; a ledger row is agent-authored, so it takes
   the authored-surface obligation, not renderer adoption). No parser
   change ships: the token is non-injective over a schema-unbounded
   prefix, so no decoder or detector over a cell can be correct (the
   slice-2b refutation applies verbatim). The audit stays blind to a
   pasted token by design; the stated obligation plus review is the
   guard.
4. **PDR-029's stale audit-coverage clause trues to the shipped
   instrument.** The clause's Layer-3 coverage list still names
   "shared communication logs"; the shipped audit reads thread
   records, active claims, closed claims, and the comms EVENT stream
   — the rendered log was retired as an audit source in slice 2b
   (a generated read model has no historical snapshot). The amendment
   replaces the stale term with the event stream; conserved copies of
   superseded plans stay byte-frozen wherever they live.

### Work items (one PR)

- PDR-027 amendment: the render-time derivation
  (`visualDisambiguator`/`displayPrefix`), the field-role doctrine
  (display-only; never persisted; never a key), the canonical token
  name ("visual-disambiguator token" — the operator help's doctrine
  anchor), the thread-record bare-prefix obligation, and the warrant
  pointer.
- PDR-125 clause-5 amendment per decisions 1–2.
- PDR-029 audit-coverage true-up per decision 4.
- `agent-tools/docs/agent-identity.md` and the README examples show
  the token with the id-less fallback and the display-only warning.
- Generated-example drift test: the docs' rendered example is
  produced by the live renderer inside a unit test, so doc drift
  fails CI.
- The statusline-render test comment gains the hold-out carve-out in
  the same PR (it currently cites clause 5's old enumeration as its
  authority).
- The practice-core CHANGELOG gains one entry for the three PDR
  amendments (the file travels with the Practice Core package; every
  prior amendment carries one, and nothing mechanical enforces it).

### Definition of done

All four decisions visible in merged doctrine text; both PDR
amendments, the PDR-029 true-up, and the practice-core CHANGELOG
entry merged; docs examples drift-tested green (`repo-safe`); the
statusline-render test comment cites the shape rule; acceptance
criteria 3 and 6 re-cite their proofs against the amended clause —
recording explicitly that the claims-registry render is id-shaped by
design (`formatRoutingKey` carries no prefix field; token adoption
there would be a field change, out of scope), so acceptance 3 binds
the prefix-rendering members of the inventory; the PR merged at full
condition (all required checks green per the rulesets API at merge
time, zero unresolved threads, MERGEABLE, bot REST merge-commit);
zero new lint findings. The plan then completes and archives per the
estate's completion contract.
