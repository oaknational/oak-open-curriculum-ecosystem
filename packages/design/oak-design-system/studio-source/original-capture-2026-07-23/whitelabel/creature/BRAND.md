# Educate My Creature Too — brand definition

Fictional. One of two counter-brands proving the white-label contract. Its identity was drawn on a blank canvas first; the tokens follow from it — and it is designed to be as far from Oak as a realistic education brand can be, in identity AND mechanism, so the two distances compound.

## Identity, from a blank canvas

EMC is not a resources site. It's a **pocket world** — closer to a game cartridge or a virtual pet than to a lesson library. An impact-funded edtech startup that set out to "gamify learning" (a concept they'll eventually admit is meaningless) and ended up somewhere better: a place some children *choose* to be, where practice happens because the creature makes progress visible and kind. Its native habitat is a child's evening: a tablet on a sofa, a screen in a dim room. It is pupil-first, screen-native, nocturnal, animate.

Oak is: daylight, paper, staffroom, teacher-first, calm authority. EMC is the far pole on every one of those axes — deliberately.

## Desired impact

- A pupil who bounced off "boring" sites returns tomorrow without being told to.
- Practice happens through warmth and immediacy — never streak pressure or dark patterns.
- Grown-ups trust it: no ads, no manipulation, reading-age-appropriate copy.

## Mechanism distance (each choice traceable, compounding the identity distance)

- **Structure is brand** (v4): two-column toy-shelf flow (`--flow-columns: 1fr 1fr`), key items full-width and centred (`--key-align/justify: center`), candy tone-bands with DIAGONAL gradients (`--band-*`), angled bevelled shadows (8px 10px + glow), sticker rotations on shelf cards. Decoration is a layer, not a sin — and never carries text contrast.
- **Dark-first polarity** (`color-scheme: dark` — the contract's polarity lever): the bedtime-glow arcade is the default face; "light" is the daylight mode, one explicit choice away. Oak is light-first; this is the single biggest structural separation.
- **Toy physicality**: bubblegum-faced primary buttons with plum text (a toy button, not ink-on-paper); pill controls; 28px card radii; 3px borders; straight-down candy-drop shadows — things sit on the shelf, nothing floats on paper.
- **Tags are gummy sweets**, bordered with candy-drop shadows — never Oak's borderless lozenge (the form test: unrecognisable with the colours stripped).
- **Pupil-first motor skills** → `--size-target: 56px` (above the 48px default).
- **A voice that sounds read-aloud** → Baloo 2 display at 800, Nunito body at 400+ (no light weights; young readers).
- **Chunky filled icons** → Material Symbols Rounded, FILL 1, via currentColor (`icons.css`).
- **Reward without pressure** → decorative surfaces celebrate; functional state colours stay Oak's (correct/incorrect must be unmistakable; the colour-safe theme still remaps them).

## Invariants (not brand surface)

WCAG 2.2 AA in all four themes and BOTH polarities (audit-checked), double focus ring, quiet motion honouring the motion axis, state never colour alone, sentence case.


**Elevation stays in the plum world** (contract paper rule, July 2026): --bg-btn-secondary is the page sheet; --bg-raised/--bg-overlay lift by lightening the plum (#3a2a3b), never Oak's cool greys. Audited 34/34 AA in all four themes after the fix.

**Refinement pass (July 2026, user-directed):** glow discipline — crisp candy offsets at rest, the ambient glow reserved for hover/featured as a reward; bands square (`--band-radius:0` — rounded full-bleed bands made "ears" against the masthead rule); the utility strip joined the nocturne (§expression `.util` → subtle plum, no inverted cream flash); dark sherbet-lemon de-mudded to butterscotch (#6d4715 family — dark yellows always go olive; shift the hue amber instead).