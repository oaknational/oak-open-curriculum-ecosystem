# Governance-plane projects: direction of travel

> Companion to [`repos-as-governance-planes.md`](./repos-as-governance-planes.md). That note is a **landscape snapshot**. This note is a **trajectory** read of the same 15 projects: where each is moving in 2026 based on roadmaps, RFC/SEP records, and recent release notes — and what each direction signal implies for this repo.

## Method and evidence ladder

This note prefers **roadmap and RFC/SEP/ADR records** when they exist, falls back to **release notes and official announcements** otherwise, and explicitly flags **trajectory weak** when neither is present. Each project section follows a fixed shape: trajectory paragraph → one to three cited primary-source bullets → a single repo-local implication. Cross-project trajectory patterns and routing recommendations follow at the end.

External-concept descriptions, repo-local mechanism references, inferences, and recommendations are kept distinct in every paragraph.

## A. Agent-native frameworks

### LangGraph

LangGraph's published direction is **deeper investment in the durable-execution + observability pair** (durable execution, human-in-the-loop, comprehensive memory, LangSmith observability, production deployment) rather than feature-breadth. Recent releases keep tightening callback lifecycle hooks, OpenTelemetry interop, and checkpoint-security guardrails (e.g. `LANGGRAPH_STRICT_MSGPACK` documented for checkpoint security in v4.0.2). [^lg-overview] [^lg-releases]

