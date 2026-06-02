---
name: "EEF Value-Path Re-validation on the New Graph Tools"
overview: "Seed for a follow-on plan: when the new graph-corpus-sdk replacements for the live Oak graph tools (misconception, prior-knowledge/prerequisite, threads) land, re-validate the EEF value path against them. The teacher cover-lesson plan proves the value path (D7) against the Oak graph tools that are live today (get-misconception-graph, get-prior-knowledge-graph); this plan re-runs that proof once those tools are replaced by their graph-corpus-sdk versions, so the EEF value path is not silently broken by the substrate migration. Building the replacement graph tools is owned by the knowledge-graph-integration estate, which is currently being reviewed and rewritten; this seed is created clean on the EEF side now and will be deduplicated against that estate once it settles."
type: seed
status: future
thread: eef
related_plans:
  - "../current/eef-graph-tool-completion.plan.md"
isProject: false
todos:
  - id: track-graph-tool-replacements
    content: "Track the knowledge-graph-integration estate's replacements of the live Oak graph tools (misconception, prior-knowledge/prerequisite, threads) with their graph-corpus-sdk versions: name the exact replacement tools and their landing signal. The estate is being rewritten, so this is a tracking-and-dedup todo, not a re-specification; if the rewrite drops a replacement the EEF value path depends on, escalate it rather than silently absorbing the build here."
    status: pending
    depends_on: []
  - id: revalidate-eef-value-path
    content: "Once the replacement graph tools are live, re-run the EEF value-path proof (the D7 Sunday-night cover-lesson round trip) against them: the agent surfaces a pedagogical signal via the new graph tools, queries the EEF tool, and the known strand's exact corpus values reach the assistant-facing payload verbatim with caveats and non-claims intact. Confirm the Oak/EEF workflow seam still closes on more than one signal type with the new tools."
    status: pending
    depends_on: [track-graph-tool-replacements]
---

# EEF Value-Path Re-validation on the New Graph Tools (seed)

## Why this plan exists

The teacher cover-lesson plan
([`../current/eef-graph-tool-completion.plan.md`](../current/eef-graph-tool-completion.plan.md))
proves the EEF value path (D7) against the Oak graph tools that are **live
today** — `get-misconception-graph` and `get-prior-knowledge-graph` (aggregated
universal tools), plus the Oak API/search tools. Those tools surface the
pedagogical signal that the EEF evidence attaches to (the Oak/EEF workflow seam).

The knowledge-graph-integration estate is replacing those tools with new
graph-corpus-sdk versions. When the signal-producing tools change, the EEF value
path must be re-validated against the replacements — otherwise the substrate
migration could silently break the seam the teacher value depends on.

## Scope

- **In scope:** re-validate the EEF value path (a D7-style round trip) against
  the new graph-corpus-sdk replacements of the live Oak graph tools, once those
  land.
- **Out of scope:** building the replacement graph tools themselves — owned by
  the knowledge-graph-integration estate (currently being reviewed and
  rewritten). This seed tracks that work and is deduplicated against it once the
  estate settles.

## Dependencies

- The EEF MCP surface from the current plan (D6) and its value proof (D7).
- The replacement graph tools from the knowledge-graph-integration estate; this
  plan cannot start until they are live.

## Note on deduplication

Created as a clean EEF-side seed while the graph estate is in flux, so it does not
point at plans that are being rewritten. Refine and deduplicate against the
settled graph estate later.
