# Deep Review: MCP Apps Standard Migration — Roadmap

**Reviewer**: Claude (Opus 4.6, separate session)
**Date**: 2026-03-05
**File reviewed**: `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
**Research read**: `.agent/plans/sdk-and-mcp-enhancements/mcp-apps-support.research.md`
**Archive read**: `.agent/plans/sdk-and-mcp-enhancements/archive/auth-safety-correction.plan.md`

---

## Summary

The roadmap has improved significantly from the original plan (which I reviewed in `archive/claude.feedback.md`). The strategic role is now declared, non-goals are sharp, the ADR matrix is appropriately trimmed, and the Domain C dependency ordering is precise. These are genuine improvements.

However, there are several issues that need attention — some structural (template compliance), one critical (Domain A is already answered), and one subtle but architecturally important (host-specific domain derivation is incompatible with the "no host-specific logic" stance unless the `ext-apps` server SDK is used).

---

## Critical Finding: Domain A is Already Answered

**The research file (`mcp-apps-support.research.md`) directly and confidently answers both Domain A validation questions.**

From the research:

> ChatGPT explicitly states it supports the MCP Apps open standard: UIs running in an iframe and communicating using the standard `ui/*` JSON-RPC bridge over `postMessage`. OpenAI recommends building with MCP Apps standard keys/bridge by default, using ChatGPT-specific extensions only when required.

And:

> Tool ↔ UI linkage: MCP Apps standard `_meta.ui.resourceUri` maps to a ChatGPT compatibility alias `_meta["openai/outputTemplate"]`.

The research confirms:

- **(a) ChatGPT accepts `_meta.ui.resourceUri` as the primary key** — `openai/outputTemplate` is a legacy compatibility alias. Confidence: **High** (primary/official OpenAI documentation, dated 2026-03-05).
- **(b) ChatGPT accepts `text/html;profile=mcp-app`** — implied by their explicit adoption of the MCP Apps standard. The research mentions capability negotiation via `text/html;profile=mcp-app` MIME type. Confidence: **High (with one caveat — see below)**.

**Action required**: The `chatgpt-mcp-acceptance-validation` frontmatter todo should be updated to reflect this. The research file should be linked as the Domain A primary deliverable. The `domain-a-source-refresh` todo can be marked in progress / substantially complete.

One caveat on (b): the research notes that ChatGPT's capability negotiation works via MCP capabilities negotiation (clients advertise `io.modelcontextprotocol/ui` support). Whether ChatGPT fully rejects `text/html+skybridge` if it encounters it (vs silently accepting both) is not confirmed in primary sources. A small test against the ChatGPT sandbox would close this gap — but it does not block Domain C from starting on the metadata key migration (item C5), since C5 is clearly unblocked by the research.

**This means Domain C can start now on items C1, C2, C5 (tool metadata migration).** The roadmap should say so.

---

## Architecture Finding: `_meta.ui.domain` Cannot Be Host-Neutral Without the `ext-apps/server` SDK

The research surfaces a critical portability gap not addressed in the roadmap:

The `_meta.ui.domain` field (which replaces `openai/widgetDomain`) has **host-specific formats**:

- ChatGPT: URL-derived from `*.oaiusercontent.com`
- Claude: SHA-256 hash of server URL → `{hash}.claudemcpcontent.com`
- Spec: "format/validation rules are determined by each host"

The roadmap's Domain C item C6 says:
> Migrate from four `openai/*` keys... to MCP Apps standard equivalents.

And the deployment mode assumption says:
> No host-specific adapter package... no per-request host detection.

These two stances are in **direct tension** for `_meta.ui.domain`. You cannot emit a single canonical `_meta.ui.domain` value that is correct for both ChatGPT and Claude without either:

1. Computing it differently per host (which violates the "no host-specific logic" stance), OR
2. Delegating domain derivation to the **`@modelcontextprotocol/ext-apps/server` SDK** — specifically `registerAppResource`/`registerAppTool` helpers, which handle host-specific metadata derivation internally.

The research mentions:
> `@modelcontextprotocol/ext-apps/server`: helpers to register app-enabled tools/resources on an MCP server, including capability checks.

**If Oak uses `registerAppTool` and `registerAppResource` from `@modelcontextprotocol/ext-apps/server`, the host-specific domain derivation is handled by the SDK — not by Oak's code.** This would preserve the host-neutral stance in Oak's code while correctly serving host-appropriate domain values. This is likely the intended path, but the roadmap doesn't mention it and doesn't reference this SDK package.

**Action required**: Domain C item C6 (and C5) should explicitly assess whether adopting `@modelcontextprotocol/ext-apps/server` helpers is the right mechanism for host-neutral metadata registration. If yes, this should be stated as part of the Domain A/B research and C5/C6 implementation approach. If not, the domain-neutrality claim needs to be revisited.

---

## Structural Issues (Template Compliance)

The roadmap does not follow the `collection-roadmap-template.md` structure. Missing sections:

### 1. Status header and session entry

The template requires:
```
**Status**: [Current milestone and state]
**Session Entry**: [prompt link]
```
Neither is present. Status is implied (partially in-flight; Gate 3 passed) but not stated at the top. This makes it hard to orient quickly.

### 2. Documentation Synchronisation Requirement

The template mandates this section for every roadmap. It is absent. The requirement is:

> No phase can be marked complete until documentation updates are handled for:
> 1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
> 2. `.agent/practice-core/practice.md`
> 3. any additionally impacted ADRs...

This is not boilerplate — the "Potential ADR" note in the roadmap (the MCP-standard-first reframing decision) is exactly the kind of decision that should be captured in an ADR before Domain C implementation begins. The absence of the documentation sync section means there's no mechanism to enforce this.

### 3. Execution Order visual summary

The template expects:
```
Phase 0: Research (Domain A)         COMPLETE
Phase 1: Specialist Assessment (B)   PENDING
Phase 2: Refactoring (Domain C)      PENDING — blocked on A
Phase 3: Feature expansion (D)       PENDING — blocked on C
```
The A→B→C→D dependency ordering is documented textually but there's no quick-scan visual. For a roadmap, this is important.

### 4. Phase Details with "done when" definitions and plan links

The template requires per-phase "done when" definitions and links to executable plans. The roadmap has domain descriptions but no explicit "done when" for each domain. Example of what's missing:

> **Domain A — done when**: research findings document confirms ChatGPT accepts `_meta.ui.resourceUri` (high confidence), source list refreshed, link health passes. Executable plan: `active/domain-a-chatgpt-acceptance-validation.plan.md`.

### 5. Related Documents section

The template ends with a Related Documents list. Absent from the roadmap. The research file (`mcp-apps-support.research.md`) in particular should be linked here — it's a first-class artefact that directly informs this roadmap.

---

## C8: Archived Plan vs Roadmap Description Are Different Problems

The `archive/auth-safety-correction.plan.md` is **not completed** — all todos are `pending`. It was "archived/superseded" but the problem it addresses is **different** from the roadmap's C8.

- **Archived plan**: fix `toolRequiresAuth` (call-time) to use deny-by-default when `securitySchemes` is absent/empty/malformed. This is runtime auth checking.
- **Roadmap C8**: fail-fast at bootstrap/startup time if any tool descriptor has invalid `securitySchemes`. This is startup invariant.

These are **complementary defences**, not alternatives. Superseding the archived plan with the roadmap's C8 removes a valid defence-in-depth layer. Consider whether both should be executed:

1. C8 (roadmap): fail at startup on invalid descriptors — catches structural problems early.
2. Archived plan (call-time): deny-by-default in `toolRequiresAuth` — a runtime safety net if the startup check somehow passes.

The archived plan's TDD phases and decision table are excellent. It would be a loss to discard them entirely.

---

## Content Issues

### 6. "Potential ADR" is a deferred binding decision

The roadmap notes:
> **Potential ADR**: This reframing... represents a binding architectural decision. Consider capturing it as a formal ADR before Domain C implementation begins.

Domain C implementation is now unblocked (at least for C1, C2, C5). "Consider" is too weak — this should be a **Gate 2 or Gate 5 requirement**, not an informal note. If the reframing is already the established position (and it is — the roadmap is built on it), write the ADR now. Delaying until "before Domain C begins" means it may be written under time pressure.

Suggested addition to frontmatter todos:
```yaml
- id: reframing-adr
  content: "Write ADR: MCP Apps standard is primary; ChatGPT is one host; no separate OpenAI App; no host-specific adaptation layer in core."
  status: pending
```

### 7. ADR-046 documentation debt not tracked

The ADR matrix notes that ADR-046 uses "OpenAI-first framing" and flags it as a documentation debt. However, this planned ADR update is not in the frontmatter todos. It will be forgotten without a tracker.

### 8. Gate-to-Domain mapping is implicit

Gates 0–6 are defined. Domains A–D are defined. The relationship between them is implied but not explicit. A mapping table or statement would help:

| Gate | Domain |
|------|--------|
| Gate 0 | Pre-work — applies to all |
| Gate 1 | Domain A secondary (source hygiene) |
| Gate 2 | ADR matrix — applies to all |
| Gate 3 | Pre-merge — already passed |
| Gate 4 | Domain B (specialist profile) |
| Gate 5 | Domain C/D separation |
| Gate 6 | Quality and exit readiness |

### 9. Domain A source list (23 URLs) belongs in the executable plan

The research file already exists as the Domain A deliverable. The 23-URL source list in the roadmap is now superseded by the research artefact. The roadmap should reference the research file and remove the raw URL list, which makes the roadmap significantly leaner.

### 10. 20-item exit criteria is too granular for a roadmap

The exit criteria list has 20 items, many of which are implementation details ("Widget state replacement and MIME rollout/rollback strategy are in Domain C item C3"). A roadmap's exit criteria should be 4–6 high-level phase-completion conditions. The detailed exit criteria belong in each domain's executable plan.

---

## Strengths (Genuine)

These are working well and should be preserved:

1. **Non-goals section** — sharp and enforceable. "No host-specific adaptation layer" is stated as a non-goal with specifics (no `OAK_MCP_PLATFORM`, no host-mode toggles).
2. **OpenAI coupling inventory table** — precise, dated, and file-specific. This is the authoritative evidence layer.
3. **Host-neutral ownership** — the workspace decomposition note (WS2/WS4 boundary) is architecturally important and specific.
4. **Domain C internal dependency ordering** (C1/C2 → C5 → C4/C6 → C3/C10) — well-reasoned and explicit.
5. **C3 widgetState replacement note** — the constraint is correct and specific (`sessionStorage` preference, PII prohibition, TTL requirement). This is exactly the right level of pre-implementation guidance.
6. **C6 CSP field mapping note** — flagging `resource_domains` vs `resourceDomains` shape differences is precise operational foresight.
7. **Absent-CSP security stance** — restrictive-only default, no permissive fallback. Clear and correct.
8. **C4 rollout strategy** — Vercel preview deployment before full cutover is a pragmatic and safe approach.
9. **ADR-042 in matrix** — the note about `packages/runtime-adapters/` scope drift is important given the "no host adapters" stance.
10. **Research file exists and is excellent** — high-quality, well-cited research that directly answers the blocking question. This is a major asset.

---

## Prioritised Recommendations

| Priority | Action |
|----------|--------|
| **Critical** | Update `chatgpt-mcp-acceptance-validation` todo to "completed" with the research file as evidence; unblock Domain C items C1/C2/C5 |
| **Critical** | Add Domain C item for assessing `@modelcontextprotocol/ext-apps/server` SDK helpers as the mechanism for host-neutral domain derivation |
| **High** | Add the "Potential ADR" as a frontmatter todo (blocking Gate 2 or Gate 5) |
| **High** | Add Documentation Synchronisation Requirement section |
| **High** | Add Status header and Execution Order visual summary |
| **Medium** | Add Phase Details with "done when" and plan file links |
| **Medium** | Add ADR-046 update as a frontmatter todo |
| **Medium** | Reconsider C8 strategy — the archived deny-by-default plan is complementary, not alternative |
| **Medium** | Add Gate-to-Domain mapping (brief table or note) |
| **Low** | Remove raw source URL list (superseded by research file) |
| **Low** | Trim 20-item exit criteria to 4–6 phase-level conditions |
| **Low** | Add Related Documents section linking the research file |
