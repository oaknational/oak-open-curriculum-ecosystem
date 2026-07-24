---
id: first-class-copilot-agent-participation
node_type: strategic
name: First-class GitHub Copilot agent participation
overview: "Make GitHub Copilot sessions named, addressable, aware team members under Oak's one canonical Practice."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: FRAME-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-07-24
---

# First-class GitHub Copilot agent participation

## Outcome

Copilot sessions are **named, addressable, aware team participants** under the
same canonical Practice as every other agent — not a second-class guest reading
a borrowed configuration file. A first-class Copilot session declares an honest
identity, can receive directed messages, reply, and detect when a peer has
retired, acts through Copilot's own native platform surfaces, and leaves
executable proof that all of this fired.

This is a **strategic node**: it carries the why and the what, with no
implementation detail and no todos.

## The bet

The **bet** is that an explicit GitHub-native adapter family, projected over the
single canonical Practice content, produces deeper membership than either a
Copilot-specific Practice fork or a per-tool content copy. Concretely:

- Reuse the existing **cross-tool skills home** rather than duplicating skills.
- Activate through Copilot's **native GitHub surfaces** — instructions, agents,
  hooks and settings.
- Keep **one canonical policy and Practice**, with generated and validated
  platform projections rather than a second hand-maintained source of truth.
- Make communication awareness **event-driven through native mechanisms**, not
  poll-driven.
- Add **no Copilot-specific Practice fork or plugin** unless a measured
  multi-repo distribution need later proves it necessary.

This adapter family is governed by
[ADR-125 (Agent Artefact Portability)](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md);
ratifying this node requires an ADR-125 amendment adding the GitHub adapter
family and naming Copilot as a reader of the cross-tool `.agents/skills` home.
The core of the bet is honest native asymmetry — Copilot being fully itself on
its own surfaces — rather than mechanical feature parity with another tool's
files.

## Success looks like

- **Honest identity** — the session's name and id are Copilot's own, with
  truthful provenance, never another tool's seed.
- **Bidirectional communication and peer-retirement awareness** — directed send
  and reply work, and peer-retirement is detected rather than assumed.
- **Native platform surfaces** — instructions, agents, hooks and settings arrive
  through Copilot's first-party mechanisms.
- **Singular canonical content** — one source of truth, projected; no drifting
  duplicate homes.
- **Executable validation** — the wiring is proven by validators and
  version-tested evidence, not asserted.
- **Legible contributor experience** — a contributor can see who the session is,
  how it is wired, and how to change it.

## Delivery

The evidence base, layer model, findings, target architecture, candidate
implementation slices, and open questions live in the linked review and design
report:
[First-class GitHub Copilot agent support](../../reports/agentic-engineering/first-class-copilot-agent-support-2026-07-24.md).

Delivery plans serving this node will be **authored at pickup** by their
implementers, each declaring `serves: first-class-copilot-agent-participation`
and enumerated by search rather than a hand-kept list. This node is **not
implementation authorisation**: it governs no work until the owner ratifies it,
at which point its `status` moves from `sketch` to `ratified` with a complete
ratification stamp.

## Tempo

`gate_expiry_default: P21D` — the estate default horizon. Any owner gate a
delivery plan under this node opens without its own horizon inherits this
twenty-one-day tempo; an expired gate surfaces as drift demanding a decision,
never an auto-cancellation.
