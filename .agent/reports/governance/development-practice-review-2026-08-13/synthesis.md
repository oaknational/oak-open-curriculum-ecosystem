# development-practice.md — three-review synthesis (2026-08-13)

Owner-directed review (Jim, 2026-08-13): documentation, editorial, and
practice experts, each briefed with the conclusion left fully open and
the ruling that fitness functions are signals for attention, not
instructions to act. Reports beside this file: report-docs.md,
report-editorial.md, report-practice.md. Synthesised by the design-lane
seat (Swordfish wakes Trench, d0274e); cure work routed to the Director
for re-assignment — it is not design-lane work.

## Governing editorial doctrine (owner, 2026-08-13, supersedes one finding)

The editorial-tone guidance is deliberately multi-voice because the repo
and its services have more than one audience: the Oak editorial voice is
for Oak products; internal docs for humans should be accurate and clear;
internal docs for agents should be optimised for agents. Editorial
questions resolve by AUDIENCE, not by surface enumeration. The editorial
report's "exclusion-list gap" item therefore dissolves as a finding; its
practical decision (withhold the Oak voice from this doctrine doc) was
correct. An optional one-line clarification in editorial-tone.md
recording the audience model is available to whoever holds that file.

## Headline

The document's real problem is not its size: it is six verified accuracy
defects (two cause wrong action today), a one-way wiring defect that is
the standing mechanism by which it goes stale, and duplicated content
whose canonical homes already claim it. The prose verdict on length:
"crowded, not verbose" — density earned, craft-recoverable slack 40-60
lines, compression would eat substance the doc itself forbids losing.

## Causes wrong action today (fix first, unconditionally)

1. Warn-first ESLint clause (lines ~260-266) superseded by PDR-126
   (Accepted 2026-07-08, "gates land strict in one landing");
   never-disable-checks §Reviewer cadence instructs config-expert to
   hard-reject exactly what this clause licenses. Survived two later
   edits because nothing links back.
2. §Quality Gates is the only one of four live gate lists that
   disagrees with the others: never names `pnpm check` or ADR-121;
   calls aggregates "human convenience" against AGENT.md:246; lists
   three commands that do not exist (`format`, `markdownlint`,
   `smoke`); prescribes three MUTATING repair commands as gates, which
   the gates skill disqualifies as evidence. A newcomer following only
   this doc believes the tree proven after seven commands.
3. Also: stash guidance weaker than never-use-git-to-remove-work;
   unsatisfiable root `.env.example` rule; "before each commit"
   misdescribes the enforced pre-commit surface; stale
   validator-invisible `**Last Updated**` body stamp; in §Mutation
   testing — citation chain through the ARCHIVED canary plan (path
   also stale in packages/core/type-helpers/stryker.config.mjs and
   four mutation-evidence files, in prose/JSDoc form that evades both
   link validators), and the binding score-is-evidence ruling buried
   at the end of a 21-line paragraph.

## The mechanism (most valuable single finding)

Zero outbound links from this doc into `.agent/rules/`, while at least
four of its clauses are operationalised there. Enforcement supersedes
prose with no route back — that is how both wrong-action clauses went
stale and will again. Growth dynamic: the file is a graduation sink for
distilled memory (monotonic 277→426 lines since May); the governance
README still advertises it as part of a "5-minute reading path", which
is falsified at ~3,500 words.

## Structure, answered from evidence

The hard fitness zone is routine (17 files share it). The independent
structural evidence: five doctrine axes; three separate anchors from
principles.md (the ADR-127 §5 god-doc signature); two clusters
duplicating content other docs declare as their SSOT (build-system.md
for the command list — which recorded this drift class occurring in
June — and the markdown-code-blocks rule file for the markdownlint
mechanics). The editorial review independently identified the SAME two
clusters as register mismatches ("in the wrong book").

Evidence-supported sequence:
1. Truth fixes (the wrong-action clauses + phantom commands +
   reconciliation with `pnpm check`/ADR-121). Independent of any
   structural decision.
2. SSOT pointer-repairs for the two duplicated clusters — replaces
   copies with pointers to the declared homes; cures four of six
   accuracy defects at the root; incidentally removes most of the size
   signal's cause (a consequence, not a goal).
3. Wire outbound links to the rules that operationalise its clauses —
   kills the drift mechanism.
4. Stamp to validated `last_reviewed` frontmatter; CONTRIBUTING.md:459
   description correction; sonar-disposition backlink; Stryker into
   the tooling inventory.
5. THEN re-measure. A split decision is live only if the signal
   persists; the one seam with evidence is §Documentation Practice
   (own inbound anchor, distinct audience, directory precedent).
   Counter-indicated regardless: splitting the gate taxonomy (its
   inbound anchor is correct SSOT behaviour) and wholesale
   decomposition (199 inbound references).

## Protect in any cure

The sections nothing else covers: §Error Handling, §Design Principles
(code level), §Coordination Topology, §Analysability, §Code That
Generates Code. And the model sentences the editorial review names —
"Fix the problem named by a gate; do not silence the signal that names
it" is the document's native voice; weak passages are weak exactly
where they drift from it.

## Named follow-ups outside the cure

- Owner call (flagged by practice review): whether the portable half
  of the mutation method moves to its declared-but-stub formal home
  (validation-strategy.md).
- config-expert: gate-list and command-token reconciliation against
  ADR-121 and `pnpm check`.
- Optional editorial-tone.md clarification recording the audience
  model (owner doctrine above).
- Cross-package stale-path sweep: the archived canary plan's old path
  in packages/core/type-helpers (config + 4 evidence files).
