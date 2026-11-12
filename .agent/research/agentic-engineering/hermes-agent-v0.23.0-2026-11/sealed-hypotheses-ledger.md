# Sealed hypotheses ledger

Do not read past this paragraph until the Phase 2 cold-pass record is committed to the evidence log. The fifteen claims below came from the brief author's desk research on 2026-11-09: third-party write-ups, release notes and issue threads. None was read from the code. Each enters the evidence log as "Assumption to verify" and leaves as Fact, Dropped, or open with a reason.

| Id | Claim to test | Where it came from, and why it is open |
| --- | --- | --- |
| H1 | Memory and skill writes are prompted by counters that start a background review agent | Write-ups give the default interval as 10 and as 15 |
| H2 | The memory files are a frozen snapshot per session; a write shows only in the next session | Docs summaries and blogs; `prompt_refresh` at v0.23.0 may change it |
| H3 | The curator marks skills stale and archives them on day thresholds | Write-ups conflict: 30/90 days against 14/30 |
| H4 | Writes to skills and memory need approval | v0.21.0 notes say always; issues #26298 and #53491 say two guards default to off. Find which code path each covers |
| H5 | Compaction creates a child session in a lineage | Docs summary only |
| H6 | One external memory provider runs at a time, alongside built-in memory | Docs summary only |
| H7 | The DSPy and GEPA self-evolution work sits outside the runtime | Inferred from its separate repository |
| H8 | Memory writes are scoped to the caller | Inferred from v0.23.0 PR #144861 (Kanban worker turns no longer saved as memories) |
| H9 | `hermes curator lock` blocks `skill_manage`, file edits and terminal writes | v0.23.0 PR #147557; the terminal-write mechanism is unknown |
| H10 | Compaction summaries mark uncertain claims on `UNVERIFIED:` lines | v0.23.0 PR #86019 |
| H11 | One gateway per machine owns every session, and every surface attaches to it as a client | v0.23.0 release notes |
| H12 | Tools register themselves at import, and rarely used tools are deferred behind a tool search | Docs summary and v0.22.0 notes |
| H13 | The stated design is a narrow core with capability at the edges; the v0.22.0 notes claim a 34% reduction in source lines | Root `AGENTS.md` as summarised; the line-count claim is disputed in issue #138464 |
| H14 | The system prompt is built once per session in tiers and kept byte-stable for prompt caching | Docs summary |
| H15 | Critics name four failure modes: skill bloat, entrenched wrong lessons, memory poisoning through injected content, and cache invalidation on compaction | Third-party reviews and issue #111774; Hermes's own list may differ |

A release note, an issue or a blog post is a dated record of what someone wrote. For a mechanism claim, the code at the tag decides the row.
