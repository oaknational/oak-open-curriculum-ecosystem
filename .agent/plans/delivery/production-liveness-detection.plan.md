---
id: production-liveness-detection
node_type: delivery
name: 'Detection: externally operated production checks notify within five minutes'
overview: 'Attach an interrupting alert route to externally operated health and authentication checks, so a production failure between deployments cannot pass unnoticed.'
status: sketch
serves: first-major-release
impact_areas:
  - analytics-and-observability
tickets:
  - MCP-481
depends_on:
  - plan: boot-failure-observability
    kind: beneficial
owner_gates: []
last_updated: 2026-09-03
---

# Detection: externally operated production checks notify within five minutes

## Goal

Nobody discovers a production outage by accident during unrelated work.

## Problem

Nothing watches production between deployments, and a deployment event
is the only thing that currently triggers any check. Deployment-triggered
checks therefore cover the moment of change and nothing after it: a
deployment that is healthy when it lands and unhealthy an hour later
passes every gate the estate has.

The vendor contract sharpens the gap. Per Vercel:

> Changes to environment variables are not applied to previous
> deployments, they only apply to new deployments. You must redeploy
> your project to update the value of any variables you change in the
> deployment.
> — [Managing environment variables](https://vercel.com/docs/environment-variables/managing-environment-variables)

An environment edit reaches production at the *next* deployment, not
immediately — so the damage lands at a deployment that looks routine
and carries no signal that its configuration changed underneath it, and
the interval between the edit and that deployment can be arbitrarily
long. The supported operating shape is change → redeploy → verify.

An uptime monitor exists with **no alert rule attached**. A monitor
without an alert relocates the silence rather than ending it: it shows
red on a dashboard nobody is watching, which is the original failure
shape one layer up. The monitor identity and incident evidence are
recorded on MCP-481.

## Mechanism

**1. Alerting on the externally operated uptime monitor.** Probe
`/healthz` expecting 200 at an interval and failure tolerance whose
combined detection time stays inside five minutes. An alert rule routes
to a destination that interrupts (owner gate above).

A bare 401 cannot distinguish the app's auth layer from an edge
answering in front of it, so the probe asserts an app-only artefact:
the `WWW-Authenticate` challenge naming the protected-resource-metadata
resource, which only the app's auth layer emits. The edge in front of
the app is thereby a named probe-path dependency — the probe exercises
edge plus app, and an edge-served 401 without the challenge is a
failure, not a pass.

**2. Authentication-surface check, still outside the repository.** A
second externally operated check sends `POST /mcp` and expects **401**.
It proves the authentication layer is alive rather than merely that the
process answers. The check needs four instrument capabilities, each
recorded with its own evidence status:

- **custom request headers** (the `Accept` header) — supported by the
  current Sentry monitor API and previously observed in the owner console;
- **a non-GET request method** (`POST`) — supported by the current Sentry
  monitor API;
- **a non-2xx expected-status assertion** (401 as healthy) — availability
  to this organisation is owner-held and verified at execution pickup;
- **response-header assertion** over the app's exact
  `WWW-Authenticate` challenge — availability is verified on the same
  owner-held surface.

If either assertion capability is unavailable, this node chooses another
**externally operated** synthetic monitor that can express the contract,
or lands the `/healthz` alert as a partial slice while the auth-surface
criterion and MCP-481 remain open. A partial slice is not completion and
does not turn the missing assertion into an accepted failure. It does not work around a vendor gap by
adding a repository scheduler: ADR-162's accepted boundary keeps
synthetic-monitor creation, cadence, routing, and operation outside this
repository.

The probe's protocol headers cover `Accept` only
(`Accept: application/json, text/event-stream`, without which the
transport answers 406 before the auth layer is reached); no credential
of any kind enters the uptime monitor configuration — the probe asserts
the *unauthenticated* surface, and a **200** on `POST /mcp` is a
failure, because it would mean the auth layer stopped challenging.

The synthetic 401 traffic must remain distinguishable from user auth
failures. The monitor sends a stable non-secret `User-Agent` marker, and
pickup verifies the application's structured auth logs retain enough of
that marker to query or filter the probe class without weakening the
401 response or suppressing real failures.

**Build-vs-buy and failure domains.** The existing Sentry uptime monitor
is the first choice because it already owns external probe execution and
supports method and header configuration. A second in-repo scheduler
checking in to Sentry would move probe origin while retaining Sentry's
notification plane, so it is not an independent alerting system and does
not justify reversing ADR-162. If independent-provider redundancy is
later required, it needs its own outcome, owner, and operating contract;
it is not smuggled into this node as a GitHub Actions workflow.

Both checks detect and neither diagnoses. Once
[`boot-failure-observability`](boot-failure-observability.plan.md)
lands, contemporaneous Sentry error evidence can shorten diagnosis, but
this plan does not claim the external alert automatically embeds or
correlates that event. The detection-only minimum remains independently
shippable and identifies the failing check without claiming a diagnosis.

## Acceptance criteria

1. Loss of `/healthz` raises an alert that reaches the named
   destination — proof: **owner-held**, fault injection against a
   deliberately failing deployment with the alert observed at its
   destination; verifier the owner, evidence on MCP-481.
2. Loss of the authenticated surface raises an alert even when the
   process answers — proof: **owner-held**, an unauthenticated
   `POST /mcp` probe must return 401 **and** the app's correct
   protected-resource-metadata `WWW-Authenticate` challenge while
   `/healthz` still returns 200; **verifier the owner**, evidence on
   MCP-481. The probe sends
   `Accept: application/json, text/event-stream`; 200, 406, a missing
   challenge, or a challenge naming the wrong protected-resource
   metadata URL are all failures.
3. Detection-to-notification is within five minutes, with **Failure
   Tolerance named as a required monitor parameter** — proof:
   **owner-held**, a recorded timing from the criterion-1 injection;
   **verifier the owner**, evidence on MCP-481. The arithmetic must
   clear five minutes with the tolerance included: detection time is
   probe interval × failure tolerance, plus alert latency. Sentry's
   default tolerance of three consecutive failures at a one-minute
   interval reaches detection at three minutes, leaving two for
   notification — within the target; the same default at a five-minute
   interval reaches fifteen, which fails this criterion. The monitor
   configuration therefore records interval and tolerance together.
4. Synthetic auth failures remain distinguishable from real auth
   failures — proof: **owner-held**, the monitor's stable non-secret
   marker is visible as a separate class in the production log query and
   the chosen cadence does not trigger an unrelated auth alert; verifier
   the owner, evidence on MCP-481.

## Out of scope

- **Diagnosis.** Both checks detect; neither explains or embeds a
  corresponding error event. Contemporaneous evidence from
  [`boot-failure-observability`](boot-failure-observability.plan.md),
  when available, shortens diagnosis; it is a beneficial dependency,
  not part of the alert contract.
- **Minimum shippable shape without that dependency**, stated so the
  dependency does not become a reason to ship nothing: alerting that
  fires on the two checks is worth landing on
  its own. It converts "nobody notices" into "someone is interrupted",
  which is the whole of this node's goal. Without MCP-480 the alert
  says only that production is unreachable, and the diagnosis cost
  stays where it is today — worse than the full shape, far better than
  silence.
- **Auto-remediation.** Detection only. Restoring service is
  described by the archived `release-redeploy-recovery` record, and a
  detector that also acts is a detector nobody trusts to be honest.
- **Preview and development environments.** Production only. Preview
  liveness is covered by the `preview-serves` post-deploy check, which
  is a different mechanism on a different trigger.
- **Choosing the alert destination.** That is the owner's gate, not a
  todo of this node.
- **An in-repository heartbeat or synthetic-monitor workflow.** ADR-162
  deliberately externalises this operating concern. Reversing that
  boundary requires a separate owner-ratified decision with evidence
  that repository scheduling is the right operating home; this node
  does not presume the answer.
- **Independent-provider redundancy.** Both checks may use the same
  external monitoring provider. A genuinely independent alerting plane
  is a separate reliability outcome with ongoing operational cost.

## Relationship to the sibling nodes

Detection arm, and the one with the highest leverage: without it every
other guarantee waits on someone noticing. Siblings:
[`deploy-config-fails-the-build`](deploy-config-fails-the-build.plan.md),
[`boot-failure-observability`](boot-failure-observability.plan.md).
The shipped recovery arm is preserved in the archived
`release-redeploy-recovery` record.

*Authored by Birch holds Seedling (e48fe2, agent), 2026-08-03. Amended
2026-08-09 per the adjudicated 2026-08-05 eleven-expert review
(`deploy-reliability-corpus-amendment`, rows 24–30 and 35).*

## Review dispositions

One dated row per routed finding (PDR-140 ledger surface).

| Date | Source | Finding | Routing |
| --- | --- | --- | --- |
| 2026-09-03 | Owner card (the MCP-673 implementing session) | The alert destination that reliably interrupts | Named — owner verbatim: "Slack is the right answer, but the config must be left to the person who does the final implementation, not a now thing": the Practice Slack channel is the destination; its configuration is the implementer's at pickup; the gate row is removed |
