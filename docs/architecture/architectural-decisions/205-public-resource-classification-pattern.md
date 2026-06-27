# ADR-205: Classifying MCP resources as public — the per-resource allowlist pattern

## Status

Accepted (2026-06-27). Builds on ADR-057 (which introduced the public-resource allowlist)
and ADR-113 (the auth baseline); generalises ADR-057 into a stated classification rule,
extends it to app-local resources, and records the protocol-level basis the pattern rests
on.

## Context

ADR-057 introduced a public-resource allowlist so that static documentation and widget
`resources/read` calls skip Clerk authentication (originally to fix discovery latency). It
stated a classification criterion — no user/school/tenant/operational/personal data — and
derived the allowlist from the SDK's `DOCUMENTATION_RESOURCES` plus the widget URI.

Two things were left implicit, and the Oak: Under the Hood reframe (ADR-202) brought them
to the surface when it added the first **app-local** public resource
(`docs://oak/under-the-hood.md`, registered inside this app rather than via the SDK):

1. **Why is classification per-resource at all?** ADR-057 presented the allowlist through
   the latency lens, not as a consequence of how MCP models authentication. Without that
   basis, "should this new resource be public?" reads like an arbitrary per-case
   judgement.
2. **App-local resources are not covered.** ADR-057's allowlist derives only from SDK
   constants, so a resource registered inside the app (not in `DOCUMENTATION_RESOURCES`)
   is invisible to it and defaults to auth-gated regardless of its actual
   data-sensitivity.

The protocol fact that anchors both — verified first-hand against the official MCP
specification (Authorization, revision 2025-11-25): **MCP models authorization at the
server / transport level, not per-resource.** The unit of protection is the MCP server
(its canonical URI, used as the OAuth `resource` indicator per RFC 8707); authorization is
OPTIONAL, and a server is either protected or not. There is no MCP concept of
per-individual-resource authorization. Per-resource public-vs-protected is therefore an
**application-level classification** Oak owns — the MCP spec is silent on which resources
should be public, so the choice is an Oak architectural one, not an MCP-prescribed
mechanism. (Source:
<https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization>.)

## Decision

**1. The pattern, and its basis.** MCP authorization is server-level, so Oak's MCP server
is — at the protocol level — a single protected endpoint. Oak deliberately classifies each
resource into one of two states with an **application-level public-resource allowlist**
(`src/auth/public-resources.ts`): public resources are served without auth; everything
else is authenticated. This per-resource classification is an Oak design because the
protocol offers no finer-grained control than the whole endpoint — it is how Oak expresses
intent the protocol cannot.

**2. The classification rule.** A resource is **public** (on the allowlist; its
`resources/read` skips auth) if and only if BOTH hold:

- it is **static or public-reference content** — documentation, orientation, a widget
  shell, or a pointer to already-public material; and
- it contains **no user, school, tenant, operational, or personal data** (ADR-057's
  criterion, unchanged).

Every resource is classified by this rule. A resource that fails either test is
authenticated, alongside all tool calls, prompts, and discovery methods (ADR-113). **When
in doubt, authenticate.**

A sharpening that decides the common case: **authenticating a pointer to already-public
content protects nothing.** If a resource's entire payload is public by construction (for
example a markdown pointer to a public GitHub URL and public website URLs), authentication
adds friction without protecting any secret. Such resources are public.

**3. App-local resources.** The allowlist draws from two sources: the SDK-derived URIs
(ADR-057) and explicit **app-local** public URIs for resources registered inside this app.
Each app-local entry:

- mirrors the exact URI the resource is registered under, sourced from a single exported
  constant (`OAK_UNDER_THE_HOOD_RESOURCE_URI` in `register-resources.ts`); and
- is **drift-guarded by a test** that imports that constant and asserts it is public, so a
  future rename of the resource cannot silently re-authenticate it.

**4. This decision (the worked instance).** `docs://oak/under-the-hood.md` (the Oak: Under
the Hood orientation pointer) is **public**. It is static markdown that points only to the
public canonical skill on public GitHub and public Oak website URLs; it carries no
user-specific data; authenticating it would protect nothing; and its sibling
`getting-started.md` is already public. It is the first app-local public resource and the
worked instance of the rule above.

## Consequences

### Positive

- "Is this resource public?" has a clear rule with a stated protocol basis, not a per-case
  judgement — discoverable from the code (`public-resources.ts` links here) and from
  ADR-057.
- App-local public resources are first-class; previously they defaulted to authenticated
  regardless of their data-sensitivity.
- The orientation pointer is reachable by unauthenticated connecting assistants,
  consistent with its public-pointer design (ADR-202) and with its public sibling.

### Negative / cost

- The public-resource set grows by one. Each addition remains a deliberate,
  security-reviewed classification — ADR-057's discipline is retained, not relaxed.
- App-local entries carry a small literal duplication (the URI appears in the registration
  and the allowlist); the drift-guard test is the mitigation.

### Neutral

- No change to the MCP protocol posture: the server remains a single protected endpoint;
  the allowlist is the application-level expression of which resources are public,
  unchanged in mechanism from ADR-057.

## References

- [ADR-057: Selective Authentication for Public MCP Resources](./057-selective-auth-public-resources.md)
  — introduced the allowlist and the data-sensitivity criterion this rule generalises.
- [ADR-113: MCP-spec-compliant auth for all methods](./113-mcp-spec-compliant-auth-for-all-methods.md)
  — the auth baseline every authenticated method follows.
- [ADR-202: Orientation as one intent-discerning lens](./202-orientation-as-one-intent-discerning-lens.md)
  — the Oak: Under the Hood surface this decision classifies.
- MCP Authorization specification, revision 2025-11-25 (server/transport-level auth; OAuth
  2.1; RFC 9728 protected-resource metadata; RFC 8707 resource indicators):
  <https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization>
- MCP Resources specification:
  <https://modelcontextprotocol.io/specification/2025-11-25/server/resources>
- `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts` — the allowlist.
