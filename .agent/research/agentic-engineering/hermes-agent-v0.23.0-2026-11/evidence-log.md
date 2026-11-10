# Evidence log: Hermes Agent v0.23.0

Readers: the owner and the later comparison session. Decision served: which statements about
Hermes may be relied on. A row in bin **Fact** was read this session at the cited line. Every
statement about runtime behaviour rests on static reading of code and tests; nothing here was
observed running.

Inquiry `hermes-agent-architecture-2026-11`. Written by Swift holds Aether (Claude Code cloud
session `01Duocji`).

## 1. Provenance

| Item | Value | Instrument |
| --- | --- | --- |
| Repository | <https://github.com/NousResearch/hermes-agent> | `git ls-remote --tags https://github.com/NousResearch/hermes-agent 'v0.23.0*'` |
| Tag | `v0.23.0` (annotated tag object `df1774294af26285ae758c6114f3f2f60e2a602d`) | same |
| Pinned commit | `2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` | `git checkout --detach v0.23.0`; `git rev-parse --verify HEAD` |
| Read at | 2026-11-10 10:47 UTC | `date -u` |
| Repository | <https://github.com/NousResearch/hermes-agent-self-evolution> | `git ls-remote https://github.com/NousResearch/hermes-agent-self-evolution HEAD` |
| Pinned commit | `0a929e3aa20e15cf04dc7c28492a7d41a5139125` (HEAD; committed 2026-06-17) | `git rev-parse --verify HEAD`; equal to the upstream HEAD |
| Read at | 2026-11-10 10:47 UTC | `date -u` |

Notes on the pin:

- The session's attached clones are the owner's forks (`jimCresswell/hermes-agent`,
  `jimCresswell/hermes-agent-self-evolution`). The `hermes-agent` fork serves no tags
  (`git ls-remote --tags origin` returned zero lines), so the tag was fetched from the public
  upstream by URL with `git fetch --depth 1 https://github.com/NousResearch/hermes-agent tag v0.23.0`.
  No remote was added to the clone.
- The `hermes-agent` clone is shallow (`git rev-parse --is-shallow-repository` is `true`). It was
  not deepened; no claim in this log rests on `git log` or `git blame`.
- `git status --porcelain` printed nothing in either clone after pinning.
- Every permalink below has the form
  `https://github.com/NousResearch/<repo>/blob/<full SHA>/<path>#L<n>`.

## 2. Census

All commands ran in the `hermes-agent` clone at the pinned commit unless stated.

### 2.1 Python files and lines per top-level directory

Command: `git ls-files -z '*.py' | xargs -0 wc -l`, grouped by first path segment with `awk`.
Known positive: `git ls-files '*.py' | grep -n '^agent/curator.py$'` printed `141:agent/curator.py`.

| Directory | Python files | Lines |
| --- | ---: | ---: |
| `tests` | 7,640 | 1,587,142 |
| `hermes_cli` | 817 | 311,261 |
| `agent` | 421 | 151,839 |
| `tools` | 373 | 131,466 |
| `gateway` | 353 | 130,470 |
| `plugins` | 307 | 92,544 |
| `tui_gateway` | 124 | 48,905 |
| `scripts` | 152 | 41,606 |
| (repository root) | 84 | 41,068 |
| `optional-skills` | 101 | 27,941 |
| `evals` | 156 | 22,190 |
| `cron` | 54 | 20,384 |
| `pm` | 56 | 14,823 |
| `skills` | 50 | 11,827 |
| `acp_adapter` | 22 | 6,641 |
| `website` | 7 | 2,739 |
| `hermes_platform` | 15 | 2,054 |
| `providers` | 2 | 1,683 |
| `apps` | 5 | 633 |
| `ui-tui` | 4 | 625 |
| `nix` | 2 | 186 |
| `docker` | 1 | 31 |
| **Total** | **10,746** | **2,648,058** |

### 2.2 `plugins/` against everything else

Same command, split on the `plugins/` prefix.

