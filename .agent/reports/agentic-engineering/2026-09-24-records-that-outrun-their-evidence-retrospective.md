# Retrospective: records that outrun their evidence

The arc: the exchange's texts landing in this estate, from the fold of #175 (2026-09-23 11:57Z)
to the fold of #176, #183 in review and the second estate's pull requests 159 to 161 signed
(2026-09-24, about 11:00Z). Seat: Zephyr guards Leeward (281e44), at the owner's word
(2026-09-24 ~10:58Z: "while you are waiting, please perform a deep retro"). Run under the
retrospective skill, with metacognition, concept exploration and a bounded free-play pass.
Every timestamp, SHA and count below was read from its source while this was written.

## The question

Why did records this seat wrote, and believed it had verified, become false? One of those false
claims reached the owner.

## Timeline (primary sources)

- 2026-09-23: #177 landed PDR-142 byte-identical from the second estate (`138e0128f`, one
  round). #173 landed as `685ad538c` (five rounds). #180 twinned the paired amendments
  (`3a1d47873`, two rounds). #181 landed the joint texts (`98e059ac5`, 20:30:55Z, five rounds,
  one of them a third round for a correctness defect).
- 2026-09-23 20:31Z, commit `63317436b`: the journal entry for those landings says PDR-142,
  PDR-125 and PDR-141 are held "byte for byte" in both estates, and that #180 landed
  "byte-identical to the second estate's copy".
- 2026-09-24 ~10:12Z: at the wrap before a compaction, this seat told the owner the paired
  amendments "are byte-identical to Brazier's copy". The compaction summary carried the same
  claim.
- 10:15Z: resume. The branch is due today under the 24-hour lifetime rule. Blazar lifts Corona
  committed its own formation letter by agreement (`f71ca9d1b`). Engraph at `418671f16` was
  merged in (`4bfa150c8`) and pushed.
- ~10:22Z, owner: "There are three open PRs to deal with."
- ~10:26Z, at about 25% of context: #183 synced (`8b9dcb944`), then the directive edits B4 and
  cure C.
- ~10:30Z: taking the owner-ratified blobs for #183, the seat diffed them against the second
  estate's copies. PDR-142 matched (`4bf9b95d` in both). PDR-125 and the inter-Practice skill
  did not. Each differs by one host line: in PDR-125 the package name, a divergence present in
  the second estate since its transplant on 2026-09-12 (`6156fc46`); in the skill, the adapter
  path. So the journal's claim was never true.
- 10:34Z: the journal claim was corrected before #176 went to review (`ccad4b9cd`).
- 10:31Z to 10:35Z: a Cricket panel ran, eight returns: seven ON-TRACK and one DRIFTING, a
  finding about citation form. The Director upheld the rejection of that one.
- 10:33Z to 10:35Z: Brazier signed a host-free adapter line. At 10:35Z the seat read 159, 160
  and 161 as receiver, at about 37% of context, and signed them at 10:36:24Z. Pull request 161
  rewrote the same paragraph the seat had edited at 10:26Z as B4, in a better form ("two reads").
  That paragraph is in a directive, so the better form became a declared debt.
- 10:42Z: #176's first round produced four threads. 10:47Z: settlement push 1 (`676609d90`).
  10:52Z: round two produced one Codex thread and one Copilot review-body item, both answered in
  replies under the rounds ruling. #183's first round: Codex clean, and one Copilot observation
  of the declared debt.

## Findings on #176, by class

Six findings over two rounds. In four of them, a statement in the change was made false by that
same change:

1. The pickup's "FIRST ACT of the successor: fold coordination/2026-09-23-0ea8fb": true until
   #176 merges (Codex, round one).
2. The same sentence, found by Copilot (round one).
3. "Its journal's newest entry is the fold of pull request 175": made false by a journal entry
   this same branch appended (Codex, round two).
