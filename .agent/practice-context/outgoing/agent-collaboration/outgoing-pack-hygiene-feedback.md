# Outgoing Pack Hygiene Feedback

Most of the 2026-04-03 hydration and self-sufficiency cluster was already
promoted into OOCE Practice Core, ADR, or pattern surfaces before this
incoming pass. That means the strongest remaining write-back value is hygiene
and packaging, not another Core-promotion round.

Specific feedback:

- `minimum-operational-estate.md` and `operational-surface-hydration-audit.md`
  still talk about a seven-file Core. OOCE's Core is now eight files, so that
  wording went stale quickly.
- `starter-templates.md` currently names two different concepts across the
  repos. In `agent-collaboration` it means hydration seed artefacts; in OOCE's
  outgoing set it currently points at reviewer templates. Reusing the same
  filename for different concepts makes cross-repo transfers easier to misread.
- Several hydration/self-sufficiency notes already read like promoted doctrine
  in OOCE. That is a good sign, but it also means future incoming packs may be
  more useful if they separate net-new doctrine from historical support notes.