| Slice | Python files | Lines |
| --- | ---: | ---: |
| `plugins/` | 307 | 92,544 |
| Everything else | 10,439 | 2,555,514 |
| Everything except `tests/` and `plugins/` | 2,799 | 968,372 |

### 2.3 Tests

| Measure | Count | Method |
| --- | ---: | --- |
| Python files under `tests/` | 7,640 | `git ls-files 'tests/**/*.py' 'tests/*.py' \| sort -u \| wc -l` |
| Files named `test_*.py` under `tests/` | 7,267 | `git ls-files 'tests/**/test_*.py' \| sort -u \| wc -l` |
| Test functions | 53,639 | `rg -c '^\s*(async\s+)?def test_' tests -g '*.py'`, summed. A text match on definitions; parametrised cases count once. |

### 2.4 `AGENTS.md` files (path and size only at census time)

Command: `git ls-files | grep -E '(^|/)AGENTS\.md$' | xargs ls -l`.

| Path | Bytes |
| --- | ---: |
| `AGENTS.md` | 11,952 |
| `agent/AGENTS.md` | 10,597 |
| `apps/desktop/AGENTS.md` | 9,378 |
| `apps/desktop/src/AGENTS.md` | 8,504 |
| `cron/AGENTS.md` | 14,495 |
| `gateway/AGENTS.md` | 18,232 |
| `hermes_cli/AGENTS.md` | 18,240 |
| `hermes_platform/AGENTS.md` | 1,011 |
| `plugins/AGENTS.md` | 16,145 |
| `pm/AGENTS.md` | 2,265 |
| `skills/AGENTS.md` | 5,981 |
| `tests/AGENTS.md` | 9,861 |
| `tools/AGENTS.md` | 17,585 |
| `tui_gateway/AGENTS.md` | 14,678 |
| `web/AGENTS.md` | 3,034 |

### 2.5 Modules named for memory, skill, curator, learn, review, insight or evolution

Command, `hermes-agent`:
`git ls-files '*.py' | grep -v '^tests/' | grep -Ei '/?[^/]*(memory|skill|curator|learn|review|insight|evolution)[^/]*\.py$'`.
It returned 84 files: `tools` 35, `agent` 21, `hermes_cli` 15, `skills` 4, `gateway` 4, `website` 2,
`scripts` 2, `evals` 1. The pattern also matches `preview` (it contains `review`); the five
`tools/*preview_tool.py` files, `tools/preview_tool.py` and `hermes_cli/webapp_previews.py` are
false positives and are not in the cold-pass scope.

Largest in-scope modules by line count (`wc -l`): `hermes_cli/skills_hub.py` 1,731;
`agent/background_review.py` 1,390; `agent/curator.py` 1,214; `agent/skill_commands.py` 1,028;
`tools/skills_guard.py` 962; `tools/skill_manager_tool.py` 943; `agent/memory_manager.py` 935;
`agent/skill_utils.py` 902; `tools/skills_tool.py` 786; `tools/skill_usage.py` 773;
`hermes_cli/curator.py` 766; `tools/memory_tool_store.py` 740; `tools/skill_ledger.py` 633;
`agent/insights.py` 610.

Every file the brief's Phase 4 inventory names exists at the tag: a loop of `[ -f <path> ]` over
the 49 named files printed no `MISSING` line, and the four globs (`agent/context_compressor*.py`,
`agent/conversation_compression*.py`, `tools/skills_hub*.py`, `tools/skills_sync*.py`,
`tools/skills_tool*.py`) each listed files. `plugins/memory/` holds `__init__.py`,
`config_schema.py`, `query_rewrite.py` and two provider directories, `byterover` and `retaindb`.

`hermes-agent-self-evolution` (`git ls-files`): 30 tracked files, 3,892 Python lines. Its Python
modules are `evolution/core/{config,constraints,dataset_builder,external_importers,fitness}.py`,
`evolution/skills/{evolve_skill,skill_module}.py`, `generate_report.py`, and five test files. The
packages `evolution/code`, `evolution/monitor`, `evolution/prompts` and `evolution/tools` hold only
`__init__.py`. `datasets/` holds only `.gitkeep` files. `reports/` holds one PDF.