4. A napkin line saying repo-continuity does not list the Codex lane: made false by the pointer
   this same branch added (Copilot's review body, round two).

The other two: a clipped sentence in a review-cost row, and a journal heading whose time
covered less than its entry.

## Causal stack

1. **Technical root: a statement's scope exceeds its evidence's scope.** Two forms share one
   shape.
   - *Quantifier scope*: a property checked for one member of a set is stated for the whole
     set. PDR-142's hash matched, and "the amendments are byte-identical" was written.
   - *Temporal scope*: a state true at the moment of writing is stated as standing inside an
     artefact that outlives that moment. The pickup, the "newest entry" pointer and "waits on
     this estate's signature" were each true at writing and false within hours, three of them
     by the act of the very change that carried them.
2. **Process root: the record was composed from the seat's summary knowledge, not recomputed
   from the artefact at writing time.** The estate already holds the instrument. PDR-125 says
   its portable body is "proven by cross-estate diff at each amendment", and #180's landing
   recorded no such diff. `verify-dont-trust` exists too. Recomputation happened only where a
   tool forced it: `cp` then `git hash-object` while taking the blobs. The fold ceremony has no
   step asking whether a statement survives the fold's own merge.
3. **Meta root: summaries compress sets into categories, and a compaction is a summary.** The
   claim crossed the compaction as a category word ("identical"), not as a checkable fact (three
   hashes). It then reached the owner in a wrap report the seat believed it had verified. The
   next "why" is how a model summarises: it generalises fluently from the first member it
   checked. That is outside this estate's control. The control point is the one above:
   recompute at writing, and write checkable facts.

## Counterfactual

- **Quantifier scope.** The cured segment exists in this arc. Every identity claim in #183 was
  recomputed at writing ("`4bf9b95d` in both"; "differs only by the adapter line", checked with
  `git diff --no-index`). Its first round drew no identity finding: Codex was clean, and
  Copilot's one thread was the debt the description had already declared. The uncured segment
  cost a correction commit (two local gate runs), about fourteen hours of a false record on the
  coordination branch, and a false statement to the owner. The arc could have gone right at
  #180's landing, by recording three `git hash-object` results.
- **Temporal scope.** No cured segment yet. Settlement push 1 rewrote the pickup to hold true
  whether #176 has landed or not ("if 176 has not landed, landing it comes first"). The same
  branch still carried the "newest entry" pointer, which round two found. Round one's cure was
  written for the instance, not for the class.
- **Budget ordering.** The continuity record at 10:15Z already named pull request 161 as "the
  solo test in one form", the same passage B4 would edit. Had the three pull requests been read
  before the directive edits, at about 20% of context, B4 would have been H's form from the
  start. There would then be no declared debt, and no Copilot thread on #183.

## Honest credit

The arc landed PDR-142 byte for byte in both estates. The inter-Practice skill becomes one file
in both, through a host-free line that both seats signed within two minutes by native message.
PDR-125's own phenotype-note clause proved its worth: it answered the "same blobs" question at
the seat's level, where two Cricket returns wanted the question escalated. Four joint sets were
signed, and the second estate merged them within the hour. The rounds ruling held on #176: round
two's findings were answered in replies, with no third round. The Director was sent only one
thing it needed (a rejected DRIFTING verdict), and it answered in one message. None of this
excuses the price. The owner was told a false thing about the owner's own ratified text, and the
seat caught it by accident of doing other work.

## Proposals

None is constitutional-class, so all ride the fast lane (PDR-130): napkin candidates, and skill
or tool changes through ordinary pull requests.

1. **Generate the cross-estate parity table; don't narrate it.** A command that takes the
   second estate's ref and prints, for every shared Practice file, "identical" or "differs by N
   lines", with the hunks. Landing records cite its output, never a prose identity claim. This
   is the structural cure the metacognition directive asks for, and it operationalises
   PDR-125's "cross-estate diff at each amendment". *Warrant*: the false claim of 2026-09-23 and
   its reaching the owner; #183's clean round under manual recomputation. *Falsifier*: over the
   next three exchange landings, identity claims written without the tool are never wrong.
   Then the manual check is enough, and the tool is weight without value.
2. **A change never narrates its own state in the files it carries.** Self-description ("fold
   this branch", "waits on", "newest entry", "not yet listed") belongs in the pull request's
   body, which is not merged, or in the successor's first commit. Before a fold is marked ready,
   the seat sweeps the fold's own records for such statements. Coordination-fold skill text,
   step 6. *Warrant*: four of #176's six findings; the generator named in the review-cost rows
   of #170, #171 and #175 ("records written mid-state-change", "live state restated", "the
   pickup restating live pull-request state"). *Falsifier*: the next two folds, run with the
   sweep, still draw a finding of this class.
3. **Before a budget-gated edit, read every pending input that touches the same passage.** Add
   one sentence to the sequencing section of `directive-file-context-budget`. *Warrant*: B4 at
   10:26Z and pull request 161 at 10:35Z, the overlap already named in the seat's own record.
   *Falsifier*: a budget-gated edit made after such a sweep still needs a follow-up from an
   input that was known at edit time.
4. **Cite standing rulings and hook gates by id in a Cricket frame** (the Director's advice,
   10:37Z). *Warrant*: the procedure role's only DRIFTING verdict was on citation form.
   *Falsifier*: a frame with those ids still fails the procedure role's gates check.

Tool feedback, recorded on the napkin. The scratchpad PR instruments must run from the
repository root, and one failed silently from another directory. The canonical watcher renders
events addressed to other seats in full, which costs a bystander's context. Today that was about
twenty events between two other seats.

## Free-play harvest (associations, not findings)

- Kept: PDR-125's phenotype note, set against the skill's `<prefix>` placeholder, reminded me of
  two ways to hold difference inside identity: a declared variable region, or a parameter.
  "Identical outside the declared region" would make the parity table in proposal 1 honest where
  host facts must differ. Routed to the exchange as an association.
- Kept: the PR body looks like a book's jacket and the files like its pages. A jacket can say
  "new this season" and stay true; a page cannot. This one shaped proposal 2.
- Kept, as one instance: two of the three accepted Cricket redirections came from the
  adversarial stance.
- Discarded, visibly: an orchestra analogy for six seats and a Director who hears only
  questions. It arrived fluently and carried nothing.
- Discarded: the upstream CODEOWNERS file naming people who have no access on this fork. It
  surprised me, but GitHub requested only the owner, and nothing turns on it.

## Concept exploration: the frame

- *Problem frame*: statements in records whose scope, over a set or over time, exceeds the
  evidence that produced them. Load-bearing observations: six in one arc (the two identity
  claims; the pickup; the "newest entry" pointer; "waits on this estate's signature"; the napkin
  line).
- *What changed*: the seat treated these as separate slips. They are one shape, and the fix
  sits where the statement is written, not where it is reviewed.
- *Unresolved*: no successor has yet been misled in practice. The harm is priced in review rounds
  and in one false report to the owner, not in a wrong act downstream. The proportion of
  proposal 1 depends on how many Practice files the estates share, which this record has not
  counted.

## Metacognition

The fluency warning fired late. "Byte-identical" felt safe because the first member truly was.
What I would do differently: write the three hashes when I landed #180; read the pull requests
that touched my paragraph before spending the directive budget on it. And the next time a
compaction summary hands me a category word, treat it as a claim to recompute before I repeat
it to anyone.
