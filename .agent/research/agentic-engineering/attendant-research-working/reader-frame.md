# Reader frame (identical for every leg)

GOAL. Find every instance in your unit where the repository's owner caught something that agents had missed: a correction, a stop, a redirection, a "that is not what I asked", a question that exposed a wrong premise. Extract each instance as one ITEM in the exact shape below.

UNIT. One text file of excerpts. Each excerpt group starts with a line `##### <source path>`; the paragraphs under it were copied verbatim from that source file in the repository at /home/user/open-curriculum-ecosystem. Read the unit file in full with the Read tool. You may open a source file only when an excerpt cannot be understood without its neighbours; open at most five source files.

INCLUDE an instance only when the excerpt shows (a) what agents did or were about to do, and (b) the owner's correction of it. EXCLUDE: a preference the owner stated with no prior agent miss; a rule's general statement; agents correcting agents with no owner involvement.

RULES.
- OWNER_WORDS is copied character for character from the excerpt, a contiguous run of the owner's own quoted words, at most 300 characters. If the excerpt gives no quoted owner words, write NONE. Never paraphrase inside the quotation marks, never join two separate quotes.
- One instance appearing in several excerpts is one ITEM; list every source path.
- Do not classify by any scheme beyond the fields below. WRONG is plain description.
- Read-only. Run no shell commands. Write no files. Your final message is the only output.

ROW SHAPE. Exactly these lines per item, in this order, a blank line between items:

### ITEM
SOURCE: <repo-relative path>[; <second path>]
DATE: <YYYY-MM-DD, or unknown>
OWNER_WORDS: "<verbatim>" | NONE
AGENT_WAS: <what the agent or agents were doing or had done, one sentence>
WRONG: <what was wrong with it, one sentence, plain description>
ABOUT: <what the error was an error about: the piece of work itself | which step the work was at | the plan | whether it was worth doing | the larger purpose | how the owner's words were read | other: name it>
QUESTION: <the one question that, had the agent asked it of itself, would have exposed the error>
MOMENT: <the moment in the work at which that question should have been asked>
OWNER_NEEDED: <anything the owner asked to be shown, or had to ask for again, in order to decide; or NONE>

END. After the last item write one line: `EXCLUDED: <count of excerpts that held no instance>` and one line `UNSURE: <source paths where you could not tell, or NONE>`.
