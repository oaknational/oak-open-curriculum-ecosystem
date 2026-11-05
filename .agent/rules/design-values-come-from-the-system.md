---
classification: situational
description: Every design value on a consumer surface resolves through the design system (token, role class, or custom property) — no hardcoded values; kit-internal literals are the definitions; retained consumer literals need the owner's named word with a recorded disposition.
trigger: surface:design — Authoring or reviewing a design value on a consumer surface
globs:
  - apps/**/*.{ts,tsx,css,html}
  - demos/**/*.{ts,tsx,css,html}
  - packages/design/**
---

# Design Values Come From the System

Owner-ruled (2026-07-29, in-chat, verbatim): "everywhere we use a value it
should come from the design system, no hardcoded values." The scope reading
was owner-ratified the same hour ("I agree"): the rule binds CONSUMER
surfaces; kit-internal literals ARE the definitions and are exempt;
infrastructure values (ports, timeouts, URLs) are not design values.

Provenance: this rule operationalises that owner ruling directly (recorded
as ruling 20 in the Director sitting block of 2026-07-29, archived verbatim
at `.agent/memory/operational/archive/director-handoff-current-handoff-state-2026-09-08.md`
since 2026-09-08), routed
through [`new-rule-vs-pdr-clause`](new-rule-vs-pdr-clause.md) at minting —
a standing behavioural rule, not a PDR clause, because it binds every
authoring/review act on consumer surfaces rather than a governance
decision. It applies the design-token doctrine home
(`docs/governance/design-token-practice.md`, ADR-213 §sanctioned shapes)
to the point of use.

## Trigger

Authoring or reviewing code on a consumer surface that expresses a design
value — colour, spacing, typography, radius, elevation, motion, breakpoint —
in any app, demo, widget, or served page. This rule fires at the moment the
value is written, and again at review.

## Action

1. **Resolve every design value through the design system** — a token, role
   class, or CSS custom property from `@oaknational/oak-design-system` (or
   the mapping layer a consumer legitimately builds on it, e.g. the hub's
   `@theme` role mapping). Never a raw hex, px-literal scale value, ad-hoc
   font stack, or copied magic number.
2. **Kit-internal literals are the definitions themselves** — values inside
   the design-system package's own sheets and token sources are where
   literals live by design. This rule does not reach into the kit.
3. **A retained consumer literal is an owner decision, recorded** — the
   default disposition for an existing literal is replace-with-role; keeping
   one requires the owner's named word and a recorded disposition (the
   fidelity-register pattern).
4. **Reviews test this as an axis**: a consumer-surface diff introducing a
   design literal is a finding regardless of how faithful the literal is —
   fidelity belongs in the token, not at the call site.

## Why This Rule Exists (Worked Instance)

The hub demo predated the design system and accumulated 27 raw hex values
across its app and component sources (audited first-hand 2026-07-29; the
true-up ticket carries the disposition work with replace-with-role as the
owner-ruled default); each now needs an individual disposition — the exact
drift this rule prevents at authoring time. The same day, the showcase
absorb landed with a zero-hardcoded-values invariant and an enforcement
instrument in its programme ticket's next-slice DoD, demonstrating the
compliant shape.

## Related Surfaces

- `packages/design/oak-design-system/DECISIONS.md` — the kit's own
  consumption doctrine (the aggregate stylesheet as THE external entry;
  mapping, not adapter).
- The design-showcase programme ticket and the hub true-up ticket
  (historical anchors, 2026-07-29: MCP-371 and MCP-372) — the enforcement
  carriers when this rule was minted.
- [`invoke-code-experts`](invoke-code-experts.md) — the reviewer roster whose
  `design-system-expert` row carries this axis.
- [`no-moving-targets-in-permanent-docs`](no-moving-targets-in-permanent-docs.md)
  — the same single-source-of-truth principle applied to prose.

## Enforcement

Behavioural at authoring and review now; mechanical enforcement arrives with
the showcase programme's zero-hardcoded-values instrument and extends
per-surface as consumers converge. A rule-wide lint is deliberate follow-on
work, not part of this rule's landing.
