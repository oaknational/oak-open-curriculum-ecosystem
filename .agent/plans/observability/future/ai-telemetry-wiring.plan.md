---
name: "AI Telemetry Wiring"
status: strategic-brief
overview: >
  Strategic brief for wiring `@sentry/core` AI instrumentation (AI spans, LLM
  trace correlation, prompt/completion scrubbing, token-usage attribution)
  once the first LLM-calling MCP tool lands. Today's MCP tools are all
  deterministic SDK-backed; AI instrumentation has no emission surface to
  attach to.
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
promotion_trigger: "First LLM-calling MCP tool lands (any tool that makes a real LLM inference call during its handler execution)."
---

# AI Telemetry Wiring

**Status**: 🔵 Strategic (not yet executable)
**Last Updated**: 2026-04-18
**Promotion trigger**: first LLM-calling MCP tool lands.

---

## Problem and Intent

[ADR-162](../../../../docs/architecture/architectural-decisions/162-observability-first.md)
§Five Axes names observability as applicable "as applicable" per
capability. AI-specific axes (prompt/completion tracing, token usage,
model attribution, retrieval-augmentation quality) are only relevant
once a capability makes real LLM calls. Today's MCP tool surface is
deterministic SDK-backed — curriculum lookups, search, keyword queries
— with zero LLM inference at handler time.

The intent of this plan is to have a ready-to-execute home for AI
telemetry wiring so that when the first LLM-calling tool lands, the
observability lane opens without re-derivation.

## Domain Boundaries and Non-Goals

**In scope**:

- `@sentry/core` AI spans (LLM call as child span).
- Token usage attribution per tool per model.
- Prompt/completion redaction (ADR-160 barrier covers the general
  case; AI-specific fields need schema additions).
- Model and provider attribution labels.

**Out of scope (non-goals)**:

- Selection of an LLM provider — product and infrastructure decisions,
  not observability.
- Prompt-engineering evaluation frameworks — owned by a separate
  plan when LLM use-cases stabilise.
- AI-output quality scoring — product domain.

## Dependencies and Sequencing

**Prerequisite**: at least one LLM-calling MCP tool exists and is
wired into the handler boundary. Without an emission site, this plan
has nothing to instrument.

**Related**:

- `observability-events-workspace.plan.md` — AI-specific event schemas
  (token_usage, model_invoked) will extend the MVP schema set when
  this plan promotes.
- `sentry-observability-maximisation-mcp.plan.md § L-11` — L-11 is
  currently scaffolding-only (per A.3 decisions); this plan replaces
  L-11's scope when it promotes.

## Success Signals

- Data scientists can answer "which tools used which models, how often,
  with what token cost" from telemetry alone.
- A regression in prompt-template quality is detectable from the
  `tool_invoked` outcome-class distribution before support reports
  arrive.
- Provider-level failures (rate limits, timeouts) are attributable to
  the specific model and prompt shape.

## Risks and Unknowns

- **Prompt/completion redaction may be non-trivial.** User inputs
  passing to the LLM may contain PII in shapes the generic redactor
  does not catch. Mitigation: AI emission schema enforces categorical-
  not-value capture; prompt hashing instead of prompt text.
- **Cost telemetry couples to provider-specific billing shapes.**
  Mitigation: unit of measurement is tokens; monetary attribution
  happens in a future billing-integration plan (not here).
- **Cross-provider semantics vary.** Mitigation: abstract over
  provider in the events workspace; provider name is a label, not a
  schema selector.

## Promotion Trigger

**Testable event**: a commit lands that introduces an MCP tool
handler making a real LLM inference call (any import of an LLM SDK
used in a handler).

**When triggered**: this plan moves to `current/`. Promotion authors
extend the events workspace with AI schemas, wires `@sentry/core` AI
spans into the tool's handler, and updates the ADR-162 §Five Axes
Product table with an AI row.

## Implementation Sketch (for context, finalised at promotion)

- Extend `@oaknational/observability-events` with `model_invoked` +
  `token_usage` schemas.
- Wire `@sentry/core` AI spans at the LLM-call boundary.
- Emission fields: model name, provider, prompt hash (not text),
  completion category (not text), input/output token counts, latency,
  outcome class.
- Redaction contract: per-field redaction policy documented in schema
  `.meta()` so the events workspace is self-describing.

## References

- ADR-162 §Five Axes (to extend).
- Session report §2.3 gap item 2 (real AI instrumentation wiring —
  blocked on first LLM-calling tool).
- `sentry-observability-maximisation-mcp.plan.md § L-11` (current
  scaffolding-only lane).
