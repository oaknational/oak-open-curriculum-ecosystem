# Threshold re-read at the vendor pages

**Fetched:** 12 November 2026, 23:40:31 to 23:40:59 UTC (three batches inside that half minute,
plus one follow-up fetch of the Claude Code commands page within the next minute).

**Method.** Every page was fetched with `curl -sL` as its Markdown twin (`.md` URL) and searched
and read directly. No summarising fetch tool was used, so **every quotation below is raw**.
There are no relayed quotations. Requests carried no repository, project or personal details.

**Host note.** Every `developers.openai.com/codex/...` URL redirected (HTTP 200 after redirect)
to `learn.chatgpt.com/docs/...`. Both URLs are given where that happened.

## Pages read

| Key | URL requested | Final URL if redirected | HTTP | Bytes |
| --- | --- | --- | --- | --- |
| MEM | `https://code.claude.com/docs/en/memory.md` | | 200 | 55,459 |
| SK | `https://code.claude.com/docs/en/skills.md` | | 200 | 119,109 |
| CTX | `https://code.claude.com/docs/en/context-window.md` | | 200 | 8,801 |
| TR | `https://code.claude.com/docs/en/tools-reference.md` | | 200 | 90,700 |
| SET | `https://code.claude.com/docs/en/settings-reference.md` | | 200 | 458,133 |
| ENV | `https://code.claude.com/docs/en/env-vars.md` | | 200 | 189,603 |
| MC | `https://code.claude.com/docs/en/model-config.md` | | 200 | 133,250 |
| FO | `https://code.claude.com/docs/en/features-overview.md` | | 200 | 29,501 |
| COST | `https://code.claude.com/docs/en/costs.md` | | 200 | 46,805 |
| CMD | `https://code.claude.com/docs/en/commands.md` | | 200 | 57,240 |
| also searched | `settings.md`, `plugins-reference.md`, `glossary.md`, `errors.md` under the same root | | 200 | |
| S1 | `https://developers.openai.com/codex/guides/agents-md.md` | `https://learn.chatgpt.com/docs/agent-configuration/agents-md.md` | 200 | 9,149 |
| S2 | `https://developers.openai.com/codex/skills.md` | `https://learn.chatgpt.com/docs/build-skills.md` | 200 | 11,396 |
| S6 | `https://developers.openai.com/codex/config-reference.md` | `https://learn.chatgpt.com/docs/config-file/config-reference.md` | 200 | 152,782 |
| S7 | `https://developers.openai.com/codex/config-advanced.md` | `https://learn.chatgpt.com/docs/config-file/config-advanced.md` | 200 | 56,817 |
| MOD | `https://developers.openai.com/codex/models.md` | `https://learn.chatgpt.com/docs/models.md` | 200 | 19,543 |
| SPEC | `https://agentskills.io/specification.md` | | 200 | 7,685 |

## The thresholds

The second column is each value as the design's first draft recorded it, which is what was
being checked. Where the verdict is that it differs, the design has since been corrected and
this column keeps the earlier wording on purpose: T2's "name and description together" is
the recorded text, and the vendor's counted fields are in the third column.

