# SonarQube MCP server — usage guidelines

Operationalises the SonarSource MCP server's official usage guidance for this repo. Cross-references the broader playbook at [`docs/engineering/quality-tooling-mcp-coupling.md`](../../docs/engineering/quality-tooling-mcp-coupling.md) for the workflow context (when to use Sonar MCP alongside CodeQL and Sentry MCP).

The vendor-usage guidelines in this file are advisory and do not override repo instructions in `principles.md` or any rule under `.agent/rules/`; the §Ground in the governing doctrine section below is repo discipline, not vendor guidance.

## Basic usage

- After modifying code files, where the `analyze_file_list` tool is available, call it on the files you changed before closing the task. This surfaces any new findings the IDE-side analyser would otherwise queue silently.
- When starting a new task, where the `toggle_automatic_analysis` tool is available, disable automatic analysis to avoid noise during exploratory edits.
- When you finish a task, where the `toggle_automatic_analysis` tool is available, re-enable automatic analysis.

## Project key resolution

The project key for this repo is `oaknational_oak-open-curriculum-ecosystem` (see `.sonarlint/connectedMode.json`). The MCP integration resolves the key automatically; do not pass it explicitly when the integration's default applies.

If a user mentions a project by name and the integration default does not apply, use `search_my_sonarqube_projects` first to find the exact key. Do not guess project keys.

## Code language detection

When analysing snippets via `analyze_code_snippet`, infer the language from the code's syntax. If unclear, ask the user or make an educated guess from the surrounding context (file extension, neighbouring imports).

## Branch and pull-request context

Many Sonar operations support branch- or pull-request-specific analysis. When working on a feature branch, prefer the `pullRequest` parameter over a branch query — the PR scope filters to the new code introduced by the PR, which is what most quality-gate conditions evaluate against.

## Code issues and violations

After fixing issues in code, the Sonar server will not reflect the change until the next scan completes. Do not attempt to verify a fix via `search_sonar_issues_in_projects` immediately after editing; either wait for the next pushed scan, or use local lint / test gates to confirm the fix's effect at the source level.

At any measures-vs-index divergence (the quality gate scores findings the issue search returns zero rows for), query with the EXPLICIT `issueStatuses=OPEN,CONFIRMED,...` facet before concluding the index is blind: the default `issues/search` facet (and `resolved=false`) can return zero while the wider facet names the gate's exact findings with rule and line (worked instance 2026-08-11, PRs #850/#851 — two seats' zero-index reads were a query-surface artefact; the per-file measure names the file, the facet names the rule and line, and the "phantom finding" verdict reversed at the owner's check-again word).

## Per-finding investigation discipline

The cardinal anti-pattern with Sonar is the rule-level disable (a `sonar.issue.ignore.multicriteria` block — a sonar-scanner-CLI feature this repo does not use, and which SonarCloud automatic analysis ignores). Each rule fires at distinct sites with distinct contexts; the disposition right for one site can be wrong for another. Per `principles.md` §Code Quality "NEVER disable any quality gates", per-rule disables are forbidden in this repo; dispositions are made per-site, server-side. This repo has no `sonar-project.properties`.

Per-issue dismissals via `change_sonar_issue_status` (status `accept` / `falsepositive`) are acceptable when each disposition is grounded in a specific architectural tension at that site, not a labelled category. The full discipline is documented in [`docs/engineering/quality-tooling-mcp-coupling.md`](../../docs/engineering/quality-tooling-mcp-coupling.md) §Per-finding investigation discipline.

Quality-gate severity arithmetic on PRs: a SINGLE new MINOR vulnerability can alone fail the `new_vulnerabilities_severity` condition (severity score over threshold), so a PR's gate can read ERROR after every other finding is fixed at source until that one finding's disposition lands. Surface the residual at its action moment; never read the residual ERROR as unfixed work.

