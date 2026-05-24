WS-8 ratification pre-draft 4-way reviewer synthesis (Ferny / ee16a4 window 2).

## Dispatched

4 reviewers in PARALLEL at 19:33:23Z. **Timing note**: Seaworthy tick #4 (19:33:13Z) reasserted sequential-on-Practice-Core-adjacent for WS-8 ten seconds BEFORE my dispatch landed; I had not absorbed tick #4 when the dispatches fired. Substrate-pointer-pattern fires on me here (12th instance of session, on the WS-8 ratification author). Mitigation: verdicts in hand; absorb honestly; extend plan to include PDR-079 with **sequential** reviewer pass on the Practice Core surface.

## Convergent findings (all 4 reviewers agree)

### CONVERGENT-1 — Operative-state distinction MUST be load-bearing, not parenthetical (assumptions #1 + betty #1 + wilma #1 + docs-adr #5)

- **assumptions**: "C2+C5+C4 ratified" without explicit operative-state framing → downstream readers treat three letters as equivalent; C4-in-effect-now becomes invisible behind C2/C5-platform-deferred
- **betty**: C4 retirement condition must be co-located with routing table; coupling-risk if tribal
- **wilma**: substrate-pointer durability — future readers may read "C2+C5+C4 ratified" without operative-state state visibility
- **docs-adr**: title shape must name all three codes + operative state for discoverability

**Cure (convergent)**: Three distinct sections in the record/PDR, not one combined claim:

- **In-effect-now (operative)**: C4 routing-discipline
- **Platform-deferred (target shape)**: C2 near-term + C5 long-term
- **Explicitly rejected**: C1, C3

### CONVERGENT-2 — Platform-engagement vehicle dependency must have a concrete pointer, not a name (assumptions #2 + betty #3 + wilma #2)

- **assumptions**: "Anthropic platform" has no inbox; "named but unrouted" decays into "tolerated indefinitely" (C1 failure mode reappears one layer up)
- **betty**: C2 + C5 should be co-filed as sequenced pair with platform; not independently
- **wilma**: split-verdict risk (Anthropic ships C2 only / C5 only / something C6-shaped)

**Cure (convergent)**: Name the platform-engagement vehicle explicitly (TBD if not yet opened; track as owner-action). Frame C2 + C5 as multi-part handshake with explicit reservation to evaluate C6-shaped counter-proposals separately.

### CONVERGENT-3 — Comms-broadcast alone is under-durable for multi-Director-window-carrying decision (assumptions #3 + docs-adr #1)

