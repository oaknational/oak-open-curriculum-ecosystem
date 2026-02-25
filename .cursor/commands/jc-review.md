# Review

Perform a review of the work described by the user or inferred
from context.

## Scope

Determine the review scope from the user's request:

- **Post-change review** (default): Review recent changes only.
  Check `git diff` and `git status` to identify what changed.
- **Broad review**: Review a specific area, module, or subsystem.
  The user will specify the scope.
- **Full codebase review**: Only when explicitly requested. This
  is expensive — confirm scope with the user before proceeding.

## Step 1: Quality Gates

Run the full quality gate sequence from repo root. If any gate
fails, report it as a critical finding.

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

## Step 2: Triage Specialists

Answer these five questions to identify which specialists
are needed (from the `invoke-code-reviewers` rule):

1. Does this touch auth, secrets, PII, or OAuth? → `security-reviewer`
2. Does this change module boundaries, imports, or public APIs? → architecture reviewer(s)
3. Does this add or modify tests? → `test-reviewer`
4. Does this change types, generics, or schema flow? → `type-reviewer`
5. Does this change tooling configs or quality gates? → `config-reviewer`

Documentation drift (`docs-adr-reviewer`) applies whenever
behaviour or architecture changes, even if no docs are edited.

Always invoke `code-reviewer`. Only invoke other specialists
when the triage questions indicate they are relevant.

## Step 3: Invoke Specialists

Use the Task tool with `readonly: true` and the appropriate
`subagent_type`. Give each reviewer specific context about
what changed and what to focus on.

Do NOT invoke specialists that are not relevant. Report
which were invoked and which were skipped (with rationale).

## Step 4: Consolidate and Report

Produce a report with:

- **Summary**: Overall assessment (PASS / PASS WITH SUGGESTIONS / ISSUES FOUND)
- **Quality Gate Status**: Which gates passed/failed
- **Specialist Findings**: Key findings from each invoked reviewer
- **Critical Issues**: Must fix (blocking)
- **Improvements**: Should fix (non-blocking)
- **Positive Observations**: What is working well
- **Specialists Invoked**: Which reviewers ran and which were N/A
- **Follow-up Actions**: Concrete next steps if issues found

## After the Review

If the review identified issues that were fixed, re-run
affected quality gates to confirm the fixes.

If the review is part of a plan's adversarial review phase,
document findings using the severity scheme from the
[adversarial-review component](/.agent/plans/templates/components/adversarial-review.md):
BLOCKER, WARNING, NOTE.
