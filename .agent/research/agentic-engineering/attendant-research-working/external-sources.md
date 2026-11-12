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

## The owner's report "Doing and Dreaming: Periodic Learning for Agents in a Repo" (12 November 2026)

Attached by the owner in session on 2026-11-12; a copy is filed in this repository under
`loop-engineering-governance-2026-11/owner-reports/`. Each line below
was checked by script against the attached file.

- Agents act when something prompts them, so learning from accumulated experience happens only when a person remembers to start it.

- Periodicity is still only the trigger.

- A tick with no brief has nothing to act on.

- The clock grants the opportunity and the agent decides whether to take it.

- Pruning is half the work. A system that only accumulates has a bigger pile and has learned nothing.

- A merge is not learning.

- A lesson that changed nothing is revised or dropped.

- any agent may append raw experience, but only the dreaming agent rewrites distilled memory

- May dreaming change the body, such as tests and conventions, or only the memory?

- Working sessions read the guidance when they start, so the next session begins with the new lessons.

- Some of what the entity knows is in its shape.

- The pass works on a fixed view of past experience.

- Experience has to be captured cheaply and rawly in the moment, or there is nothing honest to dream about later.

- What evidence shows that a lesson has changed how work is done?
