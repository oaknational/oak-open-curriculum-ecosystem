---
title: "The showcase / design-system boundary — concept exploration"
author: "Plover lifts Troposphere (b10c37), Director seat"
date: 2026-08-10
status: capture
serves: design-system-as-configured-framework
provenance: >-
  Owner directive 2026-08-10 (verbatim intent): "the showcase must use the design
  system and not include ad-hoc non-design-system solutions… if we need
  functionality or capability we don't have we need to decide if it belongs in the
  design system or the showcase app. The design system has many parts in separate
  workspaces, this modularity is deliberate. The showcase will include pages
  demonstrating various capabilities, the identity switching is just the first. Use
  all appropriate cognitive skills to explore this before passing your findings to
  Swordfish." Concept-exploration (metacognition + reason) over first-hand grounding:
  ADR-213, ADR-041, ADR-147, the 2026-07-19 component-architecture exploration, and a
  full DS-vs-showcase surface map. Findings route to the design lane (Swordfish wakes
  Trench, d0274e) as design-pen adjudications, not unilateral redesign.
---

# The showcase / design-system boundary

## 1. Problem frame — the reframe that dissolves the surface question

The surface question reads as "for each piece, DS or app?" — which the estate's
standing principles already answer (Separate Framework from Consumer; Layer Role
Topology; Context Specificity Gradient). Metacognition on the frame finds a sharper
question the directive is really protecting:

**The showcase is a categorically different kind of app: its PRODUCT is the
demonstration of the design system.** An ordinary product app consumes the DS to
build something else; the showcase's output *is the claim* "the DS can do this."
Therefore ad-hoc UI in the showcase is doubly wrong — a boundary violation AND a
false advertisement: a showcase that hand-rolls a control demonstrates "an app can
build its own control," not "the DS gives you this control."

This **inverts ADR-213's standing default**. For product apps, ADR-213 permits
hand-rolling a widget app-local and lifting it to the DS at the *second consumer* —
an economical interim. For the showcase, that interim is illegitimate: **DS-origination
is required, not deferred**, because the demonstration is the claim of DS provenance.
The showcase composes DS primitives; it never authors UI mechanism. (This does not
conflict with ADR-213 — it is a showcase-specific clause the ADR does not yet carry.
See §5.)

The corollary answers the owner's "capability we don't have" clause cleanly: when the
showcase needs a UI mechanism the DS lacks, that is a **decision point, surfaced**
(does it belong in the DS or is it genuinely demo-only?), never a default resolved by
silently hand-rolling in the app.

## 2. Load-bearing observations (first-hand)

- **The DS is one system with a framework-neutral TRUNK and a React BINDING TIER**
  (ADR-213 §3/§4). Trunk = `oak-design-system` (tokens, the `.oak-*` class library,
  fonts, assets, theme switcher; *no React on its export surface, permanently*).
  Binding tier = `oak-design-react` (framework-covariant adapters; today a single
  non-visual resident, the `oakThemeStore` `useSyncExternalStore` adapter; awaiting its
  first *component* export). Within-DS modularity by concern: tokens →
  `oak-design-tokens`/`design-tokens-core`; framework-neutral class/pattern → trunk;
  genuine-React-behaviour → binding tier; raster → `oak-design-assets`; terminal →
  `oak-design-ink`. Imports flow one way; no back-edges (ADR-041).
- **`re-wrapping the class library in a framework component layer is REJECTED`**, and
  `static/content UI → semantic HTML + .oak-* + tokens, no React component` — both
  unanimous across the adversarial 2026-07-19 exploration and ratified in ADR-213 §3.
- **The kit has the INGREDIENTS of a segmented control but no such class.** Confirmed
  by enumeration: `oak-radio` (single native radio, CSS-drawn), `oak-visually-hidden`,
  `oak-btn`, `oak-select` exist; there is **no** `oak-segment*`/`oak-toggle*`/
  `oak-pill*`/radiogroup-as-control class anywhere in `packages/design`.
