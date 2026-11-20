---
id: upstream-api-currency
node_type: strategic
name: 'Upstream API currency — generated from the API Oak currently publishes'
overview: >-
  The SDK, and every surface generated from it, is generated from the current major of the Oak
  Curriculum API and stays within a known distance of its latest published schema.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: TOOLS-1
impact_areas:
  - served-surface
depends_on: []
tickets: []
last_updated: 2026-11-20
---

# Upstream API currency — generated from the API Oak currently publishes

## Outcome

The schema this repository generates from is the current major of the Oak Curriculum API, and
the gap between the cached schema and the published one is known and small at every reading.

## User groups and value

- **Teachers using Oak through an AI assistant** get what the API serves today: fields and
  endpoints Oak has added reach them, and fields Oak has removed are not promised to them.
- **Developers using the SDK** build against the contract Oak maintains, not a frozen one.
- **Oak's API team** has one fewer consumer holding an old major open.
- **Seats working here** change generated code against a schema that matches the live service.

## The bet

TOOLS-1 says the SDK is generated from the API spec, so the contract holds by construction. That
is true only of the spec generated from. A cache that lags the published schema, or sits on a
frozen major, makes the typed contract describe a service that has moved. Keeping the cache
current as planned, routine work costs less than a large catch-up, and each catch-up so far has
been large: on 2026-11-20 the cache was at 0.7.0, refreshed on 2026-08-03, against a published
0.11.2, 221 structural differences apart.

Not done under this node: new tools or features built on new upstream fields (they serve their
own nodes), and requests for Oak to publish data it does not yet publish
(`upstream-curriculum-data-exposure`).

## Success looks like

- The cached schema names the API's current major, as the API's own catalogue reports it.
- The advisory schema-drift check in CI reports no drift, or drift younger than one upstream
  release.
- An upstream major change has a plan node here before the old major is switched off.

## Delivery

Delivery plans serving this node declare `serves: upstream-api-currency`; enumerate them by
search.
