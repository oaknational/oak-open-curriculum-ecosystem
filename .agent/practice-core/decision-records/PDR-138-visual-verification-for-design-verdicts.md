---
pdr_kind: pattern
---

# PDR-138: Visual Verification for Design Verdicts

**Status**: Accepted (owner-ruled, in-chat, verbatim quotes below).

**Date**: 2026-08-13

## Context

Design-lane agents assess fundamentally visual work — layout, rendering,
theming, interaction states — yet their default evidence surfaces are
code reads, CI verdicts, and numeric probes. Those surfaces prove
structure and regressions; they cannot see what a person sees. On
2026-08-13 a keyboard blackout (every control on two demo pages
unreachable by Tab) sat undetected behind a fully green quality estate:
the pages rendered beautifully, every gate passed, and the defect existed
only in rendered interaction behaviour. The owner ruled, verbatim:

> "This is _fundamentally_ visual work, and requires visual assesssment
> in order to usefully assess it."
>
> "verdicts on visual design work without visual validation or proof are
> at best insufficient, at worst, utterly and avoidably incorrect,
> without value and actively misleading"
>
> "that means screenshots, via playwright or whatever means you prefer"
>
> "record and automate the visual probe, we are going to need it many
> thousands of times"

## Decision

1. **A verdict on visual work carries rendered proof.** Any claim of the
   class "renders correctly", "looks right", "no visual regression",
   "focus reaches X", or a cure/design sign-off on a visual surface is a
   non-verdict until a rendered artefact backs it. The artefact is read
   first-hand by the agent issuing the verdict — a test's green tick that
   happened to involve a browser is not a read.

2. **Proof classes.** (a) Full-page render — layout and composition;
   (b) interaction-state render — the page after the interaction under
   claim (focus walks, control changes), where the claimed state must be
   visible on the pixels (a focus ring, a revealed element); (c) DOM-fact
   echo — the machine-readable companion (e.g. `activeElement`) printed
   in-band with the capture, so the pixels and the DOM corroborate each
   other.

3. **Decision moments that demand proof.** Red proof before a visual
   cure (the defect on pixels); green proof after it; layout confirmation
   whenever structure that owns placement changes (grid areas, region
   markers, order-affecting CSS); a rendered pass before any
   owner-facing "done" on a visual deliverable.

4. **Proof is regenerated, never archived.** The probe makes proof cheap
   and reproducible on demand; artefacts live in session scratch space
   and die with the session. Repositories hold the instrument and the
   record of what was proven, not accumulating screenshots. (Calibration
   fixtures with owner-authorised homes are the standing exception.)

5. **The instrument is estate tooling.** A named, documented,
   lint-clean probe (first host: the design-showcase workspace) runs
   thousands of times without per-run authoring: parameterised route,
   viewport, interaction steps, and output location, with DOM facts
   in-band on stdout.

## Boundaries

Binds design-lane assessment acts on UI-shipping surfaces. It does not
convert non-visual work (API shape, data plumbing, pure logic) into
screenshot ceremony, and it does not replace the browser-cell suites —
cells prove invariants continuously; the probe proves the specific claim
under a verdict at the moment it is made.

## First worked instance

The F01/F02 keyboard blackout cure (PR #846, 2026-08-13): red proof — a
rendered page with no reachable focus after 30 Tab presses; green proof —
the focus ring visibly on `#picker-identity-select` after one Tab, and a
revealed in-frame skip link after two on the side-by-side page; layout
confirmation after the `data-region` row pin; DOM-fact echoes printed
with each capture. The defect was invisible to every code-level gate and
obvious on the first rendered artefact.

## Prediction and falsifier

Stated as an expected-observable-effect plus falsifier pair, the form
the estate's two-speed-learning discipline (PDR-130) requires of enacted
doctrine; drafted at the 2026-08-13 session close and added at the
2026-08-14 consolidation pass. Prediction: by the first consolidation on
or after 2026-10-01, design-lane sessions produce rendered proof
artefacts at cure boundaries by default, and at least one defect
invisible to code-level gates is caught on pixels before merge (the
class the 2026-08-13 keyboard blackout instantiated). Measurement: read
the design-lane session records and PR review rounds over the window for
probe invocations at cure boundaries and for pixel-caught defects.
Falsifier: design-lane cures in the window repeatedly land without
rendered proof despite the rule being loaded, or every pixel-read in the
window merely restates what a code-level gate had already caught — either
reading means the discipline is ceremony and the PDR is re-examined at
its review rather than assumed.

## Provenance

Owner rulings 2026-08-13 (quoted above), issued while directing the
PR #846 cure. Phenotype artefacts land with this PDR: the host design
register's paired record, the `visual-verdicts-require-rendered-proof`
rule, the `visual-verification` skill, and the host probe tool — the
bridge index carries the concrete pointers.
