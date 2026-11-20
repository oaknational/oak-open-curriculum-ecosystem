---
id: mcp-173-posthog-privacy-governance
node_type: delivery
name: "PostHog privacy governance for October public beta"
overview: "Establish and prove the strictly necessary analytics boundary, minimisation, public information, access, retention, erasure, and provider separation for authenticated MCP analytics."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-26
ratified_where: "Linear MCP-173 — owner-approved design baseline, 2026-07-26"
serves: first-major-release
impact_areas:
  - analytics-and-observability
  - auth-and-access
tickets:
  - MCP-173
depends_on:
  - plan: mcp-63-posthog-product-analytics
    kind: blocking
last_updated: 2026-07-26
---

# PostHog privacy governance for October public beta

## Goal

Because Oak cannot sensibly ask permission across MCP hosts, it
collects only the closed interaction-event envelope strictly necessary
to build, operate, and maintain a safe service. People using Oak
through an AI-assistant host receive clear, context-appropriate
information about that product analytics. Oak can prove that the
processing is minimised, access-controlled, retained for no more than
the approved period, and erasable on request. The governance applies
to PostHog and every authorised copy, not merely the ingestion
boundary.

## Mechanism

The durable identity, session, event, and privacy boundary is
[ADR-218](../../../docs/architecture/architectural-decisions/218-posthog-mcp-analytics-identity-session-and-privacy.md).

The repository plan graph carries durable dependencies. Linear carries
schedule, finer-grained sequence, ownership, acceptance state, and
evidence links. A linked Notion record carries the substantive
compliance conversation, feedback, rationale, proposed wording, and
approval. The public repository carries only the durable mechanism and
proof contract.

The plan owner supplies the deterministic event and identifier
contract, the MCP-hosted data flow, and the retained research as
product and technical evidence. The service emits server-side facts
from inside the authenticated MCP boundary; it does not rely on an Oak
cookie, browser SDK, browser autocapture, or host consent banner. MCP
provides no reliable, meaningful permission surface before capture
across all hosts.

The owner-decided approach is therefore to limit processing to what is
strictly necessary. The closed, content-free event envelope is needed
to understand how people interact with the MCP service, because Oak
cannot build, operate, and maintain a safe service without knowing
which capabilities are used, in what sequence, with what outcome, and
where interaction fails. Every field must answer a named
service-understanding, safety, maintenance, or improvement question;
nothing merely interesting or potentially useful later is collected.

“Strictly necessary” is the product and architecture boundary in this
plan. It does not assert that PostHog executes the tool call, or
pre-empt the separate terminology and tests in data-protection law.
The PECR, UK GDPR, public-task, notice, objection, and consent research
is retained and supplied to Oak's compliance and privacy specialists.
They own their independent assessment and advice; this plan does not
prescribe their method. OAuth scopes remain authorisation, not
permission for analytics.

Choice remains documented as a possible future product capability.
The researched implementation would hold authoritative preference or
suppression state inside the authenticated server boundary and check it
before emission. It would not be copied to PostHog or depend on model
memory. The connection journey, an Oak-hosted privacy-settings page,
an app-only MCP App action, and optional protocol elicitation are
possible surfaces; none is assumed universally available.

The approved data map closes every field and recipient. PostHog
receives product-interaction facts under a destination-scoped
pseudonym. Its supported event-deletion API first resolves a Person,
so actor-linked events create one minimal pseudonymous Person row.
That row contains no direct identifier, `$set`, `$set_once`, person
property, or group membership. Sentry receives engineering
diagnostics. There is no cross-provider join by default. Any future
call-level bridge requires a separately approved purpose, identifier,
and Oak-controlled boundary; person-level cross-provider linkage
requires a distinct approval and remains outside this plan.

Retention and erasure are exercised, not stated. The retention proof
covers events, derived datasets, exports, and other authorised copies.
The deletion route derives every applicable destination pseudonym
before the authentication principal is removed, submits each
pseudonym to PostHog's Person bulk-delete endpoint with event deletion
explicitly enabled, deletes the minimal Person row, propagates the
request to authorised copies, and verifies asynchronous completion
without creating a shadow identity ledger. Events captured after the
deletion request are not covered, so the producer must be stopped or
rotated and buffered delivery drained before the request. Every
retained pseudonym-key version is included.

Profileless events remain locatable by exact `distinct_id`, but the
current public API queues no deletion when that ID resolves no Person.
The implementation-derived materialise-then-delete path is not the
baseline because PostHog does not document it as a privacy deletion
contract.

Policy, notice, data-map, and access work can proceed before live
analytics exists. MCP-173 completion nevertheless depends on MCP-63
because its live retention and erasure proofs require controlled
events. The blocking edge gates archival, not parallel preliminary
work; Linear owns the finer-grained delivery sequence.

## First-principles checks

- **Shape:** repository tests prove only Oak-controlled projection,
  routing, and separation behaviour. Compliance approval, vendor
  configuration, analyst access, retention, and a completed live
  erasure remain owner-held evidence rather than simulated repository
  assertions.
- **Landing path:** durable mechanism and proof contracts land here;
  Linear carries state and evidence links; the linked consultation
  record carries internal discussion, organisational detail, and
  redlines. Acceptance cannot be inferred from one surface alone.
- **Vendor literals:** retention and deletion operations are
  rechecked against the live regional project and current official
  PostHog surface when exercised. The plan deliberately requires
  operational proof instead of assuming that a named setting or API
  exists.

