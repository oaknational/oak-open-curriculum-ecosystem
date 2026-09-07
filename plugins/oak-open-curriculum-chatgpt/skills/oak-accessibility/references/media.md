# Accessibility: video, audio, animation, and GIFs

Oak's lessons lean heavily on video and animated explanation, so this is high-stakes.

## Video (with audio)

- **Synchronised captions** (WCAG 1.2.2, A) — accurate, properly timed, identifying speakers and
  meaningful sound. **Open or closed**, but present. Auto-generated captions must be **reviewed and
  corrected** before publishing (subject vocabulary and names are where they fail).
- **Transcript** — a full text alternative, useful for everyone and required as a fallback.
- **Audio description** (1.2.3 A / 1.2.5 AA) when important information is shown visually but not
  spoken (e.g. an on-screen diagram the narrator doesn't read out). Prefer scripting narration so it
  describes what's shown, which avoids needing a separate described track.
- **No autoplay with sound.** If media plays automatically for more than 3 seconds, provide a pause/
  stop/mute control (2.2.2).

## Audio-only

- Provide a **transcript** (1.2.1). For anything instructional, the transcript is the accessible
  equivalent.

## Animation and GIFs

- **No flashing** more than **three times per second** (2.3.1) — this is a seizure-safety
  criterion, not a nicety. Check animated explainers and transitions.
- **Animated GIFs that loop**: provide a way to pause, or keep them short and non-essential;
  give a text equivalent for any information they carry.
- **Respect reduced-motion**: where the platform supports it, honour
  `prefers-reduced-motion` and avoid large parallax/auto-motion that can trigger vestibular issues.
- On Oak's brand "scribble"/draw-on animations and doodles: keep them decorative
  and motion-safe — they must not carry information that's unavailable in text, and must not flash.

## Before sign-off

Confirm: captions present and corrected; transcript available; audio description (or
description-in-narration) where visual-only info exists; nothing flashes; autoplay-with-sound
avoided. Then run `assets/accessibility-checklist.md`.
