---
id: upstream-api-override-contingency
node_type: delivery
name: "Upstream API override contingency: self-retiring spec patches"
overview: "If Aakesh's four upstream spec fixes (MCP-327..330) cannot land before the submission window, patch the spec at sdk-codegen ingest with per-entry pins against the broken upstream fragments — any upstream change to a pinned fragment fails the build until the entry is deleted, so overrides cannot outlive their cures."
status: sketch
serves: first-major-release
impact_areas:
  - served-surface
tickets:
  - MCP-420
depends_on: []
owner_gates:
  - awaiting: owner-decision
    clears_when: "The trigger: at the submission form-fill moment with any of MCP-327..330 not Done, the owner (or Matt under the delegation) says execute, naming the entries; the same word rules the named tickets' blockedBy edges off MCP-309 at override-merge"
    expires: 2026-08-21
last_updated: 2026-07-31
---

# Upstream API override contingency — self-retiring spec patches

**Status**: Decision-complete, ARMED-NOT-EXECUTING. Owner-commissioned 2026-07-30 (~11:15Z, submission day):
"a decision complete plan to cover the scenario where the upstream API fixes can't happen in time,
presumably by creating temporary overrides in the local descriptions that will automatically fail
build once the upstream descriptions for that override change." Executes ONLY at the named trigger
below. Ticket: MCP-420.

## The problem

The submission gates on four upstream API defects (MCP-327/328/329/330, Aakesh's, in the upstream
`oak-openapi` estate). All four are defects in what the spec ADVERTISES — examples, a description,
a schema contract — not in what the API does. Our tool schemas are generated verbatim from that
spec, so every connected assistant (and Anthropic's reviewer) reads the defects. If the upstream
fixes cannot land before the submission window, the served surface must be made truthful locally,
without waiting, and without the overrides outliving the upstream cures.

## The mechanism (all decisions made)

1. **Overrides patch the spec at ingest, never the generated output.** One explicit override table
   in the SDK codegen workspace (a single TypeScript module, one entry per defect). The patch step
   runs at the very front of `pnpm sdk-codegen`; everything downstream (types, Zod, tool schemas)
   flows unchanged from the patched document. The Cardinal Rule holds: consumers stay simple; the
   generator pipeline owns the complexity.
2. **Every entry pins the broken upstream fragment it replaces.** An entry is
   `{ ticket, jsonPath, expectedUpstreamFragment, replacementFragment, verifiedEvidence }`. Before
   applying, the patcher asserts the live upstream fragment EQUALS the pinned expected value.
   - **Match** → apply the replacement.
   - **Mismatch** (upstream changed — fixed, or moved) → **hard build failure**, naming the entry,
     its ticket, and the one cure: delete the entry and regenerate. No skip flag, no env valve, no
     warning mode (no-escape-hatches; never-disable-checks).
3. **The guard runs everywhere the spec enters**: (a) inside `sdk-codegen` at the patch step, and
   (b) as a CI drift check that fetches the live spec and compares only the pinned fragments — so
   an upstream fix trips the build automatically even while the local spec snapshot is stale. One
   script, two call sites.
4. **Honest limit, named**: the pin watches the SPEC fragment. An upstream fix that changes only
   endpoint BEHAVIOUR (possible for MCP-330) never trips it. Backstop: each upstream ticket's Done
   is a review moment for its override entry — recorded as a checklist line on MCP-419, and each of
   MCP-327..330 carries a comment naming its entry so whoever closes it sees the override.

## The four entries (replacement values decided; two need a live probe at execution)

| Entry | Upstream defect | Replacement | Verification at execution |
| -- | -- | -- | -- |
| E1 (MCP-327) | `get-sequences` example `english-secondary` is not a valid slug | example → `english-secondary-aqa` | Live probe: the call resolves (upstream's own tests already assert this slug) |
| E2 (MCP-328) | lesson-assets example lesson is licence-restricted (4 spec sites) | example lesson → a verified-unrestricted lesson, same value at all 4 sites | Live probe at execution selects the lesson: `get-lessons-assets` returns assets OK |
| E3 (MCP-329) | "Use the this type" grammar in the assets `type` description | description → corrected sentence; the `/api/…` path reference corrected to the served `/api/v0/…` form ONLY if verified first-hand at execution; the "signed download URL" claim left untouched (unverified) | Read the served route table first-hand before touching the path text |
| E4 (MCP-330) | `get-keywords` schema declares every parameter optional; endpoint rejects `{}` | schema gains the REAL contract: at least one of `subject`/`keyStage`/`phase` required, and `phase` mutually exclusive with `keyStage` — expressed in schema structure (required-one-of + exclusion), with the description stating it plainly | Live probes: `{}` rejected; each single-param call accepted; `phase`+`keyStage` rejected |

E4 is the only entry with design content (schema semantics); E1–E3 are value swaps. Execution
order E1 → E3 → E2 → E4 (trivial first, probe-dependent and design-bearing last).

## The trigger (the one decision that stays with the owner)

At the submission form-fill moment, if any of MCP-327..330 is not Done: the owner (or Matt under
the delegation) says "execute the override contingency", naming which entries (default: all
not-Done). That word simultaneously rules that the override PR's merge supersedes the named
tickets as SUBMISSION gates: their `blockedBy` edges on MCP-309 are removed at merge with a
comment; the tickets stay open (the upstream work is unchanged and still wanted); each gains the
pointer comment to its entry.

## Execution (single lane, one PR)

TDD red-first: tests prove (a) pin-match applies the patch and the generated tool schema carries
the replacement; (b) pin-mismatch fails the build naming the entry; (c) E4's generated schema
rejects `{}` and the excluded combination at the validation boundary. Then the table + patcher +
CI drift leg, `pnpm sdk-codegen` + full build green, live probes recorded on MCP-419, single-story
PR at the full condition, key-turn to the Director. Estimated small (the four entries are data;
the patcher and guard are one module).

## Removal (per entry, forced)

Upstream fix lands → next codegen/CI run trips the guard → delete the entry, regenerate, PR.
Independent per entry. When the table is empty, the patcher module is deleted whole (no dormant
override machinery survives — replace-don't-bridge). MCP-419 closes when the table is empty or
the contingency is never triggered and the owner stands it down.

*Authored by Falcon hunts Flight (52841f, agent, Director) at owner commission, 2026-07-30.*
