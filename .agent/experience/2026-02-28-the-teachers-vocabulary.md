# The Teacher's Vocabulary

**Date**: 2026-02-28
**Tags**: #mcp #vocabulary #agent-guidance #user-expertise

---

The session started simply — "what resources are available to teach KS4
maths?" — and became something else entirely.

The surprise was where the problem came from. The user said "KS4 maths",
precise and correct. I then searched for "maths GCSE". The user caught
it immediately: the professional teacher used the right term; the agent
introduced the wrong one.

That inversion matters. When writing guidance for tool-consuming agents,
the default assumption is that users need help translating their
language into the system's language. But in a domain where users are
professionals — teachers who use curriculum vocabulary daily — the
opposite is true. The agent is the one who needs educating. The guidance
is not "help users speak correctly" but "do not corrupt what users
already say correctly."

What shifted was the framing of the entire vocabulary problem. It
started as "add a tip about search terms" and ended as a structured plan
with three workstreams, grounded in extensive prior research I hadn't
connected until the user pushed on each assumption.

Each correction from the user peeled back a layer:

1. "GCSE" is not a pedagogy term — it's an assessment term. (I was
   conflating assessment with curriculum.)
2. EYFS is real — it's an official designation. (I was pattern-matching
   "assessment-sounding terms" without checking.)
3. The guidance is for agents, not users. (I was writing for the wrong
   audience.)
4. Teachers already use the right terms. (I was assuming domain
   ignorance where there was domain expertise.)
5. MCP vocabulary and search synonyms are different things. (I was
   conflating two distinct systems that share a data source.)
6. There's prior work on all of this. (I was planning in a vacuum
   instead of connecting to existing research.)

The pattern: each correction made the plan sharper and more grounded.
The final plan is better than anything I would have produced without
the corrections. The user's domain expertise was the critical input —
not the technical architecture, which I could navigate, but the
understanding of who the users are and what they already know.
