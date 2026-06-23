# Oak Acorn Logo — Text Renderings

This document records text-glyph renderings of the Oak National Academy acorn
logo for use in terminals, markdown, READMEs, code comments, status lines, and
other text-only contexts.

The **SVG is the source of truth**. Every rendering below is produced by
rasterising that SVG and converting the pixels to glyphs — not by drawing the
shape freehand. The regeneration recipe is included so any future version is
derived from the source rather than re-imagined.

## Aim

The goal is not a pixel-faithful rasterisation. The goal is **human
recognition**: a text version that still reads as the Oak acorn.

## What the icon actually is

Rasterising the SVG shows the logo clearly, and it is important to be precise
because freehand attempts get it wrong (see [Why freehand failed](#why-freehand-attempts-failed)):

- It is a **thin-stroke, open line drawing**, not a solid filled shape. The
  mark is mostly negative space — a contour, not a mass.
- The body is an **open acorn cup** — a rounded vessel that is **open at the
  top** and has a **rounded bottom** (no central point).
- A **separate leaf** (an almond/eye shape) sits at the **upper right**,
  overlapping the rim.
- A small **sprouting stem** curls up from the top.
- The mark is **taller than it is wide** (viewBox `31 × 42`, ratio ≈ 0.74).

The essential cues a faithful rendering must keep: open contour (hollow
interior), rounded bottom, open top rim, a distinct upper-right leaf, and a
separate top sprout.

---

## Original SVG

Copyright (c) 2026 Oak National Academy. All rights reserved.

```svg
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 31 42"><path fill="#222" d="M16.983 7.132c.86.15 1.602.243 2.328.41a14.603 14.603 0 0 1 8.09 4.962 14.964 14.964 0 0 1 3.513 8.535c.05.58.082 1.16.092 1.74.012.627-.086.738-.676.824-2.213.32-4.468.142-6.604-.521a14.775 14.775 0 0 1-3.871-1.838 13.412 13.412 0 0 1-3.74-3.803 13.242 13.242 0 0 1-2.07-5.484c-.107-.711-.124-1.434-.191-2.234a12.84 12.84 0 0 0-6.444 3.065c-2.65 2.319-4.192 5.265-4.748 8.808.536.108 1.029.224 1.532.303.447.07.71.243.724.76.046 1.658.345 3.3.887 4.865a31.677 31.677 0 0 0 1.983 4.418 16.044 16.044 0 0 0 4.608 5.383 17.559 17.559 0 0 0 3.214 1.861c.383.17 1.015-.104 1.483-.301a13.611 13.611 0 0 0 5.595-4.23c.835-1.077 1.497-2.307 2.12-3.529.755-1.482 1.063-3.115 1.258-4.761.039-.323.15-.454.481-.423.396.04.794.05 1.191.034.474-.025.675.223.613.638-.191 1.314-.306 2.66-.67 3.927a16.896 16.896 0 0 1-4.344 7.268 15.366 15.366 0 0 1-6.6 4.002c-.504.15-.926-.028-1.372-.176-2.78-.924-5.066-2.6-6.995-4.773a28.75 28.75 0 0 1-2.51-3.27 20.02 20.02 0 0 1-2.158-4.435 18.563 18.563 0 0 1-1.074-5.01.49.49 0 0 0-.303-.325c-.592-.194-1.197-.327-1.795-.493a.613.613 0 0 1-.516-.484.628.628 0 0 1-.003-.25c.154-2.56.889-5.05 2.147-7.278a16.25 16.25 0 0 1 4.174-4.84 15.682 15.682 0 0 1 6.32-2.969 1.19 1.19 0 0 1 .326-.071c1.117.102 1.404-.63 1.682-1.53a11.998 11.998 0 0 1 3.683-5.58c.5-.436.564-.436 1.01 0 .26.26.511.53.755.804.361.41.361.594-.048.967-.947.895-1.73 1.95-2.316 3.119-.286.624-.54 1.264-.76 1.915ZM28.538 21.4c-.032-.174-.065-.312-.084-.45a13.55 13.55 0 0 0-2.01-5.466 12.892 12.892 0 0 0-5.012-4.62A12.335 12.335 0 0 0 17 9.605c-.272-.03-.42.046-.414.36.056 2.427.701 4.674 2.12 6.64a11.662 11.662 0 0 0 5.268 4.082c1.465.58 2.978.754 4.564.713Z"/></svg>
```

---

## Method — convert, don't draw

The renderings are produced by a deterministic pipeline:

1. Rasterise the SVG on a white background at high resolution.
2. Lay a dot grid over it, sized to preserve the source aspect ratio.
3. For each dot, measure the **fraction of dark (ink) pixels** in its
   sub-block (area coverage, not point sampling — this is what preserves the
   thin strokes that point sampling drops).
4. Set the dot where coverage passes a threshold.
5. Pack dots into glyphs — Braille (2 × 4 dots per cell, highest density) or
   quadrant blocks (2 × 2 dots per cell).

Because the source is line-art, area-coverage conversion naturally produces a
contour: the interior stays empty and the leaf and sprout survive as their own
strokes.

### Regeneration recipe

Save the SVG as `acorn.svg`, then run this (requires `rsvg-convert` and Pillow);
it prints the Braille rendering at the requested line count:

```python
import subprocess, sys
from PIL import Image

ASPECT, SS = 31 / 42, 6  # source W:H ratio; supersample per dot
SVG = sys.argv[1] if len(sys.argv) > 1 else "acorn.svg"
ROWS = int(sys.argv[2]) if len(sys.argv) > 2 else 16
COV = 0.16  # min ink coverage to set a dot

def coverage(dw, dh):
    subprocess.run(["rsvg-convert", "-w", str(dw * SS), "-h", str(dh * SS),
                    "-b", "white", SVG, "-o", "_hi.png"], check=True)
    px = Image.open("_hi.png").convert("L").load()
    g = [[0.0] * dw for _ in range(dh)]
    for y in range(dh):
        for x in range(dw):
            dark = sum(px[sx, sy] < 140
                       for sy in range(y * SS, (y + 1) * SS)
                       for sx in range(x * SS, (x + 1) * SS))
            g[y][x] = dark / (SS * SS)
    return g

BITS = {(0, 0): 0x01, (0, 1): 0x02, (0, 2): 0x04, (0, 3): 0x40,
        (1, 0): 0x08, (1, 1): 0x10, (1, 2): 0x20, (1, 3): 0x80}
dh = ROWS * 4
dw = round(dh * ASPECT) + (round(dh * ASPECT) % 2)
g = coverage(dw, dh)
for cy in range(ROWS):
    line = ""
    for cx in range(dw // 2):
        bits = sum(b for (lx, ly), b in BITS.items()
                   if g[cy * 4 + ly][cx * 2 + lx] >= COV)
        line += chr(0x2800 + bits)
    print(line)
```

### Why freehand attempts failed

Earlier renderings were drawn by hand from a mental image and inverted the two
defining features: they filled the interior into a **solid blob** and tapered
the base to a **sharp central point**. The real mark is an **open contour** with
a **rounded bottom**. The lesson: convert from the rasterised source and verify
by rendering the glyphs back to an image — never reconstruct the shape from
memory.

### Proportions are inherited — no ratio tuning needed

Because the pipeline rasterises at exactly the source aspect ratio (`31/42`),
the rasterisation has zero squash and the acorn fills the frame (measured:
100% width, 99.7% height, negligible padding). Every internal proportion — cup
width, leaf placement, rounded base — is therefore inherited from the source
pixel-for-pixel. There is nothing to constrain with hand-measured ratios; that
was a tool for the freehand era. The only proportion with real slack is the
**display** cell-aspect ratio (terminal- and font-dependent, roughly 1:2, and
not measurable from the source), which the recipe handles by assuming square
Braille dots. The regression guard is the render-back-and-compare step — it
catches shape errors that a ratio check never would.

### Glyph families

Four glyph families can carry the same conversion, trading resolution against
font support:

| Family               | Dots / cell | Resolution             | Font support                                                |
| -------------------- | ----------- | ---------------------- | ----------------------------------------------------------- |
| Braille (`⠿`)        | 2 × 4       | highest                | near-universal (U+2800 block)                               |
| Sextant (`🬀`)        | 2 × 3       | high, renders **solid** | modern terminals/fonts only (U+1FB00 Symbols for Legacy Computing) |
| Quadrant (`▟`)       | 2 × 2       | medium, solid          | universal (U+2580 block)                                    |
| Half-block (`▀` `▄`) | 1 × 2       | low, solid             | universal (U+2580 block)                                    |

The counter-intuitive result: **Braille is best at large sizes and worst at
small ones.** Its dots read as a crisp contour when there are enough of them,
but below about six lines they scatter into sparse specks. The solid families
hold the shape together when tiny. **Sextant is the sharpest at small sizes;
quadrant is the portable fallback** for fonts that lack the Legacy Computing
block (where sextants render as tofu boxes).

Encoders for the other families slot into the recipe in place of the Braille
packing step:

```python
# Sextant (2x3). Bit layout: TL=1 TR=2 ML=4 MR=8 BL=16 BR=32.
SEX_SPECIAL = {0: " ", 21: "▌", 42: "▐", 63: "█"}
def sextant_char(b):
    if b in SEX_SPECIAL:
        return SEX_SPECIAL[b]
    off = b - 1 - (1 if b > 21 else 0) - (1 if b > 42 else 0)
    return chr(0x1FB00 + off)

# Quadrant (2x2). Bit layout: TL=1 TR=2 BL=4 BR=8 — index this string by value.
QUAD = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█"

# Half-block (1x2). Bit layout: top=1 bottom=2.
HALF = " ▀▄█"
```

### Odd glyph widths and the symmetry axis

The cup, the sprout, and the base convergence sit on a vertical axis; the leaf
is the deliberate asymmetric break to the right. An **odd** glyph width puts a
single column on that axis, so the column's internal sub-column seam lands *on*
the centreline — expressing the symmetry at sub-glyph level. An even width puts
the seam *between* two columns, which splits a centred feature (sprout tip, base
point) and lets a sampling offset make the two cup walls unequal.

Measured, the cup axis is at x ≈ 384 of 744 — essentially the frame centre; the
upper-right leaf does **not** drag the axis off centre. So choosing an odd
column count while spanning the bounding box already centres the axis, with no
separate axis-finding step. Practically: round the aspect-true width to the
nearest **odd** number (6-line → 9, 5-line → 7, 3-line → 5, 2-line → 5).

---

## Braille renderings

Spacing uses the blank Braille pattern (`⠀`, U+2800) so alignment survives
markdown formatting. These blocks are decorative; the SVG above is the
accessible source.

### 8-line (compact)

For very constrained contexts — status lines, compact signatures.

```text
⠀⠀⠀⠀⠀⢀⣼⠟⠀⠀⠀⠀
⠀⠀⢀⣠⣴⣾⣿⣦⣤⣀⠀⠀
⢀⣴⡟⠋⠀⢹⣧⠀⠉⠻⣷⡀
⣾⡏⠀⠀⠀⠀⠻⣷⣄⡀⠸⣷
⠛⣿⠀⠀⠀⠀⠀⠈⠙⠛⠛⠛
⠀⢻⣇⠀⠀⠀⠀⠀⠀⢠⣿⠀
⠀⠀⠻⣦⡀⠀⠀⠀⣠⣿⠃⠀
⠀⠀⠀⠙⠻⣶⣶⡾⠛⠁⠀⠀
```

### 10-line

```text
⠀⠀⠀⠀⠀⠀⠀⢠⣾⠗⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣀⣠⣿⣏⣀⡀⠀⠀⠀⠀
⠀⠀⣠⣶⡿⠛⢻⣿⡛⠛⠿⣷⣤⡀⠀
⢀⣾⡟⠁⠀⠀⠈⢿⣧⠀⠀⠈⠻⣷⡄
⣾⡟⠀⠀⠀⠀⠀⠈⠻⣷⣄⣀⠀⢹⣿
⠿⣿⡆⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿⠿⠿
⠀⢹⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡷⠀
⠀⠀⢿⣧⡀⠀⠀⠀⠀⠀⠀⢠⣿⠇⠀
⠀⠀⠀⠻⣷⣄⠀⠀⠀⢀⣴⣿⠋⠀⠀
⠀⠀⠀⠀⠈⠛⠿⣶⣾⠿⠋⠁⠀⠀⠀
```

### 12-line

Clean and compact, with the leaf and sprout clearly separated.

```text
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⡷⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠏⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢀⣠⣴⣶⣿⣿⣿⢿⣷⣶⣤⡀⠀⠀⠀
⠀⢀⣴⣿⠟⠋⠁⠀⣿⣿⠀⠀⠉⠻⢿⣷⡀⠀
⢀⣾⡿⠁⠀⠀⠀⠀⠸⣿⣧⡀⠀⠀⠈⢻⣿⡄
⣾⣿⠁⠀⠀⠀⠀⠀⠀⠘⢿⣿⣦⣀⠀⠀⢿⣿
⠿⣿⣶⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⠿⣿⠿
⠀⢸⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⡆⠀
⠀⠀⢿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⠇⠀
⠀⠀⠈⢻⣷⡄⠀⠀⠀⠀⠀⠀⠀⣰⣿⠟⠀⠀
⠀⠀⠀⠀⠙⢿⣦⣄⠀⠀⢀⣠⣾⡿⠋⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠙⠻⢿⣿⡿⠟⠋⠀⠀⠀⠀⠀
```

### 16-line (best fidelity)

The most faithful version: open cup, rounded base, hollow interior, distinct
upper-right leaf, and a separate top sprout. Use where the icon can afford the
height — README headers, CLI splash screens.

```text
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡦⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣾⣿⣏⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⢿⣿⣿⠿⢿⣿⣿⣶⣤⡀⠀⠀⠀⠀
⠀⠀⠀⣰⣾⣿⠟⠋⠁⠀⠸⣿⣿⡀⠀⠀⠉⠛⢿⣿⣦⡀⠀⠀
⠀⢠⣾⣿⠟⠁⠀⠀⠀⠀⠀⢻⣿⣧⠀⠀⠀⠀⠀⠙⢿⣿⣆⠀
⢠⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣷⡀⠀⠀⠀⠀⠈⢿⣿⡆
⣾⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣶⣤⣀⠀⠀⠸⣿⣿
⣿⣿⣷⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⢿⣿⣿⣿⣿⣿
⠀⠈⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣉⠁⠀
⠀⠀⢻⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⠀⠀
⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⡏⠀⠀
⠀⠀⠀⠈⢿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠀⠻⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⠟⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠻⣿⣷⣦⣀⣀⣠⣴⣾⣿⡿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀
```

---

## Alternative approach — quadrant blocks

Quadrant block glyphs (`▘▝▖▗▀▄▌▐█▙▟▛▜▞▚`) pack 2 × 2 dots per cell. The result
is chunkier and lower-resolution than Braille but has a heavier, more "solid
woodcut" feel that some terminals render more evenly than Braille. Keep it
inside a fenced block so the leading/trailing spaces are preserved.

```text
     ▗█▖   
     ▟▛    
   ▄▄█▙▄   
 ▗▟█▀█▀▜█▖ 
 █▛  █▖ ▝█▖
▐▛   ▜▙  ▐▙
█▘    ▜▙▖ █
█▙     ▀███
 █       ▄ 
 █▌      █ 
 ▐▙     ▐█ 
  ▜▙   ▗█▘ 
  ▝█▙▖▄█▛  
    ▜██▘   
```

---

## Compact renderings (status-line scale)

For a status line (1–2 rows is typical) or any tight vertical budget. Two
findings shape these: **solid families beat Braille below about six lines**
(Braille's dots scatter when sparse), and **odd glyph widths read cleaner** (the
sprout and base sit centred on the symmetry axis). Sextant is recommended where
the font supports the Legacy Computing block; quadrant is the universal-font
fallback; Braille is shown for comparison and for fonts where sextants would
render as tofu.

### 6 lines

Sextant (recommended), width 9:

```text
    🬵🬕   
 🬵🬜🬎█🬎🬌🬱🬏
🬻🬄  🬊🬺🬭🬁🬺
🬨🬲    🬂🬡🬕
 🬬🬱   🬞█🬀
  🬊🬪🬹🬹🬎🬀 
```

Braille, width 9:

```text
⠀⠀⠀⠀⣰⠟⠀⠀⠀
⠀⣠⡶⠛⣿⠛⠷⣦⡀
⣼⠋⠀⠀⠹⣧⣀⠘⣷
⢻⣇⠀⠀⠀⠀⠉⢛⡛
⠀⢻⣄⠀⠀⠀⢀⣾⠁
⠀⠀⠙⢷⣤⣴⠟⠁⠀
```

Quadrant (universal fonts), width 9:

```text
    ▟▛   
 ▄█▀█▀▜▄ 
▟▘  ▀▙▄▝█
▜▙    ▀▜▛
 ▜▄   ▗█▘
  ▀█▄▟▛▘ 
```

### 5 lines

Sextant, width 7:

```text
  🬞🬷▌  
🬦🬜🬂█🬂🬎🬱
█🬏 🬁🬎🬹█
🬉🬲   ▐▌
 🬁🬪🬱🬹🬆 
```

Braille, width 7:

```text
⠀⠀⢀⣴⡃⠀⠀
⢠⡞⠋⢿⡉⠳⣄
⣿⡀⠀⠈⠳⢦⣿
⠘⣧⠀⠀⠀⢰⡇
⠀⠘⠷⣤⡴⠋⠀
```

### 3 lines

The smallest size that still reads as the acorn. Odd width 5 centres the sprout.

Sextant, width 5:

```text
🬞🬵🬻🬲🬏
🬬 🬁🬋🬝
🬁🬪🬭🬖🬄
```

Quadrant (universal fonts), width 5:

```text
▗▄▟▙▖
█ ▝▚█
▝▙▄▟▘
```

Braille, width 5 (weakest at this size):

```text
⢀⡤⣾⢥⡀
⢯⠀⠘⠲⡽
⠘⢧⣀⡴⠃
```

### 2 lines — abstract token

At two lines the form collapses to an abstract mark: a rounded body with a
sprout. It reads as "acorn" best beside a label (e.g. `🬵🬋🬫🬛🬱 oak`), not in
isolation. Odd width 5.

Sextant:

```text
🬵🬋🬫🬛🬱
🬊🬱🬭🬷🬆
```

Quadrant:

```text
▄▞█▙▄
▀▄▄▟▛
```

### 1 line

One text row is too short to carry the cup-and-sprout form — every conversion
collapses to a horizontal smudge, so there is no faithful single-line acorn. The
practical options are:

- the **2-line token** above, where the context allows two rows;
- the chestnut emoji **🌰** (U+1F330) as a stand-in — it is a chestnut, not the
  Oak acorn, but reads as a nut at a glance;
- a short text mark such as **`🌰 oak`** where a glyph alone would be ambiguous.

---

## Colour treatments

Markdown code fences do not reliably support colour. Two practical approaches:

### HTML version

Works wherever inline HTML and CSS are allowed. Black glyphs on Oak mint green
(contrast ratio ≈ 18:1, well above WCAG 2.2 AA).

```html
<pre style="background:#B8F4D8;color:#000;padding:12px 16px;display:inline-block;line-height:1.05;font-family:monospace;font-size:18px;border-radius:8px;" role="img" aria-label="Oak National Academy acorn logo">
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡦⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣾⣿⣏⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⢿⣿⣿⠿⢿⣿⣿⣶⣤⡀⠀⠀⠀⠀
⠀⠀⠀⣰⣾⣿⠟⠋⠁⠀⠸⣿⣿⡀⠀⠀⠉⠛⢿⣿⣦⡀⠀⠀
⠀⢠⣾⣿⠟⠁⠀⠀⠀⠀⠀⢻⣿⣧⠀⠀⠀⠀⠀⠙⢿⣿⣆⠀
⢠⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣷⡀⠀⠀⠀⠀⠈⢿⣿⡆
⣾⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣶⣤⣀⠀⠀⠸⣿⣿
⣿⣿⣷⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠿⢿⣿⣿⣿⣿⣿
⠀⠈⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣉⠁⠀
⠀⠀⢻⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⠀⠀
⠀⠀⠈⢿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⡏⠀⠀
⠀⠀⠀⠈⢿⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠀⠻⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⠟⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠻⣿⣷⣦⣀⣀⣠⣴⣾⣿⡿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀</pre>
```

### Terminal (ANSI true colour)

Black glyphs on mint green in terminals that support true colour.

```bash
#!/usr/bin/env bash
# Black foreground, Oak mint-green background.
START=$'\033[38;2;0;0;0;48;2;184;244;216m'
RESET=$'\033[0m'

printf '%s\n' "$START"
cat <<'EOF'
⠀⠀⠀⠀⠀⢀⣼⠟⠀⠀⠀⠀
⠀⠀⢀⣠⣴⣾⣿⣦⣤⣀⠀⠀
⢀⣴⡟⠋⠀⢹⣧⠀⠉⠻⣷⡀
⣾⡏⠀⠀⠀⠀⠻⣷⣄⡀⠸⣷
⠛⣿⠀⠀⠀⠀⠀⠈⠙⠛⠛⠛
⠀⢻⣇⠀⠀⠀⠀⠀⠀⢠⣿⠀
⠀⠀⠻⣦⡀⠀⠀⠀⣠⣿⠃⠀
⠀⠀⠀⠙⠻⣶⣶⡾⠛⠁⠀⠀
EOF
printf '%s\n' "$RESET"
```

For a simpler standard-ANSI green (less brand-faithful), replace the `START`
line with:

```bash
START=$'\033[30;42m'
```

---

## Recommended usage

Pick by vertical budget, then by glyph family. **Use an odd width**, and prefer
**sextant** for solidity, falling back to **quadrant** where the font lacks the
Legacy Computing block:

- **1 row (true status line):** no faithful acorn exists — use the 2-line token
  if you can spare the row, otherwise the 🌰 emoji or a `🌰 oak` text mark.
- **2 rows:** the abstract sextant/quadrant token, best beside a label.
- **3–6 rows (compact):** sextant (or quadrant for universal fonts). Braille
  degrades here — avoid it small.
- **8–16 rows (README headers, splash screens):** Braille — it is sharpest at
  large sizes, where its dots form a crisp contour.
- **Formal brand contexts:** use the SVG. These text renderings are
  interpretive and are for text-only media.

## Accessibility

Braille-pattern, block, and sextant characters are decorative here and may be
announced oddly (or not at all) by screen readers. Treat every block as an
image:

- Keep a text description nearby (this document provides one), and
- For HTML use, wrap the block in `role="img"` with an `aria-label`, as shown
  in the HTML version above.

Two extra caveats for the compact renderings: **sextant** glyphs (U+1FB00 block)
fall back to tofu boxes on fonts without Legacy Computing support — use quadrant
where portability matters; and the **🌰** stand-in is the *chestnut* emoji, which
carries its own semantics and is not the Oak acorn.

The SVG is the accessible, scalable source and should be used in any context
where the logo must be machine-readable.
