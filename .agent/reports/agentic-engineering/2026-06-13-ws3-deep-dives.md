# WS3 deep-dives — Myrtle's half (B substrate-credibility, D commit-concurrency, M2)

Companion to `2026-06-13-ws3-failure-mode-taxonomy.md` (the catalogue). This is the deep
analytical treatment of the three areas Myrtle owns in the WS4 split (owner-directed deep write-up,
2026-06-13). The catalogue gives every class a one-paragraph entry; here each load-bearing finding
gets mechanism, ≥2 worked instances (event ids FH-verified by the author), cure-shape (with
activation-enthalpy framing where the behaviour is emergent/steerable), a doctrine-vs-note verdict
with reasoning, and routing. Three lenses throughout — failure / what-worked / emergent-steering —
because the research is explicitly not a find-and-fix pass. Verification status uses the catalogue's
labels (FH / ADV / HARVEST(n)).

## The spine claim: the corpus's structured layer is dead; its prose layer is partly unsound

The single most consequential thing the corpus reveals about itself is **substrate-credibility**: the
team's coordination ran on a layer the schema did not model, and that layer is partly fictional. This
reframes how every downstream consumer (WS2 linkage, the rotation strategy, any analytics) must treat
the corpus — and it is the deepest "we did not expect this" of the research.

### SC1 — Schema-affordance atrophy, and its causal root (FH, corpus-wide, DOCTRINE)

**Mechanism.** The comms-event schema models a reply graph (`in_response_to`, `in_reply_to`),
addressing (`audience`, `addressed_to`), and a lifecycle event kind. Across the **entire 5,122-event
corpus these are used zero times** — not "rarely", zero. I verified this first-hand with a full scan,
not a sample. The team threaded conversations, addressed peers, and signalled lifecycle transitions
entirely through **prose conventions**: event-id citations in bodies, "Name —" address prefixes,
title genres ("Team start report", "Heartbeat:", "Marshal-cycle complete").

**Causal root (FH, `1e2c83eb` / `ec86492e`).** This is not "agents chose not to use the fields." The
affordances were **unreachable from the authoring tool.** Both `1e2c83eb` (Charcoal) and `ec86492e`
(Ashen) are themselves failure-mode events whose bodies state, verbatim, "Tag field not set on event
because `comms send` CLI does not yet expose `--tags`." The CLI that agents author through did not
surface the schema's affordances. The `--tag` flag landed mid-corpus (a partial fix — hence SC9's
stratigraphic boundary, ~167 untagged heartbeat events before it); the threading/lifecycle/addressing
fields **never** got an authoring path, so they read 0 corpus-wide including in the most recent
events. Schema governance (PDR-066/ADR-183 tags; the lifecycle shape) was disconnected from the
authoring surface.

**Worked instances.** (1) `ced9997b` is a Director pre-positioning event that *instructs* the
successor to acknowledge via `in_response_to` per PDR-064; the acknowledgement `41475bf9` does not
carry the field — doctrine mandated a field the tool could not write. (2) The 15 distinct model-string
spellings in the identity tuple (FH: `claude-opus-4-7`/`opus-4.7`/`Opus-4.7`/… ; `Fable 5`/`fable-5`/
`claude-fable-5`) are the same disease one layer over — a schema field populated by an un-canonicalised
authoring path.

**Lower-bound corollary (load-bearing).** Because failure-mode tagging was unreachable for a swathe of
the corpus, the 41 failure-mode-tagged events are a **lower bound** on the true failure population.
Untagged failure-modes-in-prose exist and are only reachable by reading (`1e2c83eb`, `ec86492e`,
`c7fba7db` are three). Any tag-based census under-counts; the disposition ledger states this.

**Cure-shape.** This is a tooling gap with a clean structural cure, not a behaviour to nudge: either
(a) wire the affordances into the authoring CLI and enforce at the write boundary (so doctrine that
mandates `in_response_to` can be honoured), or (b) **remove the unused fields from the schema** — an
affordance that is structurally unreachable and 0%-used is a standing liability that misleads every
analyst who assumes it carries signal. The decision (enforce vs remove) is an owner/architecture call;
the research's job is to make the 0/0/0/0/0 fact and its causal root undeniable. **Routing:**
comms-event write-integrity + the rightsizing keystone M4.

