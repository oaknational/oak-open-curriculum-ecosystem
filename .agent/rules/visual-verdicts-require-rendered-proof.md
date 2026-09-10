# Visual Verdicts Require Rendered Proof

Owner-ruled (2026-08-13, in-chat, verbatim): "verdicts on visual design
work without visual validation or proof are at best insufficient, at
worst, utterly and avoidably incorrect, without value and actively
misleading". Routed through
[`new-rule-vs-pdr-clause`](new-rule-vs-pdr-clause.md) at minting: a
standing behavioural rule because it fires at every assessment act on a
visual surface; the portable contract is PDR-138.

## Trigger

Issuing any assessment of visual work — "renders correctly", "looks
right", "no visual regression", an interaction-behaviour claim, a cure
sign-off on a UI surface, or an owner-facing "done" on a visual
deliverable.

## Action

1. Back the claim with a rendered artefact — a screenshot or rendered
   probe capture showing the claimed state on the pixels — and READ it
   first-hand before the verdict leaves you. A green browser-suite tick
   is an invariant check, not a read.
2. Pair interaction claims with a DOM-fact echo (e.g. `activeElement`)
   captured alongside the render, so pixels and DOM corroborate.
3. For cures: red proof before, green proof after. For placement or
   order changes: a full-page render after.
4. No artefact possible right now? Then the verdict is not available —
   say what is proven and what is not, instead.

**Claude.ai artifact pages — the render path that works (2026-08-19,
first-hand):** the INLINE artifact viewer swallows every programmatic
input to its sandboxed content frame — wheel scroll, keyboard paging,
accessibility refs (the frame reads as one opaque node) — so an inline
pixel-check stalls at the first viewport and reads as "the viewer
refuses to scroll". FULL-SCREEN mode scrolls normally. Enter
full-screen first, always, then walk the page. The same check caught a
renderer fact no local read can see: mermaid node labels have their
`<br/>` tags stripped with the words concatenated — write labels with
spaces and let the renderer wrap. Both facts are consumer's-resolver
facts: only the check that traverses the real viewer's own path can
prove or disprove them.

## Failure Mode Prevented

The F01/F02 keyboard blackout (PR #846): two demo pages shipped with
every control unreachable by keyboard behind a fully green quality
estate. Every code-level gate passed; the first rendered artefact showed
the defect immediately. Unproven visual verdicts read as assurance while
being, in the owner's words, actively misleading.
