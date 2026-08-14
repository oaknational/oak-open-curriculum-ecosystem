# Capability Landing Decision Procedure

Where does a new capability land? This procedure answers at authoring
time the question the estate used to answer by tacit knowledge — the
consumer that runs at every landing is the landing decision itself.
It is R2 of
[the WS0 skills-estate recommendation](../reports/agentic-engineering/skills-estate-organisation-ws0-recommendation.md),
adopted at the owner's full ruling 2026-08-02; it succeeds the
interim landing guidance, whose sunset fired at that ruling.

The Practice's agentic levers form one disclosure-and-hardness
gradient: always-loaded directives and rules → trigger-loaded rules →
summoned skills → dispatched subagents → zero-context hooks and
validators. Every summonable lever exposes the same interface to the
one constant routing consumer, the what-applies-now decision: a name
and a description (the bar:
[skill-naming-and-description-quality](skill-naming-and-description-quality.md)
§Scope), a binding mode, and a trigger. Hooks and validators sit past
the interface's end — zero-context by design, enforced rather than
routed. This procedure places a capability on the gradient; the
estate's metabolism moves it later — a placement is a starting point,
not a life sentence.

## Trigger

Fires when landing new standing capability into the estate — a
skill, rule, subagent, hook, or validator — and when converting or
re-homing an existing one. The recognisable surfaces: creating files
under `.agent/rules/`, `.agent/skills/`, or a subagent definition
directory; editing hook or validator configuration; and the moment a
capability's home is being chosen. It does not fire for content
edits within an already-landed home.

## Source channels (owner ruling 2026-08-03)

Verbatim: "no skills should be vendored, we have Oak skills, we have
skills installed with `npx skills add` or `pnpm skills add` that is
it." Exactly two legitimate skill channels exist: **Oak-authored
skills in-repo**, and **installer-managed Vendor skills** via
`pnpx skills add`, whose lifecycle (provenance, updates, drift)
belongs to the external skills machinery. Content copied into the
estate outside those channels is out-of-policy: it is removed or
re-homed through the installer, never grandfathered. Installer-managed
payloads are not locally patched (a local edit forks unmanaged
content) — defects route upstream. This ruling bounds
SOURCES; it does not waive
[`third-party-skills-require-security-review`](third-party-skills-require-security-review.md),
which still fires at every adoption moment.

## Overlap and de-duplication (owner ruling 2026-08-03)

Rules, skills, and subagents can overlap in intent and content. When
a disambiguation or de-duplication question arises between them, the
skill is favoured as the single source of truth — the owner's
operative words: "if a question of disambiguation or de-duplication
arises, favour skills as the SSOT, with evals". The ground is
mechanical, not stylistic: of the three levers only skills natively
support evals, so substance homed in a skill is substance the estate
can test and iterate against measured behaviour. The other levers
point rather than duplicate — consistent with step 5's companion
pair, where the rule half carries the invariant and the pointer
while the procedure's substance homes in the skill.

## The procedure, in order

1. **Audience set first.** Which audience does this capability
   serve? `.agent/skills` is the Practice skills corpus — about
   creating the repo, its contents and mechanisms, and enabling
   future mechanisms, not about pedagogy or Oak content (owner
   partition, 2026-08-02). Curriculum- and teacher-facing capability
   is a separate domain, audience, and delivery mechanism (first
   version: `.claude-plugin/marketplace.json`). A capability that
   fits no existing audience set does not stretch one — a new set
   lands deliberately, recorded in the audience-set registry in
   [the Practice skills corpus README](../skills/README.md).

2. **Payload shape.** Is the payload a standing invariant small
   enough to afford in always-loaded context, or a multi-step
   procedure that is not? Do not reason from the tier gloss "rules
   are the always-loaded tier" — RULES_INDEX carries both always-on
   and trigger-loaded rows, so lever choice does not follow from
   loading mode alone.

3. **Disclosure need.** Always in force, loaded on a trigger, or
   consulted at dispatch? Cross this with payload shape: an
   invariant on a trigger is a trigger-loaded rule; a procedure on a
   trigger is a skill. The corpus's own hard case is the worked
   adjudication: `complex-merge` (skill) and
   `pre-merge-divergence-analysis` (rule) fire on the SAME trigger —
   100+ files changed or 10+ dry-run conflicts — and payload shape
   decides them: the rule carries the invariant (always analyse
   before merging), the skill carries the procedure (how). The
   remaining disclosure arms complete the table: judgement consulted
   at dispatch — a fresh context applying a lens at a decision
   moment — lands as a subagent; enforcement that must hold with
   zero context lands as a hook or validator, a check in the gate
   chain rather than prose, landed with its covering test.

4. **Who recognises the trigger?** A trigger-bound landing is sound
   only when the *loader* — a path match, a tool-call match, a
   session-shape flag, or an always-invoked ceremony skill — can
   recognise the moment. When recognition depends on the agent
   noticing "I am now in situation X", the agent must already
   remember the capability to know to load it, which is the failure
   it exists to prevent; land it always-on or bind it to a loader
   that fires mechanically.

5. **Companion pair.** Procedure-shaped content that must always be
   in force lands as a skill plus a paired rule, declared as one
   landing, each half carrying a pointer to the other. Never
   improvise the binding. The estate's current always-active
   bindings (`commit`, `napkin` — frontmatter improvisations on the
   retiring `classification` field) are this step's harm evidence,
   not its exemplar: each converges to a declared pair at its next
   touch.

6. **Individual or family** (skills only). A family bundle exists
   only on the mechanical test: two or more skills sharing bundled
   files that are not independently usable. Everything else lands
   flat. A collection is a marker, not a test.

7. **Owned or installer-managed.** External capability arrives only
   through the installer channel (§Source channels) into the adapter
   tier (`.claude/skills/`, `.agents/skills/`) in the installer's own
   layout, never into the canonical corpus. The
   adoption gate applies:
   [third-party-skills-require-security-review](third-party-skills-require-security-review.md)
   for the security review, and
   [skill-naming-and-description-quality](skill-naming-and-description-quality.md)
   §Trigger for recording description quality at the gate.

## Landing checks

- **Name and description** meet
  [skill-naming-and-description-quality](skill-naming-and-description-quality.md)
  — the bar binds skills, rules, and subagents alike.
- **Status-independence**: the payload's operative prose must not
  depend on a terminal status that can die silently (a ticket state,
  a "current" pointer, an in-force marker). Restate it
  status-independent, or bind the dependence to the surface that
  owns the status
  ([no-moving-targets-in-permanent-docs](no-moving-targets-in-permanent-docs.md)).
- **Consumer with element**: every organisational element the
  landing introduces (a directory shape, an annotation, an index
  entry) lands WITH its mechanical consumer in the same motion —
  organisations decay without consumers.
- **Rules land whole**: a rule mint lands all four on-disk forms
  plus its RULES_INDEX row in one commit (the index's
  rule-authoring contract); a trigger-loaded landing with no loader
  entry is a deleted rule.

## Falsifier

Runnable at every landing: landing-convention divergence recurring
after adoption — two conventions authored concurrently again, or a
cross-lever binding improvised outside the companion-pair pattern —
means this procedure failed its one job. Route the instance to the
Director with both artefacts named.