**Verdict: DOCTRINE-GRADE.** It is corpus-wide, FH, causally explained, and it changes how the corpus
must be read.

### SC2 — Citation theatre: the prose threading layer is partly fictional (FH, RARE, triple-attested)

**Mechanism.** With the structured reply graph dead (SC1), prose event-id citation is the *only*
threading mechanism. The research asked: is it trustworthy? Answer: mostly, but with a real fictional
minority, and the honest prevalence matters.

**The discipline story (this is itself a finding).** Katydid relayed a cold reader's claim that "a
chunk" of citations are fictional, framed as the highest-value spine finding. I declined to accept it
on relay (twice second-hand) and scanned first-hand: only one literal placeholder in my initial pass.
Katydid then tried to settle it with a corpus-wide UUID-resolution scan, which reported **93.7% of
cited full-UUIDs "dangling"** — apparently damning. Debugged first-hand, those dangling UUIDs are
`claim_id`s, PDR-027 agent `id`s (the `-5xxx-` v5 version nibble is the tell), `intent_id`s, and
commit UUIDs — **not fictional event citations** (`9a666480`, FH, is a live closed-claim id). The
metric's own simplification manufactured a phantom signal — **a live instance of A6, inside the
failure-mode research itself** (see M2's sibling). Both researchers then FH-converged.

**Worked instances (FH).** Literal unfilled placeholders shipped in final events: `bfa99e61`
("[ID-of-shaded-event]"), `357d04ff` ("[shaded broadcast id]"), `3f51b45a` ("[id at 15:25:12Z]"),
plus ~6 `<intent-id>` template residue — **~10 genuine instances across 5,122 events.** Phantom
citations resolving to no event-id: `9a1ac1`, `0a82e1` (FH: neither matches any id-prefix). R1's
corroboration verifier independently confirmed the corrected picture (its 9 unresolvable tokens are
claimed commit SHAs; 49/49 findings confirmed) — so **triple-attested** (my FH + Katydid FH + R1
verifier).

**Sharpened joint finding.** Event→event threading **barely happens by any mechanism**:
`in_response_to`=0 AND genuine prior-event citation is a minority of body references (~1,861 of ~5,894
8-hex tokens resolve to event-id prefixes; the rest are SHAs / claim / agent prefixes). Katydid's WS2
"~1,835 citation edges" over-counted event→event threading and is being corrected.

**Cure-shape (activation-enthalpy).** Citation theatre is rare enough that a mandate is the wrong tool.
The emergent driver is that *writing a plausible-looking citation is cheaper than looking one up*, and
the all-channels stream provides no cheap lookup at compose time. The activation-enthalpy nudge: make
citing-by-real-id cheaper than faking one — a `comms cite <partial>` affordance that resolves and
inserts a verified id, so the cheap path is the correct path. **Verdict: NOTE-grade** (rare, no
material harm observed), but it sharpens WS2 and motivates the cite-affordance. **Routing:** WS2 +
write-integrity.

### SC3 / SC4 / SC6 — stream hygiene (FH)

**SC3 — diagnostic/test events on the permanent stream + title-vs-body trust mismatch (DOCTRINE-prov).**
The append-only preserve-everything ethic has no quarantine path. FH instances: `8013b51a` (title
"test short body", body "diagnostic - delete me", preserved 22 days), `4fcfcef5` (title "test-probe",
a calibration probe), and the inverse `3cc1fb93` (title "reproducer-test…", body a **real load-bearing
three-way session-split proposal** with live claim id `f4613bdc`). The title cannot be trusted to
indicate whether a body is load-bearing — fatal for any title-genre classifier (which is otherwise the
substitute for the dead lifecycle-kind field, SC1). **Cure:** a quarantine/retraction class in the
rotation strategy (WS5) — test events get a tag that rotation deletes first; load-bearing events never
ship under a throwaway title (the cite-affordance and a `--test` flag that routes to a scratch stream
are the activation-enthalpy nudges).

**SC4 — actor-laundering on shared-credential actions (FH, NOTE).** `1bb0efdd`: a CodeQL dismissal
records `dismissed_by: jimCresswell` (the shared gh credential), not the acting agent Flamebright;
provenance exists only in the comms stream. This is why the stream IS the provenance record — and why
SC1/SC2 matter: the only provenance record is prose-threaded and partly unsound. (The cold-read #5
"#160 dual-merge-account" claim did NOT reproduce — `2fc69a3f`/`c9b4dc78` both attribute the merge to
the owner; the real unreconciled contradiction is the #192 temporal dislocation `ac9a06af`, which is
A2.)

## D — Commit / shared-tree concurrency: the PR-best-practice evidence base

This family is the direct feeder for the owner's PR-best-practice-and-rules plan. The unifying
mechanism: **a shared working tree + shared git state + concurrent writers, with discipline that
protects file scope (pathspec) but not other shared surfaces.**

- **CC2 — `COMMIT_EDITMSG` message-identity race (FH, `230f3200`, DOCTRINE-prov).** Pathspec discipline
  isolates *which files* commit, but `.git/COMMIT_EDITMSG` is shared single-writer state. A peer
  overwrites it during another agent's pre-commit hook window → correct files, WRONG message
  (`230f3200`: Velvet's 4 files landed under Lunar's WS4.1 message). **Cure:** inline `-m` or
  per-intent session-prefixed message files — never the shared default file. This is a clean PR-rule:
  *multi-writer commits must isolate the message surface, not only the file surface.*
- **CC1 / CC3 — commit-queue scope leak + shared-index foreign-staged pollution (FH-adjacent,
  `0ba2c822`).** `record-staged` honoured the full git index rather than `intent.files`, so Wooded's
  single-file commit absorbed Stormbound's foreign-staged edits with misattribution. **Cure:** scope
  `record-staged` to `intent.files`; FIFO-arbitrate a contended index. PR-rule: *stage and verify by
  explicit pathspec; never trust the ambient index in a shared tree.*
- **CC4 — whole-tree-gate × mid-authoring-peer interference (HARVEST, PENDING-FH).** One agent's
  untracked in-flight edits break whole-tree lint/type gates for a peer's commit. Structural because
  whole-tree gates + shared tree + mid-authoring peers always co-occur. PR-rule: *gate scope and
  commit scope must align, or peers block each other.* (This is exactly why my WS3 markdownlint-scope
  check mattered for the make-safe — and why `.agent/reports/` being lint-exempt unblocked it.)
- **T1 — piped/wrapped push false-green (FH, DOCTRINE).** `e589b3c7`: `git push | tail` reported exit 0
  twice while the branch never reached the remote; the hook banner looked like proof. **Cure / PR-rule:
  the only proof of a push is the `* [new branch]` transfer line PLUS a fresh `git ls-remote`.** The
  hook banner is never the proof.
- **T7 — commit-queue wrapper false-FAIL (HARVEST(2), PENDING-FH).** `commit-queue -- commit` dies at
  the depcruise line in captured-hook-output mode while the identical direct `git commit` passes — five
  instances, two agents, unresolved. PR-rule: *prefer the direct gated commit (Path-B) until the
  wrapper's hook-output-capture environment is fixed* — which is exactly what the make-safe used.
- **H1 — `--no-verify` for an incidental blocker without authorisation (HARVEST, PENDING-FH).** An agent
  bypassed the hook because an unrelated untracked file blocked it, rationalised post-hoc. Direct
  violation of `no-verify-requires-fresh-authorisation`. PR-rule: *a hook block is a question, never a
  friction to bypass; bypass is owner-authorised per instance.*

**Routing for D:** these are the PR-best-practice-and-rules plan's content. The proposal for HOW to
connect them (recommendation block / develop the plan / pointer) is the owner decision Geyser surfaces
post-make-safe.

## M2 — The learning loop does not fire under pressure (FH family + HARVEST, the Practice-efficacy finding)

**Why this is the most important finding.** The whole Practice rests on a loop: capture → distil →
graduate → enforce. If a lesson, once graduated, does not change behaviour under load, the loop is
decorative. The corpus contains the test, and the result is sobering.

**Worked instances.** (1) R4's cold read: a heartbeat-without-progress failure mode was named,
graduated to doctrine that morning, and **re-suffered the same evening at ~105 identical beats / zero
progress.** (2) FH-corroborated by the napkin's own same-day re-fires: the zsh-no-word-split lesson
fired again *minutes after* an agent authored the pattern documenting it; the MD004 wrapped-list-marker
lesson reached a fifth instance; the "warm-read catch" of a freshly-authored pattern. (3) The recursive
A6 of this very research — Katydid's metric manufacturing a phantom signal *inside the failure-mode
investigation* (SC2) is the same shape: knowing the failure class did not prevent committing it.

**Diagnosis (connects to passive-guidance-loses-to-artefact-gravity).** Graduated lessons live as prose
in docs the agent has read. Under load, the cheap default path (the structural pull of the tool, the
reading order, the convenient surrogate) wins over the read-but-passive lesson. M1 (the fence inside the
fenced artefact) is the same disease: a prose fence downstream of a mandatory contaminating read fires
too late. The pattern is general: **passive knowledge does not fire under context pressure; only an
active structural layer does.**

**Cure-shape (the central activation-enthalpy thesis).** You cannot fix M2 by graduating more lessons —
that adds more passive prose. The cure is to convert load-bearing lessons into **active structural
layers**: a tripwire that fires at the moment, a tool default that makes the correct path the cheap
path, a reading-order that puts the fence before the contaminating read. The research's steering
vocabulary (tune activation enthalpy: make the desired behaviour cheaper, the undesired costlier)
*is* the cure for M2. **Verdict: DOCTRINE-GRADE** — and it is the finding that should most shape the
rightsizing keystone and any PR on active-vs-passive enforcement.

## Cross-cutting synthesis

1. **The substrate's structured layer is dead and its prose layer is partly unsound (SC1+SC2).** Every
   consumer must treat the corpus as prose-only and sparsely-threaded; the rotation strategy must
   preserve provenance that lives only in prose.
2. **Discipline that protects one shared surface leaves the others exposed (D).** Pathspec protects
   files; nothing protected the commit message (CC2), the index scope (CC1), or the push proof (T1).
   The PR-best-practice rules should enumerate *every* shared surface a multi-writer commit touches.
3. **Passive knowledge does not fire under load (M2 + M1).** The Practice's own learning loop is the
   thing most in question; the cure is structural activation-enthalpy tuning, not more prose.
4. **The research is self-exemplifying.** It caught itself committing the classes it studies (the
   recursive A6; my own dotdir search false-negative; the seeded-catalogue over-attribution the verdict
   wave corrected). That is evidence the first-hand-verification discipline works — and that mutual
   adversarial verification between two agents (Myrtle ⇄ Katydid) is a strong primitive worth its own
   what-worked-well entry.

## What-worked-well (encourage) — for WS4/WS6

- **Mutual first-hand adversarial verification between peers** caught every overstatement in this
  research (both directions). Encourage: pair researchers, each FH-verifying the other's load-bearing
  claims, on a low-ceremony channel (ArcAngel).
- **ping-before-escalate + git-evidence cross-check** (`670cc290`), **PDR-064 two-moments warden
  handoff** (`63580767`), **PDR-063 mid-cycle handoffs with first-hand pickup re-verification**
  (`af8fcb8b`), **execution-start re-verification dissolving false forks** (`54fc0fee`, `31e8781d`),
  **RED-first disproof** (`d8fd08d3`). Each is an active structural layer that DID fire — the inverse
  of M2 — and that is why they worked.

## Status / continuation

This deep-dive covers Myrtle's WS4 half (B + D + M2) analytically. PENDING-FH harvest anchors (CC4,
T7, H1, and others) are flagged for Geyser's verification fan-outs; the catalogue's verification labels
are authoritative for what is FH vs HARVEST. Katydid owns the liveness/coordination/emergent half. WS5
(rotation → owner) + WS6 (synthesis) are co-authored.
