# PR 108 Sonar live issue inventory - 2026-05-24

## Scope

- Branch: `feat/mcp-graph-support-foundation`
- Pull request: `108`
- Project key: `oaknational_oak-open-curriculum-ecosystem`
- Refreshed at: `2026-05-24T12:35:01Z`
- Source: SonarCloud API live queries for PR 108.
- Docker MCP note: Sonar Docker MCP remained unavailable in this session, so
  this branch inventory uses the live SonarCloud API fallback.

## Quality gate snapshot

Status: `ERROR`

| Metric | Status | Threshold | Actual |
| --- | --- | --- | --- |
| `reliability_rating` | `OK` | `> 3` | not reported |
| `security_rating` | `OK` | `> 1` | not reported |
| `new_duplicated_lines_density` | `ERROR` | `> 3` | `5.9` |
| `new_security_hotspots_reviewed` | `OK` | `< 100` | `100.0` |
| `new_violations` | `ERROR` | `> 0` | `21` |
| `security_hotspots_reviewed` | `OK` | `< 100` | not reported |

Current project measures:

| Metric | Value |
| --- | ---: |
| `new_violations` | `21` |
| `violations` | `21` |
| `new_duplicated_lines_density` | `5.915909571096556` |
| `new_duplicated_lines` | `1960` |
| `duplicated_lines_density` | `12.7` |
| `duplicated_lines` | `34786` |
| `duplicated_blocks` | `2250` |
| `new_security_hotspots` | `0` |
| `new_security_hotspots_reviewed` | `100.0` |

Hotspots: `13` total, all `REVIEWED SAFE`.

## Open issues

Total: `21`

Facets:

- Severity: `CRITICAL 14`, `MAJOR 1`, `MINOR 6`
- Type: `VULNERABILITY 14`, `BUG 1`, `CODE_SMELL 6`
- Rule: `typescript:S5443 14`, `typescript:S7787 2`,
  `typescript:S7735 2`, `typescript:S7727 1`, `typescript:S7755 1`,
  `typescript:S7765 1`
- Impact quality: `SECURITY 14`, `RELIABILITY 1`, `MAINTAINABILITY 7`

