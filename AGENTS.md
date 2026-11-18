# AGENTS.md

Read [AGENT.md](.agent/directives/AGENT.md)

See [RULES_INDEX.md](RULES_INDEX.md) for the canonical rules list.

## Code review

Review against the pull request description's `## Scope` section. A finding whose remedy
falls outside the declared scope is reported as an out-of-scope observation with no
proposed change; do not propose additions the scope does not ask for. On a prose- or
records-class changeset, and on the prose findings of a mixed one, grade against the
declared intake (artefact class, verification point, bar) rather than against
completeness. On code, the specification is the tests and recorded fixtures the pull
request carries: a defect that a tested or recorded input exercises is a finding; a case no
such input exercises is an observation. Report an observation in whatever shape your output
allows — an inline comment that opens with "Observation:", or one list under one heading —
never as a blocking finding. Documentation, naming and wording items go in one such
observation, not one comment each. Once the description records that the settlement budget
is spent, items on code unchanged since your last review are observations, not findings.

<!-- CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_START -->

## Codex team-session alert bootstrap

For coordinated Codex work, load `$oak-start-right-team` before claiming and
keep the root watcher live. Then follow the Codex relay procedure at
`.agent/rules/use-monitor-for-event-driven-wake.md#codex-notify-session-relay`.
The relay is an ACTIVE-TURN ALERT, not idle wake: `collaboration.send_message`
reaches a root mid-turn but does not start a turn on an idle root, so bounded
foreground polling plus the post-restart gap sweep are a named requirement of
Codex participation, with or without the relay. Watcher liveness is not proof
of reasoning wake, and canonical comms monitoring does not cover file-only ARC
or standards channels.
<!-- CODEX_TEAM_ALERT_BOOTSTRAP_GENERATED_END -->
