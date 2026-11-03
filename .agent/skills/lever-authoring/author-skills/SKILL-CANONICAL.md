---
name: author-skills
classification: active
description: Create or update repo-local skills and their generated platform adapters. Use when adding a new skill under `.agent/skills/`, revising an existing skill, registering a skill in the repository's skill indexes, or deciding whether reusable guidance belongs in a skill rather than a rule, command, directive, sub-agent, or plan.
---

# Author Skills

Create repo-local skills that follow this workspace's
existing pattern: canonical instructions in `.agent/skills/`,
thin platform adapters generated into `.claude/skills/` and
`.agents/skills/` under the estate's prefix (`oak-`), and
discoverability through the repo indexes.

## Goal

Add or revise a skill without introducing a second
convention.

## Design Principles

### Keep context lean

Assume the receiving agent is already capable. Put only the
repo-specific workflow, decisions, and non-obvious guidance
into the skill. Favour crisp examples over long explanation.

### Match freedom to fragility

- Use plain prose when judgement is required and multiple
  approaches can work.
- Use structured steps when order matters.
- Use scripts only when the operation is repetitive or
  fragile enough that freehand execution is wasteful.

### Design for progressive disclosure

Keep `SKILL-CANONICAL.md` as the operational core. Split out detail
only when it would otherwise bloat the main skill:

- keep variant-specific detail in `references/`
- keep deterministic helpers in `scripts/`
- keep templates and output artefacts in `assets/`

Avoid deep reference chains. Link reference files directly
from `SKILL-CANONICAL.md`.

## First Question

Before writing anything, ask:

- Could this be a smaller change to an existing skill?
- Is the knowledge durable enough for a skill?
- Does this need a skill at all, or would a rule, command,
  directive, sub-agent, or plan be a better fit?

## Choose The Right Artefact

- Use a **skill** for reusable, on-demand guidance or
  workflows that should load only when relevant.
- Use a **rule** for behaviour that must happen
  automatically every session or every change.
- Use a **directive** for permanent repo policy or
  standards.
- Use a **command** for a named workflow with a fixed
  execution path.
- Use a **sub-agent** for specialist review or delegated
  judgement.
- Use a **plan** for ephemeral delivery work, not durable
  capability.

## Workflow

### 1. Define the job with concrete triggers

Capture the prompts and situations that should invoke the
skill. The description in the frontmatter is the trigger, so
make it specific and complete:

- say what the skill does
- say when to use it
- include the file or workflow context if that helps
- prefer real trigger phrases over abstract labels

Put trigger information in the frontmatter description, not
in a "when to use" section buried in the body.

Ground the skill in concrete examples before writing it.
List the requests that should trigger it and the jobs it
must handle repeatedly.

Decide the classification up front:

- `active` for explicitly invoked or situational skills
- `passive` only for skills that should apply every session
  without prompting

### 2. Choose a stable name

Use lowercase letters, digits, and hyphens only.

- prefer short, verb-led names
- keep the folder name identical to the skill name
- avoid vague names like `helper` or `workflow`
- namespace by tool or domain only when it improves
  triggering clarity

### 3. Design the smallest useful skill

Prefer a single `SKILL-CANONICAL.md` first.

Add bundled resources only when they remove repeated work:

- `scripts/` for deterministic steps that would otherwise be
  rewritten
- `references/` for detail too bulky for `SKILL-CANONICAL.md`
- `assets/` for templates or files used in output

Put reusable resources in the canonical skill folder, never in
a platform adapter: the adapters are generated and carry only
the description and the pointer to the canonical.

Do not add auxiliary docs such as `README.md`,
`CHANGELOG.md`, or setup guides inside the skill folder.

### 4. Create the canonical skill

Canonical skills live at `.agent/skills/<family>/<name>/SKILL-CANONICAL.md`. Canonicals group by concern in a family directory (`.agent/skills/README.md`); the generated adapters stay flat.

Local frontmatter convention:

```yaml
---
name: your-skill-name
classification: active
description: Explain what the skill does and when to use it.
---
```

Keep the body imperative. Tell another agent what to do, not
what you were thinking when you wrote the skill. Use British
English to match `.agent/directives/AGENT.md`.

Keep the skill under roughly 500 lines. If it is heading
towards that size, split by responsibility rather than
compressing everything into one file.

Use repo-root-relative inline code paths such as
`docs/architecture/...` or `.agent/directives/...` when
referring to files outside the skill folder. This avoids the
depth-counting mistakes that happen with relative markdown
links from a canonical skill file.

Do not introduce `agents/openai.yaml` into `.agent/skills/`
unless the repo adopts that convention explicitly. The
checked-in local pattern is canonical skill plus generated
adapter, not canonical skill plus UI metadata.

If you are creating a standalone Codex skill outside this
repo's canonical `.agent` layer, the system
`skill-creator/scripts/init_skill.py` scaffold may still be
useful. For repo-local `.agent` skills, skip it unless this
repo deliberately adopts the `agents/openai.yaml` convention
it generates.

### 5. Add resources only when they earn their keep

If a section is variant-specific, large, or rarely needed,
move it into a referenced file instead of bloating the main
`SKILL-CANONICAL.md`.

Resource roles:

- `scripts/` for deterministic helpers
- `references/` for detail loaded only when needed
- `assets/` for templates or files used in output

Avoid duplicating the same information in both `SKILL-CANONICAL.md`
and `references/`.

If you add scripts:

