# Oak Chrome Session Is Metered

The Chrome claude.ai session on the official Oak account is a METERED
Premium team seat (owner standing constraint, 2026-07-28, verbatim:
*"Preserve it for key interactions with Oak related systems"*). Browser
automation through that session spends a shared, finite quota that key
Oak-system interactions depend on.

## Trigger

Any agent is about to drive the Oak-account Chrome session — browser
automation, page reads, form interactions, or any claude.ai-session use on
the official Oak account.

## Action

- **Reach for the browser LAST**: exhaust APIs, CLIs, MCP tools, and local
  reads before the metered session. The browser is for interactions only it
  can perform.
- **One full-page read per step**: prefer a single complete page read over
  repeated partial reads, scrolling sweeps, or exploratory clicking.
- **Report a named unknown over spending quota on completeness**: when
  filling the gap would cost browser quota, surfacing "unknown — needs a
  browser step, quota-priced" is the correct output, not silent spend.
- **READ-ONLY where the owner has ruled artefacts confidentiality-blocked**
  (owner ruling, 2026-07-2x): for external artefacts the owner has named
  confidentiality-blocked, the session performs reads only — retrieval or
  any write-shaped interaction with them is the owner's manual act, offered
  by the owner, never initiated by an agent.

## Failure mode this prevents

Quota exhaustion of the shared Oak team seat by exploratory browsing, which
starves the key Oak-system interactions the seat exists for — discovered
only when a needed interaction finds the meter drained.

## Related surfaces

- [`collaboration-is-value-contingent.md`](collaboration-is-value-contingent.md)
  — the consumer test this rule instantiates for a metered external surface.
- [`bot-identity-on-third-party-systems.md`](bot-identity-on-third-party-systems.md)
  — identity discipline on the same class of third-party surfaces.
