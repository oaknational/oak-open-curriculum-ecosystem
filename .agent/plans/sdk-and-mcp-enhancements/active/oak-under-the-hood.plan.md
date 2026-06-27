---
name: "Oak Under the Hood — one behaviour, two channels, no carried content"
status: ACTIVE — W1 + W2 LANDED (commit `3e8636be7`, worktree `worktree-ws-b-explain`); W3 (rename) COMPLETE in the worktree, gate + review + commit pending (Seal lifts Whirlpool, 2026-06-27). Canonical dir resolved to `.agent/skills/under-the-hood/` (bare concept name — the `oak-` prefix is adapter-only; the W2 pointer URL was corrected to match). Validated by two ultracode review suites; all findings critically assessed.
lineage:
  serves_thread: orientation-skills-family
  serves_stream: teaching-surface family across the PDR-112 portability seam
  strategic_choice: >
    Oak Under the Hood lets a person explore THIS REPO through whatever lens fits
    them (angle x the impact/intent/mechanisms/value facet x altitude), framed by
    Oak's mission/strategy, in both places they already are — the in-repo skill and
    the Oak MCP server. It carries NO content: the canonical sources are always
    reachable (local files when local; public GitHub + the public Oak site
    otherwise), so the capability is purely the orientation BEHAVIOUR plus pointers.
  derives_from: >
    Owner direction 2026-06-27 (full arc in the handoff record): name = Oak Under
    the Hood ("effort"/"explain" dropped); explore THIS REPO through lenses (Oak as
    framing context + on-interest depth); all canonical sources always reachable
    (the "remote can't reach canonical" premise is FALSE); all parts of the system
    work at all times — NO graceful degradation / fallback / invented optionality /
    essence / snapshot (principles.md Strict and Complete); a SIMPLE system, delete
    the hacks-on-hacks; tests prove behaviour only (no content pinning); official
    sourcing + no PII. Existence of a shape in the code is NOT evidence it is correct.
todos:
  - id: w1-behaviour
    content: >
      DONE. The one behaviour, authored in the skill canonical
      (.agent/skills/explain/SKILL-CANONICAL.md, renamed in W3): lens discernment
      (angle x impact/intent/mechanisms/value facet x altitude) folded into the
      existing What/Who/Mode model (not a competing axis); access-aware public
      locators (read-local when local else fetch public GitHub raw; Oak-org always
      fetched from the public Oak site); official-sourcing + absolute no-PII
      invariants (incl. README/ATTRIBUTION carry names — relay credit, never the
      names); curriculum firewall clarified (route-to vs narrate); setup retained.
      Reviewed by onboarding-expert; P1 (PII anchored to repo docs) + P2 (curriculum
      routing clause) applied; uncommitted in the working tree.
    status: completed
  - id: w2-mcp-pointer-delete-bake
    content: >
      NOT STARTED. The MCP tool + resource adopt the POINTER shape (minimal trigger
      + resource_link/URL to the public canonical skill + public Oak sources; the
      assistant fetches and orients). In the SAME atomic change delete the whole
      bake apparatus + content-pinning tests (full inventory in the body). Behaviour-
      only tests. mcp-expert + test-expert review, critically assessed.
    status: pending
    depends_on: [w1-behaviour]
  - id: w3-rename-everywhere
    content: >
      NOT STARTED. Rename explain/oak-explain/effort -> oak-under-the-hood
      everywhere (skill dir + .agents/.claude mirror dirs + adapters; tool/resource
      names; settings.json allowlist; README/CONTRIBUTING/docs; ADR-202; AGENT.md);
      repo-wide rg clean; skills:check + portability:check green. Crosswalk the
      sibling orientation-lens-unification.plan.md and carry forward its un-executed
      ws5/ws3/ws6 BEFORE retiring (only the name is superseded). Route ADR-202 +
      portability to the Director. docs-adr-expert + config-expert review.
    status: pending
    depends_on: [w1-behaviour]
---

# Oak Under the Hood — one behaviour, two channels, no carried content

> **Successor pickup:** read this plan + the handoff record
> `.agent/state/collaboration/handoffs/<claim bb9073cd record>.md` (the correction
> arc, the at-risk rationale, the exact edit state). W1 is DONE (uncommitted); start
> at W2. Both W2 and W3 consume W1 and are independent of each other.

