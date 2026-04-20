---
name: "TSDoc Extension Point for Future Consumers"
category: architecture
status: proven
discovered: 2026-04-17
proven_in: "Sentry maximisation plan L-10 (feature-flag scaffolding) and L-11 (AI instrumentation scaffolding) — both resolved as TSDoc-only extension points after reviewer pushback on barrel-re-export commitments"
---

# TSDoc Extension Point for Future Consumers

When the provider or consumer shape for a future integration has not
been chosen yet, document the attachment point in TSDoc and the
workspace README. **Do not pre-commit a public API surface** by
re-exporting stubs through the library barrel.

## Pattern

For a future-consumer lane (e.g. "when we pick a feature-flag
provider", "when the first MCP tool calls an LLM"):

1. Identify the canonical attachment point in the existing adapter —
   typically inside the factory that composes the vendor SDK's init
   options.
2. Author a TSDoc block at that attachment point naming: the vendor
   integrations that are candidates, the shape the helper will take
   when a consumer arrives, and the reason the surface is deliberately
   empty today.
3. Cross-reference from the workspace README in a short "Future
   extension" section.
4. **Nothing is exported from the library barrel.** No placeholder
   helper, no re-export of the vendor SDK's wrapper.
5. The first real consumer's integration becomes a separate lane
   whose scope is the public API shape — not an accretion on top of a
   pre-committed stub.

## Anti-Pattern

Re-export the vendor SDK's integration helpers through the adapter
barrel now, with TSDoc like "Use this when you add a feature-flag
provider." This commits the library's public surface to a shape
negotiated without a real consumer. The first real consumer either
accepts whatever shape was pre-committed (possibly wrong for the
actual provider) or forces a breaking change to the library's public
surface to get the shape it needs.

## Why It Matters

- **YAGNI discipline**. The library accrues abstract extension-point
  machinery that has no live consumer.
- **Public API commitments are irreversible**. Anything exported from
  a barrel is load-bearing for downstream consumers from the moment
  it ships. Removing or reshaping it is a breaking change.
- **Cohesion drift**. A Sentry adapter that exports placeholder
  wrappers for feature flags, AI, and other pre-consumer features
  drifts from "Sentry adapter" toward "Sentry adapter plus scaffolding
  for things we haven't built yet."
- **Contract-setting without evidence**. The shape of the first
  consumer's needs is unknown. Pre-committing the surface negotiates
  a contract without the data that would inform it.

## Evidence

**Sentry observability maximisation (2026-04-17)** — Reviewer round
flagged that L-10 (feature-flag scaffolding) and L-11 (AI
instrumentation scaffolding) both proposed barrel re-exports for
providers not yet chosen and consumers not yet existing. Owner
resolved both as TSDoc-only extension points. Both lanes were
narrowed from "wire the integration" to "document where the
integration will attach when a real consumer arrives."

## When to Apply

- A lane proposes adapter surface for a provider or consumer that
  doesn't exist yet.
- A reviewer flags that the shape is negotiated without a real
  consumer.
- The "future extension" framing is honest — we actually do expect a
  consumer, just not in this work.

## When Not to Apply

- A real consumer already exists in the repo and needs the surface.
- The surface is genuinely trivial (single function, known signature,
  vendor SDK contract already stable) and the YAGNI cost is lower
  than the TSDoc-maintenance cost.

## Related Patterns

- `review-intentions-not-just-code.md` — reviewers catch pre-committed
  shapes at the intent stage.
- `pre-implementation-plan-review.md` — the review that surfaces this
  pattern.
- `end-goals-over-means-goals.md` — YAGNI is the same impulse.
