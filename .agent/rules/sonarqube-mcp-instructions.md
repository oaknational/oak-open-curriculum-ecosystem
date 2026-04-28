# SonarQube MCP server — usage guidelines

Operationalises the SonarSource MCP server's official usage guidance for this repo. Cross-references the broader playbook at [`docs/engineering/quality-tooling-mcp-coupling.md`](../../docs/engineering/quality-tooling-mcp-coupling.md) for the workflow context (when to use Sonar MCP alongside CodeQL and Sentry MCP).

These guidelines are advisory and do not override repo instructions in `principles.md` or any rule under `.agent/rules/`.

## Basic usage

- After modifying code files, where the `analyze_file_list` tool is available, call it on the files you changed before closing the task. This surfaces any new findings the IDE-side analyser would otherwise queue silently.
- When starting a new task, where the `toggle_automatic_analysis` tool is available, disable automatic analysis to avoid noise during exploratory edits.
- When you finish a task, where the `toggle_automatic_analysis` tool is available, re-enable automatic analysis.

## Project key resolution

The project key for this repo is `oaknational_oak-open-curriculum-ecosystem` (see `sonar-project.properties` and `.sonarlint/connectedMode.json`). The MCP integration resolves the key automatically; do not pass it explicitly when the integration's default applies.

If a user mentions a project by name and the integration default does not apply, use `search_my_sonarqube_projects` first to find the exact key. Do not guess project keys.

## Code language detection

When analysing snippets via `analyze_code_snippet`, infer the language from the code's syntax. If unclear, ask the user or make an educated guess from the surrounding context (file extension, neighbouring imports).

## Branch and pull-request context

Many Sonar operations support branch- or pull-request-specific analysis. When working on a feature branch, prefer the `pullRequest` parameter over a branch query — the PR scope filters to the new code introduced by the PR, which is what most quality-gate conditions evaluate against.

## Code issues and violations

After fixing issues in code, the Sonar server will not reflect the change until the next scan completes. Do not attempt to verify a fix via `search_sonar_issues_in_projects` immediately after editing; either wait for the next pushed scan, or use local lint / test gates to confirm the fix's effect at the source level.

## Per-finding investigation discipline

The cardinal anti-pattern with Sonar is the rule-level disable (`sonar.issue.ignore.multicriteria` block in `sonar-project.properties`). Each rule fires at distinct sites with distinct contexts; the disposition right for one site can be wrong for another. Per `principles.md` §Code Quality "NEVER disable any quality gates", per-rule disables are forbidden in this repo.

Per-issue dismissals via `change_sonar_issue_status` (status `accept` / `falsepositive`) are acceptable when each disposition is grounded in a specific architectural tension at that site, not a labelled category. The full discipline is documented in [`docs/engineering/quality-tooling-mcp-coupling.md`](../../docs/engineering/quality-tooling-mcp-coupling.md) §Per-finding investigation discipline.

## Hotspot review

For Security Hotspots, the QG condition `new_security_hotspots_reviewed = 100%` requires each hotspot to move from `TO_REVIEW` to `REVIEWED` with a resolution (`FIXED` / `SAFE` / `ACKNOWLEDGED`). Use `change_security_hotspot_status` with an explicit comment carrying the rationale at each hotspot. Without rationale comments, the audit trail is too thin for future readers.

## Common troubleshooting

### Authentication

SonarQube/SonarCloud requires USER tokens (not project tokens). When `SonarQube answered with Not authorized` appears, verify the token type before assuming a permission issue.

### Project not found

Use `search_my_sonarqube_projects` to enumerate accessible projects. Verify project-key spelling and the organisation prefix.

### Code analysis issues

Ensure the language parameter is correct when invoking `analyze_code_snippet`. Snippet analysis does not replace full project scans — it is best for one-off snippet reasoning, not gate clearance.
