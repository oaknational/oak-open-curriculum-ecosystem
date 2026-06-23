---
name: "MCP Prompt Grouping Taxonomy"
overview: "Group Oak's MCP prompts by the teacher job they serve (owner direction 2026-06-12: curriculum planning, lesson planning, resource adaptation — 'that sort of thing'), choose the spec-legal grouping vehicle (tags in _meta, title prefixes, naming convention, or documentation taxonomy), apply it to the seven live prompts, and align outward-facing claims to the same taxonomy so planning-moment conflations (sequence planning vs just-in-time next-step) cannot recur in product or briefing prose."
status: "QUEUED — DRAFT FOR OWNER REVIEW; taxonomy ratification is the owner gate"
todos:
  - id: ws1-spec-grounding
    content: "WS1: SPEC SIDE DONE 2026-06-12 (owner-supplied 2025-11-25 spec sources, verified first-hand — see §WS1 findings): no tag/group field on Prompt; vehicles are description conventions, title prefixes, naming conventions, icons, and content-level audience annotations. REMAINING: client-rendering evidence — what do Cursor / Claude Code / claude.ai / ChatGPT actually RENDER of each candidate vehicle (the client-visibility lesson applies: ratify no vehicle without rendering evidence). mcp-expert review of the final verdict."
    status: pending
  - id: ws2-taxonomy-design
    content: "WS2: design the taxonomy over the seven live prompts (find-lessons, lesson-planning, explore-curriculum, learning-progression, curriculum-mapping, adapt-lesson, continue-progression) on TWO axes: job-to-be-done (owner seed groups: curriculum planning / lesson planning / resource adaptation) AND audience (user-facing workflow vs assistant-audience procedural content — the prompts-as-skills observation; weigh the spec's user-controlled interaction model as a design tension and cross-link the oak-skills estate); name the planning-moment distinction explicitly (term-ahead sequence planning vs just-in-time anchored next-step — the 2026-06-12 briefing conflation is the motivating instance); put the taxonomy to the owner for ratification."
    status: pending
    depends_on: [ws1-spec-grounding]
  - id: ws3-apply-and-align
    content: "WS3: apply the ratified taxonomy via the chosen vehicle to all prompt definitions (one TDD cycle: descriptor tests assert the grouping fields/conventions; sdk + app rebuild; live verification against at least two clients), update ADR-123's prompt table with the group column, and align outward-facing surfaces (executive briefing family, capability docs) to the same group vocabulary."
    status: pending
    depends_on: [ws2-taxonomy-design]
  - id: ws4-gap-surface
    content: "WS4: name the taxonomy's empty cells and adjacent capability gaps as candidate roadmap items — at minimum: a guided term-ahead sequence-planning workflow (data support exists today, no guided prompt); the completions capability for typed prompt-argument autocompletion (subject/key-stage enums, context-dependent narrowing); any assistant-audience skill-channel prompts the audience axis surfaces. Candidates go to the owner; feature-shaping is the owner's decision."
    status: pending
    depends_on: [ws2-taxonomy-design]
isProject: false
---

# MCP Prompt Grouping Taxonomy

**Created**: 2026-06-12 (owner direction in-session: "Broadly we should start grouping our
prompts, possibly with tags, curriculum planning, lesson planning, resource adaptation...
that sort of thing").

## WS1 findings — spec grounding (2026-06-12, verified against the 2025-11-25 revision)

Owner-supplied sources, each fetched and verified first-hand:

- **Prompt definition fields** (`server/prompts` §Data Types): `name`, `title`,
  `description`, `icons`, `arguments`. **No tag, group, or category field exists.** The
  description field can carry an indicative grouping convention (owner suggestion);
  `icons` offer a visual-grouping channel; `title` prefixes and `name` conventions are the
  other definition-level vehicles.
- **Audience labelling** (`server/prompts` §PromptMessage note → `server/resources`
  §Annotations): prompt-message **content blocks** support `annotations.audience` with
  values `"user"` and `"assistant"` (plus `priority` 0.0–1.0 and `lastModified`). The
  prompt *definition* cannot be audience-labelled, but its *substance* can be marked
  assistant-audience. The spec's stated prompt interaction model is **user-controlled**
  (slash-command style) — an agent-facing prompt cuts against that model's grain, which
  the taxonomy must treat as a design tension, not a free choice.
- **The owner's strategic observation**: a prompt whose content is assistant-audience
  procedural instruction **is functionally a skill**. This reframes the taxonomy from menu
  tidiness to **audience separation** — teacher-facing workflows vs agent-facing
  procedural capabilities — and bridges the MCP prompt estate to Oak's skills estate
  (the oaknational/oak-skills library and the external-facing skills synthesis): MCP
  prompts with assistant-audience content are a candidate MCP-native skill delivery
  channel. WS2's taxonomy must carry the audience axis alongside the job-to-be-done axis.
- **Completion** (`server/utilities/completion`): the `completions` capability +
  `completion/complete` with `ref/prompt` provides typed argument autocompletion,
  including `context.arguments` for dependent arguments (e.g. key stage narrowed by
  subject). Oak's prompt arguments (subject, key stage, focus enums) are a natural fit —
  recorded as a WS4 candidate for the owner, not in-scope work.
- **Pagination** (`server/utilities/pagination`): `prompts/list` is cursor-paginated;
  irrelevant at seven prompts, noted for scale honesty. Logging utility noted as estate
  context only.

### Client-features addendum — elicitation + sampling (2026-06-12, owner-supplied sources)

Verified first-hand against `client/elicitation` and `client/sampling` (2025-11-25):

- **Elicitation** (CLIENT capability; `elicitation/create`, nestable inside other server
  features): form mode collects flat structured input — string/number/boolean plus
  single- and multi-select enums WITH display titles and defaults — under a three-action
  contract (`accept` / `decline` / `cancel`); URL mode covers sensitive out-of-band flows.
  The enum shapes map directly onto lesson-building choices (subject, key stage,
  misconception focus, resource selection), and arguments compose with the completions
  capability above.
- **Sampling** (CLIENT capability; `sampling/createMessage`): server-orchestrated LLM
  generation through the client's own model — including tool use (`sampling.tools`: the
  server runs a bounded agentic loop where the LLM proposes tool calls, the server
  executes them, and the loop continues), with human-in-the-loop review REQUIRED at each
  gate and model preferences advisory.