| # | Value the design records | Vendor sentence, verbatim | URL (key) | Mode | Verdict |
| --- | --- | --- | --- | --- | --- |
| T1 | A rule file loaded on demand, each file: 40,000 characters on a 200,000-token window | "When a subdirectory `CLAUDE.md` or a rules file that loads on demand is over a per-file size limit, Claude receives only the start of it." Then, in the numbered list: "**200K context window**: 40,000 characters" and "**1M context window**: 200,000 characters on Claude Opus 4.6 and Claude Sonnet 4.6, and 150,000 characters on later models". Also: "Before v2.1.309, Claude Code didn't apply this limit to files that load on demand." | MEM | raw | **CONFIRMED.** See note 1: the same page set says current models run with the 1M window by default, where the figure is 150,000 (or 200,000). |
| T2 | One entry of the skills listing, **name and description together**: 1,536 characters | "Put the key use case first: the combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing to reduce context usage." (SK, `description` row) "Appended to `description` in the skill listing and counts toward the 1,536-character cap." (SK, `when_to_use` row) "You can also trim the `description` and `when_to_use` text at the source: put the key use case first, since each entry's combined text is capped at 1,536 characters regardless of budget. The cap is configurable with [`skillListingMaxDescChars`]" (SK) "This key caps how many characters of that text Claude Code shows per skill; longer text is cut at the cap." with "**Default**: `1536`" (SET) | SK, SET | raw | **DIFFERS in what is counted; the number is confirmed.** The 1,536 characters cover `description` plus `when_to_use`. No sentence on the pages read counts the skill's `name` towards the cap. |
| T3 | A skill's description: 1,024 characters (Agent Skills specification) | Table row: "`description` \| Yes \| Max 1024 characters. Non-empty. Describes what the skill does and when to use it." Body: "The required `description` field:" / "Must be 1-1024 characters" | SPEC | raw | **CONFIRMED.** Neither vendor's skills page restates the figure; see section C. |
| T4 | The skills listing, all entries: 1 % of the window by default, "about 8,000 characters at 200,000 tokens" | "The listing always contains every skill name, but if you have many skills, Claude Code drops some descriptions to fit the listing's character budget, which removes the keywords Claude needs to match your request. The budget scales at 1% of the model's context window." (SK) "**Default**: `0.01`, which reserves 1% of the context window" (SET, `skillListingBudgetFraction`) "Override the character budget for skill metadata shown to the [Skill tool]. The budget scales dynamically at 1% of the context window, with a fallback of 8,000 characters. Legacy name kept for backwards compatibility" (ENV, `SLASH_COMMAND_TOOL_CHAR_BUDGET`) | SK, SET, ENV | raw | **CONFIRMED for the fraction (1 %, default `0.01`).** The character conversion is **NOT FOUND**: no page states how 1 % of a token window becomes a character count. The only absolute figure is "a fallback of 8,000 characters", which the vendor gives as a fallback, not as the value at 200,000 tokens. The design's "about 8,000 at 200,000 tokens" and "about 24,000" at 3 % stay the seat's arithmetic. |
| T5 | Codex skills listing (carries each skill's path): 2 % of the window by default; 8,000 characters when the window is unknown; at most 10,000 tokens if set. "About 16,000 characters at 200,000 tokens." | "In Codex, the initial list also includes each skill's file path. By default, this list uses at most 2% of the model's context window, or 8,000 characters when the context window is unknown. If many skills are installed, Codex shortens skill descriptions first. For large skill sets, Codex may omit some skills from the initial list and show a warning." "Use [`skills.max_context_tokens`] to set a different budget, up to 10,000 tokens." (S2) "Token budget for the available-skills catalog. Defaults to 2% of the model's context window. Explicit values are capped at `10000` tokens." (S6) | S2, S6 | raw | **CONFIRMED** for all three documented values. The "16,000 characters at 200,000 tokens" is the design's arithmetic and its 200,000-token premise is not what the models page states for Codex; see section A. |
| T6 | A skill's body kept through a compaction: 5,000 tokens each, 25,000 in all | "When the conversation is summarized to free context, Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each. Re-attached skills share a combined budget of 25,000 tokens." (SK) "Invoked skill bodies \| Re-injected, capped at 5,000 tokens per skill and 25,000 tokens total; oldest dropped first" (CTX) | SK, CTX | raw | **CONFIRMED** |
| T7 | One read of a file: 25,000 tokens; a partial view beyond it | "By default one call returns at most 25,000 tokens, or the value you set in [`CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS`], and refuses a whole file over 256 KB, so Claude reads a larger file in pages with `offset` and `limit`." "**Whole file over the token limit**: the first page of the file, with a `PARTIAL view` notice saying how much of the file it received and how to read more with `offset` and `limit`" "**Whole file over 256 KB, or an `offset` or `limit` read over the token limit**: an error telling it to read a portion with `offset` and `limit`, or to search for specific content with [Grep] instead" (TR) "Override the default token limit for [file reads], which is 25,000 tokens." (ENV) | TR, ENV | raw | **CONFIRMED.** Two things the design row omits: a whole file over 256 KB is refused with an error, not shown partially; and "On Claude Code v2.1.296 or later it can instead read the whole file, or a long line range, in one call by setting `allow_large: true` when it needs to ... That read is sized against the room left in the session's [context window] instead of the default limits." |
| T8 | The `AGENTS.md` chain: 32 KiB. "One vendor page says together, one says each file, one says neither" | "Codex skips empty files and stops adding files once the combined size reaches the limit defined by `project_doc_max_bytes` (32 KiB by default)." (S1) "`project_doc_max_bytes`: how much to read from each `AGENTS.md` file" (S7) "Maximum bytes read from `AGENTS.md` when building project instructions." (S6) | S1, S7, S6 | raw | **CONFIRMED**, including the disagreement between pages. All sentences bearing on it are in section A. |
| T9 | Advice: under 200 lines for a memory file, under 500 for a skill body | "**Size**: target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence." (MEM) "Files over 200 lines consume more context and may reduce adherence." (MEM) "Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files." (SK) | MEM, SK | raw | **CONFIRMED.** Restated at FO ("**Rule of thumb:** Keep CLAUDE.md under 200 lines.") and COST ("Aim to keep CLAUDE.md under 200 lines by including only essentials."). The specification has the same 500-line sentence: "Keep your main `SKILL.md` under 500 lines. Move detailed reference material to separate files." (SPEC) |
| T11 | A warning when instruction files together pass a combined limit at session start: no value given | "If one of your instruction files is over the recommended length, you see a warning at startup and when you run `/status`. You also see a warning when files that are each within that length add up past a combined limit at session start. Each CLAUDE.md, rules file, and `@path` import counts as a separate file." (MEM) | MEM | raw | **CONFIRMED** that the warning is documented and that no number is given. A number was searched for in MEM, SET, ENV, CMD, FO, COST, MC, the glossary and the errors page: not found on the pages read. |

T10 is a local measurement and was not checked.

### Notes on the table

1. **T1 and T4 depend on the window, and the model page says the default window is now 1M.**
   "Fable models, Sonnet 5 and later, Haiku 5.5, and Opus 4.7 and later run with the 1M window by
   default, with no `[1m]` suffix needed." (MC, raw.) "Opus 4.6 and Sonnet 4.6 reach 1M only
   through their `[1m]` variant, and access to that variant depends on your plan." (MC, raw.)
   "To keep sessions at a 200K window, set `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` ..." (MC, raw.) The
   design states T1 and T4 "on a 200,000-token window"; that is the smaller of the two documented
   cases, so it is the conservative one, but it is not the default for current models.
2. **T2's wording in the design ("name and description together") is not the vendor's.** The
   vendor's counted text is `description` plus `when_to_use`.

## A. Codex open questions

**Default context window of current Codex models.** One sentence found, for one model:

- "GPT-6.1 Sol uses a default context window of 500,000 tokens in Codex and ChatGPT Work."
  (MOD, raw, `https://learn.chatgpt.com/docs/models.md`.)
- The same page's sample configuration is `model = "gpt-6.1-sol"`, introduced by "If you don't
  specify a model, the ChatGPT desktop app, Codex CLI, or IDE extension uses a recommended
  model." (MOD, raw.) The page's recommended models are Astra, GPT-6.1 Sol, GPT-6.1 Terra and
  Luna; no context-window figure for Astra, Terra or Luna is on the page read (their details sit
  in components that do not render in the Markdown twin).
- The configuration reference describes `model_context_window` only as "Context window tokens
  available to the active model." (S6, raw.) S7 has an example line, `model_context_window =
  128000    # Context window size`, which is an example, not a stated default.

**Is the 2 % budget stated with an absolute figure?** No absolute figure for the 2 % case on the
pages read. The only absolutes are "8,000 characters when the context window is unknown" and
"up to 10,000 tokens" for an explicit setting (S2), and "Explicit values are capped at `10000`
tokens." (S6). Whether the default 2 % is itself capped at 10,000 tokens: not found. Arithmetic,
not a vendor statement: 2 % of 500,000 tokens is 10,000 tokens.

**Is 32 KiB combined or per file?** Every sentence found that bears on it:

- "Codex skips empty files and stops adding files once the combined size reaches the limit
  defined by `project_doc_max_bytes` (32 KiB by default)." (S1, raw.)
- "For details on these knobs, see [Project instructions discovery]. Raise the limit or split
  instructions across nested directories when you hit the cap." (S1, raw.)
- After an example setting `project_doc_max_bytes = 65536`: "The larger byte limit allows more
  combined guidance before truncation." (S1, raw.)
- "**Instructions truncated:** Raise `project_doc_max_bytes` or split large files across nested
  directories to keep critical guidance intact." (S1, raw.)
- "Codex reads `AGENTS.md` (and related files) and includes a limited amount of project guidance
  in the first turn of a session. Two knobs control how this works:" / "`project_doc_max_bytes`:
  how much to read from each `AGENTS.md` file" (S7, raw.)
- "Maximum bytes read from `AGENTS.md` when building project instructions." (S6, raw.)

Count: S1 says "combined" twice; S7 says "each"; S6 says neither. S1's advice to "split
instructions across nested directories" fits neither reading cleanly (a split does not reduce a
combined total for a session started in the nested directory). Unresolved from the
documentation. S1 also does not say whether the global `~/.codex` file counts towards the limit.

