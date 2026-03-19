# Pine-Scripts Integration: Field Report

> **Source**: `pine-scripts` (trading strategy repository — Python + Pine Script v6)
> **Date**: 2026-03-17/18
> **Integration scope**: Full Practice Core + operational layer + sub-agent system + plan infrastructure

This document captures everything learned from installing and activating the Practice in `pine-scripts`. It is written for the benefit of the Practice Core, the oak-mcp ecosystem, and any future repository that receives the Practice.

---

## 1. The Central Insight: "Not Even Wrong"

The most dangerous failure mode in Practice integration is **mechanical accuracy without depth**. The initial `pine-scripts` integration was structurally correct — all files present, all references valid, all paths resolving — and yet the Practice was inert. The metacognition directive was a flat checklist. The principles were a list of rules without reasoning. The sub-agent components were empty stubs that maintained the directory structure but contained no operational content.

This is worse than a broken integration because it looks like it works. An agent following these files would believe it was engaging in metacognition, applying principles, and leveraging a reviewer team — but none of it would actually do anything. Wolfgang Pauli's dismissal applies precisely: **"not even wrong."**

### Why this matters for the Practice Core

The Practice Core currently communicates *structure* well — file names, directory layout, frontmatter conventions, fitness ceilings. What it does not yet communicate effectively is *activation energy*. The difference between a Practice that lives and one that is architecturally correct but inert is the difference between having a metacognition directive that says "reflect on your work" and one that creates nested feedback loops with specific anti-pattern detection.

### Recommendation

The Practice Core should include at least one fully-realised reference implementation of each critical artefact type (metacognition directive, reviewer template, consolidated reading list). Not as templates to fill in, but as working examples that demonstrate the **depth** expected. The receiving agent can then adapt them to the domain, but the intent is visible and the activation energy is already present.

---

## 2. The Recursive Failure of Metacognition

During integration, the metacognition directive was the most telling failure. The `pine-scripts` version said things like "reflect on your thoughts" — which is the metacognition equivalent of a function that returns its own name. An agent following those instructions would produce text that looks like reflection but contains no actual recursive depth.

The oak-mcp metacognition directive works because it creates **negative feedback loops**: specific questions that force the agent to examine whether it is actually doing what it claims to be doing, and **positive feedback loops**: structures that reward genuine insight discovery with deeper investigation.

The critical mechanism is the **anti-pattern gallery**: by showing what shallow metacognition looks like, the directive gives the agent something concrete to avoid. Without these anti-patterns, the agent has no way to distinguish between "I reflected" and "I performed the text-production pattern that resembles reflection."

### Convergent Discovery

The `pine-scripts` integration independently arrived at the same conclusion as the `metacognitive-primacy.md` proposal already in this incoming folder: metacognition should be part of the Practice Core, not an optional operational artefact. The evidence from `pine-scripts` strongly supports this — metacognition was the single artefact whose absence most completely disabled the Practice's self-correction capability.

### Practical Suggestion

If metacognition moves into the Practice Core:
1. Include the full directive (with anti-patterns, feedback loops, and the thoughts → reflections → insights pipeline) as a reference implementation
2. Add it to `practice-bootstrap.md` as the **first** capability to verify after installation
3. Create a "metacognition smoke test" — a simple prompt that distinguishes working metacognition from the mechanical reproduction pattern

---

## 3. Agent Files Are First-Class Infrastructure

The `pine-scripts` integration surfaced a principle that was latent in oak-mcp but never explicitly codified: **Practice files are not documentation — they are executable agent infrastructure.**

When we applied engineering principles (DRY, Single Responsibility, Canonical-First) to the Practice files themselves, the quality improved dramatically:
- `principles.md` had TDD defined three times in different ways — consolidating to one authoritative definition eliminated contradictions
- `strategy-context-guardrails` lived inline in a Cursor `.mdc` adapter instead of canonically — moving it to `.agent/rules/` made it available to all platforms
- `start-right-quick.md` duplicated content from `start-right.prompt.md` — making it a thin wrapper eliminated drift risk

This principle has been codified as a rule in `pine-scripts` (`.agent/rules/agent-files-are-infrastructure.md`) and placed in `.agent/practice-context/outgoing/` for ecosystem propagation. It may warrant inclusion in the Practice Core's `practice.md` or `principles` canon.

### Evidence from the field

