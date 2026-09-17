# Skill-standard pilot — eval evidence

First execution of the estate's eval convention (skill-standard-pilot plan,
slices S3 and S4). What is here:

- `benchmark.json` — the iteration-1 result for the `design-system-usage`
  suite, including the findings the run produced and the exact grader
  re-run commands (its `commands` block).
- `frictions.md` — what got in the way, preserved as harvest material for
  the skill-craft skills the parent plan names as a WS9 candidate.
- `iteration-1/artefacts/` — the composed pages and prose replies both
  benchmark legs produced, kept verbatim so the grades can be re-derived.
- `iteration-1/grades/` — every grader run, including the control runs
  (`controls-theming.txt`, `controls-page.txt`) that prove the graders
  discriminate.
- `iteration-1/transcripts/` — the generation-leg transcripts for cases (b)
  and (c) only. The case-(a) legs were dispatched without transcript
  capture, so no transcript of either exists; their artefacts and grades
  are the surviving record.
- `iteration-1/leg-prompts.md` — the authoritative record of what each leg
  was asked, written from the dispatching seat.
- `iteration-1/w07-verdicts/` — the W0.7 design-review verdicts on case
  (a)'s rendered pages, with the unblinding key.

The suites themselves live with their skills, at
`.agent/skills/domain-craft/ui-design/<skill>/evals/`.

Rendered-page verdicts from the W0.7 design-review instrument stay in this
evidence home and never enter `wow-verdict-register.json` — that register is
the instrument's own calibration series.