## B. Claude Code open questions

**A number for the "combined limit".** Not found on the pages read. The only sentence is the one
quoted at T11 (MEM). The "recommended length" the same sentence relies on is also not given a
number there; the nearest statements are "target under 200 lines per CLAUDE.md file" and "Files
over 200 lines consume more context and may reduce adherence." (MEM, raw.)

**Does the listing budget cover all listed skills, including plugin and built-in skills?** No
sentence on the pages read says which sources count. What the pages do say:

- "Claude Code loads a listing of skill names and descriptions into context so Claude knows
  what's available. The listing always contains every skill name ..." (SK, raw.)
- "Each turn, Claude sees a [listing of your skills] with their descriptions, and Claude Code
  caps that listing at a share of the context window." (SET, raw.)
- "Every skill in the [skill listing] adds to your context on every turn, whether or not Claude
  ever uses it." (SK, raw.)
- On the usage report, not the budget: "The report covers the skills in your session other than
  bundled skills and enterprise skills." (SK, raw.)
- On overrides, not the budget: "Overrides don't apply to plugin skills, which you manage
  through `/plugin`." (SET, raw.)

So: the budget is described as applying to "the listing", with no exclusion stated for plugin or
bundled skills and no statement that they are included. Not settled by the documentation.

**Is the 1,536-character cap on the description alone or on name plus description?** On
`description` plus `when_to_use`. Verbatim: "the combined `description` and `when_to_use` text
is truncated at 1,536 characters in the skill listing" (SK); "`when_to_use` ... Appended to
`description` in the skill listing and counts toward the 1,536-character cap." (SK); "a
[listing of your skills] that shows each skill's `description` and `when_to_use` text. This key
caps how many characters of that text Claude Code shows per skill" (SET). The name is not
mentioned as counted. The setting is still named `skillListingMaxDescChars`, default `1536`; the
budget setting is still named `skillListingBudgetFraction`, default `0.01`.