- **The armed gate.** The first *component* export of `oak-design-react` is a HARD
  GATE: the ADR-147 extension (per-theme axe over all colour trees + forced-colors
  render check + CI-promoted `test:a11y`) must land *for that package* before any
  component ships — explicitly kept armed at the 2026-08-02 store landing ("a store is
  not a component export"). A trunk CSS class does NOT trip this gate; a binding-tier
  React component DOES.
- **The showcase's `useIdentity` self-documents as demo-only**: "Showcase-only
  mechanism; production identity is server-emitted." Production does not switch brands
  client-side; only the demonstration does.

## 3. Assumptions that CHANGED during the exploration (the falsifier working)

- **REFINED — SegmentedControl's home.** Entering, I held "it's CSS over native radios
  → an `.oak-segmented` class." The map confirms the class is genuinely missing AND
  that native radios sharing one `name` in a `role=radiogroup` fieldset get arrow-key
  roving and mutual exclusion from the browser for free (no JS — the shared `name`,
  not the role, is what creates the native group) while `:has(input:checked)` gives
  visual state in pure CSS.
  So the sharper answer: the control needs **no React component at all** — the pattern
  is a trunk class; the app writes semantic markup + wires `onChange`. This is
  *stronger* than "add a component," and it avoids the armed ADR-147 gate.
- **REFUTED — promote `useIdentity` to a DS React brand-adapter.** I hypothesised the
  brand-application hook was the theme-store's natural sibling for `oak-design-react`.
  The map refutes it on its own docblock: production brands are server-emitted, so the
  *client-side runtime swap* is demonstration scaffolding, not a production DS
  capability. It stays app-local. (A genuine open question survives — see §5 fork 2.)

## 4. Synthesis — the sharpened decision procedure

For any UI need arising in the showcase, in order:

1. **Is it COMPOSITION** — arranging existing DS classes/components/tokens into a
   specific demo page (the specimen's ten regions, the gallery layout, page chrome)?
   → **App-local**, using `.oak-*` classes + tier-3 tokens only (enforced by
   `validate-authored-css`). This is the thin-consumer layer and is legitimate.
2. **Is it DEMO-ONLY SCAFFOLDING** — routing, the gallery index, the capture/fidelity
   harness, or a mechanism production genuinely does not use (client-side brand swap)?
   → **App-local.** As the showcase grows to N demo pages, shared scaffolding
   consolidates *within the app* (`demos/oak-design-showcase/lib/…`), not route-local,
   and not into the DS.
3. **Is it a reusable UI CONTROL / PATTERN / COMPONENT (mechanism, not composition)?**
   → **DS-origination required.** Then place by the within-DS context-specificity
   gradient — **prefer the lowest, most general layer**:
   - Expressible as framework-neutral CSS over semantic HTML (a class pattern)? →
     **trunk (`oak-design-system`).** Preferred: it crosses every substrate (the export
     HTML benefits too) and does not trip the ADR-147 component gate.
   - Genuinely needs React behaviour CSS cannot express (external-store sync, effect,
     context)? → **binding tier (`oak-design-react`)** — and it trips the armed ADR-147
     gate, which must land first.
   - A value → tokens; raster → assets; terminal → ink.

The test that separates 1/2 from 3 is Layer Role Topology's, sharpened for the proof
surface: *"Would another demo page need this exact mechanism?"* If yes, it is DS
material and must originate there — the showcase's job is to demonstrate it, which
presupposes the DS owns it.

### Application to the in-flight identity-switchboard work

| Item | Verdict | Home |
|---|---|---|
| **`SegmentedControl`** (specified route-local React in PR-2, not yet built) | The control PATTERN is a **missing trunk class family** (`.oak-segment*`). Building it as route-local React is the rejected re-wrap AND the owner's flagged ad-hoc solution. | Add `.oak-segment*` to **`oak-design-system`** (contrast-audited, a small class-library addition the identity-switchboard demo *motivates* — the textbook "showcase surfaces a DS capability"). The route then writes `fieldset`/`legend`/`role=radiogroup` + real radios with one shared `name` (the shared `name` — not the role — is what creates the native group behind mutual exclusion and arrow-key selection) + the class, wiring `onChange` to `oakThemeStore`/`useIdentity` — sanctioned app composition. **No binding-tier component; the armed ADR-147 gate is not tripped.** |
| **The specimen composition** (ten regions, route-local) | **Sanctioned app composition** — kit classes + tokens over semantic markup, `validate-authored-css`-gated, fidelity-checked against the DS's own `studio-source/whitelabel/specimen.html`. Not a boundary violation; no change beyond the existing zero-ad-hoc-CSS enforcement. | App (`demos/oak-design-showcase`). |
| **`useIdentity`** (client brand-swap) | **App-local** (demo-only per its docblock). As white-label demos multiply, consolidate to showcase-shared `lib/`, not route-local, not DS. | App — with fork 2 (§5) flagged. |
| **`LabelledSelect` / `Switchboard`** | Transitional; the native-`<select>` control is superseded by the SegmentedControl route once the trunk class lands (the estate's ruled "never a native select"). The binder role consuming `oakThemeStore` is correct — that adapter already lives in the DS. | App (transitional). |

## 5. Proposed next steps (warrant + falsifier) and forks for the design pen / owner

**Next steps (Swordfish's design pen; the pre-execution code-expert review shapes the
slice):**

1. **Before PR-2 authors any control, decide SegmentedControl's home by this procedure**
   — the recommended resolution is the trunk `.oak-segment*` class + app-composed
   markup. *Warrant:* PR-2 is not yet built, so this shapes the code, not a rewrite;
   the class is small and contrast-auditable; it converts a would-be ad-hoc control into
   a demonstrated DS capability, which is the showcase's whole point. *Falsifier:* if the
   control turns out to need React behaviour CSS cannot express (it does not, on the
   evidence — native radiogroup roving + `:has()` suffice), it would route to the binding
   tier and trip the ADR-147 gate; verify first-hand at authoring.
2. **Record the showcase-inverts-the-default rule** (§1) in the plan's §Governing steer
   (it composes with the ends-before-means steer) and consider raising it into **ADR-213
   §3** as a showcase-specific row — ADR-213 §3 is the home of the component-placement
   decision table, and "showcase = proof surface, DS-origination required, not deferred
   at second consumer" is a durable architectural rule. *This touches an Accepted ADR, so
   it is owner-substance* — but the owner has given the substance in this directive; the
   design pen carries it, the owner ratifies the ADR wording.

**Forks (genuinely open; not for me to resolve):**

1. **The `.oak-segment*` class is a DS change, so it obeys DS discipline** — contrast
   audit, the class-library conventions, and (being framework-neutral) it should be
   usable by the export HTML. Swordfish sizes whether it lands in the same PR-2 or a
   small preceding DS PR (proportionality; likely a preceding DS slice so the trunk owns
   the capability before the demo consumes it — DS-origination *before* demonstration).
2. **The theme/brand asymmetry.** `oak-design-react` owns a runtime *theme*-application
   primitive (`oakThemeStore`). Production emits *brands* server-side, so the client-side
   brand swap is demo-only today. But the owner's "presentation is data" thesis and the
   symmetry with the theme store raise a real question: **should the DS own a runtime
   brand-application primitive** (a sibling store/adapter the showcase consumes), or is
   client-side brand switching genuinely demo scaffolding forever? This is a design-pen
   question that may rise to the owner — it decides whether every future white-label demo
   shares a DS primitive or app scaffolding.

## 6. Unresolved evidence that could change this

- Whether a future demo page needs the SegmentedControl with behaviour beyond native
  radiogroup semantics (e.g. controlled/managed state) — that would move it to the
  binding tier. No current evidence it does.
- Whether the owner intends the DS to carry a client-side brand-application primitive
  (fork 2) — a product-scope question only the owner settles.

---

*Concept-exploration capture, not doctrine. Routes to the design lane (Swordfish) as
adjudication input; the plan's §Governing steer and, on ratification, ADR-213 §3 are the
durable homes for what survives.*
