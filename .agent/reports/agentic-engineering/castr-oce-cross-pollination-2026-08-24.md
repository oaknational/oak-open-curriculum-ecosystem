# What castr's autonomous loop and this estate can learn from each other

**Cross-estate comparison and cross-pollination inventory**, commissioned by
the owner on 2026-08-24 in the castr loop-review session's continuation:
first "Compare the long running Castr project work with routines and the
outcome-informed-practice-learning strategic node work that runs on Codex
with a weekly cadence", then "please raise PRs in both repos regarding what
they can learn from each other". This is the OCE-side half; the companion
landing in castr is
[EngraphCode/castr PR #52](https://github.com/EngraphCode/castr/pull/52),
which carries the full comparison note
(`.agent/analysis-and-reports/castr-oce-loop-comparison-2026-08-24.md`) and
the loop review it draws on
(`.agent/analysis-and-reports/proof-programme-loop-review-2026-08-24.md`).
Author: the castr loop-review seat (claude-code cloud, session prefix
`01FV6r`, thread `proof-programme-review`; named Flamebright Burning Caldera
in the castr collaboration record). Method: the castr side from the same-day
owner-commissioned loop review, where every claim carries its source; the
OCE side read firsthand from this `engraph` branch — the
`outcome-informed-practice-learning` (OIPL) strategic node, the delivery
plans serving it (ten enumerated by `serves:` search; `exemption-removal`
and `open-surface-zero` read in full), and the 2026-08-24 outage
retrospective. Evidence bound: neither repo records its scheduler — castr's
cron and the weekly Codex cadence both live platform-side; the cadence facts
and the owner statements quoted below are owner-supplied (2026-08-24, that
session, verbatim where quoted).

**Review contract.** Purpose: give this estate a sourced account of what the
castr proof-programme has measured that transfers here, and record the
owner's equality directive on the OCE side. Questions a review should test:
are the castr-side claims faithful to the linked loop review; are the
OCE-side characterisations faithful to the named plans; does each proposal's
warrant support it and its falsifier genuinely bite? Evidence standard:
every castr claim re-derivable from the linked review; every OCE claim from
a named file on `engraph`. Authority boundary: this record AUTHORISES
NOTHING — each item below carries a route (a PDR-130 lane, a convention
note, or an owner decision) and enacting any of them is that route's
decision; proposal 1 in particular adds corroborating evidence to a proposal
the outage retrospective already carries, not new authority. Non-goals:
re-litigating either estate's ratified doctrine; amending the OIPL node;
importing castr mechanisms wholesale. A successful review either confirms
the claims against their sources or names the specific claim, source, and
mismatch.

## The standing owner directive (recorded here for this estate)

> "piece by piece, I want the Practice in Castr and OCE to take the best of
> each other, until they are Equal in capability."
>
> — the owner, 2026-08-24, verbatim

This extends the existing one-directional parity programmes (the
Oak→castr transplant; the castr→OCE back-flow ledger) into a BIDIRECTIONAL
equality goal. This report and its castr companion are the first instalment.

## The comparison in brief

Castr runs an autonomous implementation loop (the "proof-programme",
ADR-051 in that repo): a platform cron Routine fires a fresh zero-context
Claude cloud session every 8 hours against a standing brief and a
machine-consumable queue, with front-loaded merge authority — merged PRs
with nobody present. This estate's OIPL strand runs weekly Codex scans whose
output is research: reports, registers, censuses, dispositions feeding later
adjudication.

An earlier draft framed the weekly scans as owner-attended. The owner's
correction, verbatim: "I do not intend to be present for the weekly scans or
value derivations, although they do not go as far in that the OCE scans
result in research rather than implementation." Both loops are UNATTENDED;
the load-bearing differences are cadence (≈21 runs/week vs ≈1), vendor seat,
and — above all — **output tier**: implementation vs research. The distance
between the two tiers is exactly three pieces of machinery castr had to
build: standing written authority for the recurring judgement calls (one
ballot sitting produced the merge/review/escalation clauses), a queue whose
briefs carry mechanical acceptance (a seat can self-judge DONE), and
run-boundary state discipline (counters, incidents, and continuity landing
as tracked state through defined routes). This estate already has everything
else the loop needs — the grounding practice, the reviewer layer, register
discipline, decision cards. The boundedness of the weekly scans is equally a
designed property of the OIPL node ("maintaining the learning substrate does
not become the dominant work"): going further is a choice governed by that
node's own disconfirmation clause, not a deficiency.

The strongest cross-estate datum is cadence-independent: **bot-review
non-convergence is a property of the review loop, not of autonomy**. Castr
measured 17 untallied review rounds under its 8-hour loop; this estate
measured ~25 cure commits in 3.5 hours on a fully interactive seat, the same
week (the corepack arc, per the outage retrospective). Both estates
independently converged on the same cure — a tally artefact created at
PR-open plus a bounds-not-cures disposition for unbounded-reference
findings. Castr ratified it into its ADR-051 clause 4 on 2026-08-24 with a
queue row to build the instrument; the outage retrospective's proposal 2 is
the same contract.

## What this estate can take from castr (each: warrant, falsifier, route)

1. **Corroboration for the review-tally artefact.** Castr's ratified
   clause-4 wording (per-finding non-blocking demonstration never covering
   data mutation; bounds-not-cures for unbounded-reference findings; a
   two-round structural step-back where a blocking class is never carried
   forward) and its queued PR-comment tally instrument give the outage
   retrospective's proposal 2 a second estate's ratified form to graduate
   against. _Warrant:_ four measured no-tally arcs across the two estates.
   _Falsifier:_ tallies built and the step-back still not firing. _Route:_
   the pr-lifecycle amendment the retrospective already routes per the
   PDR-130 fast lane — castr's text is corroborating evidence, not new
   authority.
2. **Counters-as-tracked-state for scheduled work.** If the weekly scans
   multiply into lanes, castr's pattern — explicitly initialised counters in
   plan frontmatter; absence = observable drift; every run lands its
   increment through a defined route — gives "runs since last progress per
   lane" for free. _Warrant:_ castr's counter integrity held across an
   environment outage and a multi-writer incident. _Falsifier:_ counter
   bookkeeping consuming a visible share of scan output — the OIPL charter's
   own proportionality bound. _Route:_ convention note, adopt-at-need.
3. **Predecessor-slot attestation for any scheduled loop.** Castr measured
   ~16 hours of silent scheduler absence invisible to every instrument the
   loop reads; the cure — each run attests its predecessor's expected slot
   from durable traces, and a trace-less slot becomes an incident — transfers
   to any unattended cadence. At weekly cadence a missed slot costs a whole
   week of staleness. _Warrant:_ two silently missed castr firings
   (measured); the owner-approved castr brief for the cure. _Falsifier:_
   false positives on legitimately trace-less runs. _Route:_ convention
   note, adopt when a scan lane becomes schedule-critical.
4. **The research→implementation path, as evidence.** The proof-programme is
   a live, measured existence proof that an unattended loop can safely land
   implementation under front-loaded authority: four attested firings all
   behaved correctly; eight judgement forks became owner rulings without a
   stall; two runaway/stall classes were measured and cured. If the owner
   ever widens a weekly scan's mandate from research to implementation, this
   is the template and the evidence base — a scan-scoped ballot plus a queue
   with mechanical acceptance, not new invention. _Warrant:_ the loop
   review's firing account and loop-dynamics verdicts. _Falsifier:_ the
   loop's future failure modes (the review names the accepted residual:
   sustained-absence blindness). _Route:_ recorded as evidence for a future
   owner decision — nothing to enact now.

## What castr is taking from this estate (for symmetry)

- **The effect-hypothesis contract on queue briefs** — OIPL's three-contract
  model (capability / effect-hypothesis / feedback) is one contract richer
  than castr's warrant + falsifier: it names the later outcome that judges
  whether the work paid off. Routed in castr as an owner-gated queue-brief
  convention amendment.
- **Expiry and no-open-ended-state on decision registers** — this estate's
  `gate_expiry_default: P21D` and the exemption register's forbidden
  open-ended states (every row `fix-routed`/`policy-ratified`/`pending`;
  closure requires zero pending) are structurally stronger than castr's
  queued-decisions register, whose rows are healthy but unaging. Routed in
  castr as an owner-gated register-convention amendment.

## Residual asymmetries worth naming

- Castr's loop is the only live proof either estate has that the Practice
  functions with nobody present; the weekly cadence never exercises
  unattended reflexes. Keeping one high-frequency autonomous lane running is
  itself outcome-evidence the OIPL node feeds on.
- This estate's information-governance boundaries (people-derived evidence,
  privacy, safeguarding) have no castr counterpart yet; if castr's loop ever
  touches outcome evidence about people rather than code, the OIPL node's
  bounds are the template to import — a future instalment of the equality
  directive.
