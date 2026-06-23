# Static-Payload Terminal Animation & Shading — Techniques Reference

A consolidated write-up of the techniques developed in this session for producing
**animated and richly-shaded visuals in a terminal cell grid from a single static
payload** — specifically under the constraints of the Claude Code statusline, but
generalised so they apply to any ANSI/VT terminal surface.

The unifying problem: *you emit one string of bytes, once, and you cannot run a render
loop.* Everything here is about extracting motion, depth, colour, and apparent change
out of that one constraint.

---

## Table of contents

1. [The platform model & why it shapes everything](#1-the-platform-model)
2. [The blink primitive (SGR 5)](#2-the-blink-primitive)
3. [The two-frame model](#3-the-two-frame-model)
4. [Solid-block techniques: swap, π-offset, two-frame sprites](#4-solid-block-techniques)
5. [Braille as sub-cell halftone](#5-braille-as-sub-cell-halftone)
6. [Background as the static colour engine](#6-background-as-the-static-colour-engine)
7. [Colour & palettes](#7-colour--palettes)
8. [ΔL\* contrast tracking & per-cell shimmer amplitude](#8-deltal-contrast-tracking)
9. [Geometry & shading toolbox](#9-geometry--shading-toolbox)
10. [Workflow: previewing what you cannot see](#10-workflow)
11. [Consolidated limits & ceilings](#11-consolidated-limits)
12. [The final acorn — a worked composition](#12-the-final-acorn)
13. [Accessibility & reduce motion](#13-accessibility--reduce-motion)
14. [Appendix: quick reference](#appendix-quick-reference)

---

## 1. The platform model

Two facts dominate every design decision.

**The statusline is event-driven, not a render loop.** The script is re-run only when
conversation messages update, throttled to at most once every ~300 ms. (An earlier draft
said "only the first line of stdout becomes the statusline" — that is **wrong**, verified
2026-06-16 against the current Claude Code docs: each printed line becomes a statusline
row, so multi-line marks render.) There is no timer callback. Your script prints one frame
and exits. The practical ceiling for *script-driven* animation is
therefore ~3 fps, and only while something is actively updating — when idle, nothing
re-invokes you.

**The host is a render harness, not raw passthrough.** Claude Code's TUI is a React/Ink
fork: your string is parsed through its *own* ANSI/CSI/DEC/ESC/OSC parser into an
in-memory cell buffer, laid out with flexbox, double-buffered, diffed against the
previous frame, and only changed cells are flushed. Consequences:

- You cannot reach the raw terminal. Cursor-movement, alternate-screen, and DEC private
  modes embedded in your output are consumed by the harness's layout model, not executed
  against the physical terminal.
- The diff means a static payload produces a fixed set of cells that are never rewritten.
- **SGR attributes (colour, blink) are the reliable surface.** Truecolor backgrounds and
  foregrounds pass through. Whether `SGR 5` (blink) survives is host-dependent and is the
  single thing to test empirically — and it must be tested **in the statusline itself, not
  just in a terminal**, because (per this same section) the host is a render harness, not raw
  passthrough: a terminal that blinks does not prove the harness forwards blink into the
  statusline. See [§10 The blink-survival experiment](#the-blink-survival-experiment-run-this-first).
  **Tested 2026-06-16: the Claude Code statusline strips it — truecolor survives, blink does
  not (see [§10 Result](#result-observed-2026-06-16)).**

**Generalised takeaway:** treat the terminal as a *cell grid you write once*, where the
only attributes guaranteed to mean anything are per-cell foreground colour, background
colour, the glyph, and possibly blink. Design within that and you are portable.

### Self-perpetuating motion from one payload

A normal terminal is a parse-once, update-the-grid device — escape sequences execute at
parse time and the grid is then frozen. The only mechanisms that produce *ongoing*
time-variation from a single static emission are:

- **The blink attribute (SGR 5/6)** — the terminal toggles foreground visibility on its
  own clock. This is the workhorse (Section 2).
- **Terminal-side graphics-protocol animation** (e.g. the Kitty graphics protocol's frame
  animation) — real, but terminal-specific and generally stripped by a TUI harness.

Feedback-loop ideas (emitting a query like `\033[6n` so the terminal writes a response
back) do **not** create a usable loop: the response goes to the *application's* stdin,
not your already-exited script, and a host TUI owns that channel.

---

## 2. The blink primitive

`SGR 5` (`\033[5m`) is the one standardised way to get continuous, idle-capable motion
from a static payload. That same *idle-capable* property is the one accessibility liability
in this whole toolbox — a blink left on screen keeps blinking on the terminal's clock long
after the conversation goes quiet. Read [§13](#13-accessibility--reduce-motion) before
shipping blink as a resting frame. Critical properties:

- **Blink gates the foreground only.** The background is painted in *both* phases.
- **There is a single, free-running, global blink clock.** Every blinking cell shares one
  phase and one rate (~1–2 Hz, terminal-controlled). `SGR 6` ("rapid") is rarely a
  distinct rate in practice.
- **You cannot set per-cell timing, phase, or rate at emission.** You only choose, per
  cell, *whether* it participates and what its two states look like.

So a single payload buys you exactly two interleaved frames, alternating forever at a
rate you don't control, at 50% duty. Everything in Sections 3–8 is about getting
expressive range out of that.

```text
ESC[5m            enable blink (foreground toggles)
ESC[38;2;r;g;bm   truecolor foreground
ESC[48;2;r;g;bm   truecolor background
ESC[0m            reset
```

---

## 3. The two-frame model

A blinking cell alternates between:

- **"shown"** — the lit glyph drawn in `fg` over `bg`, and
- **"hidden"** — the whole cell at `bg`.

The most useful reframing: **you are authoring two independent frames, and every cell
independently chooses its appearance in each frame.** Frame A is the shown state; Frame B
is the hidden (background-only) state. The grid is Frame A ↔ Frame B forever.

What this *cannot* do, and why:

- **No intermediate states.** Two frames only; no third brightness, no per-cell rate.
- **No motion/translation.** A travelling wave, marquee, or unambiguous directional
  movement needs ≥3 phases. From one payload you get oscillation, twinkle, inversion, and
  2-frame "before/after" illusions — never translation.
- **No phase control** except the solid-block swap trick (Section 4), and even that is a
  single π offset, not arbitrary phase.

---

## 4. Solid-block techniques

When the glyph is a **solid block** (`█`, U+2588) the cell is filled in *both* phases,
because the "hidden" state shows a solid `bg` fill. This unlocks the richest blink
behaviour.

### 4.1 The fg/bg swap

A blinking `█` with `fg=A, bg=B` reads as **A in the on-phase, B in the off-phase** — a
clean two-colour alternation that fills the cell the whole time (no "disappearing").

### 4.2 The π-offset trick

Two adjacent cells:

- Cell 1: `fg=A, bg=B`
- Cell 2: `fg=B, bg=A`

Both blink on the *same* global clock, but they are **in anti-phase**: when Cell 1 shows
A, Cell 2 shows B, and vice versa. You have extracted a π phase difference from a single
clock purely through colour assignment.

### 4.3 Generalisation: a true two-frame sprite

Treat each cell's **fg as its Frame-A colour** and **bg as its Frame-B colour**. With
solid blocks you can author two genuinely different bitmaps that swap:

| Cell role            | Encoding (`█`)              | Frame A | Frame B |
|----------------------|-----------------------------|---------|---------|
| In Frame A only      | `fg=ink, bg=canvas`, blink  | ink     | canvas  |
| In Frame B only      | `fg=canvas, bg=ink`, blink  | canvas  | ink     |
| In both (overlap)    | `fg=ink, bg=ink`, no blink  | ink     | ink     |
| In neither (canvas)  | space on `bg=canvas`        | canvas  | canvas  |

This produces a 2-frame "GIF" from one static payload: shape-swap, recolour, or
appear/disappear, idle-capable, zero events. (This is exactly how the first acorn
"breathing" swap was built — two frames of a growing motif, overlap held solid, the
exclusive rims flipping in anti-phase.)

---

## 5. Braille as sub-cell halftone

Braille gives **2×4 = 8 addressable dots per character cell**, i.e. sub-cell resolution
without any graphics protocol. `char = chr(0x2800 + mask)` where `mask` ORs these bits:

```text
dot (x,y) -> bit          layout in the cell:
(0,0)=0x01  (1,0)=0x08      0x01  0x08
(0,1)=0x02  (1,1)=0x10      0x02  0x10
(0,2)=0x04  (1,2)=0x20      0x04  0x20
(0,3)=0x40  (1,3)=0x80      0x40  0x80
```

Two distinct uses:

- **Shape at sub-cell resolution.** Rendering existing braille art (or any 2×4-sampled
  bitmap) keeps fine detail that whole-cell background fills cannot. *This is the
  readability lever:* when a shape looks "blocky," it's because tone is being carried by
  per-cell backgrounds; move it into braille foreground and detail returns.
- **Halftone / density gradients.** The *number* of lit dots per cell encodes tone, like a
  Ben-Day or newsprint screen. Combined with a coloured background, you get colour from
  the background and shading/texture from dot density on top.

### 5.1 Dithered density gradients

To fade a field smoothly, light each dot when a continuous intensity beats a stable
per-dot noise threshold:

```python
def lit(intensity, x, y):           # x,y in dot coordinates
    return intensity > 0.20 + hash01(x, y) * 0.40   # stable hash in [0,1)
```

Dense where intensity is high, scattering to sparse specks as it falls — the density
gradient *is* the glow falloff. Use a deterministic hash (not `random`) so the pattern is
stable across renders.

### 5.2 Braille + blink interaction (important)

The fg/bg **swap trick does not work cleanly for braille.** A braille glyph's "hidden"
phase shows a *solid* background-coloured cell (all 8 dots' worth), which destroys the
dotted texture and reads as a flashing square. So:

- **Solid blocks** → use fg/bg swap and anti-phase.
- **Braille** → use plain blink-on-background (bloom / fade): the dots appear in the
  on-phase and dissolve to background in the off-phase.

---

## 6. Background as the static colour engine

Because **blink gates only the foreground, the background is an inherently static
layer.** This is a feature, not a limitation. It gives a clean division of labour:

- **Background = smooth colour and gradients.** Radial washes, hue fields, vignettes —
  anything continuous. Guaranteed not to flicker.
- **Foreground (braille/blocks) = texture, halftone, and the only thing that can move.**

So the recipe for "rich static image + subtle motion" is: paint the colour story in the
backgrounds, lay a halftone of foreground dots over it, and let *some* of those
foreground dots blink. The colour never strobes; only the texture breathes. (This is how
the polychrome starburst worked: the rainbow lived entirely in the backgrounds, the
braille was the Ben-Day layer, and only the outer-spoke glints carried `SGR 5`.)

---

## 7. Colour & palettes

### 7.1 Truecolor

`ESC[38;2;r;g;bm` (fg) and `ESC[48;2;r;g;bm` (bg). 24-bit colour passes through most modern
hosts including the Claude Code renderer.

### 7.2 Precomputed ramps in linear light

Build a palette once. Interpolate **in linear-light** (not gamma space) for physically
sensible blends, then gamma-encode back to sRGB:

```python
def srgb_to_linear(c):  # c in 0..255
    c /= 255
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4

def linear_to_srgb(c):
    c = max(0.0, min(1.0, c))
    return 255*(12.92*c if c <= 0.0031308 else 1.055*c**(1/2.4) - 0.055)
```

A green→black ramp is just `top_linear * (i/(N-1))` for `i` in `0..N-1`, gamma-encoded.

### 7.3 Perceptual L\* for contrast decisions

Convert luminance to CIE **L\*** so that "how different do these two colours look" is
computed perceptually rather than in naive RGB:

```python
def Lstar(Y):  # Y = linear luminance 0..1 (0.2126 R + 0.7152 G + 0.0722 B)
    f = Y**(1/3) if Y > 0.008856 else 7.787*Y + 16/116
    return 116*f - 16
```

Precompute `L*` for every palette entry, then offer two lookups:

- `by_value(v)` → index by linear-light fraction (for setting brightness), and
- `by_L(target)` → nearest entry to a target `L*` (for hitting a contrast/legibility goal).

### 7.4 HSV hue wheels

For polychrome fields (e.g. N spokes each a different hue), sample `hsv_to_rgb(h, s, v)`
with `h` from the spoke index and `v` driven by the intensity field. Keep one element
(the subject) a fixed hue so it stays legible against the rainbow.

---

## 8. ΔL\* contrast tracking

This is the central insight that makes a binary clock expressive.

### 8.1 The amplitude identity

The **perceived magnitude of a cell's blink** is governed by how far its foreground sits
from its background, weighted by how many dots are lit:

```text
apparent change  ≈  dot_density × ΔL*(fg, bg)
```

Both factors are yours to set **per cell, independently**:

- **ΔL\*** — a *continuous* dial. fg≈bg → the blink is nearly invisible even with `SGR 5`
  set; fg far from bg → a hard pop.
- **dot density** — quantised in eighths (braille), from a barely-there single dot to a
  full `⣿`.

Multiply them and you get a **near-continuous field of "blink amplitude" painted across
the grid**, even though the underlying clock is a single global on/off with only two
states. You are not animating shape or motion — you are animating *contrast*, by whatever
amount you choose, anywhere you choose.

### 8.2 Authoring a shimmer gradient

Drive `ΔL*` from a spatial field. For example, make amplitude follow a glow's luminance
falloff so the flicker is zero against a "calm" region and rises smoothly outward:

```python
A  = smoothstep((dist - r_inner) / (r_outer - r_inner))   # 0 calm → 1 active
dL = LEG + (SHIM - LEG) * A                                # per-cell target ΔL*
fg = palette[by_L(bg_Lstar + dL)]                          # pick fg to hit that gap
```

This yields a soft shimmer that fades smoothly into a static region with **no hard
boundary** between "blinking" and "not blinking."

### 8.3 Two independent ways to pin a cell static

1. Don't set `SGR 5`, **or**
2. Collapse its fg–bg gap (`ΔL*→0`).

Using both ("belt and suspenders") guarantees a region reads as dead-steady even if a
stray blink attribute leaks in.

### 8.4 Legibility optimisation

Selecting fg by **`by_L(bg_Lstar + target)`** rather than by RGB keeps a roughly constant
*perceived* separation between dots and their background across the whole brightness
range — the halftone stays readable in dim regions and never blows out in bright ones.

### 8.5 The honest limit

You modulate **amplitude** continuously, but it is still **two states, 50% duty, one
shared clock**. You control *how much* each cell changes and *what* it changes between,
but not the *waveform*, the *phase* (except the solid-block swap), or the *timing*.

---

## 9. Geometry & shading toolbox

All of these treat the cell grid as a sampled 2-D field and compute per-cell values from
geometry. They are independent of the animation layer and work equally well for purely
static art.

### 9.1 Screen-isotropic coordinates

Character cells are roughly **1 wide : 2 tall**, and braille dots are 2×4. To make circles
round and distances meaningful, map to isotropic screen units before doing geometry —
e.g. treat a cell centre as `(cx, 2*cy)`, or a braille dot as `(dot_x*0.5, dot_y*0.5)`.
Skipping this squashes every radial effect vertically.

### 9.2 Radial fields

- **From a centroid** — simple glow/pulse.
- **To the nearest shape pixel** (distance transform) — a halo that *hugs the silhouette*
  rather than forming a circle around its centre. Compute at dot resolution for a halo that
  follows fine detail.

### 9.3 Angular spoke / starburst fields

Pick `N` spoke angles; a cell's spoke strength is a peaked function of angular distance to
the nearest spoke axis:

```python
s = exp(-(angle_to_nearest_spoke / width)**2)   # narrow width → crisp rays
I = radial_falloff(r) * (base + (1-base)*s)      # rays brightest, valleys dim
```

Assign each spoke a hue (Section 7.4) for a polychrome burst.

### 9.4 Umbra / dark moat

To make a glow (or a subject) "pop," force a **dark band between the subject and its
glow** by multiplying the decaying glow field by a suppression term that is zero near the
surface:

```python
glow = max(0, 1 - dist/RG) * smoothstep((dist - U) / W)
#      \__ overall falloff __/  \__ 0 within the umbra width U, rising after __/
```

The result crossing outward is: subject → black moat → glow ridge → fade. Pure contrast
doing the work. Widen `U` for a stronger moat.

### 9.5 Skeleton / medial-axis shading (tube lighting)

To shade a *stroke* as if it were a rounded tube, use the **distance-to-edge** (Euclidean
distance transform inside the shape). It is **maximal along the medial axis (the
centreline) and falls to zero at the flanks**, so brightness becomes a linear function of
*perpendicular offset across the stroke*: bright spine, dim edges. Thick parts glow at
their core; thin filaments stay dim. This is "linearly radial perpendicular to the centre
of the curve" — genuinely shape-aware, with no centroid involved.

### 9.6 Directional lighting & warm/cool tint

For a light coming from a specific direction:

- Approximate each stroke cell's **outward normal** as the direction to its nearest
  background cell.
- `lit = dot(normal, light_dir)` → the flank facing the light brightens, the far flank
  darkens.
- **Warm/cool tint:** drive a small hue shift from `lit` — push the lit flank toward
  warm (e.g. +red, −blue → yellow-green) and the shadow flank toward cool (+blue → teal).
  A hair of hue reads as directional light far more convincingly than brightness alone, and
  keeps an otherwise monochrome piece feeling lit rather than repainted.

### 9.7 Morphological close

`dilate` then `erode` (8-connectivity) fills 1-cell pinholes and gaps so a dotty stroke
reads as a solid ribbon — useful before distance transforms or topology so small holes
don't create artefacts.

### 9.8 Flood-fill topology: isolating a bounded interior

To treat the region *enclosed by* a curve differently from the outside, flood-fill the
background from the canvas border (4-connectivity, treating the shape as walls). Anything
**not** reached is enclosed:

```text
exterior = border-connected background
interior = background AND NOT exterior   # the region bounded by the curve
```

You can then pin the interior to a constant (e.g. pure black, no foreground, no blink) so
it is provably steady, independent of whatever the exterior glow is doing.

---

## 10. Workflow

You **cannot see blink in a static render**, so build a preview pipeline alongside the
payload:

- **Two-phase GIF.** Render the on-phase and off-phase as images and alternate them
  (~600 ms each) to approximate the effect. Remember the real terminal picks its own rate;
  the GIF is idealised.
- **Amplitude map.** Render a separate image where each cell's brightness is its computed
  `density × ΔL*`. This visualises the *shimmer-amplitude field* directly — black where
  nothing changes, bright where it changes most — which is invaluable for confirming, e.g.,
  that a subject is truly static and the motion is confined to a halo.
- **Self-contained script.** Bake the payload into a shell script that consumes the stdin
  JSON and prints the bytes:

  ```bash
  #!/usr/bin/env bash
  cat > /dev/null 2>&1          # consume the statusline's stdin JSON
  printf '%b\n' $'<escaped payload with \033 ... and \n line breaks>'
  ```

- **Run the blink-survival experiment first.** This is the go/no-go gate for the whole
  animation layer — see [the procedure and result table](#the-blink-survival-experiment-run-this-first)
  immediately below. Do not invest in any composition until it passes.

### The blink-survival experiment (run this first)

Everything animated in this toolkit rides on one unverified fact: whether `SGR 5` survives
the Claude Code statusline render path. This is the **go/no-go gate** — run it before
investing in any composition, and re-run it after every Claude Code upgrade. It is **not**
the same question as "does my terminal blink": the statusline is parsed by the host's Ink
renderer into its own cell buffer (§1), not handed raw to the terminal, so terminal blink
support is necessary but not sufficient. The terminal-only test that earlier versions of this
doc recommended can pass while the statusline stays dead — the experiment below exists to
catch exactly that.

**Step 1 — probe payload.** Save an executable `~/.claude/blink-probe.sh`:

```bash
#!/usr/bin/env bash
cat > /dev/null 2>&1                 # consume the statusline's stdin JSON
printf '%b\n' '\033[5;38;2;220;40;40mBLINK\033[0m \033[38;2;128;128;128msteady\033[0m'
```

**Step 2 — wire it into the statusline.** Save your existing `statusLine` block first, then
point `~/.claude/settings.json` at the probe and trigger a render by sending a message:

```json
{ "statusLine": { "type": "command", "command": "~/.claude/blink-probe.sh", "padding": 0 } }
```

**Step 3 — observe, with the terminal run as a control.** Also run the same script directly
in the terminal (`bash ~/.claude/blink-probe.sh < /dev/null`) and read the two surfaces
together:

| Terminal (direct) | Statusline (in-host) | Verdict |
|-------------------|----------------------|---------|
| `BLINK` blinks | `BLINK` blinks | **GO** — `SGR 5` survives the host; the full toolkit animates. |
| `BLINK` blinks | `BLINK` steady (still red) | **NO-GO for blink** — the host forwards colour but strips blink. A terminal-only test would have *falsely* predicted success. Fall back to event-driven frame stepping (≤3 fps, active-only). |
| `BLINK` steady | (not reached) | Terminal lacks blink support; the statusline cannot animate via `SGR 5` either. |

The middle row is the trap this experiment exists to catch: **a passing terminal test does
not imply a passing statusline.** Restore your real `statusLine` block afterwards.

### Result (observed 2026-06-16)

This experiment was run for the first time on 2026-06-16. **Verdict: NO-GO for the Claude
Code statusline — the host renderer strips `SGR 5`.** Recorded here so the next reader
inherits the finding rather than re-deriving it.

**Terminal layer — blink is emulator-config-contingent, and was available in all three
terminals tested.** Out of the box only macOS Terminal.app animates `SGR 5`; iTerm2 and the
Cursor / VS Code integrated terminal render it steady *by default*, but each exposes a setting
that enables it:

- **macOS Terminal.app** — on by default.
- **iTerm2** — Settings → Profiles → Text → "Allow blinking text"
  ([docs](https://iterm2.com/documentation-preferences-profiles-text.html)).
- **Cursor / VS Code integrated terminal** — enable-able via a terminal setting (confirmed
  first-hand). An earlier draft of this note claimed xterm.js could not blink at all; that was
  based on stale 2019–2023 issue threads and is wrong as of mid-2026 — do not repeat it.

So "the terminal can't blink" is never the real blocker — it is a checkbox.

**Host layer — the statusline strips blink regardless.** With blink enabled in the Cursor
integrated terminal and the probe wired into the statusline: the probe **blinks when run
directly in that terminal**, but the **statusline stays steady**. The red `BLINK` text is
present (truecolor survives) — only the blink attribute is gone. Because the same terminal
blinks the same bytes when they bypass the host, `SGR 5` is being dropped by Claude Code's
render harness before the terminal ever sees it: the middle row above, and exactly the failure
a terminal-only test would have hidden.

**Consequences.**

- **No blink-based animation in the statusline, on any terminal** — the breathing / twinkle /
  shimmer motion in all five pieces does not animate here. (The techniques remain valid for a
  *direct* terminal surface; this verdict is specific to the Claude Code statusline.)
- **Static compositions are unaffected** — colour, gradients, halftone, shading, umbra ride on
  truecolor, which the host forwards intact.
- **Statusline motion must use the event-driven fallback** — script-driven frame stepping at
  ≤3 fps while the conversation is active (§1, §13), which is also the WCAG-aligned default.

**Scope.** Blink survival is host-version-dependent; this was observed against the Claude Code
build current on 2026-06-16. Re-run the experiment after a Claude Code upgrade before assuming
it still holds.

---

## 11. Consolidated limits

Keep these in view when designing; they are properties of the medium, not bugs.

- **Two frames only**, one shared clock, **50% duty**, at the **terminal's rate** (~1–2 Hz),
  which you cannot set.
- **No phase** except the solid-block fg/bg swap (a single π offset), and that swap is
  unavailable to braille without destroying its texture.
- **No translation / motion / marquee** — those need ≥3 phases.
- **Per-cell you control amplitude** (continuously, via `density × ΔL*`) **but not waveform,
  phase, or timing.**
- **Backgrounds can never blink** — which is exactly why they're the right home for static
  colour.
- **Everything animated rides on `SGR 5` surviving the host renderer.** Truecolor
  fg/bg almost always survive; blink is the variable, so prove it with the
  [§10 blink-survival experiment](#the-blink-survival-experiment-run-this-first) before
  relying on any motion — which, in the Claude Code statusline, was observed on 2026-06-16
  *not* to survive ([§10 Result](#result-observed-2026-06-16)). A correct design degrades
  gracefully: if blink is stripped, the full static composition still renders and only the
  motion is lost.

---

## 12. The final acorn

The final piece is a worked example that layers most of the toolbox into one composition:
a monochrome green emblem — a braille swirl, side-lit, sitting in a black moat with a
softly breathing halo.

### 12.1 Layer stack

| Layer | Technique | Animated? |
|-------|-----------|-----------|
| **Palette** | Precomputed green→black ramp in linear light, with a per-entry `L*` table and `by_value` / `by_L` lookups (§7.2–7.3) | — |
| **Curve (ribbon)** | The *original braille glyphs* as a sub-cell halftone for readability (§5), backgrounds pure black so only the green dots define the stroke | No — fully static |
| **Curve shading** | Subtle directional light: outward-normal · light vector, with a warm (lime) lit flank and cool (teal) shadow flank (§9.6) | No |
| **Bounded interior** | Border flood-fill isolates the region enclosed by the swirl; pinned to constant pure black, no foreground, no blink (§9.8) | No — provably steady |
| **Umbra** | A widened dark moat hugging the curve, via a zero-near-surface suppression term (§9.4) | No |
| **Glow** | Distance-to-curve field, dithered braille halftone, fading outward (§5.1, §9.2) | — |
| **Shimmer** | `ΔL*`-graded blink amplitude over the glow: zero at the umbra edge, rising outward, so the halo breathes while everything inward is calm (§8.2) | **Yes — the only moving layer** |

### 12.2 Why it reads well

- **Readability** comes from putting the shape in braille foreground (halftone), *not*
  whole-cell backgrounds — the lesson from an earlier blocky version that used a background
  wash for the body.
- **Depth** comes from the medial-axis-aware directional light plus the warm/cool hue
  split — the swirl looks lit from one side rather than flatly filled.
- **Focus** comes from the umbra: a band of pure black isolates the bright curve from the
  halo, so both read crisply through contrast alone.
- **Calm + life** comes from the layer discipline: the subject and its enclosed interior
  are pinned static (two ways — no blink *and*, for the interior, a flat colour), while the
  only motion is a soft `ΔL*`-graded shimmer banished to the outer mist.

### 12.3 Build pipeline (order of operations)

1. Parse the braille art into an ink mask; record each cell's original glyph.
2. Flood-fill from the border → classify every cell as **ink / interior / exterior**.
3. Precompute the green→black palette and its `L*` table.
4. **Ink cells:** shade by outward-normal·light (subtle amplitude), apply warm/cool tint,
   draw the original glyph on a black background. No blink.
5. **Interior cells:** emit a space on constant pure-black. No blink.
6. **Exterior cells:** compute distance-to-curve → umbra-suppressed glow field → dither a
   braille halftone → set per-cell `ΔL*` from the outward-rising amplitude `A` → blink where
   `A` exceeds a small threshold.
7. Emit one SGR sequence per cell (`fg;bg[;5]`), reset at each line end, join with newlines.
8. Render on/off phases to a preview GIF and (optionally) an amplitude map; bake the bytes
   into a `printf '%b'` shell script.

### 12.4 Parameters used (for reference / tuning)

- Glow reach `RG ≈ 5.4`, umbra width `U ≈ 1.35`, umbra transition `W ≈ 1.4` (screen units).
- Directional light amplitude `AMP ≈ 0.17` on the ramp; light from upper-left.
- Shimmer `ΔL*` from `LEG ≈ 14` (calm/legibility floor) up to `SHIM ≈ 46` (outer edge).
- Palette `N = 48` entries; isotropic coords via `(cx, 2·cy)`.

The three knobs most worth touching by eye in a live terminal: `AMP` (light strength), the
warm/cool tint multipliers (hue drift), and the light direction vector.

---

## 13. Accessibility & reduce motion

Animation is never free of an accessibility cost. A user who has asked their system to
minimise motion (vestibular disorders, attention/seizure sensitivity, or simple preference)
must be able to get a still image. WCAG 2.2
[**2.2.2 Pause, Stop, Hide**](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
is explicit: any content that blinks or moves automatically for more than five seconds must
be pausable, stoppable, or hideable. So every animated payload here ships with a static fallback and a
documented override, and the static frame is treated as the default, not an afterthought.

### 13.1 Two clocks — and only one is a problem

The statusline is a *sampled* surface (§1): the host re-runs the script at message-update
boundaries, throttled to ~300 ms, and **stops sampling entirely when the conversation is
idle**. That gives two independent clocks:

- **The event clock** — drives *script-driven* frame stepping (pick the frame from time or
  state at each emission). It inherits the host's pauses: when the conversation settles, no
  new emission fires, so the last frame simply freezes. Script-driven motion is therefore
  **self-limiting** — it cannot run unattended past the activity that produced it, which is
  exactly what 2.2.2 asks for.
- **The terminal's blink clock** — drives `SGR 5`. It is free-running and *not ours*: once a
  blinking payload is on screen it keeps toggling on the terminal's own clock, surviving our
  script's exit and the event clock's idle pause.

The accessibility exposure localises entirely to one quadrant: **an `SGR 5` payload left as
the resting/idle frame.** That is the only motion in this toolbox that outlives the event
which produced it and runs unattended past five seconds. We cannot offer a pause button for
it because we do not own its clock — the only control is *not to emit it*.

### 13.2 The override

Every generated `statusline/*.sh` honours an environment variable:

```bash
OAK_STATUSLINE_MOTION=off    # also accepts: static | none | reduce
```

When set, the script emits the **static on-phase frame with every `SGR 5` stripped**; unset
(or `auto`) keeps the animation. The fallback is cheap because it already exists: each piece
is built so "the static frame is the on-phase and stands on its own" (Graceful degradation,
§11), so the override just *selects the still the design already produces* — no separate art.

Resolution order, cheapest first:

1. **`OAK_STATUSLINE_MOTION`** — a pure environment read, zero cost per emission. This is the
   primary, portable override; set it in `~/.claude/settings.json`'s `env` block or a shell
   profile.
2. **OS reduce-motion setting (optional bridge)** — there is *no* portable env var or shell
   API for the OS preference ([`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
   is CSS-only), but the setting is readable per platform:
   - macOS: `defaults read com.apple.universalaccess reduceMotion` → `1` when enabled.
   - GNOME: `gsettings get org.gnome.desktop.interface enable-animations` → `false` when
     reduce-motion is on (verify on the target desktop).

   Resolve it **once per session** in a `SessionStart` hook and write the result into
   `OAK_STATUSLINE_MOTION`. **Never poll the OS per emission** — spawning `defaults`/`gsettings`
   every ~300 ms is an unbounded-host-load anti-pattern.

### 13.3 Default posture

For the statusline specifically: prefer **script-driven frame stepping or a static frame as
the resting content**, and reserve `SGR 5` for genuinely transient or splash contexts. Never
leave a blinking payload as the settled state. Combined with the override, that keeps the
default WCAG-aligned while still allowing rich animation while the conversation is active.

### 13.4 References

- WCAG 2.2 — Understanding SC 2.2.2 Pause, Stop, Hide:
  <https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html>
- `prefers-reduced-motion` (CSS media feature; not exposed to shells) — MDN:
  <https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion>
- macOS `defaults` keys (incl. `com.apple.universalaccess reduceMotion`) — ss64:
  <https://ss64.com/mac/syntax-defaults.html>

---

## Appendix: quick reference

### SGR sequences

```text
ESC = \033 = \x1b = \e
ESC[0m              reset all
ESC[5m              blink (foreground toggles on the terminal's clock)
ESC[38;2;r;g;bm     truecolor foreground
ESC[48;2;r;g;bm     truecolor background
```

### Braille (U+2800 + mask)

```text
(0,0)=0x01  (1,0)=0x08
(0,1)=0x02  (1,1)=0x10
(0,2)=0x04  (1,2)=0x20
(0,3)=0x40  (1,3)=0x80
char = chr(0x2800 + mask)
█ = U+2588 (full block, for swap/anti-phase)
```

### The one identity to remember

```text
apparent per-cell change between frames  ≈  dot_density × ΔL*(fg, bg)

  → density and ΔL* are both per-cell and independent
  → backgrounds never blink, so they hold static colour
  → pin a cell static by: no blink, or ΔL* → 0 (use both to be sure)
  → it's still 2 states, 50% duty, one clock: amplitude is yours, timing is not
```

### Graceful degradation

If the host strips `SGR 5`: the entire static composition (colours, gradients, halftone,
shading, umbra) still renders correctly; only the breathing/twinkle is lost. Design so the
static frame is the on-phase and stands on its own.
