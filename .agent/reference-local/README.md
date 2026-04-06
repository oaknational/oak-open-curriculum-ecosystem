# Reference — local only

Material that should **not** be version-controlled: large imports, one-off
scraps, paired exports pending cleanup, or anything machine-local.

**Contrast**

- **Long-lived, shared reference** — [`.agent/reference/`](../reference/README.md)
  (tracked in git; supporting docs for agents and developers).
- **Durable research and analysis** — [`.agent/research/`](../research/README.md)
  (tracked; findings and investigations).
- **Developer-experience external report recovery (ignored lane)** —
  [`.agent/research/developer-experience/novel/`](../research/developer-experience/novel/README.md)
  (same “local until promoted” idea, scoped to that workflow).

This directory’s contents are ignored by [`.gitignore`](./.gitignore) except
this README and the ignore file itself.
