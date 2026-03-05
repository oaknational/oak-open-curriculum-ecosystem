# Metaplan: Updates to MCP Extensions Research and Planning

**Target plan**: [roadmap.md](../roadmap.md) (renamed and moved from `mcp-extensions-research-and-planning.md`; promoted to collection-root roadmap)
**Created**: 2026-03-05
**Applied**: 2026-03-05 — all checklist items applied (see Section 4). Target plan is now active at the new path above.
**Purpose**: Define changes to apply to the target plan. This metaplan is not an edit of the plan itself; it is the specification for a future edit.

---

## 1. Intent of the Metaplan

When the MCP extensions plan is next updated, the following additions and refinements must be incorporated:

1. **Storage and host adaptation**: Adapter pattern for storage/runtime behaviour so application code stays host-agnostic and platform-specific behaviour lives in adapters.
2. **Platform detection at startup**: Require that the MCP HTTP app detects host/platform (e.g. ChatGPT vs MCP Apps–only vs generic MCP) at startup and exposes that via the existing config mechanism (e.g. `RuntimeConfig` or equivalent) so the rest of the app can branch or delegate without re-detecting.
3. **Single vs dual metadata**: Incorporate deep research on OpenAI/ChatGPT support for the MCP Apps standard; if ChatGPT fully supports MCP standard metadata and MIME, the plan should allow for a single set of metadata and logic instead of maintaining two.

---

## 2. Required Plan Additions

### 2.1 Storage / host behaviour — adapter pattern

**Requirement to add to the plan (Domain C refactoring backlog or Domain D feature backlog, as appropriate):**

- **Storage and host-specific behaviour** must use an **adapter pattern**:
  - Application code (tool handlers, resource registration, widget metadata emission) MUST NOT branch on host type or storage implementation; it MUST depend on abstractions (e.g. interfaces for “metadata emitter”, “resource registrar”, “state storage”).
  - **Platform adaptation** (e.g. “emit OpenAI-only keys”, “emit MCP standard keys”, “use skybridge MIME”, “use MCP profile MIME”) MUST live in **adapters** that implement those abstractions and are selected once at startup based on platform detection.
- **Rationale**: Keeps core MCP and widget logic consistent and testable; avoids scattered `if (isChatGPT)` or dual code paths in the main flow. Aligns with “No compatibility-layer sprawl in core execution paths” (plan non-negotiables) by containing compatibility in explicit adapter boundaries.

**Suggested placement**: Domain C (refactor backlog) as “Adapter boundary for host-specific metadata and resource behaviour”, and/or Domain D as “Standard-first MCP Apps capability expansion” implemented via adapters.

### 2.2 Platform detection on app startup

**Requirement to add to the plan:**

- **Platform detection** MUST run **once at application startup** (e.g. during bootstrap or when building `RuntimeConfig`).
- The detected platform (or “host capability profile”) MUST be **shared through the config mechanism** (e.g. a field on `RuntimeConfig` or a dedicated app-scoped context) so that:
  - Resource registration, tool list emission, and any storage or UI behaviour can use the same detection result without re-inferring host type per request.
  - Tests can inject a known platform via config without relying on request headers or environment.
- **Rationale**: Single source of truth for “which host are we serving”; avoids inconsistent behaviour and duplicate detection logic across handlers and registrations.

**Suggested placement**: Domain C (refactor backlog) or a new “Bootstrap and config” prerequisite item; reference ADR-116 (resolveEnv pipeline) and existing `runtime-config.ts` / `bootstrap-app.ts` so the new platform field fits the current config pipeline.

---

## 3. Deep Research: OpenAI/ChatGPT Support for the MCP Apps Standard

The following research was performed to inform whether the plan can assume **one set of metadata and logic** (MCP standard only) or must retain **two** (MCP + OpenAI-specific).

### 3.1 Primary source: OpenAI official documentation

**Source**: [MCP Apps compatibility in ChatGPT](https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt) (fetched 2026-03-05).

**Findings:**

- ChatGPT **implements the MCP Apps UI standard**: “ChatGPT supports the MCP Apps open standard for embedded app UIs” and “ChatGPT implements this same iframe-and-bridge model.”
- **Recommended approach**: “Use the standard host bridge (`ui/*` JSON-RPC over `postMessage`)” and “Declare your UI using `_meta.ui.resourceUri`.” “Layer on ChatGPT extensions via `window.openai` only when you need capabilities that aren’t covered by the shared spec.”
- **Tool metadata mapping**:
  - **MCP Apps standard**: `_meta.ui.resourceUri` (link tool to UI resource).
  - **ChatGPT compatibility alias**: `_meta["openai/outputTemplate"]` — i.e. ChatGPT accepts the same intent via either key.
- **Host bridge**: Same model — `ui/initialize`, `ui/notifications/tool-input`, `ui/notifications/tool-result`, `tools/call`, `ui/message`, `ui/update-model-context` are the standard; `window.openai` is the optional ChatGPT extension for modals, file uploads, Instant Checkout, etc.
- **Conclusion from docs**: Building around **MCP Apps standard keys and bridge by default** is the official recommendation. The “compatibility alias” wording implies ChatGPT can consume `_meta.ui.resourceUri` (and likely treat it the same as `openai/outputTemplate`). So **one set of tool metadata (MCP standard) may be sufficient**; the plan need not *require* dual emission unless backward compatibility or older clients demand it.

