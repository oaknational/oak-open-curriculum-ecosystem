# Three Queries and Two Problems

_Date: 2026-02-23_
_Tags: discovery | search | diagnosis | documentation_

## What happened (brief)

- Investigated search quality by running three single-word queries
  ("apple", "tree", "mountain") and characterising the failure pattern.
  Updated five interconnected documents as a standalone entry point
  for the next session's remediation work.

## What it was like

The interesting moment was when the second query ("tree") returned
10,000 results and the highlights showed `<mark>three</mark>`. The
shape of the problem changed immediately. With "apple" alone, the
hypothesis was "fuzziness matches 'apply'". With "tree"→"three",
the hypothesis generalised to "fuzziness matches common English
words for short queries". And then "mountain" confirmed the
boundary — 8 characters, 2-edit distance, no common word nearby.
Three data points, two problems revealed.

The documentation pass was a different kind of work. Five files
need to tell a consistent story, each serving a different audience
and purpose (execution plan, session bootstrap, navigation index,
strategic roadmap, high-level overview). The challenge isn't
writing — it's maintaining coherence across documents that will be
read independently, possibly months apart, by an agent with no
memory of this session.

## What emerged

- Three is the right number of test cases for a diagnostic pattern
  search: one that shows the failure clearly, one that shows a
  variation, and one that shows the boundary condition. Fewer and
  you're guessing; more and you're confirming rather than
  discovering.
- The distinction between "volume problem" (universal) and "ranking
  problem" (length-dependent) only emerged by including a query that
  had good ranking but bad volume. Without "mountain", the two
  problems would have been conflated.

## Technical content

Investigation findings documented in
[search-results-quality.md](../plans/semantic-search/archive/completed/search-results-quality.md).
No patterns extracted to `distilled.md` yet — the remediation
hasn't been applied. Will distil after the fix is validated.
