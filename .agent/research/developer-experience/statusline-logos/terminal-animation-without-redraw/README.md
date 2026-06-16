# Terminal Animation & Shading Toolkit

A complete, runnable set of artefacts for producing animated, richly-shaded visuals in a
terminal cell grid **from a single static payload** — built for the Claude Code statusline
but portable to any ANSI/VT terminal.

Start with **`terminal-animation-techniques.md`** for the full generalised write-up of every
technique. This README is just the map of the bundle and how to run it.

---

## What's in here

```
terminal-animation-without-redraw/
├── README.md                          ← you are here
├── terminal-animation-techniques.md   ← the detailed techniques reference (read this)
└── terminal-animation-toolkit/        ← the runnable bundle
    ├── generators/                    ← Python scripts that produce each piece
    │   ├── 01_two_frame_swap.py
    │   ├── 02_glow_halo.py
    │   ├── 03_polychrome_spokes.py
    │   ├── 04_mono_shimmer.py
    │   └── 05_final_acorn.py
    ├── statusline/                    ← ready-to-use bash payloads (drop into a statusline)
    │   ├── swirl_blink.sh
    │   ├── acorn_glow.sh
    │   ├── acorn_spokes.sh
    │   ├── acorn_mono.sh
    │   └── acorn_final.sh
    └── renders/                       ← the end results (GIF = animated, PNG = still)
        ├── swirl_blink.gif, phases_side_by_side.png
        ├── acorn_glow.gif, acorn_glow_on.png
        ├── acorn_spokes.gif, acorn_spokes_on.png
        ├── acorn_mono.gif, acorn_mono_on.png, acorn_mono_amp.png
        ├── acorn_final.gif, acorn_final_on.png
        └── progression/               ← design evolution of the acorn, stage by stage
            ├── 3_umbra_bgwash_blocky.png
            ├── 4_halftone_sidelit.png
            ├── 5_warmcool.png
            └── 6_final.png
```

> The GIFs are **idealised previews** at a fixed ~600 ms/phase. A real terminal runs the
> blink at its own rate (~1–2 Hz). They exist because you cannot see blink in a still image.

---

## The five pieces, mapped to techniques

| # | Generator | Statusline | Render | Techniques it demonstrates |
|---|-----------|-----------|--------|-----------------------------|
| 1 | `01_two_frame_swap.py` | `swirl_blink.sh` | `swirl_blink.gif` | Solid-block two-frame sprite; **fg/bg swap** & **π-offset anti-phase**; overlap held static |
| 2 | `02_glow_halo.py` | `acorn_glow.sh` | `acorn_glow.gif` | Braille **halftone** + **dithered density gradient**; surface-hugging radial glow; blink-on-black bloom/fade |
| 3 | `03_polychrome_spokes.py` | `acorn_spokes.sh` | `acorn_spokes.gif` | **Background as static colour engine**; HSV **spoke/starburst** field; Ben-Day halftone; selective twinkle |
| 4 | `04_mono_shimmer.py` | `acorn_mono.sh` | `acorn_mono.gif` + `_amp.png` | Precomputed **green→black palette** + perceptual **L\***; **ΔL\*-driven shimmer amplitude**; the **amplitude map** |
| 5 | `05_final_acorn.py` | `acorn_final.sh` | `acorn_final.gif` | The full composition: original-glyph halftone, **flood-fill interior isolation**, **medial-axis/directional light**, warm/cool tint, **umbra**, ΔL\*-graded glow |

The `_amp.png` from piece 4 is worth a look on its own: it renders the *per-cell shimmer
amplitude* (`density × ΔL*`) directly, so you can see the motion field as a heatmap.

---

## Running the generators

