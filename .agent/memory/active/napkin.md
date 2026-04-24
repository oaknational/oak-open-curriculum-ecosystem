# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the register at
[`../operational/repo-continuity.md § Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status).

---

**Rotation**: 2026-04-22. Outgoing napkin (2,323 lines, sessions
2026-04-22 through 2026-04-24) archived to
`archive/napkin-2026-04-22b.md`. Nine behavioural learnings
extracted and merged into `distilled.md`. Pattern candidates
carried forward in the pending-graduations register.

Prior rotation: 2026-04-22 (sessions 2026-04-19 through 2026-04-21,
archived to `archive/napkin-2026-04-22.md`).

---

## 2026-04-22 (consolidation session) — agent infrastructure portability audit + napkin rotation (claude-code / claude-opus-4-6-1m)

**Observations**:

- **Fitness validator does not exclude markdown links from
  prose line-length**: long markdown link lines (which cannot
  be broken across lines) trigger prose-width violations. The
  `classifyLines()` function in
  `scripts/validate-practice-fitness.mjs` should classify
  lines that are predominantly link content as a distinct kind
  (e.g. `link`) and exclude them from prose-width checks.
  Enhancement candidate for a future session. Temporarily
  worked around by raising `fitness_line_length` to 200 in
  `repo-continuity.md` (the worst-affected file); revert
  when the validator is enhanced.

- **Token budget per session is an unrecognised external
  constraint**: models have a finite context window (currently
  200k tokens typical, moving towards 1M). Every rule, skill,
  directive, plan, and memory file loaded into a session
  consumes budget. This budget is not yet explicitly designed
  for — there is no canonical definition of what a session's
  token budget IS, nor any system for measuring or managing
  the load. This is a key concept that needs a canonical
  definition and eventually explicit design consideration.
  Recognising it here; full design is future work.

- **Loop-closure evidence** (extracted from Session 5 close
  summary during repo-continuity archival): the
  `capture → distil → graduate → enforce` pipeline (ADR-150 +
  PDR-011) fired end-to-end within a single session for the
  first time during Session 5. Owner metacognition intervention
  was load-bearing — neither Class A.1 nor A.2 tripwires fire
  on close-time deferral honesty, which is the gap the
  deferral-honesty rule addresses.

- **Distilled graduation exposed structural gaps in the
  guidance system**: triaging individual distilled entries
  revealed that several categories of guidance have no proper
  home in the Practice. The categories and gaps identified:

  1. **Behavioural norms** (agent-human collaboration model,
     scope discipline, risk classification, dialogue-not-
     authority) — no directive exists. Needs a new directive
     (e.g. `behavioural.md` or `collaboration.md` in
     `.agent/directives/`).
  2. **Planning discipline** (discoverability, narrative-first
     sequencing, parent-child reconciliation, validation
     closures) — plan templates have structure but not process.
     Needs a planning skill and/or directive. Suggests a gap
     in specialist sub-agents (planning expert).
  3. **Portability principles** — general cross-platform agent
     infrastructure principles need a PDR (genotype);
     repo-specific application needs an ADR (phenotype). Both
     missing.
  4. **Agent-operational gotchas** (tool-specific behaviours
     like `replace_all` corruption) — NOT repo documentation.
     These are about specific agent tooling, not the
     codebase.

  The meta-learning: when items resist classification into
  existing homes, the question is not "where does this item
  go?" but "what does the system need to look like?" Triage
  is a surface activity; systems design is the real work.

  Owner feedback on the collaboration model: "not 'who has
  authority' but 'how can we approach this as a team'" —
  the agent should constructively challenge, ask questions,
  give bidirectional feedback. Overrides are rare, not
  default. This is fundamentally different from "apply
  feedback fully, don't negotiate."

- **`vercel-labs/skills` tool model vs our model**: the skills
  CLI treats `.agents/skills/` as canonical with symlinks
  outward. Our repo treats `.agent/` (singular) as canonical
  with thin wrappers everywhere. After `npx skills add`, a
  canonicalisation step is needed. This interaction is now
  documented in the portability remediation plan at
  `.agent/plans/agentic-engineering-enhancements/current/agent-infrastructure-portability-remediation.plan.md`.
