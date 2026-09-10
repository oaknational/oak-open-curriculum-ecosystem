# Database Tools, oak-openapi and OCE through trust, rights and policy lenses

## Purpose and scope

This record runs fixed lenses 27-32 from the Database Tools investigation
register. It follows the four movements in OCE's
[`concept-exploration` workflow](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md#L25-L49)
and asks what an excellent OCE kit must make possible. It does not propose
repairs to Database Tools or oak-openapi, and it does not assume that their
mechanisms should survive merely because they exist.

The evidence is pinned to:

- Database Tools
  `3d1eff31a398189a839ae68bcf69990089c31bd2`;
- oak-openapi
  `2fb1383bfeaeb4986ec29cef97be133b69baeef5`;
  and
- OCE
  [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

This is a static current-state exploration. Source existence does not prove
production deployment, effective policy, lawful processing, or user outcomes.
It deliberately separates:

- **Observed:** directly present in a pinned tree;
- **Inferred:** an interpretation warranted by observations but not yet proved
  by runtime, organisational or legal evidence; and
- **Unknown:** evidence not present or not gathered in this pass.

The six local lens numbers below map in order to fixed register lenses 27-32.

| Local lens | Fixed lens | Primary distinction                                                         |
| ---------- | ---------- | --------------------------------------------------------------------------- |
| 1          | 27         | authenticated identity -> delegated capability -> referent-scoped operation |
| 2          | 28         | policy authority -> decision -> enforcement                                 |
| 3          | 29         | collected datum -> declared purpose -> dignified lifecycle                  |
| 4          | 30         | operational trace -> accountable decision -> effective remedy               |
| 5          | 31         | legal fact -> rights decision -> obligation-preserving representation       |
| 6          | 32         | credential or network key -> fair resource budget -> abuse remedy           |

---

## Lens 1: authentication and capability security (fixed lens 27)

### Governing question

Which principal can exercise which operation on which referent, through what
delegation?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools' mutation API exempts three documentation or
  health paths, verifies all other requests with an HS256 JWT, and validates
  the resulting claims before continuing
  (authentication middleware lines 7-15 and 30-74).
- **Observed:** the accepted mutation claims distinguish four application
  names and require an email only for `cat` and `studio`; they contain no
  operation, referent, purpose or delegation fields
  (JWT claim schema lines 3-24).
- **Observed:** every new mutation database connection sets the same
  `app.actor_id = 'mutation_api'`, actor type `service`, and current database
  role, rather than projecting the validated application or email into the
  database actor context
  (connection context lines 18-24).
- **Observed:** oak-openapi represents an API user with a raw key, numeric ID,
  email, name, company, rate limit and request history, and stores the record
  under a Redis key containing that bearer key
  (user shape lines 5-23,
  creation and storage lines 44-101).
- **Observed:** oak-openapi's protected procedure requires only that the key
  resolved to a user before applying a quota; its generated document declares
  one bearer scheme without operation scopes
  (protection logic lines 19-58,
  OpenAPI security scheme lines 12-26).
- **Observed:** OCE has a useful deny-by-default tool classification: only
  three named tools are public, missing or mixed security metadata requires
  authentication, and protected tools currently share the single OAuth scope
  `email`
  ([public tools and default scheme lines 24-55](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts#L24-L55),
  [deny-by-default resolution lines 47-70](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts#L47-L70),
  [single-scope policy lines 70-98](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts#L70-L98)).
- **Observed:** the OCE HTTP service authenticates MCP methods before the SDK,
  except explicit public resource reads, while every upstream API request made
  by its generated client receives the caller-supplied API key
  ([MCP routing lines 55-72 and 97-107](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/mcp-router.ts#L55-L107),
  [upstream auth middleware lines 12-33](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/middleware/auth.ts#L12-L33)).

**Inherited assumption exposed:** an authenticated application, OAuth subject
or API-key record is treated as sufficiently close to a capability. Identity
answers who presented a credential; it does not by itself answer what authority
was delegated, for which resource, for how long, or for whose benefit.

### Movement 2: define the problem space

**Problem frame:** an OCE kit for additional consumers needs a security model
that keeps principal, client, credential, delegation and capability distinct.
The decision must bind an operation to a referent and relevant context, then
carry enough delegation evidence through service-to-service calls to explain
whose authority was exercised. Success is not more authentication middleware.
It is least authority that remains intelligible through MCP, SDK, HTTP and data
boundaries, can be attenuated and revoked, and fails closed without turning an
email attribute or a long-lived shared key into ambient authority.

### Movement 3: reflect on possible explanations

**Competing explanation:** the current surfaces are principally read-only and
serve trusted internal applications or public curriculum retrieval. Uniform
authentication plus a service API key may deliberately keep provider concerns
out of downstream clients, while application identity and organisational
controls provide adequate authority outside the visible source.

**Changed assumption:** OAuth, JWT and bearer keys are credential transports,
not an authorization architecture. The OCE capability model should be chosen
from the domain operations and delegation relationships even if its first
implementation happens to use OAuth scopes or signed tokens.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** the chain authenticates at several boundaries but does not show
  end-to-end referent-scoped delegation. The mutation API loses claim identity
  at the database context, OCE uses an identity-oriented `email` scope for all
  protected tools, and its provider call uses a separate API key.
- **Inferred:** OCE's generated deny-by-default metadata is a valuable control
  to retain, but the policy vocabulary underneath it is too coarse for future
  writes, restricted delivery, administration or delegated agents.
- **Unknown:** JWT issuer and rotation practice; API-key revocation behaviour;
  production service-account topology; OAuth consent text; whether upstream
  calls can be attributed to an end principal; and future OCE write operations.

The OCE basis should be **explicit, attenuable capabilities over stable domain
operations, carried in a verifiable delegation chain**. Authentication supplies
a principal to that model; it must not substitute for it.

| Warranted investigation or proposal                                                                                                                                       | Warrant                                                                                                                    | Explicit falsifier                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Define a typed security context with principal, client, credential class, delegation chain, capability, referent, purpose, issue time, expiry and revocation state.       | Those concepts are collapsed or disappear at current boundaries.                                                           | Every foreseeable OCE operation has identical authority regardless of principal, referent, purpose, delegation or time.                           |
| Prototype deny-by-default, operation-specific capabilities whose identifiers derive from the semantic capability registry rather than from routes or tool names.          | Generated security metadata is already a useful enforcement carrier, but one `email` scope cannot express least authority. | A threat model and consumer study show that operation-specific authority cannot prevent any credible misuse and only duplicates one role.         |
| Preserve delegation across OAuth user -> OCE service -> upstream provider with an internal signed assertion or decision reference, while keeping the provider key secret. | The current provider credential identifies OCE, not visibly the initiating authority.                                      | Provider access is intentionally and provably anonymous, no consequential or metered action depends on principal identity, and no audit needs it. |
| Store only non-recoverable credential verifiers, support overlap-safe rotation and immediate revocation, and test stolen, replayed, expired and confused-deputy cases.    | Raw bearer-key lookup and ambient service credentials increase the consequence of disclosure.                              | The credentials are already hardware-bound or sender-constrained, unrecoverable at rest, short-lived and covered by equivalent executable tests.  |

**Unresolved evidence:** the real principal inventory; trust boundaries between
Oak applications; token audience and issuer validation; credential storage and
rotation operations; required referent granularity; consent and delegation UX;
and whether public access should be anonymous rather than identity-bearing.

---

## Lens 2: authorization and policy placement (fixed lens 28)

### Governing question

Are role, row, workflow and state-dependent policies aligned with competent
authority?

### Movement 1: reflect on raw observations

- **Observed:** Hasura gives the `editor` role insert, update and delete access
  to all lesson columns with empty checks and filters, while `reader`,
  `public-reader` and `published-public-reader` can select all columns with
  empty filters
  (lesson permissions lines 271-318).
- **Observed:** the internal entity-state table similarly gives `editor`
  unfiltered CRUD and `reader` unfiltered select access
  (entity-state permissions lines 4-29).
- **Observed:** lesson triggers keep the expired-or-suspended state invariant
  in the database, but skip several validation and derivation rules whenever
  `app.actor_id` is `mutation_api`, on the premise that Zod or API logic owns
  them
  (state invariant and bypass lines 6-28,
  bypassed JSON and slug logic lines 55-91).
- **Observed:** oak-openapi separates API-key authentication from a
  handler-level copyright gate implemented with committed subject, unit and
  lesson lists plus database lookups and human-readable reasons
  (temporary gate and data sources lines 1-25,
  lesson text decision lines 73-112).
- **Observed:** different handlers enforce that content policy at different
  stages: lesson summary checks before its main read, download availability is
  overwritten after projection, and one questions path filters blocked lessons
  after its query with an explicit warning about pagination
  (lesson gate lines 57-93,
  download override lines 188-200,
  post-query filtering lines 407-423).
- **Observed:** OCE's tool checker does not author policy; it reads generated
  or aggregated security metadata and permits public access only for explicit
  all-`noauth` schemes, while the generator currently assigns the same scope to
  every protected operation
  ([checker ownership lines 1-17](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts#L1-L17),
  [scope policy lines 70-98](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts#L70-L98)).

**Inherited assumption exposed:** policy can be distributed by mechanism: roles
in Hasura, invariants in triggers, authentication in middleware, content rights
in handlers and tool access in generated metadata. Distribution itself is not
the defect. The defect appears when no competent authority owns the semantic
decision and no proof shows that enforcement points agree.

### Movement 2: define the problem space

**Problem frame:** OCE needs to distinguish authentication, authorization,
workflow invariants, data validation, editorial suitability and legal delivery
rights. Each needs a named authority and a pure decision vocabulary that can be
enforced at the database, API, SDK or MCP boundary best able to prevent harm.
Success means the same request context produces the same justified outcome at
every required enforcement point, including filtering before counts and
pagination. It does not require one central policy service, and it must not put
legal or editorial authority into generated consumers.

### Movement 3: reflect on possible explanations

**Competing explanation:** broad Hasura roles may sit entirely behind trusted
service boundaries; the database/API validation split can avoid duplicate work;
static content gates can be a deliberately conservative emergency control; and
a uniform OAuth scope may be proportionate while all OCE operations are
read-only.

**Changed assumption:** policy locality should follow competent authority and
the atomicity needed for enforcement, not a universal preference for database,
middleware or policy engine. Centralised authorship and distributed enforcement
can coexist if decisions and correspondence are explicit.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** current role names, service identities, lifecycle states and
  copyright lists form several different policy systems whose agreement is not
  represented as one testable contract.
- **Inferred:** the strongest reusable ideas are the database-resident lifecycle
  invariant, fail-closed content checks and OCE's generated deny-by-default
  enforcement. Their current policy vocabularies should not define OCE's model.
- **Unknown:** production Hasura role assignment; row-level protections outside
  metadata; who can change gate lists; legal/editorial sign-off; deployment-edge
  rules; and which future operations are consequential writes.

The OCE basis should be **competent policy authority plus explicit decision and
obligation contracts, enforced at proved points**. A policy decision should at
least carry outcome, reason code, obligations, policy version and evidence
references, without exposing confidential policy facts.

| Warranted investigation or proposal                                                                                                                                                  | Warrant                                                                                                | Explicit falsifier                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Build a policy catalogue separating authorization, workflow invariant, validation, editorial suitability and legal rights, with an accountable authority for each rule family.       | Current mechanisms combine or distribute those concerns without a shared semantic map.                 | Every current and planned decision belongs unambiguously to one existing authority and no enforcement disagreement is possible.                |
| Define a total, side-effect-free decision interface over principal, delegation, operation, referent, resource state, purpose and environment, returning allow/deny plus obligations. | Role membership and authentication alone cannot express state-, purpose- or resource-dependent policy. | Domain modelling shows that every operation is governed solely by one static role and has no conditional obligations.                          |
| Compile or adapt decisions into database/API/MCP enforcement points and run cross-layer policy conformance tests, including filtered counts and pagination.                          | Handler-stage differences already change observable collection semantics.                              | A single authoritative enforcement point demonstrably mediates every access before any protected information, count or side effect is exposed. |
| Keep generated SDKs as enforcement and explanation carriers, not competent policy authors; reject generated output when required policy metadata is absent.                          | OCE's checker already reads rather than invents policy, but its generated default is coarse.           | Consumers must independently determine rights because the provider cannot expose a stable decision contract without leaking protected facts.   |

**Unresolved evidence:** role-to-human and role-to-service mappings; policy
change governance; row-level production tests; ordering of every gate relative
to query, cache, count and export; emergency override controls; and a catalogue
of decisions that must remain provider-owned.

---

## Lens 3: privacy, retention and data dignity (fixed lens 29)

### Governing question

What person-linked data exists, for what purpose, lifetime, access, correction
and disposal?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools requires an email claim for two mutation clients,
  but its database actor context records the common mutation service rather than
  that email or application
  (email-bearing claims lines 3-24,
  database actor context lines 18-24).
- **Observed:** the Database Tools audit helper copies every field for inserts
  and deletes and old/new values for every changed field on updates; the audit
  table itself defines no retention, purpose or subject-reference fields
  (audit table lines 1-14,
  change capture lines 79-114).
- **Observed:** oak-openapi stores email, name, company, a raw bearer key,
  request count and last-request timestamp in the user record; the shown writes
  set Redis values without an expiry argument
  (user fields lines 5-23,
  user and email-index writes lines 44-101,
  usage updates lines 104-121).
- **Observed:** in production, oak-openapi logs user ID, full request URL and
  query string, while its PostHog event can include serialised arguments, query
  parameters, user ID and a stable fingerprint made from a truncated SHA-256
  digest plus the key's last four characters
  (request logging lines 53-63,
  fingerprint lines 130-155,
  event properties lines 158-188).
- **Observed:** OCE sets an opaque stable Clerk user ID on the Sentry request
  scope and explicitly records as unresolved whether that identifier may pass
  through the redaction barrier to future sinks
  ([identity privacy note and implementation lines 139-170](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts#L139-L170)).
- **Observed:** OCE fully redacts authorization, cookie and token headers and
  partially redacts IP-like headers in one logging path; its shared Sentry
  barrier also redacts URL, request data, query string, cookies, environment and
  headers before emission
  ([header policy lines 10-68](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/logging/header-redaction.ts#L10-L68),
  [Sentry request redaction lines 15-49](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/libs/sentry-node/src/runtime-redaction.ts#L15-L49)).
- **Observed:** OCE governance says the redaction barrier is binding but records
  arbitrary email-like value scrubbing as debt, while product strategy names a
  detailed DPIA as a production blocker and keeps Children's Code applicability
  conditional on the teacher-only audience decision
  ([privacy posture lines 73-119](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/governance/safety-and-security.md#L73-L119),
  [release gates lines 85-100](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L85-L100)).

**Inherited assumption exposed:** privacy is often treated as credential
redaction plus avoidance of obvious PII. Stable pseudonyms, URLs, curriculum
queries, request timing and linked organisational details can still reveal a
person's activity or context. Retention and correction cannot be recovered from
scrubbing at the final telemetry sink.

### Movement 2: define the problem space

**Problem frame:** OCE needs a declared lifecycle for every person-linked or
linkable datum: purpose, lawful basis, minimisation, access, processors,
retention, correction, deletion and proof of disposal. That lifecycle must cover
derived identifiers and content-bearing prompts or search arguments, not just
account records. Data dignity adds a stricter product test: do not observe,
classify or retain a teacher's or pupil-related context merely because a logging
or analytics library makes it easy. Success is useful, explainable measurement
with the minimum linkage needed for a named public-service purpose.

### Movement 3: reflect on possible explanations

**Competing explanation:** API registrants are professional or organisational
users rather than pupils; usage telemetry is necessary to operate and improve a
public service; pseudonymous identifiers are preferable to email; and OCE's
non-bypassable redaction barrier is materially stronger than ad hoc logging.

**Changed assumption:** pseudonymisation reduces exposure but does not remove
data-protection obligations when activity remains linkable. Conversely, dignity
does not require eliminating observability: purpose-limited aggregates and
short-lived diagnostic events can be both respectful and operationally useful.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** the upstream chain can link identity, credential and detailed
  request intent across Redis, logs and analytics, while its visible storage
  paths do not express a full lifecycle contract.
- **Inferred:** OCE has a valuable sink-boundary redaction architecture and an
  unusually explicit record of unresolved identity policy. Excellence requires
  extending that discipline upstream to collection and purpose, not merely
  making the scrubber broader.
- **Unknown:** privacy notices and consent; processor retention settings;
  production log sampling; actual query contents; data-subject access and
  correction routes; deletion jobs; legal holds; audience composition; and DPIA
  conclusions.

The OCE basis should be **purpose-bound data minimisation with executable
lifecycle obligations and human remedy**, backed by redaction at every egress
rather than dependent on it.

| Warranted investigation or proposal                                                                                                                                          | Warrant                                                                                                          | Explicit falsifier                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Produce a field-level data map across identity provider, OCE, upstream API, logs, traces, analytics and support systems, including derived identifiers and every processor.  | The same activity can be represented by email, user ID, raw key, fingerprint, URL, query and timing.             | A verified runtime flow shows that OCE processes no person-linked or linkable datum beyond an ephemeral authentication decision.              |
| Make purpose and retention machine-readable policy attached to each event class; reject undeclared fields and continuously prove expiry or aggregation jobs.                 | Current source types describe event shape, not why or how long each field may exist.                             | Existing platform controls already enforce field-specific purposes, retention and deletion with exported evidence and no application gaps.    |
| Use allowlisted, content-free operational telemetry by default; require an explicit reviewed purpose for arguments or query text and prefer short-lived rotating pseudonyms. | Curriculum searches and prompts can carry contextual information that key-name redaction cannot reliably detect. | Empirical sampling under an approved protocol proves all such values are non-personal, essential, proportionate and already tightly retained. |
| Design subject access, correction, erasure and objection as first-class workflows, including propagated deletion and an auditable lawful-retention exception.                | Neither sink redaction nor an append-only audit store provides a person with remedy.                             | The responsible privacy authority confirms no data-subject right applies to any stored datum and documents the lawful reason for each case.   |

**Unresolved evidence:** approved data inventory; controller/processor roles;
retention schedules and deletion verification; privacy notice surfaces; support
workflows; analytics sampling and dashboards; DPIA and Children's Code rulings;
and research with teachers about acceptable observation and explanation.

---

## Lens 4: auditability, accountability and remedy (fixed lens 30)

### Governing question

Can a consequential decision be reconstructed, challenged, corrected and
attributed?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools defines an audit record with table, primary key,
  operation, full change payload, application, actor role, actor type and time;
  its actor extractor reads Hasura application and role context, manually set
  application context, or the database role fallback
  (audit record lines 1-14,
  actor extraction lines 20-45).
- **Observed:** trigger migrations attach that generic logger to inserts,
  updates and deletes on lessons and many other public curriculum tables
  (lesson trigger lines 51-55,
  questions through TPC triggers lines 117-151).
- **Observed:** the mutation API gives all of those database writes the common
  `mutation_api` actor, while Hasura metadata lets `editor` insert, select,
  update and delete every audit-log column or row with empty conditions
  (mutation actor lines 18-24,
  audit-log permissions lines 4-29).
- **Observed:** oak-openapi emits PostHog events around procedures with API
  key, arguments, endpoint, query, user, duration, success and error code, but
  those event fields do not include a policy version, delegation, source-data
  version, correction link or responsible decision authority
  (analytics envelope lines 109-168).
- **Observed:** OCE generates or reuses a correlation ID, returns it in a
  response header, tags Sentry and logs request completion with status and
  duration using redacted headers
  ([correlation lifecycle lines 100-151](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.ts#L100-L151)).
- **Observed:** OCE asks repository-owned runtime wiring to provide a structured
  tool logger but lets direct SDK callers fall back to a no-op logger; its
  content-rights error classification also acknowledges that matching
  `data.cause` for the word `blocked` is brittle
  ([optional logger contract lines 66-73](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts#L66-L73),
  [classification caveat lines 59-86](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts#L59-L86)).

**Inherited assumption exposed:** change history, analytics and observability are
often grouped as "audit". They answer different questions. A trace can locate a
failure, and a row diff can show a mutation, without explaining the authority,
policy, evidence or remedy for a consequential decision.

### Movement 2: define the problem space

**Problem frame:** OCE needs proportionate accountability for decisions that
publish, withhold, transform, rank, export or retire curriculum. Reconstruction
requires the initiating authority and delegation, semantic operation, referent
and version, policy and evidence versions, decision, obligations, effect and
correlation. Remedy requires a supported challenge, correction, supersession,
replay and notification path. Success is a privacy-minimised decision record
that remains trustworthy enough to establish what happened, while operational
telemetry remains separately optimised for diagnosis.

### Movement 3: reflect on possible explanations

**Competing explanation:** curriculum writes may be made only by trusted staff,
with approval and remedy handled in editorial systems or organisational process
outside these repositories. A full database change log plus support correlation
could then be proportionate, and making every read an immutable decision record
would create privacy and operational harm.

**Changed assumption:** accountability does not mean recording every payload or
making every log immutable. It means retaining the smallest trustworthy proof
needed for the consequence and connecting it to a real route for correction.
Some low-consequence reads need only aggregate operations evidence; policy
denials and publication changes require more.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** Database Tools has broad mutation coverage but weak end-principal
  attribution for the mutation API and no visible tamper boundary against an
  editor role. The record proves row changes better than decision legitimacy.
- **Inferred:** oak-openapi analytics and OCE correlation are useful operational
  evidence, but neither is a complete accountability record. OCE's error
  classification can also lose the upstream decision's structured reason.
- **Unknown:** external editorial approvals; database append-only controls;
  production log immutability and retention; incident/support processes;
  correction SLAs; notification of downstream consumers; and which decisions
  Oak classifies as consequential.

The OCE basis should be **consequence-proportionate decision records plus
first-class correction and supersession**, explicitly separate from analytics
and diagnostics.

| Warranted investigation or proposal                                                                                                                                                   | Warrant                                                                                                              | Explicit falsifier                                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Classify OCE operations by consequence and define the minimum reconstruction and remedy evidence for each class.                                                                      | Universal full-payload logging is neither necessary nor privacy-safe, while some decisions need more than telemetry. | Every operation is demonstrably consequence-free, or one identical evidence set is proven both necessary and proportionate for every operation. |
| Introduce an append-only, tamper-evident decision journal for consequential outcomes containing stable decision and policy IDs, delegation, referent/version, reason and obligations. | Current audit records can be edited by a role and current telemetry omits decision authority and policy version.     | Existing controls prove equivalent immutability, end-principal attribution and semantic reconstruction across the complete chain.               |
| Make correction, withdrawal, supersession, replay and affected-consumer notification explicit domain workflows, each linked to the original decision.                                 | Detecting or explaining a bad decision does not itself repair derived exports, caches or consumer copies.            | All effects are strictly ephemeral and recomputed from corrected authority before any consumer can rely on them.                                |
| Propagate one opaque correlation and decision reference across MCP, SDK, upstream API and data boundary, with access-controlled joining rather than duplicated personal identifiers.  | OCE correlation is local while database writes and upstream events use different actor identities.                   | A trace exercise can already reconstruct a representative cross-system decision without heuristic timestamp or payload matching.                |

**Unresolved evidence:** consequential-decision inventory; approval systems;
audit database privileges in production; cryptographic or storage immutability;
cross-system trace propagation; correction and takedown workflows; downstream
cache/export invalidation; and user research on useful explanations and appeals.

---

## Lens 5: legal, licensing and content restrictions (fixed lens 31)

### Governing question

How do rights and restrictions survive mutation, projection, export and
retirement?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools models third-party contracts with identity,
  signing side, restrictions, effective and end dates, territory, source URL,
  contract object, lifecycle state, usage requirements, restriction level and
  change log
  (TPC contract schema lines 7-31).
- **Observed:** database functions derive a media restriction level from
  licence metadata and published contracts using an explicit priority order,
  aggregate contract usage requirements into lesson feature flags, and
  recalculate media, work and lesson data when a published contract changes
  (restriction derivation lines 7-44,
  lesson aggregation lines 8-24,
  contract propagation lines 4-20).
- **Observed:** the lesson OpenAPI materialized view projects copyright notices
  and content guidance, derives `hasDownloadableResources` primarily from asset
  presence plus one copyright condition, and emits TPC work attribution and TPC
  media metadata rather than the full contract record
  (copyright and guidance projection lines 60-99,
  availability and TPC projection lines 113-160).
- **Observed:** oak-openapi labels its query gate as a short-term response to an
  incomplete licence-data audit and combines committed allow/block lists with
  subject and unit logic; it can later overwrite a projected download boolean
  because database restriction flags are described as incomplete
  (gate rationale and lists lines 1-25,
  download override lines 188-200).
- **Observed:** asset endpoint descriptions make a global OGL-compatible claim
  and require attribution, while question mapping has disabled its licence
  output pending an answer for unknown or uncategorised licences
  (asset terms lines 815-840,
  disabled question licence lines 107-120).
- **Observed:** OCE defines machine-readable source, licence URL and attribution
  note constants, but classifies an upstream content restriction by inspecting a
  400 response's undocumented `data.cause` string for `blocked`
  ([Oak API attribution lines 23-38](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts#L23-L38),
  [blocked-response classification lines 59-86](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts#L59-L86)).
- **Observed:** OCE strategy states that AI surfaces must use the open subset
  with TPC filtered out and explicitly says that filter is not yet proven to the
  required public-release bar
  ([TPC release constraint lines 70-76](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L70-L76)).

**Inherited assumption exposed:** "open", "copyright", "downloadable",
"attribution required" and "available" can look like interchangeable booleans.
They are not. A contract fact can govern a particular work, use, territory,
time, audience and delivery mode while imposing an obligation rather than a
denial. Physical asset presence is not permission.

### Movement 2: define the problem space

**Problem frame:** OCE must consume rights decisions from the competent Oak
authority, preserve their meaning through projection, indexing, caching,
generation and export, and enforce obligations at the capability that performs
the use. It must not ingest confidential contracts or become the legal policy
author. Success is a typed rights envelope for a versioned resource and intended
use, with an allow/deny/conditional decision, safe reason, obligations,
provenance, validity and policy version. Unknown rights must fail safely without
being silently relabelled as absent content or an implementation error.

### Movement 3: reflect on possible explanations

**Competing explanation:** the static gate is an intentionally conservative
stopgap during an audit, the API exposes only a legally approved homogeneous
open subset, and OCE should trust that provider boundary rather than duplicate
contract logic. Global terms plus item attribution may be sufficient if that
homogeneity is proved and continuously maintained.

**Changed assumption:** OCE should not recreate Database Tools' contract model,
but it does need more than a generic licence constant. The durable consumer
concept is a provider-signed rights decision and its obligations, scoped to a
resource version and capability. Contract administration remains upstream.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** Database Tools contains materially richer rights facts than the
  downstream chain's booleans, lists, endpoint prose and string-matched errors.
  Each projection loses some basis, scope or explanation.
- **Inferred:** the valuable concepts to preserve are contract-aware derivation,
  conservative denial, attribution and update propagation. The static list
  topology and global claims are implementation contingencies, not a sound OCE
  basis.
- **Unknown:** legally authoritative field meanings; contract confidentiality;
  time and territory evaluation; exact export terms; rights at question/image/
  clip granularity; revocation latency; cached-copy obligations; and live filter
  conformance.

The OCE basis should be **versioned rights decisions and obligations attached to
every deliverable representation**, with upstream Oak as the policy authority
and OCE as a strict, testable carrier and enforcement layer.

| Warranted investigation or proposal                                                                                                                                                             | Warrant                                                                                                                | Explicit falsifier                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Agree a non-confidential rights-decision contract: resource/version, requested use, outcome, safe reason code, obligations, attribution, validity interval, territory class and policy version. | Rich upstream contract facts currently collapse into downstream booleans and prose.                                    | Legal authority proves the served corpus is permanently homogeneous across all resources, uses, times and territories with one obligation set.        |
| Treat delivery eligibility as a capability decision, distinct from physical availability, and apply it before search, count, pagination, asset signing and export assembly.                     | Current gates can overwrite availability and filter after a query, changing collection semantics.                      | End-to-end tests prove every current and planned representation is already filtered once, before any observable collection metadata or URL.           |
| Carry rights envelopes or decision references through projections, generated schemas, search documents, caches and export manifests, with correspondence tests at each transformation.          | OCE attribution is machine-readable, while content denial still depends on undocumented response text.                 | A single opaque provider response can prove identical lawful behaviour and obligations across every derivative without retained decision data.        |
| Model rights change and retirement as events that identify affected artefacts and trigger cache invalidation, URL revocation, re-export and consumer notification.                              | Contract changes already propagate within Database Tools, but downstream copies and signed URLs form separate effects. | Rights are legally irrevocable for the complete lifetime of every delivered artefact and no downstream cache, export or URL can outlive source state. |

**Unresolved evidence:** legal vocabulary and authority; TPC audit results;
contract-to-resource lineage; projection correspondence; asset-signing and cache
lifetimes; bulk-export manifests; attribution rendering by MCP hosts; denial
explanation requirements; and a runtime corpus test against the approved open
subset.

---

## Lens 6: API-key, rate-limit and abuse policy (fixed lens 32)

### Governing question

Are identity, quotas and remedies fair, explicit, privacy-preserving and fit for
public reuse?

### Movement 1: reflect on raw observations

- **Observed:** the Database Tools mutation middleware covers public-path
  selection, JWT verification and claim validation, but the policy visible in
  that boundary does not include quotas, resource costs or abuse outcomes
  (mutation auth middleware lines 7-79).
- **Observed:** oak-openapi uses an Upstash sliding window of 1,000 requests per
  hour by default, permits a custom per-user number, keys the counter by the raw
  API key, and lets `noCost` operations inspect remaining quota without
  decrementing it
  (rate profiles lines 5-22,
  keyed limit logic lines 46-80).
- **Observed:** a user with rate limit zero or the configured Oak auth token is
  unlimited; on exhaustion the API emits `X-RateLimit-*` and custom
  `X-Retry-After` headers and logs the user's raw key
  (unlimited policy lines 85-97,
  limit response and logging lines 34-55).
- **Observed:** every OCE MCP tool invocation is wired with the same
  environment-provided upstream API key, and the request-scoped executor creates
  its provider client from that key
  ([tool handler wiring lines 210-221](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/handlers.ts#L210-L221),
  [executor creation lines 99-112](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/tool-executor-factory.ts#L99-L112)).
- **Observed:** OCE's HTTP service defines separate per-IP profiles for MCP,
  OAuth, metadata and asset routes, uses standard draft-7 rate-limit headers,
  and explicitly treats its in-memory serverless counters as probabilistic
  defence in depth behind an authoritative CDN limiter
  ([route profiles lines 1-26 and 79-93](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts#L1-L26),
  [OAuth and metadata profiles lines 29-77](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts#L29-L77),
  [asset replay risk lines 79-93](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limit-profiles.ts#L79-L93),
  [factory and limitations lines 128-168](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-curriculum-mcp-streamable-http/src/rate-limiting/rate-limiter-factory.ts#L128-L168)).
- **Observed:** the OCE SDK also applies a configured minimum interval between
  requests and retries 429, 503 and network failures with exponential backoff,
  but the retry loop calculates delay only from local configuration rather than
  the response's reset or retry header
  ([client pacing lines 31-53](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/middleware/rate-limit.ts#L31-L53),
  [retry decision and loop lines 44-119](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/middleware/retry.ts#L44-L119)).

**Inherited assumption exposed:** a credential string or network address is a
fair resource-allocation identity, and one request is a stable cost unit. Shared
NATs, rotating addresses, aggregated MCP users, bulk endpoints, expensive search
and cheap metadata violate those assumptions in different directions.

### Movement 2: define the problem space

**Problem frame:** OCE needs a public-resource policy that protects service
availability and people without making identity collection the price of access.
Budgets should follow the smallest privacy-preserving subject that can be held
responsible, account for semantic operation cost and delegated fan-out, and be
communicated with standard recovery information. Abuse handling must distinguish
overload, malfunction and adversarial behaviour, support credential rotation or
revocation, and provide an appeal or support route for false positives. Success
is fair degradation and recoverability, not merely a counter that returns 429.

### Movement 3: reflect on possible explanations

**Competing explanation:** API keys and fixed request counts are a simple,
predictable public API contract; oak-openapi supports custom limits and a
distributed sliding window; OCE adds route-specific per-IP defence and an edge
authority; and more elaborate cost models could be harder for consumers to
reason about than the service they protect.

**Changed assumption:** simplicity belongs in the public contract, not
necessarily in a single internal counter. A clear budget can still be calculated
from operation cost, concurrency and delegation. Equally, rate limiting is only
one abuse control and should not become a covert identity or surveillance
system.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** OCE currently has two independent scarcity identities: client IP
  at its HTTP edge and one shared upstream API key. A single end user can consume
  the shared provider budget, while unrelated users can be combined by NAT or
  serverless topology.
- **Inferred:** OCE's route profiles, standard headers, explicit edge authority
  and documented limitations are strong concepts to preserve. The upstream raw
  key, custom headers, local retry timing and one-request-one-unit assumption are
  weak bases for a reusable kit.
- **Unknown:** CDN production rules; actual operation cost distribution;
  legitimate school-network concurrency; abuse history; API-key issue,
  revocation and support processes; upstream quota allocation; and service
  objectives under overload.

The OCE basis should be **privacy-preserving, capability- and cost-aware resource
budgets with explicit backpressure and remedy**, coordinated across consumer,
OCE edge and provider.

| Warranted investigation or proposal                                                                                                                                                          | Warrant                                                                                                               | Explicit falsifier                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Measure cost and fan-out by semantic operation, then define documented budget classes for metadata, retrieval, search, export and asset delivery rather than one request unit.               | Current operations can have very different provider, compute and bandwidth costs.                                     | Production measurements show bounded, equivalent resource cost and fan-out for every operation at relevant percentiles.                                         |
| Separate anonymous edge protection, authenticated client budget and delegated end-principal budget; compose them without transmitting raw identity or credentials between layers.            | Per-IP OCE limits and a shared upstream key protect different boundaries and create different fairness failures.      | One current bucket demonstrably identifies the accountable consumer fairly across NAT, multi-user agents, rotation and every deployment topology.               |
| Adopt non-recoverable credential verification, explicit issue/rotate/revoke state, no credential-derived logs, and standard `RateLimit` plus `Retry-After` semantics with clock-safe values. | The provider stores and can log the bearer key, while its retry header is custom and OCE separately interprets quota. | Existing credentials are already non-recoverable, sender-constrained and never emitted, and all supported clients recover correctly from standards-based tests. |
| Coordinate retries with server guidance, jitter, concurrency limits and a shared retry budget; test retry storms and signed-asset replay across horizontally scaled instances.               | Fixed local backoff and replayable asset URLs can amplify a scarce shared provider budget.                            | Fault injection proves current clients converge without synchronisation or excess upstream load under 429, 503, timeout and replay scenarios.                   |
| Define abuse classification, progressive response, safe explanation, support/appeal and emergency override policy, and publish the user-visible parts with service objectives.               | A fair public service needs remedy for false positives as well as protection from deliberate harm.                    | Evidence shows every denial is mechanically unambiguous, never affects legitimate users, and has no consequence requiring explanation or review.                |

**Unresolved evidence:** production edge configuration; per-operation resource
profiles; school and agent concurrency; upstream headers and clock semantics;
credential administration; signed-URL lifetime and replay volume; abuse and
incident evidence; false-positive handling; and the public service-level and
appeal contract.

---

## Cross-lens conclusion

Across these six lenses, the recurring negative space is not a missing product
or middleware. It is the disappearance of semantic authority at boundaries:

- identity survives while delegation and capability disappear;
- enforcement survives while policy ownership and version disappear;
- identifiers survive while purpose, lifetime and correction disappear;
- logs survive while accountable decisions and remedy disappear;
- availability survives while rights basis and obligations disappear; and
- counters survive while cost, fairness and appeal disappear.

The real value in the existing systems is substantial: fail-closed checks,
database-resident invariants, contract-aware restriction propagation,
machine-readable attribution, correlation, egress redaction, generated
deny-by-default security and explicit rate-limit layers. OCE should preserve
those intents while replacing incidental topology with a smaller basis set:

1. **Semantic operation and referent identity.** Every protected action names
   what it does and to what stable domain object or collection.
2. **Principal, delegation and capability.** Credentials authenticate; explicit
   capabilities authorize through a traceable, attenuable delegation chain.
3. **Competent policy authority and versioned decision.** The owner decides;
   typed outcomes and obligations travel to proved enforcement points.
4. **Purpose-bound data lifecycle.** Collection, linkage, retention, access,
   correction and disposal are policy, not sink configuration.
5. **Decision provenance and remedy.** Consequential outcomes can be explained,
   challenged, corrected, superseded and propagated.
6. **Rights envelope.** Permission, restriction and attribution remain scoped to
   resource version and intended use through every representation.
7. **Fair resource budget.** Backpressure reflects cost and delegation while
   minimising identity and providing recovery and appeal.

This basis is smaller than the observed mechanism estate but stricter in every
dimension that matters. Its decisive validation is not architectural elegance:
it is whether independent OCE consumers can obtain the same lawful, safe,
explainable and reliable outcome without learning or reproducing provider
internals.
