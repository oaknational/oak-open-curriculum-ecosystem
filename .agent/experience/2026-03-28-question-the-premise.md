---
date: 2026-03-28
session: Phase 8 follow-up remediation
theme: questioning premises before solving problems
---

# Question the Premise

The most productive moments in this session were when the user asked
"why would we switch to JWT?" and "how much time have we wasted?" These
questions cut through hours of investigation by challenging whether the
problem existed at all.

The DI simplification, logger consolidation, and type assertion elimination
were clean, well-reviewed work. The RFC 8707 spike was not — it designed
a solution for a non-problem because nobody checked what tokens the system
actually uses in production.

The difference: the productive work started with "what does the code do?"
(read the interface, count the mocks, trace the assertions). The wasted
work started with "what does the reviewer say is wrong?" without verifying
the premise.

Reviewers are valuable, but their findings are hypotheses about the code,
not facts about the system. The fact about the system is in the test
fixtures: `oat_test_access_token`. One grep would have closed the RFC 8707
item in five minutes.
