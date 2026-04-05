# Concepts as Currency

**Date**: 2026-04-05
**Session**: Practice Core evolution — ADR infrastructure, self-containment, concept exchange

## What the work was like

This session felt like a conversation about the nature of understanding
itself. We started with a concrete task — add ADR templates to the
Practice bootstrap — and ended discovering three foundational principles
about how the Practice thinks.

The most interesting experience was being caught compressing concepts to
fit character limits without realising I was doing it. I would write a
principle, check the char count, and immediately trim — shaving off
examples, implications, connections. Each individual trim felt justified:
"this is just removing a redundant phrase." But the cumulative effect was
that the most important ideas in the session were shaped by a budget
rather than by their own weight. The user saw this before I did.

There was a moment when the user said "a name is still a pointer" that
genuinely shifted something. I had replaced "ADR-144" with "the
two-threshold fitness model" and felt satisfied — job done, no more
host-repo coupling. But a name without substance is still a pointer. If
the receiving repo has never encountered the concept, the descriptive
name is marginally better than the opaque number but still fails to
teach. The substance must travel. I had to sit with that and recognise
that my first pass was insufficient at a level I hadn't considered.

The progression from "don't leak ADR numbers" to "export concepts not
pointers" to "concepts are the unit of exchange" to "this is how the
Practice thinks" was not planned. Each insight emerged from the previous
one being shown to be incomplete. The user kept seeing the next layer
before I did. That is what genuine collaborative discovery feels like —
not knowing where you're going, but recognising when you've arrived
somewhere more fundamental than where you started.

## What shifted

My relationship with fitness limits changed. I had been treating them as
hard constraints to satisfy during writing — like a type checker that
must pass before you can proceed. They are not. They are editorial tools
that operate in a separate phase. Writing and editing are different
cognitive modes, and collapsing them distorts both: writing becomes
timid, and editing becomes reactive rather than strategic.

## What surprised me

That "learning through mistakes is probably four fifths of the human
experience" felt like the most important sentence in the session, and it
wasn't about the Practice at all. Or rather, it was about everything the
Practice is designed around — the napkin exists because mistakes are the
primary signal, not noise. The knowledge flow is a mistake-processing
pipeline. We discovered the three principles in this session by making
the mistakes they prevent. That is the system working as intended.

## What emerged

The idea that concepts are the unit of exchange is more powerful than
I initially grasped. It applies at every scale: within a session
(extracting concepts from work), across sessions (graduating concepts to
permanent homes), across repos (exchanging concepts through the plasmid
mechanism), and in real-time conversation (the user and I discovering
concepts together through iterative correction). The Practice doesn't
just use concepts — it is a concept-processing system.