| Severity | Type | Rule | File:line | Key | Message |
| --- | --- | --- | --- | --- | --- |
| `MINOR` | `CODE_SMELL` | `typescript:S7735` | `agent-tools/scripts/repo-check.ts:237` | `AZ5Zrown3WPTeVMx030Y` | Unexpected negated condition. |
| `MINOR` | `CODE_SMELL` | `typescript:S7735` | `agent-tools/tests/commit-workflow.unit.test.ts:499` | `AZ5ZrowO3WPTeVMx030X` | Unexpected negated condition. |
| `MAJOR` | `BUG` | `typescript:S7727` | `agent-tools/src/collaboration-state/tui/reduce-refresh-state.unit.test.ts:123` | `AZ5Zroot3WPTeVMx030G` | Do not pass function `reduceRefreshState` directly to `.reduce(...)`. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:59` | `AZ5Zrovt3WPTeVMx030J` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:78` | `AZ5Zrovt3WPTeVMx030K` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:92` | `AZ5Zrovt3WPTeVMx030L` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:112` | `AZ5Zrovt3WPTeVMx030M` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:126` | `AZ5Zrovt3WPTeVMx030N` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:133` | `AZ5Zrovt3WPTeVMx030O` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:139` | `AZ5Zrovt3WPTeVMx030P` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:146` | `AZ5Zrovt3WPTeVMx030Q` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:153` | `AZ5Zrovt3WPTeVMx030R` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts:166` | `AZ5Zrovt3WPTeVMx030S` | Make sure publicly writable directories are used safely here. |
| `MINOR` | `CODE_SMELL` | `typescript:S7755` | `agent-tools/tests/collaboration-state/comms-watch-loop.unit.test.ts:158` | `AZ5Zrovh3WPTeVMx030H` | Prefer `.at(...)` over `[... .length - index]`. |
| `MINOR` | `CODE_SMELL` | `typescript:S7765` | `agent-tools/tests/collaboration-state/comms-watch-loop.unit.test.ts:230` | `AZ5Zrovh3WPTeVMx030I` | Use `.includes()` instead of `.some()` when checking value existence. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-heartbeat.unit.test.ts:144` | `AZ5Zrov53WPTeVMx030T` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-heartbeat.unit.test.ts:149` | `AZ5Zrov53WPTeVMx030U` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-heartbeat.unit.test.ts:168` | `AZ5Zrov53WPTeVMx030V` | Make sure publicly writable directories are used safely here. |
| `CRITICAL` | `VULNERABILITY` | `typescript:S5443` | `agent-tools/tests/collaboration-state/watcher-heartbeat.unit.test.ts:169` | `AZ5Zrov53WPTeVMx030W` | Make sure publicly writable directories are used safely here. |
| `MINOR` | `CODE_SMELL` | `typescript:S7787` | `packages/sdks/graph-corpus-sdk/src/eef-strands/index.ts:12` | `AZ5U2K2veDPdaD0YTz81` | export statement without specifiers is not allowed. |
| `MINOR` | `CODE_SMELL` | `typescript:S7787` | `packages/sdks/graph-corpus-sdk/src/threads/index.ts:12` | `AZ5U2K26eDPdaD0YTz82` | export statement without specifiers is not allowed. |

## New duplication contributors

The quality gate is also failing on `new_duplicated_lines_density`. Files with a
non-zero PR-period `new_duplicated_lines_density` are:

```tsv
90.0  agent-tools/src/bin/agent-identity.ts
1.7857142857142858  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-paths-types.ts
86.36363636363636  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/api-schema-base.ts
91.66666666666667  agent-tools/src/bin/branch-touched-files.ts
44.47761194029851  agent-tools/scripts/check-blocked-content.integration.test.ts
12.264150943396226  agent-tools/scripts/check-commit-skill-advisories.ts
13.66906474820144  agent-tools/scripts/ci-turbo-report.integration.test.ts
44.827586206896555  agent-tools/src/collaboration-state/cli-comms-inbox.ts
20.54794520547945  agent-tools/src/collaboration-state/cli-comms-watch.ts
76.47058823529412  agent-tools/src/bin/codex-exec.ts
24.271844660194176  agent-tools/tests/collaboration-state/collaboration-state.integration.test.ts
10.301507537688442  agent-tools/tests/commit-queue.integration.test.ts
90.9090909090909  agent-tools/src/bin/commit-queue.ts
17.687074829931973  agent-tools/src/commit-queue/commit-workflow-runtime.ts
32.994923857868024  agent-tools/tests/collaboration-state/comms-event-schema.unit.test.ts
38.62068965517241  agent-tools/tests/collaboration-state/comms-render.unit.test.ts
76.20967741935483  agent-tools/tests/collaboration-state/comms-tags.integration.test.ts
6.349206349206349  packages/sdks/oak-sdk-codegen/src/types/generated/zod/curriculumZodSchemas.ts
19.29824561403509  packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/eef-evidence-grounded-lesson-plan-messages.unit.test.ts
76.66666666666667  packages/sdks/graph-corpus-sdk/eslint.config.ts
44.44444444444444  packages/design/oak-design-ink/eslint.config.ts
15.841584158415841  agent-tools/src/practice-fitness/evaluate.unit.test.ts
27.272727272727273  agent-tools/tests/collaboration-state/format-watcher-event.unit.test.ts
14.285714285714286  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts
13.333333333333334  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-quiz.ts
100.0  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-lessons-summary.ts
14.285714285714286  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts
16.666666666666668  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subject-detail.ts
100.0  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-subject-detail.ts
100.0  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-subjects-sequences.ts
100.0  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-subjects.ts
8.0  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-units-summary.ts
100.0  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-units-summary.ts
33.333333333333336  knip.config.ts
40.625  packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts
2.7777777777777777  packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.unit.test.ts
100.0  packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/path-parameters.ts
39.39393939393939  apps/oak-search-cli/src/cli/shared/resolve-bulk-dir.unit.test.ts
22.968197879858657  agent-tools/tests/collaboration-state/state-parsers.unit.test.ts
25.910931174089068  agent-tools/src/collaboration-state/state-schemas.ts
33.333333333333336  apps/oak-curriculum-mcp-streamable-http/e2e-tests/string-args-normalisation.e2e.test.ts
```

## Refresh commands

```sh
curl -fsS "https://sonarcloud.io/api/qualitygates/project_status?projectKey=oaknational_oak-open-curriculum-ecosystem&pullRequest=108"
curl -fsS "https://sonarcloud.io/api/issues/search?componentKeys=oaknational_oak-open-curriculum-ecosystem&pullRequest=108&issueStatuses=OPEN&ps=500"
curl -fsS "https://sonarcloud.io/api/measures/component?component=oaknational_oak-open-curriculum-ecosystem&pullRequest=108&metricKeys=new_violations,new_duplicated_lines_density,new_duplicated_lines,new_security_hotspots,new_security_hotspots_reviewed,violations,duplicated_lines_density,duplicated_lines,duplicated_blocks"
curl -fsS "https://sonarcloud.io/api/hotspots/search?projectKey=oaknational_oak-open-curriculum-ecosystem&pullRequest=108&ps=500"
```