- **Owner-seeded candidate (2026-06-12): interactive lesson building.** Elicitation
  gathers the teacher's choices step by step; sampling — with Oak's curriculum tools in
  the loop — drafts and refines lesson content; every step passes the three-action gate,
  structurally honouring the briefing's "the teacher decides" guarantee. Routed to WS4.
  The gating evidence is the same class as the rendering question: which real clients
  declare `elicitation` (and which modes) and `sampling` (and `sampling.tools`) — sampling
  support is historically the sparsest of all client capabilities.
- **Tooling note**: the `mcp-server-dev` plugin (anthropics/claude-plugins-official,
  installed 2026-06-12, user scope) carries live MCP-development skills; upstream:
  `github.com/anthropics/claude-plugins-official` → `plugins/mcp-server-dev/skills`.

## End goal

A teacher-facing prompt surface whose grouping makes the *planning moment* legible — which
prompts serve term-ahead curriculum planning, which serve lesson planning, which serve
resource adaptation — so users and assistants find the right workflow fast, and so outward
claims about capability inherit the same vocabulary instead of conflating moments (the
motivating instance: the 2026-06-12 executive briefing initially presented the anchored
what-next workflow as if it covered term-ahead sequence planning).

## Mechanism

Grouping is only worth what clients render and users perceive: WS1 grounds the vehicle in
the spec AND in observed client rendering before anything is ratified (the
`get-eef-evidence` invisibility lesson: spec-valid is not user-visible). The taxonomy is
designed over the real seven-prompt inventory and ratified by the owner (feature-shaping is
the owner's decision); application is one small TDD cycle plus documentation alignment; the
taxonomy's empty cells then become honest roadmap candidates rather than implied
capabilities.

## Means

Four workstreams in the frontmatter todos: spec/client grounding → taxonomy design (owner
gate) → apply + align → gap surfacing.

## Prerequisites

- **Blocking (WS3 only)**: owner ratifies the taxonomy at WS2.
- **Beneficial**: the era-pinning cure and v3 naming work share no surface with this plan;
  no sequencing dependency exists with the comms research. Minimum shippable without
  anything else: the full plan stands alone.

## Acceptance criteria and proof contract

| Id | Acceptance | Proof |
| --- | --- | --- |
| ws1 | A grounded verdict names the vehicle(s) with spec citations AND per-client rendering evidence for at least Cursor + Claude Code; mcp-expert review absorbed | non-code: verdict section in this plan + review verdict |
| ws2 | A ratified taxonomy maps all seven prompts to named groups with the planning-moment axis explicit; owner sign-off recorded | non-code: ratified table in this plan |
| ws3 | Prompt definitions carry the grouping via the chosen vehicle; descriptor unit tests assert it; `pnpm check` green; live listing verified against two clients; ADR-123 table carries the group column; briefing-family prose uses the group vocabulary | unit + e2e + non-code |
| ws4 | Empty-cell candidates surfaced to the owner as a short list with data-support notes; owner disposition recorded | non-code |

## Non-goals

- No new prompts in this plan (WS4 surfaces candidates; building any is its own owner-gated
  work).
- No tool or resource regrouping — prompts only (tools/resources may follow the precedent
  later if the owner extends it).
- No client-specific workarounds; the vehicle must be spec-legal.

## Risks

- **Client rendering variance** — the grouping vehicle may be invisible in some clients
  (the known structuredContent precedent); mitigated by WS1's rendering-evidence gate.
- **Taxonomy bikeshed** — bounded by the owner's seed groups and the seven-prompt reality;
  WS2 proposes one table, the owner edits or ratifies.

## Foundation alignment

`principles.md` simplicity-first (smallest spec-legal vehicle that clients render);
`testing-strategy.md` (descriptor tests in the WS3 cycle); plan-body first-principles check
fires at WS3 before applying the vehicle (does WS1's rendering evidence still hold for the
deployed client versions?). Lifecycle per `templates/components/lifecycle-triggers.md`:
completion updates ADR-123 and archives this plan with outputs mined.
