# The Practice inventory, 2026-10-02

One row per artefact of the Practice present in either estate's default tip, generated from the two trees' blob ids by `practice_inventory_v2.py` beside this report (run from this report's directory as `python3 practice_inventory_v2.py <jc-root> <jc-ref> <oce-root> <oce-ref> <out>` against the two checkouts at the two tips named below; the register is then closed against the output by `python3 ../register_close.py <register> <inventory> <closure>` and the closure spliced in above the rows by `python3 ../assemble_report.py <inventory> <closure> <out>`, both in the parent reports directory, one level above this report): kind by directory; scope class under PDR-143 §1 by directory default, with hand overrides by name where §2's membership test says an artefact names one host (its people, its product, its platform set); sameness by blob id. Heads: JC.net main SHA:ba5ad39a8, OCE engraph SHA:2b25ced1b. Rows: 4580. This report is the input the extraction plan takes (the finish node's end state 3, carried since 2026-10-02 by `practice-parity-for-extraction`, whose mechanism 3 reruns it over the whole Practice at the folded tips); the exchange register closes against it.

The scope classes are PDR-143's (the Practice as a standalone entity; Proposed, recorded on 2026-10-02 on the coordination branch of each estate, so neither default tip holds it until the day's fold lands; its text is restated here so this report stands on its own). §1, the scopes in the owner's words: Practice-wide (principles, rules, skills, decision records, reviewer templates, hook policy, the schemas of every state and memory surface, the learning protocol, the tooling's contracts, the set of platforms the entity renders adapters for); Language-wide, today TypeScript (the binding of each Practice-wide contract to one ecosystem: gate names, test conventions, the tooling's implementation); Repo-local, the installed Practice, authored (the bridge index, the bindings the host chooses, the adoption record and its omissions, repo-local extensions); Repo-local, the installed Practice, rendered (the canonical content and the platform adapters rendered from the pinned revision and committed); Repo-local, the installed Practice, instances (every state and memory instance); Repo-local, the host (product code, content, product decision records, product docs and tests, the gates the host exposes); Machine-local (the operator profile). §2, the membership tests: PDR-079's migration test, could this record land unchanged in another repository adopting the same practice, read for every artefact kind; and for tooling the engineering principles' framework test, could another consumer use this component unchanged; an artefact that passes neither cleanly is decomposed at the tension before it is placed, and a compromise label names coupling, not a home. The hand overrides by name in this generator are the §2 tests applied to artefacts that name one host; the instances and machine-local scopes hold no inventoried artefact, since memory and the home directory are outside the directories below.

Reading the sameness column: a platform adapter is rendered from the canonical content with the host's prefix, so adapters differ or stand one-sided by design and say nothing about the canonical; a skill's evals and fixtures are counted as their own kind because one estate holds the eval runner and the other does not; tooling differs by topic, and a topic one estate alone holds is either a capability to carry (Language-wide) or product tooling (Repo-local, host). The hand overrides by name are the regular expression in the generator, and four OCE skills whose names are neutral but whose contents bind Oak's product (ground-truth-design, ground-truth-evaluation, update-bulk-download-schema, update-upstream-api-spec) are placed by the generator's reviewed path list; a row whose scope reads with a §2 note was placed by one of those, every other row by its directory. The bridge index `.agent/practice-index.md` is the one root-level Practice surface inventoried; the other entry points and the Practice directories outside the prefix list are the rerun's.

## Counts by kind

| Kind | same bytes | different bytes | JC.net only | OCE only | total |
| --- | --- | --- | --- | --- | --- |
| CI workflow | 0 | 3 | 0 | 5 | 8 |
| Practice Core file | 7 | 2 | 0 | 0 | 9 |
| Practice index | 0 | 2 | 0 | 0 | 2 |
| Practice reference | 5 | 11 | 7 | 0 | 23 |
| adoption record | 0 | 1 | 0 | 0 | 1 |
| bridge index | 0 | 1 | 0 | 0 | 1 |
| collaboration definition | 0 | 1 | 0 | 1 | 2 |
| decision record | 130 | 14 | 0 | 0 | 144 |
| directive | 3 | 10 | 4 | 2 | 19 |
| entry point | 0 | 4 | 0 | 0 | 4 |
| evaluation | 0 | 1 | 0 | 0 | 1 |
| gate script | 1 | 8 | 0 | 0 | 9 |
| harness binding | 3 | 1 | 1 | 0 | 5 |
| hook policy | 0 | 2 | 0 | 0 | 2 |
| install surface | 1 | 3 | 0 | 0 | 4 |
| lint config | 1 | 4 | 0 | 2 | 7 |
| memory definition | 8 | 8 | 0 | 0 | 16 |
| operator binding | 1 | 1 | 0 | 0 | 2 |
| ownership binding | 0 | 1 | 0 | 0 | 1 |
| plan definition | 7 | 14 | 8 | 1 | 30 |
| platform adapter (Claude) | 112 | 37 | 157 | 178 | 484 |
| platform adapter (Codex) | 8 | 20 | 3 | 6 | 37 |
| platform adapter (Cursor) | 106 | 43 | 23 | 50 | 222 |
| platform adapter (Gemini) | 0 | 0 | 23 | 20 | 43 |
| platform adapter (agents) | 117 | 0 | 150 | 217 | 484 |
| prompt | 0 | 1 | 8 | 65 | 74 |
| report tooling | 1 | 0 | 6 | 4 | 11 |
| reviewer component | 4 | 1 | 0 | 4 | 9 |
| reviewer index | 0 | 1 | 0 | 1 | 2 |
| reviewer template | 0 | 21 | 6 | 5 | 32 |
| role | 0 | 1 | 0 | 0 | 1 |
| root command surface | 0 | 1 | 0 | 0 | 1 |
| rule | 43 | 74 | 17 | 16 | 150 |
| schema | 1 | 1 | 0 | 0 | 2 |
| skill | 92 | 39 | 18 | 31 | 180 |
| skill evals and fixtures | 29 | 0 | 0 | 507 | 536 |
| state definition | 3 | 1 | 0 | 1 | 5 |
| tooling | 436 | 511 | 83 | 661 | 1691 |
| tooling command surface | 0 | 1 | 0 | 0 | 1 |
| tooling config and docs | 109 | 90 | 6 | 54 | 259 |
| tooling smoke test | 13 | 24 | 16 | 13 | 66 |
| all | 1241 | 959 | 536 | 1844 | 4580 |

## Counts by scope class

| Scope (PDR-143 §1) | same bytes | different bytes | JC.net only | OCE only | total |
| --- | --- | --- | --- | --- | --- |
| Language-wide (TypeScript) | 564 | 640 | 112 | 593 | 1909 |
| Practice-wide | 332 | 204 | 58 | 622 | 1216 |
| Repo-local, authored | 2 | 9 | 0 | 0 | 11 |
| Repo-local, authored (host name, §2) | 0 | 3 | 10 | 12 | 25 |
| Repo-local, host | 0 | 3 | 0 | 5 | 8 |
| Repo-local, host (product tooling, §2) | 0 | 0 | 0 | 141 | 141 |
| Repo-local, rendered | 343 | 100 | 356 | 471 | 1270 |

## The map, the per-file rule and the host list

Kind and default scope come from the first matching prefix in the generator's map: the entry points (AGENTS.md, CLAUDE.md, GEMINI.md, the Copilot instructions), the Practice's index files, `.agent/setup/`, `.agent/roles/`, `.agent/reference/`, `.agent/prompts/`, `.agent/evaluations/`, `.agent/claude-harness-integrations/`, the directives, rules, skills, Core, reviewer surfaces and hook policy, the five mixed directories by the rule below, the tooling (source, smokes, command surface, configs and docs), the gate scripts, the CI workflows, CODEOWNERS, the root command surface and lint configs, and five adapter sets with every subdirectory. The per-file rule for the mixed directories (`memory`, `collaboration`, `state`, `plans`, `reports`): a file is a definition, and a row, when it is a README, a schema, a template, a protocol, the impact-areas registry, a Practice plan node (the strategy pages, the templates, `practice-*`, `no-io-*`, `best-of-each-practice`) or a report generator; every other file there is an instance and is not a row. The host list: the name patterns `(^|/)(invoke-architecture-expert-(fred|wilma|betty|barney)|jc-[^/]*|oak[^/]*|mcp-[^/]*|curriculum[^/]*|under-the-hood[^/]*|lesson-[^/]*|posthog[^/]*|clerk[^/]*|pkg-expert[^/]*|design-system-expert[^/]*|react-component-expert[^/]*|editor[^/]*|accessibility-expert[^/]*)(\.|/|$)` and the reviewed paths `.agent/skills/ground-truth-design/`, `.agent/skills/ground-truth-evaluation/`, `.agent/skills/update-bulk-download-schema/`, `.agent/skills/update-upstream-api-spec/`.

## Counts by capability (capabilities with a differing or one-sided file)

| Capability | same bytes | different bytes | JC.net only | OCE only | total |
| --- | --- | --- | --- | --- | --- |
| `.agent` | 0 | 3 | 0 | 0 | 3 |
| `.agent/claude-harness-integrations` | 3 | 1 | 1 | 0 | 5 |
| `.agent/collaboration/rapid-comms` | 0 | 1 | 0 | 1 | 2 |
| `.agent/directives` | 3 | 10 | 4 | 2 | 19 |
| `.agent/evaluations` | 0 | 1 | 0 | 0 | 1 |
| `.agent/hooks` | 0 | 2 | 0 | 0 | 2 |
| `.agent/memory` | 0 | 1 | 0 | 0 | 1 |
| `.agent/memory/active/patterns` | 7 | 1 | 0 | 0 | 8 |
| `.agent/memory/collaboration` | 0 | 1 | 0 | 0 | 1 |
| `.agent/memory/executive` | 1 | 1 | 0 | 0 | 2 |
| `.agent/memory/operational` | 0 | 1 | 0 | 0 | 1 |
| `.agent/memory/operational/diagnostics` | 0 | 1 | 0 | 0 | 1 |
| `.agent/memory/operational/quarantine` | 0 | 1 | 0 | 0 | 1 |
| `.agent/memory/operational/threads` | 0 | 1 | 0 | 0 | 1 |
| `.agent/operator-local` | 1 | 1 | 0 | 0 | 2 |
| `.agent/plans` | 1 | 2 | 0 | 0 | 3 |
| `.agent/plans/delivery` | 1 | 1 | 3 | 0 | 5 |
| `.agent/plans/delivery/archive` | 0 | 0 | 0 | 1 | 1 |
| `.agent/plans/runbooks` | 0 | 1 | 0 | 0 | 1 |
| `.agent/plans/strategic` | 0 | 1 | 0 | 0 | 1 |
| `.agent/plans/strategy` | 0 | 0 | 5 | 0 | 5 |
| `.agent/plans/templates` | 2 | 2 | 0 | 0 | 4 |
| `.agent/plans/templates/components` | 3 | 7 | 0 | 0 | 10 |
| `.agent/practice-core` | 6 | 3 | 0 | 0 | 9 |
| `.agent/practice-core/decision-records` | 130 | 14 | 0 | 0 | 144 |
| `.agent/practice-core/schemas` | 1 | 1 | 0 | 0 | 2 |
| `.agent/prompts` | 0 | 1 | 2 | 1 | 4 |
| `.agent/prompts/agentic-engineering` | 0 | 0 | 0 | 10 | 10 |
| `.agent/prompts/agentic-engineering/collaboration` | 0 | 0 | 0 | 3 | 3 |
| `.agent/prompts/agentic-engineering/collaboration/experiments` | 0 | 0 | 0 | 1 | 1 |
| `.agent/prompts/agentic-engineering/collaboration/experiments/E1` | 0 | 0 | 0 | 4 | 4 |
| `.agent/prompts/architecture-and-infrastructure` | 0 | 0 | 0 | 1 | 1 |
| `.agent/prompts/archive` | 0 | 0 | 0 | 30 | 30 |
| `.agent/prompts/archive/cv` | 0 | 0 | 1 | 0 | 1 |
| `.agent/prompts/archive/personal-knowledge-graph` | 0 | 0 | 2 | 0 | 2 |
| `.agent/prompts/connecting-oak-resources` | 0 | 0 | 0 | 1 | 1 |
| `.agent/prompts/dev-tooling` | 0 | 0 | 1 | 0 | 1 |
| `.agent/prompts/editorial` | 0 | 0 | 1 | 0 | 1 |
| `.agent/prompts/handoff-2026-05-04` | 0 | 0 | 0 | 4 | 4 |
| `.agent/prompts/personal-knowledge-graph` | 0 | 0 | 1 | 0 | 1 |
| `.agent/prompts/semantic-search/archive` | 0 | 0 | 0 | 7 | 7 |
| `.agent/prompts/strategy-and-plan-estate` | 0 | 0 | 0 | 3 | 3 |
| `.agent/reference` | 4 | 10 | 7 | 0 | 21 |
| `.agent/reference-local` | 1 | 1 | 0 | 0 | 2 |
| `.agent/reports/design` | 0 | 0 | 0 | 1 | 1 |
| `.agent/reports/practice-exchange` | 0 | 0 | 0 | 3 | 3 |
| `.agent/reports/practice-transplant` | 0 | 0 | 3 | 0 | 3 |
| `.agent/reports/practice-transplant/inputs` | 0 | 0 | 3 | 0 | 3 |
| `.agent/roles` | 0 | 1 | 0 | 0 | 1 |
| `.agent/rules` | 43 | 74 | 17 | 16 | 150 |
| `.agent/setup` | 1 | 3 | 0 | 0 | 4 |
| `.agent/skills` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/accessibility` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/architecture` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/author-skills` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/change-custody` | 1 | 7 | 0 | 0 | 8 |
| `.agent/skills/chatgpt-report-normalisation` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/codex-helper` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/cognition` | 109 | 7 | 0 | 0 | 116 |
| `.agent/skills/comms-channels` | 1 | 1 | 0 | 0 | 2 |
| `.agent/skills/config` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/coordination-fold` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/cut-coordination-branch` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/dependency-currency` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/design-system` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/deslop` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/distillation` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/docs-adr` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/domain-craft` | 1 | 4 | 0 | 25 | 30 |
| `.agent/skills/editorial-voice` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/go` | 0 | 2 | 0 | 0 | 2 |
| `.agent/skills/ground-truth-design` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/ground-truth-evaluation` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/inter-practice-collaboration` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/knowledge` | 2 | 3 | 0 | 0 | 5 |
| `.agent/skills/orientation` | 1 | 0 | 0 | 1 | 2 |
| `.agent/skills/package-deps-up-to-date` | 0 | 0 | 3 | 0 | 3 |
| `.agent/skills/pkg` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/planning` | 0 | 2 | 0 | 196 | 198 |
| `.agent/skills/project-spec-creation` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/quality-gates` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/react-component` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/security` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/set-up-worktree-lane` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/sif` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/slack-watcher` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/specification` | 0 | 0 | 0 | 301 | 301 |
| `.agent/skills/start-right-quick` | 2 | 1 | 0 | 0 | 3 |
| `.agent/skills/start-right-team` | 1 | 1 | 0 | 0 | 2 |
| `.agent/skills/start-right-thorough` | 2 | 1 | 0 | 0 | 3 |
| `.agent/skills/subagent-architecture` | 0 | 0 | 1 | 0 | 1 |
| `.agent/skills/talk-to-slack-watcher` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/the-codex-dialogues` | 0 | 0 | 0 | 6 | 6 |
| `.agent/skills/tsdoc` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/update-bulk-download-schema` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/update-dependencies` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/update-upstream-api-spec` | 0 | 0 | 0 | 1 | 1 |
| `.agent/skills/working-with-graphs` | 0 | 1 | 0 | 0 | 1 |
| `.agent/skills/wrap` | 0 | 1 | 0 | 0 | 1 |
| `.agent/state` | 0 | 1 | 0 | 1 | 2 |
| `.agent/sub-agents` | 0 | 1 | 0 | 0 | 1 |
| `.agent/sub-agents/archive` | 0 | 0 | 0 | 1 | 1 |
| `.agent/sub-agents/components` | 4 | 1 | 0 | 4 | 9 |
| `.agent/sub-agents/templates` | 0 | 21 | 6 | 5 | 32 |
| `.agents/agents` | 0 | 0 | 0 | 1 | 1 |
| `.agents/plugins` | 0 | 0 | 0 | 1 | 1 |
| `.agents/rules` | 117 | 0 | 17 | 16 | 150 |
| `.agents/skills` | 0 | 0 | 133 | 199 | 332 |
| `.claude` | 0 | 1 | 1 | 0 | 2 |
| `.claude/agents` | 7 | 19 | 3 | 5 | 34 |
| `.claude/hooks` | 0 | 4 | 3 | 2 | 9 |
| `.claude/rules` | 104 | 13 | 17 | 16 | 150 |
| `.claude/skills` | 0 | 0 | 133 | 155 | 288 |
| `.codex` | 0 | 2 | 0 | 0 | 2 |
| `.codex/agents` | 7 | 18 | 3 | 5 | 33 |
| `.codex/rules` | 0 | 0 | 0 | 1 | 1 |
| `.cursor` | 1 | 3 | 1 | 0 | 5 |
| `.cursor/agents` | 8 | 18 | 3 | 5 | 34 |
| `.cursor/hooks` | 0 | 0 | 1 | 3 | 4 |
| `.cursor/plans` | 0 | 0 | 1 | 26 | 27 |
| `.cursor/rules` | 96 | 21 | 17 | 16 | 150 |
| `.cursor/scripts` | 1 | 1 | 0 | 0 | 2 |
| `.dependency-cruiser.mjs` | 0 | 1 | 0 | 0 | 1 |
| `.gemini` | 0 | 0 | 0 | 1 | 1 |
| `.gemini/agents` | 0 | 0 | 23 | 0 | 23 |
| `.gemini/commands` | 0 | 0 | 0 | 19 | 19 |
| `.github` | 0 | 2 | 0 | 0 | 2 |
| `.github/workflows` | 0 | 3 | 0 | 5 | 8 |
| `.gitleaks.toml` | 0 | 1 | 0 | 0 | 1 |
| `.husky` | 1 | 8 | 0 | 0 | 9 |
| `.markdownlint-cli2.jsonc` | 0 | 1 | 0 | 0 | 1 |
| `.prettierignore` | 0 | 1 | 0 | 0 | 1 |
| `.prettierrc.json` | 0 | 0 | 0 | 1 | 1 |
| `AGENTS.md` | 0 | 1 | 0 | 0 | 1 |
| `CLAUDE.md` | 0 | 1 | 0 | 0 | 1 |
| `GEMINI.md` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools` | 2 | 6 | 0 | 0 | 8 |
| `agent-tools/arc-metrics` | 13 | 3 | 0 | 0 | 16 |
| `agent-tools/bin` | 20 | 8 | 1 | 7 | 36 |
| `agent-tools/bootstrap` | 5 | 8 | 0 | 3 | 16 |
| `agent-tools/branch-guard.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/build-run-artefact-cli.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/ci` | 0 | 0 | 0 | 11 | 11 |
| `agent-tools/claude` | 14 | 8 | 8 | 15 | 45 |
| `agent-tools/claude-hook-command-fixture.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/codex` | 1 | 9 | 0 | 0 | 10 |
| `agent-tools/codex-exec` | 0 | 3 | 0 | 53 | 56 |
| `agent-tools/codex-session-alert-bootstrap.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/collaboration-state` | 60 | 77 | 4 | 4 | 145 |
| `agent-tools/collaboration-tui-start.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/commit-advisories` | 2 | 2 | 0 | 2 | 6 |
| `agent-tools/commit-queue` | 14 | 12 | 0 | 0 | 26 |
| `agent-tools/commit-queue-git-rename.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/commit-queue-registry.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/commit-queue-store.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/commit-queue-worktree-fixture.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/commit-queue-worktree.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/comms-watch-coordination-home-fixture.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/comms-watch-coordination-home.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/coordination` | 0 | 6 | 0 | 0 | 6 |
| `agent-tools/core` | 69 | 18 | 1 | 23 | 111 |
| `agent-tools/corpus-analysis` | 0 | 63 | 0 | 1 | 64 |
| `agent-tools/corpus-drivers-tree-bound-root.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/cursor` | 0 | 0 | 1 | 1 | 2 |
| `agent-tools/docs` | 0 | 1 | 0 | 1 | 2 |
| `agent-tools/encoding` | 5 | 2 | 0 | 0 | 7 |
| `agent-tools/esm-import-extensions.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/exchange-register-cli.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/gate-slot` | 16 | 2 | 0 | 0 | 18 |
| `agent-tools/gate-slot-cli.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/git-without-show-current.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/hook-error-logs-support.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/hook-error-logs.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/hook-policy` | 29 | 13 | 5 | 0 | 47 |
| `agent-tools/hook-wrapper-quoting.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/install-version-guard.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/invalid-flags-drivers.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/mcp-conformance` | 0 | 0 | 0 | 23 | 23 |
| `agent-tools/mcp-conformance-cli.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/mcp-content-current-source` | 0 | 0 | 0 | 71 | 71 |
| `agent-tools/mcp-content-workspace` | 0 | 0 | 0 | 18 | 18 |
| `agent-tools/merge-bot` | 22 | 54 | 0 | 6 | 82 |
| `agent-tools/merge-bot-push-output.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/merge-bot-retire-failsafe.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/merge-bot-retire-github-double.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/merge-bot-retire-in-use-states.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/merge-bot-retire-in-use.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/merge-bot-retire-refusals.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/operator-profile-contract.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/operator-profile-read-fifo.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/operator-profile-sync-merge.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/plan-gate-drift-alert-hook.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/plan-state` | 5 | 7 | 0 | 0 | 12 |
| `agent-tools/post-run-drivers-invalid-flags.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/pr-tally` | 0 | 0 | 0 | 7 | 7 |
| `agent-tools/pr-throughput` | 0 | 0 | 0 | 7 | 7 |
| `agent-tools/pr-watch` | 12 | 17 | 14 | 37 | 80 |
| `agent-tools/pr-watch-content-binding.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/practice-fitness` | 17 | 9 | 0 | 0 | 26 |
| `agent-tools/practice-substrate` | 16 | 9 | 1 | 4 | 30 |
| `agent-tools/pre-compact-observe-fixture.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/pre-compact-observe-hook.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/pre-compact-observe.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/pretool-secrets.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/prompt-secrets-mentions.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/prompt-secrets-support.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/prompt-secrets.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/protocol-conformance` | 0 | 0 | 0 | 5 | 5 |
| `agent-tools/protocol-wire` | 1 | 2 | 0 | 0 | 3 |
| `agent-tools/refounding` | 1 | 4 | 0 | 102 | 107 |
| `agent-tools/registered-hook-command-fixture.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/repo-check` | 6 | 13 | 8 | 1 | 28 |
| `agent-tools/repo-check-cli.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/repo-check-repair.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/restatement-audit` | 0 | 0 | 0 | 54 | 54 |
| `agent-tools/review-cost` | 0 | 0 | 0 | 9 | 9 |
| `agent-tools/rule-declarations` | 8 | 19 | 0 | 1 | 28 |
| `agent-tools/secret-scan` | 0 | 4 | 0 | 0 | 4 |
| `agent-tools/secrets-hooks-support.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/session-metadata` | 8 | 7 | 0 | 0 | 15 |
| `agent-tools/shell` | 0 | 0 | 0 | 10 | 10 |
| `agent-tools/skill-evals` | 0 | 0 | 0 | 25 | 25 |
| `agent-tools/skills-adapter-generate` | 10 | 7 | 0 | 1 | 18 |
| `agent-tools/spawn` | 7 | 20 | 0 | 0 | 27 |
| `agent-tools/subagent-declarations` | 9 | 12 | 0 | 1 | 22 |
| `agent-tools/tests` | 16 | 11 | 3 | 7 | 37 |
| `agent-tools/tests/agent-identity` | 4 | 3 | 0 | 0 | 7 |
| `agent-tools/tests/claude` | 4 | 10 | 0 | 0 | 14 |
| `agent-tools/tests/collaboration-state` | 53 | 38 | 0 | 5 | 96 |
| `agent-tools/tests/collaboration-state/archive` | 2 | 4 | 0 | 0 | 6 |
| `agent-tools/tests/collaboration-state/provenance` | 1 | 1 | 0 | 0 | 2 |
| `agent-tools/tests/cursor` | 0 | 0 | 1 | 1 | 2 |
| `agent-tools/tests/hook-policy` | 2 | 3 | 0 | 0 | 5 |
| `agent-tools/tests/mcp-conformance` | 0 | 0 | 0 | 8 | 8 |
| `agent-tools/tests/mcp-conformance/fixtures` | 0 | 0 | 0 | 5 | 5 |
| `agent-tools/tests/mcp-conformance/test-helpers` | 0 | 0 | 0 | 2 | 2 |
| `agent-tools/tests/pr-tally` | 0 | 0 | 0 | 7 | 7 |
| `agent-tools/tests/pr-tally/fixtures` | 0 | 0 | 0 | 4 | 4 |
| `agent-tools/tests/protocol-conformance` | 0 | 0 | 0 | 2 | 2 |
| `agent-tools/tests/review-cost` | 0 | 0 | 0 | 6 | 6 |
| `agent-tools/tests/rules` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/tests/skills` | 0 | 0 | 0 | 5 | 5 |
| `agent-tools/tests/skills-adapter-generate` | 1 | 12 | 0 | 1 | 14 |
| `agent-tools/tests/test-helpers` | 1 | 2 | 1 | 0 | 4 |
| `agent-tools/transaction-lock.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/trusted-shell-directories.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/typescript-estate` | 0 | 0 | 0 | 107 | 107 |
| `agent-tools/typescript-estate-atomic-publication.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/typescript-estate-classification-boundary.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/typescript-estate-pinned-blob.smoke.ts` | 0 | 0 | 0 | 1 | 1 |
| `agent-tools/under-the-hood-content-generate` | 0 | 0 | 0 | 8 | 8 |
| `agent-tools/validate-core-adr-citations-cli.smoke.ts` | 0 | 1 | 0 | 0 | 1 |
| `agent-tools/validate-no-lineage-names-cli.smoke.ts` | 0 | 0 | 1 | 0 | 1 |
| `agent-tools/validators` | 44 | 81 | 40 | 26 | 191 |
| `agent-tools/version-guard` | 1 | 1 | 0 | 0 | 2 |
| `agent-tools/workflow-build` | 0 | 11 | 0 | 0 | 11 |
| `agent-tools/workspace-census` | 0 | 0 | 0 | 18 | 18 |
| `eslint.config.ts` | 0 | 0 | 0 | 1 | 1 |
| `package.json` | 0 | 1 | 0 | 0 | 1 |

## Rows

| Path | Kind | Scope | Sameness | Capability |
| --- | --- | --- | --- | --- |
| `.agent/HUMANS.md` | Practice index | Practice-wide | different bytes | `.agent` |
| `.agent/README.md` | Practice index | Practice-wide | different bytes | `.agent` |
| `.agent/claude-harness-integrations/auto-mode-permissions.md` | harness binding | Language-wide (TypeScript) | JC.net only | `.agent/claude-harness-integrations` |
| `.agent/claude-harness-integrations/cloud-environment-preflight.sh` | harness binding | Language-wide (TypeScript) | same bytes | `.agent/claude-harness-integrations` |
| `.agent/claude-harness-integrations/cloud-environment-setup.sh` | harness binding | Language-wide (TypeScript) | same bytes | `.agent/claude-harness-integrations` |
| `.agent/claude-harness-integrations/cloud-environment.md` | harness binding | Language-wide (TypeScript) | different bytes | `.agent/claude-harness-integrations` |
| `.agent/claude-harness-integrations/workflow-tool-operations.md` | harness binding | Language-wide (TypeScript) | same bytes | `.agent/claude-harness-integrations` |
| `.agent/collaboration/rapid-comms/2026-06-21-v0-plan-node-schema-cutter-holds-reef-and-volcano-lifts-gleam.md` | collaboration definition | Practice-wide | OCE only | `.agent/collaboration/rapid-comms` |
| `.agent/collaboration/rapid-comms/README.md` | collaboration definition | Practice-wide | different bytes | `.agent/collaboration/rapid-comms` |
| `.agent/directives/AGENT.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/agent-collaboration.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/cloud-environment-routing.md` | directive | Practice-wide | same bytes | `.agent/directives` |
| `.agent/directives/continuity-practice.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/definition-of-delivery.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/editorial-guidance.md` | directive | Repo-local, authored (host name, §2) | JC.net only | `.agent/directives` |
| `.agent/directives/editorial-strategy.md` | directive | Repo-local, authored (host name, §2) | JC.net only | `.agent/directives` |
| `.agent/directives/editorial-tone.md` | directive | Repo-local, authored (host name, §2) | OCE only | `.agent/directives` |
| `.agent/directives/metacognition.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/operationalisation-contract.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/orientation.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/principles.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/privacy.md` | directive | Practice-wide | JC.net only | `.agent/directives` |
| `.agent/directives/schema-first-execution.md` | directive | Practice-wide | OCE only | `.agent/directives` |
| `.agent/directives/secops.md` | directive | Practice-wide | JC.net only | `.agent/directives` |
| `.agent/directives/tdd-as-design.md` | directive | Practice-wide | same bytes | `.agent/directives` |
| `.agent/directives/testing-strategy.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/directives/user-collaboration.md` | directive | Practice-wide | same bytes | `.agent/directives` |
| `.agent/directives/validation-strategy.md` | directive | Practice-wide | different bytes | `.agent/directives` |
| `.agent/evaluations/EXPERIMENT-LOG.md` | evaluation | Practice-wide | different bytes | `.agent/evaluations` |
| `.agent/hooks/README.md` | hook policy | Practice-wide | different bytes | `.agent/hooks` |
| `.agent/hooks/policy.json` | hook policy | Practice-wide | different bytes | `.agent/hooks` |
| `.agent/memory/README.md` | memory definition | Practice-wide | different bytes | `.agent/memory` |
| `.agent/memory/active/patterns/README.md` | memory definition | Practice-wide | different bytes | `.agent/memory/active/patterns` |
| `.agent/memory/active/patterns/additive-only-schema-decoration.md` | memory definition | Practice-wide | same bytes | `.agent/memory/active/patterns` |
| `.agent/memory/active/patterns/boundary-narrowing-for-schema-types.md` | memory definition | Practice-wide | same bytes | `.agent/memory/active/patterns` |
| `.agent/memory/active/patterns/enforce-via-schema-not-prose-for-vendor-surfaces.md` | memory definition | Practice-wide | same bytes | `.agent/memory/active/patterns` |
| `.agent/memory/active/patterns/multi-layer-schema-sync.md` | memory definition | Practice-wide | same bytes | `.agent/memory/active/patterns` |
| `.agent/memory/active/patterns/template-literal-derived-union.md` | memory definition | Practice-wide | same bytes | `.agent/memory/active/patterns` |
| `.agent/memory/active/patterns/templates-encode-failure-modes.md` | memory definition | Practice-wide | same bytes | `.agent/memory/active/patterns` |
| `.agent/memory/active/patterns/validate-sampled-schema-against-complete-corpus.md` | memory definition | Practice-wide | same bytes | `.agent/memory/active/patterns` |
| `.agent/memory/collaboration/README.md` | memory definition | Practice-wide | different bytes | `.agent/memory/collaboration` |
| `.agent/memory/executive/README.md` | memory definition | Practice-wide | different bytes | `.agent/memory/executive` |
| `.agent/memory/executive/memory-state-substrate-contracts.schema.json` | memory definition | Practice-wide | same bytes | `.agent/memory/executive` |
| `.agent/memory/operational/README.md` | memory definition | Practice-wide | different bytes | `.agent/memory/operational` |
| `.agent/memory/operational/diagnostics/README.md` | memory definition | Practice-wide | different bytes | `.agent/memory/operational/diagnostics` |
| `.agent/memory/operational/quarantine/README.md` | memory definition | Practice-wide | different bytes | `.agent/memory/operational/quarantine` |
| `.agent/memory/operational/threads/README.md` | memory definition | Practice-wide | different bytes | `.agent/memory/operational/threads` |
| `.agent/operator-local/.gitignore` | operator binding | Repo-local, authored | same bytes | `.agent/operator-local` |
| `.agent/operator-local/README.md` | operator binding | Repo-local, authored | different bytes | `.agent/operator-local` |
| `.agent/plans/README.md` | plan definition | Practice-wide | different bytes | `.agent/plans` |
| `.agent/plans/delivery/archive/mcp-output-schemas-response-validation.plan.md` | plan definition | Repo-local, authored (host name, §2) | OCE only | `.agent/plans/delivery/archive` |
| `.agent/plans/delivery/no-io-test-boundary-and-di-recovery.plan.md` | plan definition | Practice-wide | JC.net only | `.agent/plans/delivery` |
| `.agent/plans/delivery/practice-completion.plan.md` | plan definition | Practice-wide | JC.net only | `.agent/plans/delivery` |
| `.agent/plans/delivery/practice-language-separation.plan.md` | plan definition | Practice-wide | JC.net only | `.agent/plans/delivery` |
| `.agent/plans/delivery/practice-two-way-exchange.plan.md` | plan definition | Practice-wide | different bytes | `.agent/plans/delivery` |
| `.agent/plans/delivery/practice-work-finish.plan.md` | plan definition | Practice-wide | same bytes | `.agent/plans/delivery` |
| `.agent/plans/impact-areas.md` | plan definition | Practice-wide | different bytes | `.agent/plans` |
| `.agent/plans/plan-node-schema.md` | plan definition | Practice-wide | same bytes | `.agent/plans` |
| `.agent/plans/runbooks/practice-lineage-transplant.plan.md` | plan definition | Practice-wide | different bytes | `.agent/plans/runbooks` |
| `.agent/plans/strategic/best-of-each-practice.plan.md` | plan definition | Practice-wide | different bytes | `.agent/plans/strategic` |
| `.agent/plans/strategy/README.md` | plan definition | Practice-wide | JC.net only | `.agent/plans/strategy` |
| `.agent/plans/strategy/stream-content.md` | plan definition | Practice-wide | JC.net only | `.agent/plans/strategy` |
| `.agent/plans/strategy/stream-knowledge-graph.md` | plan definition | Practice-wide | JC.net only | `.agent/plans/strategy` |
| `.agent/plans/strategy/stream-practice.md` | plan definition | Practice-wide | JC.net only | `.agent/plans/strategy` |
| `.agent/plans/strategy/stream-site.md` | plan definition | Practice-wide | JC.net only | `.agent/plans/strategy` |
| `.agent/plans/templates/README.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates` |
| `.agent/plans/templates/components/adversarial-review.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/documentation-propagation.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/evidence-and-claims.md` | plan definition | Practice-wide | same bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/foundation-alignment.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/lifecycle-triggers.md` | plan definition | Practice-wide | same bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/quality-gates.md` | plan definition | Practice-wide | same bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/risk-assessment.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/session-discipline.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/substrate-vs-axis-plans.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/components/tdd-phases.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates/components` |
| `.agent/plans/templates/delivery-plan-template.md` | plan definition | Practice-wide | same bytes | `.agent/plans/templates` |
| `.agent/plans/templates/runbook-plan-template.md` | plan definition | Practice-wide | same bytes | `.agent/plans/templates` |
| `.agent/plans/templates/strategic-plan-template.md` | plan definition | Practice-wide | different bytes | `.agent/plans/templates` |
| `.agent/practice-core/CHANGELOG.md` | Practice Core file | Practice-wide | different bytes | `.agent/practice-core` |
| `.agent/practice-core/README.md` | Practice Core file | Practice-wide | same bytes | `.agent/practice-core` |
| `.agent/practice-core/decision-records/PDR-001-location-of-practice-decision-records.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-002-pedagogical-reinforcement-in-foundational-practice-docs.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-003-sub-agent-protection-of-foundational-practice-docs.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-004-explorations-as-durable-design-space-tier.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-005-wholesale-practice-transplantation.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-006-dev-tooling-per-ecosystem.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-008-canonical-quality-gate-naming.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-010-domain-specialist-capability-pattern.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-012-review-findings-routing-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-013-grounding-and-framing-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-016-claim-propagation-and-reference-quality.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-017-workaround-hygiene-and-fix-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-018-planning-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-019-adr-scope-by-reusability.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-020-check-driven-development.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-021-test-validity-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-022-governance-enforcement-scanners.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-023-documentation-structure-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-024-vital-integration-surfaces.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-025-quality-gate-dismissal-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-026-per-session-landing-commitment.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-030-plane-tag-vocabulary.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-031-build-vs-buy-attestation.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-033-vendor-doc-review-for-unknown-unknowns.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-034-test-fixtures-encode-production-shape.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-036-friction-as-structural-finding.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-037-substrate-vs-axis-plan-categorisation.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-040-pin-to-maintainer-latest-not-highest-version.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-041-composition-obscurity-investigation-methodology.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-042-signal-distinguishing-pre-action-gate.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-043-rush-impulse-three-structural-cues.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-044-memetic-immune-system.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-045-workspace-first-investigation-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-046-layered-knowledge-processing.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-047-rule-applies-always-doctrine-authoring.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-048-insight-capture-at-moment-of-occurrence.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-052-directive-file-context-budget.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-053-orchestrator-vs-gate-structural-cure.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-054-asymmetric-cure-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-055-cli-affordance-set-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-056-inter-agent-collaboration-protocol.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-057-empirical-answerability.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-059-regenerator-output-classification.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-060-tooling-friction-is-first-class-user-feedback.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-061-agent-pronoun-default-and-conduct-correction-graduation.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-062-absorption-adjacent-failure-modes.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-065-grounding-cost-amortisation-under-rotation.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-067-surface-classification-for-fitness-response.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-068-pipeline-back-pressure-as-structural-cure-signal.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-069-doctrine-first-vs-first-principles-diversity.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-070-moment-of-decision-heuristic-consolidation.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-071-coordinator-allocates-without-gating.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-072-knowledge-curation-as-autonomic-learning.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-073-recursion-as-method-is-practice-core-mind-shape.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-074-director-value-is-mind-coherence-per-owner-attention.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-075-director-substrate-writing-discipline.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-076-agent-identity-tuple-and-body-file-frontmatter.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-076b-body-file-frontmatter-contract.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-080-coordination-event-absorption-is-signal-driven.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-081-curator-role-and-substrate-care-lane.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-082-n2-collaboration-mode.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-083-director-pure-direction-only-boundary.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-084-owner-action-is-not-a-cure.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-085-definition-of-delivery.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-087-tdd-as-design.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-088-reviewers-carry-doctrine.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-089-conservation-reflex-external-check.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-090-one-law-three-faces.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-091-precedence-is-not-approval.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-092-mechanical-firing-moments-over-vigilance-clauses.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-093-self-correcting-measurable-deliverables.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-094-coordination-event-rotation-is-class-tiered-archive-not-delete.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-095-collaboration-is-multi-dimensional.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-096-atomic-propagation-across-reader-surfaces.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-097-disposition-category-grouping-in-health-reports.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-099-change-rate-governor-is-a-reflection-trigger.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-100-decision-debt-as-a-first-class-pillar.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-101-graduation-requires-quorum.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-102-editorial-voice-optional-host-defined-scope-bounded.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-103-scope-from-goal-before-approach.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-104-best-effort-doctrine-authoring-in-consolidation.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-105-reference-direction-invariants.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-107-directive-supersedes-and-reconciles-adr.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-108-generalise-where-generalisation-does-not-cost-utility.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-109-culture-is-what-propagates-across-instances.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-110-repo-state-enforcement-is-its-own-proof-layer.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-111-agent-experience-is-first-class.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-112-teaching-surface-family-across-a-portability-seam.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-113-source-intent-from-the-principal-not-the-records.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-114-knowledge-surfaces-are-curated-suggestions-not-control-flow.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-115-naming-openly-licensed-external-sources.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-116-falsifiable-judgment-gate.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-117-director-and-implementer-roles.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-118-agent-work-state-model.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-119-agent-memory-as-an-event-graph-with-renderers.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-120-runbooks-are-a-content-kind-not-a-surface.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-121-planning-vocabulary.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-123-agentic-design-panel-protocol.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-124-definition-surface-context-economy.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-125-inter-practice-collaboration-protocol.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-126-gates-land-strict-in-one-landing.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-127-team-branch-coordination-protocol.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-128-review-conversations-are-first-class.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-129-diagnosis-reads-whole-surfaces-catalogues-are-open-sets.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-130-two-speed-learning.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-131-merge-concurrency-is-free-quality-binds-at-settled-ready.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-132-changeset-health-round-budgets-bind-at-authoring-time.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-134-knowledge-strata-carriers-and-the-concept-layer.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-135-cost-of-change-gradient.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-136-quality-gates-are-a-registered-corpus.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-137-basis-set-transformation-method.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-138-visual-verification-for-design-verdicts.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-139-provider-independent-capability-composition.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-140-review-response-pricing.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-141-operator-profile-in-the-home-directory.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-142-the-best-of-each-practice.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/PDR-143-the-practice-as-a-standalone-entity.md` | decision record | Practice-wide | same bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/decision-records/README.md` | decision record | Practice-wide | different bytes | `.agent/practice-core/decision-records` |
| `.agent/practice-core/incoming/.gitkeep` | Practice Core file | Practice-wide | same bytes | `.agent/practice-core/incoming` |
| `.agent/practice-core/index.md` | Practice Core file | Practice-wide | same bytes | `.agent/practice-core` |
| `.agent/practice-core/practice-bootstrap.md` | Practice Core file | Practice-wide | same bytes | `.agent/practice-core` |
| `.agent/practice-core/practice-lineage.md` | Practice Core file | Practice-wide | same bytes | `.agent/practice-core` |
| `.agent/practice-core/practice-verification.md` | Practice Core file | Practice-wide | different bytes | `.agent/practice-core` |
| `.agent/practice-core/practice.md` | Practice Core file | Practice-wide | same bytes | `.agent/practice-core` |
| `.agent/practice-core/protocol.json` | Practice Core file | Practice-wide | same bytes | `.agent/practice-core` |
| `.agent/practice-core/provenance.yml` | adoption record | Repo-local, authored | different bytes | `.agent/practice-core` |
| `.agent/practice-core/schemas/inter-practice-wire.schema.json` | schema | Practice-wide | same bytes | `.agent/practice-core/schemas` |
| `.agent/practice-core/schemas/operator-profile.schema.json` | schema | Practice-wide | different bytes | `.agent/practice-core/schemas` |
| `.agent/practice-index.md` | bridge index | Repo-local, authored | different bytes | `.agent` |
| `.agent/prompts/README.md` | prompt | Practice-wide | different bytes | `.agent/prompts` |
| `.agent/prompts/agentic-engineering/collaboration/README.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering/collaboration` |
| `.agent/prompts/agentic-engineering/collaboration/experiments/E1/agent-1-orchestrator.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering/collaboration/experiments/E1` |
| `.agent/prompts/agentic-engineering/collaboration/experiments/E1/agent-2-executor.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering/collaboration/experiments/E1` |
| `.agent/prompts/agentic-engineering/collaboration/experiments/E1/brief.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering/collaboration/experiments/E1` |
| `.agent/prompts/agentic-engineering/collaboration/experiments/E1/closure.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering/collaboration/experiments/E1` |
| `.agent/prompts/agentic-engineering/collaboration/experiments/README.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering/collaboration/experiments` |
| `.agent/prompts/agentic-engineering/collaboration/falsification-criteria.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering/collaboration` |
| `.agent/prompts/agentic-engineering/collaboration/hypothesis.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering/collaboration` |
| `.agent/prompts/agentic-engineering/comms-corpus-research-session.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/corpus-generalisation-review-session.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/dedicated-consolidation-session.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/governance-planes-research-and-reporting.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/inter-practice-protocol-ws0-ws4-authoring-session.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/naming-and-snagging-team-2026-06-11.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/rescued-knowledge-full-processing-session.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/team-session-opener.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/team-tooling-session-2026-06-28.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/agentic-engineering/ws1b-rescued-knowledge-consolidation-session.md` | prompt | Practice-wide | OCE only | `.agent/prompts/agentic-engineering` |
| `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/architecture-and-infrastructure` |
| `.agent/prompts/archive/aggregated-tools-widget-implementation.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/aila-extraction-research.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/codegen-error-response-implementation.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/consolidation-continuation.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/context-grounding-and-primitives-alignment.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/cv/tilt-retirement.prompt.md` | prompt | Practice-wide | JC.net only | `.agent/prompts/archive/cv` |
| `.agent/prompts/archive/first-significant-prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/gt-review.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/implement-knowledge-graph-tool.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/implement-knowledge-graph-v1.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/implement-universal-widget-renderers.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/implement-widget-playwright-tests.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/initial-devdep-install.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/investigate-e2e-failures.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/investigate-ts2589-type-recursion.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/knowledge-graph-svg-refactor.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/landing-page-hero-and-tests.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/learn-about-oak-cta.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/modernise-quality-and-architecture-plans.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/no-fallbacks.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/no-sep.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/personal-knowledge-graph/personal-knowledge-graph-track-a-cv-metadata-proof.prompt.md` | prompt | Practice-wide | JC.net only | `.agent/prompts/archive/personal-knowledge-graph` |
| `.agent/prompts/archive/personal-knowledge-graph/personal-knowledge-graph-track-a-external-validation.prompt.md` | prompt | Practice-wide | JC.net only | `.agent/prompts/archive/personal-knowledge-graph` |
| `.agent/prompts/archive/phase-2-interactive-widget-capabilities.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/phase-8a-token-optimization-and-widget-features.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/session-continuation.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/tidy.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/type-discipline-restoration.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/type-remediation.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/widget-content-clipping-debug.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/widget-uri-cache-busting-simplification.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/widget-uri-cleanup.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/archive/zod3-isolation-completion.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/archive` |
| `.agent/prompts/connecting-oak-resources/graph-implementation-team.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/connecting-oak-resources` |
| `.agent/prompts/daily.md` | prompt | Practice-wide | OCE only | `.agent/prompts` |
| `.agent/prompts/dedicated-consolidation-session.md` | prompt | Practice-wide | JC.net only | `.agent/prompts` |
| `.agent/prompts/dev-tooling/dev-tooling-hygiene.prompt.md` | prompt | Practice-wide | JC.net only | `.agent/prompts/dev-tooling` |
| `.agent/prompts/editorial/linkedin-content-preparation.prompt.md` | prompt | Repo-local, authored (host name, §2) | JC.net only | `.agent/prompts/editorial` |
| `.agent/prompts/handoff-2026-05-04/README.md` | prompt | Practice-wide | OCE only | `.agent/prompts/handoff-2026-05-04` |
| `.agent/prompts/handoff-2026-05-04/agent-plan-1-bug-fix.md` | prompt | Practice-wide | OCE only | `.agent/prompts/handoff-2026-05-04` |
| `.agent/prompts/handoff-2026-05-04/agent-plan-2-config-rename.md` | prompt | Practice-wide | OCE only | `.agent/prompts/handoff-2026-05-04` |
| `.agent/prompts/handoff-2026-05-04/agent-plan-3-smoke-retirement.md` | prompt | Practice-wide | OCE only | `.agent/prompts/handoff-2026-05-04` |
| `.agent/prompts/personal-knowledge-graph/personal-knowledge-graph-track-b-source-of-truth-design.prompt.md` | prompt | Practice-wide | JC.net only | `.agent/prompts/personal-knowledge-graph` |
| `.agent/prompts/semantic-search/archive/atomic-concepts-exploration.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/semantic-search/archive` |
| `.agent/prompts/semantic-search/archive/curriculum-vocabulary-checkpoint-RESOLVED.md` | prompt | Repo-local, authored (host name, §2) | OCE only | `.agent/prompts/semantic-search/archive` |
| `.agent/prompts/semantic-search/archive/fix-missing-indices-COMPLETE.md` | prompt | Practice-wide | OCE only | `.agent/prompts/semantic-search/archive` |
| `.agent/prompts/semantic-search/archive/fix-missing-indices-plan-COMPLETE.md` | prompt | Practice-wide | OCE only | `.agent/prompts/semantic-search/archive` |
| `.agent/prompts/semantic-search/archive/phase-1a-complete.md` | prompt | Practice-wide | OCE only | `.agent/prompts/semantic-search/archive` |
| `.agent/prompts/semantic-search/archive/pr-67-snagging-triage.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/semantic-search/archive` |
| `.agent/prompts/semantic-search/archive/semantic-search.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/semantic-search/archive` |
| `.agent/prompts/session-continuation.prompt.md` | prompt | Practice-wide | JC.net only | `.agent/prompts` |
| `.agent/prompts/strategy-and-plan-estate/define-strategy-content.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/strategy-and-plan-estate` |
| `.agent/prompts/strategy-and-plan-estate/plan-corpus-refounding-r0-session.md` | prompt | Practice-wide | OCE only | `.agent/prompts/strategy-and-plan-estate` |
| `.agent/prompts/strategy-and-plan-estate/strategy-and-vision-refinement.prompt.md` | prompt | Practice-wide | OCE only | `.agent/prompts/strategy-and-plan-estate` |
| `.agent/reference-local/.gitignore` | Practice reference | Repo-local, authored | different bytes | `.agent/reference-local` |
| `.agent/reference-local/README.md` | Practice reference | Repo-local, authored | same bytes | `.agent/reference-local` |
| `.agent/reference/README.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/accessibility-practice.md` | Practice reference | Practice-wide | JC.net only | `.agent/reference` |
| `.agent/reference/arc-rapid-communication.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/claude-design-conversion-playbook.md` | Practice reference | Practice-wide | JC.net only | `.agent/reference` |
| `.agent/reference/comms-cited-events.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/comms-heartbeat-cadence.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/comms-watch-mechanism.md` | Practice reference | Practice-wide | same bytes | `.agent/reference` |
| `.agent/reference/cost-of-change-gradient.md` | Practice reference | Practice-wide | JC.net only | `.agent/reference` |
| `.agent/reference/cross-machine-collaboration.md` | Practice reference | Practice-wide | same bytes | `.agent/reference` |
| `.agent/reference/design-token-governance-for-self-contained-ui.md` | Practice reference | Practice-wide | same bytes | `.agent/reference` |
| `.agent/reference/grammar-of-thinking.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/health-probe-and-policy-spine.md` | Practice reference | Practice-wide | same bytes | `.agent/reference` |
| `.agent/reference/merge-bot.md` | Practice reference | Practice-wide | JC.net only | `.agent/reference` |
| `.agent/reference/pre-merge-analysis.md` | Practice reference | Practice-wide | JC.net only | `.agent/reference` |
| `.agent/reference/resonance-practice-knowledge.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/resonance-research-programme-design-guide.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/shell-and-tooling-gotchas.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/skill-composition.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/starter-templates.md` | Practice reference | Practice-wide | different bytes | `.agent/reference` |
| `.agent/reference/tooling.md` | Practice reference | Practice-wide | JC.net only | `.agent/reference` |
| `.agent/reference/typescript-gotchas.md` | Practice reference | Practice-wide | JC.net only | `.agent/reference` |
| `.agent/reports/agentic-engineering/io_census.py` | report tooling | Language-wide (TypeScript) | same bytes | `.agent/reports/agentic-engineering` |
| `.agent/reports/design/aip-137-dtcg-probes-2026-07-19.py` | report tooling | Language-wide (TypeScript) | OCE only | `.agent/reports/design` |
| `.agent/reports/practice-exchange/assemble_report.py` | report tooling | Language-wide (TypeScript) | OCE only | `.agent/reports/practice-exchange` |
| `.agent/reports/practice-exchange/practice_inventory.py` | report tooling | Language-wide (TypeScript) | OCE only | `.agent/reports/practice-exchange` |
| `.agent/reports/practice-exchange/register_close.py` | report tooling | Language-wide (TypeScript) | OCE only | `.agent/reports/practice-exchange` |
| `.agent/reports/practice-transplant/assemble_report.py` | report tooling | Language-wide (TypeScript) | JC.net only | `.agent/reports/practice-transplant` |
| `.agent/reports/practice-transplant/inputs/exchange-delta.sh` | report tooling | Language-wide (TypeScript) | JC.net only | `.agent/reports/practice-transplant/inputs` |
| `.agent/reports/practice-transplant/inputs/exchange-deltas.sh` | report tooling | Language-wide (TypeScript) | JC.net only | `.agent/reports/practice-transplant/inputs` |
| `.agent/reports/practice-transplant/inputs/loss-scan-dispositions.sh` | report tooling | Language-wide (TypeScript) | JC.net only | `.agent/reports/practice-transplant/inputs` |
| `.agent/reports/practice-transplant/practice_inventory.py` | report tooling | Language-wide (TypeScript) | JC.net only | `.agent/reports/practice-transplant` |
| `.agent/reports/practice-transplant/register_close.py` | report tooling | Language-wide (TypeScript) | JC.net only | `.agent/reports/practice-transplant` |
| `.agent/roles/role-architectural-typescript-champion.md` | role | Practice-wide | different bytes | `.agent/roles` |
| `.agent/rules/agent-experience-review-lens.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/agent-state-observable.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/agentic-judgment-conserve-by-default.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/agents-default-no-gender.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/apply-architectural-principles.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/bot-identity-on-third-party-systems.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/capability-landing-decision-procedure.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/capture-practice-tool-feedback.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/channel-by-audience-lifetime-and-consumer.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/check-singleton-per-window.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/closed-shape-design-optionality.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/collaboration-is-value-contingent.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/comms-all-channels-watcher.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/compute-dont-hope.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/confident-seats-proceed-and-report.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/consolidate-at-second-consumer.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/continuity-surface-commits-as-orphans.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/coordination-branch-24h-lifetime.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/cross-estate-work-must-reduce-divergence.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/cross-repo-sessions-run-the-join-ceremony.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/design-from-impact-not-the-cowpath.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/design-values-come-from-the-system.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/design-work-for-small-prs.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/directed-routing-requires-absorption-ack.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/directive-file-context-budget.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/documentation-hygiene.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/dont-break-build-without-fix-plan.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/downstream-checkout-never-writes-upstream-surfaces.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/eef-corpus-grounding.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/executive-memory-drift-capture.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/exit-codes-in-band-never-piped.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/fleet-design-review-before-expensive-fleets.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/follow-agent-collaboration-practice.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/follow-collaboration-practice.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/follow-the-practice.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/foreign-board-write-discipline.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/generator-first-mindset.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/handoff-messages-self-contained.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/hook-policy-substring-discipline.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/identify-as-agent-under-shared-credentials.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/important-state-not-in-temp-files.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/invoke-accessibility-expert.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/invoke-architecture-expert-barney.md` | rule | Repo-local, authored (host name, §2) | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-architecture-expert-betty.md` | rule | Repo-local, authored (host name, §2) | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-architecture-expert-fred.md` | rule | Repo-local, authored (host name, §2) | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-architecture-expert-wilma.md` | rule | Repo-local, authored (host name, §2) | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-architecture-expert.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-assumptions-expert.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/invoke-clerk-expert.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/invoke-code-experts.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/invoke-config-expert.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-design-system-expert.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/invoke-docs-adr-expert.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-editor.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-elasticsearch-expert.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/invoke-mcp-expert.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/invoke-pkg-expert.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-react-component-expert.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/invoke-security-expert.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-sentry-expert.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/invoke-subagent-architect.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-test-expert.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/invoke-type-expert.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/knowledge-preservation-over-fitness-warnings.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/linear-mcp-team-and-project-hygiene.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/lint-after-edit.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/liveness-heartbeat-cron.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/local-broken-code-never-leaves.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/lockfile-rebuild-survivability.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/loop-exit-criteria-required.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/markdown-code-blocks-must-have-language.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/monitor-branch-touched-files.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/napkin-always-active.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/never-commit-to-main.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/never-disable-checks.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/never-use-git-to-remove-work.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/new-rule-vs-pdr-clause.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/no-conditional-tests.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/no-global-state-in-tests.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/no-hedging-vocabulary.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/no-moving-targets-in-permanent-docs.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/no-parallel-long-lived-branches.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/no-skipped-tests.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/no-speed-pressure.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/no-tombstones-for-removed-ideas.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/no-type-shortcuts.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/no-unbounded-host-load.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/no-verify-requires-fresh-authorisation.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/no-warning-toleration.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/notion-page-edits-update-ledger.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/notion-strategy-page-fence.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/oak-chrome-session-is-metered.md` | rule | Repo-local, authored (host name, §2) | OCE only | `.agent/rules` |
| `.agent/rules/one-instance-is-an-observation.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/one-pr-per-leaf-issue.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/owner-attention-at-action-moments.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/per-user-memory-is-a-buffer.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/permanent-doc-is-the-consolidation-record.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/ping-before-escalate.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/plan-body-first-principles-check.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/pr-comments-resolve-and-recheck.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/practice-core-portability.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/pre-merge-divergence-analysis.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/precedence-is-not-approval.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/present-verdicts-not-menus.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/re-apply-first-question-at-elaboration-boundaries.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/read-agent-md.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/read-before-asking.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/read-diagnostic-artefacts-in-full.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/read-nextjs-docs-before-coding.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/record-generalisation-moves.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/records-are-technical-not-emotional.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/register-active-areas-at-session-open.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/register-identity-on-thread-join.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/render-the-reference-before-reproducing.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/replace-dont-bridge.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/respect-active-agent-claims.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/review-feedback-defaults-to-triage.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/route-blocks-and-questions-to-director.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/rules-have-no-exceptions.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/scope-from-goal-before-approach.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/sha-prefix-in-collaboration-content.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/ship-independent-coordinate-dependent.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/silence-is-never-liveness.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/skill-naming-and-description-quality.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/sonarqube-mcp-instructions.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/source-curriculum-content-via-api-not-cdn.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/source-is-typescript-esm-only.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/stage-by-explicit-pathspec.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/strict-validation-at-boundary.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/subagent-practice-core-protection.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/tdd-for-refactoring.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/test-immediate-fails.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/third-party-skills-require-security-review.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/tsdoc-and-documentation-hygiene.md` | rule | Practice-wide | JC.net only | `.agent/rules` |
| `.agent/rules/unattended-seats-never-prompt.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/use-agent-comms-log.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/use-built-agent-tools-cli.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/use-monitor-for-event-driven-wake.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/use-result-pattern.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/use-start-right-skills.md` | rule | Practice-wide | OCE only | `.agent/rules` |
| `.agent/rules/validate-full-target-estate.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/validators-must-recompute-not-just-record.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/verify-data-supports-shape-before-building.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/verify-dont-trust.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md` | rule | Practice-wide | same bytes | `.agent/rules` |
| `.agent/rules/visual-verdicts-require-rendered-proof.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/worktree-hygiene.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/rules/worktree-residency.md` | rule | Practice-wide | different bytes | `.agent/rules` |
| `.agent/setup/cloud-session-preflight.sh` | install surface | Practice-wide | different bytes | `.agent/setup` |
| `.agent/setup/cloud-session-setup.sh` | install surface | Practice-wide | different bytes | `.agent/setup` |
| `.agent/setup/install-shellcheck.sh` | install surface | Practice-wide | different bytes | `.agent/setup` |
| `.agent/setup/is-chatgpt-work-cloud.sh` | install surface | Practice-wide | same bytes | `.agent/setup` |
| `.agent/skills/README.md` | skill | Practice-wide | different bytes | `.agent/skills` |
| `.agent/skills/accessibility/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/accessibility` |
| `.agent/skills/architecture/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/architecture` |
| `.agent/skills/author-skills/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/author-skills` |
| `.agent/skills/change-custody/commit/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/change-custody` |
| `.agent/skills/change-custody/complex-merge/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/change-custody` |
| `.agent/skills/change-custody/complex-merge/shared/complex-merge.md` | skill | Practice-wide | different bytes | `.agent/skills/change-custody` |
| `.agent/skills/change-custody/cross-fork-integration/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/change-custody` |
| `.agent/skills/change-custody/gates/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/change-custody` |
| `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/change-custody` |
| `.agent/skills/change-custody/semantic-merge/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/change-custody` |
| `.agent/skills/change-custody/undo-change/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/change-custody` |
| `.agent/skills/chatgpt-report-normalisation/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/chatgpt-report-normalisation` |
| `.agent/skills/codex-helper/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/codex-helper` |
| `.agent/skills/cognition/concept-exploration/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/cricket/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/free-play/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/metacognition/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-audit/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-audit/assets/audit-report.yaml` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-audit/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-audit/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-audit/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-audit/references/audit-protocol.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-audit/references/parallax-contract.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-decide/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-decide/assets/decision-world-return.yaml` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-decide/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-decide/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-decide/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-decide/references/decision-method.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/assets/experiment-plan.template.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/evals/test_validate_experiment_plan.py` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/references/composition-contract.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/references/design-selection.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/references/ethics-open-science.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/references/power-precision.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/references/practice-handoff.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/references/validity-analysis.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-experiment/scripts/validate_experiment_plan.py` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-inquiry/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-inquiry/assets/evidence-method-plan.yaml` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-inquiry/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-inquiry/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-inquiry/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-inquiry/references/domain-profiles.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-design-inquiry/references/inquiry-design.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-frame/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-frame/assets/frame-set.yaml` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-frame/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-frame/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-frame/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-frame/references/framing-method.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-learn/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-learn/assets/change-proposal.yaml` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-learn/assets/learning-review.yaml` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-learn/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-learn/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-learn/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-learn/references/learning-protocol.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-learn/references/practice-memory-binding.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/assets/product-experiment-plan.template.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/evals/test_validate_product_experiment_plan.py` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/references/assignment-integrity.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/references/composition-contract.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/references/metrics-inference.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/references/practice-handoff.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/references/rollout-outcomes.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-product-experiment/scripts/validate_product_experiment_plan.py` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-synthesise/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-synthesise/assets/synthesis-record.yaml` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-synthesise/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-synthesise/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-synthesise/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax-synthesise/references/synthesis-method.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/assets/inquiry-charter.yaml` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evals/evals.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evals/trigger-train.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evaluations/README.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evaluations/composition/evals.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evaluations/contract-compatibility/evals.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evaluations/cross-domain/evals.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evaluations/metamorphic-scale/evals.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evaluations/recursive-learning/evals.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evaluations/reopening/evals.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/evaluations/routing/evals.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/domain-profiles.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/CHANGELOG.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/README.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/architecture.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/artifact-protocol.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/concept-provenance.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/domain-profiles.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/evaluation-and-governance.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/experimental-design-boundaries.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/framework.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/glossary.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graph-semantics.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graphs/capability-artifact.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graphs/catalogue.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graphs/inquiry-state.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graphs/invocation.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graphs/learning.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graphs/provenance.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graphs/run-template.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/graphs/scale-decomposition.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/installation.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/invocation-and-entry-points.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/manifest.json` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/multi-scale-model.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/practice-memory-and-learning.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/references.md` | skill | Practice-wide | different bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/skill-design-meta-learning.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/family/traceability-matrix.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/references/orchestration.md` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/scripts/render_graph.py` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/parallax/scripts/test_render_graph.py` | skill | Practice-wide | same bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/proportionality/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/reason/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/cognition` |
| `.agent/skills/cognition/retrospective/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/cognition` |
| `.agent/skills/comms-channels/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/comms-channels` |
| `.agent/skills/comms-channels/references/comms-landscape.md` | skill | Practice-wide | same bytes | `.agent/skills/comms-channels` |
| `.agent/skills/config/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/config` |
| `.agent/skills/coordination-fold/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/coordination-fold` |
| `.agent/skills/cut-coordination-branch/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/cut-coordination-branch` |
| `.agent/skills/dependency-currency/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/dependency-currency` |
| `.agent/skills/design-system/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/design-system` |
| `.agent/skills/deslop/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/deslop` |
| `.agent/skills/distillation/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/distillation` |
| `.agent/skills/docs-adr/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/docs-adr` |
| `.agent/skills/domain-craft/ui-design/claude-design-pipeline/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/evals.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/page/ad-hoc-css-negative.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/page/comment-only-class-negative.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/page/literal-values-negative.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/theming/all-boundaries-negative.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/theming/button-group-selections-positive.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/theming/conforming-positive.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/theming/object-map-selections-positive.tsx` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/theming/resolution-shim-positive.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/theming/round-trip-negative.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/theming/selections-in-comment-negative.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/fixtures/theming/system-palette-tree-negative.html` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/scripts/grade-page.ts` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/evals/scripts/grade-theming.ts` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/design-system-usage/references/whats-where.md` | skill | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/evals.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/fixtures/css-only-negative.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/fixtures/legitimate-references-positive.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/fixtures/prose-only-negative.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/fixtures/size-only-negative.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/fixtures/size-proposal-forms-negative.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/fixtures/word-boundary-positive.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/judge/rubric.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/evals/scripts/grade-no-invented-values.ts` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/ui-visual-design/references/craft-fundamentals.md` | skill | Practice-wide | same bytes | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/visual-comparison/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/domain-craft` |
| `.agent/skills/domain-craft/ui-design/visual-verification/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/domain-craft` |
| `.agent/skills/editorial-voice/SKILL-CANONICAL.md` | skill | Repo-local, authored (host name, §2) | JC.net only | `.agent/skills/editorial-voice` |
| `.agent/skills/go/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/go` |
| `.agent/skills/go/shared/go.md` | skill | Practice-wide | different bytes | `.agent/skills/go` |
| `.agent/skills/ground-truth-design/SKILL-CANONICAL.md` | skill | Repo-local, authored (host name, §2) | OCE only | `.agent/skills/ground-truth-design` |
| `.agent/skills/ground-truth-evaluation/SKILL-CANONICAL.md` | skill | Repo-local, authored (host name, §2) | OCE only | `.agent/skills/ground-truth-evaluation` |
| `.agent/skills/inter-practice-collaboration/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/inter-practice-collaboration` |
| `.agent/skills/knowledge/consolidate-docs/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/knowledge` |
| `.agent/skills/knowledge/consolidate-until-done/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/knowledge` |
| `.agent/skills/knowledge/curator-pass/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/knowledge` |
| `.agent/skills/knowledge/knowledge-safety-sweep/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/knowledge` |
| `.agent/skills/knowledge/napkin/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/knowledge` |
| `.agent/skills/orientation/under-the-hood/SKILL-CANONICAL.md` | skill | Repo-local, authored (host name, §2) | OCE only | `.agent/skills/orientation` |
| `.agent/skills/orientation/working-with-agentic-ai/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/orientation` |
| `.agent/skills/package-deps-up-to-date/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/package-deps-up-to-date` |
| `.agent/skills/package-deps-up-to-date/references/manager-commands.md` | skill | Practice-wide | JC.net only | `.agent/skills/package-deps-up-to-date` |
| `.agent/skills/package-deps-up-to-date/scripts/check-package-deps.py` | skill | Practice-wide | JC.net only | `.agent/skills/package-deps-up-to-date` |
| `.agent/skills/pkg/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/pkg` |
| `.agent/skills/planning/plan/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/evals.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/trigger-04-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/trigger-05-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/trigger-04-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/trigger-05-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-36-08Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-06Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-06Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-06Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-06Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-06Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-06Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-06Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-57Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-57Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-57Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-57Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-57Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-57Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-45-57Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/answers/trigger-04-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/answers/trigger-05-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/traces/trigger-04-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/traces/trigger-05-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-27T11-47-11Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/trigger-04-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/trigger-05-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/answers/trigger-07-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/trigger-04-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/trigger-05-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-11-44Z/traces/trigger-07-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-23-08Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-23-08Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-23-08Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-23-08Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-23-08Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-23-08Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-23-08Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/trigger-04-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/trigger-05-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/answers/trigger-07-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/trigger-04-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/trigger-05-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/results/2026-09-28T12-28-12Z/traces/trigger-07-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/plan/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/ticket-management/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/evals.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-05.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-05.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-06.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-06.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-07.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/case-07.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-04-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-05-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-07-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-08-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-09-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/answers/trigger-10-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-05.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-05.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-06.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-06.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-07.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/case-07.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-04-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-05-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-07-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-08-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-09-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/results/2026-09-27T11-14-39Z/traces/trigger-10-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/references/journeys-and-stories.md` | skill | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/references/levels-and-implementation.md` | skill | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/planning/user-value/references/value-model.md` | skill | Practice-wide | OCE only | `.agent/skills/planning` |
| `.agent/skills/project-spec-creation/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/project-spec-creation` |
| `.agent/skills/quality-gates/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/quality-gates` |
| `.agent/skills/react-component/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/react-component` |
| `.agent/skills/security/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/security` |
| `.agent/skills/session-handoff/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/session-handoff` |
| `.agent/skills/set-up-worktree-lane/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/set-up-worktree-lane` |
| `.agent/skills/sif/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/sif` |
| `.agent/skills/slack-watcher/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/slack-watcher` |
| `.agent/skills/specification/assess-specification/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/evals.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-05.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-05.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-06.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/case-06.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-04-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-05-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-07-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-08-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-09-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/answers/trigger-10-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-05.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-05.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-06.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/case-06.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-04-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-05-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-07-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-08-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-09-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-29-08Z/traces/trigger-10-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-39-20Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-39-20Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-39-20Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-39-20Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-39-20Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-39-20Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-39-20Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-40-05Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-40-05Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-40-05Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-40-05Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-40-05Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-40-05Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-40-05Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-44-17Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-44-17Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-44-17Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-44-17Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-44-17Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-44-17Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-27T11-44-17Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-05.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-05.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-06.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/case-06.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-04-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-05-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-07-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-08-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-09-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/answers/trigger-10-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-05.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-05.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-06.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/case-06.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-04-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-05-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-07-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-08-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-09-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/results/2026-09-28T12-20-48Z/traces/trigger-10-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/assess-specification/references/assessment-criteria.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/evals.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-05.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-05.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-06.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/case-06.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-04-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-05-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-07-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-08-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-09-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/answers/trigger-10-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-05.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-05.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-06.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/case-06.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-04-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-05-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-07-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-08-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-09-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-27-50Z/traces/trigger-10-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-41-26Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-41-26Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-41-26Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-41-26Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-41-26Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-41-26Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-41-26Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-42-34Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-42-34Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-42-34Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-42-34Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-42-34Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-42-34Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-27T11-42-34Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-05.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-05.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-06.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/case-06.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-04-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-05-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-07-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-08-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-09-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/answers/trigger-10-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-05.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-05.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-06.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/case-06.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-04-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-05-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-07-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-08-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-09-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/results/2026-09-28T12-11-44Z/traces/trigger-10-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify-connection/references/connection-method.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/evals.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-02.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-02.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-03.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-03.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-04.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-04.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-05.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-05.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-06.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-06.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-07.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/case-07.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-01-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-02-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-03-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-04-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-05-fires.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-06-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-07-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-08-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-09-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/answers/trigger-10-silent.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/result-triggers.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-02.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-02.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-03.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-03.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-04.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-04.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-05.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-05.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-06.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-06.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-07.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/case-07.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-01-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-02-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-03-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-04-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-05-fires.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-06-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-07-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-08-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-09-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-16-44Z/traces/trigger-10-silent.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-31-29Z/answers/case-01.with.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-31-29Z/answers/case-01.without.1.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-31-29Z/manifest.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-31-29Z/reading.md` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-31-29Z/result-cases.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-31-29Z/traces/case-01.with.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/results/2026-09-27T11-31-29Z/traces/case-01.without.1.jsonl` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/evals/trigger-validation.json` | skill evals and fixtures | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/references/assurance.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/references/lifecycle-and-change.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/references/profiles.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/specification/specify/references/specification-record.md` | skill | Practice-wide | OCE only | `.agent/skills/specification` |
| `.agent/skills/start-right-quick/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/start-right-quick` |
| `.agent/skills/start-right-quick/agents/openai.yaml` | skill | Practice-wide | same bytes | `.agent/skills/start-right-quick` |
| `.agent/skills/start-right-quick/shared/start-right.md` | skill | Practice-wide | different bytes | `.agent/skills/start-right-quick` |
| `.agent/skills/start-right-team/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/start-right-team` |
| `.agent/skills/start-right-team/agents/openai.yaml` | skill | Practice-wide | same bytes | `.agent/skills/start-right-team` |
| `.agent/skills/start-right-thorough/SKILL-CANONICAL.md` | skill | Practice-wide | same bytes | `.agent/skills/start-right-thorough` |
| `.agent/skills/start-right-thorough/agents/openai.yaml` | skill | Practice-wide | same bytes | `.agent/skills/start-right-thorough` |
| `.agent/skills/start-right-thorough/shared/start-right-thorough.md` | skill | Practice-wide | different bytes | `.agent/skills/start-right-thorough` |
| `.agent/skills/subagent-architecture/SKILL-CANONICAL.md` | skill | Practice-wide | JC.net only | `.agent/skills/subagent-architecture` |
| `.agent/skills/talk-to-slack-watcher/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/talk-to-slack-watcher` |
| `.agent/skills/the-codex-dialogues/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/the-codex-dialogues` |
| `.agent/skills/the-codex-dialogues/references/probe-record.md` | skill | Practice-wide | OCE only | `.agent/skills/the-codex-dialogues` |
| `.agent/skills/the-codex-dialogues/scripts/mcp-stdio-session.mjs` | skill | Repo-local, authored (host name, §2) | OCE only | `.agent/skills/the-codex-dialogues` |
| `.agent/skills/the-codex-dialogues/scripts/probe-codex-mcp-server.mjs` | skill | Practice-wide | OCE only | `.agent/skills/the-codex-dialogues` |
| `.agent/skills/the-codex-dialogues/scripts/probe-workspace.mjs` | skill | Practice-wide | OCE only | `.agent/skills/the-codex-dialogues` |
| `.agent/skills/the-codex-dialogues/scripts/tool-contract.mjs` | skill | Practice-wide | OCE only | `.agent/skills/the-codex-dialogues` |
| `.agent/skills/tsdoc/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/tsdoc` |
| `.agent/skills/update-bulk-download-schema/SKILL-CANONICAL.md` | skill | Repo-local, authored (host name, §2) | OCE only | `.agent/skills/update-bulk-download-schema` |
| `.agent/skills/update-dependencies/SKILL-CANONICAL.md` | skill | Practice-wide | OCE only | `.agent/skills/update-dependencies` |
| `.agent/skills/update-upstream-api-spec/SKILL-CANONICAL.md` | skill | Repo-local, authored (host name, §2) | OCE only | `.agent/skills/update-upstream-api-spec` |
| `.agent/skills/working-with-graphs/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/working-with-graphs` |
| `.agent/skills/wrap/SKILL-CANONICAL.md` | skill | Practice-wide | different bytes | `.agent/skills/wrap` |
| `.agent/state/README.md` | state definition | Practice-wide | different bytes | `.agent/state` |
| `.agent/state/collaboration/archive/README.md` | state definition | Practice-wide | same bytes | `.agent/state/collaboration/archive` |
| `.agent/state/collaboration/escalations/README.md` | state definition | Practice-wide | same bytes | `.agent/state/collaboration/escalations` |
| `.agent/state/collaboration/handoffs/README.md` | state definition | Practice-wide | same bytes | `.agent/state/collaboration/handoffs` |
| `.agent/state/output-schema-plan-audit.workflow.js` | state definition | Practice-wide | OCE only | `.agent/state` |
| `.agent/sub-agents/README.md` | reviewer index | Practice-wide | different bytes | `.agent/sub-agents` |
| `.agent/sub-agents/archive/agent-architect.md` | reviewer index | Practice-wide | OCE only | `.agent/sub-agents/archive` |
| `.agent/sub-agents/components/architecture/reviewer-team.md` | reviewer component | Practice-wide | different bytes | `.agent/sub-agents/components` |
| `.agent/sub-agents/components/behaviours/README.md` | reviewer component | Practice-wide | same bytes | `.agent/sub-agents/components` |
| `.agent/sub-agents/components/behaviours/reading-discipline.md` | reviewer component | Practice-wide | same bytes | `.agent/sub-agents/components` |
| `.agent/sub-agents/components/behaviours/subagent-identity.md` | reviewer component | Practice-wide | same bytes | `.agent/sub-agents/components` |
| `.agent/sub-agents/components/personas/barney.md` | reviewer component | Practice-wide | OCE only | `.agent/sub-agents/components` |
| `.agent/sub-agents/components/personas/betty.md` | reviewer component | Practice-wide | OCE only | `.agent/sub-agents/components` |
| `.agent/sub-agents/components/personas/fred.md` | reviewer component | Practice-wide | OCE only | `.agent/sub-agents/components` |
| `.agent/sub-agents/components/personas/wilma.md` | reviewer component | Practice-wide | OCE only | `.agent/sub-agents/components` |
| `.agent/sub-agents/components/principles/subagent-principles.md` | reviewer component | Practice-wide | same bytes | `.agent/sub-agents/components` |
| `.agent/sub-agents/templates/accessibility-expert.md` | reviewer template | Repo-local, authored (host name, §2) | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/architecture-expert-barney.md` | reviewer template | Practice-wide | JC.net only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/architecture-expert-betty.md` | reviewer template | Practice-wide | JC.net only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/architecture-expert-fred.md` | reviewer template | Practice-wide | JC.net only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/architecture-expert-wilma.md` | reviewer template | Practice-wide | JC.net only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/architecture-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/assumptions-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/clerk-expert.md` | reviewer template | Repo-local, authored (host name, §2) | OCE only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/code-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/config-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/corpus-mapper.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/corpus-meta.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/corpus-reducer.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/corpus-voter.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/cricket-judgement.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/cricket-procedure.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/design-system-expert.md` | reviewer template | Repo-local, authored (host name, §2) | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/docs-adr-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/editor.md` | reviewer template | Repo-local, authored (host name, §2) | JC.net only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/elasticsearch-expert.md` | reviewer template | Practice-wide | OCE only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/ground-truth-designer.md` | reviewer template | Practice-wide | OCE only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/mcp-expert.md` | reviewer template | Repo-local, authored (host name, §2) | OCE only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/onboarding-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/pkg-expert.md` | reviewer template | Repo-local, authored (host name, §2) | JC.net only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/prose-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/react-component-expert.md` | reviewer template | Repo-local, authored (host name, §2) | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/release-readiness-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/security-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/sentry-expert.md` | reviewer template | Practice-wide | OCE only | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/subagent-architect.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/test-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agent/sub-agents/templates/type-expert.md` | reviewer template | Practice-wide | different bytes | `.agent/sub-agents/templates` |
| `.agents/agents/README.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/agents` |
| `.agents/plugins/marketplace.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/plugins` |
| `.agents/rules/agent-experience-review-lens.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/agent-state-observable.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/agentic-judgment-conserve-by-default.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/agents-default-no-gender.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/apply-architectural-principles.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/bot-identity-on-third-party-systems.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/capability-landing-decision-procedure.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/capture-practice-tool-feedback.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/channel-by-audience-lifetime-and-consumer.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/check-singleton-per-window.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/closed-shape-design-optionality.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/collaboration-is-value-contingent.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/comms-all-channels-watcher.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/compute-dont-hope.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/confident-seats-proceed-and-report.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/consolidate-at-second-consumer.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/continuity-surface-commits-as-orphans.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/coordination-branch-24h-lifetime.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/cross-estate-work-must-reduce-divergence.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/cross-repo-sessions-run-the-join-ceremony.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/design-from-impact-not-the-cowpath.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/design-values-come-from-the-system.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/design-work-for-small-prs.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/directed-routing-requires-absorption-ack.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/directive-file-context-budget.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/documentation-hygiene.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/dont-break-build-without-fix-plan.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/downstream-checkout-never-writes-upstream-surfaces.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/eef-corpus-grounding.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/executive-memory-drift-capture.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/exit-codes-in-band-never-piped.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/fleet-design-review-before-expensive-fleets.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/follow-agent-collaboration-practice.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/follow-collaboration-practice.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/follow-the-practice.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/foreign-board-write-discipline.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/generator-first-mindset.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/handoff-messages-self-contained.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/hook-policy-substring-discipline.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/identify-as-agent-under-shared-credentials.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/important-state-not-in-temp-files.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/invoke-accessibility-expert.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/invoke-architecture-expert-barney.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-architecture-expert-betty.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-architecture-expert-fred.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-architecture-expert-wilma.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-architecture-expert.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-assumptions-expert.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/invoke-clerk-expert.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/invoke-code-experts.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/invoke-config-expert.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-design-system-expert.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/invoke-docs-adr-expert.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-editor.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-elasticsearch-expert.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/invoke-mcp-expert.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/invoke-pkg-expert.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-react-component-expert.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/invoke-security-expert.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-sentry-expert.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/invoke-subagent-architect.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-test-expert.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/invoke-type-expert.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/knowledge-preservation-over-fitness-warnings.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/linear-mcp-team-and-project-hygiene.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/lint-after-edit.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/liveness-heartbeat-cron.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/local-broken-code-never-leaves.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/lockfile-rebuild-survivability.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/loop-exit-criteria-required.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/markdown-code-blocks-must-have-language.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/monitor-branch-touched-files.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/napkin-always-active.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/never-commit-to-main.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/never-disable-checks.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/never-use-git-to-remove-work.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/new-rule-vs-pdr-clause.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-conditional-tests.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-global-state-in-tests.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-hedging-vocabulary.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-moving-targets-in-permanent-docs.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-parallel-long-lived-branches.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-skipped-tests.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/no-speed-pressure.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-tombstones-for-removed-ideas.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-type-shortcuts.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/no-unbounded-host-load.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-verify-requires-fresh-authorisation.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/no-warning-toleration.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/notion-page-edits-update-ledger.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/notion-strategy-page-fence.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/oak-chrome-session-is-metered.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/one-instance-is-an-observation.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/one-pr-per-leaf-issue.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/owner-attention-at-action-moments.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/per-user-memory-is-a-buffer.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/permanent-doc-is-the-consolidation-record.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/ping-before-escalate.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/plan-body-first-principles-check.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/pr-comments-resolve-and-recheck.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/practice-core-portability.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/pre-execution-code-expert-review-per-loop-cycle.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/pre-merge-divergence-analysis.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/precedence-is-not-approval.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/present-verdicts-not-menus.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/re-apply-first-question-at-elaboration-boundaries.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/read-agent-md.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/read-before-asking.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/read-diagnostic-artefacts-in-full.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/read-nextjs-docs-before-coding.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/record-generalisation-moves.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/records-are-technical-not-emotional.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/register-active-areas-at-session-open.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/register-identity-on-thread-join.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/render-the-reference-before-reproducing.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/replace-dont-bridge.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/respect-active-agent-claims.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/review-feedback-defaults-to-triage.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/route-blocks-and-questions-to-director.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/rules-have-no-exceptions.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/scope-from-goal-before-approach.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/sha-prefix-in-collaboration-content.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/ship-independent-coordinate-dependent.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/silence-is-never-liveness.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/skill-naming-and-description-quality.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/sonarqube-mcp-instructions.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/source-curriculum-content-via-api-not-cdn.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/source-is-typescript-esm-only.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/stage-by-explicit-pathspec.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/strict-validation-at-boundary.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/subagent-practice-core-protection.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/tdd-for-refactoring.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/test-immediate-fails.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/third-party-skills-require-security-review.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/tsdoc-and-documentation-hygiene.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/rules` |
| `.agents/rules/unattended-seats-never-prompt.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/use-agent-comms-log.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/use-built-agent-tools-cli.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/use-monitor-for-event-driven-wake.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/use-result-pattern.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/use-start-right-skills.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/rules` |
| `.agents/rules/validate-full-target-estate.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/validators-must-recompute-not-just-record.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/verify-data-supports-shape-before-building.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/verify-dont-trust.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/verify-vendor-call-shapes-at-plan-author-time.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/visual-verdicts-require-rendered-proof.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/worktree-hygiene.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/rules/worktree-residency.md` | platform adapter (agents) | Repo-local, rendered | same bytes | `.agents/rules` |
| `.agents/skills/clerk-backend-api/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-backend-api/evals/evals.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-backend-api/scripts/api-specs-context.sh` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-backend-api/scripts/execute-request.sh` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-backend-api/scripts/extract-endpoint-detail.sh` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-backend-api/scripts/extract-tag-endpoints.sh` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-backend-api/scripts/extract-tags.js` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-cli/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-cli/references/agent-mode.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-cli/references/auth.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-cli/references/recipes.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/evals/evals.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/references/api-routes.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/references/caching-auth.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/references/middleware-strategies.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/references/server-actions.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/references/server-vs-client.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/app/layout.tsx` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/app/page.tsx` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/package.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/proxy.ts` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/tsconfig.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-setup/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-setup/evals/evals.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-testing/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-webhooks/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-webhooks/evals/evals.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk-webhooks/references/frameworks.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/clerk/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/jc-accessibility/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-architecture/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-author-skills/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-claude-design-pipeline/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-commit/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-comms-channels/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-comms-channels/references/comms-landscape.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-complex-merge/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-concept-exploration/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-config/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-consolidate-docs/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-consolidate-until-done/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-coordination-fold/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-cricket/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-cross-fork-integration/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-curator-pass/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-cut-coordination-branch/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-dependency-currency/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-design-system/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-deslop/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-distillation/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-docs-adr/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-editorial-voice/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-free-play/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-gates/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-go/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-inter-practice-collaboration/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-knowledge-safety-sweep/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-metacognition/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-napkin/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-package-deps-up-to-date/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-package-deps-up-to-date/references/manager-commands.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-package-deps-up-to-date/scripts/check-package-deps.py` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-audit/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-audit/assets/audit-report.yaml` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-audit/references/audit-protocol.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-audit/references/parallax-contract.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-decide/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-decide/assets/decision-world-return.yaml` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-decide/references/decision-method.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/assets/experiment-plan.template.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/references/composition-contract.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/references/design-selection.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/references/ethics-open-science.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/references/power-precision.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/references/practice-handoff.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/references/validity-analysis.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-experiment/scripts/validate_experiment_plan.py` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-inquiry/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-inquiry/assets/evidence-method-plan.yaml` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-inquiry/references/domain-profiles.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-design-inquiry/references/inquiry-design.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-frame/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-frame/assets/frame-set.yaml` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-frame/references/framing-method.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-learn/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-learn/assets/change-proposal.yaml` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-learn/assets/learning-review.yaml` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-learn/references/learning-protocol.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-learn/references/practice-memory-binding.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-product-experiment/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-product-experiment/assets/product-experiment-plan.template.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-product-experiment/references/assignment-integrity.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-product-experiment/references/composition-contract.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-product-experiment/references/metrics-inference.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-product-experiment/references/practice-handoff.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-product-experiment/references/rollout-outcomes.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-product-experiment/scripts/validate_product_experiment_plan.py` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-synthesise/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-synthesise/assets/synthesis-record.yaml` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax-synthesise/references/synthesis-method.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/assets/inquiry-charter.yaml` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/domain-profiles.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/CHANGELOG.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/README.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/architecture.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/artifact-protocol.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/concept-provenance.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/domain-profiles.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/evaluation-and-governance.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/experimental-design-boundaries.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/framework.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/glossary.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graph-semantics.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graphs/capability-artifact.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graphs/catalogue.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graphs/inquiry-state.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graphs/invocation.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graphs/learning.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graphs/provenance.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graphs/run-template.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/graphs/scale-decomposition.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/installation.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/invocation-and-entry-points.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/manifest.json` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/multi-scale-model.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/practice-memory-and-learning.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/references.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/skill-design-meta-learning.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/family/traceability-matrix.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/references/orchestration.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/scripts/render_graph.py` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-parallax/scripts/test_render_graph.py` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-pkg/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-plan/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-pr-lifecycle/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-project-spec-creation/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-proportionality/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-quality-gates/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-react-component/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-reason/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-retrospective/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-security/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-semantic-merge/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-session-handoff/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-set-up-worktree-lane/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-sif/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-start-right-quick/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-start-right-team/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-start-right-thorough/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-subagent-architecture/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-ticket-management/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-tsdoc/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-ui-visual-design/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-ui-visual-design/references/craft-fundamentals.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-undo-change/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-visual-comparison/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-visual-verification/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-working-with-agentic-ai/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-working-with-graphs/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/jc-wrap/SKILL.md` | platform adapter (agents) | Repo-local, rendered | JC.net only | `.agents/skills` |
| `.agents/skills/mcp-inspector/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/mcp-inspector/references/cli-surface-notes.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/mcp-inspector/references/mcp-2025-11-25-interpretation.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/mcp-inspector/references/security-best-practices.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/mcp-inspector/references/xaa-id-jag-interpretation.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-assess-specification/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-assess-specification/references/assessment-criteria.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-chatgpt-report-normalisation/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-claude-design-pipeline/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-codex-helper/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-commit/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-comms-channels/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-comms-channels/references/comms-landscape.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-complex-merge/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-concept-exploration/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-consolidate-docs/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-consolidate-until-done/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-coordination-fold/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-cricket/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-cross-fork-integration/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-curator-pass/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-cut-coordination-branch/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-dependency-currency/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-design-system-usage/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-design-system-usage/references/whats-where.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-free-play/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-gates/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-go/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-ground-truth-design/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-ground-truth-evaluation/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-inter-practice-collaboration/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-knowledge-safety-sweep/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-metacognition/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-napkin/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-audit/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-audit/assets/audit-report.yaml` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-audit/references/audit-protocol.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-audit/references/parallax-contract.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-decide/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-decide/assets/decision-world-return.yaml` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-decide/references/decision-method.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/assets/experiment-plan.template.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/references/composition-contract.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/references/design-selection.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/references/ethics-open-science.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/references/power-precision.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/references/practice-handoff.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/references/validity-analysis.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-experiment/scripts/validate_experiment_plan.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-inquiry/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-inquiry/assets/evidence-method-plan.yaml` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-inquiry/references/domain-profiles.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-design-inquiry/references/inquiry-design.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-frame/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-frame/assets/frame-set.yaml` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-frame/references/framing-method.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-learn/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-learn/assets/change-proposal.yaml` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-learn/assets/learning-review.yaml` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-learn/references/learning-protocol.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-learn/references/practice-memory-binding.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-product-experiment/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-product-experiment/assets/product-experiment-plan.template.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-product-experiment/references/assignment-integrity.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-product-experiment/references/composition-contract.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-product-experiment/references/metrics-inference.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-product-experiment/references/practice-handoff.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-product-experiment/references/rollout-outcomes.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-product-experiment/scripts/validate_product_experiment_plan.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-synthesise/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-synthesise/assets/synthesis-record.yaml` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax-synthesise/references/synthesis-method.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/assets/inquiry-charter.yaml` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/domain-profiles.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/CHANGELOG.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/README.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/architecture.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/artifact-protocol.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/concept-provenance.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/domain-profiles.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/evaluation-and-governance.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/experimental-design-boundaries.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/framework.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/glossary.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graph-semantics.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graphs/capability-artifact.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graphs/catalogue.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graphs/inquiry-state.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graphs/invocation.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graphs/learning.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graphs/provenance.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graphs/run-template.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/graphs/scale-decomposition.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/installation.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/invocation-and-entry-points.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/manifest.json` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/multi-scale-model.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/practice-memory-and-learning.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/references.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/skill-design-meta-learning.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/family/traceability-matrix.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/references/orchestration.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/scripts/render_graph.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-parallax/scripts/test_render_graph.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-plan/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-pr-lifecycle/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-proportionality/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-reason/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-retrospective/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-semantic-merge/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-session-handoff/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-set-up-worktree-lane/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-sif/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-slack-watcher/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-specify-connection/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-specify-connection/references/connection-method.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-specify/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-specify/references/assurance.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-specify/references/lifecycle-and-change.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-specify/references/profiles.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-specify/references/specification-record.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-start-right-quick/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-start-right-team/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-start-right-thorough/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-talk-to-slack-watcher/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-the-codex-dialogues/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-the-codex-dialogues/references/probe-record.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-the-codex-dialogues/scripts/mcp-stdio-session.mjs` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-the-codex-dialogues/scripts/probe-codex-mcp-server.mjs` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-the-codex-dialogues/scripts/probe-workspace.mjs` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-the-codex-dialogues/scripts/tool-contract.mjs` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-ticket-management/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-tsdoc/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-ui-visual-design/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-ui-visual-design/references/craft-fundamentals.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-under-the-hood/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-undo-change/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-update-bulk-download-schema/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-update-dependencies/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-update-upstream-api-spec/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-user-value/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-user-value/references/journeys-and-stories.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-user-value/references/levels-and-implementation.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-user-value/references/value-model.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-visual-comparison/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-visual-verification/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-working-with-agentic-ai/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-working-with-graphs/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/oak-wrap/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/LICENSE.txt` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/SKILL.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/agents/analyzer.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/agents/comparator.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/agents/grader.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/assets/eval_review.html` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/eval-viewer/generate_review.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/eval-viewer/viewer.html` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/references/schemas.md` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/__init__.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/aggregate_benchmark.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/generate_report.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/improve_description.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/package_skill.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/quick_validate.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/run_eval.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/run_loop.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.agents/skills/skill-creator/scripts/utils.py` | platform adapter (agents) | Repo-local, rendered | OCE only | `.agents/skills` |
| `.claude/README.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude` |
| `.claude/agents/accessibility-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/architecture-expert-barney.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/architecture-expert-betty.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/architecture-expert-fred.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/architecture-expert-wilma.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/architecture-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/agents` |
| `.claude/agents/assumptions-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/clerk-expert.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/agents` |
| `.claude/agents/code-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/config-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/corpus-mapper.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/agents` |
| `.claude/agents/corpus-meta.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/agents` |
| `.claude/agents/corpus-reducer.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/agents` |
| `.claude/agents/corpus-voter.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/agents` |
| `.claude/agents/cricket-judgement-high.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/agents` |
| `.claude/agents/cricket-judgement-low.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/agents` |
| `.claude/agents/cricket-judgement-medium.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/agents` |
| `.claude/agents/cricket-procedure-xhigh.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/design-system-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/docs-adr-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/editor.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/agents` |
| `.claude/agents/elasticsearch-expert.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/agents` |
| `.claude/agents/ground-truth-designer.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/agents` |
| `.claude/agents/mcp-expert.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/agents` |
| `.claude/agents/onboarding-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/pkg-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/agents` |
| `.claude/agents/prose-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/react-component-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/release-readiness-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/security-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/sentry-expert.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/agents` |
| `.claude/agents/subagent-architect.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/test-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/agents/type-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/agents` |
| `.claude/hooks/_lib/append-owner-only-log.mjs` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/hooks` |
| `.claude/hooks/_lib/log-hook-errors.sh` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/hooks` |
| `.claude/hooks/plan-gate-drift-alert.mjs` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/hooks` |
| `.claude/hooks/practice-session-identity.mjs` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/hooks` |
| `.claude/hooks/run-pretooluse-guard.mjs` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/hooks` |
| `.claude/hooks/secrets/pretool-secrets.sh` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/hooks` |
| `.claude/hooks/secrets/prompt-secrets.sh` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/hooks` |
| `.claude/hooks/sonar-secrets/build-scripts/pretool-secrets.sh` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/hooks` |
| `.claude/hooks/sonar-secrets/build-scripts/prompt-secrets.sh` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/hooks` |
| `.claude/rules/agent-experience-review-lens.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/agent-state-observable.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/agentic-judgment-conserve-by-default.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/agents-default-no-gender.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/apply-architectural-principles.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/bot-identity-on-third-party-systems.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/capability-landing-decision-procedure.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/capture-practice-tool-feedback.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/channel-by-audience-lifetime-and-consumer.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/check-singleton-per-window.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/closed-shape-design-optionality.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/collaboration-is-value-contingent.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/comms-all-channels-watcher.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/compute-dont-hope.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/confident-seats-proceed-and-report.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/consolidate-at-second-consumer.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/continuity-surface-commits-as-orphans.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/coordination-branch-24h-lifetime.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/cross-estate-work-must-reduce-divergence.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/cross-repo-sessions-run-the-join-ceremony.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/design-from-impact-not-the-cowpath.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/design-values-come-from-the-system.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/design-work-for-small-prs.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/directed-routing-requires-absorption-ack.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/directive-file-context-budget.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/documentation-hygiene.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/dont-break-build-without-fix-plan.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/downstream-checkout-never-writes-upstream-surfaces.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/eef-corpus-grounding.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/executive-memory-drift-capture.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/exit-codes-in-band-never-piped.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/fleet-design-review-before-expensive-fleets.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/follow-agent-collaboration-practice.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/follow-collaboration-practice.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/follow-the-practice.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/foreign-board-write-discipline.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/generator-first-mindset.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/handoff-messages-self-contained.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/hook-policy-substring-discipline.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/identify-as-agent-under-shared-credentials.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/important-state-not-in-temp-files.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/invoke-accessibility-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/invoke-architecture-expert-barney.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-architecture-expert-betty.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-architecture-expert-fred.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-architecture-expert-wilma.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-architecture-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-assumptions-expert.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/invoke-clerk-expert.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/invoke-code-experts.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/invoke-config-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-design-system-expert.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/invoke-docs-adr-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-editor.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-elasticsearch-expert.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/invoke-mcp-expert.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/invoke-pkg-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-react-component-expert.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/invoke-security-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-sentry-expert.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/invoke-subagent-architect.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-test-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/invoke-type-expert.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/knowledge-preservation-over-fitness-warnings.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/linear-mcp-team-and-project-hygiene.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/lint-after-edit.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/liveness-heartbeat-cron.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/local-broken-code-never-leaves.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/lockfile-rebuild-survivability.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/loop-exit-criteria-required.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/markdown-code-blocks-must-have-language.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/monitor-branch-touched-files.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/napkin-always-active.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/never-commit-to-main.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/never-disable-checks.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/never-use-git-to-remove-work.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/new-rule-vs-pdr-clause.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-conditional-tests.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-global-state-in-tests.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/no-hedging-vocabulary.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-moving-targets-in-permanent-docs.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-parallel-long-lived-branches.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-skipped-tests.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/no-speed-pressure.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-tombstones-for-removed-ideas.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-type-shortcuts.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/no-unbounded-host-load.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-verify-requires-fresh-authorisation.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/no-warning-toleration.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/notion-page-edits-update-ledger.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/notion-strategy-page-fence.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/oak-chrome-session-is-metered.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/one-instance-is-an-observation.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/one-pr-per-leaf-issue.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/owner-attention-at-action-moments.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/per-user-memory-is-a-buffer.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/permanent-doc-is-the-consolidation-record.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/ping-before-escalate.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/plan-body-first-principles-check.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/pr-comments-resolve-and-recheck.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/practice-core-portability.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/pre-execution-code-expert-review-per-loop-cycle.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/pre-merge-divergence-analysis.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/precedence-is-not-approval.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/present-verdicts-not-menus.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/re-apply-first-question-at-elaboration-boundaries.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/read-agent-md.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/read-before-asking.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/read-diagnostic-artefacts-in-full.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/read-nextjs-docs-before-coding.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/record-generalisation-moves.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/records-are-technical-not-emotional.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/register-active-areas-at-session-open.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/register-identity-on-thread-join.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/render-the-reference-before-reproducing.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/replace-dont-bridge.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/respect-active-agent-claims.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/review-feedback-defaults-to-triage.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/route-blocks-and-questions-to-director.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/rules-have-no-exceptions.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/scope-from-goal-before-approach.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/sha-prefix-in-collaboration-content.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/ship-independent-coordinate-dependent.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/silence-is-never-liveness.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/skill-naming-and-description-quality.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/sonarqube-mcp-instructions.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/source-curriculum-content-via-api-not-cdn.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/source-is-typescript-esm-only.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/stage-by-explicit-pathspec.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/strict-validation-at-boundary.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/subagent-practice-core-protection.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/tdd-for-refactoring.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/test-immediate-fails.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/third-party-skills-require-security-review.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/tsdoc-and-documentation-hygiene.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/rules` |
| `.claude/rules/unattended-seats-never-prompt.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/use-agent-comms-log.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/use-built-agent-tools-cli.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/use-monitor-for-event-driven-wake.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/use-result-pattern.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/use-start-right-skills.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/rules` |
| `.claude/rules/validate-full-target-estate.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/validators-must-recompute-not-just-record.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/verify-data-supports-shape-before-building.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/verify-dont-trust.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/verify-vendor-call-shapes-at-plan-author-time.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/visual-verdicts-require-rendered-proof.md` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude/rules` |
| `.claude/rules/worktree-hygiene.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/rules/worktree-residency.md` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/rules` |
| `.claude/scripts/statusline-identity.mjs` | platform adapter (Claude) | Repo-local, rendered | same bytes | `.claude/scripts` |
| `.claude/settings.json` | platform adapter (Claude) | Repo-local, rendered | different bytes | `.claude` |
| `.claude/skills/clerk` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/clerk-backend-api` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/clerk-cli` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/clerk-nextjs-patterns` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/clerk-setup` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/clerk-testing` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/clerk-webhooks` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/jc-accessibility/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-architecture/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-author-skills/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-claude-design-pipeline/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-commit/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-comms-channels/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-comms-channels/references/comms-landscape.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-complex-merge/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-concept-exploration/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-config/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-consolidate-docs/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-consolidate-until-done/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-coordination-fold/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-cricket/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-cross-fork-integration/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-curator-pass/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-cut-coordination-branch/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-dependency-currency/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-design-system/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-deslop/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-distillation/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-docs-adr/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-editorial-voice/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-free-play/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-gates/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-go/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-inter-practice-collaboration/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-knowledge-safety-sweep/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-metacognition/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-napkin/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-package-deps-up-to-date/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-package-deps-up-to-date/references/manager-commands.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-package-deps-up-to-date/scripts/check-package-deps.py` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-audit/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-audit/assets/audit-report.yaml` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-audit/references/audit-protocol.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-audit/references/parallax-contract.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-decide/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-decide/assets/decision-world-return.yaml` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-decide/references/decision-method.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/assets/experiment-plan.template.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/references/composition-contract.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/references/design-selection.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/references/ethics-open-science.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/references/power-precision.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/references/practice-handoff.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/references/validity-analysis.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-experiment/scripts/validate_experiment_plan.py` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-inquiry/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-inquiry/assets/evidence-method-plan.yaml` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-inquiry/references/domain-profiles.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-design-inquiry/references/inquiry-design.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-frame/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-frame/assets/frame-set.yaml` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-frame/references/framing-method.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-learn/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-learn/assets/change-proposal.yaml` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-learn/assets/learning-review.yaml` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-learn/references/learning-protocol.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-learn/references/practice-memory-binding.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-product-experiment/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-product-experiment/assets/product-experiment-plan.template.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-product-experiment/references/assignment-integrity.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-product-experiment/references/composition-contract.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-product-experiment/references/metrics-inference.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-product-experiment/references/practice-handoff.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-product-experiment/references/rollout-outcomes.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-product-experiment/scripts/validate_product_experiment_plan.py` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-synthesise/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-synthesise/assets/synthesis-record.yaml` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax-synthesise/references/synthesis-method.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/assets/inquiry-charter.yaml` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/domain-profiles.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/CHANGELOG.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/README.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/architecture.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/artifact-protocol.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/concept-provenance.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/domain-profiles.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/evaluation-and-governance.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/experimental-design-boundaries.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/framework.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/glossary.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graph-semantics.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graphs/capability-artifact.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graphs/catalogue.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graphs/inquiry-state.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graphs/invocation.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graphs/learning.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graphs/provenance.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graphs/run-template.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/graphs/scale-decomposition.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/installation.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/invocation-and-entry-points.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/manifest.json` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/multi-scale-model.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/practice-memory-and-learning.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/references.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/skill-design-meta-learning.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/family/traceability-matrix.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/references/orchestration.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/scripts/render_graph.py` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-parallax/scripts/test_render_graph.py` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-pkg/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-plan/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-pr-lifecycle/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-project-spec-creation/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-proportionality/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-quality-gates/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-react-component/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-reason/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-retrospective/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-security/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-semantic-merge/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-session-handoff/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-set-up-worktree-lane/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-sif/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-start-right-quick/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-start-right-team/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-start-right-thorough/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-subagent-architecture/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-ticket-management/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-tsdoc/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-ui-visual-design/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-ui-visual-design/references/craft-fundamentals.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-undo-change/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-visual-comparison/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-visual-verification/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-working-with-agentic-ai/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-working-with-graphs/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/jc-wrap/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | JC.net only | `.claude/skills` |
| `.claude/skills/mcp-inspector` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-assess-specification/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-assess-specification/references/assessment-criteria.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-chatgpt-report-normalisation/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-claude-design-pipeline/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-codex-helper/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-commit/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-comms-channels/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-comms-channels/references/comms-landscape.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-complex-merge/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-concept-exploration/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-consolidate-docs/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-consolidate-until-done/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-coordination-fold/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-cricket/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-cross-fork-integration/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-curator-pass/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-cut-coordination-branch/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-dependency-currency/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-design-system-usage/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-design-system-usage/references/whats-where.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-free-play/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-gates/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-go/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-ground-truth-design/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-ground-truth-evaluation/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-inter-practice-collaboration/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-knowledge-safety-sweep/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-metacognition/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-napkin/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-audit/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-audit/assets/audit-report.yaml` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-audit/references/audit-protocol.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-audit/references/parallax-contract.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-decide/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-decide/assets/decision-world-return.yaml` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-decide/references/decision-method.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/assets/experiment-plan.template.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/references/composition-contract.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/references/design-selection.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/references/ethics-open-science.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/references/power-precision.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/references/practice-handoff.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/references/validity-analysis.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-experiment/scripts/validate_experiment_plan.py` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-inquiry/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-inquiry/assets/evidence-method-plan.yaml` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-inquiry/references/domain-profiles.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-design-inquiry/references/inquiry-design.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-frame/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-frame/assets/frame-set.yaml` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-frame/references/framing-method.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-learn/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-learn/assets/change-proposal.yaml` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-learn/assets/learning-review.yaml` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-learn/references/learning-protocol.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-learn/references/practice-memory-binding.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-product-experiment/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-product-experiment/assets/product-experiment-plan.template.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-product-experiment/references/assignment-integrity.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-product-experiment/references/composition-contract.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-product-experiment/references/metrics-inference.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-product-experiment/references/practice-handoff.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-product-experiment/references/rollout-outcomes.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-product-experiment/scripts/validate_product_experiment_plan.py` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-synthesise/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-synthesise/assets/synthesis-record.yaml` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax-synthesise/references/synthesis-method.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/assets/inquiry-charter.yaml` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/domain-profiles.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/CHANGELOG.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/README.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/architecture.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/artifact-protocol.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/concept-provenance.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/domain-profiles.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/evaluation-and-governance.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/experimental-design-boundaries.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/framework.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/glossary.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graph-semantics.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graphs/capability-artifact.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graphs/catalogue.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graphs/inquiry-state.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graphs/invocation.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graphs/learning.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graphs/provenance.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graphs/run-template.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/graphs/scale-decomposition.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/installation.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/invocation-and-entry-points.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/manifest.json` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/multi-scale-model.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/practice-memory-and-learning.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/references.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/skill-design-meta-learning.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/family/traceability-matrix.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/references/orchestration.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/scripts/render_graph.py` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-parallax/scripts/test_render_graph.py` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-plan/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-pr-lifecycle/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-proportionality/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-reason/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-retrospective/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-semantic-merge/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-session-handoff/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-set-up-worktree-lane/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-sif/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-slack-watcher/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-specify-connection/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-specify-connection/references/connection-method.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-specify/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-specify/references/assurance.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-specify/references/lifecycle-and-change.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-specify/references/profiles.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-specify/references/specification-record.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-start-right-quick/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-start-right-team/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-start-right-thorough/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-talk-to-slack-watcher/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-the-codex-dialogues/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-the-codex-dialogues/references/probe-record.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-the-codex-dialogues/scripts/mcp-stdio-session.mjs` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-the-codex-dialogues/scripts/probe-codex-mcp-server.mjs` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-the-codex-dialogues/scripts/probe-workspace.mjs` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-the-codex-dialogues/scripts/tool-contract.mjs` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-ticket-management/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-tsdoc/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-ui-visual-design/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-ui-visual-design/references/craft-fundamentals.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-under-the-hood/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-undo-change/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-update-bulk-download-schema/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-update-dependencies/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-update-upstream-api-spec/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-user-value/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-user-value/references/journeys-and-stories.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-user-value/references/levels-and-implementation.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-user-value/references/value-model.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-visual-comparison/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-visual-verification/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-working-with-agentic-ai/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-working-with-graphs/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/oak-wrap/SKILL.md` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.claude/skills/skill-creator` | platform adapter (Claude) | Repo-local, rendered | OCE only | `.claude/skills` |
| `.codex/README.md` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex` |
| `.codex/agents/accessibility-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/architecture-expert-barney.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/architecture-expert-betty.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/architecture-expert-fred.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/architecture-expert-wilma.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/architecture-expert.toml` | platform adapter (Codex) | Repo-local, rendered | JC.net only | `.codex/agents` |
| `.codex/agents/assumptions-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/clerk-expert.toml` | platform adapter (Codex) | Repo-local, rendered | OCE only | `.codex/agents` |
| `.codex/agents/code-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/config-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/corpus-mapper.toml` | platform adapter (Codex) | Repo-local, rendered | same bytes | `.codex/agents` |
| `.codex/agents/corpus-meta.toml` | platform adapter (Codex) | Repo-local, rendered | same bytes | `.codex/agents` |
| `.codex/agents/corpus-reducer.toml` | platform adapter (Codex) | Repo-local, rendered | same bytes | `.codex/agents` |
| `.codex/agents/corpus-voter.toml` | platform adapter (Codex) | Repo-local, rendered | same bytes | `.codex/agents` |
| `.codex/agents/cricket-judgement-low.toml` | platform adapter (Codex) | Repo-local, rendered | same bytes | `.codex/agents` |
| `.codex/agents/cricket-judgement-medium.toml` | platform adapter (Codex) | Repo-local, rendered | same bytes | `.codex/agents` |
| `.codex/agents/cricket-procedure-xhigh.toml` | platform adapter (Codex) | Repo-local, rendered | same bytes | `.codex/agents` |
| `.codex/agents/design-system-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/docs-adr-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/editor.toml` | platform adapter (Codex) | Repo-local, rendered | JC.net only | `.codex/agents` |
| `.codex/agents/elasticsearch-expert.toml` | platform adapter (Codex) | Repo-local, rendered | OCE only | `.codex/agents` |
| `.codex/agents/ground-truth-designer.toml` | platform adapter (Codex) | Repo-local, rendered | OCE only | `.codex/agents` |
| `.codex/agents/mcp-expert.toml` | platform adapter (Codex) | Repo-local, rendered | OCE only | `.codex/agents` |
| `.codex/agents/onboarding-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/pkg-expert.toml` | platform adapter (Codex) | Repo-local, rendered | JC.net only | `.codex/agents` |
| `.codex/agents/prose-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/react-component-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/release-readiness-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/security-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/sentry-expert.toml` | platform adapter (Codex) | Repo-local, rendered | OCE only | `.codex/agents` |
| `.codex/agents/subagent-architect.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/test-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/agents/type-expert.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex/agents` |
| `.codex/config.toml` | platform adapter (Codex) | Repo-local, rendered | different bytes | `.codex` |
| `.codex/hooks/practice-session-identity.mjs` | platform adapter (Codex) | Repo-local, rendered | same bytes | `.codex/hooks` |
| `.codex/rules/seat-landing.rules` | platform adapter (Codex) | Repo-local, rendered | OCE only | `.codex/rules` |
| `.cursor/BUGBOT.md` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor` |
| `.cursor/agents/accessibility-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/architecture-expert-barney.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/architecture-expert-betty.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/architecture-expert-fred.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/architecture-expert-wilma.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/architecture-expert.md` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/agents` |
| `.cursor/agents/assumptions-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/clerk-expert.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/agents` |
| `.cursor/agents/code-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/config-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/corpus-mapper.md` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/agents` |
| `.cursor/agents/corpus-meta.md` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/agents` |
| `.cursor/agents/corpus-reducer.md` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/agents` |
| `.cursor/agents/corpus-voter.md` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/agents` |
| `.cursor/agents/cricket-judgement-high.md` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/agents` |
| `.cursor/agents/cricket-judgement-low.md` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/agents` |
| `.cursor/agents/cricket-judgement-medium.md` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/agents` |
| `.cursor/agents/cricket-procedure-xhigh.md` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/agents` |
| `.cursor/agents/design-system-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/docs-adr-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/editor.md` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/agents` |
| `.cursor/agents/elasticsearch-expert.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/agents` |
| `.cursor/agents/ground-truth-designer.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/agents` |
| `.cursor/agents/mcp-expert.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/agents` |
| `.cursor/agents/onboarding-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/pkg-expert.md` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/agents` |
| `.cursor/agents/prose-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/react-component-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/release-readiness-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/security-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/sentry-expert.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/agents` |
| `.cursor/agents/subagent-architect.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/test-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/agents/type-expert.md` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/agents` |
| `.cursor/hooks.json` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor` |
| `.cursor/hooks/oak-session-identity.mjs` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/hooks` |
| `.cursor/hooks/practice-session-identity.mjs` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/hooks` |
| `.cursor/hooks/state/continual-learning-index.json` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/hooks` |
| `.cursor/hooks/state/continual-learning.json` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/hooks` |
| `.cursor/mcp.json` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor` |
| `.cursor/plans/agent_tooling_frictions_09524b96.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/collaboration-cli-gaps_cd883acd.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/cursor_statusline_0541a941.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/depcruise_phase_0_audit_18246fac.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/dependency_latest_sweep_7dec7984.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/ecosystem_progress_and_direction_summary_63e1dacf.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/execute_l8_ws1_red_88e5e9d3.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/foundation_overhaul_timeless_c863fde9.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/gate_topology_decisions_53f60354.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/graph-mvp-arc-wave-review_0de6058b.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/historical_napkin_synthesis_53bde57a.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/kg-neo4j-stardog_report_normalisation_f0472ea6.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/knip_phase_0_execution_7b95c671.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/knip_phase_1_execution_5c6aff4e.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/knip_phase_2.5_execution_e7e98c41.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/knip_phase_2_execution_cc08d451.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/memory-feedback-session-6_43c43993.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/pkg_skill_and_reviewer_98b9e371.plan.md` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/plans` |
| `.cursor/plans/plan_eebb35ed.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/practice-aligned_project_directions_research_ea215686.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/promote_startup_boundary_2e560ad7.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/sentry-alert-validation-closure_50877760.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/sentry-cli-hygiene-followup_90cc0014.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/sentry-evidence-closure_7848020e.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/sentry-posthog-oak-overlay_6a16ff6e.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/startup_boundary_phase1_9b36f557.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/plans/takeover-gate-completion_620d7f7b.plan.md` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/plans` |
| `.cursor/rules/agent-experience-review-lens.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/agent-state-observable.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/agentic-judgment-conserve-by-default.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/agents-default-no-gender.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/apply-architectural-principles.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/bot-identity-on-third-party-systems.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/capability-landing-decision-procedure.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/capture-practice-tool-feedback.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/channel-by-audience-lifetime-and-consumer.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/check-singleton-per-window.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/closed-shape-design-optionality.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/collaboration-is-value-contingent.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/comms-all-channels-watcher.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/compute-dont-hope.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/confident-seats-proceed-and-report.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/consolidate-at-second-consumer.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/continuity-surface-commits-as-orphans.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/coordination-branch-24h-lifetime.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/cross-estate-work-must-reduce-divergence.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/cross-repo-sessions-run-the-join-ceremony.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/design-from-impact-not-the-cowpath.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/design-values-come-from-the-system.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/design-work-for-small-prs.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/directed-routing-requires-absorption-ack.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/directive-file-context-budget.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/documentation-hygiene.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/dont-break-build-without-fix-plan.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/downstream-checkout-never-writes-upstream-surfaces.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/eef-corpus-grounding.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/executive-memory-drift-capture.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/exit-codes-in-band-never-piped.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/fleet-design-review-before-expensive-fleets.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/follow-agent-collaboration-practice.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/follow-collaboration-practice.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/follow-the-practice.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/foreign-board-write-discipline.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/generator-first-mindset.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/handoff-messages-self-contained.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/hook-policy-substring-discipline.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/identify-as-agent-under-shared-credentials.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/important-state-not-in-temp-files.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/invoke-accessibility-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/invoke-architecture-expert-barney.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-architecture-expert-betty.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-architecture-expert-fred.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-architecture-expert-wilma.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-architecture-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-assumptions-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/invoke-clerk-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/invoke-code-experts.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/invoke-config-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-design-system-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/invoke-doc-and-onboarding-experts-on-significant-changes.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/invoke-docs-adr-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-editor.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-elasticsearch-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/invoke-mcp-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/invoke-pkg-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-react-component-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/invoke-security-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-sentry-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/invoke-subagent-architect.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-test-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/invoke-type-expert.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/knowledge-preservation-over-fitness-warnings.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/linear-mcp-team-and-project-hygiene.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/lint-after-edit.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/liveness-heartbeat-cron.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/local-broken-code-never-leaves.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/lockfile-rebuild-survivability.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/loop-exit-criteria-required.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/markdown-code-blocks-must-have-language.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/monitor-branch-touched-files.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/napkin-always-active.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/never-commit-to-main.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/never-disable-checks.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/never-use-git-to-remove-work.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/new-rule-vs-pdr-clause.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-conditional-tests.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-global-state-in-tests.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/no-hedging-vocabulary.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-moving-targets-in-permanent-docs.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-parallel-long-lived-branches.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-skipped-tests.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/no-speed-pressure.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-tombstones-for-removed-ideas.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-type-shortcuts.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/no-unbounded-host-load.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-verify-requires-fresh-authorisation.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/no-warning-toleration.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/notion-page-edits-update-ledger.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/notion-strategy-page-fence.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/oak-chrome-session-is-metered.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/one-instance-is-an-observation.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/one-pr-per-leaf-issue.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/owner-attention-at-action-moments.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/per-user-memory-is-a-buffer.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/permanent-doc-is-the-consolidation-record.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/ping-before-escalate.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/plan-body-first-principles-check.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/pr-comments-resolve-and-recheck.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/practice-core-portability.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/pre-execution-code-expert-review-per-loop-cycle.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/pre-merge-divergence-analysis.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/precedence-is-not-approval.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/present-verdicts-not-menus.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/re-apply-first-question-at-elaboration-boundaries.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/read-agent-md.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/read-before-asking.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/read-diagnostic-artefacts-in-full.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/read-nextjs-docs-before-coding.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/record-generalisation-moves.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/records-are-technical-not-emotional.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/register-active-areas-at-session-open.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/register-identity-on-thread-join.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/render-the-reference-before-reproducing.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/replace-dont-bridge.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/respect-active-agent-claims.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/review-feedback-defaults-to-triage.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/route-blocks-and-questions-to-director.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/rules-have-no-exceptions.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/scope-from-goal-before-approach.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/sha-prefix-in-collaboration-content.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/ship-independent-coordinate-dependent.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/silence-is-never-liveness.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/skill-naming-and-description-quality.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/sonarqube-mcp-instructions.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/source-curriculum-content-via-api-not-cdn.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/source-is-typescript-esm-only.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/stage-by-explicit-pathspec.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/strict-validation-at-boundary.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/subagent-practice-core-protection.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/tdd-for-refactoring.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/test-immediate-fails.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/third-party-skills-require-security-review.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/tsdoc-and-documentation-hygiene.mdc` | platform adapter (Cursor) | Repo-local, rendered | JC.net only | `.cursor/rules` |
| `.cursor/rules/unattended-seats-never-prompt.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/use-agent-comms-log.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/use-built-agent-tools-cli.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/use-monitor-for-event-driven-wake.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/use-result-pattern.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/use-start-right-skills.mdc` | platform adapter (Cursor) | Repo-local, rendered | OCE only | `.cursor/rules` |
| `.cursor/rules/validate-full-target-estate.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/validators-must-recompute-not-just-record.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/verify-data-supports-shape-before-building.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/verify-dont-trust.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/verify-vendor-call-shapes-at-plan-author-time.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/visual-verdicts-require-rendered-proof.mdc` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/rules` |
| `.cursor/rules/worktree-hygiene.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/rules/worktree-residency.mdc` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/rules` |
| `.cursor/scripts/install-statusline-cli-config.mjs` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor/scripts` |
| `.cursor/scripts/statusline-identity.mjs` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor/scripts` |
| `.cursor/settings.json` | platform adapter (Cursor) | Repo-local, rendered | different bytes | `.cursor` |
| `.cursor/statusline.cli.fragment.json` | platform adapter (Cursor) | Repo-local, rendered | same bytes | `.cursor` |
| `.dependency-cruiser.mjs` | lint config | Language-wide (TypeScript) | different bytes | `.dependency-cruiser.mjs` |
| `.gemini/agents/accessibility-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/architecture-expert-barney.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/architecture-expert-betty.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/architecture-expert-fred.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/architecture-expert-wilma.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/architecture-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/assumptions-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/code-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/config-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/corpus-mapper.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/corpus-meta.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/design-system-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/docs-adr-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/editor.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/onboarding-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/pkg-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/prose-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/react-component-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/release-readiness-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/security-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/subagent-architect.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/test-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/agents/type-expert.md` | platform adapter (Gemini) | Repo-local, rendered | JC.net only | `.gemini/agents` |
| `.gemini/commands/review-accessibility.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-architecture-barney.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-architecture-betty.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-architecture-fred.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-architecture-wilma.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-assumptions.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-code.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-config.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-design-system.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-docs.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-elasticsearch.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-ground-truth.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-onboarding.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-react-component.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-release.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-security.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-subagents.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-tests.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/commands/review-types.toml` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini/commands` |
| `.gemini/settings.json` | platform adapter (Gemini) | Repo-local, rendered | OCE only | `.gemini` |
| `.github/CODEOWNERS` | ownership binding | Repo-local, authored | different bytes | `.github` |
| `.github/copilot-instructions.md` | entry point | Repo-local, authored | different bytes | `.github` |
| `.github/workflows/ci.yml` | CI workflow | Repo-local, host | different bytes | `.github/workflows` |
| `.github/workflows/codeql.yml` | CI workflow | Repo-local, host | different bytes | `.github/workflows` |
| `.github/workflows/dependency-review.yml` | CI workflow | Repo-local, host | different bytes | `.github/workflows` |
| `.github/workflows/mcp-conformance-unattended.yml` | CI workflow | Repo-local, host | OCE only | `.github/workflows` |
| `.github/workflows/preview-serves.yml` | CI workflow | Repo-local, host | OCE only | `.github/workflows` |
| `.github/workflows/release.yml` | CI workflow | Repo-local, host | OCE only | `.github/workflows` |
| `.github/workflows/upstream-carrier.yml` | CI workflow | Repo-local, host | OCE only | `.github/workflows` |
| `.github/workflows/upstream-mirror.yml` | CI workflow | Repo-local, host | OCE only | `.github/workflows` |
| `.gitleaks.toml` | lint config | Language-wide (TypeScript) | different bytes | `.gitleaks.toml` |
| `.husky/applypatch-msg` | gate script | Language-wide (TypeScript) | different bytes | `.husky` |
| `.husky/commit-msg` | gate script | Language-wide (TypeScript) | different bytes | `.husky` |
| `.husky/pre-commit` | gate script | Language-wide (TypeScript) | different bytes | `.husky` |
| `.husky/pre-merge-commit` | gate script | Language-wide (TypeScript) | different bytes | `.husky` |
| `.husky/pre-push` | gate script | Language-wide (TypeScript) | different bytes | `.husky` |
| `.husky/pre-rebase` | gate script | Language-wide (TypeScript) | different bytes | `.husky` |
| `.husky/prepare-commit-msg` | gate script | Language-wide (TypeScript) | different bytes | `.husky` |
| `.husky/refuse-commit-on-main.sh` | gate script | Language-wide (TypeScript) | different bytes | `.husky` |
| `.husky/turbo-remote-cache-notice.sh` | gate script | Language-wide (TypeScript) | same bytes | `.husky` |
| `.markdownlint-cli2.jsonc` | lint config | Language-wide (TypeScript) | different bytes | `.markdownlint-cli2.jsonc` |
| `.markdownlint.json` | lint config | Language-wide (TypeScript) | same bytes | `.markdownlint.json` |
| `.prettierignore` | lint config | Language-wide (TypeScript) | different bytes | `.prettierignore` |
| `.prettierrc.json` | lint config | Language-wide (TypeScript) | OCE only | `.prettierrc.json` |
| `AGENTS.md` | entry point | Repo-local, authored | different bytes | `AGENTS.md` |
| `CLAUDE.md` | entry point | Repo-local, authored | different bytes | `CLAUDE.md` |
| `GEMINI.md` | entry point | Repo-local, authored | different bytes | `GEMINI.md` |
| `agent-tools/README.md` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools` |
| `agent-tools/docs/agent-identity.md` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/docs` |
| `agent-tools/docs/agent-support-tools-specification.md` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/docs` |
| `agent-tools/e2e-tests/collaboration-tui.e2e.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/e2e-tests` |
| `agent-tools/eslint.config.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools` |
| `agent-tools/package.json` | tooling command surface | Language-wide (TypeScript) | different bytes | `agent-tools` |
| `agent-tools/smoke-tests/branch-guard.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/branch-guard.smoke.ts` |
| `agent-tools/smoke-tests/build-run-artefact-cli.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/build-run-artefact-cli.smoke.ts` |
| `agent-tools/smoke-tests/claude-hook-command-fixture.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/claude-hook-command-fixture.ts` |
| `agent-tools/smoke-tests/codex-session-alert-bootstrap.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/codex-session-alert-bootstrap.smoke.ts` |
| `agent-tools/smoke-tests/collaboration-tui-start.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-tui-start.smoke.ts` |
| `agent-tools/smoke-tests/commit-queue-git-rename.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue-git-rename.smoke.ts` |
| `agent-tools/smoke-tests/commit-queue-registry-fixture.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue-registry-fixture.ts` |
| `agent-tools/smoke-tests/commit-queue-registry.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue-registry.smoke.ts` |
| `agent-tools/smoke-tests/commit-queue-store.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue-store.smoke.ts` |
| `agent-tools/smoke-tests/commit-queue-worktree-fixture.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue-worktree-fixture.ts` |
| `agent-tools/smoke-tests/commit-queue-worktree.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue-worktree.smoke.ts` |
| `agent-tools/smoke-tests/comms-watch-coordination-home-fixture.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/comms-watch-coordination-home-fixture.ts` |
| `agent-tools/smoke-tests/comms-watch-coordination-home.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/comms-watch-coordination-home.smoke.ts` |
| `agent-tools/smoke-tests/corpus-drivers-tree-bound-root.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-drivers-tree-bound-root.smoke.ts` |
| `agent-tools/smoke-tests/esm-import-extensions.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/esm-import-extensions.smoke.ts` |
| `agent-tools/smoke-tests/exchange-register-cli.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/exchange-register-cli.smoke.ts` |
| `agent-tools/smoke-tests/gate-slot-cli.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/gate-slot-cli.smoke.ts` |
| `agent-tools/smoke-tests/gate-slot-fixture.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot-fixture.ts` |
| `agent-tools/smoke-tests/gate-slot-smoke-children.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot-smoke-children.ts` |
| `agent-tools/smoke-tests/gate-slot-smoke-support.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot-smoke-support.ts` |
| `agent-tools/smoke-tests/gate-slot-wrapper.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot-wrapper.smoke.ts` |
| `agent-tools/smoke-tests/git-without-show-current.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/git-without-show-current.ts` |
| `agent-tools/smoke-tests/hermetic-git-env.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/hermetic-git-env.ts` |
| `agent-tools/smoke-tests/hook-error-logs-support.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/hook-error-logs-support.ts` |
| `agent-tools/smoke-tests/hook-error-logs.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/hook-error-logs.smoke.ts` |
| `agent-tools/smoke-tests/hook-wrapper-quoting.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/hook-wrapper-quoting.smoke.ts` |
| `agent-tools/smoke-tests/install-version-guard.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/install-version-guard.smoke.ts` |
| `agent-tools/smoke-tests/invalid-flags-drivers.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/invalid-flags-drivers.smoke.ts` |
| `agent-tools/smoke-tests/mcp-conformance-cli.smoke.ts` | tooling smoke test | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance-cli.smoke.ts` |
| `agent-tools/smoke-tests/merge-bot-push-output.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot-push-output.smoke.ts` |
| `agent-tools/smoke-tests/merge-bot-retire-failsafe.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot-retire-failsafe.smoke.ts` |
| `agent-tools/smoke-tests/merge-bot-retire-fixture.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot-retire-fixture.ts` |
| `agent-tools/smoke-tests/merge-bot-retire-github-double.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot-retire-github-double.ts` |
| `agent-tools/smoke-tests/merge-bot-retire-in-use-states.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot-retire-in-use-states.smoke.ts` |
| `agent-tools/smoke-tests/merge-bot-retire-in-use.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot-retire-in-use.smoke.ts` |
| `agent-tools/smoke-tests/merge-bot-retire-reads.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot-retire-reads.smoke.ts` |
| `agent-tools/smoke-tests/merge-bot-retire-refusals.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot-retire-refusals.smoke.ts` |
| `agent-tools/smoke-tests/merge-bot-retire.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot-retire.smoke.ts` |
| `agent-tools/smoke-tests/operator-profile-cli.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/operator-profile-cli.smoke.ts` |
| `agent-tools/smoke-tests/operator-profile-contract.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/operator-profile-contract.smoke.ts` |
| `agent-tools/smoke-tests/operator-profile-read-fifo.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/operator-profile-read-fifo.smoke.ts` |
| `agent-tools/smoke-tests/operator-profile-sync-link.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/operator-profile-sync-link.smoke.ts` |
| `agent-tools/smoke-tests/operator-profile-sync-merge.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/operator-profile-sync-merge.smoke.ts` |
| `agent-tools/smoke-tests/plan-gate-drift-alert-hook.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/plan-gate-drift-alert-hook.smoke.ts` |
| `agent-tools/smoke-tests/post-run-drivers-invalid-flags.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/post-run-drivers-invalid-flags.smoke.ts` |
| `agent-tools/smoke-tests/pr-watch-content-binding.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch-content-binding.smoke.ts` |
| `agent-tools/smoke-tests/pre-compact-observe-fixture.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/pre-compact-observe-fixture.ts` |
| `agent-tools/smoke-tests/pre-compact-observe-hook.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/pre-compact-observe-hook.smoke.ts` |
| `agent-tools/smoke-tests/pre-compact-observe.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/pre-compact-observe.smoke.ts` |
| `agent-tools/smoke-tests/pre-tool-use-dispatch.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/pre-tool-use-dispatch.smoke.ts` |
| `agent-tools/smoke-tests/pretool-secrets.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/pretool-secrets.smoke.ts` |
| `agent-tools/smoke-tests/prompt-secrets-mentions.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/prompt-secrets-mentions.smoke.ts` |
| `agent-tools/smoke-tests/prompt-secrets-support.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/prompt-secrets-support.ts` |
| `agent-tools/smoke-tests/prompt-secrets.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/prompt-secrets.smoke.ts` |
| `agent-tools/smoke-tests/registered-hook-command-fixture.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/registered-hook-command-fixture.ts` |
| `agent-tools/smoke-tests/repo-check-cli.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check-cli.smoke.ts` |
| `agent-tools/smoke-tests/repo-check-repair.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check-repair.smoke.ts` |
| `agent-tools/smoke-tests/run-smoke-tests-cli.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | same bytes | `agent-tools/run-smoke-tests-cli.smoke.ts` |
| `agent-tools/smoke-tests/secrets-hooks-support.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/secrets-hooks-support.ts` |
| `agent-tools/smoke-tests/transaction-lock.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/transaction-lock.smoke.ts` |
| `agent-tools/smoke-tests/trusted-shell-directories.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/trusted-shell-directories.ts` |
| `agent-tools/smoke-tests/typescript-estate-atomic-publication.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate-atomic-publication.smoke.ts` |
| `agent-tools/smoke-tests/typescript-estate-classification-boundary.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate-classification-boundary.smoke.ts` |
| `agent-tools/smoke-tests/typescript-estate-pinned-blob.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate-pinned-blob.smoke.ts` |
| `agent-tools/smoke-tests/validate-core-adr-citations-cli.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | different bytes | `agent-tools/validate-core-adr-citations-cli.smoke.ts` |
| `agent-tools/smoke-tests/validate-no-lineage-names-cli.smoke.ts` | tooling smoke test | Language-wide (TypeScript) | JC.net only | `agent-tools/validate-no-lineage-names-cli.smoke.ts` |
| `agent-tools/src/arc-metrics/aggregate.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/aggregate.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/cli-options.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/cli.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/entry.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/entry.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/file-system-node.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/file-system.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/format.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/owner-messages.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/owner-messages.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/session-id.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/session-id.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/split-lines.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/arc-metrics/split-lines.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/arc-metrics` |
| `agent-tools/src/bin/agent-identity-cli-environment.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/agent-identity-cli-parser.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/agent-identity-cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bin` |
| `agent-tools/src/bin/agent-identity.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/agent-tools-cli-topics.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/agent-tools-cli-topics.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bin` |
| `agent-tools/src/bin/agent-tools-cli-types.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bin` |
| `agent-tools/src/bin/agent-tools-cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bin` |
| `agent-tools/src/bin/agent-tools.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/arc-metrics-topic.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/bin` |
| `agent-tools/src/bin/branch-touched-files.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/claude-agent-ops-cli.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/claude-agent-ops.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/claude-pre-compact-observe-hook.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bin` |
| `agent-tools/src/bin/claude-session-identity-hook.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/codex-exec.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/codex-reviewer-resolve.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/codex-session-identity-hook.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/collaboration-state.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/commit-queue.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/comms-archive-move.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bin` |
| `agent-tools/src/bin/comms-provenance-check.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bin` |
| `agent-tools/src/bin/cursor-oak-session-identity-hook.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/bin` |
| `agent-tools/src/bin/cursor-session-from-claude-session-args.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/cursor-session-from-claude-session.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/cursor-session-identity-hook.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/bin` |
| `agent-tools/src/bin/mcp-conformance-help.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/bin` |
| `agent-tools/src/bin/mcp-conformance.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/bin` |
| `agent-tools/src/bin/merge-bot-poster.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/bin` |
| `agent-tools/src/bin/practice-substrate.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/protocol-conformance.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/bin` |
| `agent-tools/src/bin/run-cli-bin.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/run-smoke-tests.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/skills-adapter-generate.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bin` |
| `agent-tools/src/bin/stdout-epipe.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bin` |
| `agent-tools/src/bin/under-the-hood-content-generate.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/bin` |
| `agent-tools/src/bootstrap/bootstrap-helpers-io.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/bootstrap-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/bootstrap-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/bootstrap-staleness.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/bootstrap.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/closure-member-build.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/dist-witnesses.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/dist-witnesses.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/install-time-closure-graph.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/install-time-closure-io.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/install-time-closure.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/install-time-closure.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/install-time-manifest.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/install-time-manifest.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/shellcheck-provision.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/bootstrap` |
| `agent-tools/src/bootstrap/shellcheck-provision.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/bootstrap` |
| `agent-tools/src/branch-touched-files/cli.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/branch-touched-files` |
| `agent-tools/src/branch-touched-files/git.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/branch-touched-files` |
| `agent-tools/src/branch-touched-files/index.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/branch-touched-files` |
| `agent-tools/src/ci/ci-schema-drift-check.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-schema-drift-eval.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-schema-drift-eval.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-schema-drift-report.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-schema-drift-report.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-turbo-report-formatting.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-turbo-report-fs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-turbo-report-types.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-turbo-report.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-turbo-report.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/ci/ci-turbo-summary-parsing.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/ci` |
| `agent-tools/src/claude/logo.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-env-snapshot.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-env-snapshot.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observation.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observation.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/answers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/answers.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/capped-read.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/capped-read.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/environment.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/environment.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/node-io.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/observation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/observation.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/observe.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/observe.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/payload.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/payload.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/siblings.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-observe/siblings.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-response.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-response.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-siblings.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/claude` |
| `agent-tools/src/claude/pre-compact-siblings.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/claude` |
| `agent-tools/src/claude/session-identity-hook.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/claude` |
| `agent-tools/src/claude/session-identity-shim-decisions.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-ansi.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-countdown.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-debug-log.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-emit.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-frame-store.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-git-io.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-git-location.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-identity-input.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-identity.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-indicators.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-location-rows.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-logo-cycle.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-owner-jobs-io.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-owner-jobs.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-owner-jobs.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-render.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-segments.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-session-shape.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/claude/statusline-usage.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/claude` |
| `agent-tools/src/codex-exec/cleanup-row.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/cleanup-row.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/cli.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/command-item.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/command-places.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/exec-accounts.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/exec-calls.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/fixtures/observed-seat-exec-0-157-1.json` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/fixtures/observed-seat-refusal-0-157-1.json` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/flag-command.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/flag-command.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/flagged-commands.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/forbidden-shapes.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/harness-text.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/harness-text.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/index.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/read-command-records.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/read-command-records.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/record-type-key.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/shell-commands.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/summary.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/summary.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/test-helpers/seat-fixtures.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/command-records/turns.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/dialogue-turn.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/dialogue-turn.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/envelope.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/envelope.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/gate.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/gate.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/model-pins.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/parse-events.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/parse-events.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/pass-record.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/pass-record.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/probe-contract.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/code-mode-output.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/code-mode-output.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/context-reader.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/fixtures/observed-code-mode-0-157.json` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/index.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/index.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/reader-state.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/record-reader.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/record-shapes.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/response-reader.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/rollout-types.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/rollout/test-helpers/rollout-records.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/run-turn.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/run-turn.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/test-helpers/cli-io.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/turn-events.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/turn-verdict.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/turn-verdict.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/codex-exec` |
| `agent-tools/src/codex-exec/types.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex-exec` |
| `agent-tools/src/codex/session-identity-hook.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap-cli-args.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap-cli-args.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap-cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap-markers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap-render.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap-render.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/codex/team-alert-bootstrap.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/codex` |
| `agent-tools/src/collaboration-state/active-agent-routing.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/active-agents.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/active-claims-legacy-migration-plan.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/active-claims-legacy-migration.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/agent-id.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/archive/archive-move-execute.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/archive/archive-move-node.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/archive/archive-move-types.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/archive/archive-move.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/archive/disposition-policy.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/archive/event-classification.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/archive/event-projection.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/archive/manifest.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/atomic-file.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/atomic-file.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/claim-active-path.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/claim-closed-path.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/claim-now-default.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/claim-reports.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/claims-open-watcher-gate.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/claims.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-argv-parse.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-claim-areas.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-claim-commands.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-claim-handoff-commands.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-claim-open-gate.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-claim-query-commands.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-assert-watcher-live.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-commands.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-inbox.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-messages.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-query.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-recipient.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-send.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-validate.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-comms-watch.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-coordination-home.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-fail.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-identity-audit.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-identity.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-io-production.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-json-commands.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-options.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-runtime.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-self-identity.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-spec-factory.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-spec-help.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-spec-options.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli-specs.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/cli.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/collaboration-json-validation.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/collaboration-json-validation.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/collaboration-seed.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/commit-queue-entry-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/commit-queue-expiry.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/commit-queue-publish.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/commit-queue-store.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-concept-gate.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-event-accessors.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-event-format.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-event-views.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-heartbeat-body.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-heartbeat-cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-migration-records.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-migration.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-relevant-events.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-tag-namespace.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-use-cases.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-wake-decide.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-wake-handshake.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-wake-select.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-watch-auto-seed.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-watch-errors.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-watch-iteration.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-watch-loop.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-watch-paths.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms-watch-steps.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/comms.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/coordination-home-consolidation.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/coordination-home.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/coordination-home.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/errno.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/git-worktree-list.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/identity-audit-comms.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/identity-audit-findings.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/identity-audit-markdown.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/identity-audit.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/identity-write-guard.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/identity.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/index.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/peer-liveness.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/platform-gate.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/provenance/cited-event-provenance.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/provenance/provenance-scan-node.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/provenance/provenance-scan.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/registry-entry-parser.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/schemas/active-claims.schema.json` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/schemas/closed-claims.schema.json` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/schemas/commit-queue-intent.schema.json` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/schemas/comms-event.schema.json` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/schemas/conversation.schema.json` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/schemas/escalation.schema.json` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-file-readers.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-file-readers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-file-seeds.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-file-seeds.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-integrity-surfaces.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-integrity.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-io-write-validators.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-io-write-validators.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-io.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-parsers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-parsers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/state-schemas.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/surface-contract.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/surface-contract.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/test-helpers/frontmatter.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/test-helpers/repo-doc.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/timestamps.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/transaction-lock-create.integration.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/transaction-lock-create.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/transaction-lock-staleness.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/transaction-lock-staleness.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/transaction-lock.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/transaction.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/app.tsx` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/cli.tsx` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/config.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/config.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/controller.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/entry-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/operator-value.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/panes.tsx` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/reduce-refresh-state.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/reduce-refresh-state.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/snapshot.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/tui/text.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/types.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/visual-disambiguator.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/watcher-heartbeat.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/watcher-presence.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/watcher-staleness-io.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/watcher-staleness.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/watcher-supervisor.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/collaboration-state/work-state-view.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/collaboration-state` |
| `agent-tools/src/commit-advisories/check-commit-message.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-advisories` |
| `agent-tools/src/commit-advisories/check-commit-message.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-advisories` |
| `agent-tools/src/commit-advisories/check-commit-skill-advisories.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-advisories` |
| `agent-tools/src/commit-advisories/check-commit-skill-advisories.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-advisories` |
| `agent-tools/src/commit-advisories/commitlint-verdict.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/commit-advisories` |
| `agent-tools/src/commit-advisories/commitlint-verdict.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/commit-advisories` |
| `agent-tools/src/commit-queue/active-claims-recursion.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/args.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/claims-file-parser.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/commit-command.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/commit-workflow-runtime.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/commit-workflow.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/core.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/enqueue.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/git-root.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/git-root.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/git.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/guard.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/index.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/intent.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/options.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/path-list.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/pathspec.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/read-commands.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/registry.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/registry.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/status.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/time.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/types.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/verify-output.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/commit-queue` |
| `agent-tools/src/commit-queue/write-commands.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/commit-queue` |
| `agent-tools/src/context-cost/cli-options.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/cli-options.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/cli.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/cli.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/file-system-node.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/file-system.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/format.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/per-file.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/per-file.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/test-helpers/context-cost-fixture.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/tokenize-globs.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/tokenize-globs.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/tokenizer.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/context-cost/tokenizer.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/context-cost` |
| `agent-tools/src/coordination/cli.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/coordination` |
| `agent-tools/src/coordination/cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/coordination` |
| `agent-tools/src/coordination/git.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/coordination` |
| `agent-tools/src/coordination/git.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/coordination` |
| `agent-tools/src/coordination/successor-name.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/coordination` |
| `agent-tools/src/coordination/successor-name.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/coordination` |
| `agent-tools/src/core/agent-identity/derive.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/hash.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/index.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schema-registry.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/aerial.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/botanical.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/celestial.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/ember.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/maritime.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/nocturnal.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/theme-group.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/themes.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/schemas/v2/verbs.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/session-seed.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/wordlists-aerial.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/wordlists-botanical.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/wordlists-celestial.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/wordlists-ember.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/wordlists-maritime.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/wordlists-nocturnal.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-identity/wordlists.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/agent-ops.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/authored-surfaces.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/authored-surfaces.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/authored-surfaces.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/core` |
| `agent-tools/src/core/bounded-read.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/bounded-read.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/cli-arg-parser.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/cli-arg-parser.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/codex-project-agent-registry.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/codex-project-agents.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/codex-thread-id.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/codex-thread-id.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/command-runner.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/delay.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/error-code.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/error-code.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/escape-reg-exp.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/escape-reg-exp.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/failure-as-error.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/file-backed-child.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/flag-path-resolve.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/flag-path-resolve.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/fully-qualified-path.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/fully-qualified-path.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/git-relative-path.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/git-relative-path.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/git-remote-url.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/git-remote-url.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/health-probe-continuity-state.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/health-probe-hook-state.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/health-probe-parity.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/health-probe-parity.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/health-probe-shared.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/health-probe-state.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/health-probe-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/health-probe.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/iso-date-time.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/json-narrowing.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/json-parsing.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/json.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/json.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/lf-text.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/lf-text.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/lowercase-uuid.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/lowercase-uuid.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/no-follow-read.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/no-follow-read.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/owner-only-append-fs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/owner-only-append-fs.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/owner-only-append.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/owner-only-append.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/parse-flags.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/parse-flags.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/parse-json-line.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/parse-json-line.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/path-exists.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/path-separators.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/path-separators.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/repo-relative-file.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/repo-relative-file.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/repo-root.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/repo-root.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/repository-paths.ignore.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/repository-paths.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/repository-paths.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/runtime-agent-events.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/runtime-agent-index.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/runtime-paths.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/runtime.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/schema-parse.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/session-tools.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/shell-single-quote.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/shell-single-quote.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/spawn-failure.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/spawn-failure.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/terminal-output.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/terminal-output.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/test-helpers/in-memory-fs-open.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/test-helpers/in-memory-fs-state.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/test-helpers/in-memory-owner-only-append-fs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/toml-top-level-basic-string.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/toml-top-level-basic-string.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/tracked-file-scan.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/tracked-file-scan.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/trusted-gh.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/trusted-gh.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/core` |
| `agent-tools/src/core/trusted-git.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/trusted-git.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/core` |
| `agent-tools/src/core/trusted-shell.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/core/trusted-shell.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/core` |
| `agent-tools/src/corpus-analysis/aggregation-adjudication.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/aggregation-adjudication.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/aggregation-recall.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/aggregation-recall.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/aggregation-verdict.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/aggregation-verdict.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/corroboration-roots.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/cost-and-coverage.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/cost-and-coverage.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/judgment-schemas.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/judgment-schemas.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/banked-verdicts.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/banked-verdicts.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/checkpoint-io.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/checkpoint-io.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/claimed-home-existence.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/claimed-home-existence.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/disposition-partition.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/post-run-analysis.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/post-run-analysis.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/post-run-driver.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/recall-named-kills.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/recall-named-kills.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/salvage-driver.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/salvage-strata.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/salvage-tiers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/salvage-tiers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/triage-banding.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/triage.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/post-run/triage.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/real-world-signal.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/real-world-signal.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/recall-baseline-fixture.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/recall-baseline-fixture.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/recall-schemas.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/recall-schemas.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/run-orchestration.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/run-orchestration.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/adjudication.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/adjudication.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/agent-schemas.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/agent-schemas.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/build/build-config.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/build/build-config.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/build/build-run-artefact.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/build/build-workflows.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/harness-types.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/map.meta.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/map.workflow.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/meta.meta.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/meta.workflow.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/prompts.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/prompts.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/reduce.meta.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/reduce.workflow.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/run-data.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/run-inputs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/run-inputs.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/stage-guards.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/stage-guards.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/stage-io.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/stage-io.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/validate.meta.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/corpus-analysis/workflows/validate.workflow.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/corpus-analysis` |
| `agent-tools/src/cursor/oak-session-identity-hook.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/cursor` |
| `agent-tools/src/cursor/session-identity-hook.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/cursor` |
| `agent-tools/src/encoding/check-encoding-helpers.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/encoding` |
| `agent-tools/src/encoding/check-encoding-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/encoding` |
| `agent-tools/src/encoding/check-encoding-report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/encoding` |
| `agent-tools/src/encoding/check-encoding-tables.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/encoding` |
| `agent-tools/src/encoding/check-encoding-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/encoding` |
| `agent-tools/src/encoding/check-encoding.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/encoding` |
| `agent-tools/src/encoding/check-encoding.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/encoding` |
| `agent-tools/src/gate-slot/gate-slot-argv.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-argv.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-child.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-contract.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-identity.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-identity.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-io.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-listen.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-main.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-main.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-policy.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-policy.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-ports.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-schedule.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-schedule.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/gate-slot/gate-slot.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/gate-slot` |
| `agent-tools/src/hook-policy/ansi-c-quotes.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/apply-patch-content.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/apply-patch-content.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/apply-patch-sections.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/argument-matcher-tables.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/argument-matcher.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/argument-matcher.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/argv-nested.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/argv-option-spec.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/argv-options.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/argv-pattern.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/argv-tables-git.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/blocked-patterns.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/blocked-patterns.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/check-blocked-content.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/check-blocked-patterns.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/claude-adapter.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/claude-adapter.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/claude-renderer.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/claude-renderer.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/content-deny-response.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/dispatcher.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/dispatcher.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/evaluate.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/evaluate.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/guard-runner-decisions.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/guard-runner-decisions.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/hook-input.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/hook-input.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/matchers.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/path-scope.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/path-scope.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/policy-loader.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/policy-snapshot.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/policy-snapshot.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/pre-tool-use-dispatch.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/prior-content-read.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/prior-content-read.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/redirections.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/repository-identity.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/repository-identity.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/repository-probe.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/shell-words.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/shell-words.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/substitution-bounds.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/test-helpers/posix-path.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/hook-policy/types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/hook-policy` |
| `agent-tools/src/install-version-guard/validate-package-manager-version.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/install-version-guard` |
| `agent-tools/src/mcp-conformance/baseline-schema.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/baseline.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/baselines/oauth-dcr-unattended.json` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/baselines/protocol-unattended.json` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/bounded-excerpt.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/cli-validation.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/derive-example-args.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/drive-cli.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/drive-node-io.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/drive.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/io-port.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/load-baselines.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/mcpjam-runner.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/node-io.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/owner-only-write-ops.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/owner-only-write.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/render-reviewer-pack.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/report.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/run-suite.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/runner.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/suite-evidence.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/suite-outcome.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-conformance/types.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-conformance` |
| `agent-tools/src/mcp-content-current-source/build-current-source-addition-items.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/build-current-source-summary.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/build-current-source-truth-set.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/build-current-source-truth-set.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-aggregated-item-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-aggregated-item-revision-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-generated-description-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-generated-item-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-item-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-item-registration-surface-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-item-revision-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-misconception-order-item-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-prior-knowledge-item-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-registration-item-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-addition-anchor-helpers.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-addition-definitions.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-additions-server-instructions.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-additions.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-additions.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-anchor-manifest.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-anchor-manifest.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-config.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-inventory.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-inventory.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-review-helpers.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app-auth.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app-health.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app-landing.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app-observability.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app-rate-limiting.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app-registration.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app-registry.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app-test-helpers.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-app.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk-codegen.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk-corpus-projection.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk-generated-registry.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk-generated-runtime.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk-generated-stubs.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk-generated-tools.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk-guidance-resources.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk-tool-guidance.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews-sdk.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-delta-reviews.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-dispositions.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-dispositions.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-evidence-files.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-evidence-files.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-model.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-projection-shared.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-report-summary.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-report-summary.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-source-truth-set-schema.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-spec-refresh-item-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/current-thread-progressions-item-anchor-overrides.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/guidance-registration-parity.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/guidance-registration-parity.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/item-anchor-evidence.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/item-anchor-evidence.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/normalise-line-endings.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/normalise-line-endings.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/post-baseline-lineage.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/prompt-era-lineage.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/publish-artifacts.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/publish-artifacts.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/recompute-current-source.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/require-same-string-members.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/require-same-string-members.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/semantic-source-sha256.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/validate-current-source.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-current-source/walk-http-registration-root.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-current-source` |
| `agent-tools/src/mcp-content-workspace/build-content-workspace.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/build-workspace-items.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/build-workspace-items.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/content-workspace-config.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/content-workspace-model.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/derive-served-status.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/derive-served-status.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/load-workspace-inputs.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/render-auxiliary-pages.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/render-domain-index.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/render-domain-page.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/render-index-page.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/render-item.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/render-workspace.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/render-workspace.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/workspace-counts.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/workspace-input-schemas.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/mcp-content-workspace/workspace-input-schemas.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/mcp-content-workspace` |
| `agent-tools/src/merge-bot/branch-arg.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/cli.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/git-action-input.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/git-credential-chain.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/git-executor.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/git-executor.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/github-fetch.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-args.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-args.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-cli-unavailable.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-cli.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-deadline.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-decision.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-decision.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-github-api.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge-report.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/merge.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/mint-for-config.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/mint-for-config.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/mint-installation-token.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/mint-installation-token.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/origin-repository.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-args.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-args.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-args.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-attempt-guards.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-attempt-guards.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-attempts.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-attempts.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-attempts.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-cli-attempt-guards.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-cli-mint.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-cli-retry.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-cli.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-git.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-mint.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-target-branch.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-target-branch.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/push-token-file.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/ref-format.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/repo-config.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/repo-config.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/resolve-app-slug.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/resolve-config.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/resolve-config.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/resolve-identity.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-args.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-args.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-cli.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-decision.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-decision.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-execute-remote.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-execute.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-execute.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-git-delete.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-git-port.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-git-read.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-git-read.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-git-read.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-git-run.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-github-api.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-github-api.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-parse.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-parse.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-readings.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-report.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/retire-worktrees.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/test-helpers/pr-state-reading.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/test-helpers/push-cli-double.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/test-helpers/result-failure.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/test-helpers/retire-cli-double.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/token-deadline.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/token-deadline.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/merge-bot` |
| `agent-tools/src/merge-bot/token-scopes.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/merge-bot` |
| `agent-tools/src/plan-state/plan-state-adapters.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state-audit-adapter.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state-engine.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state-engine.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state-gate-adapter.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state-model.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state-verdict.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/plan-state.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/status-mapping/v1.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/plan-state` |
| `agent-tools/src/plan-state/status-mapping/v1.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/plan-state` |
| `agent-tools/src/pr-tally/dispositions.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-tally` |
| `agent-tools/src/pr-tally/findings.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-tally` |
| `agent-tools/src/pr-tally/harvest.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-tally` |
| `agent-tools/src/pr-tally/markers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-tally` |
| `agent-tools/src/pr-tally/rows.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-tally` |
| `agent-tools/src/pr-tally/settlement.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-tally` |
| `agent-tools/src/pr-tally/verdict.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-tally` |
| `agent-tools/src/pr-throughput/cli-args.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-throughput` |
| `agent-tools/src/pr-throughput/cli.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-throughput` |
| `agent-tools/src/pr-throughput/cli.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-throughput` |
| `agent-tools/src/pr-throughput/gh-fetch.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-throughput` |
| `agent-tools/src/pr-throughput/gh-fetch.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-throughput` |
| `agent-tools/src/pr-throughput/index.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-throughput` |
| `agent-tools/src/pr-throughput/index.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-throughput` |
| `agent-tools/src/pr-watch/agent-task-fields.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/body-tally.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/body-tally.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/check-reduction.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/check-rollup.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/cli.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/cli.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/cli.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/completion-comments-summary.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/completion-comments.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/completion-comments.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/completion-evidence.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/content-binding-verdict.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/content-binding.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/content-binding.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/content-fixture.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/content-reader.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/content-reader.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/declared-evidence.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/declared-stand-in-verdict.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/declared-unavailable.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/declared-unavailable.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/disposition-lines.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/disposition-lines.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/expected-reviewers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/expected-reviewers.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/gh.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/gh.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/gh.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/harvest-bracket.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/harvest-fields.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/harvests.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/index.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/index.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/issue-comments.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/issue-comments.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/logins.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/printable.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/report.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/review-runs.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/review-threads.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/review-threads.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/reviewer-legs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/reviewer-legs.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/round-requests.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/round-requests.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/run-evidence.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/settlement-completion-comments.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/settlement.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/skip-markers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/skip-markers.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-cli-unavailable.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-cli.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-compose.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-conversation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-conversation.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-fields.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-fields.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-gh-completion-comments.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-gh-content.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-gh-harvest-consistency.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-gh-requests.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-gh.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-gh.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-gh.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-reading-fixture.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-types.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/state-view-fixture.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/states.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/states.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/suppressed-hold.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/suppressed-hold.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/test-helpers/state-gh-payloads.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/unavailable-flag.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/unavailable-flag.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/vendor-error-reviews.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/vendor-error-reviews.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/pr-watch/vendor-error-reviews.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/pr-watch` |
| `agent-tools/src/practice-fitness/categories.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/categories.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/configuration-findings.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/decision-debt-report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/decision-debt-report.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/decision-debt.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/decision-debt.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/dwell.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/dwell.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/evaluate.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/evaluate.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/format.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/format.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/index.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/item-count.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/item-count.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/markdown.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/markdown.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/messages.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/model.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/paths.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/paths.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/run.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/run.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/validate-practice-fitness.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-fitness/validate-practice-fitness.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-fitness` |
| `agent-tools/src/practice-substrate/evaluators.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/finding.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/index.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/instance-tier.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/instance-tier.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-collaboration-records.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-collaboration-records.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-comms-events.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-files.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-json-instance-tier.integration.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-json-support.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-json.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-json.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-open-questions.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-reads.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-report.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-retired-path-lifecycle.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-retired-paths.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-shared-comms-log.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-shared-comms-log.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/live-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/metadata-evaluators.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/open-questions-evaluator.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/path-evaluators.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/report-evaluators.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/structural-evaluators.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/test-helpers/temp-substrate-repo.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/topology-evaluators.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/practice-substrate/types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/practice-substrate` |
| `agent-tools/src/protocol-conformance/declaration.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/protocol-conformance` |
| `agent-tools/src/protocol-conformance/detectors.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/protocol-conformance` |
| `agent-tools/src/protocol-conformance/node-io.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/protocol-conformance` |
| `agent-tools/src/protocol-conformance/report.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/protocol-conformance` |
| `agent-tools/src/protocol-conformance/types.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/protocol-conformance` |
| `agent-tools/src/protocol-wire/contract.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/protocol-wire` |
| `agent-tools/src/protocol-wire/types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/protocol-wire` |
| `agent-tools/src/protocol-wire/validate.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/protocol-wire` |
| `agent-tools/src/refounding/freeze-rule-schema.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/freeze-rule-schema.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-amendments.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-anchor-map.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-artefact-writes.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-batch-status-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-batch-status-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-batch-status-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-batch-status.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-batch-status.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-challenge-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-challenge-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-challenge-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-challenge-modes.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-challenge-scoring.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-claim-census-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-claim-census-model.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-claim-census-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-claim-census-report.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-claim-census-report.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-claim-census.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-claim-census.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-default-ledger-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-default-ledger-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-default-ledger-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-default-ledger.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-default-ledger.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-entry-args.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-entry-args.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze-args.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze-args.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze-plan.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze-rollback.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze-runner.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-freeze.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-gitleaks.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-in-set.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-inventory-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-inventory-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-inventory-nets.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-inventory-nets.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-inventory-read.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-inventory-runner.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-inventory.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-inventory.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-ledger-row.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-ledger-row.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-merge-recheck-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-merge-recheck-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-merge-recheck-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-merge-recheck.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-merge-recheck.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-merge-recheck.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-challenge-canary.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-challenge-canary.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-challenge-canary.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan-baseline.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan-proofs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan-runner.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan-sweep-proof.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan-transcript.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan-transcript.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-plant-orphan.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-residue-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-residue-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-residue-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-residue.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-residue.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-sweep-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-sweep-model.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-sweep-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-sweep.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-sweep.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-tile-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-tile-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-tile-model.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-tile-violations.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-tile.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-tile.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-tile.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-verify-freeze-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-verify-freeze-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-verify-freeze-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-verify-freeze.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-verify-freeze.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-git.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-git.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-invariants.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-io.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-model.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-schema.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-schema.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-universe.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-universe.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample-write-guard.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refound-window-sample.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/refounding/refounding-artefacts.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/refounding` |
| `agent-tools/src/refounding/refounding-artefacts.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/refounding` |
| `agent-tools/src/repo-check/repo-check-check-legs.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-check-legs.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-depcruise-verdict.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-depcruise-verdict.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-depcruise.integration.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-depcruise.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-files.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-files.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-gates.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-gates.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-lint-changed.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-lint-changed.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-profile.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-runner.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-runtime.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-shellcheck-files.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-shellcheck-files.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-shellcheck-runtime.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-shellcheck-version.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-shellcheck-version.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-shellcheck.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-shellcheck.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-skills-lock.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-skills-lock.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-types.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-universe.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check-universe.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/repo-check` |
| `agent-tools/src/repo-check/repo-check.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/repo-check` |
| `agent-tools/src/restatement-audit/cluster-hygiene.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/cluster-hygiene.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/disposition.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/disposition.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/join.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/join.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/ledger-rows.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/ledger-rows.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/normalize.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/normalize.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/render-ledger-cli.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/render-ledger.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/render-ledger.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/schemas.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/schemas.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/agent-schemas.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/agent-schemas.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/build/build-config.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/build/build-config.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/build/build-run-artefact.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/build/build-workflows.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/build/derive-stage-checkpoint-io.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/build/derive-stage-run-data.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/build/derive-stage-run-data.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/gazetteer-schema.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/gazetteer-schema.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/gazetteer.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/gazetteer.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/map.meta.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/map.workflow.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/member-grounding.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/meta-coverage.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/meta-coverage.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/meta.meta.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/meta.workflow.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/prompts.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/prompts.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/proposal-resolution.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/proposal-resolution.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/reduce.meta.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/reduce.workflow.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/run-data.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/run-inputs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/run-inputs.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/stage-guards.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/stage-guards.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/stage-io.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/stage-io.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/validate-result.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/validate.meta.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/validate.workflow.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/validate.workflow.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/window-membership.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/restatement-audit/workflows/window-membership.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/restatement-audit` |
| `agent-tools/src/review-cost/args.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/review-cost/budget.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/review-cost/cli.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/review-cost/cost.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/review-cost/git.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/review-cost/harvest.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/review-cost/measure.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/review-cost/price.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/review-cost/survey.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/review-cost` |
| `agent-tools/src/rule-declarations/README.md` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/comma-list.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/frontmatter-lines.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/parse-claude-rule-adapter.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/parse-claude-rule-adapter.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/parse-cursor-trigger.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/parse-cursor-trigger.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/parse-rules-index.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/parse-rules-index.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/read-rule-declaration.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/read-rule-declaration.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/reconcile-rule-declaration.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/reconcile-rule-declaration.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/render-reconciliation-report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/render-reconciliation-report.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/render-rule-frontmatter.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/render-rule-frontmatter.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/render-rule-projections.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/render-rule-projections.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/rule-declaration.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/rule-frontmatter-sweep.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/rule-name.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/rule-name.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/rule-projections.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/sweep-fs.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/sweep-fs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/sweep-rule-frontmatter.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/rule-declarations/sweep-rule-frontmatter.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/rule-declarations` |
| `agent-tools/src/secret-scan/compute-push-scan-ranges.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/secret-scan` |
| `agent-tools/src/secret-scan/compute-push-scan-ranges.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/secret-scan` |
| `agent-tools/src/secret-scan/run-push-secret-scan.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/secret-scan` |
| `agent-tools/src/secret-scan/run-push-secret-scan.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/secret-scan` |
| `agent-tools/src/session-metadata/cli-options.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/cli-options.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/cli.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/compute.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/compute.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/file-system-node.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/file-system.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/format.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/transcript-locator.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/transcript-locator.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/usage.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/usage.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/window-registry.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/session-metadata` |
| `agent-tools/src/session-metadata/window-registry.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/session-metadata` |
| `agent-tools/src/shell/ansi-c-quotes.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/git-global-options.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/interpreter-script.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/interpreter-script.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/redirections.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/redirections.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/scan-state.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/shell-words.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/shell-words.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/shell/substitution-bounds.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/shell` |
| `agent-tools/src/skill-evals/args.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/args.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/cli.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/cli.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/evidence.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/evidence.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/fixture.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/fixture.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/graders.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/manifest-writer.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/manifest.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/plan.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/plugin-skill.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/plugin-skill.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/plugin.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/project.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/project.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/run.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/run.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/seams.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/sibling-projection.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/sibling-references.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/sibling-references.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/suite.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skill-evals/test-helpers/in-memory-seams.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skill-evals` |
| `agent-tools/src/skills-adapter-generate/adapter-render.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/adapter-stub.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/canonical-frontmatter.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/carriage-compare.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/carriage-fs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/carriage-walk.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/carriage.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/checker.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/clear.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/cli-flags.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/discovery.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/emission-refusals.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/emission-target.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/generator.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/projection-roots.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/read-regular-file.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/skill-tree-walk.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/skills-adapter-generate/surface-roots.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/skills-adapter-generate` |
| `agent-tools/src/smoke/smoke-suite.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/smoke` |
| `agent-tools/src/smoke/smoke-suite.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/smoke` |
| `agent-tools/src/smoke/smoke-suite.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/smoke` |
| `agent-tools/src/spawn/brief.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/brief.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/build-runner.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/build.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/build.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/child-environment.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/child-environment.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/cli-args.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/cli-output.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/cli.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/cli.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/create.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/create.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/existing-worktree.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/gh.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/git.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/launch-command.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/launch-command.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/open-pr.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/open-pr.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/pnpm-env.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/pnpm-env.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/pnpm-path.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/pnpm-path.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/process-group.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/process-group.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/spawn` |
| `agent-tools/src/spawn/process-group.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/spawn` |
| `agent-tools/src/subagent-declarations/README.md` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/adapter-defaults.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/adapter-spec.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/claude-fields.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/declaration-scalars.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/declared-adapters.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/declared-adapters.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/declared-adapters.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/read-subagent-declaration.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/read-subagent-declaration.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/render-codex-adapter.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/render-codex-registry.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/render-codex-registry.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/render-gemini-adapter.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/render-subagent-adapters.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/render-subagent-adapters.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/standard-adapter-body.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/subagent-declaration.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/subagent-declaration.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/system-prompt-block.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/template-name.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/subagent-declarations/yaml-scalar.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/subagent-declarations` |
| `agent-tools/src/typescript-estate/analysis-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/atomic-publication-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/atomic-publication-node.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/atomic-publication-result.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/atomic-publication.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/atomic-publication.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/canonical-json.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/canonical-json.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/cli.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/cli.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/config-analysis-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/config-classification-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/config-core-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/config-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/config-proof-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/construct-counting.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/construct-counting.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/document-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/errors.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/file-classification-engine.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/file-classification-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/file-classification.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/file-classification.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/file-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/file-vocabulary.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/generated-output-rules.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/generated-output-rules.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-auxiliary-decision.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-auxiliary-decision.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-auxiliary-read.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-auxiliary-read.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-pinned-blob.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-process.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-process.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-source-read.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot-tree.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/git-snapshot.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/graph-edge-identity.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/graph-identity.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/graph-identity.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/graph-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/graph-node-identity.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/graph-node-input.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/graph-validation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/graph-vocabulary.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-hashing.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-module-specifiers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-path-flavour.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-path-flavour.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-path-observation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-secure-read-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-secure-read.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-secure-read.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-secure-read.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/identity-specifier-classification.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/implementation-identity.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/implementation-identity.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/length-framing.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/path-coverage-digest.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/path-coverage-digest.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/ports.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/provenance-classification.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/provenance-classification.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/region-repetition-boundaries.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/region-repetition-encoding.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/region-repetition-extraction.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/region-repetition-extraction.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/region-repetition-grouping.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/region-repetition-grouping.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/region-repetition-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/role-classification.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/role-classification.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/scalar-model.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/schema-shape-fingerprint.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/schema-shape-matching.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/schema-shape-matching.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/schema-shape-observation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/schema-shape.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/schema-shape.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/schema-validation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/schema-validation.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/semantic-auxiliary-validation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/semantic-auxiliary-validation.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/semantic-classification-validation.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/semantic-classification-validation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/semantic-totals-validation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/semantic-validation.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/semantic-validation.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/test-helpers/classification-fixture.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/test-helpers/classification-program-fixture.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/test-helpers/exact-process-port.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/totals-semantic-validation.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/type-truth-counting.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/type-truth-counting.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/utf16-order.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/utf16-order.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/validated-detector-config.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/validated-detector-config.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/workspace-attribution.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/workspace-attribution.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/workspace-manifest.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/workspace-manifest.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/workspace-package-manifest.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/workspace-pattern.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/typescript-estate/workspace-yaml.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/typescript-estate` |
| `agent-tools/src/under-the-hood-content-generate/canonical-parser.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/under-the-hood-content-generate` |
| `agent-tools/src/under-the-hood-content-generate/canonical-parser.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/under-the-hood-content-generate` |
| `agent-tools/src/under-the-hood-content-generate/generator.integration.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/under-the-hood-content-generate` |
| `agent-tools/src/under-the-hood-content-generate/generator.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/under-the-hood-content-generate` |
| `agent-tools/src/under-the-hood-content-generate/generator.unit.test.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/under-the-hood-content-generate` |
| `agent-tools/src/under-the-hood-content-generate/sections.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/under-the-hood-content-generate` |
| `agent-tools/src/under-the-hood-content-generate/served-section-guards.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/under-the-hood-content-generate` |
| `agent-tools/src/under-the-hood-content-generate/test-helpers/synthetic-canonical.ts` | tooling | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/under-the-hood-content-generate` |
| `agent-tools/src/validators/check-ci-parity/check-ci-parity-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/check-ci-parity/check-ci-parity-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/check-ci-parity/validate-check-ci-parity.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/cited-paths/extract-path-citations.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-paths/validate-cited-paths-helpers.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-paths/validate-cited-paths-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-paths/validate-cited-paths.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/command-surface-files.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/command-surfaces.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/command-surfaces.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/extract-script-citations.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/pnpm-builtins.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/shell-command-citations.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/shell-lexer.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/substitution-end.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/validate-cited-scripts-helpers.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/validate-cited-scripts-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/validate-cited-scripts.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/workflow-surface.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/workflow-surface.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/cited-scripts/workspace-scripts.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/claim-freshness/assess-pin.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/claim-freshness/claim-freshness-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/claim-freshness/validate-claim-freshness-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/claim-freshness/validate-claim-freshness-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/claim-freshness/validate-claim-freshness.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/collaboration-state/validate-collaboration-state.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/core-adr-citations/read-core.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/core-adr-citations/read-core.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/core-adr-citations/validate-core-adr-citations-helpers.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/core-adr-citations/validate-core-adr-citations-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/core-adr-citations/validate-core-adr-citations.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/exchange-register-contested.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/exchange-register-counts.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/exchange-register-coverage.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/exchange-register-inputs.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/exchange-register-markers.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/exchange-register-types.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/validate-exchange-register-helpers.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/validate-exchange-register-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/exchange-register/validate-exchange-register.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/fitness-vocabulary/validate-fitness-vocabulary.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/fitness-vocabulary/validate-fitness-vocabulary.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/fitness-vocabulary/walk.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/fitness-vocabulary/walk.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/identity-naming/validate-identity-naming-census.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/identity-naming/validate-identity-naming-census.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/identity-naming/validate-identity-naming-io.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/identity-naming/validate-identity-naming-io.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/identity-naming/validate-identity-naming-tokens.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/identity-naming/validate-identity-naming-tokens.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/identity-naming/validate-identity-naming.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/lifecycle-scripts/validate-lifecycle-scripts-helpers.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/lifecycle-scripts/validate-lifecycle-scripts-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/lifecycle-scripts/validate-lifecycle-scripts.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/lineage-names/validate-no-lineage-names-helpers.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/lineage-names/validate-no-lineage-names-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/lineage-names/validate-no-lineage-names.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/machine-local-paths/validate-no-machine-local-paths-helpers.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/machine-local-paths/validate-no-machine-local-paths-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/machine-local-paths/validate-no-machine-local-paths.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/markdown-links/validate-markdown-links-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/markdown-links/validate-markdown-links-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/markdown-links/validate-markdown-links-report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/markdown-links/validate-markdown-links-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/markdown-links/validate-markdown-links.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/notion-fence/validate-notion-fence-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/notion-fence/validate-notion-fence.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/notion-fence/validate-notion-fence.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-argv.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-check-args.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-check-args.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-document.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-fixtures.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-frontmatter.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-fs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-git-merge.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-git-merge.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-git-push.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-git.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-keys.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-layout.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-read.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-root.integration.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-root.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-root.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-schema.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-sync-report.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-sync-state.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-sync-target.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-sync.integration.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-sync.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/operator-profile-sync.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/test-helpers/git-runner-fakes.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/validate-operator-profile-contract.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/operator-profile/validate-operator-profile.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/patterns-index/validate-patterns-index-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/patterns-index/validate-patterns-index-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/patterns-index/validate-patterns-index.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/check-plan-gate-drift.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/plan-corpus-loading.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/plan-corpus-registries.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/plan-corpus-types.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/plan-gate-drift.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/plan-gate-drift.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/plan-node-schema.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/validate-plan-corpus-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/validate-plan-corpus.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/validate-plan-corpus.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plan-schema/yaml-fence-blocks.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/plugin-skill-copies/plugin-skill-copies-compare.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/plugin-skill-copies/plugin-skill-copies-fs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/plugin-skill-copies/plugin-skill-copies-fs.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/plugin-skill-copies/plugin-skill-copies-verdict.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/plugin-skill-copies/plugin-skill-copies-verdict.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/plugin-skill-copies/plugin-skill-copies.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/plugin-skill-copies/plugin-skill-copies.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/plugin-skill-copies/validate-plugin-skill-copies.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/policy-reappraisal/validate-policy-reappraisal-helpers.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/policy-reappraisal/validate-policy-reappraisal-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/policy-reappraisal/validate-policy-reappraisal.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/claude-hook-detection.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/claude-hook-quoting.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/portability/claude-hook-quoting.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/portability/claude-hook-script-anchoring.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/portability/claude-hook-script-anchoring.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/portability/claude-hook-wiring.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/directory-listing.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/directory-listing.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/portability-constants.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/portability-fs.integration.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/portability/portability-fs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/portability-report.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/projection-drift.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/projection-drift.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/projection-issues.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rule-glob-resolution.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rule-glob-resolution.unit.test.ts` | tooling | Language-wide (TypeScript) | JC.net only | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rule-projection-fs.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rule-projection-fs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rule-projection-validation.integration.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rule-projection-validation.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rule-surface-fs.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rule-surface-fs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/rules-index-checks.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/skill-census.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/skill-permission-checks.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/skills-walk.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/subagent-projection-validation.integration.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/subagent-projection-validation.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/subagent-registry-surface.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/test-helpers/fake-projection-repo.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/validate-portability-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/validate-portability.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/portability/validate-portability.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/pretooluse-guard-routing/validate-pretooluse-guard-routing-helpers.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/pretooluse-guard-routing/validate-pretooluse-guard-routing-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/pretooluse-guard-routing/validate-pretooluse-guard-routing.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/protocol-wire/validate-protocol-wire-contract.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/ratified-lists/validate-ratified-lists-helpers.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/ratified-lists/validate-ratified-lists-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/ratified-lists/validate-ratified-lists.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/reference-direction/validate-reference-direction-allowlists.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/reference-direction/validate-reference-direction-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/reference-direction/validate-reference-direction-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/reference-direction/validate-reference-direction.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/stale-script-invocations/validate-no-stale-script-invocations-helpers.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/stale-script-invocations/validate-no-stale-script-invocations-helpers.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/stale-script-invocations/validate-no-stale-script-invocations.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/frontmatter-schema.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/frontmatter-schema.unit.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/validate-subagents-codex-adapter-field-checks.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/validate-subagents-codex-adapter-validation.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/validate-subagents-codex-instructions.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/validate-subagents-codex-registration-validation.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/validate-subagents-codex-toml.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/validate-subagents-helpers.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/validate-subagents.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/subagents/validate-subagents.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/workspace-config-isolation/comment-stripping.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/workspace-config-isolation/containment.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/workspace-config-isolation/text-position.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/validators` |
| `agent-tools/src/validators/workspace-config-isolation/turbo-glob.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/workspace-config-isolation/turbo-inputs.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/workspace-config-isolation/validate-workspace-config-isolation.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/workspace-config-isolation/workspace-config-isolation.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/workspace-config-isolation/workspace-topology.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/validators` |
| `agent-tools/src/validators/wow-verdict-register/test-helpers/read-live-register.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/wow-verdict-register/wow-verdict-register.integration.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/wow-verdict-register/wow-verdict-register.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/validators/wow-verdict-register/wow-verdict-register.unit.test.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/validators` |
| `agent-tools/src/version-guard/prevent-accidental-major-version.test.ts` | tooling | Language-wide (TypeScript) | same bytes | `agent-tools/version-guard` |
| `agent-tools/src/version-guard/prevent-accidental-major-version.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/version-guard` |
| `agent-tools/src/workflow-build/esbuild-options.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/esbuild-options.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/harness-emitter.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/harness-emitter.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/output-contract.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/output-contract.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/run-verification-build.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/schema-inline-plugin.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/schema-inline-plugin.unit.test.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/workflow-builder.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workflow-build/workflow-meta.ts` | tooling | Language-wide (TypeScript) | different bytes | `agent-tools/workflow-build` |
| `agent-tools/src/workspace-census/artefact.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/check-parity.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/cli.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/commands.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/compare.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/context.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/delta.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/facts-artefact.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/facts-command.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/facts-inputs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/facts.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/graph-inputs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/index.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/inputs.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/render-command.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/rows.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/subjects.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/src/workspace-census/vocabulary.ts` | tooling | Language-wide (TypeScript) | OCE only | `agent-tools/workspace-census` |
| `agent-tools/tests/agent-identity/cli.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/agent-identity` |
| `agent-tools/tests/agent-identity/derive.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/agent-identity` |
| `agent-tools/tests/agent-identity/hash.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/agent-identity` |
| `agent-tools/tests/agent-identity/schema-registry.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/agent-identity` |
| `agent-tools/tests/agent-identity/session-cache.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/agent-identity` |
| `agent-tools/tests/agent-identity/session-seed.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/agent-identity` |
| `agent-tools/tests/agent-identity/v2-curation.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/agent-identity` |
| `agent-tools/tests/agent-ops.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/agent-tools-cli.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/branch-touched-files-git.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/branch-touched-files.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/ci-turbo-report.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests` |
| `agent-tools/tests/claude/logo.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/session-identity-hook.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/session-identity-shim-decisions.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-countdown.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-debug-log.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-debug-log.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-emit.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-frame-store.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-git-location.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-identity-input.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-logo-cycle.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-render-session-shape.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-render.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/claude/statusline-session-shape.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/claude` |
| `agent-tools/tests/codex-exec.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | JC.net only | `agent-tools/tests` |
| `agent-tools/tests/codex-project-agents.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/codex-reviewer-resolve.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/codex/session-identity-hook.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/codex` |
| `agent-tools/tests/collaboration-state/active-agent-routing.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/active-agents.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/active-claims-claim-jsonschema.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/active-claims-legacy-migration.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/active-claims-schema-fixture.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/agent-id-jsonschema.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/agent-id-schema.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/agent-tools-cli-declared-home.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/archive/archive-move-execute.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state/archive` |
| `agent-tools/tests/collaboration-state/archive/archive-move.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state/archive` |
| `agent-tools/tests/collaboration-state/archive/disposition-policy.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/archive` |
| `agent-tools/tests/collaboration-state/archive/event-classification.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state/archive` |
| `agent-tools/tests/collaboration-state/archive/event-projection.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state/archive` |
| `agent-tools/tests/collaboration-state/archive/manifest.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/archive` |
| `agent-tools/tests/collaboration-state/claim-active-path.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/claim-closed-path.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/claim-now-default.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/claim-open-locked-gate.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/claims-open-watcher-gate.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/claims-open-watcher-gate.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/claims-work-state.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-claim-adopt.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-claim-handoff.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-claim-role.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-claim-set-handoff.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-comms-assert-watcher-live.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-comms-commands.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-comms-send.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-comms-watch.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-coordination-home.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-dispatch-allowlist.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-identity-audit.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-options-parser.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-runtime.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-self-identity.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/cli-spec-factory.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/collaboration-state-state-reads.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/collaboration-state.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/collaboration-state.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/commit-queue-store.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-append-in-response-to.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-concept-gate-cli.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-concept-gate.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-concept-gate.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-direct-in-response-to.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-direct-recipient-prefix.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-event-accessors.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-event-schema-fixture.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-event-schema.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-heartbeat-body.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-heartbeat-lifecycle.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-peer-liveness.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-query.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-relevant-events-collision.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-relevant-events.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-render.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-tag-namespace.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-tags.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-use-cases.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-wake-decide.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-wake-handshake.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-wake-select.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-watch-auto-seed.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-watch-defaults.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-watch-errors.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-watch-loop-deadlines.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-watch-loop.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-watch-paths.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/comms-watch-supervisor.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/fake-collaboration-runtime-fixtures.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/fake-collaboration-runtime.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/fixtures/claim-history/explicit-close.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/claim-history` |
| `agent-tools/tests/collaboration-state/fixtures/claim-history/owner-forced-close.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/claim-history` |
| `agent-tools/tests/collaboration-state/fixtures/claim-history/stale-archive.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/claim-history` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/closed-decision-thread-with-evidence.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/expired-sidebar-unresolved.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/joint-decision-complete-with-role-handoff.valid.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/joint-decision-completion-without-evidence.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/joint-decision-proposed.valid.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/joint-decision-without-decider.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/malformed-sidebar-id.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/open-decision-thread.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/sidebar-open.valid.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/conversations/sidebar-resolved.valid.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/conversations` |
| `agent-tools/tests/collaboration-state/fixtures/escalations/closed-escalation.valid.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/escalations` |
| `agent-tools/tests/collaboration-state/fixtures/escalations/escalation-without-conversation-reference.red.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/escalations` |
| `agent-tools/tests/collaboration-state/fixtures/escalations/open-escalation.valid.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/fixtures/escalations` |
| `agent-tools/tests/collaboration-state/format-watcher-event.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/git-worktree-list.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/identity-audit.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/identity.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/loud-writes.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/parse-agent-id.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/peer-liveness.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/platform-gate.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/posix-path.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/provenance/cited-event-provenance.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state/provenance` |
| `agent-tools/tests/collaboration-state/provenance/provenance-scan.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state/provenance` |
| `agent-tools/tests/collaboration-state/session-id-prefix-across-host-identity-hooks.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/state-integrity-cli.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/state-integrity.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/state-io.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/state-parsers-strict.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/state-parsers.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/transaction.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/tui-app.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/tui-cli.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/tui-snapshot.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/tui-text.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/unified-comms-format.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/unified-comms-format.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/visual-disambiguator-docs-drift.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/visual-disambiguator-fixtures.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/visual-disambiguator.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/watcher-heartbeat.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/watcher-presence.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/watcher-staleness-io.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/watcher-staleness.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/watcher-supervisor.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/collaboration-state/work-state-view.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/collaboration-state` |
| `agent-tools/tests/commit-queue.create-intent.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/commit-queue.enqueue.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/commit-queue.git-root.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/commit-queue.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/commit-queue.order.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/commit-queue.store-views.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/commit-queue.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/commit-workflow.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/core.file-backed-child.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/cursor/oak-session-identity-hook.unit.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/cursor` |
| `agent-tools/tests/cursor/session-identity-hook.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | JC.net only | `agent-tools/tests/cursor` |
| `agent-tools/tests/depcruise-boundary-rules.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/health-probe.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/hook-policy/check-blocked-content.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/hook-policy` |
| `agent-tools/tests/hook-policy/check-blocked-content.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/hook-policy` |
| `agent-tools/tests/hook-policy/scoped-blocks-in-text.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/hook-policy` |
| `agent-tools/tests/hook-policy/scoped-blocks-indefinite-deferral.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/hook-policy` |
| `agent-tools/tests/hook-policy/scoped-blocks-menu-framing.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/hook-policy` |
| `agent-tools/tests/mcp-conformance/baseline.unit.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance` |
| `agent-tools/tests/mcp-conformance/cli-validation.unit.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance` |
| `agent-tools/tests/mcp-conformance/derive-example-args.unit.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance` |
| `agent-tools/tests/mcp-conformance/drive.unit.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance` |
| `agent-tools/tests/mcp-conformance/fixtures/apps-unauth-alpha-2026-07-26.json` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance/fixtures` |
| `agent-tools/tests/mcp-conformance/fixtures/oauth-dcr-headless-alpha-2026-07-26.json` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance/fixtures` |
| `agent-tools/tests/mcp-conformance/fixtures/protocol-unauth-alpha-2026-07-26.json` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance/fixtures` |
| `agent-tools/tests/mcp-conformance/fixtures/tools-call-stub-observed-2026-07-28.json` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance/fixtures` |
| `agent-tools/tests/mcp-conformance/fixtures/tools-list-stub-observed-2026-07-28.json` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance/fixtures` |
| `agent-tools/tests/mcp-conformance/load-baselines.unit.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance` |
| `agent-tools/tests/mcp-conformance/node-io.integration.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance` |
| `agent-tools/tests/mcp-conformance/render-reviewer-pack.unit.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance` |
| `agent-tools/tests/mcp-conformance/report.unit.test.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance` |
| `agent-tools/tests/mcp-conformance/test-helpers/fixture-loader.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance/test-helpers` |
| `agent-tools/tests/mcp-conformance/test-helpers/guards.ts` | tooling config and docs | Repo-local, host (product tooling, §2) | OCE only | `agent-tools/tests/mcp-conformance/test-helpers` |
| `agent-tools/tests/merge-bot.git-executor-stdio.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/merge-bot.read-env-child.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/pr-tally/corpus.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally` |
| `agent-tools/tests/pr-tally/findings.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally` |
| `agent-tools/tests/pr-tally/fixtures/README.md` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally/fixtures` |
| `agent-tools/tests/pr-tally/fixtures/pr-135-harvest.json` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally/fixtures` |
| `agent-tools/tests/pr-tally/fixtures/pr-136-harvest.json` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally/fixtures` |
| `agent-tools/tests/pr-tally/fixtures/pr-138-harvest.json` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally/fixtures` |
| `agent-tools/tests/pr-tally/harvest.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally` |
| `agent-tools/tests/pr-tally/markers.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally` |
| `agent-tools/tests/pr-tally/rows.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally` |
| `agent-tools/tests/pr-tally/settlement.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally` |
| `agent-tools/tests/pr-tally/verdict.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/pr-tally` |
| `agent-tools/tests/practice-substrate/practice-substrate-report.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/practice-substrate` |
| `agent-tools/tests/practice-substrate/practice-substrate.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/practice-substrate` |
| `agent-tools/tests/protocol-conformance/node-io.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/protocol-conformance` |
| `agent-tools/tests/protocol-conformance/report.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/protocol-conformance` |
| `agent-tools/tests/protocol-wire/inter-practice-wire.fixture.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/protocol-wire` |
| `agent-tools/tests/protocol-wire/wire.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/protocol-wire` |
| `agent-tools/tests/release-config.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests` |
| `agent-tools/tests/repo-check-lint-changed.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | JC.net only | `agent-tools/tests` |
| `agent-tools/tests/repo-check-runtime.spawn-topology.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | JC.net only | `agent-tools/tests` |
| `agent-tools/tests/repo-check.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/review-cost/budget.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/review-cost` |
| `agent-tools/tests/review-cost/cli.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/review-cost` |
| `agent-tools/tests/review-cost/cost.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/review-cost` |
| `agent-tools/tests/review-cost/git.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/review-cost` |
| `agent-tools/tests/review-cost/measure.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/review-cost` |
| `agent-tools/tests/review-cost/survey.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/review-cost` |
| `agent-tools/tests/rules/rules-index-classification.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | JC.net only | `agent-tools/tests/rules` |
| `agent-tools/tests/run-cli-bin.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/runtime-agent-events.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/runtime-agent-index.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/runtime-paths.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests` |
| `agent-tools/tests/runtime.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/session-tools.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/skills-adapter-generate/adapter-stub.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/canonical-frontmatter.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/carriage-hardening.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/carriage.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/carriage.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/clear-behind-discovery-gate.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/clear-refuses-before-projection-loss.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/clear.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/clear.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/cli-flags.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/generator.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/projection-roots.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/read-regular-file-no-follow.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/skill-census.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/skills-adapter-generate` |
| `agent-tools/tests/skills-adapter-generate/test-helpers/skills-repo-sandbox.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/skills-adapter-generate/test-helpers` |
| `agent-tools/tests/skills/chatgpt-merged-skill-derivation.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/skills` |
| `agent-tools/tests/skills/chatgpt-plugin-package-invariants.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/skills` |
| `agent-tools/tests/skills/plugin-listing-invariants.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/skills` |
| `agent-tools/tests/skills/plugin-mcp-server-binding.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/skills` |
| `agent-tools/tests/skills/the-codex-dialogues-probe-lockstep.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests/skills` |
| `agent-tools/tests/stdout-epipe.integration.test.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests` |
| `agent-tools/tests/test-helpers/agent-identity-doc.ts` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools/tests/test-helpers` |
| `agent-tools/tests/test-helpers/depcruise-fixture.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/test-helpers` |
| `agent-tools/tests/test-helpers/rules-index-classification-fixtures.ts` | tooling config and docs | Language-wide (TypeScript) | JC.net only | `agent-tools/tests/test-helpers` |
| `agent-tools/tests/test-helpers/temp-collaboration-state.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools/tests/test-helpers` |
| `agent-tools/tests/workspace-census.check-parity.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests` |
| `agent-tools/tests/workspace-census.compare.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests` |
| `agent-tools/tests/workspace-census.facts.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests` |
| `agent-tools/tests/workspace-census.hardening.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests` |
| `agent-tools/tests/workspace-census.unit.test.ts` | tooling config and docs | Language-wide (TypeScript) | OCE only | `agent-tools/tests` |
| `agent-tools/tsconfig.build.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools` |
| `agent-tools/tsconfig.json` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools` |
| `agent-tools/tsconfig.lint.json` | tooling config and docs | Language-wide (TypeScript) | same bytes | `agent-tools` |
| `agent-tools/vitest.config.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools` |
| `agent-tools/vitest.e2e.config.ts` | tooling config and docs | Language-wide (TypeScript) | different bytes | `agent-tools` |
| `eslint.config.ts` | lint config | Language-wide (TypeScript) | OCE only | `eslint.config.ts` |
| `package.json` | root command surface | Language-wide (TypeScript) | different bytes | `package.json` |
