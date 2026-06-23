#!/usr/bin/env python3
"""Seeded generator for braille-sharp Oak acorn variants (5 rows x 7 cols).

The statusline cycles four braille-sharp marks (frame ids 0-3). Frame 0 is the
committed owner-decided mark (held verbatim in `agent-tools/src/claude/oak-logo.ts`);
frames 1-3 are produced here from the acorn SVG with a small seeded sub-cell
sampling-phase offset plus a coverage-threshold jitter, so only marginal dots
flip — the same mark, gently varied.

Pipeline (the conversion standard from `statusline-logos.md`): rasterise the SVG
once via rsvg-convert, lay a 14x20 dot grid (7x5 braille cells) over it, set each
dot where its supersampled block's dark-pixel fraction beats the threshold, pack
to Braille (U+2800). The seed perturbs only the grid phase and threshold.

Reproduce the committed frames:

    python3 generate-braille-sharp-variants.py            # seeds 1 2 4 -> id1 id2 id3

Pass other integers to explore. The SVG is read from `statusline-logos.md` (the
single source of truth); a verification contact sheet is written to
`./braille-sharp-variants.png` so each candidate can be checked back against
frame 0 by eye (the render-back regression guard).

Requires: rsvg-convert and Pillow.
"""
import random
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
DOC = HERE / "statusline-logos.md"
SVG_TMP = HERE / ".acorn.tmp.svg"
SHEET = HERE / "braille-sharp-variants.png"

COLS, ROWS = 7, 5            # braille cells
DW, DH = COLS * 2, ROWS * 4  # dots: 14 x 20
SS = 10                      # supersample px per dot
BITS = {(0, 0): 0x01, (0, 1): 0x02, (0, 2): 0x04, (0, 3): 0x40,
        (1, 0): 0x08, (1, 1): 0x10, (1, 2): 0x20, (1, 3): 0x80}

# Committed frame 0 (current braille-sharp) — for the comparison panel only.
FRAME0 = ['⠀⠀⢀⣼⡃⠀⠀', '⢠⡞⠋⢿⡉⠳⣄', '⣿⡀⠀⠈⠳⢦⣿', '⠸⣧⠀⠀⠀⢰⡇', '⠀⠘⠷⣤⡴⠋⠀']

# Seeds chosen for the committed id1/id2/id3 (see module docstring).
DEFAULT_SEEDS = [1, 2, 4]


def extract_svg() -> None:
    """Pull the single <svg>...</svg> line out of the research doc."""
    text = DOC.read_text(encoding="utf-8")
    match = re.search(r"<svg .*?</svg>", text, re.DOTALL)
    if match is None:
        raise SystemExit(f"no <svg> found in {DOC}")
    SVG_TMP.write_text(match.group(0), encoding="utf-8")


def raster():
    subprocess.run(["rsvg-convert", "-w", str(DW * SS), "-h", str(DH * SS),
                    "-b", "white", str(SVG_TMP), "-o", str(HERE / ".acorn.hi.png")],
                   check=True)
    return Image.open(HERE / ".acorn.hi.png").convert("L").load()


def variant(px, seed):
    rng = random.Random(seed)
    ox = rng.uniform(-0.34, 0.34)            # sub-dot phase shift
    oy = rng.uniform(-0.34, 0.34)
    cov = 0.16 + rng.uniform(-0.035, 0.035)  # coverage-threshold jitter
    rows = []
    for cy in range(ROWS):
        line = ""
        for cx in range(COLS):
            mask = 0
            for (lx, ly), bit in BITS.items():
                dx, dy = cx * 2 + lx, cy * 4 + ly
                x0 = int(round((dx + ox) * SS))
                y0 = int(round((dy + oy) * SS))
                dark = tot = 0
                for sy in range(y0, y0 + SS):
                    for sx in range(x0, x0 + SS):
                        if 0 <= sx < DW * SS and 0 <= sy < DH * SS:
                            tot += 1
                            if px[sx, sy] < 140:
                                dark += 1
                if tot and dark / tot >= cov:
                    mask |= bit
            line += chr(0x2800 + mask)
        rows.append(line)
    return rows


def draw(rows, title):
    dot, gap = 9, 3
    cellw, cellh = 2 * dot, 4 * dot
    img = Image.new("RGB", (COLS * cellw + 20, ROWS * cellh + 34), (12, 14, 16))
    d = ImageDraw.Draw(img)
    d.text((6, 6), title, fill=(180, 230, 180))
    for cy, line in enumerate(rows):
        for cx, ch in enumerate(line):
            m = ord(ch) - 0x2800
            for (lx, ly), bit in BITS.items():
                if m & bit:
                    x0 = 10 + cx * cellw + lx * dot
                    y0 = 28 + cy * cellh + ly * dot
                    d.ellipse([x0, y0, x0 + dot - gap, y0 + dot - gap],
                              fill=(120, 240, 150))
    return img


def main() -> None:
    seeds = [int(s) for s in sys.argv[1:]] or DEFAULT_SEEDS
    extract_svg()
    px = raster()
    panels = [draw(FRAME0, "id0 (current)")]
    for idx, seed in enumerate(seeds, start=1):
        rows = variant(px, seed)
        assert len(rows) == ROWS and all(len(r) == COLS for r in rows), "bad shape"
        panels.append(draw(rows, f"id{idx} (seed {seed})"))
        print(f"id{idx} (seed {seed}): {rows!r}")
    cols = len(panels)
    pw = max(p.width for p in panels) + 8
    ph = max(p.height for p in panels) + 8
    sheet = Image.new("RGB", (cols * pw, ph), (0, 0, 0))
    for i, p in enumerate(panels):
        sheet.paste(p, (i * pw + 4, 4))
    sheet.resize((sheet.width * 2, sheet.height * 2), Image.NEAREST).save(SHEET)
    print(f"\nwrote {SHEET}")
    for tmp in (SVG_TMP, HERE / ".acorn.hi.png"):
        tmp.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
