# No Moving Targets in Permanent Docs

Permanent documentation (ADRs, PDRs, governance docs, principles,
testing-strategy, rules) must not embed values that drift over time.
Commit SHAs, deployment IDs, version numbers, count-of-something
figures, and other moving targets belong in ephemeral state
(plans, threads, comms, napkins, release notes) — not in the
permanent record.

## The Rule

When authoring on permanent-doc surfaces, name structural concepts,
not transient instances. The Edit/Write hook
(`.agent/hooks/policy.json` `preToolUseContent.scoped_blocks`)
catches 7- to 40-character hexadecimal tokens (with at least one
a-f character) at write-time. The deny payload surfaces the citation
*"Moving targets do not belong in permanent docs"*.

## In-Scope Surfaces

- `docs/architecture/architectural-decisions/`
- `.agent/practice-core/`
- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`

The spirit of the rule extends to other permanent-doc surfaces —
including rule files in `.agent/rules/` themselves — even when the
hook's literal scope does not list them.

## Excluded Surfaces (Why)

- `.agent/practice-core/provenance.yml` — provenance UUIDs are
  data, not prose.
- `archive/` — historical material; SHAs in past records are
  themselves part of the record.
- `fixtures/`, `/tests/`, `.test.ts` — test corpora.

## Hook Exclusions (And Why They Are Not The Rule)

The regex matcher applies three line-level exclusions before
detection:

1. **Fenced code blocks** (between ` ``` ` markers) are skipped —
   YAML/JSON examples and code samples that embed SHAs as *data*
   are intentional.
2. **Inline-code spans** (text wrapped in single backticks) are
   stripped from the line before the regex test — within YAML
   keys, embedded snippets, and similar code-shaped tokens.
3. **Lines containing `(historical reference)`** are skipped —
   citing a past commit SHA in narrative prose is permitted when
   the historical-reference marker is explicit.

**These exclusions describe what the hook does not block; they do
not describe the full reach of the rule.** A bare backticked SHA
in narrative prose ("commit `abc1234` landed X") slips through the
inline-code exclusion but still violates the rule's spirit — the
backticks treat the SHA as a code-shaped token, but the prose still
ties the doc's claim to a moving target. Author as if the hook were
stricter than its implementation.

## Hex-Class Caveat

The matcher uses `\b(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b`. The
lookahead requires at least one a-f character so pure-decimal
tokens (timestamps, large integer counts) do not trip the
matcher. SHAs always contain hex letters by their distribution;
decimals do not.

## Why

Three reasons:

1. **Permanent docs do not get re-edited often.** A SHA in an ADR
   ages silently. Months later, the SHA points at a commit whose
   context has shifted, and the reader has no signal that the
   reference is stale.
2. **The narrative gets tied to a snapshot.** A claim like
   "see `abc1234` for the canonical example" makes the doc
   dependent on `abc1234` continuing to be canonical. Any later
   refactor invalidates the doc without touching it.
3. **The right place exists.** Plans, threads, comms, and napkins
   are explicitly *ephemeral state* — they are read in their
   session-of-origin and rotated. Commit SHAs, timestamps,
   instance counts, and other transient values belong there.

## Citation Directionality: Permanent → Ephemeral Is Forbidden

Permanent docs (ADRs, PDRs, governance docs, principles,
testing-strategy, rules) MUST NOT cite plans, plan paths, plan
section identifiers, workstream identifiers, track-card paths, or
other ephemeral surfaces. Plans archive, get renamed, get split or
merged; a permanent doc citing a plan name becomes a dead pointer
the moment that plan archives.

The directionality is one-way:

- *Plans cite permanent docs* — plans reference ADRs, principles,
  rules, and PDRs as the source of truth they execute against.
- *Permanent docs do not cite plans* — they describe what changed
  and what reattaches when, self-contained, without naming the
  plan or workstream that produced the change.

This subsumes the SHA-specific framing under the broader
directionality principle. Same family of failure (permanent →
ephemeral citation), different granularities: SHAs, plan names,
workstream identifiers, track-card paths, and any other identifier
that lives in ephemeral state.

Owner sharpening 2026-05-05: *"plans are ephemeral! ADRs are
permanent. The ADRs are the source of truth, plans reference
THEM"*.

## What to Do Instead

| Impulse | Wrong move | Right move |
|---|---|---|
| "Reference the canonical example" | "see `abc1234` in `path/file.ts`" | Name the structural concept; if a worked example helps, code-fence it inline |
| "Cite the post-mortem incident" | bare SHA in prose | Date + a one-line summary; full SHA in the napkin archive |
| "Pin the version" | "v3.7.2 introduces…" | "the version that introduced X (see `package.json`)" |
| "Reference a commit for historical context" | bare backticked SHA | Add the explicit `(historical reference)` marker on the same line, so the citation is a deliberate audit trail |

## Doctrinal Anchors

- per-user feedback memory: `feedback_no_moving_targets_in_permanent_docs`
- PDR-044 §Innate immunity (write-time fingerprints)
- PDR-038 §2026-05-04 amendment (stated principles require structural enforcement)

## Pending Graduation

This rule is gated on a graduation pass that authors a permanent
PDR or ADR home for the *moving-targets-in-permanent-docs* doctrine.
The hook enforcement is live; the canonical doctrinal anchor will
land separately. Tracked on `pending-graduations.md`.

The hook/spirit gap surfaced above (inline-code exclusion is more
permissive than the rule's full reach) is itself a refinement
candidate — either tighten the hook to detect SHA-shaped tokens
even inside backticks when the surrounding context is prose, or
leave the hook as-is and rely on the rule for the stricter case.

## Source Landing

WS4 of `doctrine-enforcement-quick-wins.plan` (2026-05-04).
