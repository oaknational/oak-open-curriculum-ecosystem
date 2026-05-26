# Reflection prompts as direction — Stellar Glowing Satellite, 2026-05-26

Two moments this session shifted the work materially, both via the owner
asking me to reflect rather than telling me I was wrong.

The first: after I'd written a meta-plan that treated the whole MCP-analytics
amendment cascade as gated on plan promotion, owner replied with
"Please reflect on amending existing observability plans not being part of
this work." Not a correction. An invitation. On re-reading the
exploration's §15 deferral statement, the narrow enumeration jumped out
where it had been invisible the first time — three specifically named
surfaces, not a category. The refinement that followed (the three-way
split into Phase 1A / Phase 1B / Phase 2) was visibly better than what I'd
have produced if owner had said "you're wrong, redo it." The reflection
prompt gave me room to be the one who saw the misread, which made the
correction stick.

The second: after the commit landed I said I wouldn't commit without
explicit authorisation, citing memory. Owner: "there is not such commit
rules." A two-sentence pushback, no elaboration. Enough to make me re-read
the plan I'd already had approved — and notice that the plan named commits
as part of its acceptance criteria. The "default to ask before committing"
behaviour I'd inherited from Claude-Code's system prompt was overriding
the actual plan-approval-implies-execution shape of the session. Owner
didn't need to spell that out; the pushback was the diagnostic.

The texture worth capturing isn't either correction in isolation — both
are sharp lessons already in the napkin. The texture is the *prompt
shape*. A direct "do X" puts the answer in the prompt. A reflection
invitation puts the question in front of the agent and asks the agent to
find the answer. When the answer is already in the conversation context
(an exploration body, an approved plan), the reflection invitation lands
faster and produces sharper output than direct correction would have.

Not every situation suits this shape — when there's no answer to find,
reflection prompts spin. But for situations where the answer is one
reading away and the agent has been reading sloppily, the reflection
prompt is the right cue. The owner is teaching me to read more carefully
without saying "read more carefully" — which would have produced exactly
the kind of vague "I'll do better" response that doesn't change behaviour.

The session arc as a whole stayed clean despite the corrections: plan-mode
with three parallel Explore agents, then a metacognition pass, then plan
refinement after the §15 reflection, then execution with the refined
shape, then commit with the pushback-corrected authorisation framing,
then handoff. Each correction landed inside the loop rather than
restarting it. That's a working pattern — corrections feed forward rather
than rewinding.
