# Plugin distribution — the question set behind the marketplace.json incident

Captured 2026-07-30 ~12:20Z at owner word ("a deeper set of questions, and important... address
after compaction"). Ticket: see the Linear pointer minted alongside this note. Every FACT below
was verified against the live vendor pages on 2026-07-30; re-verify at time of use
(capability questions come from original sources).

## What triggered this

A bare-root `marketplace.json` was briefly present on the primary checkout — untracked, never
committed, wrong path for any convention, contents unrecorded, deleted within minutes. It was
nearly cited to the owner as a committed file. Second untracked-stray-impersonating-real-file
instance of the day (the #620 `.mcp.json` gitignore swallow was the first). The challenge
("are you sure it is real, that we need it, that we built it, that it belongs at repo root?")
falsified three of four premises.

## Verified facts (live vendor docs, 2026-07-30)

- **Directory submission needs NO marketplace file.** claude.com/docs/plugins/submit: submission
  is "a GitHub link to your plugin" (public repo — closed source not accepted) plus
  `claude plugin validate` green, via the claude.ai or Console in-app forms.
- **Post-publication updates are automatic**: "updates pushed to your GitHub repo are picked up
  automatically — CI mirrors changes to the public marketplace and runs automated screening on
  each update. You do not need to re-submit the form."
- **Marketplace files serve a DIFFERENT path**: self-hosting a catalogue for
  `/plugin marketplace add`. Canonical location `.claude-plugin/marketplace.json` at the
  marketplace repo's root (code.claude.com/docs/en/plugin-marketplaces), declaring subdirectory
  plugins via relative `source` (e.g. `"./plugins/oak-open-curriculum"`), with
  `metadata.pluginRoot` available as a base-path shortcut.
- **Our committed plugin definition** is exactly two files on main:
  `plugins/oak-open-curriculum/.claude-plugin/plugin.json` and
  `plugins/oak-open-curriculum/.mcp.json`, plus the content tree (skills/workflows/agents).

## The open questions (the ticket's substance)

1. **Channel decision (owner/product):** does Oak want the self-hosted marketplace path as an
   additional distribution channel beside the directory — `/plugin marketplace add` for
   communities/enterprises — and if so, when? It is cheap (`.claude-plugin/marketplace.json` at
   the monorepo root) but it is a public commitment with its own maintenance surface. Ties to
   MCP-302's install-kit framing and the OKR multi-assistant plan.
2. **Subdirectory acceptance at the form:** the submit page says "a GitHub link to your plugin" —
   verify at the portal that a subdirectory link (`.../tree/main/plugins/oak-open-curriculum`)
   is accepted; `claude plugin validate` run from the plugin directory is the pre-check.
3. **Reconcile the update model:** the estate's recorded understanding ("skills frozen at ingest
   for safety; updating the Plugin requires an update process... possibly manual" — the owner's
   30 July notes, now in the Matt handover doc) sits in tension with the vendor's
   auto-mirror-on-push statement above. Determine what is actually frozen where (Claude-side
   ingest at install? the community mirror pin? nothing?), and true the handover doc's plugin
   paragraph to the reconciled answer.
4. **Stray-file hygiene:** whose session created the bare-root marketplace.json, and does the
   untracked-stray-impersonating-real-file class deserve a guard (e.g. the repo validator
   flagging well-known-named untracked files at surfaces tooling reads)? Two instances one day.

## Disposition

Post-compaction, post-submission. Question 2 resolves itself at tonight's form; questions 1 and
3 are owner-facing; question 4 prices as tooling hygiene.

*Recorded by Falcon hunts Flight (52841f, agent, Director) at owner word.*
