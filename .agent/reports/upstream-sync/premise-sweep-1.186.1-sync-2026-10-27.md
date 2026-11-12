# Premise sweep record: the 1.185.6 → 1.186.1 sync (carrier #363, 2026-10-27)

**Review contract.** The cross-fork skill's §6 sweep, recorded per hit so a reviewer checks
"nothing to re-true" as a read, not a count; the same frame as the 1.185.0 record (the Oak line
and this line are one repository temporarily diverged into two lines; "the Oak line's tip" names
a commit). Carrier #363 at the Oak line's tip `4e9d49a2f` (release 1.186.1), merge base
`2a7773837` (release 1.185.6), seven commits exclusive to the carrier, 2354 exclusive to
`engraph` at `493951ad7`. The merge is `4b9e7dcb6` (author the owner, committer the bot, parents
`4e9d49a2f` and `493951ad7`); the merge-tree dry run against the live tip exited 1 with five
conflicts and wrote tree `18610ad8e` before resolution, each resolution by meaning in that
commit's message. Enumeration: the `.md` and `.json` files differing between the Oak line's tip
and `origin/engraph` numbered 1808. Method: one keyword census per claim term over
`origin/engraph`, one term at a time, every hit read at its line; files outside the hits were
read at the claim level through their directory class (dated archives, conserved corpora,
generated pages); the fork's own code was checked by `type-check`, the whole `agent-tools` suite
and the validators rather than by reading. Seat: Kraken spins Ballast (eafa83, claude-code).

## The claims

1. The plugins moved to oaknational/oak-ai-plugins, which builds, checks and releases them from
   1.1.1 (MCP-773, MCP-774, MCP-775; Oak #1010, 2026-10-21). Removed from the tree:
   `claude/plugins/`, `chatgpt/plugins/`, `.claude-plugin/marketplace.json`,
   `.agents/plugins/marketplace.json`, the two `.gitignore` lines, `validate-plugin-skill-copies`
   (validator, unit tests, script, repo-validators entry, knip entry), the four plugin integration
   tests (`chatgpt-merged-skill-derivation`, `chatgpt-plugin-package-invariants`,
   `plugin-listing-invariants`, `plugin-mcp-server-binding`) and the test helper
   `test-helpers/frontmatter.ts` (`repo-doc.ts` narrowed to `readRepoDocument`). The last versions
   are in history at release v1.186.0.
2. The ChatGPT package passes OpenAI's ZIP upload checks; plugin 1.1.0 (MCP-766; Oak #1009,
   release 1.186.0). Both surfaces that stated it were removed by claim 1 in the same sync.
3. The Oak line's default branch is at 1.186.1 (`package.json`, the SDK's `package.json`,
   `CHANGELOG.md`).
4. Old facts the change replaces: the plugin homes under `claude/plugins/` and `chatgpt/plugins/`
   (and their pre-rename `plugins/` paths), the two manifests as "the home" or "the delivery
   mechanism", `validate-plugin-skill-copies` as a live gate, the four tests as live subjects of
   findings, 1.185.6 as the current upstream version.

Terms searched, one at a time: `claude/plugins`, `chatgpt/plugins`, `marketplace.json`,
`plugin-skill-copies`, the four test names, `oak-ai-plugins`, `1.185.6`, `oak-national-academy`,
the five MCP ticket ids, and `chatgpt package`, `codex package`, `zip upload`.

## Hit index and dispositions

