---
name: "Synthetic Monitoring"
status: superseded
status_reason: >
  Owner direction 2026-04-23 moved monitor creation and monitor validation out
  of repo scope. Repo-owned work reduces to leaving a healthy `/healthz`
  endpoint and proving preview/Sentry behaviour in the operational
  deploy-boundary repair plan.
superseded_by:
  - "../../current/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md"
---

# Synthetic Monitoring

**Status**: Archived 2026-04-23 as non-repo work

This plan is closed because it mixed two different concerns:

1. repo-owned work to make the service observable and verifiable;
2. owner-external work to create and operate the uptime monitor.

Only the first concern belongs in this repository.

The surviving repo-owned work now lives in the operational
deploy-boundary repair plan:

- the preview function boots on Vercel;
- `/healthz` responds with 200;
- Sentry release and preview-traffic evidence can be verified.

Monitor creation, registration, cadence, alert routing, and ongoing validation
now happen outside this repo by owner choice.

No successor repo plan exists for monitor setup.
