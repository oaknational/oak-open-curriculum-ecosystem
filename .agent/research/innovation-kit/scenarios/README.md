# Innovation Kit worked analytical scenarios

- **Status:** non-normative examples and counter-instances
- **Owns:** situated demonstrations of how the proposed definition exposes obligations, omissions,
  difficult states and falsifiers
- **Does not own:** capability rules, profile presets, current implementation claims or product
  commitments

Scenarios reference the [definition](../definition/README.md). If an example appears to require a
new rule, that rule must be proposed in its legitimate definition document rather than smuggled in
through the example.

## Historical difficult-case specimens

The relocated web-app deconstruction preserves six high-value journey traces. They are not Kit
modules and do not define future topology.

| Specimen | Enduring outcome and difficult knowledge |
| --- | --- |
| [Teacher discovery to resource download](../web-app-deconstruction/docs/current-state/journeys/teacher-discovery-to-download.md) | Curriculum-context discovery, rights restrictions, live file existence, dependency degradation, non-critical side effects and the distinction between clicking, transferring and receiving a usable archive |
| [Account to saved content](../web-app-deconstruction/docs/current-state/journeys/account-to-saved-content.md) | Explicit account boundary, safe return, optimistic rollback, cross-tab reconciliation, isolation, retired content and provisioning seams |
| [Pupil lesson to results](../web-app-deconstruction/docs/current-state/journeys/pupil-lesson-to-results.md) | Non-linear session progress, activity variants, partial correctness, feedback, resume, provider writes, duplicate/reordered effects and different teacher/pupil interpretations |
| [Classroom assignment to submission](../web-app-deconstruction/docs/current-state/journeys/classroom-assignment-to-submission.md) | Distinct teacher/pupil authority, embedded-host boundaries, progress ordering, provider identity, silent sync failure and continued access |
| [Curriculum export](../web-app-deconstruction/docs/current-state/journeys/curriculum-export.md) | Accurate editable accessible artifacts, source/template freshness, file integrity, cache identity, synchronous capacity and downloaded-versus-usable outcome |
| [Editorial publish to page](../web-app-deconstruction/docs/current-state/journeys/editorial-publish-to-page.md) | Authorised revision, draft/public separation, source/query/runtime correspondence, partial outage, metadata identity and deployed-page assurance |

## Scenario A — stateless public curriculum-relationship explainer

**Proposition:** a teacher can inspect relationships from one identified curriculum release and
understand what the view shows and does not show.

**Semantic core:** curriculum identities and relationship meanings; source/release provenance;
selection and explanation behaviour; equivalent accessible representation; bounded comprehension
or utility claim.

**Legitimately absent in local exploration:** user accounts, mutable authoritative state,
transactional persistence, migrations and sustained public operations. The absence is valid because
the proposition is read-only and private, not because those capabilities are low priority.

**Activated for a public demonstration:** public accessibility and security, release/freshness
identity, rights/attribution, resource limits, observability, humane degradation, correction route,
operational owner and retirement. A managed graph or search binding activates only if the real
composition needs it.

**Difficult states:** missing relation, withdrawn curriculum item, incomplete projection, stale
release, unavailable derived service, dense visual layout and non-visual traversal.

**What it tests:** a small profile can be a complete product promise without a database; changing
from an in-process to managed projection can be elevation if meaning, interaction truth and claim
survive.

**Falsifier:** the public path changes relationship meaning or accessible outcome, or the local
experience staged completeness that the real projection cannot supply.

## Scenario B — stateful collaborative planning collection

**Proposition:** an educator can create and share a curriculum-linked planning collection with
authorised collaborators and later recover the same authoritative state.

**Capabilities activated:** identity/session, authorisation and delegation, tenancy/isolation,
authoritative transactional state, typed domain access, concurrency, schema/semantic migration,
audit, privacy/retention, backup/restore, observability, support and provider exit.

**Semantic core:** collection/member identity, curriculum references, ownership and permission,
ordering, version/conflict meaning, save acknowledgement, deletion/retention and collaboration
outcomes.