| # | File | Lines | Claim | Bytes | Disposition | Applied |
| --- | --- | --- | --- | --- | --- | --- |
| H1 | `.agent/skills/README.md` | 38; 43–47 | 1 | this line | row's home → oaknational/oak-ai-plugins, delivery → Claude and ChatGPT plugins (upstream's fact); the three-corpora paragraph re-trued, the owner's 2026-09-17 wording kept | merge `4b9e7dcb6` |
| H2 | `.agent/rules/capability-landing-decision-procedure.md` | 85–87 | 1 | this line | the OCE example re-trued inside the host-neutral text | merge `4b9e7dcb6` |
| H3 | ADR-189 (the 2026-09-05, 09-17 and 09-30 amendments) | 91–108 | 1 | this line | dated 2026-10-27 addendum; the earlier addenda stand as dated record | this commit |
| H4 | `.agent/memory/operational/director-rulings-ledger.md`, row PLUGIN-NAME | 133 | 1 | upstream's row, carried at 1.185.4 | the evidence pointer names the history location of the removed test | this commit |
| H5 | `.agent/memory/executive/artefact-inventory.md` | 30 | 1, 4 | this line | the OCE parenthetical (`plugins/*/`, a pre-rename path) names the move | this commit |
| H6 | `.agent/plans/delivery/workspace-classification-census.plan.md` | amendment trail; 80–86 | 1 | this line (governing plan) | narrowed by a dated trail entry: arm (ii-b) admits nothing; the two plugin rows in `rows.json` and `facts.json` name removed subjects; regeneration stays the held fork-surface job (1.185.4 ledger B4); the ratified body's example is left under the trail | this commit |
| H7 | `carried-code-findings-1.185.0-sync-2026-09-17.md` | A3, A9, A11, B1 | 1 | this line (dated ledger) | addendum: A3, A9 and B1 overtaken; A11 persists in moved form (upstream's 2026-10-21 amendment still writes "the Claude Code plugin") | this commit |
| H8 | `carried-code-findings-1.185.3-sync-2026-09-28.md` | A1 | 1 | this line (dated ledger) | addendum: the test is gone; the IO-in-tests class persists in `readRepoDocument`'s two remaining readers | this commit |
| H9 | `carried-code-findings-1.185.4-sync-2026-09-30.md` | B3, B4 | 1 | this line (dated ledger) | addendum: B3 re-trued again; B4 stands and widens | this commit |
| H10 | `.agent/memory/executive/cross-platform-agent-surface-matrix.md`, `.agent/plans/delivery/skill-classes-and-validation-jurisdiction.plan.md`, `docs/engineering/extending.md`, ADR-125 | the plugin passages | 1 | upstream's bytes, auto-merged | read on the merged tree: each carries upstream's 2026-10-21 wording; ADR-125's older amendment sections keep their paths by upstream's own note | none needed |
| H11 | `knip.config.ts`, `.gitignore` | — | 1 | auto-merged | no plugin entry remains | none needed |

## Read and clear, by class

- **Dated history, left as written** (the skill's rule: a dated record is never rewritten):
  `.agent/memory/active/archive/napkin-2026-05-11.md`, `napkin-2026-05-22-evening.md`;
  `.agent/memory/active/napkin.md` L178 (the 2026-10-02 mirror read, 1.185.6, a session
  observation); `.agent/memory/operational/review-cost-ledger.md` L185 (carrier #319's row);
  `.agent/memory/operational/threads/estate-coordination.next-session.md` L2301 (a fold entry's
  mirror read; the thread's next entry is the landing seat's); the archived
  `director-handoff-current-handoff-state-2026-09-08.md` and
  `repo-continuity-current-state-2026-09-29-to-2026-10-05.md`; the premise-sweep and the two
  upstream-report drafts under `.agent/reports/upstream-sync/`; the dated reports
  `claude-directory-submission-form-inventory-2026-07-28.md`,
  `plugin-distribution-question-set-2026-07-30.md`, `slack-watcher-estate-review-2026-08-24.md`,
  `2026-09-01-why-delivery-stopped-when-the-merge-engine-was-a-seat.md`,
  `skills-estate-organisation-ws0-working-record.md`, the 2026-10-02 parity-measure inventories and
  ledger, `practice-inventory-2026-10-02.md`, `spotify-portal-ai-plugins-exploration-2026-09-12.md`
  (Spotify's files), the comms-corpus and large-corpus data files, the comms-absorption-sweep
  signals; `.agent/research/wider-ecosystem/agent-skills-addyosmani-survey-2026-08-02.md`.
- **Conserved corpora, left untouched by their own charter**: `.agent/plans-backlog-2026-07/`
  (the lossless 2026-07-21 conservation; its `plugin-package-creation.plan.md` and
  `plugin-bundle-distribution.plan.md` planned a package this repository no longer builds — a fact
  for the migration-candidate review that corpus awaits, not an edit here) and
  `.agent/plans-refounding/archive/frozen-v1/` (a byte-frozen archive).
- **Generated census data, not hand-edited**: the `rows.json`, `facts.json` and `matrix.md`
  under `.agent/reports/workspace-classification-census/` — stale against the renamed roots since
  1.185.4 (ledger B4), now against removed roots; recorded at H6 and H9, regenerated in its own
  lane.
- **Homonyms**: `oak-national-academy` as the Sentry organisation (every Sentry runbook, plan
  and research hit), as the organisation in `LICENCES.md` and the tuition research; "plugin" as
  the ESLint plugin, the Linear plugin (`README.md` L255–261), the Vercel–Sentry marketplace
  plugin, Antigravity plugin bundles; `docs/governance/development-practice.md` L422–429 defines
  the connector/plugin vocabulary and names no home.
- **Code and config, proven by the gates rather than read**: `subjects.ts` under
  `agent-tools/src/workspace-census/` and the two census tests keep the manifest arm and
  in-memory fixture paths (shared bytes, upstream's design); the fork's `skill-evals` module writes
  a temporary plugin manifest of its own and reads no plugin folder; the fork's
  `the-codex-dialogues-probe-lockstep` test imports `readRepoDocument`, which upstream kept.
- **Claim 2**: no fork-side document asserts the ChatGPT package's packaging shape; the README
  and the invariants test that did were upstream's and are removed.
- **Claim 3**: every remaining `1.185.6` is dated history (above) or upstream's own bytes.

## Numbering

No ADR, PDR or plan file arrived with the change: between the merge base and the carrier head the
decision-record and plan directories show only ADR-125 and the skill-classes plan, both modified.
Nothing to renumber.

## Generated surfaces

`pnpm skills:generate` wrote 320 projection files and `pnpm portability:fix` recomputed 124 rules,
78 skills and 26 sub-agent templates with their adapters; the working tree after both listed no
generated path — every output was byte-identical to the tracked file.
`validate-under-the-hood-content` reported the module up to date and
`validate-mcp-content-workspace` 26 pages in sync. The schema surface did not move; `sdk-codegen`
was not run.

## Gates on the merged tree

Run from the carrier worktree at `4b9e7dcb6` with the sweep edits in the working tree:
`turbo run type-check --filter=@oaknational/agent-tools` (7 tasks, green, before the merge
commit); the merge commit's own hooks (prettier on the staged set, markdownlint over 918 files,
turbo lint in 34 packages, 58 tasks, the version guard and commitlint, all green);
`pnpm --filter @oaknational/agent-tools test` (666 files, 7905 tests, green — the brief's named
file `chatgpt-plugin-package-invariants` no longer exists on either line, so the whole suite
stands for it); `pnpm --filter @oaknational/agent-tools lint` (exit 0); `pnpm skills:check`
(exit 0); `pnpm portability:check` (exit 0); `pnpm knip:gate` (exit 0, its standing `.css` hints
only); `pnpm docs-validators:check` (every validator OK; its patterns-index note on 37 patterns
without `use_this_when` predates the sync).

## Held, for their own lanes

- The census regeneration (H6, H9): not a required check, not in `pnpm check`; the 1.185.4
  ledger's B4 holds it.
- A11 of the 1.185.0 ledger, in moved form: upstream's ADR-125 amendment of 2026-10-21 writes "the
  Claude Code plugin" against this line's owner definition; held for the Oak line as before.