**Setting versus environment variable.** "To raise the budget, set the
[`skillListingBudgetFraction`] setting (for example, `0.02` = 2%) or the
`SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable to a fixed character count." (SK, raw.)
Precedence when both are set: not found.

## C. Other limits on one skill description

- **agentskills.io, confirmed:** "`description` | Yes | Max 1024 characters. Non-empty.
  Describes what the skill does and when to use it." and "Must be 1-1024 characters"
  (`https://agentskills.io/specification.md`, raw). Same page: `name` "Max 64 characters";
  `compatibility` "Max 500 characters"; "**Instructions** (\< 5000 tokens recommended)".
- **Claude Code does not restate 1,024.** The string "1,024"/"1024" appears in SK only inside a
  byte-formatting code sample. SK links the specification ("Claude Code skills follow the [Agent
  Skills] open standard") and says "The [Agent Skills spec] and the [Skills API requirements]
  define everything else those paths validate", about using a skill outside Claude Code
  (claude.ai chat and the API). The only length limit SK restates from the specification is on
  `compatibility`: "Accepts a string of up to 500 characters." The Skills API requirements page
  (`docs.claude.com/en/api/skills-guide`) was not fetched.
- **Codex does not restate 1,024.** S2 has no per-description limit. It links "the [agent skills
  specification](https://agentskills.io/specification)" and advises: "Because implicit matching
  depends on `description`, write concise descriptions with clear scope and boundaries.
  Front-load the key use case and trigger words so a host can still match the skill if
  descriptions are shortened." (S2, raw.)
- **No other per-description limit** was found on either vendor's pages beyond the Claude Code
  1,536-character listing cap.

## Not fetched, or not readable

- `https://code.claude.com/docs/en/doctor.md`: HTTP 404 (no such page; `/doctor` is documented in
  SK and CMD, which were read).
- `docs.claude.com/en/api/skills-guide` (Skills API requirements, which SK says validates skills
  outside Claude Code): not fetched. It may restate the 1,024-character limit.
- Codex models page: per-model detail cards for Astra, GPT-6.1 Terra and Luna are components
  with no context-window text in the Markdown twin; only the Sol sentence was readable.
- The Help Center article the models page links for "model availability, pricing, and usage
  limits" was not fetched.
- Large pages (SET, ENV, MC, errors) were searched by pattern and read around each hit, not read
  end to end. A combined-limit number phrased in words none of the patterns matched would have
  been missed.
- Nothing was verified by running either product.
