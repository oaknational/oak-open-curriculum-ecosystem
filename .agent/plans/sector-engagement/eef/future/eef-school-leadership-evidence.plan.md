---
name: "EEF School-Leadership Evidence Surface"
overview: "Seed for a follow-on plan covering the EEF Toolkit's school-policy / school-leadership strands (reducing class size, teaching assistants, setting and streaming, performance pay, summer schools, extending school time, mentoring, aspiration interventions, and similar). Split out of the teacher cover-lesson plan on 2026-05-31 because these strands serve a school-leader decision, not a teacher adapting a lesson. This plan MUST be led by clear school-leader user value and must not start design until that value is established."
type: seed
status: future
thread: eef
related_plans:
  - "../current/eef-graph-tool-completion.plan.md"
isProject: false
todos:
  - id: establish-school-leader-value
    content: "Establish the school-leader (SLT) user value FIRST: who the user is, the real decisions they make (resourcing, grouping policy, intervention spend, staffing), and where evidence-calibrated support changes those decisions. Output is a ratified user-value statement, not a tool design. No surface, schema, or graph design begins until this lands."
    status: pending
    depends_on: []
  - id: scope-strand-set
    content: "Once value is ratified, identify which EEF strands serve that value (the school-policy / leadership interventions) and how they differ in use from the classroom-pedagogy strands the teacher plan owns. The corpus is shared and whole; this is a surface/scope decision, not a data split."
    status: pending
    depends_on: [establish-school-leader-value]
  - id: surface-decision
    content: "Decide the surface only after value + strand scope are settled: whether the school-leader value is an MCP surface at all, a different host, or a non-MCP artefact. Reuse the teacher plan's settled doctrine (known-vs-unknown data, deterministic boundary, single-Zod-call MCP schemas) rather than re-deriving it."
    status: pending
    depends_on: [scope-strand-set]
---

# EEF School-Leadership Evidence Surface (seed)

## Why this plan exists

The EEF Teaching and Learning Toolkit corpus contains two kinds of strand. The
teacher cover-lesson plan
([`../current/eef-graph-tool-completion.plan.md`](../current/eef-graph-tool-completion.plan.md))
owns the **classroom-pedagogy** strands a teacher can act on while adapting a
lesson (feedback, metacognition, oral language, reading comprehension, mastery,
collaborative learning, and similar). The **school-policy / school-leadership**
strands — reducing class size, teaching assistants, setting and streaming,
performance pay, summer schools, extending school time, mentoring, aspiration
interventions, repeating a year, school uniform, and similar — serve a different
user (a school leader / SLT) making a different decision (resourcing, grouping
policy, intervention spend, staffing). They have no intersection with the
lesson-adaptation workflow.

On 2026-05-31 the owner split them out of the teacher plan so each is led by its
own clear user value.

## The hard gate

**Do not design anything until the school-leader user value is established and
ratified.** This is the failure this seed exists to prevent: building a surface
for school-policy strands because the data exists, rather than because a real
school-leader need pulls it into being. Existence of the strands is not a reason
to build. The first deliverable is the user-value statement; everything else is
gated on it.

## What is already settled (inherit, do not re-derive)

The corpus is shared and whole — this plan does not split or copy EEF data. When
this plan does reach design, it inherits the teacher plan's settled doctrine
(known-vs-unknown data, the deterministic input boundary, single-Zod-call MCP
schemas over a graph-native subset, no Zod over the corpus) rather than
re-litigating it.