- keep them deterministic
- keep dependencies minimal
- run them after writing them; do not assume they work
- explain from `SKILL-CANONICAL.md` when to use them

### 6. Generate the platform adapters

This repo keeps the source of truth in `.agent/skills/`. The
platform directories hold generated thin wrappers, never
copied instructions and never hand-written files:

```bash
pnpm skills:generate
pnpm skills:check
```

The generator renders one adapter per canonical into
`.claude/skills/oak-<name>/SKILL.md` and
`.agents/skills/oak-<name>/SKILL.md`, each carrying the
canonical's description and a `Read and follow` pointer to
`SKILL-CANONICAL.md`. The prefix is the estate's and is
required: an unprefixed run would mint a second skill estate
the pinned checker never sees. A body-only edit needs no
render; a description change does, because the rendered
adapters carry the description.

Do not copy `scripts/`, `references/`, or substantive
instructions into an adapter directory when they belong in
the canonical skill. Only add another platform's adapter
directory when the generator renders it; a hand-written
adapter drifts from the canonical at the next edit.

### 7. Register the skill

Update the family grouping in `.agent/skills/README.md` (the corpus index), and `.agent/practice-index.md` only when a decision record backs the skill.

Keep the listing text short and aligned with the canonical's
description. If the skill changes how other tooling works,
update the relevant command, rule, or sub-agent docs in the
same pass. Update
`.agent/memory/executive/cross-platform-agent-surface-matrix.md`
when the supported adapter surfaces change.

### 8. Validate the integration

Re-read the new skill end to end, then verify the repo
integration:

1. confirm the canonical file exists
2. confirm the generated adapters exist (`pnpm skills:check`)
3. confirm the skill appears in the repository's skill indexes
4. confirm any file references you added actually resolve
5. run `pnpm portability:check`: it validates each canonical's
   frontmatter and the skill permissions along with the rule and
   sub-agent adapters, not the rendered skill adapters (a
   description change that skipped the render failed the push,
   2026-10-02)

Useful checks:

```bash
SKILL_NAME=your-skill-name
rg -n "$SKILL_NAME|$SKILL_NAME/SKILL-CANONICAL.md" \
  .agent/skills/README.md .agent/practice-index.md \
  .claude/skills \
  .agents/skills
```

Repo-local note: the generic system `skill-creator`
validator expects only `name` and `description` in
frontmatter. This repo's canonical `.agent` skills also use
`classification`, so validate them against the local pattern
in `.agent/practice-core/practice-bootstrap.md` rather than
assuming the generic validator applies unchanged. In this
environment, the bundled validator also depends on `PyYAML`,
so it may fail before reaching any frontmatter checks.

After changing tracked files, follow
`.agent/skills/change-custody/gates/SKILL-CANONICAL.md` and run the repo's
quality gates.

### 9. Iterate after use

Use the skill on real work. When it struggles, fix the skill,
not just the immediate task outcome.

Typical iteration triggers:

- the trigger text is too vague to invoke reliably
- the skill repeats reference detail that should be split out
- a helper script should exist but does not
- the generated adapters read stale against the canonical
  (`pnpm skills:check` fails)
- reusable scripts or references are stranded outside the
  canonical skill folder

When a cure to a skill that carries an evaluation suite
(`evals/evals.json`) goes over the review bar, re-run the suite and take
a fresh human read of its outputs before the change merges: the owner's
human-review criterion; a green suite alone does not satisfy it.

## Done Criteria

A skill change is complete when:

- the canonical skill is created or updated
- bundled resources exist only if they are justified
- the generated adapters exist and `pnpm skills:check` passes
- the repository's skill indexes list it
- validation was actually run, not assumed
- the napkin records any new durable convention or gotcha

## Common Pitfalls

- Creating a new skill when an existing one only needs a
  sharper description or a new section
- Hand-writing a platform adapter instead of generating it
- Using fragile relative markdown links from skill files
- Adding placeholder folders or unused resources
- Editing a description without re-rendering the adapters: a
  rule's or skill's frontmatter (name, description, declaration)
  is part of the rendered adapters, so `pnpm portability:fix`
  follows any rule frontmatter edit and `pnpm skills:generate`
  any skill edit (the sibling estate under its prefix flag), both
  before the push and in both estates when the bytes are shared;
  `portability:check` does not read descriptions, `skills:check`
  does. A new slash skill also needs its `Skill(<prefix>-<name>)`
  entry in the tracked Claude settings, and a description
  containing ": " is quoted or the declaration parser refuses it
  (four seats, 2026-10-03 to 2026-10-08)
- Adding a passage without reading it against the skill's other
  sections and the rules it cites: a skills slice took six review
  findings, every one a contradiction between an added passage and
  a contract the same skill or a cited rule already stated
  (2026-10-02), and two later rounds found the same class
- Leaving reusable scripts or references outside the
  canonical skill folder
- Hiding trigger conditions in the body instead of the
  description
- Treating plans as permanent knowledge stores
- Forgetting to update the indexes after creating the skill

## References

- `.agent/practice-core/practice-bootstrap.md`
- `.agent/practice-core/practice.md`
- `.agent/directives/AGENT.md`
- `.agent/directives/principles.md`
- `.agent/skills/change-custody/gates/SKILL-CANONICAL.md`
- `.agent/skills/knowledge/napkin/SKILL-CANONICAL.md`
- the host's editorial directive, where it keeps one (OCE: editorial tone; jimcresswell.net:
  editorial guidance)
- `.agent/rules/skill-naming-and-description-quality.md`