**Requirements:** Python 3, and [Pillow](https://pypi.org/project/pillow/) for the PNG/GIF
previews:

```bash
pip install pillow
```

Each generator is self-contained (the source art is embedded) and writes into a local
`./renders/` directory:

```bash
cd terminal-animation-toolkit/generators
python3 05_final_acorn.py        # writes renders/acorn_final.{sh,gif,_on.png}
```

It produces both the **statusline `.sh`** (the actual terminal payload) and the **preview
images**. Tune by editing the parameter constants near the top of each script — for the
final acorn the high-value knobs are `AMP` (light strength), the multipliers inside
`warmcool()` (hue drift), `LIGHT` (light direction), and `RG`/`U`/`Wt` (glow reach & umbra).

> **The generators are the source of truth; `statusline/*.sh` are build artefacts.** Each
> generator writes its `.sh` into `./renders/`; the committed copies in `statusline/` are
> those outputs copied across. To change a payload, edit the generator and regenerate, then
> copy `renders/<name>.sh` to `statusline/<name>.sh` — do **not** hand-edit the committed
> scripts (a regeneration would silently overwrite the edit). To verify a change, confirm
> the script's animated branch still matches the prior payload and the `off`/`static` branch
> contains no `\033[5` (SGR 5 blink) sequences.

---

## Using a payload in the Claude Code statusline

1. Copy a script somewhere, e.g. `~/.claude/acorn_final.sh`, and make it executable:
   ```bash
   chmod +x ~/.claude/acorn_final.sh
   ```
2. Point your statusline at it in `~/.claude/settings.json`:
   ```json
   {
     "statusLine": { "type": "command", "command": "~/.claude/acorn_final.sh", "padding": 0 }
   }
   ```

Each script consumes the statusline's stdin JSON (`cat > /dev/null`) and prints the payload.

### Test blink survival first — in the statusline, not just a terminal

The colour, gradients, halftone and shading rely only on truecolor SGR, which passes
through almost everywhere. The **animation** rides on `SGR 5` (blink), which some hosts
normalise away. Crucially, the Claude Code statusline is parsed by the host's Ink renderer
into its own cell buffer — **not** handed raw to your terminal — so a terminal that blinks
does *not* guarantee the statusline will. The decisive, go/no-go experiment is therefore
run **in the statusline itself** (full procedure and 2×2 result table:
[`terminal-animation-techniques.md` §10](terminal-animation-techniques.md#the-blink-survival-experiment-run-this-first)):

1. Drop a minimal blink probe into `statusLine` in `~/.claude/settings.json` and look at the
   statusline — does the blinking word actually blink *there*?
2. As a **control**, run the same script directly in the terminal
   (`bash ./acorn_final.sh < /dev/null`) to separate "terminal supports blink" from "host
   forwards blink."

- Blinks **in the statusline** → blink survives the host; the toolkit animates.
- Steady in the statusline (even if it blinked in the terminal) → the host strips blink. You
  still get the full static composition and lose only the motion (these designs degrade
  gracefully: the static frame is the on-phase and stands on its own). Use event-driven
  frame stepping (≤3 fps) for motion instead.

> **Result (observed 2026-06-16):** run for the first time — the Claude Code statusline
> **strips `SGR 5`**. Blink does not animate in the statusline on any terminal (the stripping
> is at the host; truecolor survives). Blink-based motion is therefore non-viable here; static
> compositions and the event-driven fallback are unaffected. Full write-up and scope in
> [`terminal-animation-techniques.md` §10 Result](terminal-animation-techniques.md#result-observed-2026-06-16).

Note that the multi-line pieces are tall; they suit experimentation more than a compact
one-line status bar. For a real status bar, shrink the source art or crop to a few rows.

---

## Reduce motion (accessibility)

Animation must be defeatable. Every generated `statusline/*.sh` honours an override:

```bash
OAK_STATUSLINE_MOTION=off    # also accepts: static | none | reduce
```

When set, the script emits the **static on-phase frame with all `SGR 5` blink stripped**;
unset (or `auto`) keeps the animation. The static fallback is the same on-phase still the
design already produces, so nothing is lost but the motion. Set it in `~/.claude/settings.json`'s
`env` block or a shell profile:

```json
{
  "env": { "OAK_STATUSLINE_MOTION": "off" },
  "statusLine": { "type": "command", "command": "~/.claude/acorn_final.sh", "padding": 0 }
}
```

To follow the OS "reduce motion" setting, resolve it **once** in a `SessionStart` hook and
write `OAK_STATUSLINE_MOTION` (macOS: `defaults read com.apple.universalaccess reduceMotion`;
GNOME: `gsettings get org.gnome.desktop.interface enable-animations`). Do **not** poll the OS
on every emission. Why this matters — and why a blinking *resting* frame is the one real
[WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) liability here —
is in [`terminal-animation-techniques.md` §13](terminal-animation-techniques.md#13-accessibility--reduce-motion),
which also cites the [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
and macOS `defaults` references.

---

## The honest ceiling (short version)

Two interleaved frames, one global clock, 50% duty, at the terminal's rate — you control
per-cell *amplitude* (via `density × ΔL*`) and the two *states*, but not waveform, phase
(except the solid-block swap), or timing. No translation/motion from a static payload.
Full reasoning in the reference doc.
