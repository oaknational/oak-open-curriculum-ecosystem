---
name: "Oak Prod MCP Snagging — 2026-06-11 Live Exercise"
overview: "Track and resolve the findings from the 2026-06-11 live exercise of the oak-prod MCP (curriculum-mcp-alpha.oaknational.dev, app v1.26.1) over the Cursor MCP client. Covers the get-eef-evidence structuredContent-only client-visibility finding (owner decision), corpus keyword description leakage, a corpus prior-knowledge typo, descriptor schema-bound completeness, and prompt-invocation UX observations."
todos:
  - id: s0-client-population-probe
    content: "S0 (before deciding S1): probe how non-Cursor clients (Claude Code, Codex, Gemini CLI at minimum) surface the get-eef-evidence structuredContent-only success — one Shape-B call each per the write-up's replay recipe. The S1 decision should rest on the client population, not Cursor alone. CLOSED 2026-06-11 evidence-recorded: Cursor renders only content blocks, Claude Code (probed live) renders only structuredContent, claude.ai/ChatGPT render both (in-repo research mcp-client-tool-result-consumption-2026-05-28.md). The S1 decision rests on this matrix; Codex/Gemini probes are an optional annex, NOT gates."
    status: completed
  - id: s1-eef-textcontent-mirror
    content: "S1 (owner decision, informed by S0): resolve the get-eef-evidence success-shape finding — either add a serialised TextContent mirror alongside structuredContent (matches the graph-tool formatToolResponse shape and the MCP spec SHOULD) or record the client limitation and hold the ratified structuredContent-only shape. Evidence: the cursor-visibility write-up (this branch) + this plan's finding 1. CLOSED 2026-06-11: owner decided the dual shape (supersedes the EEF plan D6/D7 structuredContent-only ratification of 2026-06-06/07); executed as PR-2 on feat/eef-dual-shape-alignment, landing commit 20ad83326 — egress membrane delegates to formatToolResponse, summary built at dispatch sites, envelope-keys guard test, transport-level e2e closes the coverage gap."
    status: completed
  - id: s2-keyword-description-scoping
    content: "S2: investigate cross-subject keyword description leakage (e.g. keyword:convert serving a religion-flavoured description into maths KS2 results). Decide at the corpus-emission layer whether keyword identity should carry per-subject descriptions or surface all placements' descriptions; never patch at the tool layer. INVESTIGATION CLOSED 2026-06-11: root cause is OUR keyword-extractor first-occurrence-wins collapse (keyword-extractor.ts:101-105,152-186) — upstream bulk data is per-lesson-placement (8+ distinct 'convert' descriptions); the corpus node carries one description field. Cure (per-placement/per-subject description model — placement data belongs on edges, not collapsed into identity) is queued as its own identity-model design decision, evidence attached."
    status: completed
  - id: s3-corpus-typo-routing
    content: "S3: route the 'Interpret adn present data' prior-knowledge typo (unit:understand-additive-relationships-and-apply-them-to-rearrange-equations) to its source. REFRAMED 2026-06-11: the typo is in the generated corpus (graph-corpus/data.json:30036) but ABSENT from current bulk-downloads (the unit slug is absent too) — so refresh bulk downloads, regenerate the corpus, then route: typo gone → close; typo survives → file the upstream ticket in sector-engagement/ooc-issues. Queued (needs a network + regen window)."
    status: pending
  - id: s4-keyword-limit-schema-bounds
    content: "S4: align the get-keyword-graph `limit` descriptor schema with its documented and enforced bounds — the JSON schema declares bare `type: number` while the doc text and runtime refusal enforce an integer in [1, 100]. CORRECTED FRAMING 2026-06-11: the limit Zod is HAND-AUTHORED multi-line chain at aggregated-keyword-graph.ts:67-72 (not generated) — one-line fix to z.number().int().min(1).max(MAX_KEYWORD_LIMIT), nothing to regenerate; integration test asserts the served JSON schema carries the bounds. Executes as PR-3. CLOSED 2026-06-12: landed as PR #192 (merge f4e8da260); the transport-level e2e proves the served schema declares type integer, minimum 1, maximum 100, and the multiline-aware sweep confirmed no other bare numeric input param."
    status: completed
  - id: s5-prompt-ux-observations
    content: "S5 (observation, decide disposition): argless user invocation of a prompt slash-command (e.g. /adapt-lesson) surfaces a raw zod -32602 JSON dump to the user. Spec-correct server-side. DISPOSITION 2026-06-11: stays an observation — a client-UX concern; no server-side change."
    status: completed
