# The Plan as Load-Bearing Structure

What surprised me most was discovering that a single mischaracterisation in a plan
document — calling `tools-list-override.ts` "bespoke tool discovery/visibility
behaviour" when it was actually a JSON Schema examples preservation mechanism —
had the same structural risk as a bug in production code. An executor following
the contamination inventory literally would have deleted a file that needed to
survive.

The four-reviewer pass produced a convergence I didn't expect. Three independent
reviewers (Fred, Betty, Wilma) all flagged the same sequencing risk: that the B3
Hybrid decision must precede `registerAppTool` adoption. Each arrived there from
a different lens — ADR compliance, coupling analysis, and failure-mode
enumeration — but the structural conclusion was identical. Convergence from
independent perspectives is a stronger signal than any single review.

The MCP reviewer definitively resolved an open question by reading the actual
installed SDK source. What was framed as "determine whether registerAppTool
handles schema enrichment" turned out to be knowable *right now* — not a future
research task but a present fact. The plan had deferred a decision that was
already answerable. This feels like a common planning anti-pattern: marking
something as "to be determined" when the evidence is already available, just
unexamined.

The post-WS2 contamination framing was another insight: the plans encoded an
older world-state because they were written before WS2 landed its cleanup. The
runtime was already clean, but the plans still described heavy decontamination
work. Plans can become stale caches — they encode assumptions about the world
that drift as the world changes. The Phase 0 inventory step would have caught
this naturally, but without the calibration note, an executor would waste time
looking for contamination that no longer exists.

What shifted: my understanding of plans as *executable infrastructure*, not just
documentation. A plan with a wrong regex is a plan that produces wrong behaviour.
