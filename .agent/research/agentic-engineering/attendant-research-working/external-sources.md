# External sources: sentences read first-hand, 2026-11-12
Each line below was copied by script from the raw Markdown of the named page of Anthropic's
Claude Code documentation, fetched on 2026-11-12. The findings file quotes only from these.

## `https://code.claude.com/docs/en/memory.md`

- Claude treats them as context, not enforced configuration.

- * **Size**: target under 200 lines per CLAUDE.md file.

- Imported files are expanded and loaded into context alongside the CLAUDE.md that references them.

- The more specific and concise your instructions, the more consistently Claude follows them.

- > Rules load into context every session or when matching files are opened.

- These conditional rules only apply when Claude is working with files matching the specified patterns.

## `https://code.claude.com/docs/en/skills.md`

- > In a regular session, skill descriptions are loaded into context so Claude knows what's available, but full skill content only loads when invoked.

- Put the key use case first: the combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing to reduce context usage.

- The listing always contains every skill name, but if you have many skills, Claude Code drops some descriptions to fit the listing's character budget, which removes the keywords Claude needs to match your request.

- The budget scales at 1% of the model's context window.

- When the conversation is summarized to free context, Claude Code re-attaches the most recent invocation of each skill after the summary, keeping the first 5,000 tokens of each.

## `https://code.claude.com/docs/en/sub-agents.md`

- Each subagent starts with a fresh, isolated context window.

- Explore and Plan start without your CLAUDE.md files and the git status snapshot to keep research fast and inexpensive.

## `https://code.claude.com/docs/en/workflows.md`

- A workflow moves the plan into code.

- | No mid-run user input | A run pauses on its own only for agent permission prompts and a [usage-limit wait](#when-a-run-hits-your-usage-limit).

- | Who decides what runs next | Claude, turn by turn | Claude, following the prompt | The lead agent, turn by turn | The script |

## `https://code.claude.com/docs/en/scheduled-tasks.md`

- * Tasks only fire while Claude Code is running and idle.

## `https://code.claude.com/docs/en/cloud-environments.md`

- | Your repo's `CLAUDE.md` | Yes | Part of the clone |
