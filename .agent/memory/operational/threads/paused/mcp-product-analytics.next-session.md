---
fitness_line_target: 350
fitness_line_limit: 500
fitness_char_limit: 35000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# Next-Session Record — `mcp-product-analytics`

## Landing target — refreshed 27 July 2026

Implement the submission-blocking PostHog product-analytics capability defined
by
[`mcp-63-posthog-product-analytics.plan.md`](../../../../plans/delivery/mcp-63-posthog-product-analytics.plan.md).
The implementation must provide:

1. a provider-neutral product-analytics port and working PostHog sink for the
   repository telemetry package; and
2. `@posthog/mcp` integration in the serverless MCP application.

PostHog is selected and required. The implementation blocks the initial
submission. The privacy, access, retention, deletion, and accountable
enablement evidence in
[`mcp-173-posthog-privacy-governance.plan.md`](../../../../plans/delivery/mcp-173-posthog-privacy-governance.plan.md)
gates the October public beta.

The focused replacement-stack outcome, exact protected heads, remaining slice
inventory, loss scan, and successor instructions are absorbed in the 27 July
permanent handoff record at
`.agent/reports/mcp-63-focused-successor-handoff-2026-07-27.md`.
The earlier
[26 July dated record](../../../../reports/mcp-63-succession-notification-and-focused-delivery-2026-07-26.md)
preserves the succession and monitoring chronology. This live thread remains
temporary operational state.

## Current state

- [PR #585](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/585)
  (MCP230) and
  [PR #586](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/586)
  (MCP231) are merged.
- [PR #592](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/592)
  is the canonical bot-authored MCP232+MCP233 bundle at exact head
  `2fdce34759dcfed7e70c2fc31690276b12fff2fa`. At the
  `2026-07-27T13:01:59Z` recount it was a draft, mergeable, 31/31 green,
  0/0 review threads, and blocked only by the draft flag. Its worktree is
  clean and exactly synced upstream.
- Closed PR #591 was the wrong-author false start caused by an empty bot token
  and GitHub CLI credential fallback. It is not a delivery surface.
- [PR #576](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/576)
  remains the frozen extraction source at exact head
  `aac01d12dd696e4e1831a683b41fde692be721ca`. Do not merge or close it until
  every MCP230–MCP238 replacement has a pushed and linked PR.
- MCP234–MCP244 remain. MCP234 actor pseudonyms is next after #592 settles.
  Keep one replacement PR open at a time; extract by path from #576 rather
  than cherry-picking mixed commits.
- No application source for MCP239–MCP244 has landed in the replacement stack.
- Cutter's seven inherited claims are closed at seat retirement. The next
  implementer opens a fresh, ticket-specific claim.
- Linear MCP63 still contains stale owner-gated merge wording. Current owner
  direction permits a green and clean PR to merge without a new approval.
- The live watcher and claim heartbeat are stopped with Cutter's seat. The
  Director is the routing and immediate #592 shepherding owner.

## Authority order

1. The owner's current direction and milestone language.
2. The two ratified repository plan nodes.
3. [ADR-218](../../../../../docs/architecture/architectural-decisions/218-posthog-mcp-analytics-identity-session-and-privacy.md).
4. The
   [26 July probe report](../../../../research/telemetry-and-understanding/2026-07-26-posthog-mcp-pre-execution-probes.md)
   for dated vendor behaviour evidence.
5. Linear for delivery state and Notion for consultation state.

Older explorations and PR #477 are lineage only. They never override the
ratified plan or ADR.

## Settled boundary

- Product analytics answers deterministic user-interaction questions. Sentry
  continues to own engineering errors, traces, and diagnostic payloads.
- One MCP-dedicated PostHog client serves the current all-MCP event estate.
- The allowed facts are operation name, timestamps and duration, bounded
  outcome, approved client/protocol/environment/release categories, UUIDv7
  event/call identifiers, and the PostHog-scoped actor pseudonym.
- Arguments, responses, prompts, resource contents, search text, free text,
  direct identifiers, headers, tokens, IP/GeoIP enrichment, browser
  autocapture, session replay, and person-level cross-provider joins are
  prohibited.
- The stable actor pseudonym is derived inside the verified Clerk boundary and
  scoped by destination, environment, and key version. It remains
  pseudonymous personal data for Oak.
- One minimal PostHog Person, containing only that pseudonym and no person
  properties or groups, supports the documented deletion path.
- UUIDv7 identifies a call/event. It is not a universal person identifier.
- `$session_id` is removed until the installed integration proves a
  server-issued, actor-bound, replay-resistant round trip in shipped clients.
- The agent-echo conversation identifier is disabled. Downstream activity
  windows may be derived only when explicitly labelled inferred.
- Versions and vendor call shapes are flexible. Compatible non-exact manifest
  ranges and the lockfile record the current tested resolution. Every upgrade
  reruns the complete behavioural contract; a version change alone does not
  reopen the architecture.
- The MCP-63 implementation path does not enable public-beta capture or perform
  the live retention/deletion drill. MCP-173 owns those October proofs.

## Next safe step

1. Recount #592 at exact head
   `2fdce34759dcfed7e70c2fc31690276b12fff2fa`.
2. Mint the merge-bot token with
   `pnpm --silent agent-tools merge-bot mint-token` — there is no `--` before
   `merge-bot` — and verify `viewer.login` before writing.
3. If #592 remains green, clean, mergeable, and thread-clean, mark it ready,
   recount, and merge without an additional approval pause.
4. Mark MCP232 and MCP233 Done, remove stale #591 linkage when the connector
   permits, and open a new claim for MCP234.
5. Preserve #576 while landing MCP234–MCP238 serially. Continue MCP239–MCP244
   only under their ticket ceilings and proofs.

The exact path map, bot-authorship failure mode, ticket ceilings, and frozen
PR close condition live in the permanent 27 July handoff record.

## Handoff loss and metaloss scan

- Green, ready, and merged are distinct: #592 is green but was still a draft
  at the last recount.
- Empty bot-token output allowed credential fallback and wrong authorship;
  verify the actor before every GitHub mutation.
- #576 closes only after all MCP230–MCP238 replacements are pushed and linked.
- Patch-ID evidence shows the four commits on the old local delivery branch
  have no unique unsafe source.
- Linear's owner-gated wording is stale relative to current owner direction.
- The closeout documents still require Director commit, push, and PR custody.
- A second loss pass found the evidence-index and external-drift bounds
  themselves needed a permanent home. The 27 July handoff report now owns
  them. A third pass would only re-find current-state drift,
  green-versus-ready, and landing/custody, so recursion closes.

## Participating identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Glassy Flowing Stern | cursor | composer-2.5 | de55d6 | original design author | 2026-05-26 | 2026-05-26 |
| Stellar Glowing Satellite | claude | claude-opus-4-7 | 9a2967 | programme and amendments | 2026-05-26 | 2026-05-26 |
| Urchin hunts Surf | claude-code | claude-fable-5 | b51773 | superseded spike author | 2026-07-22 | 2026-07-22 |
| Crucible wakes Ashes | codex | GPT-5 | 019f9a | ratified plan, probes, and closeout | 2026-07-26 | 2026-07-26 |
| Kite seeks Crosswind | codex | GPT-5 | 019f9e | implementation and outgoing custody | 2026-07-26 | 2026-07-26 |
| Cutter hunts Lagoon | codex | GPT-5 | 019f9e | focused replacement delivery and outgoing boundary | 2026-07-26 | 2026-07-27 |
