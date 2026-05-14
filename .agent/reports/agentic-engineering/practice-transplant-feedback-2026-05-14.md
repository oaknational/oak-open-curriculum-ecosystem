---
captured_date: 2026-05-14
source_exercise: project-explorer-especially-names Practice transplant
target_repo: /Users/jim/code/personal/project-explorer-especially-names
target_commit: 77de2e0
status: captured
---

# Practice Transplant Feedback — 2026-05-14

This report captures process feedback from transplanting the Practice,
agentic-engineering infrastructure, and quality gates into
`/Users/jim/code/personal/project-explorer-especially-names`.

The target repo reached an operational state and landed as commit `77de2e0`
with `pnpm check` passing. The exercise exposed several portability frictions
that should feed back into the source Practice/bootstrap documentation and
tooling.

## Findings

1. **Bootstrap does not yet name the minimum live-state seed set.**
   The substrate checker required more than the obvious memory/state README
   files: `conversation.schema.json`, `escalation.schema.json`,
   `memory-state-substrate-contracts.schema.json`, the substrate manifest, and
   a regenerated `shared-comms-log.md` were all part of the minimum viable
   seed. The bootstrap guidance should list the exact seed set and the
   regeneration command for generated read models.

2. **Validator scripts should be runnable from built artifacts.**
   Several transplanted root scripts initially invoked `tsx`, which failed in
   the target sandbox through IPC/socket restrictions. The target fix was to
   build `agent-tools/src/**` strictly and transpile operational
   `agent-tools/scripts/**` into `dist/scripts/**`, then invoke those built
   files from package scripts and hooks. This should become first-class
   bootstrap guidance: hooks and gates should prefer built CLIs over live TS
   execution.

3. **Adapter generation needs a hidden-directory write note.**
   Regenerating `.agents/skills/**` and `.claude/skills/**` required explicit
   write permission in the target environment. The transplant docs should warn
   that adapter generation writes hidden agent directories and may need a
   single approved write step in sandboxed agents.

4. **Cross-platform parity checks are useful but under-documented.**
   `validate-portability` surfaced missing
   `.agent/memory/executive/cross-platform-agent-surface-matrix.md`, Claude
   skill permission drift, and Codex adapter-description drift. These are good
   checks, but the bootstrap path should state that the matrix is required and
   that adapter descriptions must match their registration entries exactly.

5. **Host-local security settings require explicit disposition.**
   The transplant exercise initially tried to carry over Codex
   `network_access = true`. That should not be copied by default. Bootstrap
   docs should call out host-local security and network settings as
   "decide explicitly, do not inherit silently".

6. **Quality gates need generated-file exclusions.**
   `shared-comms-log.md` is deterministic generated output. Formatting and
   markdownlint tried to normalize it, which made the substrate read-model
   check stale again. The target fix was to ignore that file in Prettier and
   markdownlint while keeping the substrate freshness check authoritative.

7. **Inherited tests may encode source-domain assumptions.**
   Agent-tools tests referenced Oak-specific `clerk-expert` parity and a stale
   expectation around SHA blocking in permanent docs. Bootstrap guidance should
   tell transplanting agents to audit tests for source-domain assumptions,
   not only production surfaces.

8. **Optional host binaries should not be mandatory generic gates.**
   The source pre-push shape assumed `gitleaks` exists on the host. In the
   target repo this was made optional when absent, while keeping `secrets:scan`
   available when the binary exists. Bootstrap guidance should distinguish
   repo-local gates from optional host-level gates.

9. **Dependency and architecture audit gates need target calibration.**
   `knip` and `dependency-cruiser` were useful only after target-specific
   configuration: Knip needed workspace-aware dependency-only mode, and
   dependency-cruiser exposed a real TUI type cycle that was fixed by moving
   shared snapshot types into a separate module.

10. **Commit hooks should be validated by an actual commit.**
    The first target commit attempt failed because `.husky/commit-msg` passed
    the message file positionally, while the current checker expects `-F`.
    The transplant checklist should include one real commit dry run or actual
    commit before declaring hooks operational.

## Suggested Source Updates

- Add a "minimum target seed set" table to `practice-bootstrap.md`.
- Add a bootstrap step for regenerating adapters and generated read models.
- Add a portability note that built CLIs are the default for hooks/gates.
- Add a security-disposition checklist for host-local agent configs.
- Add a "source-domain assumption audit" checklist for copied tests,
  sub-agents, rules, and docs.
- Add a generated-file formatting guidance note for deterministic read models.
