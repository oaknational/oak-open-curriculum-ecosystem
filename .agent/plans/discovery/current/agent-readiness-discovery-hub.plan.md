---
title: "Agent readiness discovery hub - Phase 1 execution"
status: current
lane: current
type: executable
thread: agentic-mechanisms-discovery
date: 2026-06-01
source_strategic_plan: ../future/agentic-mechanisms-discovery.plan.md
source_ticket: "Oak National Academy - Agent-Readiness Implementation Spec v0.1"
todos:
  - id: ar1-refresh-standards-and-live-estate
    content: "Refresh official standards and live Oak endpoint evidence before product edits. Re-check RFC 9727/RFC 9264/RFC 8288, the Agent Skills Discovery RFC, Agent Skills spec, Content Signals/robots/sitemap guidance, Web Bot Auth guidance, and public Oak endpoint state. Update the verification report with any drift."
    status: pending
    depends_on: []
  - id: ar2-apex-catalog-hub
    content: "Apex API catalog hub: prove the homepage Link header and api-catalog content type stay compliant, add exactly one skills-index relation, and add no service-host metadata that belongs on open-api., mcp., or aila. Validate absolute service anchors and no duplicate service enumeration."
    status: pending
    depends_on: [ar1-refresh-standards-and-live-estate]
  - id: ar3-agent-skills-build-and-index
    content: "Agent Skills publication: author the first ratified skill tranche as same-origin static artifacts, generate SHA-256 digests over the shipped bytes in the same build step that writes index.json, serve GET/HEAD with correct content types/cache/CORS, and block scripts/archives unless explicitly ratified."
    status: pending
    depends_on: [ar1-refresh-standards-and-live-estate]
  - id: ar4-open-api-auth-md
    content: "Open API auth guidance: publish an agent-readable Auth.md on open-api. for the static-key auth model, including how to obtain a key, header shape, rate limits, and support path. Do not publish OAuth or OpenID placeholder metadata for this host."
    status: pending
    depends_on: [ar1-refresh-standards-and-live-estate]
  - id: ar5-markdown-negotiation
    content: "Markdown representation: add deterministic markdown access for human curriculum and lesson pages only, either by Accept: text/markdown negotiation or parallel .md URLs. Prove structured-data hosts remain out of scope."
    status: pending
    depends_on: [ar1-refresh-standards-and-live-estate]
  - id: ar6-robots-sitemaps-content-signals-baseline
    content: "Robots, sitemaps, and Content Signals: make robots.txt and sitemap coverage a general baseline for every official Oak web app; prepare the exact Content Signals and AI-crawler policy decision brief for editorial/legal; encode search/ai-input/ai-train values only after owner/legal/editorial decision."
    status: pending
    depends_on: [ar1-refresh-standards-and-live-estate]
  - id: ar7-web-bot-auth-discovery-security-bridge
    content: "Web Bot Auth: treat signed-agent verification as a first-class discovery item. Decide and document whether Oak will enable, decline, or defer Web Bot Auth per official web app; cross-link any enforcement/configuration evidence to security-and-privacy before making a security claim."
    status: pending
    depends_on: [ar1-refresh-standards-and-live-estate]
  - id: ar8-final-verification-and-docs
    content: "Final estate verification and docs: prove Phase 1 endpoints with GET/HEAD/content-type/cache/CORS checks, update discovery indexes and partner-facing docs, and run focused gates plus pnpm check before claiming readiness."
    status: pending
    depends_on: [ar2-apex-catalog-hub, ar3-agent-skills-build-and-index, ar4-open-api-auth-md, ar5-markdown-negotiation, ar6-robots-sitemaps-content-signals-baseline, ar7-web-bot-auth-discovery-security-bridge]
---

# Agent readiness discovery hub - Phase 1 execution

## Context

Oak now has two planning inputs for agent-facing discovery:

- the discovery future bundle under
  [`../future/`](../future/README.md), which defined the layer map across Agent
  Skills, MCP Server Cards, A2A, registry metadata, and adjacent proposals;
- the Oak ticket's "Agent-Readiness Implementation Spec", which turns that
  layer map into an estate-level implementation shape across
  `www.thenational.academy`, `open-api.thenational.academy`,
  `mcp.thenational.academy`, and a possible `aila.thenational.academy`.

The promotion trigger has fired for the apex/Open API slice: the public apex
already ships the RFC 9727 API catalog and `Link` header, the Open API is already
anchored from the catalog, and the missing Phase 1 work is inside Oak's gift.
The MCP, A2A, DNS-AID, and WebMCP surfaces remain separately gated.

Current evidence lives in
[`standards-verification-2026-06-01.report.md`](standards-verification-2026-06-01.report.md).

## Problem, End Goal, Mechanism, And Means