- **assumptions**: A future agent searching for ".claude/* write policy" should not have to hunt comms events; ADR/PDR is source-of-truth per `feedback_adrs_permanent_plans_ephemeral`
- **docs-adr**: WS-8 closure requires "ADR drafted OR explicit owner deferral with named trigger"; comms-broadcast + cross-reference does NOT satisfy that bar; PDR-079 needed alongside (next free PDR-080 if Lanternlit's PDR-078 is taken; need to check)

**Cure (convergent)**: Author **PDR-079** (or next-available number) alongside the comms-broadcast. Broadcast is announcement-class; PDR is canonical-doctrine class.

### CONVERGENT-4 — Rejection rationale must be inline, not by-reference (assumptions #4 + docs-adr #3)

- **assumptions**: "Reject C1/C3" without rationale forces re-reading verdict matrix; the rationales are short and load-bearing
- **docs-adr**: drift surface check — without inline rationale, future readers reconstruct intent from director-handoff §6.15 entries

**Cure (convergent)**: One-sentence inline rationale per rejected shape:

- C1 rejected — rubber-stamp cascade + organisational SPOF; 4-Director carry as empirical evidence of indefinite tolerance
- C3 rejected — silent gitleaks violation surface; gate fires non-deterministically after rule retirement

### CONVERGENT-5 — Re-ratification triggers must be named explicitly (wilma #3 + wilma #5)

**Cure (convergent)**: Name explicit re-ratification triggers:

- (A) Anthropic responds to C2 or C5 platform-engagement (capability lands or counter-proposal received)
- (B) Owner direction explicitly amends
- (C) Substrate-pointer-pattern v3 cure lands with schema amendment
- (D) Cursor availability shift (e.g. >4 hours C4 unavailability) — escalate to owner

## Divergent findings (reviewer-specific, not all 4)

### DIVERGENT-A — 5-shape closure assumption (assumptions #5 only)

- **assumptions**: "5-shape space (C1-C5) treated as complete based on Charcoal/Wilma analysis; surfacing of new shape supersedes ratification on its merits"
- **other reviewers**: no equivalent finding

**Cure**: Adopt — low cost, names assumption, preserves future-agent agency.

### DIVERGENT-B — C5 substrate-as-API schema-versioning (wilma #4 + betty #2)

- **wilma**: C5 makes `.agent/state/collaboration/` substrate part of Anthropic classifier-API contract; freezes schema evolution
- **betty**: C4→C5 transition has moderate change-cost; schema changes during deferred period need C5-impact annotation

**Cure**: Reserve schema-versioning for C5 substrate-as-API contract. Critical amendments require coordination clause.

### DIVERGENT-C — Foreman/upstream alternative shapes (betty #5 only)

- **betty**: record should explicitly note why "agent-authored staging file + human-script-promotes" was not evaluated

**Cure**: One-line in record stating "upstream alternative (agent → staging-file → human-promote pipeline) is structurally equivalent to C1 (owner-touch); already rejected in C1-rejection rationale; not re-evaluated."

### DIVERGENT-D — Outbound cross-references — which destinations (docs-adr #4 only)

- **docs-adr**: PDR-077 is wrong cross-reference target (marshal-cycle-discipline is orthogonal); use only as sibling-pointer. Missing destinations: start-right-team SKILL §X (Director onboarding) + `.agent/rules/README.md` (forwarder pattern home, to be created)

**Cure**: Drop PDR-077 as cross-reference destination; add start-right-team SKILL §"Cross-Platform Routing Posture" + new `.agent/rules/README.md` (forwarder pattern doc). Drop pending-graduations (decision is owner-ratified, not graduation-pending).

### DIVERGENT-E — Citation discipline line-drawing (docs-adr #2 only)

- **docs-adr**: Q3 verdict scope is *substrate-to-substrate* citations; *substrate-to-git-landing* citations stay SHA-prefix
- Concrete rule: event-id for substrate cross-references; SHA-prefix legitimate for git-landing references; codify in PDR-079; flag amendment to `.agent/rules/sha-prefix-in-collaboration-content.md` as follow-up

**Cure**: Adopt; codify the line; flag the rule-amendment as follow-up.

### DIVERGENT-F — Ownership / change-authority (wilma #5 only)

- **wilma**: record lacks change-authority naming

**Cure**: Name change authority — "owner direction OR Director-coauthored amendment if pattern v3 cure changes schema OR platform-engagement-track owner on Anthropic response"

## Architectural conditions for the draft (load-bearing; embed in both broadcast + PDR)

1. **Operative-state distinction**: three sections (In-effect / Platform-deferred / Rejected)
2. **Platform-engagement vehicle**: name TBD or existing; track as owner-action if TBD
3. **Inline rejection rationale**: one sentence per rejected shape
4. **Re-ratification triggers**: four triggers (A-D above)
5. **5-shape closure named**: one line
6. **C5 schema-versioning reserve**: one clause
7. **Cursor convergence trigger**: explicit (>4 hour C4 unavailability → owner-escalate)
8. **Change authority**: named
9. **Citation discipline line**: codified (event-id for substrate; SHA-prefix for git)
10. **Cross-reference destinations**: PDR-079 + WS-8 plan-record + start-right-team SKILL + `.agent/rules/README.md` (drop PDR-077 + pending-graduations from named destinations)

## Format/title for broadcast

Per docs-adr: `[DECISION-OF-RECORD] Claude .claude/* self-modification authorisation — C2 near-term + C5 long-term + C4 fallback ratified (C1/C3 rejected; cites verdict matrix 1e2c83eb)`

## PDR-079 next-available check

Need to verify PDR-079 is the next free number (PDR-077 = Charcoal marshal-as-cycle; PDR-078 = Lanternlit heartbeat-doctrine). If both committed, PDR-079 is correct. Verify on draft.

## Transcript IDs (for substrate forwarding)

| Reviewer | Transcript |
|---|---|
| assumptions-expert | `abd6fb0a2f95d4b25` |
| architecture-expert-betty | `a52790a31593562f9` |
| architecture-expert-wilma | `a64d82df5d94c44ca` |
| docs-adr-expert | `a8f083c2f9986abbc` |

— Ferny Fruiting Root / claude / claude-opus-4-7 / ee16a4 (Window 2 WS-8 author)
