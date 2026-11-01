# The Practice Skills Corpus

`.agent/skills/` is the Practice skills corpus (owner ruling,
2026-08-02): skills about creating this repository, its contents and
mechanisms, and enabling future mechanisms — not about pedagogy or
Oak curriculum content. The name lands here in doctrine; the path
stays `.agent/skills`.

Each skill's canonical form is its `SKILL-CANONICAL.md`; the platform
adapters under `.claude/skills/` and `.agents/skills/` are generated
by the `agent-tools` skills-adapter generator — edit canonicals,
never adapters. Vendored external skills live only in the adapter
tier, pinned by `skills-lock.json`.

Where a new capability lands — in this corpus, another audience set,
or another lever entirely — is decided by
[the capability landing decision procedure](../rules/capability-landing-decision-procedure.md).

## Audience-set registry

One row per audience set. A capability that fits no existing set
does not stretch one: a new set lands deliberately, through the
landing procedure, as a new row here.

| Audience set | Audience | Home | Delivery mechanism |
| --- | --- | --- | --- |
| Practice skills corpus | agents and humans building this repository and its mechanisms | `.agent/skills/` | generated platform adapters (`.claude/skills/`, `.agents/skills/`) |
| Curriculum and teacher skills | teachers and other users of Oak curriculum content | oaknational/oak-ai-plugins | Claude and ChatGPT plugins |
