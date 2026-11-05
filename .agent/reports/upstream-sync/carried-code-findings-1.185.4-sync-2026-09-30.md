# Findings ledger: the 1.185.3 → 1.185.4 sync (carrier #315, 2026-09-30)

**Review contract.** The same as the 1.185.3 ledger's: every issue found while integrating the Oak
line's main `5165866428e` (release 1.185.4) into `engraph`, from any source. Owner's word
(2026-09-19): an issue that does not block the merge is recorded here and fixed in a separate pull
request; owner's ruling (2026-09-20, "Cure here only what misleads operators"): quality cures of
code the Oak line authored are held for that line and arrive here through a later carrier. Owner's
word for this carrier (2026-09-30): bare-minimum ceremony, agent reviews on the carrier not acted
on, the conflicts fixed by meaning, the pull request merged.

## A. Code authored on the Oak line (held for that line)

None recorded. The carried change is the plugin, its ChatGPT/Codex package and its MCP server key
renamed to `oak-national-academy` to match the display name (Oak #996 and #997; plugin CHANGELOG
0.1.4; ADR-125 amended; ruling R46 superseded), and the 1.185.4 release lines. This seat read the
diff at the file level only, at the owner's word; Copilot and Codex raised no finding about the
carried code.

## B. This line's sync machinery and surfaces

**B1 — a carrier opened by hand from the mirror.** PR #314 was opened with head `main`, the mirror
itself. Its head is upstream's `[skip ci]` release commit, so `run-quality-gates` never ran there,
and its conflicts could not be resolved without a commit on the mirror. The carrier workflow,
dispatched by hand (run 36771755162), opened #315 at the same tip as the bot; #315's landing made
#314 read merged (20:40:11Z). The 18:30Z scheduled carrier slot after the mirror moved at 17:23Z
shows no run; not investigated.

**B2 — two memory files conflicted.** `git merge-tree --write-tree` against engraph `3c4e6e219`
exited 1 naming `director-handoff.md` (the fork drained the handoff state; upstream annotated
ruling 46 inside it) and `director-rulings-ledger.md` (upstream removed the R46 queue row; the fork
had edited the SPARK-5 row beside it). Resolved by concept in `42da62c30`: the fork's drained
handoff stands (ruling 46 lives in the 2026-09-08 archive, never edited); the ledger drops R46,
keeps the fork's SPARK-5 row and carries upstream's PLUGIN-NAME row and supersession note. A first
resolution took stage 2 for both files, which is UPSTREAM when engraph is merged into the carrier;
the diff-against-engraph read caught it before the commit. The proof the semantic-merge skill asks
for is what caught it, not the conflict count.

**B3 — two fork documents named the pre-rename paths as live.** `.agent/skills/README.md` re-trued
to `claude/plugins/oak-national-academy` and `chatgpt/plugins/oak-national-academy`; ADR-189 gained
a dated addendum, its 2026-09-17 addendum left standing (`6acc7231e`). Copilot's fourth thread
raised the same premise.

**B4 — the workspace classification census is stale against the renamed roots.** All five review
threads (Copilot four, Codex one) asked for `.agent/reports/workspace-classification-census/`
(`rows.json`, `facts.json`, `matrix.md`) to be regenerated. The census is not a required check, not
in CI and not in `pnpm check`; on the merged tree `workspace-census check` reports 33 drifted
entries, several on paths this sync did not touch (`.codex`, `.cursor`, `apps/oak-search-cli`).
Held as a fork-surface job outside the carrier, at the owner's word; the threads were resolved as
the bot with that disposition.

**B5 — identity and hooks.** The two carrier commits were made with the clone's identity unmodified,
so both are bot-authored and bot-committed; the commit skill's `--author=<owner>` split was not
applied. Hooks were skipped at the owner's word (`HUSKY=0`, fresh authorisation this session); the
pre-commit gates ran in CI, `run-quality-gates` and `CodeQL` green on `6acc7231e`.

**Landing.** `66b74dbc2`, a merge commit as the bot through the REST endpoint with the verdicted
head pinned (second parent `6acc7231e`); the mirror tip `5165866` is an ancestor of `engraph`; the
carrier branch deleted as the bot with read-back.

## Addendum, 2026-10-27 — the 1.186.1 sync removes the renamed roots

Upstream moved the plugins to oaknational/oak-ai-plugins (MCP-775, 2026-10-21; release 1.186.1).
B3's two re-truings are re-trued again at that sync: the skills README's row and paragraph name
oaknational/oak-ai-plugins, and ADR-189 gains a 2026-10-27 addendum. B4 stands and widens: the
census's two plugin rows (`plugins/oak-open-curriculum`, `plugins/oak-open-curriculum-chatgpt`) now
name subjects the tree holds under no path, and arm (ii-b) of the census admits nothing; the
regeneration remains the fork-surface job held here, recorded on the census plan's amendment trail.
