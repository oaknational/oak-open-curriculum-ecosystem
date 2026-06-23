# Upstream Feature Requests

Feature requests this repository raises for **other Oak teams' repositories** — the
upstream surfaces our SDK, MCP, and skills depend on. We record requests here and
hand them over; **this repository must not edit those upstream repos**. Each
upstream team's canonical intake owns implementation.

## Structure

- **One folder per upstream team / repository** (e.g. `oak-open-api/`,
  `oak-skills/`).
- **One file per request** inside that folder — self-contained: Problem →
  Evidence → Suggested approach → Impact, plus **Status** (open / handed-over /
  implemented), **Priority**, and **Affected** surface.
- Evidence must be a real code/schema reference or a reproducible
  request/response. No speculative items.

## Teams and requests

### `oak-open-api` — the Oak Open Curriculum API (`oak-openapi`)

Served at `https://open-api.thenational.academy`; our SDK and MCP generate types
from its published OpenAPI spec, so spec-level improvements land here rather than
as local workarounds.

- [`oak-open-api/reusable-enum-ref-components.md`](oak-open-api/reusable-enum-ref-components.md)
  — register shared enums as reusable component schemas (`$ref`).
- [`oak-open-api/quiz-image-alt-text-quality.md`](oak-open-api/quiz-image-alt-text-quality.md)
  — quiz image `alt` text is auto-generated and frequently broken (repetition
  loops, hallucination, function-blind); a WCAG 1.1.1 accessibility fix with
  reproducible examples.
- [`oak-open-api/keywords-finer-grained-control.md`](oak-open-api/keywords-finer-grained-control.md)
  — `GET /keywords` has no bounding/ranking parameters and sorts alphabetically
  despite a description promising frequency order; request optional
  `limit`/`offset` + `orderBy` + an exposed frequency field.

### `oak-skills` — the Oak Agent Skills library (`oak-skills`)

The user-facing Agent Skills (curriculum principles, lesson builder, accessibility,
brand, tone) that route agents through Oak's MCP tools.

- [`oak-skills/reference-eef-evidence-once-live.md`](oak-skills/reference-eef-evidence-once-live.md)
  — surface the EEF evidence tool/resource/prompt as the "evidence-informed"
  grounding once it ships.

## Related (separate artefacts, not part of this log)

- A larger, older `oak-openapi` endpoint-additions proposal lives separately at
  [`../../proposals/upstream-api-endpoint-additions/`](../../proposals/upstream-api-endpoint-additions/)
  — a different concern (new endpoints / `x-oak-*` extensions), not consolidated
  here.
- The earlier exploratory API wishlist was archived to
  [`../sector-engagement/archive/ooc-api-wishlist/`](../sector-engagement/archive/ooc-api-wishlist/) on 2026-06-08;
  carry forward only live, evidence-backed requests.
