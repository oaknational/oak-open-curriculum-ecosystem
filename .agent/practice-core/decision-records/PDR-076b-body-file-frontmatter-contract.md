---
pdr_kind: governance
---

# PDR-076b: Body-File Frontmatter Contract

**Status**: Accepted
**Date**: 2026-05-23
**Adopted**: 2026-05-24
**Related**:
[PDR-076a](PDR-076a-agent-identity-tuple-name-and-uuid.md)
(agent identity tuple — co-emerged from the same owner
direction on 2026-05-23; structurally separate decision at
the identity-tuple layer rather than the body-file layer;
this PDR's frontmatter contract reuses the `agent_name` and
`id` field semantics defined there);
[PDR-076](PDR-076-agent-identity-tuple-and-body-file-frontmatter.md)
(superseded stub — the original bundled PDR; retained as the
historical record of the single owner direction that ratified
both this PDR and PDR-076a);
[PDR-027](PDR-027-threads-sessions-and-agent-identity.md)
(threads, sessions, and agent identity — the identity tuple
this PDR's frontmatter binds to);
[PDR-056](PDR-056-inter-agent-collaboration-protocol.md)
(inter-agent collaboration protocol — every identity-bearing
collaboration artefact, including the body files this PDR
governs, flows through that protocol's substrate);
[PDR-064](PDR-064-coordinator-handoff-two-moments.md)
(coordinator handoff two moments — handoff body files written
between the two moments fall under this PDR's frontmatter
contract);
[PDR-073](PDR-073-recursion-as-method-is-practice-core-mind-shape.md)
(recursion as method — silent body-file-attribution failures
corrupt attribution on the recursive substrate);
[`practice-index.md`](../../practice-index.md) (host adoption and
implementation bridge).

## Context

Agent collaboration ceremonies (closeout drafts, commit-message
drafts, broadcast bodies, handoff records, intent-scoped message
files, reviewer scratch notes) routinely materialise body
substance into files outside the canonical state surfaces — a
shared temporary-file namespace, a host-local cache, or a
workspace-temporary path. Those files have no identity contract:
the file path alone does not guarantee that the contents were
authored by the session currently invoking the consumer. A
path-collision across sessions on the same path can produce a
silent attribution failure where session B's identity carries
session A's substance into a posted artefact.

The identity contract in PDR-076a is correct in this failure mode
— session B's identity tuple was authentic and unambiguous at the
identity-row layer. The failure was that the body file carried no
internal record of its authorship, so the body-file consumer could
not detect that the contents had been authored by a different
session days earlier. Path was the only attribution signal; path
collisions defeated it.

The cure operates at the body-file layer: every body file carries
frontmatter declaring who authored it, and every body-file
consumer verifies that frontmatter before use. This contract is
structurally separate from the identity-tuple contract in
PDR-076a — it does not extend or replace the identity tuple; it
pairs every body-bearing file with the identity that authored it
so that the file's contents cannot be silently consumed under a
different session's identity.

## Decision

Every temporary or intent-scoped file that an agent writes for
downstream consumption by collaboration ceremonies MUST carry
frontmatter with at least four fields:

- `agent_name` — author identity name (same field as the identity
  tuple defined in
  [PDR-076a](PDR-076a-agent-identity-tuple-name-and-uuid.md)).
- `id` — author identity UUID (same field as the identity tuple
  defined in PDR-076a).
- `created_at` — RFC 3339 timestamp at file creation.
- `last_updated_at` — RFC 3339 timestamp at most recent write.

The body-file frontmatter contract applies **regardless of where
the body file lives** — a shared temporary-file namespace, a
host-local cache, a workspace-temporary path, an intent-scoped
message-file directory, a handoff-records directory, a conversation
or sidebar entry written as a body file. The path is incidental;
the frontmatter is load-bearing.

The `agent_name` and `id` fields are definitionally bound to
[PDR-076a](PDR-076a-agent-identity-tuple-name-and-uuid.md): if
PDR-076a's identity-tuple contract changes the semantics of either
field, this PDR's frontmatter contract follows the change without
re-litigation. This is a directional dependency
(PDR-076b → PDR-076a); the reverse does not hold.

This PDR is the principle layer. The downstream tranches
(schema codification, host-local tooling enforcement, ceremony
updates that wire the contract into existing body-authoring
flows) are recorded in §Cascade for separate landing cycles.

## Rationale

The load-bearing move is **per-file identity bind**: the file
declares who authored it, and the consumer refuses bodies
authored by a different identity than the one currently driving
the consume call. This addresses the failure mode at the
substrate level rather than at the ceremony level — every
body-authoring ceremony writes the same shape, every
body-consuming ceremony reads the same shape.

The identity tuple alone cannot cure this failure: the body
file is the substance, and the identity tuple lives one
indirection away on the consuming session. Without an
attribution signal on the file itself, the consumer has no
way to detect that path is being reused across sessions. A
frontmatter contract makes the attribution signal local to
the file, where the failure mode lives.

**Rejected alternatives**:

- **Author the body-file frontmatter contract as a standalone
  rule without a PDR.** Rejected because the frontmatter
  schema is normative across schemas (every identity-bearing
  schema gains the same fields), tooling (every body-consumer
  reads the same frontmatter), and ceremonies (every body-
  authoring ceremony writes the same frontmatter). Substance
  that cuts across that many surfaces is PDR-shaped, not
  rule-shaped.
- **Bundle the body-file frontmatter contract with the
  intent-scoped message-file ceremony only.** Rejected because
  the failure mode is path-collision across any shared
  body-file namespace, not just the intent-scoped message-file
  surface. The body-file frontmatter contract applies wherever
  agents write body substance for downstream consumption.
- **Tempfile-path session-prefix discipline as the primary
  defence** (embed the authoring session identity in the
  tempfile path itself). Rejected as the primary defence
  because path naming is host-local and easily violated; the
  frontmatter is in the file's substance and travels with the
  file regardless of where it ends up. Path-naming conventions
  remain available as a secondary belt-and-braces defence (see
  §Notes).
- **Bind the enforcing tooling now (a specific validator, a
  specific consumer wrapper).** Rejected per the owner
  direction: specify the schema cheaply now and decide
  enforcement-tool placement later. The schema is the
  load-bearing decision; the tool is the host-local
  implementation route.

## Worked Instance

The trigger event is a tempfile-collision incident in a recent
session. A session drafted a closeout body via a file write to
a path in a shared temporary-file namespace. The path
pre-existed from a different session days earlier in the same
shared namespace; the prior file had not been retired. The
file-write consumer refused to overwrite the pre-existing path
because the new session had not first read the file's current
contents. A parallel body-file consumer in the same ceremony
read the pre-existing content (authored by the earlier
session) and posted it as a collaboration artefact under the
new session's identity tuple.

The incident illustrates the pressure this PDR addresses:

- The new session's identity tuple was correct and unambiguous
  at the identity-row layer. The problem was not identity-tuple
  weakness (that is PDR-076a's surface).
- The body file carried no internal record of its authorship.
  The new session's body-file consumer could not see that the
  contents had been authored by a different identity days
  earlier. Path was the only attribution signal; path
  collisions defeated it.

**Predicted consequences — not yet worked instances**:

- A session whose body-file consumer encounters a frontmatter
  authored by a different `id` than the current session
  rejects the body, surfacing the path-collision as a
  consumer error rather than a silent attribution failure.

## Cascade

This PDR names downstream amendments without executing them:

1. **Body-file frontmatter schema** — the four-field minimum
   (`agent_name`, `id`, `created_at`, `last_updated_at`) is
   specified now as a portable schema. Additional fields may
   be added by ceremony-specific extensions (e.g. an
   intent-scoped message file may carry `intent_id`, a
   reviewer scratch note may carry `reviewer_role`, a handoff
   record may carry `claim_id` or section-named fields). The
   minimum is normative; extensions are host- or
   ceremony-local.
2. **Body-file consumers** — every ceremony that reads a body
   file for downstream consumption verifies the frontmatter
   before use. The consumer rejects bodies whose frontmatter
   `id` does not match the consuming session's identity.
   Tooling placement is the host's choice; the contract is
   portable.

   The body-file substrate covered by this contract includes
   (non-exhaustive): handoff records under any handoff directory,
   conversation entries written as body files, sidebar
   participant rows when body-shaped, intent-scoped message
   files, reviewer scratch notes, closeout drafts, commit-message
   drafts, broadcast body drafts. The principle is the body-file
   nature of the substrate, not the directory it sits in.

## Notes

**Tempfile-path session-prefix discipline as secondary defence**.
The frontmatter contract above is the primary defence against
body-file collision. Naming conventions that embed the
authoring session identity in tempfile paths are a secondary
belt-and-braces convention that the host may adopt independently.
This PDR does not mandate the path discipline; it is noted here as
a host-local defence that may pair with the frontmatter for
defence-in-depth.

**Split history**. This PDR originated as part of
[PDR-076](PDR-076-agent-identity-tuple-and-body-file-frontmatter.md)
(2026-05-23), which bundled the body-file frontmatter contract with
the identity-tuple contract under a single owner direction.
Pre-authoring review SPLIT the bundle into PDR-076b (this PDR) and
[PDR-076a](PDR-076a-agent-identity-tuple-name-and-uuid.md) on
structural-separation grounds; see the superseded PDR-076 stub for
the original framing. v2 carried a §Forbids item explicitly
forbidding conflation of the two amendment cycles at later landings;
under the SPLIT, the file boundary between PDR-076a and PDR-076b is
the enforcement and the explicit forbid is no longer needed.

Each downstream amendment is a separate landing cycle. This
PDR is the principle layer; the schema codification, tooling
work, and ceremony updates are operationalisation.

## Consequences

**Enables**:

- A structural defence against body-file path collisions
  across sessions, ending the silent-attribution failure
  mode at the substrate level rather than at the ceremony
  level.
- A uniform frontmatter shape across every body-authoring
  ceremony, so consumers can verify attribution without
  ceremony-specific knowledge.
- A clean point of extension: ceremony-specific fields can
  layer on top of the four-field minimum without changing
  the contract.

**Costs**:

- Body-file frontmatter adds a small authoring overhead to
  every ceremony that writes a body file. The cost is paid
  per write; the value is paid per consume.
- Every body-file consumer must learn to read frontmatter
  and reject mismatched-`id` bodies. Tooling work is
  required at each consumer site, even though the contract
  is portable.

**Forbids**:

- Consuming a body file whose frontmatter is absent or
  whose `id` does not match the consuming session's
  identity. The consumer must refuse or escalate; silent
  consumption is forbidden.
- Treating the body-file frontmatter as a documentation
  nicety. The frontmatter is load-bearing for attribution
  correctness; absence is a structural defect, not a style
  defect.

## Falsifiability

This PDR is falsified if, after the body-file frontmatter
contract lands and consumer enforcement is in place, the
substrate continues to exhibit the failure class at the same
or higher frequency:

- A body-file path collision across sessions produces a
  silent attribution failure that the frontmatter contract
  should have caught. Each occurrence is direct evidence
  against the frontmatter-contract claim.

The failure mode is observable across sessions without
priming: a silent-attribution failure surfaces in the
artefact downstream (a closeout, broadcast, or handoff
posted under one identity but carrying another identity's
substance). The doctrine succeeds when post-tranche
sessions exhibit frontmatter-verified body consumption as
default behaviour, not as exception-handling.

## Owner direction (source-of-record)

Both PDR-076a and PDR-076b co-emerged from a single owner
direction captured 2026-05-23. The full direction is reproduced
in both PDRs to preserve provenance honesty; the two contracts
it ratified are structurally separate and now land as separate
PDRs.

> "agent identities will require two fields, a name and a uuid
> id, and that all comms events must use both, the name remains
> the primary means of identification, the uuid is for
> disambiguation. All temporary agent coordination and
> collaboration files must contain frontmatter with agent name,
> id, created at, last updated at"

This direction is the trigger for the PDR. The PDR converts
the direction into a portable Practice Core decision that the
host's schema and tooling tranches operationalise downstream.
