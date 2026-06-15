---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested processing through `oak-consolidate-docs`.
  The active file carries the conservation role, graduation pointers, and held
  validation entries. Falsifiability: if future napkin rotations add high-signal
  learning that has no stable permanent home, preserve it first and revise the
  envelope by substance rather than trimming the lesson.
---

## Shared-checkout and tooling gotchas (2026-06-09→12 window)

Operational gotchas still accumulating evidence:

- **Byte-compare against `origin/main` before classifying generated-file drift** — a
  long-lived branch lagging main reads as "new upstream drift" until
  `git show origin/main:<path> | diff -q - <path>` dissolves it.
- **Before arming a tool a rule names as canonical, check the LOCAL build's provenance
  against in-flight fixes to that tool** — a stale local build re-creates the very defect
  the fix addresses.
- **Package name ≠ directory name** — `pnpm --filter` takes the package name
  (`@oaknational/curriculum-sdk`), not the directory path.
- **For any MCP tool, check dispatch class + data provenance FIRST** (generated-vs-aggregated
  handler; live-API-vs-corpus) before designing its redesign.
- **Co-Authored-By trailers must land BEFORE the first push** — amending a pushed commit needs
  a blocked force-push; once merged the decision is forced.

## Don't pile new scope onto a plan pending its readiness review (2026-06-09)

A plan whose whole pending job is review → decision-complete → execution-ready
must not grow while it awaits that review — added scope makes the readiness review
certify a *moving target*. When new scope lands on a not-yet-ready plan (even
owner-directed), immediately fence it as a separate strand AND recommend splitting
it to its own plan so the review stays on the original scope. Pair with **small-PR
delivery**: "is it ready?" becomes "is each small unit ready?", never a mega-block
judgement. Planning-discipline candidate; sibling of
[[feedback_consolidate_estate_decouple_execution]].

## Split a candidate category before naming when it lumps a standard with a presentation concern

Classifying `oak-brand` + `oak-tone-of-voice` as one "org-voice" category would
have swept Oak's pedagogical/factual-rigour standards (evidence, provenance,
caveats) into branding. Rigour standards travel INSIDE capabilities; branding is a
capability in its own right. Routing: fold into the taxonomy plan's audit step at
promotion, then delete here.

## Coordination-surface compose discipline (2026-06-11 window)

- **Sweep the directed backlog (full inbox window since last sweep) immediately before
  composing ANY closeout, re-declaration, routing, or coordination text.** The compose
  moment is precisely when a peer's reply is most likely in flight: read-newest-only missed
  a grant, an owner-ratification relay, and a pre-grant in ONE session. After ANY watcher
  restart, the same sweep covers the gap window. Inbox verb, never `ls -t | head`.
- **Timestamps compare in UTC only — derive "now" with `date -u` FIRST.** Comms `created_at`
  (UTC) against file mtimes (local display time) manufactures phantom gaps: two independent
  successor-bootstrap misreads inferred a dead team / a retirement from a 1-hour display
  offset. Never infer liveness from mtime display time.
- **Coordination machinery scales with demonstrated need, never with role vocabulary**
  ("gatekeeper", "marshal") pattern-matched from past sessions — one relayed sentence about
  a peer's commit posture is not a summons for monitors or marshal apparatus (owner
  corrections, two seats, 2026-06-12). Lanes are largely independent; fresh `git status` +
  pathspec-scoped commits already cover collision safety.

## Curation enforcement and verifier lessons

- **During live parallel curation, verify named surfaces immediately before quoting
  or editing them.** Between-turn drift is normal; cheap proof is `git status` plus
  targeted greps/reads before citing state.
- **A green verifier with no extraction count proves nothing.** Shell loops
  (especially zsh over multiline variables) false-green by checking no inputs;
  verifiers that enumerate files/links must report the count before their result is
  trusted.
- **ANY literal control character in source is a review/verification hazard — write
  escape sequences, never literal bytes.** A literal 0x1F separator was invisible in
  diff, grep, sed, AND reviewer rendering (2026-06-10, event 4fd66dc5); an Edit-tool
  write MATERIALISED an escape sequence into a literal 0x1F (2026-06-11, event
  f305c720). The Read tool renders ESC invisibly, so a Write composed from read
  context carries REAL ESC bytes into literals — check idiom with `cat -v` whenever
  editing files whose literals encode control characters, and run the byte check
  after writing escape-bearing code. Edit anchors on control-byte lines fail —
  re-anchor on adjacent clean lines. `od -c` or an empirical probe is the tiebreaker.
  Structural gate-tier cure is a due register item.