- LangChain's official LangGraph overview lists five "core benefits" — durable execution, human-in-the-loop, comprehensive memory, LangSmith debugging, production-ready deployment — in that order, signalling that durability and observability are framed as the load-bearing axes. [^lg-overview]
- April 2026 releases prioritise lifecycle callback handlers (`feat(langgraph): add graph lifecycle callback handlers`, #7429) and remove a strict type check that broke OpenTelemetry instrumentation (#7544), evidencing a continuous push to make observability robust. [^lg-releases]
- v4.0.2 of `langgraph-checkpoint` documents `LANGGRAPH_STRICT_MSGPACK` for checkpoint security (#7517), evidencing trajectory toward hardened persistence. [^lg-releases]

**Repo-local implication.** This repo's existing reviewer-systems and continuity lanes already invest in similar primitives (durable transcripts, lifecycle hooks). LangGraph's direction is convergent and worth tracking as **prior art for callback contracts and checkpoint hardening** — not as a runtime to adopt.

### Microsoft Agent Framework

Agent Framework's trajectory is **enterprise stabilisation around an explicit workflow contract**: `1.0.0` GA (2026-04-02) consolidated a graph-based engine of executors/edges/events with checkpointing/hydration; immediate post-GA (`1.0.1`) hardened the persistent execution surface with restricted-unpickler checkpoint deserialisation. [^maf-rel-100] [^maf-rel-101]

- The `1.0.0` GA notes formally promote `agent-framework`/`agent-framework-core`/`agent-framework-openai`/`agent-framework-foundry` to Production/Stable and pin the dependency floor at `>=1.0.0,<2`, evidencing a deliberate API-stability commitment. [^maf-rel-100]
- `1.0.1` (2026-04-09) flags **security hardening for `FileCheckpointStorage`**: checkpoint deserialisation now flows through a restricted unpickler with an explicit allow-list (`allowed_checkpoint_types`), evidencing a treat-checkpoints-as-untrusted-by-default posture. [^maf-rel-101]
- The same week's .NET releases add **skill-as-class** discovery and reflection (`Support reflection for discovery of resources and scripts in class-based skills`, #5183) and **AG-UI** workflow handoff samples, evidencing parallel investment in declarative skill packaging and HITL handoff UI. [^maf-rel-net]

**Repo-local implication.** The "treat persisted state as untrusted by default" decision is directly relevant to any agent transcript or checkpoint surface this repo grows. Watch as a candidate **pattern source for restricted-deserialiser policy** rather than as a framework to adopt.

### OpenAI Agents SDK (Python)

The SDK's most significant 2026 direction signal is the **Sandbox Agents** beta (`v0.14.0`): `SandboxAgent`, `Manifest`, `SandboxRunConfig`, sandbox-native capabilities, snapshots, and resume — i.e. a first-class **persistent isolated workspace contract** added on top of the existing `Agent`/`Runner` flow. [^oai-sandbox]

- The `v0.14.0` release notes describe the Manifest as "a fresh-workspace contract for files, directories, local files, local directories, Git repos, environment, users, groups, and mounts" and add built-in capabilities for shell/filesystem/image/skills/memory/compaction. [^oai-sandbox]
- Subsequent patch releases (`0.14.1`, `0.14.2`) keep tightening the same surface: `feat: support sandbox extra path grants` (#2920), `fix: trust filesystem permissions for Vercel roots` (#2910), `fix: loosen sandbox compaction model parsing` (#2930). [^oai-rel]
- The release also records `fix: stop streamed tool execution after known input guardrail tripwire` (#2688), evidencing tightening of the supervision-before-side-effects boundary. [^oai-rel]

**Repo-local implication.** The Manifest concept — a declarative workspace contract bound to a run — is a strong **prior art** for the kind of machine-readable contribution contract this repo's governance lane keeps recommending. Worth a future deep-dive comparison against ADR-119/124/125's three-layer artefact model.

### Google ADK (Python)

ADK's 2026 direction is **broader operator surface and explicit composition**: an Agent Registry, an Environment toolset for file/command IO, a Workflow(BaseNode) graph orchestration system (still pre-release in `1.30.0a0`), live UI with structured trace and graph views, and an explicit skills system (`adk-style`, `adk-git`). [^adk-130] [^adk-131] [^adk-130a0]

- `1.31.0` (2026-04-16) calls out a **redesigned Live UI**: structured trace view, graph view, event filtering, dedicated Computer Use view — i.e. operator-facing observability moved into the framework rather than left to LangSmith-equivalents. [^adk-131]
- `1.30.0` (2026-04-13) adds **Auth Provider support to Agent Registry**, **Parameter Manager integration**, and `validate user_id and session_id against path traversal` — evidencing simultaneous investment in identity, parameter governance, and input safety. [^adk-130]
- The `1.30.0a0` Workflow pre-release introduces `Workflow(BaseNode)` graph orchestration with **partial resume for nested workflows** and **state/artifact delta bundling onto yielded events**, evidencing a deliberate move toward declarative workflow shapes. [^adk-130a0]

**Repo-local implication.** ADK's Agent Registry + Environment toolset + skill-script model is **the closest external analogue to this repo's `.agent/skills/` + AGENTS.md surface**. Worth treating as Slice B baseline material when comparing the practice-methodology ecosystem.

### BeeAI Framework

Trajectory **weak**. Recent releases are dominated by dependency hygiene and bug fixes (security CVE bumps, malformed-tool-call recovery, `ChatModel` middleware) rather than directional design pivots. The most substantive 2026 signal is migration to Vercel AI SDK v6 and an `AgentStackVectorStore`/`AgentstackEmbeddingModel` adapter pair. [^bee-rel]

- April 2026 releases are exclusively `update dependencies to fix security issues`, with no roadmap pointers. [^bee-rel]
- The most recent feature additions (Jan–Feb 2026) are middleware hooks on `ChatModel`, AgentStack RAG adapters, and Watsonx error recovery — evidencing maintenance velocity rather than architectural movement. [^bee-rel]

**Repo-local implication.** BeeAI is the lowest-priority project to track from this set; revisit only if a directional design pivot or RFC stream emerges. No routing change recommended this session.

## B. Interop protocols

### Agent2Agent (A2A)

A2A's strongest 2026 signal is **shipping `1.0.0` (2026-03-12) under the Linux Foundation** with a coordinated breaking-change wave that modernises the protocol surface: OAuth 2.0 modernisation (removed implicit/password, added device code + PKCE), native multi-tenancy on gRPC via a scope field, `tasks/list` with filtering and pagination, and a backwards-compatibility provision for SDKs. [^a2a-100]

- `1.0.0` adds **modernised OAuth 2.0 flows** and removes deprecated implicit/password flows (#1303), evidencing alignment with current OAuth posture. [^a2a-100]
- `1.0.0` adds **native multi-tenancy on gRPC** through a scope field (#1195) and **explicit backwards-compatibility provisions** for SDKs (#1401), evidencing federation-readiness as a deliberate axis. [^a2a-100]
- Earlier `0.3.0` (2025-07-30) had already added **mTLS + signed AgentCards** — direction was set then; `1.0.0` formalises it. [^a2a-030]

**Repo-local implication.** A2A's AgentCard-as-machine-readable-contract is **direct prior art for a contribution-contract surface**. The OAuth modernisation is also relevant given this repo's existing Clerk/PRM work — track as a Slice B and security-fence cross-reference.

### Model Context Protocol (MCP)

MCP's direction since the `2025-06-18` revision cited in the seed is **substantial**: the new `2025-11-25` revision brings durable-task support, formal governance, and a richer auth surface. The repo and spec are both moving from "stable surface area" toward "extension-rich substrate with formal SDK tiering." [^mcp-changelog] [^mcp-spec]

- `2025-11-25` adds **experimental `tasks` utility** for durable requests with polling and deferred result retrieval (SEP-1686) — i.e. MCP itself moves toward durable execution semantics. [^mcp-changelog]
- The same revision **formalises governance** (SEP-932), **establishes Working Groups and Interest Groups** (SEP-1302), and adds an **SDK tiering system** (SEP-1730), evidencing a transition from "tooling project" to "governed standard." [^mcp-changelog]
- Auth surface keeps expanding: OpenID Connect Discovery 1.0 (#797), incremental scope consent via `WWW-Authenticate` (SEP-835), OAuth Client ID Metadata Documents (SEP-991), tool calling support in sampling (SEP-1577). [^mcp-changelog]

**Repo-local implication.** This is the most active project for this repo to track. The new `tasks` utility and SDK tiering system both have direct implications for the `apps/oak-curriculum-mcp-streamable-http` server. Worth a dedicated Slice C entry under reviewer-systems/governance, and a candidate for a follow-up deep dive on MCP governance formalisation.

## C. Governance / control planes

### Microsoft Agent Governance Toolkit (AGT)

AGT's `v3.x` trajectory is **toward a unified operator interface**: a single `agt` CLI (replacing 12 separate binaries), a Governance Dashboard, lifecycle management with an 8-state model, Shadow AI Discovery, and quantum-safe (ML-DSA-65 / FIPS 204) signing alongside Ed25519. The project also migrated to OWASP ASI 2026 taxonomy. [^agt-310] [^agt-301]

- `v3.1.0` (2026-04-11) calls out a **Unified `agt` CLI** with plugin-extensible entry points and a **Governance Dashboard** for fleet status / trust scores / SLO health / compliance metrics. [^agt-310]
- `v3.1.0` adds **PromptDefenseEvaluator** ("12-vector prompt injection audit for systematic testing") and **Shadow AI Discovery** scanning infrastructure for unregistered agents — evidencing investment in the discovery + audit pair. [^agt-310]
- `v3.0.1` adds Rust and Go SDKs, an Entra Agent ID adapter, SBOM generation (SPDX/CycloneDX) with Ed25519 artefact signing, and a tenant isolation checklist — evidencing a multi-language, supply-chain-aware posture. [^agt-301]

**Repo-local implication.** The `agt`-style **single-CLI-with-plugin-entry-points** pattern and the lifecycle-with-audit-trail pattern are directly relevant to this repo's `pnpm agent-tools:*` CLI surface. Worth tracking as a comparative target when consolidating agent-tools ergonomics.

### Open Policy Agent (OPA)

OPA's trajectory is **post-1.0 stabilisation with infrastructure-grade plugin extensibility**: `v1.15.x` adds a logger plugin interface based on Go's standard `log/slog.Handler`, including a built-in file logger with rotation. The HTTP auth plugin contract was tightened (`Prepare()` for per-request logic). AWS web-identity / assume-role support landed for AWS signing. [^opa-rel]

- `v1.15.0` introduces a **logger plugin interface based on `log/slog.Handler`** with a built-in `file_logger` plugin, evidencing pluggable observability infrastructure. [^opa-rel]
- The same release tightens the `HTTPAuthPlugin` contract: per-request authentication logic must move from `NewClient()` to `Prepare()` — a small but deliberate API correction toward request-scoped auth. [^opa-rel]
- 2026 releases continue to prioritise security/build hygiene (Go 1.26.2 binary refresh) over feature breadth. [^opa-rel]

**Repo-local implication.** OPA's `slog.Handler`-based logger plugin is a clean example of **standardising on a stdlib interface for ecosystem extensibility**. Worth referencing as a pattern when this repo grows pluggable surfaces (e.g. reviewer-system extensions). No adoption recommendation.

## D. Repo-native support environments

### Prow

Trajectory **weak** at the doc surface. The official announcements page surfaces only minor renames (`ghcache_cache_partitions` spelling fix, `validate-supplemental-prow-config-hierarchy` rename) for 2024 onward; the bigger structural change — repo split from `kubernetes/test-infra` to a standalone `kubernetes-sigs/prow` — happened earlier and is not reflected as a direction-of-travel artefact. [^prow-ann]

- The two 2024 entries on the official announcements page are deprecation/renames; no roadmap or RFC artefact is exposed. [^prow-ann]

**Repo-local implication.** Prow's direction signal is too weak to drive any routing change. Continue to treat the existing landscape entry as the canonical reference; no Slice C deep-dive entry warranted unless a 2026 RFC stream emerges.

### Zuul

Zuul's in-development changelog signals **identity, RBAC, and declarative queue/build-node movement**: fine-grained role-based access control via tenant `role` definitions, OIDC URL standardisation (`/oidc/jwks` becomes canonical), `branch-assigned` shared change queues, and a new `label.max-nodes` attribute for per-tenant node ceilings. The earlier `14.0.0` shipped Zuul-launcher (replacing Nodepool) and "reporter" / "initializer" job types. [^zuul-rel]

- "In Development" notes for the next release add **fine-grained role-based access control** via `tenant.role` and deprecate `tenant.admin-rules` / `tenant.access-rules` in favour of `tenant.role-mappings` — evidencing convergence on a single role-mapping surface. [^zuul-rel]
- The same notes change OIDC key endpoint to `/oidc/jwks` (other URLs deprecated) — evidencing cleaner identity surface. [^zuul-rel]
- `14.0.0` shipped **Zuul Launcher** as the eventual Nodepool replacement, with both supported transitionally — evidencing a generational substrate replacement underway. [^zuul-rel]

**Repo-local implication.** Zuul's `role-mappings` model and `Depends-On` cross-repo DAG remain the strongest external prior art for **multi-repo dependency-aware contribution governance**. Worth flagging in Slice C governance section when discussing cross-repo gating.

### Backstage

Backstage `v1.50` ships a notable direction signal in the **Catalog Model Layer system (alpha, opt-in)**: plugins declare and extend catalog kinds, annotations, labels, tags, and relations using JSON Schema; the new `createCatalogModelLayer` API and `compileCatalogModel` validate and merge model definitions. The same release adds a **typed `examples` field on actions registry** entries, an `execute-template` action, and several MCP-related fixes (OAuth 2.0 PRM endpoint correction). [^bs-150]

- `v1.50` calls the catalog model layer system out as the headline alpha feature: "plugins to declare and extend catalog entity kinds, annotations, labels, tags, and relations using JSON Schema" with a `ModelProcessor` validating entities against compiled model schemas. [^bs-150]
- Same release records two MCP-relevant fixes: "Fixed the MCP OAuth 2.0 Protected Resource Metadata endpoint returning an internal plugin URL" and "Fixed `.well-known/oauth-protected-resource` resource URL to comply with RFC 9728 Section 7.3." [^bs-150]
- Same release adds **typed examples for actions registry** with compile-time-checked input/output values matching schema definitions — evidencing schema-first ergonomic alignment. [^bs-150]

**Repo-local implication.** Backstage's **JSON-Schema-driven catalog model layer** is the closest external analogue to this repo's "schema-first execution" cardinal rule and the catalog/curriculum domain model. Strong candidate for a Slice C reviewer-systems entry; worth a future comparison note against the repo's OpenAPI-driven type generation. The MCP RFC 9728 fix is a useful **debugging precedent** for this repo's own Clerk + MCP work.

### OpenRewrite

OpenRewrite's 2026 direction is **language coverage and parser robustness expansion**: heavy investment in Scala parser correctness, a new `go.mod` parser and `GoResolutionResult` marker, JavaScript/Python RPC encoding fixes, Kotlin type model alignment with Java parser output. The recipe substrate itself is stable; the surface area being widened is the set of supported languages. [^or-rel]

- April 2026 releases are dominated by Scala parser features (right-associative operators, partial functions with short match syntax, type parameters on method invocations), evidencing systematic Scala-language coverage build-out. [^or-rel]
- New `go.mod` parser added with a `GoResolutionResult` marker — evidencing Go entering the recipe ecosystem proper. [^or-rel]
- `JavaScript: fix non-FQ type on enum declarations and harden parseProject` and Python RPC fixes evidence cross-language parity work. [^or-rel]

**Repo-local implication.** OpenRewrite's direction reinforces the seed note's "structural code change beats free-form" thesis. No adoption recommendation, but worth referencing as a continuing prior art when this repo's structural-change tooling is discussed.

## E. Stability tier

### Temporal

Temporal's recent direction is **deepening Worker Versioning** (Pinned workflows, Upgrade-on-Continue-as-New public preview, Target Worker Deployment Version) plus continuous CVE-driven patch streams. No roadmap document was located in primary sources; trajectory is read from release notes. [^temporal-rel]

- `v1.30.2` (2026-03-24) flags **Upgrade-on-Continue-as-New (Public Preview)** — Pinned workflows can find out when a new worker version is available and upgrade-on-continue-as-new (#9239) — evidencing serious investment in long-running workflow versioning. [^temporal-rel]
- April 2026 patch series (`v1.30.4`, `v1.29.6`, `v1.28.4`) is dedicated to CVE-2026-5724 (a streaming-authorizer issue with replication setup), evidencing the continuous security-patch posture. [^temporal-rel]

**Repo-local implication.** Temporal's Worker Versioning model is direct prior art for **how to evolve long-running runtime contracts without breaking in-flight work**. No adoption recommendation; useful as a pattern source if this repo grows long-running execution surfaces.

### Dapr

Dapr's most material 2026 direction signal is **defence-in-depth edges on the service-invocation perimeter**: `v1.17.5` / `v1.16.14` / `v1.15.14` (all 2026-04-16) coordinate a security fix where path-traversal sequences in service-invocation method paths could bypass ACL policies, with normalisation moved to the service-invocation edge so the ACL evaluates the same path the dispatch layer uses. The wider runtime trajectory (workflow + actors + virtual actors) remains the same. [^dapr-rel]

- The April 2026 advisory is unusually detailed: "ACL is a pure policy evaluation layer and performs no normalization of its own"; normalisation moves to `directMessaging.Invoke`, `callLocalValidateACL`, and the gRPC proxy handler — evidencing a deliberate **policy-engine purity** principle. [^dapr-rel]
- The `purell` dependency was removed from the ACL path, with `path.Clean` applied as defence-in-depth in `constructRequest` — evidencing dependency-pruning + defensive layering. [^dapr-rel]

**Repo-local implication.** The "policy engine performs no normalisation; normalise once at the perimeter" lesson is **directly applicable** to any policy/gating surface this repo grows. Worth flagging in Slice C governance section as a transferable principle.

## Cross-project trajectory patterns

Five patterns hold across the corpus, with direction signals strong enough to be worth naming:

1. **Durable execution is becoming table-stakes for protocols too.** MCP `2025-11-25` adds an experimental `tasks` utility for durable polling. A2A `1.0.0` adds `tasks/list` with filtering and pagination. These signals indicate that durable execution is no longer the property of execution engines (LangGraph, Temporal, Dapr) alone — interop protocols are absorbing it. [^mcp-changelog] [^a2a-100]
2. **Governance is being formalised inside the projects themselves.** MCP formalised its governance, Working Groups, Interest Groups, and SDK tiering in the same revision that added durable tasks. AGT v3.x consolidates onto a single CLI with plugin entry points and a governance dashboard. This is governance moving from project-external (foundation policy) to project-internal (machine-readable structure). [^mcp-changelog] [^agt-310]
3. **Schema-first declarative surfaces are spreading.** Backstage's JSON-Schema-driven catalog model layer, ADK's Agent Registry + Environment toolset, OpenAI's Manifest, MCP's `JSON Schema 2020-12 as default dialect` (SEP-1613), and Microsoft Agent Framework's reflection-based skill discovery all converge on the same idea: declare the contract; let runtime conform. [^bs-150] [^adk-130] [^oai-sandbox] [^mcp-changelog] [^maf-rel-net]
4. **Persisted state is being treated as untrusted by default.** Microsoft Agent Framework `1.0.1` restricts checkpoint deserialisation through an explicit allow-list. LangGraph `4.0.2` documents `LANGGRAPH_STRICT_MSGPACK` for checkpoint security. Dapr's April 2026 fix moves all path normalisation to the perimeter. Each of these is independent evidence of the same hardening direction. [^maf-rel-101] [^lg-releases] [^dapr-rel]
5. **Identity and OAuth are being modernised in lockstep.** A2A `1.0.0` removes implicit/password OAuth flows, adds device code + PKCE. MCP `2025-11-25` adds OpenID Connect Discovery 1.0, OAuth Client ID Metadata Documents, RFC 9728 alignment. Backstage `v1.50` fixes its MCP OAuth 2.0 PRM endpoint to comply with RFC 9728 Section 7.3. Zuul standardises its OIDC URLs. Direction is unmistakably toward stricter, RFC-aligned identity surfaces. [^a2a-100] [^mcp-changelog] [^bs-150] [^zuul-rel]

## Repo-local implications and routing

These are recommendations for follow-up routing **only**; no doctrine edits are made in this session.

- **MCP** is the single highest-signal project to track for this repo. The `2025-11-25` revision changes the substrate the `apps/oak-curriculum-mcp-streamable-http` server stands on. Recommend a **dedicated Slice C entry under reviewer-systems/governance** and a candidate **MCP-governance deep dive** as a downstream plan candidate.
- **OpenAI Sandbox Agents Manifest**, **Backstage catalog model layer**, **ADK Agent Registry**, and **MS Agent Framework class-based skills** form a four-way external corpus directly comparable to ADR-119/124/125 and the `.agent/skills/` surface. They belong in **Slice B** as the practice-methodology ecosystem's neighbour set.
- **Dapr's "policy engine purity" principle** and **MS Agent Framework's "untrusted checkpoint by default" principle** are both transferable as **principles** for this repo's safety-evidence and continuity lanes — without needing any external dependency.
- **AGT's unified CLI + plugin entry points** is an ergonomic comparison target for this repo's `agent-tools/` surface.
- **A2A AgentCards and MCP Implementation `description`** are converging on the same idea — machine-readable identity for the producer side of an interop contract — and are worth tracking as **prior art for a contribution-contract surface**.

Promotion of any of the above into doctrine (ADRs, Practice Core, deep dives) is **out of scope for this session** and is recorded here as a routing recommendation only.

[^lg-overview]: LangChain, "LangGraph overview", <https://docs.langchain.com/oss/python/langgraph/overview> (fetched 2026-04-20).
[^lg-releases]: GitHub, `langchain-ai/langgraph` releases, <https://github.com/langchain-ai/langgraph/releases> (fetched 2026-04-20; releases dated 2026-04-08 to 2026-04-17).
[^maf-rel-100]: GitHub, `microsoft/agent-framework` Python `1.0.0` release notes (2026-04-02), <https://github.com/microsoft/agent-framework/releases>.
[^maf-rel-101]: GitHub, `microsoft/agent-framework` Python `1.0.1` release notes (2026-04-09), <https://github.com/microsoft/agent-framework/releases>. Cross-references Microsoft Learn, "Security Considerations" for `FileCheckpointStorage`.
[^maf-rel-net]: GitHub, `microsoft/agent-framework` .NET `1.1.0` release notes (2026-04-10), `Standardize file skills terminology on 'directory'` (#5205), `.NET: Support reflection for discovery of resources and scripts in class-based skills` (#5183), <https://github.com/microsoft/agent-framework/releases>.
[^oai-sandbox]: GitHub, `openai/openai-agents-python` `v0.14.0` Sandbox Agents release (2026-04-15), <https://github.com/openai/openai-agents-python/releases>.
[^oai-rel]: GitHub, `openai/openai-agents-python` `v0.14.1` and `v0.14.2` release notes (2026-04-15 to 2026-04-18), <https://github.com/openai/openai-agents-python/releases>.
[^adk-131]: GitHub, `google/adk-python` `1.31.0` release notes (2026-04-16), <https://github.com/google/adk-python/releases>.
[^adk-130]: GitHub, `google/adk-python` `1.30.0` release notes (2026-04-13), <https://github.com/google/adk-python/releases>.
[^adk-130a0]: GitHub, `google/adk-python` `1.30.0a0` Workflow Orchestration pre-release notes (2026-04-09), <https://github.com/google/adk-python/releases>.
[^bee-rel]: GitHub, `i-am-bee/beeai-framework` releases (latest April 2026), <https://github.com/i-am-bee/beeai-framework/releases>.
[^a2a-100]: GitHub, `a2aproject/A2A` `1.0.0` release notes (2026-03-12), <https://github.com/a2aproject/A2A/releases>.
[^a2a-030]: GitHub, `a2aproject/A2A` `0.3.0` release notes (2025-07-30), <https://github.com/a2aproject/A2A/releases>.
[^mcp-changelog]: Model Context Protocol, "Key Changes" between `2025-06-18` and `2025-11-25`, <https://modelcontextprotocol.io/specification/2025-11-25/changelog>.
[^mcp-spec]: Model Context Protocol, current Specification entry page, <https://modelcontextprotocol.io/specification> (links to schema `2025-11-25`).
[^agt-310]: GitHub, `microsoft/agent-governance-toolkit` `v3.1.0` release notes (2026-04-11), <https://github.com/microsoft/agent-governance-toolkit/releases>.
[^agt-301]: GitHub, `microsoft/agent-governance-toolkit` `v3.0.1` release notes (2026-04-01), <https://github.com/microsoft/agent-governance-toolkit/releases>.
[^opa-rel]: GitHub, `open-policy-agent/opa` releases (`v1.15.x`, April 2026), <https://github.com/open-policy-agent/opa/releases>.
[^prow-ann]: Prow project, official Announcements page, <https://docs.prow.k8s.io/docs/announcements/> (fetched 2026-04-20).
[^zuul-rel]: Zuul, "Release Notes" (In Development + 14.0.0 + 13.x), <https://zuul-ci.org/docs/zuul/latest/releasenotes.html>.
[^bs-150]: Backstage, "v1.50.0" release notes, <https://backstage.io/docs/releases/v1.50.0>.
[^or-rel]: GitHub, `openrewrite/rewrite` releases (April 2026), <https://github.com/openrewrite/rewrite/releases>.
[^temporal-rel]: GitHub, `temporalio/temporal` releases (`v1.30.x`, March–April 2026), <https://github.com/temporalio/temporal/releases>.
[^dapr-rel]: GitHub, `dapr/dapr` `v1.17.5` release notes (2026-04-16), <https://github.com/dapr/dapr/releases>.