## Acceptance criteria (each with a proof)

The plan owner supplies and maintains the product and technical
evidence, verifies operational controls, and links the resulting
organisational decisions and public wording on MCP-173. Oak's
compliance and privacy specialists independently choose their method,
terminology, records, and advice; this plan does not assign that work
or prescribe its form.

1. **The product and technical facts needed for specialist review are
   complete.** The consultation contains the MCP-hosted data flow,
   absence of a universal permission surface, strictly necessary event
   ceiling, identity and retention model, and retained official-source
   research. MCP-173 links the resulting advice, decision, and public
   wording that Oak's accountable processes choose to produce. This
   criterion requires an auditable outcome without prescribing the
   specialists' method or document set.
2. **Oak's chosen governance records are aligned with the product
   facts.** Purpose, necessity, data categories, identifier semantics,
   recipients, regional processing, retention, access, erasure, and
   risk controls are reflected in the records selected by Oak's
   accountable processes. Repository security guidance no longer
   claims that the service has no persistence, tracking, or analytics.
   Proof (`repo-safe`): documentation link and contradiction checks;
   (`owner-held`): resulting record or decision links on MCP-173.
3. **The event and identity contract is closed and enforced.** Direct
   identifiers, content-bearing values, IP/GeoIP, person properties,
   groups, browser persistence, model-cooperated conversation labels,
   untrusted package-session claims, and shared cross-provider person
   identifiers cannot cross the analytics boundary. The only Person
   record permitted is the destination-scoped pseudonym with no person
   properties, required by the supported deletion route. Proof
   (`repo-safe`): the policy and outbound-event suites named by the
   MCP-63 plan; (`owner-held`): current organisational decision on the
   field inventory.
4. **Unaggregated-row access is least privilege.** A named role owns
   grant, review, removal, and audit; exports require explicit
   authorisation and appear in the data map. Proof (`owner-held`):
   access configuration and review evidence linked on MCP-173.
5. **The maximum retention period is operationally true.** Events,
   residual profiles, derived data, exports, and every controllable
   copy expire within five years (60 months). The product decision record
   explains which approved longitudinal question requires
   pseudonymous raw facts for that long, or sets a shorter raw-event
   period with anonymised aggregates retained for the remaining
   analytical need. Proof
   (`owner-held`): necessity decision, live provider configuration,
   and an authorised-copy register in which every entry links its
   enforced expiry/deletion control, recorded on MCP-173.
6. **One deletion request completes end to end.** The exercised route
   covers trigger, derivation of every retained pseudonym version,
   producer stop or rotation, delivery drain, provider Person and event
   deletion, authorised-copy deletion, asynchronous completion
   polling, full-horizon zero-row verification, and an evidence record
   that cannot re-identify the deleted person. Proof (`repo-safe`):
   pure routing and identifier-policy tests where code owns the step;
   (`owner-held`): completed drill and runbook evidence on MCP-173.
7. **Provider responsibilities remain separate.** Approved samples
   show product-interaction facts in PostHog, engineering diagnostics
   in Sentry, and no cross-provider bridge by default.
   Proof (`repo-safe`): coexistence and policy suites;
   (`owner-held`): independently reviewed live samples plus the
   approved data map and access/configuration review, linked on
   MCP-173. Any future join requires its own approved purpose,
   identifier, boundary, and proof.
8. **October public-beta enablement has a current decision.** Immediately
   before enabling public-beta capture, every criterion above remains
   current and Oak's accountable public-beta decision is recorded. Proof
   (`owner-held`): the dated decision link on MCP-173.
9. **The strictly necessary baseline and future-choice research are
   explicit.** The mandatory authentication journey exposes the
   approved point-of-use information. The decision record shows that
   initial collection is limited to the allowlist strictly necessary
   to build, operate, and maintain a safe service. It also preserves,
   without selecting, the model-independent server-side
   preference/suppression design Oak could adopt later. Proof
   (`owner-held`): current public information and decision links;
   (`repo-safe`): exact allowlist and unknown-field rejection tests.

## Todos

- Keep the product purpose, data flow, event ceiling, identifier model,
  retention and deletion commitments, and retained official-source
  research complete and current. Link the resulting organisational
  advice and decisions in Notion and record the resulting state on
  MCP-173.
- Preserve the server-side preference/suppression design as the
  documented future-choice research. Implement it only after a later
  owner decision informed by the relevant specialist advice.
- Publish the MCP-specific privacy information and any consequent
  amendments selected through Oak's accountable processes; keep
  repository security guidance aligned with the accepted analytics
  boundary.
- Configure and verify the retention and access controls against
  controlled events.
- Implement the deletion route and repeatable runbook through TDD
  slices, then perform and evidence one live drill.
- Re-run the full October public-beta acceptance check and record the
  organisational decision on MCP-173.

## Out of scope

- The working product-analytics sink and MCP instrumentation:
  MCP-63 owns delivery and submission evidence.
- Compliance discussion transcripts, policy redlines, or named
  organisational detail in the public repository: the linked Notion
  record owns them.
- Tool arguments, responses, prompts, resource contents, searches,
  feedback, and other free text: this plan does not create a later
  approval path for content collection.
- Browser cookies, autocapture, session replay, or host-storage
  identity.
- A universal cross-system person key or routine person-level joining
  between analytics and diagnostic providers.
