---
name: "Wire-Format-Aware Redaction"
use_this_when: "Telemetry redaction protects structured objects or URLs, but secrets can also travel through raw encoded strings such as application/x-www-form-urlencoded request bodies."
category: architecture
proven_in: "packages/core/observability/src/redaction.ts"
proven_date: 2026-04-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Assuming query/header/object redaction automatically protects every wire format that can carry credentials"
  stable: true
---

# Wire-Format-Aware Redaction

## Problem

Telemetry redaction often starts from the shapes application code can already
see: parsed JSON objects, header maps, or URL query parameters. Proxy and auth
paths frequently handle secrets in raw serialised strings instead:
`application/x-www-form-urlencoded` bodies, CLI-style flags, or other encoded
payloads. If the shared redaction layer only understands parsed structures,
credentials leak into logs, spans, breadcrumbs, or error capture even though
the "obvious" sensitive keys are already covered elsewhere.

## Pattern

Treat each secret-bearing wire format as a first-class redaction input. Apply
the shared policy to the serialised payload itself before any transport sink
sees it. Reuse the same sensitive-key rules across structured and serialised
representations so one policy protects all observability surfaces.

## Use It Like This

- keep redaction in the shared observability boundary, not in a single route
- detect candidate wire formats conservatively so normal strings are left alone
- reuse the same sensitive-key list for objects, URLs, and encoded bodies
- write tests against the exact wire format that reaches telemetry

## Anti-Pattern

- redacting parsed objects or query params only, while raw forwarded bodies are
  still visible to telemetry
- patching one auth route locally instead of fixing the shared redaction layer

## Result

Logs, spans, breadcrumbs, Sentry hooks, and future sinks inherit the same
protection automatically, and new proxy/auth paths do not reopen the same leak
through a different serialisation shape.
