# Sub-Agent Component Model: Standardisation Proposal

> **Source**: `pine-scripts` integration experience
> **Status**: Proposal for Practice Core inclusion

## Problem

When the Practice is installed in a new repo, sub-agent templates are typically copied wholesale from the source repo. This creates two problems:

1. **Universal content is duplicated across templates** — each template independently defines its reading discipline, communication style, severity classification, and DRY/YAGNI guardrails. Changes to any of these require updating all templates.

2. **Domain adaptation requires editing deep inside templates** — to adapt a template for a new domain, the integrator must identify which parts are universal (keep) and which are domain-specific (adapt). Without clear separation, this is error-prone.

## Proposed Model: Three-Layer Composition

```text
Layer 1: Components     (shared, reusable, domain-agnostic)
Layer 2: Templates      (domain-specific, compose from components)
Layer 3: Adapters       (platform-specific, delegate to templates)
```

### Layer 1: Components

Canonical location: `.agent/sub-agents/components/`

```text
components/
├── behaviours/
│   ├── subagent-identity.md     → Three-line identity declaration format
│   └── reading-discipline.md    → Universal reading requirements + the discipline
├── principles/
│   ├── review-discipline.md     → Observe/analyse/report mode, severity, communication
│   └── dry-yagni.md             → DRY and YAGNI guardrails for reviewers
├── architecture/
│   └── reviewer-team.md         → Team roster, collaboration, escalation patterns
└── personas/
    └── default.md               → Default reviewer personality
```

Each component is a self-contained instruction fragment that a template references via:

```markdown
## Component References (MANDATORY)

Read and apply each of these before proceeding:

- `.agent/sub-agents/components/behaviours/subagent-identity.md`
- `.agent/sub-agents/components/behaviours/reading-discipline.md`
- `.agent/sub-agents/components/principles/review-discipline.md`
```

### Layer 2: Templates

Each template composes from components and adds domain-specific content:

```markdown
# Code Reviewer: Engineering Excellence Guardian

## Component References (MANDATORY)
[...references to shared components...]

## Domain Reading Requirements
[...domain-specific documents to read...]

## When Invoked
[...domain-specific workflow...]

## Review Checklist
[...domain-specific checks...]

## Output Format
[...domain-specific reporting format...]
```

### Layer 3: Adapters

Platform wrappers that delegate to templates:
- `.cursor/rules/invoke-code-reviewers.mdc` → Cursor invocation
- `.claude/agents/code-reviewer.md` → Claude sub-agent
- `.agents/skills/code-reviewer/SKILL.md` → Codex discovery

## Benefits

| Dimension | Without Components | With Components |
|-----------|-------------------|-----------------|
| New reviewer | Copy-paste ~200 lines, edit throughout | Compose from components + add domain content |
| Change communication style | Edit all 5 templates | Edit `personas/default.md` once |
| Add reading requirement | Edit all 5 templates | Edit `reading-discipline.md` once |
| Domain adaptation | Hunt through templates for universal vs specific | Clear separation — components are universal, template body is domain |
| Maintenance cost at N reviewers | O(N) for any universal change | O(1) for universal changes, O(N) only for domain changes |

## Implementation Notes

### What goes in components (universal)

- Identity declaration format
- Reading discipline (universal docs: AGENT.md, principles.md)
- Review discipline (mode, severity levels, communication style)
- DRY/YAGNI guardrails
- Team collaboration model
- Reviewer personality

### What stays in templates (domain-specific)

- Delegation triggers (when to invoke this reviewer)
- Domain reading requirements (testing-strategy.md, etc.)
- Domain checklists (type safety for Python, boundary compliance for architecture)
- Domain output format sections
- Domain key principles

### Stub warning

**Components must contain real content or not exist.** During the `pine-scripts` integration, four stub components were discovered — files that existed to maintain directory structure but contained no operational content. This is the "not even wrong" failure mode: the agent believes it has loaded a capability (reading discipline, review discipline) but nothing was actually loaded. Empty components are actively worse than missing components because they suppress the error signal that would prompt creation of real content.

## Recommendation for Practice Core

1. Document the three-layer model in Practice Core as a **recommended pattern** for repos with 3+ reviewer types
2. Include the six standard components as reference implementations (not stubs)
3. Provide a minimal template example showing how to compose from components
4. Note that repos with fewer reviewers can use self-contained templates without the component layer