isProject: false
---

# Oak Prod MCP Snagging — 2026-06-11 Live Exercise

**Last Updated**: 2026-06-12 (three-PR arc landed; S4 closed; verification
outcomes recorded)
**Status**: OPEN — S0/S1/S2/S4/S5 closed (see ledger); S3 alone remains,
queued on a network + regen window. The owner decided S1 on 2026-06-11:
`get-eef-evidence` aligns onto the family dual response shape (supersedes the
EEF plan D6/D7 structuredContent-only ratification). The three-PR arc is
fully landed: PR #190 (outbound token health metric, merge `8f1cc49c0`,
released as 1.27.0), PR #191 (EEF dual-shape, merge `1b02b70b4`, released as
1.28.0), PR #192 (S4 limit bounds, merge `f4e8da260`). Post-merge
verification (2026-06-12): the write-up's Shape-B replay against a local
1.28.0 build returns 2 content blocks + the decorated `structuredContent`
(finding 1 fixed at the level it was broken); production serves 1.28.0; the
metric's `oak.http.request.mcp` spans and "MCP response size" structured
logs are arriving in Sentry (one caveat: span-ATTRIBUTE searchability in the
Sentry explorer is unconfirmed — the logs dataset carries `bodyBytes` /
`tokensEst`, so baselines are observable regardless; check attribute
indexing before wiring the follow-on threshold decision to span queries).
The earlier write-up-first direction (2026-06-11 evening) was satisfied by
the cursor-visibility write-up below before any fix.
**Primary evidence (self-contained, on this branch)**:
[`oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md`](../../../reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md)
— wire shapes, the Cursor agent-visibility matrix, prompt-layer split, replay
recipe, and open client-population questions.
**Companion evidence (cross-branch)**: the full live-exercise verification
record `oak-prod-live-mcp-exercise-2026-06-11.md` is on branch
`docs/graph-team-direction-2026-06-10` (commit `ae5372e2c`, pushed) — not on
this branch; the write-up above reproduces the Cursor-relevant evidence so
nothing here depends on that branch.
**Severity model**: the
[Milestone Release Runbook snagging protocol](../../../../docs/engineering/milestone-release-runbook.md#snagging-protocol)
(P0 release stop … P3 post-release backlog).

---

## Findings register

| # | Severity | Finding (short) | Disposition |
|---|----------|-----------------|-------------|
| 1 | P1 | `get-eef-evidence` success payloads invisible to the Cursor agent harness: the ratified `content: []` + structuredContent-only shape renders `(omitted)`; refusals and every dual-shape tool render fine. The EEF teacher-value path is dead for agents in content-block-only clients. Cursor surfaces ONLY `content` blocks to the model — proven by the decoration-key fingerprint (received JSON lacks `summary`/`oakContextHint`/`status`, so it is `content[1]`, never `structuredContent`). | **RESOLVED (owner decision 2026-06-11): dual shape via `formatToolResponse`, executed as PR-2** (`feat/eef-dual-shape-alignment`, commit `20ad83326`) — supersedes the D6/D7 structuredContent-only ratification. S0 closed evidence-recorded (Cursor + Claude Code + 2026-05-28 research). Full evidence + replay recipe in the [cursor-visibility write-up](../../../reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md). |
| 2 | P2 | Cross-subject keyword description leakage: `keyword:convert` (subjects: history, maths) serves "to convert to a new religion or belief…" into maths KS2 keyword results. | **In-repo (S2)** — corpus emission / keyword identity model. |
| 3 | P3 | Corpus prior-knowledge typo: "Interpret adn present data…" on `unit:understand-additive-relationships-and-apply-them-to-rearrange-equations`. | **Route to source (S3)** — upstream bulk data vs repo-held to be determined. |
| 4 | P3 | `get-keyword-graph` `limit` descriptor schema carries no bounds (`type: number`) while doc text + runtime enforce integer [1, 100]. Runtime refusal is correct; the schema under-declares. | **In-repo (S4)** — fix at the input-schema source, regenerate. |
| 5 | P3 | Argless prompt slash-command invocation (`/adapt-lesson`) surfaces a raw zod `-32602` JSON dump to the user. | **Observation (S5)** — spec-correct; decide friendlier message vs leave as client-UX concern. |

## Dispositions ledger (2026-06-11, under Dusky Passing Mist → Cosmos turns Equinox ownership)

| Snag | Disposition |
|---|---|
| S0 | Closed — evidence-recorded (Cursor + Claude Code matrix + the 2026-05-28 in-repo research); the decision no longer rests on further probes; Codex/Gemini probes are an optional annex |
| S1 | Closed — owner decided the dual shape 2026-06-11; executes as PR-2 (commit `20ad83326`) |
| S2 | Investigation closed — root cause is the repo keyword-extractor first-occurrence-wins collapse (`keyword-extractor.ts:101-105,152-186`); upstream data is per-placement. Cure (per-placement/per-subject description model — placement data belongs on edges, not collapsed into identity) queued as its own design decision |
| S3 | Reframed — refresh bulk downloads → regenerate corpus → typo gone ? close : file the ooc-issues ticket. Queued (needs a network + regen window) |
| S4 | Closed — landed as PR #192 (merge `f4e8da260`, 2026-06-12); hand-authored Zod, one-line fix — nothing to regenerate (corrects this plan's original framing) |
| S5 | Stays an observation (spec-correct; a client-UX concern) |

## Non-snags recorded during the same pass (no action)

- **Prompt invocability in Cursor**: MCP prompts ARE exposed to the *user* as
  slash commands (verified live 2026-06-11: `/adapt-lesson` reached the server
  and returned a spec-correct validation error naming `topic` + `yearGroup`,
  matching the descriptor). What is unavailable is *agent-side* invocation —
  the Cursor agent harness exposes tools and resources, not prompts. The
  corrected account (including the `<cursor_commands>` loop-back of
  user-invoked prompt results into agent context) is §4 of the
  [cursor-visibility write-up](../../../reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md);
  the original exercise report on the docs branch still carries the
  uncorrected blanket wording — amend it when branches reconcile.
- **Auth membrane**: unauthenticated JSON-RPC to the prod endpoint correctly
  401s with a `WWW-Authenticate` PRM pointer (Clerk).
- **Graph-tool contract behaviour**: all positive and negative probes
  doctrine-correct; no soft stubs anywhere. See the exercise report.

## Cross-references

- Evidence: [`oak-prod-live-mcp-exercise-2026-06-11.md`](../../../reports/oak-prod-live-mcp-exercise-2026-06-11.md)
- Finding 1 interacts with
  [`output-schemas-for-mcp-tools.plan.md`](output-schemas-for-mcp-tools.plan.md)
  (the envelope/outputSchema arc owns the long-term success-shape contract;
  any S1 change should be coherent with `composeEnvelopeSchema`).
- Sibling precedent: [`oak-preview-mcp-snagging-2026-04-23.plan.md`](oak-preview-mcp-snagging-2026-04-23.plan.md).