The specific DRY violations found were not trivial — they were actively harmful:
- Three different TDD definitions meant an agent could pick the weakest one
- Inline adapter content meant Claude agents never saw the strategy guardrails
- Duplicated reading requirements meant updates had to happen in multiple places (and didn't)

### Recommendation

Add "Agent Files Are First-Class Infrastructure" to the Practice Core as either a core principle or a bootstrap-phase verification. Every integration should check: are Practice files being treated as code (DRY, testable, consistent) or as "just docs" (duplicated, inconsistent, un-maintained)?

---

## 4. The Sub-Agent Component Architecture

The three-layer sub-agent model (components → templates → platform adapters) was validated and extended during this integration.

### What worked

The component extraction yielded six genuinely reusable building blocks:

| Component | Purpose |
|-----------|---------|
| `behaviours/subagent-identity.md` | Three-line identity declaration format |
| `behaviours/reading-discipline.md` | Universal reading requirements + the discipline behind them |
| `principles/review-discipline.md` | Observe/analyse/report mode, severity classification, communication principles |
| `principles/dry-yagni.md` | DRY and YAGNI guardrails as a reviewable fragment |
| `architecture/reviewer-team.md` | Team roster, collaboration model, escalation vs delegation |
| `personas/default.md` | Calm, thorough, evidence-driven reviewer personality |

Each template now has a `Component References (MANDATORY)` section that reads and applies the relevant components before proceeding to domain-specific content. This means:
- A new reviewer template starts with all universal behaviours pre-loaded
- Changing a universal behaviour (e.g., adding a new reading requirement) updates all reviewers at once
- Domain-specific content stays in the template where it belongs

### What needs attention

1. **The stub problem**: The original `pine-scripts` integration had four component files that were empty stubs maintaining directory structure. This is the "not even wrong" failure mode applied to infrastructure. **Components should either exist with real content or not exist at all.** A stub component is worse than a missing component because it teaches the agent that the component system is performative rather than functional.

2. **Persona expansion**: The trading domain will likely need domain-specific personas (e.g., a risk-conservative persona for strategy reviewers, an adversarial persona for security reviewers). The component model supports this cleanly — templates reference their persona component, and swapping personas is a one-line change.

3. **New reviewer types**: `pine-scripts` will likely expand into domain-specific reviewers (strategy-reviewer, risk-model-reviewer). The component infrastructure makes this cheap — each new reviewer composes from existing components and adds its own domain reading requirements and checklists.

### Recommendation for the Practice Core

The sub-agent composition model should be documented as a recommended pattern in the Practice Core. Not mandated (small repos may not need it), but described well enough that repos adopting it can do so correctly on first attempt. The key insight to communicate: **composition enables growth without proportional maintenance cost.**

---

## 5. Plan Lifecycle Model

The `pine-scripts` integration adopted a `future → current → active → archive` lifecycle for plans, grouped by domain:

```text
.agent/plans/
├── README.md
├── strategy-research/
│   ├── active/     ← In-flight: someone is implementing right now
│   ├── current/    ← Queued: part of the current tranche, scoped and ready
│   ├── future/     ← Strategic: planned work, may not be fully scoped yet
│   └── archive/    ← Completed or superseded
└── agentic-engineering/
    └── (same lifecycle structure)
```

### Observation: "current" is ambiguous

The user noted that "current" is "a little confusing and perhaps should change." The distinction between "current" (scoped, queued, part of this batch) and "active" (someone is actively implementing it right now) is meaningful but the word "current" doesn't communicate it well. Alternatives considered:
- `queued/` — clearer but implies a strict ordering that may not exist
- `ready/` — emphasises that the plan is scoped and implementable
- `next/` — clearer sequencing but implies a single next step
- `scoped/` — the most precise description of the state

No recommendation here — this is a naming decision that benefits from broader ecosystem input.

### What worked well

- Domain grouping (`strategy-research/` vs `agentic-engineering/`) prevents plan sprawl and makes it easy to find relevant plans
- The `.plan.md` file extension convention distinguishes plans from other markdown files
- Archive retention (vs deletion) is valuable — completed plans are reference material for future similar work

---

## 6. The Canonical-First Enforcement Problem

The canonical-first principle (substantive content in `.agent/`, thin adapters in `.cursor/`, `.claude/`, `.codex/`, `.agents/`) is easy to state and hard to enforce. During `pine-scripts` integration, we found:

- `strategy-context-guardrails.mdc` contained full inline content instead of delegating to a canonical file
- Several new rules created in `.agent/rules/` had no corresponding adapters in platform directories
- The `.agents/` discovery layer was missing entirely

### Why enforcement fails

1. **Path of least resistance**: When creating a new rule, the quickest path is to write it where the platform expects it (e.g., `.cursor/rules/foo.mdc`). The extra step of creating the canonical file first and then writing a thin adapter requires discipline that the Practice doesn't currently enforce.

2. **Invisible drift**: When a canonical file and its adapter diverge, there is no automatic detection. The adapter might contain stale content, additional content, or missing references.

3. **Missing adapters**: When a new canonical file is created, the agent must remember to create adapters for all supported platforms. With 4+ platform directories, this is easy to forget.

### The adapter-generation plan

`pine-scripts` has created an `adapter-generation.plan.md` proposing a manifest-driven approach:
- A single `adapter-manifest.yaml` declares all canonical artefacts and their adapter targets
- A Python script generates/updates adapters from the manifest
- A portability validation script checks for drift, missing adapters, and inline content

This is in `future/` — not yet implemented — but the design addresses all three enforcement failures above.

### Recommendation

The adapter-generation pattern should be standardised across the ecosystem. Each Practice installation could include a shared validation script that checks canonical-first compliance. This is infrastructure that has high reuse value and prevents the most common Practice drift pattern.

---

## 7. Practice Context as Learning Surface

The `pine-scripts` integration demonstrated that `.agent/practice-context/incoming/` files are more valuable as **learning material** than as simple transfer documents.

When processing the incoming context files (`starter-templates.md`, `reviewer-system-guide.md`, `platform-adapter-reference.md`), we created a `PROCESSING-LOG.md` that documented:
- What was learned from each file
- Gaps identified in the receiving repo's existing setup
- Actions taken to address those gaps
- Remaining opportunities for future work

This processing-log pattern transformed a "clear the inbox" task into a structured learning event that produced actionable insights.

### Recommendation

Add a `PROCESSING-LOG.md` template to the Practice Core's context exchange documentation. When a repo processes its incoming context, it should be encouraged to create a processing log rather than simply deleting the received files. The log becomes part of the repo's institutional memory and feeds back into the Practice's learning loop.

---

## 8. Fitness Ceiling Tension

Several Practice Core files in `pine-scripts` exceeded their fitness ceilings due to legitimate content growth:
- `practice-lineage.md`: ceiling 80, actual ~115 (after adding 6 new learned principles from the integration)
- `practice-bootstrap.md`: ceiling 60, actual ~80 (after adding metacognition failure mode documentation)

### The tension

Fitness ceilings exist to prevent bloat and encourage tightening. But when content grows because the Practice itself is evolving (new principles discovered, new failure modes documented), the ceiling creates pressure to either:
1. Increase the ceiling (which weakens the signal)
2. Split the file (which may fragment naturally cohesive content)
3. Compress the content (which may lose nuance)

### Observation

The current fitness ceiling system doesn't distinguish between "bloat" (unnecessary content) and "growth" (legitimate evolution). A file that grows from 60 to 80 lines because it now documents a critical failure mode is qualitatively different from one that grows because it accumulated redundant instructions.

### Suggestion

Consider adding a `ceiling_justification` field to the provenance frontmatter that documents why the current ceiling is set where it is. When content exceeds the ceiling, the next agent must read the justification and decide whether the growth is legitimate evolution (→ update ceiling + justification) or bloat (→ tighten content).

---

## 9. The `.agents/` Cross-Platform Discovery Layer

The `.agents/skills/` directory pattern provides a cross-platform discovery surface that works for tools like Codex that don't have their own convention directory. In `pine-scripts`, we created 14 discovery wrappers:

- 9 command skills (`jc-metacognition/SKILL.md`, `jc-commit/SKILL.md`, etc.)
- 5 capability skills (`napkin/SKILL.md`, `distillation/SKILL.md`, etc.)

Each wrapper is 6-8 lines: frontmatter (name + description) and a single `Read and follow` directive pointing to the canonical file.

### Value proposition

The `.agents/` layer solves the problem of tools that scan for capabilities in a specific directory structure. Without it, these tools can't discover the Practice's commands and skills. With it, every capability is discoverable through a standard interface while the canonical content remains in `.agent/`.

### Recommendation

Document the `.agents/` pattern in the Practice Core as an optional adapter layer. Include guidance on:
- When to create it (when using tools that scan for `SKILL.md` files)
- How to maintain it (thin wrappers only, no substantive content)
- How to validate it (the portability validation script should check `.agents/` consistency)

---

## 10. Integration Process Improvements

Based on the full `pine-scripts` journey, here are specific improvements to the Practice integration process:

### 10a. Pre-flight checklist

Before starting integration, the receiving repo should answer:
1. What are the primary languages and tooling? (→ affects testing-strategy, principles, sub-agent reading requirements)
2. What domain-specific guardrails exist? (→ must be preserved as canonical rules)
3. What existing automation/CI exists? (→ affects config-reviewer scope)
4. How many reviewer types are needed? (→ determines whether to use the component model)

### 10b. Integration smoke test

After installation, run a structured verification:
1. **Metacognition test**: Run the metacognition command. Does the output contain genuine recursive depth, or is it mechanical?
2. **DRY test**: Search for duplicated content across Practice files. Any duplication found is a red flag.
3. **Adapter completeness test**: For every file in `.agent/rules/`, verify corresponding adapters exist in all supported platform directories.
4. **Reference resolution test**: Grep for all file path references in Practice files. Do they all resolve?
5. **Reading requirements test**: Run a sub-agent. Does it actually read its reading requirements, or does it skip them?

### 10c. Post-integration reflection

After installation AND verification, run metacognition focused on:
- What feels different about this repo's Practice vs the source?
- What domain adaptations were made and why?
- What was hardest to transfer and what does that reveal about the Practice Core's portability?

---

## 11. Trading Domain Observations

These are domain-specific observations that may not directly improve the Practice Core but provide context for how the Practice operates in a specialised domain.

### Strategy guardrails need special treatment

Trading strategy code has an unusual property: small parameter changes can have large financial consequences. The `strategy-context-guardrails.md` rule exists specifically because well-intentioned "fixes" (like changing order types or session scope to "make trades happen") can dramatically alter risk profile.

This is analogous to security-sensitive code in other domains — the Practice already handles this through the security-reviewer, but strategy code needs similar "don't change this without explicit approval" protection. The guardrails rule addresses this.

### Pine Script v6 constraints

Pine Script is a domain-specific language with constraints that affect Practice operation:
- One script declaration per file (can't refactor into modules)
- Helper function names must be globally unique (no namespacing)
- `na`-initialised variables need explicit typing
- No package manager, no testing framework, no linting

These constraints mean the Python side of the repo carries all the engineering quality burden, while the Pine side operates under a different (more constrained) engineering model. The Practice adapts by having strategy-specific guardrails for Pine and standard engineering expectations for Python.

---

## 12. Emerging Patterns for Future Practice Evolution

### 12a. Practice health metrics

The consolidation command currently checks for fitness ceiling compliance, reference resolution, and documentation currency. These could be formalised as **Practice health metrics** — a standard dashboard that any Practice installation can run to assess its own health:

- Fitness ceiling compliance rate
- Adapter completeness rate
- Cross-reference resolution rate
- DRY violation count
- Time since last consolidation
- Time since last metacognition run

### 12b. Practice maturity model

Based on the `pine-scripts` journey, there seem to be distinct maturity levels:

1. **Structural**: Files present, directories correct, references resolve
2. **Operational**: Directives have depth, rules have reasoning, sub-agents function
3. **Self-correcting**: Metacognition produces genuine insights, consolidation catches drift, fitness functions prevent bloat
4. **Evolving**: Practice-lineage captures learned principles, outgoing context proposes improvements, incoming context is processed for insights

A newly integrated Practice might start at level 1 and the integration process should explicitly aim for level 3 before declaring completion.

### 12c. The "plasmid quality" problem

When Practice content is exchanged between repos, the quality of the plasmid (the transferred content) varies enormously. A plasmid that contains shallow mechanical reproductions of directives is actively harmful — it teaches the receiving repo that the Practice is performative. A plasmid that contains full-depth directives with anti-patterns, reasoning, and examples transfers the actual activation energy.

The Practice Core should provide guidance on **plasmid quality**: what makes a good exchange, what signals indicate a shallow transfer, and how the receiving repo can verify depth before accepting content as "integrated."

---

## Summary of Recommendations

Ordered by estimated impact:

1. **Move metacognition into Practice Core** (convergent with `metacognitive-primacy.md`)
2. **Add "agent files are infrastructure" principle** to Practice Core
3. **Include reference implementations** of critical artefacts in Practice Core
4. **Add integration smoke test** to Practice bootstrap process
5. **Document the sub-agent component model** as a recommended pattern
6. **Standardise the adapter-generation pattern** across the ecosystem
7. **Add `PROCESSING-LOG.md` template** for context exchange
8. **Add `ceiling_justification`** to fitness ceiling governance
9. **Document `.agents/` discovery layer** as an optional adapter pattern
10. **Define Practice maturity levels** for self-assessment