### 3.2 MIME type (resource)

- **MCP Apps standard**: `text/html;profile=mcp-app` (per ext-apps migration guide).
- **Current Oak implementation**: `text/html+skybridge` (OpenAI Apps SDK convention).
- **Uncertainty**: Official docs do not explicitly state that ChatGPT will accept a resource registered with **only** `text/html;profile=mcp-app`. One search summary suggested “when ChatGPT loads an HTML template linked in a tool descriptor, it is served as text/html;profile=mcp-app” — which, if accurate, would imply ChatGPT already uses or accepts the MCP MIME type. **This must be validated** (e.g. via Domain A research or a small experiment) before the plan commits to single-MIME registration.
- **Recommendation for the plan**: Add an explicit **research/validation task**: “Confirm whether ChatGPT accepts widget resources registered with MIME type `text/html;profile=mcp-app` only (no `text/html+skybridge`). Document outcome; if yes, plan can assume single resource registration and single MIME.”

### 3.3 Implications for the target plan

| Question | Finding | Plan update suggestion |
|----------|---------|------------------------|
| Do we need two tool metadata shapes (OpenAI + MCP)? | ChatGPT implements MCP Apps and documents `openai/outputTemplate` as a *compatibility alias* for `_meta.ui.resourceUri`. | Plan can be updated to **prefer a single canonical shape (MCP standard)** with a note that ChatGPT accepts it; retain “host projection” only if validation or backward-compat requires it. |
| Do we need two resource MIME types? | Unclear from primary sources; one secondary source suggested ChatGPT may use `text/html;profile=mcp-app`. | Add **Domain A (or dedicated) research task** to confirm. If ChatGPT accepts MCP MIME only, plan can specify single MIME and single registration path. |
| Do we need two code paths for “emit metadata” / “register resource”? | If single metadata and single MIME suffice, a single path plus optional adapters for legacy or edge cases is enough. | Align with **adapter pattern** (Section 2.1): one code path using abstractions; adapters only where platform-specific behaviour is still required (e.g. optional `window.openai` features). |

### 3.4 Research to add into the plan

When editing the plan, add or extend as follows:

1. **Domain A (research)**  
   - **Mandatory deliverable**: “ChatGPT MCP Apps support validation” — confirm in production or docs: (a) Does ChatGPT accept tool descriptors that use **only** `_meta.ui.resourceUri` (no `openai/outputTemplate`)? (b) Does ChatGPT accept widget resources served with **only** `text/html;profile=mcp-app`?  
   - **Confidence log**: Tag the outcome (single set sufficient vs dual required) with confidence (High/Medium/Low) and source links.

2. **Domain C (refactor backlog)**  
   - If research shows single set is sufficient: “Migrate to MCP-standard-only metadata and resource registration; remove or deprecate OpenAI-only code paths once validated.”  
   - If dual is still required: “Retain host projections (OpenAI + MCP) implemented via adapters; core remains host-neutral.”

3. **Explicit principle in the plan**  
   - Add a short “OpenAI vs MCP app relationship” subsection (or bullet under Purpose/Non-negotiables): “One app (Oak MCP server); ChatGPT and other MCP Apps hosts consume the same tools and resources. Metadata and registration should be MCP-standard-first; OpenAI-specific surface is a compatibility alias or adapter only, unless research shows otherwise.”

---

## 4. Summary of Edits to Apply (Checklist)

Applied to [roadmap.md](../roadmap.md) on 2026-03-05:

- [x] **Storage / host behaviour**: Added in Domain C item 1 (adapter boundary) and Domain D item 3 (adapter-first feature expansion).
- [x] **Platform detection**: Added in Domain C item 2; references `runtime-config.ts`, `bootstrap-app.ts`, and ADR-116.
- [x] **Research**: Added as mandatory new deliverable in Domain A (ChatGPT MCP Apps acceptance validation task with confidence log requirement).
- [x] **Refactor backlog**: Domain C items 3–6 cover the conditional migration (MCP-only if validated, dual via adapters if not).
- [x] **Clarify relationship**: Added "OpenAI App vs MCP App: The Reframing" section plus non-negotiable: "MCP Apps standard is primary; OpenAI-specific surface is a compatibility alias or thin adapter only."
- [x] **Link this metaplan**: Linked in the Changelog section of the updated plan.
---

## 5. References

- Target plan: [roadmap.md](../roadmap.md)
- OpenAI: [MCP Apps compatibility in ChatGPT](https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt)
- MCP Apps migration: [Migrate_OpenAI_App](https://modelcontextprotocol.github.io/ext-apps/api/documents/Migrate_OpenAI_App.html)
- Config/bootstrap: `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`, `bootstrap-app.ts`
- ADR-116: resolveEnv pipeline architecture
- ADR-117: Plan templates and components (plan hierarchy; this metaplan is a “plan-update specification”, not an executable or strategic plan in the lifecycle lanes)