- **RED-first disproof before fixing a reviewer-predicted misbehaviour.** When a
  finding predicts concrete wrong behaviour, write the test FIRST and demand RED; an
  unexpected GREEN refutes the finding (and once refuted both a reviewer and the
  author's own confirming grep).

## Consolidator disciplines (2026-06-11→12, twice-proven family)

- **An item's recorded `target:` field outranks the consolidator's synthesis convenience** —
  four of seven proposed folds misrouted by invented targets; the verifiers caught it by
  reading the field the consolidator had written past.
- **An owner confirmation obtained on unverified claims is not authority once the claims
  fall** — surface the revision; never hide behind the confirm.
- **A reporting agent's self-classification of its own defect is input to adjudicate, never
  a verdict to ratify**; identity anomalies during handover are P1, never deferred-notes.
- **Research whose conclusion contradicts a pending/ratified decision in ANOTHER thread
  needs an explicit cross-thread surfacing step** — a filed report does not flow into
  sibling decision threads by itself (the structuredContent-only rediscovery, ten days).

## Operational gotchas (2026-06-11→12, single-instance unless noted)

- **zsh does not word-split unquoted `$VAR`** — `set -- $CYCLE` passes empty args; one
  value per state file, or `${=VAR}` if splitting is genuinely wanted.
- **BSD `sed -i ''` creates transient `.!nnnnn!file` siblings that race directory
  watchers** — pause or expect-noise on watchers before in-place sweeps over watched dirs.
- **Forename-keyed /tmp filenames collide across same-forename agents** — use
  identity-qualified temp names (`<forename>-<surname-word>-<purpose>-<date>`).
- **Locate the live config surface before editing or delegating harness config** —
  project settings override user-global; a platform subagent that only knows user scope
  edits the wrong surface (statusline instance, owner-caught).
- **Landing a new skill is two-gate, possibly owner-keyed** — canonical + generated
  adapters, THEN a `Skill(<name>)` + `Skill(<name>:*)` permissions pair in
  `.claude/settings.json`; the harness may block the agent's own settings edit as
  self-modification (by design — an explicit owner authorisation moment).
- **Audit your own search filters** (three instances) — `rg` single-line misses multi-line
  Zod/fluent chains (`rg -U`), a `-v .test.ts` exclusion hid a real importer, and a PR-merge
  watcher matched a hyphenated branch-name guess against an underscored real branch
  (silent never-fire; verify the filter against the live referent at arm time, or match
  separator-insensitively `[-_]`); sweep filters are part of the claim.
- **Verify each reference's REFERENT before bulk renames** — same-number-different-referent
  is exactly what a renumber-collision window produces (ADR-195 main vs naming branch).
- **Recency-of-reversal is a free stability signal on decision inputs** — an input that has
  ALREADY reversed once is likelier to reverse again; check reversal history before
  fast-executing a freshly-recorded decision.

## Owner-handed input is still input-to-verify

Owner-TRIGGERED generation is not owner-VERIFIED content; the input-to-verify posture is
unconditional on provenance (worked instance: /team-onboarding report facts folded on
memory-corroboration, owner-caught mid-fold). Sibling: template fidelity never outranks
faithful reporting — a vendor skill template demanded the exact line "Saved to
`ONBOARDING.md`" after the owner had redirected the artefact; the canned line was adapted
to the real path.

- **Check for a state-reset before causally attributing a metric change** (source: 2026-06-13
  comms-corpus session). When a host/system metric moves sharply (swap, load, event counts), check for a
  reset — reboot/`uptime`, fresh checkout, re-derivation window — BEFORE attributing it to a behavioural
  cause; a reset is the dominant confound. Corollary: enumerate counts from primary evidence, never carry
  a source's self-reported count. Both are instances of: a convenient causal claim that supports your own
  thesis needs the dominant confound checked, not just a caveat.

- **A CLI flag exists only when the DISPATCHER accepts it — test that tier, purely** (source:
  statusline session-shape WS1, Monsoon guards Cirrus; recovered + cure-corrected 2026-06-13). A flag
  registered at the parse layer (`KNOWN_OPTION_KEYS`) with green unit tests over parse+construct proves
  nothing about invocability: per-command specs (`cli-spec-options.ts`) are a second, dispatch-time
  allowlist invisible below the dispatcher entry point. `claims open --role` was unit-green yet
  live-failed on exactly this gap (2026-06-12). Test the dispatch allowlist at a PURE seam — the
  exported `unknownValueOptions(options, spec)` over the real parser + command spec, with NO IO. (The
  lesson originally shipped an IO temp-registry integration test as the cure; that was removed per
  testing-strategy and re-expressed IO-free 2026-06-13 — see `cli-dispatch-allowlist.unit.test.ts`.)

- **In long, high-volume analytical/research work, self-monitor for NARROWING and
  OVER-CLAIMING, and adversarially verify your OWN synthesis** (source: 2026-06-15
  plan-estate survey; took ~5 owner re-framings to catch in-flight). Deep multi-turn
  analysis drifts under its own momentum — a newer/narrower artefact captures the frame,
  and confident self-synthesis reliably over-states. Two habits, self-applied on a cadence
  rather than waiting for the owner: (a) re-ask *am I still answering the BROAD question at
  the right altitude? has the newest/most-concrete input captured the frame? am I
  over-claiming?*; (b) run an independent + adversarial pass on your OWN conclusions before
  presenting them as settled, and report what it DENTS — a refuter pass overturned 4 of 6
  of this session's synthesis claims. A validated map is valuable even when it re-derives a
  known verdict — don't sell re-derivation as discovery. Siblings:
  [[premature-crystallization]], [[fluency-is-a-failure-vector]]; verify-dont-trust turned
  on one's own synthesis, not just external inputs.
