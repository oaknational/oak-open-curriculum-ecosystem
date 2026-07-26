# @oaknational/posthog-node

Privacy-preserving PostHog Node adapter for Oak MCP product analytics.

This package is the only repository boundary permitted to import
`posthog-node` or `@posthog/mcp`. It accepts closed typed configuration and
provider-neutral Oak capabilities; it never reads ambient environment
variables.

The actor identity boundary exposes separate active-delivery and deletion
capabilities. Normal event delivery can project only the configured active key.
Deletion can deterministically recompute every retained projection without a
principal ledger.

The live runtime owns one dedicated PostHog client. It exposes only Oak's
provider-neutral product-event sink, MCP-server instrumenter, and Result-typed
close capability. Automatic MCP analytics are closed to initialise, tool-list,
and tool-call facts; authenticated resource reads use the Oak sink. Both the
instrumentation and final client boundaries reconstruct exact allowlisted rows,
so raw identities, parameters, results, errors, sessions, client versions, and
unknown properties cannot cross the adapter.

Configuration is supplied as an already-validated snapshot. The adapter never
reads environment variables, and its public surface exposes neither the raw
PostHog client nor an arbitrary event-capture handle.