## 3. Cold-pass record

Made before any Hermes document, `AGENTS.md`, release note or the sealed ledger was opened.
Scope: the 95 files formed by the census 2.5 list (less `optional-skills/`, `skills/`, `evals/`,
`scripts/`, `website/`), the brief's Phase 4 inventory, and `plugins/memory/**/*.py`.

Instrument: `rg -n` over that file list for write patterns (`open(..., "w"|"a"|"x")`,
`.write_text(`, `.write_bytes(`, `atomic_write`, `atomic_json`, `json.dump(`, `yaml.dump(`,
`os.replace(`, `.rename(`, `shutil.move|copy|copytree|rmtree(`, `.unlink(`, `os.remove(`,
`tarfile.open`, `INSERT`, `UPDATE`, `DELETE FROM`, `CREATE TABLE`, `.commit()`, `_write_`,
`save_`): 335 matching lines. Each hit's enclosing function was resolved with a standalone
stdlib-`ast` script that parses and imports nothing. Paths were read from the path-helper
functions. Callers were found with `rg` over all non-test Python. Known positive for the probe:
`agent/curator.py:62`.

Each row records what is written, where, and the immediate caller. No purpose is named.
`<home>` is the value of `get_hermes_home()`.

### 3.1 `<home>/memories/`

| Id | Write site | What is written, where | Immediate caller |
| --- | --- | --- | --- |
| C-01 | [`tools/memory_tool_store.py#L712`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L712) `MemoryStore._write_file` | The full entry list joined by `"\n§\n"`, by atomic temp-file write, to the target's file (`MEMORY.md` or `USER.md` per the module docstring, [L1](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L1)) | [`MemoryStore._mutate` L394](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L394), under a file lock after a re-read from disk |
| C-02 | [`tools/memory_tool_store.py#L734`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L734) `MemoryStore._drift_backup` | The raw file text to `<file>.bak.<unix-ts>[.<n>]`, created exclusively | `_mutate` at [L378, L384, L389](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L378) |
| C-03 | `MemoryStore._mutate` callers | Five call sites inside the class ([L413](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L413), [L462](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L462), [L493](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L493), [L512](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L512), [L647](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool_store.py#L647)) and one outside it | [`agent/learning_mutations.py#L116`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/learning_mutations.py#L116) `_mutate_memory` |
| C-04 | `MemoryStore(...)` construction | An in-process store object | [`agent/agent_init.py#L1246`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/agent_init.py#L1246); [`tools/memory_tool.py#L56`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool.py#L56) `load_on_disk_store` |
| C-05 | `load_on_disk_store()` callers | A fresh store for contexts with no live agent | [`agent/learning_mutations.py#L116`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/learning_mutations.py#L116); [`gateway/slash_commands.py#L920`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/gateway/slash_commands.py#L920); [`hermes_cli/cli_commands_mixin.py#L1288`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/cli_commands_mixin.py#L1288); [`tui_gateway/methods_tools.py#L952`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tui_gateway/methods_tools.py#L952) |

The memories directory is `<home>/memories` ([`tools/memory_tool.py#L40`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool.py#L40)).

### 3.2 `<home>/pending/`

| Id | Write site | What is written, where | Immediate caller |
| --- | --- | --- | --- |
| C-06 | [`tools/write_approval.py#L86`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/write_approval.py#L86) `stage_write` | A JSON record (`id`, `subsystem`, `action`, `summary`, `origin`, `created_at`, `payload`) to `<home>/pending/<subsystem>/<id>.json` ([L66](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/write_approval.py#L66)) | [`tools/memory_tool.py#L100`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool.py#L100) and [L203](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/memory_tool.py#L203); [`tools/skill_manager_tool.py#L686`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L686) |
| C-07 | [`tools/write_approval.py#L124`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/write_approval.py#L124) `discard_pending` | Deletes one pending record file | not traced in the cold pass |

### 3.3 `<home>/skills/` (skill files)

| Id | Write site | What is written, where | Immediate caller |
| --- | --- | --- | --- |
| C-08 | [`tools/skill_manager_tool.py#L421`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L421) `_guarded_write` | File content by atomic write to a target path inside a skill directory; on a failure path it restores the original text ([L426](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L426)) or unlinks the new file ([L428](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L428)) | the action functions of the same module (`_create_skill`, `_write_file` and others; dispatch table at [L742](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L742)) |
| C-09 | [`tools/skill_manager_tool.py#L609`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L609) `_delete_skill` | `shutil.rmtree` of a skill directory; the same function calls `archive_skill` at [L601](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L601) | the module's action dispatch |
| C-10 | [`tools/skill_manager_tool.py#L660`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L660) `_remove_file` | Unlinks one file inside a skill directory | the module's action dispatch |
| C-11 | [`tools/skill_manager_batch.py#L150`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_batch.py#L150) to [L196](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_batch.py#L196) | Copies skill directories to a snapshot root, and restores or removes them (`copytree`, `rmtree`, `rename`) | the batch path of the same tool ([L250](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_batch.py#L250), [L260](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_batch.py#L260)) |
| C-12 | [`tools/skill_usage.py#L620`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_usage.py#L620) `_relocate` | Moves a skill directory (`rename`, falling back to `shutil.move`); followed by `set_state(..., STATE_ARCHIVED or STATE_ACTIVE)` at [L635](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_usage.py#L635). The archive directory is `<home>/skills/.archive` ([L55](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_usage.py#L55)) | `archive_skill` callers: [`agent/curator.py#L202`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L202); [`hermes_cli/curator.py#L393`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/curator.py#L393); [`agent/learning_mutations.py#L177`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/learning_mutations.py#L177); [`tools/skill_manager_tool.py#L601`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L601) |
| C-13 | [`tools/skills_sync.py#L217`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_sync.py#L217) to [L348](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_sync.py#L348), and [`tools/skills_sync_bundled_ops.py#L117`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_sync_bundled_ops.py#L117) | Copies, moves and replaces skill directories under the skills root | `sync_skills` callers: [`gateway/run_bootstrap.py#L142`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/gateway/run_bootstrap.py#L142); [`hermes_cli/main.py#L1050`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/main.py#L1050); [`hermes_cli/main_tui_launch.py#L632`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/main_tui_launch.py#L632); [`hermes_cli/post_update.py#L125`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/post_update.py#L125); [`hermes_cli/update_cmd_maint.py#L521`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/update_cmd_maint.py#L521); [`hermes_cli/setup_quick.py#L261`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/setup_quick.py#L261); [`hermes_cli/skills_hub.py#L1266`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/skills_hub.py#L1266) |
| C-14 | [`tools/skills_hub_install.py#L75`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_hub_install.py#L75) `quarantine_bundle`; [L186](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_hub_install.py#L186) `install_from_quarantine`; [L219](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_hub_install.py#L219) `uninstall_skill` | Writes bundle files to a quarantine path; moves the quarantine directory to an install directory; removes an install directory | [`hermes_cli/skills_hub.py#L890`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/skills_hub.py#L890) and [L917](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/skills_hub.py#L917); [`hermes_cli/web_routers/skills.py#L289`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/web_routers/skills.py#L289) |

### 3.4 `<home>/skills/` (sidecar files)

| Id | Write site | What is written, where | Immediate caller |
| --- | --- | --- | --- |
| C-15 | [`tools/skill_usage.py#L384`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_usage.py#L384) `save_usage` | The whole usage map as sorted JSON to `<home>/skills/.usage.json` ([L51](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_usage.py#L51)) | `_locked_update` ([L406](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_usage.py#L406)); reached from `bump_use` ([`agent/skill_commands.py#L429`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/skill_commands.py#L429), [`cron/scheduler_prompt.py#L248`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/cron/scheduler_prompt.py#L248), [`tools/skills_tool.py#L780`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_tool.py#L780)), `bump_view` ([`tools/skills_tool.py#L777`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_tool.py#L777)), `bump_patch` ([`tools/skill_manager_tool.py#L778`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_manager_tool.py#L778)), `set_state` ([`agent/curator.py#L224`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L224), [`tools/skills_sync_bundled_ops.py#L125`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_sync_bundled_ops.py#L125)), `set_pinned` ([`hermes_cli/curator.py#L229`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/curator.py#L229)) |
| C-16 | [`tools/skill_usage.py#L209`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_usage.py#L209) `_toggle_suppressed_name` | A sorted list of names to `<home>/skills/.curator_suppressed` | not traced in the cold pass |
| C-17 | [`tools/skill_ledger.py#L317`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L317) `append_entry` | One JSON line (`id`, `ts`, `actor`, `action`, `skill`, `evidence`, `before`, `after`) appended to `<home>/skills/.curator_ledger.jsonl` ([L84](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L84)) | [`tools/skill_ledger.py#L516`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L516), [L602](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L602), [L627](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L627); [`hermes_cli/curator.py#L508`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/curator.py#L508) |
| C-18 | [`tools/skill_ledger.py#L144`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L144) `_store_blob` | Bytes to a blob file under `<home>/.curator_backups/blobs` ([L88](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L88)); `_gc_blobs_locked` unlinks blobs ([L493](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L493)); `_rewrite_ledger` replaces the ledger file ([L378](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L378)) | within the module |
| C-19 | [`tools/skill_ledger.py#L616`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L616) `rollback_entry` | Writes blob bytes back to recorded paths and unlinks others ([L623](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_ledger.py#L623)) | [`hermes_cli/curator.py#L542`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/curator.py#L542) |
| C-20 | [`agent/curator.py#L62`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L62) `save_state` | A JSON object to `<home>/skills/.curator_state` ([L41](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L41)) | `set_paused` ([L68](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L68)); `should_run_now` ([L173](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L173)); `run_curator_review` ([L960](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L960), [L985](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L985)) |
| C-21 | [`agent/curator.py#L1190`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L1190) `_claim_run`; [L1197](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L1197) `_release_run_claim` | Creates and removes `<home>/skills/.locks/curator-run` ([L1168](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L1168)) | within the module |
| C-22 | [`agent/curator_backup.py#L175`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L175) `snapshot_skills` | A gzip tar archive and `manifest.json` ([L141](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L141)) under `<home>/skills/.curator_backups` ([L67](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L67)), plus a copy of `<home>/cron/jobs.json` ([L96](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L96)); `_prune_old` removes old snapshot directories ([L216](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L216)) | [`agent/curator.py#L940`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L940); [`hermes_cli/curator.py#L412`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/curator.py#L412); [`agent/curator_backup.py#L422`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L422) |
| C-23 | [`agent/curator_backup.py#L440`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L440) to [L476](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L476) `rollback` | Moves current skill entries to a staging directory, extracts an archive, and removes or retains the staging directory; `_restore_cron_skill_links` calls `cron.jobs.save_jobs` ([L322](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator_backup.py#L322)) | not traced in the cold pass |
| C-24 | [`tools/skills_sync.py#L165`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_sync.py#L165) `_write_manifest` | `<home>/skills/.bundled_manifest` ([L66](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_sync.py#L66)) | `sync_skills` ([L450](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_sync.py#L450)) and `tools/skills_sync_bundled_ops.py` |
| C-25 | [`tools/skills_hub.py#L297`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_hub.py#L297) `_JsonStateFile._write`; [L463](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_hub.py#L463) `append_audit_log`; [L265](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_hub.py#L265) `_write_index_cache`; [`tools/skills_sync_optional.py#L233`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_sync_optional.py#L233) | JSON state files, an appended audit log, index cache files, and `<home>/skills/.hub/lock.json` | within the hub modules |
| C-26 | [`tools/skills_guard.py#L817`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skills_guard.py#L817) `scan_skill_cached` | A JSON provenance cache file | not traced in the cold pass |

### 3.5 Other files under `<home>/`

| Id | Write site | What is written, where | Immediate caller |
| --- | --- | --- | --- |
| C-27 | [`agent/curator.py#L739`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L739) `_write_run_report` | `run.json`, `REPORT.md` and, conditionally, `cron_rewrites.json` ([L742](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L742)) in a run directory under `<home>/logs/curator` ([L477](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L477)) | `run_curator_review._llm_pass` ([L977](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L977)) |
| C-28 | [`agent/prompt_builder.py#L1445`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/prompt_builder.py#L1445) `_build_skills_system_prompt_inner` | A JSON snapshot to `<home>/.skills_prompt_snapshot.json` ([L1086](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/prompt_builder.py#L1086)); `clear_skills_system_prompt_cache` unlinks it ([L1095](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/prompt_builder.py#L1095)) | within the module |
| C-29 | [`agent/skill_bundles.py#L196`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/skill_bundles.py#L196) `save_bundle`; [L206](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/skill_bundles.py#L206) `delete_bundle` | A YAML file under `<home>/skill-bundles` ([L32](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/skill_bundles.py#L32)) | [`hermes_cli/bundles.py#L90`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/bundles.py#L90) |
| C-30 | [`agent/verification_evidence.py#L671`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/verification_evidence.py#L671) `_insert_evidence`; [L730](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/verification_evidence.py#L730) `mark_workspace_edited`; [L504](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/verification_evidence.py#L504) `_prune_old_events` | Rows in tables `verification_events` and `verification_state` of the SQLite file `<home>/verification_evidence.db` ([L124](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/verification_evidence.py#L124)); deletes old rows | [`tools/file_tools_read_tracking.py#L425`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/file_tools_read_tracking.py#L425); within the module ([L619](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/verification_evidence.py#L619), [L655](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/verification_evidence.py#L655)) |
| C-31 | [`hermes_state_prompt_refresh.py#L33`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_state_prompt_refresh.py#L33) `request_prompt_refresh` | An upsert into table `state_meta` of the session database | [`hermes_cli/sessions_cmd.py#L1329`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/sessions_cmd.py#L1329) |
| C-32 | [`hermes_state_fts.py#L58`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_state_fts.py#L58) triggers; [`hermes_state_search.py#L352`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_state_search.py#L352) | SQLite triggers that insert into full-text tables (`messages_fts`, `messages_fts_trigram`, `messages_fts_cjk`) after inserts and updates on table `messages`; rebuild and maintenance statements | the database engine, on writes to `messages`. The session database file is `<home>/state.db` ([`hermes_state.py#L181`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_state.py#L181)) |

### 3.6 Files outside `<home>/`

| Id | Write site | What is written, where | Immediate caller |
| --- | --- | --- | --- |
| C-33 | [`agent/trajectory.py#L44`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/trajectory.py#L44) `save_trajectory` | One JSON line (`conversations`, `timestamp`, `model`, `completed`) appended to `trajectory_samples.jsonl` or `failed_trajectories.jsonl`, a relative path, when no filename is given ([L40](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/trajectory.py#L40)) | [`agent/turn_finalizer.py#L705`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/turn_finalizer.py#L705) via `agent._save_trajectory` |
| C-34 | [`batch_runner.py#L307`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/batch_runner.py#L307), [L541](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/batch_runner.py#L541), [L724](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/batch_runner.py#L724), [L858](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/batch_runner.py#L858) | Appended JSONL results, a checkpoint JSON, a combined file and a statistics JSON | within the module |
| C-35 | [`trajectory_compressor.py#L664`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/trajectory_compressor.py#L664), [L671](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/trajectory_compressor.py#L671), [L789](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/trajectory_compressor.py#L789) | JSONL output files and a metrics JSON | within the module |

### 3.7 Calls that spawn a writer, with no file write of their own

| Id | Site | What it does | Immediate caller |
| --- | --- | --- | --- |
| C-36 | [`run_agent.py#L781`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/run_agent.py#L781) and [L783](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/run_agent.py#L783) | `_spawn_background_review` either enqueues on a queue or calls `_spawn_background_review_now`, which calls `spawn_background_review_thread` ([L806](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/run_agent.py#L806)) | [`agent/turn_finalizer.py#L613`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/turn_finalizer.py#L613); [`agent/codex_runtime.py#L720`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/codex_runtime.py#L720); [`gateway/session_cold_review.py#L125`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/gateway/session_cold_review.py#L125); [`gateway/slash_commands_goals.py#L209`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/gateway/slash_commands_goals.py#L209); [`hermes_cli/cli_commands_mixin.py#L1674`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/cli_commands_mixin.py#L1674); [`agent/review_idle_queue.py#L177`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/review_idle_queue.py#L177) |
| C-37 | [`agent/background_review.py#L1001`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/background_review.py#L1001) | Sets `_memory_write_origin` and `_memory_write_context` on a review agent object | within the module |
| C-38 | [`agent/curator.py#L1209`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L1209) `maybe_run_curator` | Calls `run_curator_review(trigger="scheduled")` after `should_run_now()` and an idle test ([L1204](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L1204)) | [`gateway/run.py#L4354`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/gateway/run.py#L4354); [`hermes_cli/web_server_sessions.py#L531`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/web_server_sessions.py#L531); [`hermes_cli/cli_tui_runtime_mixin.py#L415`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/cli_tui_runtime_mixin.py#L415). `run_curator_review` is also called from [`hermes_cli/curator.py#L167`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/hermes_cli/curator.py#L167) |
| C-39 | [`agent/curator.py#L1129`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/curator.py#L1129) | Sets `_memory_write_origin = "background_review"` on a review agent object inside the curator | within the module |
| C-40 | [`agent/memory_provider.py#L151`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/memory_provider.py#L151), [L183](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/memory_provider.py#L183), [L212](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/memory_provider.py#L212) | The `MemoryProvider` interface declares `sync_turn`, `on_session_end` and `on_memory_write` among its methods | implementations under `plugins/memory/`; `plugins/memory/retaindb/__init__.py` writes a local SQLite table `pending` ([L231](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/plugins/memory/retaindb/__init__.py#L231)) |

### 3.8 In-scope modules with no write-pattern hit

`agent/learning_graph.py`, `agent/learning_graph_render.py`, `agent/review_engine.py`,
`agent/review_idle_queue.py`, `agent/learn_prompt.py`, `agent/memory_context.py`,
`agent/memory_caller_scope.py`, `agent/memory_manager_tools.py`, `agent/skill_commands.py`,
`agent/skill_utils.py`, `agent/skill_preprocessing.py`, `agent/skills_index_delta.py`,
`agent/system_prompt.py`, `agent/prompt_caching.py`, `agent/prompt_refresh.py`,
`tools/session_search_tool.py`, `tools/self_repo_guard.py`, `tools/threat_patterns.py`,
`tools/skill_linter.py`, `tools/skillevaluator_scan.py`, `tools/skills_ast_audit.py`. The probe's
known positive is `agent/curator.py:62`. `agent/insights.py` matched only on the substring
`cache_write_tokens`. `agent/memory_manager.py` matched only on a method name containing
`_write_`; it holds no file write. `agent/learning_mutations.py` writes through
`MemoryStore._mutate` (C-03) and `archive_skill` (C-12).

### 3.9 `hermes-agent-self-evolution`

Instrument: `rg -n` for `open(`, `write_text`, `json.dump`, `.save(`, `mkdir`, `shutil.`,
`subprocess`, `.unlink`, `rmtree` over `evolution/` and `generate_report.py`.

| Id | Write site | What is written, where | Immediate caller |
| --- | --- | --- | --- |
| C-41 | [`evolution/core/dataset_builder.py#L58`](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/core/dataset_builder.py#L58) | `<split>.jsonl` files, one JSON example per line, into a directory | `dataset.save(...)` at [`evolution/skills/evolve_skill.py#L106`](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/skills/evolve_skill.py#L106) and [`evolution/core/external_importers.py#L683`](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/core/external_importers.py#L683) |
| C-42 | [`evolution/skills/evolve_skill.py#L202`](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/skills/evolve_skill.py#L202) | The evolved skill text to an output path | within `evolve_skill.py` |
| C-43 | [`evolution/skills/evolve_skill.py#L260`](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/skills/evolve_skill.py#L260), [L263](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/skills/evolve_skill.py#L263), [L283](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/skills/evolve_skill.py#L283) | `evolved_skill.md`, `baseline_skill.md` and `metrics.json` into an output directory | within `evolve_skill.py` |
| C-44 | [`evolution/core/constraints.py#L58`](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/core/constraints.py#L58) | A `subprocess.run` call | within `constraints.py` |

## 4. Reading budget

Sizes are bytes divided by 4 (`wc -c`).

| Set | Bytes | Estimated tokens | Planned read |
| --- | ---: | ---: | --- |
| `website/docs/developer-guide/*.md` (whole directory) | 1,265,136 | 316,000 | Not read whole. In full: `architecture.md`, `agent-loop.md`, `prompt-assembly.md`. Targeted: `session-storage.md`, `tools-runtime.md`, `gateway-internals.md`, `memory-provider-plugin.md`, `creating-skills.md`, `context-compression-and-caching.md`, `trajectory-format.md`, `contributing.md` |
| The 15 `AGENTS.md` files | 161,958 | 40,500 | In full: root, `agent/`, `tools/`. Targeted: `gateway/`, `skills/`, `plugins/`, `tests/`. Out of scope: `apps/desktop/`, `web/`, `tui_gateway/`, `pm/` |
| `website/docs/user-guide/features/{memory,skills,curator,memory-providers}.md` | 168,887 | 42,200 | `memory.md` and `curator.md` in full; the other two targeted |
| `README.md`; self-evolution `README.md` and `PLAN.md` | 61,745 | 15,400 | In full, except `PLAN.md` targeted |
| `cli-config.yaml.example` | 131,960 | 33,000 | Targeted to the memory, skills, curator and review keys |
| Phase 4 inventory modules and both compressor families | 2,054,706 | 514,000 | Targeted by function; never whole |
| Self-evolution Python and Markdown | 199,524 | 49,900 | `evolve_skill.py`, `fitness.py`, `constraints.py` in full; the rest targeted |

Estimate for what this session will read: about 60,000 tokens of full reads and about 150,000
tokens of targeted reads, on top of about 110,000 tokens of rules and grounding context already
spent. No fan-out is planned for Phases 3 and 4; the main seat reads. Phase 5 uses one read-only
subagent for the fresh-eyes pass.

## 5. Cricket verdict on the Charter (Phase 1 close)

Panel run 2026-11-10 about 10:55 to 11:05 UTC, four roles, two stances. The adversarial wave ran
on a corrected frame, because the normal wave's frame verdicts were acted on first.

| Role | Stance | Work | Frame | Substance |
| --- | --- | --- | --- | --- |
| Judgement, highest power, low effort | normal | ON-TRACK | SOUND | Confirm the self-evolution pin against upstream (done at 10:47 UTC) |
| Judgement, high power, medium effort | normal | ON-TRACK | NARROWED | The self-evolution repository was not named in the goal or measures |
| Judgement, mid power, high effort | normal | ON-TRACK | NARROWED | Same; and "then comparison" was ambiguous |
| Procedure, lowest power, xhigh effort | normal | DRIFTING | CONTRADICTED | The frame's NEXT opened the ledger before the cold-pass commit; "No holds" omitted the owner's ledger hold; the self-evolution repository was unnamed |
| Judgement, highest power, low effort | adversarial | ON-TRACK | CONTRADICTED (narrow) | The frame's NEXT opened the ledger before the cold-pass record was committed to this log |
| Judgement, high power, medium effort | adversarial | ON-TRACK | SOUND | Use upstream permalinks, never the fork |
| Judgement, mid power, high effort | adversarial | ON-TRACK | NARROWED | NEXT did not match the corrected READING |
| Procedure, lowest power, xhigh effort | adversarial | ON-TRACK | CONTRADICTED | "No holds" omitted the ledger hold; "never against the Practice" dropped the owner's "for now" (the comparison is the eventual task, in a later session) |

Absorbed: the Charter's scope names both repositories; section 3.9 puts the self-evolution
repository's writes in the cold pass; the ledger was opened only after the commit that carries
sections 1 to 4 of this file; permalinks use the `NousResearch` base.