- **Problem.** A flat per-host agent-readiness scanner mis-scores a federated
  Oak estate: the apex, Open API, future MCP host, possible Aila host, and
  skills artifacts have different truthful owners. Without a current execution
  plan, standards details from the future bundle and Oak ticket can drift or be
  implemented on the wrong host.
- **End goal.** A standards-shaped discovery hub on the apex points agents to
  truthful service-owned metadata and Oak-authored skills, while service hosts
  publish only the metadata they legitimately own.
- **Mechanism.** Keep the apex as the single entry point and index owner, then
  fan out to capability hosts. Build integrity-sensitive artifacts from source
  into Oak-owned origins so trust and digest verification follow the shipped
  bytes.
- **Means.** Execute the Phase 1 tasks in the YAML todos: refresh standards,
  tighten the catalog hub, publish skills, publish Open API `Auth.md`, provide
  markdown representations, apply the robots/sitemap baseline, route
  content-signal decisions, make Web Bot Auth a first-class decision/evidence
  item, and verify the estate.

## Design Principles

1. **Origin truth over scanner scores** - metadata lives on the host that owns
   the capability. The apex indexes; it does not pretend to be the MCP server or
   Open API.
2. **No fabricated metadata** - absence is correct where a mechanism does not
   apply. Static-key Open API auth gets `Auth.md`, not OAuth placeholders.
3. **Integrity at build time** - skill digests are generated over the exact
   shipped bytes in the same build step that emits `index.json`.
4. **Public metadata only** - well-known discovery surfaces are crawlable and
   cacheable; they must not publish tenant, user, private, or runtime-only state.
5. **Official web-app baseline** - every official Oak web app needs `robots.txt`
   and sitemap coverage as a general requirement. Content Signals and Web Bot
   Auth layer policy and verification on top; they do not replace the baseline.

## Non-Goals

- Publishing MCP Server Cards before `mcp.thenational.academy` exists and the
  live MCP Server Card spec/path is re-confirmed.
- Publishing Aila A2A metadata before Oak decides Aila should answer to
  third-party agents.
- Publishing DNS-AID records before the DNS scope decision is made.
- Implementing WebMCP before Oak decides the human site should expose in-page
  agent-callable actions.
- Enabling or claiming Web Bot Auth without security-owned edge evidence.
- Publishing commerce metadata (`x402`, MPP, UCP, ACP); Oak does not transact
  through these public curriculum surfaces.

## Scope And Host Ownership

| Surface | Host | This Plan |
|---|---|---|
| RFC 9727 API catalog | `www.thenational.academy` | Verify and add skills relation |
| `Link: rel="api-catalog"` | `www.thenational.academy` | Keep verified |
| Agent Skills index and artifacts | Apex index; Oak-owned artifact origins | Implement |
| `Auth.md` for static-key API auth | `open-api.thenational.academy` | Implement |
| Markdown representation for human content | `www.thenational.academy` | Implement |
| `robots.txt` | Every official Oak web app | General baseline requirement |
| Sitemap | Every official Oak web app | General baseline requirement |
| Content Signals and AI-crawler policy | per host; apex editorial policy | Prepare and route decision |
| Web Bot Auth / signed-agent verification | Edge/provider layer for official Oak web apps | First-class decision item; security evidence required for claims |
| MCP Server Card and OAuth metadata | `mcp.thenational.academy` at GA | Not in this plan |
| DNS-AID records | DNS zones | Not in this plan |
| A2A Agent Card | `aila.thenational.academy` if exposed | Not in this plan |
| WebMCP | Apex human site, if wanted | Not in this plan |

## Cycle Dependencies And Parallelisation

`ar1` is the only prerequisite for the implementation work because it refreshes
moving standards. After `ar1`, the implementation work is naturally parallel:

- `ar2` owns apex API catalog and link relation tests.
- `ar3` owns skills source/build/static artifact publication.
- `ar4` owns Open API auth documentation.
- `ar5` owns markdown representation for human content pages.
- `ar6` owns the general `robots.txt`/sitemap baseline and content-signal
  decision routing for ratified values.
- `ar7` owns the Web Bot Auth discovery/security bridge.

`ar8` is sequenced after all implementation tasks and owns integrated proof.

Each product-bearing task must land as TDD pairs: failing test plus production
change plus refactor in the same commit. If implementation lives in another Oak
repository, the execution session must open the equivalent repo-local plan or PR
checklist there and back-link this plan as the source.

## Acceptance Criteria

- **AR-A1** - The apex homepage returns `Link: </.well-known/api-catalog>;
  rel="api-catalog"` and `/.well-known/api-catalog` returns
  `application/linkset+json` with the RFC 9727 profile.
- **AR-A2** - The catalog anchors Open API links at
  `https://open-api.thenational.academy`, not apex-relative paths, and includes
  exactly one discoverable relation to the skills index.
- **AR-A3** - The skills index is valid for the live Agent Skills Discovery RFC,
  each artifact URL resolves on a `thenational.academy` origin, and every digest
  matches the shipped artifact bytes.