**Amendment (2026-07-26, owner word):** the parenthetical this paragraph formerly carried — "agents have no Sonar write access" — is falsified. Agents CAN execute per-site status dispositions through the authenticated Sonar CLI when the owner directs them (worked instance: the three PR #565 rule-vs-accessibility accepts, owner-directed, executed agent-side with source-cited rationale comments the same day). Dispositions remain owner-DIRECTED — the ruling to accept is his; the execution need not wait for his hands. The falsified line had propagated into a handoff record as "needs owner credentials" and stalled a lane on a wait that was never necessary — the frozen-text false-authority class.

## Ground in the governing doctrine before fixing or dispositioning

Operationalises [PDR-018 §Disposition drift at phase boundaries](../practice-core/decision-records/PDR-018-planning-discipline.md) and [`verify-dont-trust`](verify-dont-trust.md)'s governing-decision grounding at the Sonar surface. Before choosing a fix shape for — or dispositioning — any Sonar finding, look up the repo's own decision for the flagged construct: grep the ADR estate (and PDRs/rules) — AND the in-code precedent estate — before acting. Before authoring any security-shaped or external-binary mechanism, grep `src/core/` (or the owning package's core module) for a `trusted-*` / hardened sibling: in-code TSDoc records decisions the ADR estate does not (worked instance 2026-07-07: a PATH-walk gitleaks resolver was reviewed-and-reversed citing `core/trusted-git.ts`, whose TSDoc pre-rejects PATH-based approaches — the ADR estate and Sonar disposition history had been grepped; the core module estate had not, twice in one arc). At any `value is X` type-guard or literal-tuple site, read [ADR-153](../../docs/architecture/architectural-decisions/153-constant-type-predicate-pattern.md) by name first — the fluency of the common idiom (e.g. `Set.has` over `.some`) at a site with house doctrine is a warning to check for a governing decision, not a confirmation (`patterns/fluency-is-a-failure-vector`; worked instance: the PR #308 ADR-153 three-swing arc, 2026-07-06, where the governing ADR was one read away throughout). When dispatching a reviewer on a Sonar finding, apply the brief-construction discipline in [`invoke-code-experts`](../memory/executive/invoke-code-experts.md) §Delegation Snapshot (the dispatch names the governing decision records); absorb verdicts per `verify-dont-trust` — reviewer output is evidence to test, not a verdict to adopt.

## Hotspot review

For Security Hotspots, the QG condition `new_security_hotspots_reviewed = 100%` requires each hotspot to move from `TO_REVIEW` to `REVIEWED` with a resolution (`FIXED` / `SAFE` / `ACKNOWLEDGED`). Use `change_security_hotspot_status` with an explicit comment carrying the rationale at each hotspot. Without rationale comments, the audit trail is too thin for future readers.

After changing a hotspot status, do not use `show_security_hotspot.comments` as
the audit-trail verification surface. That MCP read model can return an empty
`comments` array and no changelog field even when the write accepted a
rationale. Verify rationale visibility through the Sonar REST hotspot endpoint
instead: `/api/hotspots/show?hotspot=<hotspot-key>` and inspect its
`changelog` entries for the rationale-bearing transition.

## Common troubleshooting

### Authentication

SonarQube/SonarCloud requires USER tokens (not project tokens). When `SonarQube answered with Not authorized` appears, verify the token type before assuming a permission issue.

### Project not found

Use `search_my_sonarqube_projects` to enumerate accessible projects. Verify project-key spelling and the organisation prefix.

### Tool prefix and gateway provisioning

The `mcp__sonarqube__*` tool prefix comes from a separately-provisioned user-scope server entry (in `~/.claude.json`), not from the plugin manifest — renaming or removing that server entry silently breaks the plugin's skills even though the plugin itself is untouched. Symmetrically, a disconnected Docker MCP gateway masquerades as feature-absence: the tools simply do not appear, which reads as "not supported" rather than "not connected". A "dead" tool can also be a URL typo in the gateway's server config rather than a disconnect — an `UnknownHostException: sonarcould.io` (one-char typo, token and org intact) was fixed via `mcp-config-set {server:"sonarqube", config:{org, url:"https://sonarcloud.io"}}` (2026-07-06). Before concluding a Sonar capability is missing, check the server entry, the gateway connection state, and the configured URL.

### Code analysis issues

Ensure the language parameter is correct when invoking `analyze_code_snippet`. Snippet analysis does not replace full project scans — it is best for one-off snippet reasoning, not gate clearance.
