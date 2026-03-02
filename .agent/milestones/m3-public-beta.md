# Milestone 3: Public Beta

## Why this milestone matters

This is when the tools become production-grade. The alpha proved value,
the enhancements expanded capability, and now the system needs to be
reliable enough for teachers to depend on it in their daily work. Public
beta means the tools are trustworthy — they stay up, they perform well,
and problems are caught and fixed before users notice them.

## Who it is for

- **Teachers** who depend on AI tools daily for lesson planning and
  curriculum navigation
- **School and trust IT teams** evaluating tools for wider adoption
- **Edtech developers** building production applications on Oak's
  infrastructure
- **Oak's product and operations teams** managing a live service

## What value it delivers

- The system is production-grade: monitored, observable, and resilient
  under real-world load.
- Mutation testing ensures the test suite catches real bugs, not just
  superficial ones.
- Observability gives Oak's team clear visibility into how the tools are
  used and where they need improvement.
- Teachers and developers can rely on stable, well-documented APIs that
  do not break between releases.

## Progression gates

All must be true before M3 exit:

- [ ] Mutation testing integrated and passing
- [ ] Observability dashboards live (Sentry performance, usage patterns)
- [ ] Load testing demonstrates acceptable performance under expected
  traffic
- [ ] API stability commitments documented (versioning, deprecation
  policy)
- [ ] Quality gates green (`pnpm qg`)
- [ ] No severity-1 snagging items open
- [ ] Beta go/no-go review passed

## Current status

**Planned.** High-level scope identified in
[architecture-and-infrastructure/](../plans/architecture-and-infrastructure/).
Detailed planning will begin after M2 ships.

Dependencies: M2 complete.
