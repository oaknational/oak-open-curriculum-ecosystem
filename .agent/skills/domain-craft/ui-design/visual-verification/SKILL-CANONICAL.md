---
name: visual-verification
classification: active
concern: domain-craft
domain: ui-design
description: >-
  Produce and read rendered proof (screenshots, focus-state renders,
  DOM-fact echoes) for any verdict on visual work — layout, rendering,
  theming, or interaction behaviour. Use before claiming a visual
  surface renders correctly, before and after curing a visual defect,
  after placement or order changes, and before telling the owner a
  visual deliverable is done. Runs the design-showcase visual probe.
---

# Visual Verification

Rendered proof for design verdicts: how to produce, read, and pair the
artefacts that PDR-138 and the `visual-verdicts-require-rendered-proof`
rule demand. The design register's decision is DDR-011.

## When this skill fires

- You are about to claim anything about a visual surface: layout,
  rendering, theming, focus/interaction behaviour, "no regression".
- You are curing a visual defect (red proof first, green proof after).
- You changed anything that owns placement or order (grid areas, region
  markers, order-affecting CSS) — full-page render afterwards.
- You are about to tell the owner a visual deliverable is done.

## The instrument

The showcase hosts the probe (first host; the pattern ports per
workspace):

```bash
cd demos/oak-design-showcase
pnpm build                    # build the artefact under proof
pnpm exec next start -p 4600  # serve it — separate terminal, stays up
```

```bash
# then, against that same origin:
pnpm tool:visual-probe --origin http://localhost:4600 \
  --route /identity-switchboard --tabs 1
```

- The default origin is the workspace's deterministic per-worktree port
  (`tools/showcase-origin.ts`); pass `--origin` to probe a preview
  deployment instead. The probe never starts or stops servers.
- `--route` repeats; `--viewport 320x900` for narrow proofs (DDR-009
  canonical widths make renders comparable); `--full-page` for layout
  and composition claims; `--tabs <n>` presses Tab n times, captures the
  focus-state render, and echoes `document.activeElement` in-band.
- Artefacts default to a session temp directory. The render line on
  stdout names the route and artefact path; with `--tabs`, a second line
  adds the DOM-fact echo and the focus-state artefact path.

## Reading the proof

1. **Read the image first-hand** (the Read tool renders PNGs). A green
   suite tick is an invariant check, not a read; the verdict needs your
   eyes on the pixels.
2. **Interaction claims need the state visible on the pixels** — a focus
   ring, a revealed skip link, an opened control — AND the DOM-fact echo
   agreeing. Pixels without the fact, or the fact without pixels, is
   half a proof.
3. **Cure pairs**: capture red BEFORE touching the code (a Playwright
   failure screenshot from a red cell also serves), green after, same
   route and viewport, so the pair differs only in the claim.
4. **Proof is regenerated, never archived** (PDR-138): artefacts stay in
   scratch space. What persists is the instrument, the record, and any
   suite cell that now guards the invariant.

## Worked instance

The F01/F02 keyboard blackout (PR #846, 2026-08-13). Every code gate was
green; the first rendered artefact showed a beautiful page where 30 Tab
presses focused nothing. Red: the trail-of-`outside` failure screenshot.
Green: `--tabs 1` rendering the focus ring on `#picker-identity-select`,
echo `select#picker-identity-select`. Layout confirmation: `--full-page`
after the `data-region` row pin. The cure's cells now guard the class in
CI; the probe proved the specific claim at the moment of the verdict.
