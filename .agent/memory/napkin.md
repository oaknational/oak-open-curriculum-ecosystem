## Session 2026-04-01 — Napkin rotation (distillation)

Archived `napkin-2026-04-01.md` covering sessions 2026-03-31
to 2026-04-01.

Distilled 9 new entries to `distilled.md`:
- Fitness Management section (3 entries): char limit as honest
  metric, graduation vs fitness separation, user feedback as
  correction signal
- Architecture (Agent Infrastructure) section (3 entries):
  ADR-125 thin wrapper scope, ADR-135 naming deviation,
  provenance storytelling
- Repo-Specific Rules: Zod 4 `.meta()` opportunity
- Build System: empty directories after file deletion
- Plus entries queued for graduation to permanent docs in step 7

Entries from the URL remediation session (napkin lines 271–309)
were confirmed as fully documented in ADR-145 and ADR-047.
No additional distillation needed for that work.

## Session 2026-04-01 — Consolidation metacognition

### Patterns to Remember

- **Synthesis over extraction**: the consolidation workflow
  is well-built for moving sentences between files. It's
  less good at asking "what do these learnings mean
  together?" The bridge from documentation to understanding
  is where the gap lives. Consider adding a synthesis step
  that asks for the connective insight across a batch of
  graduated entries.
- **Marginal value attenuates**: early napkin rotations
  produce high-signal graduates (architectural insights,
  fundamental debugging patterns). As the system matures,
  graduates become narrower and more situational. This is
  the natural trajectory of a maturing knowledge system,
  not a flaw to fix.
- **Structural improvements > textual improvements**: plan
  archival (prevents re-execution), pattern indexing (makes
  invisible patterns discoverable) delivered more impact
  than graduating individual sentences to permanent docs.

## Session 2026-04-01 — URL remediation snagging execution

Executed all 12 tasks of the URL remediation snagging plan.

### Decisions made during execution

- `generateLessonOakUrl` now delegates to `generateOakUrlWithContext`
  with a defensive TypeError guard on the null return. The null path
  is currently unreachable for lessons (codegen always returns string),
  but the guard matches the pattern used by other convenience functions.
- `@remarks` on `generateSubjectProgrammesUrl` refined after code review:
  changed from a misleading `{@link ... | urlForSubject}` (wrong link
  target) to prose referencing the internal helper by name in backticks.
- `OAK_BASE_URL` example updated to show `generateLessonOakUrl` usage
  instead of manual template literal, aligning with SSOT principle.

### Quality gate notes

- Pre-existing lint failures in `oak-search-cli`: `vitest.config.ts` and
  `vitest.e2e.config.ts` have `allowDefaultProject` parsing errors. Not
  caused by this work, but worth fixing separately.
- All 3,797 tests green across all workspaces.
