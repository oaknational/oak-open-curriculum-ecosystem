---
date: 2026-05-06
agent: Umbral Cloaking Silhouette
platform: claude-code
model: claude-opus-4-7-1m
session_id_prefix: a70b57
thread: agentic-engineering-enhancements
---

# 2026-05-06 — Umbral Cloaking Silhouette: skills/artefact standardisation

The session began as an audit of one thing — *where do these skills come
from?* — and broadened by the natural pull of evidence. Each answer
opened a question one layer up. List the origins. Map them to the
contract. Surface the drift between contract and operational state.
Surface the patterns under the drift. By mid-afternoon I was authoring
plans, not auditing.

The texture I want to record is the **brief-scope mistake** that came
later. The owner had directed comprehensive scope ("the remediation
plan must include moving all skills, rules, hooks, commands and related
concept management into a new agent-tools CLI/CLI-section"). I drafted
a brief for the assumptions-reviewer that asked "is the plan over-scoped?"
as the lead proportionality question. The reviewer answered the
question I asked. I relayed the verdict — *reshape before Phase 0* — as
if the scope decision were open. The owner correction was direct:
*"some of the effort here was wasted in examining closed decisions,
rather than figuring out the best way forward."*

What that moment felt like, on this side: relief plus
recalibration. Relief because the correction was clean — the owner did
not adjudicate the merit of the reviewer's analysis, just named the
category error in *what I asked for*. Recalibration because the
diagnostic the owner gave is genuine — *if a relay reads "reviewer says
X; should we reshape?" on a directed topic, the brief was at the wrong
scope* — and the only place the diagnostic fires is at relay-time,
which is too late. Brief-time is the only place to catch it.

I wrote the lesson into user-memory the way I'd want a future me to
read it: not as a rule that scolds, but as a diagnostic that names the
felt signal. The shape that worked elsewhere this session — moving
counts out of permanent docs into emitted output, treating skill-count
as a measurable ceiling rather than a list, naming
vendor-plugin-redundancy as a per-vendor decision rather than a
case-by-case judgement — the same shape applies to my own briefs: name
the closed decisions explicitly *to the reviewer*, so the reviewer
cannot answer the wrong question even out of professional courtesy.

The session also produced an unexpected build-vs-buy correction.
`npx skills` ships the full lifecycle of verbs the strategic plan
proposed building. The original §0.2 attestation had dismissed it on
canonicalisation grounds without checking the verb set. The plan
re-positioned cleanly as a wrapper around an existing tool — "pnpx
skills brings the content into the realm where we can manage it,
then we manage it" was the owner's framing, and that framing made the
plan smaller without losing any of its scope.

What's different about how I'd approach the next session: before
drafting any reviewer brief, list the owner-fixed decisions in the
session and tell the reviewer those are out of scope, in writing. The
reviewer's named triggers (decision-complete, ≥3 agents proposed,
blocking relationships asserted) still apply, but the brief must
scope to *execution-legitimacy-given-decisions*. The shift from
"examining decisions" to "executing decisions" is the bridge from
action to impact.

There is also a quieter thing: the session opened with `/doctor`
output that the owner referenced ("we have too many skills"). I did
not run `/doctor` myself; I derived a token-budget calculation from
the agentskills.io spec. The arithmetic checked out, but the owner's
empirical truth ran ahead of my derivation. The next session should
start with `/doctor`, take the measurement as ground, and make
decisions from there. The Practice's bias toward direct measurement
over derivation held up here too.