**Possible bindings:** local SQLite or in-memory fixtures may support deterministic development;
managed PostgreSQL such as Neon may support a public service. The contract is not “uses Neon.” It
is the state, authority, transition, recovery and exit promise.

**Difficult states:** two editors update concurrently; duplicate request; invite revoked while
open; referenced curriculum is withdrawn; migration fails after partial work; provider is
unavailable; restore point predates a rights correction; a collaborator loses access but cached
views remain.

**What it tests:** the ordinary foundations belong inside the complete product loop; an ORM can
improve typed access but cannot decide domain migration or acknowledgement truth.

**Falsifier:** local and public profiles need different collection identity or success semantics,
or export/restore cannot preserve authority and history.

## Scenario C — agent-mediated capability in an external host

**Proposition:** a practitioner asks an external agent host to explore Oak curriculum capability
over several turns and receives source-grounded, correctable results.

**Control boundary:** the Kit may control MCP tools/resources, schemas, provenance and server-side
operations while the external host controls conversation UI, model choice, some memory, consent
surfaces and rendering.

**Capabilities activated:** public capability contract, principal/session boundary, tool
authorisation, prompt/tool injection resistance, provenance, host compatibility, bounded result
envelopes, observability/redaction, correction, rate/resource protection and evidence about the
parts the Kit can observe.

**Difficult states:** host omits a citation; model invents a conclusion beyond tool evidence;
conversation memory retains withdrawn content; tool response is truncated; user revokes access;
host retries a consequential operation; two host surfaces render the same structured result
differently.

**What it tests:** product boundary and control boundary differ; the Kit must state the quality it
can guarantee and refuse to claim end-to-end outcomes it cannot observe.

**Falsifier:** the contract assumes ownership of host interaction or memory, or provider-neutral
types erase a host-specific limitation that changes the human claim.

## Scenario D — evidence-intensive curriculum export service

**Proposition:** a teacher receives an identified, editable, accessible artifact generated from a
known curriculum release, and the service can demonstrate what was produced and repair a failed
generation.

**Capabilities activated:** source/release identity, transformation definition, document and asset
lifecycle, rights/attribution, durable work where generation is asynchronous, integrity,
object/delivery semantics, cache identity, observability, capacity, support, correction and
retirement.

**Difficult states:** source and template versions diverge; one file in an archive is missing;
generation succeeds but delivery expires; a retry duplicates an artifact; document accessibility
fails; upstream returns not-found for an outage; a correction must invalidate cached exports; the
teacher opens an older saved copy.

**What it tests:** success stages are distinct—accepted, generated, stored, delivered, opened and
useful—and derived artifacts need authority, loss, release and correction contracts.

**Falsifier:** a valid file is treated as evidence of teacher utility, or the service cannot trace
an artifact to source and transformation after a correction.

## Scenario E — provider change, offline continuity and retirement

**Proposition:** an existing public experience changes a critical provider, offers a bounded
offline representation and later retires without losing authoritative meaning or leaving stale
claims active.

**Capabilities activated:** provider export/import or deterministic rebuild, compatibility and
cutover, dual-run/reconciliation where necessary, offline packaging, provenance/freshness,
observability continuity, support communication, deprecation, archival preservation, deletion and
non-resurrection.

**Difficult states:** provider types do not map exactly; clocks and ordering differ; export omits
metadata; traffic sees mixed epochs; offline pack becomes stale; correction occurs during cutover;
old links and agent indexes continue to surface retired guidance; some data must be preserved while
personal data must be erased.

**What it tests:** provider independence is a world-return claim, preservation differs from backup,
and retirement is part of the present architecture.

**Falsifier:** the interface remains stable while state, operational history or correction is
provider-captive, or retirement removes the service but not its authority from ordinary discovery.

## Coverage use

Together the scenarios vary state, audience, rights, control boundary, evidence class, provider
dependence and lifespan. A proposed contract or profile that fits only one should remain local or
narrow its generality claim. Additional scenarios should be added only when they expose a new
material seam, difficult state or counter-instance—not to make the catalogue look complete.