- **AR-A4** - `open-api.thenational.academy/Auth.md` documents the real static-key
  scheme and no OAuth/OpenID placeholder metadata is published for that host.
- **AR-A5** - Human curriculum/lesson pages have deterministic markdown
  representation; `open-api.` and `mcp.` remain structured-data surfaces instead.
- **AR-A6** - Every official Oak web app has `robots.txt` and sitemap coverage,
  or a named exception with owner-approved rationale.
- **AR-A7** - Content-signal values are either owner-ratified and encoded or
  explicitly held as a legal/editorial decision gate.
- **AR-A8** - Web Bot Auth is recorded per official Oak web app as enabled,
  declined, deferred, unavailable, or not applicable; any enabled claim links to
  security-owned evidence.
- **AR-A9** - Focused endpoint checks and `pnpm check` pass before readiness is
  claimed.

## Deterministic Validation

Minimum validation commands for execution sessions:

```bash
curl -I https://www.thenational.academy/
curl -i https://www.thenational.academy/.well-known/api-catalog
curl -i https://www.thenational.academy/.well-known/agent-skills/index.json
curl -I https://www.thenational.academy/.well-known/agent-skills/index.json
curl -i https://open-api.thenational.academy/Auth.md
curl -i https://www.thenational.academy/robots.txt
curl -I https://www.thenational.academy/sitemap.xml
pnpm lint
pnpm test
pnpm check
```

Add owning-repo focused tests for the actual implementation files. The final
`pnpm check` is mandatory for a repo readiness claim.

## Proof Contract

| Acceptance | Proof Level | Proof |
|---|---|---|
| AR-A1 | integration | Header and catalog endpoint checks plus owning-repo tests |
| AR-A2 | integration | Linkset parse/assertion over absolute service anchors |
| AR-A3 | integration | Generated index validates; digest recomputation over artifact bytes |
| AR-A4 | non-code + integration | `Auth.md` fetches with correct type and names real auth behaviour |
| AR-A5 | integration | Representative curriculum/lesson markdown requests return clean markdown |
| AR-A6 | integration | Per-host robots and sitemap checks, or named exceptions |
| AR-A7 | non-code + integration | Decision recorded; robots/content-signal output matches the decision |
| AR-A8 | non-code + security evidence | Web Bot Auth decision ledger plus security evidence link for enabled controls |
| AR-A9 | integration | Focused checks plus `pnpm check` exit 0 |

## Risks And Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Standards churn | Implementation may target stale paths or schemas | `ar1` refresh is blocking; pin schema versions and record source dates |
| Origin confusion | Agents follow metadata to the wrong host | Catalog tests assert absolute anchors and host ownership |
| Skill prompt injection | Skill artifacts load directly into agent context | Same-origin hosting, digest verification, tight write access, no scripts by default |
| Legal/editorial misstatement | Robots/content-signal values become public policy claims | Route `search`, `ai-input`, and `ai-train` to decision owners before encoding |
| Unsupported signed-agent claim | Web Bot Auth is described as enabled without edge evidence | Discovery records decision state; security-and-privacy owns enforcement proof |
| Cross-repo implementation drift | This repo plan and owning app repo diverge | Back-link implementation PRs and refresh this plan during handoff |

## Foundation Alignment

- `principles.md` - strict and complete, no fabricated metadata, no fallback
  placeholders, no host pretending to own another host's capability.
- `testing-strategy.md` / `tdd-as-design.md` - every product-bearing task lands
  as test+code pairs with endpoint-level proof.
- `schema-first-execution.md` - runtime Oak facts stay in generated/API/MCP data
  surfaces; skills and markdown are guidance/representation layers, not shadow
  curriculum data sources.

## Plan-Body First-Principles Check

Before executing any todo, re-ask: does this surface make Oak's public machine
estate more truthful and useful, or merely satisfy a scanner row? If the latter,
do not implement it. Route it to the relevant future plan or decision register.

## Reviewer Scheduling

- Plan readiness: `assumptions-expert` for proportionality and host ownership.
- Trust/security surfaces: `security-expert` for skills, digests, CORS, robots,
  Web Bot Auth, and public metadata leakage.
- MCP-specific follow-on: `mcp-expert` only when the MCP GA plan is promoted.
- Documentation/onboarding: `docs-adr-expert` and `onboarding-expert` before
  readiness is claimed.

## Lifecycle Triggers

See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md).

- Session entry: start-right, active claims, thread record, current plan, and
  standards-verification report.
- Pre-edit coordination: open active claims in this repo and any owning repo.
- During work: append comms events for cross-repo or owner-decision changes.
- Handoff: update this plan, discovery indexes, and the
  `agentic-mechanisms-discovery` thread record.
- Consolidation: after completion, run the normal learning loop and archive or
  graduate the strategic source material.
