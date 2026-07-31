# AGENTS.md

Read [AGENT.md](.agent/directives/AGENT.md)

See [RULES_INDEX.md](RULES_INDEX.md) for the canonical rules list.

<!-- CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_START -->

## Codex team-session alert bootstrap

For coordinated Codex work, load `$oak-start-right-team` before claiming and
keep the root watcher live. Then follow the Codex relay procedure at
`.agent/rules/use-monitor-for-event-driven-wake.md#codex-notify-session-relay`.
If the relay child exposes `collaboration.send_message`, use the relay;
otherwise declare NOTIFY degraded and follow that rule's bounded-poll fallback.
Watcher liveness is not proof of reasoning wake, and canonical comms monitoring
does not cover file-only ARC or standards channels.
<!-- CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_END -->
