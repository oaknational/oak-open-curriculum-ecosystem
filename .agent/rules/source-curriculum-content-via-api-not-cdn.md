# Source Curriculum Content via the API, Not the Raw CDN

Oak curriculum **content and assets** — lesson images, charts, datasets,
downloadable files — MUST be obtained through the **Oak Open Curriculum API /
generated SDK**, never fetched directly from the raw CDN
(`cloudinary-res.thenational.academy` or any image origin), without fresh owner
authorisation.

## Why

The API applies **Third-Party-Content (TPC) filtering** — it is the surface that
guarantees curriculum content is safe and rights-cleared. The raw CDN is
**unfiltered**. The filtering lives at the API, not on the asset, so an
API-returned CDN URL does **not** make a direct raw-CDN fetch safe — even when
the API itself handed you the URL (as on a lesson-quiz payload's image `url`
field). This is a content-safety boundary, not merely a provenance preference.

## The Rule

- To obtain a curriculum image or asset, use the API/SDK asset path (e.g.
  `get-lessons-assets` then `download-asset`, or the documented asset
  endpoints).
- If only a raw CDN URL is available and no API path exists, **stop and ask the
  owner** before fetching it.
- This composes with the standing data-sourcing invariant: curriculum data and
  content come through the published Oak Open Curriculum HTTP API and generated
  SDK.

## Doctrinal Anchor

[`safety-and-security.md` §Curriculum content sourcing — TPC filtering is the
safety boundary](../../docs/governance/safety-and-security.md). Owner-directed
2026-06-23 after a raw-CDN fetch of canonical chart PNGs taken from a
`get-lessons-quiz` payload.

## Enforcement

Behavioural at content-fetch time. No global hook; the agent applies the rule
when reaching for a curriculum asset, and asks the owner before any raw-CDN
fetch.