## The system (one paragraph)

Oak Under the Hood is **one behaviour**: discern the person's lens — their angle
(engineer, data scientist, leader, education/product expert, … open-ended) × the
**facet** they want (the repo's **impact, intent, mechanisms, value**) at their
**altitude** — then **explore THIS REPO through that lens**, framed by Oak's mission
and strategy, with deeper Oak material on interest. The canonical content already
exists and is **always reachable**: repo docs are read locally in a local checkout
and fetched from the public GitHub repo otherwise; Oak's mission/impact/strategy are
on the public Oak site + its published documents. So the capability **carries no
content** — it is the behaviour plus pointers to where the canonical sources are. It
runs in two channels, the in-repo skill (`/oak-under-the-hood`) and the MCP
tool/resource, from **one** behaviour source (the skill canonical).

## The behaviour-source mechanism (decided: pointer shape)

The MCP tool/resource carry only **(a) a minimal trigger instruction** ("orient the
user to this repo via Oak Under the Hood; full method and sources at …") **and (b) a
`resource_link`/URL to the public canonical skill** plus the public Oak sources. The
connected assistant fetches the canonical and orients. **No baked content, no
generated body, no hand-maintained behaviour duplicate, no generate step.** This is
the only mechanism satisfying *both* "no bake" and "no hand-maintained duplicate":
build-time generation is a smaller bake (rejected); a shared behaviour module
violates the ADR-041 app→`.agent` import boundary (rejected). The trigger is a
pointer-instruction, not a restatement of the method. A client that never follows
the pointer gets only the trigger — that is the invented-degradation path the owner
deleted, out of scope by design (all parts work at all times; sources always reachable).

## W1 — The behaviour (DONE, uncommitted)

Authored in `.agent/skills/under-the-hood/SKILL-CANONICAL.md` (renamed from `.agent/skills/explain/` in W3):
facets folded into §What-to-discern; the §Router Principle gained the access-aware
public-locator paragraph (`raw.githubusercontent.com/oaknational/oak-open-curriculum-ecosystem/main/<path>`)
and two Oak-org public-site rows (`who-we-are`; `meet-the-team#documents`); the
Honesty Invariants gained **Official sourcing** (relay Oak's official wording, never
the repo's own derivation as Oak-official) and **No personal data** (no person names
from fetched Oak pages OR from the repo's own README/ATTRIBUTION — relay credit, cite
the source, never the names); the curriculum firewall gained a route-vs-narrate
clause. Setup (ADR-202 point 2) untouched. onboarding-expert review folded (P1 PII
anchoring, P2 curriculum routing). **Proof:** the §Verification conversational
simulation (run it, observe — never a content pin).

## W2 — MCP points at the behaviour; delete the bake (one atomic change)

The tool and resource adopt the pointer shape; the entire bake apparatus and
content-pinning assertions are deleted in the **same atomic commit** so `pnpm check`
is never broken. **The inventory below was verified first-hand against the worktree.**

**Delete (files):** `src/explain/effort-overview.ts`; **`src/explain/behaviour-shell.ts`**
(a second behaviour source carrying the invented "snapshot honesty" — the validation
caught this; do not miss it); `src/explain/explain-content-transform.ts` +
`…explain-content-transform.unit.test.ts`; `src/generated/explain-content.ts` (whole
file — one constant `EXPLAIN_ORIENTATION_BODY` + `EXPLAIN_LAST_MODIFIED`, no separable
"content half"); `src/explain/explain-tool.unit.test.ts` (content-pinning);
**`apps/oak-curriculum-mcp-streamable-http/scripts/generate-explain-content.ts`** (the
generator file itself — FOUND first-hand by the successor, not in the original inventory;
it is the bake apparatus and becomes an orphan once the generated output + npm script go).

**Delete (config — all three or the aggregate gate breaks):** `generate:explain-content`
and `check:explain-content` from `apps/oak-curriculum-mcp-streamable-http/package.json`;
the `check:explain-content` task in **`turbo.json`** (~lines 58-61); the
`check:explain-content` token in the **root `package.json` `check` script** (~line 95).

**Rewrite (product):** `src/explain/explain-tool.ts` → pointer-shape dual result
(ADR-058: `content`[summary, serialized JSON, **`resource_link`**] + `structuredContent`).
The `resource_link` content block MUST carry `type:'resource_link'` + `uri` + **`name`**
(name is required per the SDK `ResourceLinkSchema`, v1.29.0) — type it as the SDK
`ResourceLink` so a missing field is a compile error (mcp-expert, verified first-hand).
**Also surface the canonical URL in `structuredContent`** (not only the content block) so
it is model-visible regardless of how a client renders content blocks — belt-and-braces is
right precisely because the design has no fallback path. **`openWorldHint:true`** (the tool
now points OUT to a fetched external canonical), `readOnlyHint:true`; explicit empty closed
`inputSchema` (`additionalProperties:false`, per MCP 2025-11-25) — passed as an **empty Zod
raw shape** to `registerTool` (NOT a literal JSON-schema object); **pin the emitted closed
form with the integration/e2e assertion** (the current `not.toHaveProperty('inputSchema')`
assertion inverts to "declares a closed empty inputSchema"). **No `outputSchema`** — correct
rationale = free-form body, no object schema worth a contract; **delete the false
"declaring an `outputSchema` would make `tools/call` run strict validation and fail"
sentence from the file header** (the SDK validates-PASS on a conforming `structuredContent`,
mcp-expert verified `validateToolOutput` `mcp.js:188-204`) and rewrite the now-false
"carrying the committed effort-orientation body" header comment. Firewall structural (no
import of the curriculum-coupled `formatToolResponse`/`OAK_CONTEXT_HINT`, ADR-041).
`src/register-resources.ts` → drop the `EXPLAIN_ORIENTATION_BODY` + `EXPLAIN_LAST_MODIFIED`
imports and the `lastModified` annotation (snapshot apparatus, dropped consciously); **keep**
the `priority` + `audience` MCP annotations (protocol metadata, not carried content); serve a
short markdown pointer + the raw URL in `contents[].text`; **keep the URI `docs://oak/explain.md`
in W2** (the URI rename to `docs://oak/under-the-hood.md` is W3).

**Pointer-URL ↔ W3 coupling (mcp-expert, highest-concern):** the pointer hard-codes
`raw.githubusercontent.com/oaknational/oak-open-curriculum-ecosystem/main/<path>`. W3 renames
that path and the W1-hardened canonical is not on `main` until the PR merges, so W2 and W3 are
NOT independent for the pointer literal. Resolution: point at the **final** post-W3 path
(`.agent/skills/oak-under-the-hood/SKILL-CANONICAL.md`); W2 + W3 ride the SAME PR (#243), which
already stays DRAFT until the reframe lands, so the `main` URL resolves at merge; make
URL-reachability a **pre-merge check, never a network-coupled test**.

**Rewrite (tests, behaviour-only):** KEEP + adapt `explain-tool.integration.test.ts`
(it holds genuine coexistence + no-output-schema assertions); the
`not.toHaveProperty('inputSchema')` assertion **inverts** to assert the closed empty
`inputSchema`, and add an `openWorldHint===true` registration assertion. Add a behaviour-only
unit test (dual-shape present; `structuredContent` carries the pointer/`resource_link` —
key name taken from the product, never invented ahead of it; **no `oakContextHint` key**;
no import of any deleted constant). Fix `register-resources.integration.test.ts` (remove the
`EXPLAIN_ORIENTATION_BODY` import + the content-equality describe block AND the now-stale
`lastModified` annotation assertion → behaviour-only read: non-empty, no throw; the
`docs://oak/explain.md` URI literal stays as-is in W2 — its rename is W3) and the stale URI
comment in `register-resources-observability.integration.test.ts`.
**`e2e-tests/explain.e2e.test.ts` (FOUND first-hand — not in the original inventory; it
imports `EXPLAIN_ORIENTATION_BODY` and would break the atomic commit): REWRITE to
behaviour-only — discovery + coexistence with the curriculum tools survive; the description
assertion drops from `toBe(EXPLAIN_TOOL_DESCRIPTION)` to non-vacuous + effort-scoped (not a
constant pin); the `tools/call` assertion proves the dual shape with a `resource_link`
(`type`/`uri`/`name`) and NO baked body and no `oakContextHint`; widen the `ToolsCallResultSchema`
Zod shape to the pointer shape.** Confirmed by mcp-expert + test-expert.
**Reject** any "assert the description/body contains word X" test (content-pinning by the back
door); the only acceptable description assertions are non-emptiness and the firewall-behaviour
absence (no curriculum-domain wording / no `oakContextHint` key). **Atomic-landing:** every
delete, product rewrite, new test, and the three config edits land in ONE commit.

**Acceptance:** `pnpm check` green; no bake/generated/drift artefact remains; firewall
structural; tests behaviour-only. **Review:** mcp-expert + test-expert, critically assessed.

## W3 — Rename everywhere (replace, don't bridge)

`explain` / `oak-explain` / `effort` → `oak-under-the-hood`, one concept one name: the
skill dir `.agent/skills/explain/` → `.agent/skills/under-the-hood/` (the **bare** concept
name — the adapter generator prepends the `oak-` prefix, so the canonical must NOT carry it,
or adapters double-prefix to `oak-oak-…`; the generated adapters and the `/oak-under-the-hood`
command are `oak-`-prefixed; the W2 pointer URL was corrected to the bare path); **the
`.agents/skills/oak-explain/` and `.claude/skills/oak-explain/` mirror dirs** +
regenerate adapters; MCP tool name; resource URI `docs://oak/explain.md` →
`docs://oak/under-the-hood.md`; `.claude/settings.json` allowlist (`Skill(oak-explain)`
×2 → `oak-under-the-hood`); README, CONTRIBUTING, docs/README; ADR-202; AGENT.md.
Repo-wide `rg` for `explain|effort|oak-explain|docs://oak/explain` returns only
intentional residue; `pnpm skills:check` + `pnpm portability:check` green. **Crosswalk**
the sibling `.agent/plans/developer-experience/current/orientation-lens-unification.plan.md`
(status READY-FOR-EXECUTION but the unification already landed as `/oak-explain`,
`ca40d98ce`) and **carry forward its un-executed obligations** (ws5 conversational-
simulation + owner walkthrough, ws3 AGENT.md routing, ws6 continuity) **before**
retiring — only the lens *name* is superseded. **Route the ADR-202 amendment +
portability proof to the Director (currently Chinook turns Halo).** Review:
docs-adr-expert + config-expert, critically assessed.

## Review cadence (every review critically assessed before acceptance)

Never apply a reviewer verdict on trust. The discipline (worked three times this
session): reviewer *convergence* is not evidence of correctness, and a shape's
*existence* in the code is not evidence it is needed. W1 → onboarding-expert (done).
W2 → mcp-expert + test-expert. W3 → docs-adr-expert + config-expert. Pre-merge →
code-expert gateway; route ADR-202 + portability to the Director; owner gates the
code-owner merge (bot reviews skipped org-wide on billing — first-hand specialist
review is the compensation).

## Verification (end-to-end)

- `pnpm check` green from the worktree after W2 (confirm it resolves with
  `check:explain-content` removed from all three locations).
- `pnpm skills:check` + `pnpm portability:check` green after W3; repo-wide `rg` clean.
- **Value-proxy + firewall by conversational simulation (run it, observe — never a
  content/string pin):** in a local checkout, `/oak-under-the-hood` orients an
  engineer-asking-mechanisms and a leader-asking-impact correctly (repo-primary,
  Oak-framed, reads local canonical incl. README which interleaves curriculum) and
  **refuses/redirects a curriculum query without describing curriculum**; via the MCP
  tool (real client or MCPJam) an orientation trigger calls the tool, the assistant
  fetches the cited canonical and orients, and a curriculum query does not engage.

## Non-goals

No baked or generated content; no drift gate; no fallback / graceful-degradation /
essence / snapshot; no curriculum content or structure; no compliance claims; no
person names (PII); not the portable agentic-AI primer (a separate skill).

## Foundation alignment

principles.md §Strict and Complete (no invented optionality — the organising
principle; existence ≠ correctness); replace-don't-bridge; testing-strategy.md
(behaviour-only; content-pinning tests deleted); ADR-058 (dual shape), ADR-041
(firewall via non-import; app cannot import `.agent`), ADR-200 (source pointers =
navigation, not a competing authority), ADR-202 (amended for the name + the
behaviour-only pointer projection).
