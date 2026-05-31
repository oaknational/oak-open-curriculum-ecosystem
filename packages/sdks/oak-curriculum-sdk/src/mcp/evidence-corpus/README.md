# EEF Evidence Corpus MCP Surface

This directory owns the EEF-specific MCP tool and prompt surface:

- `eef-explore-evidence-for-context`
- `eef-evidence-grounded-lesson-plan`

The EEF surface is not another way to retrieve Oak curriculum content. Oak API
tools fetch curriculum data, and Oak search tools find relevant content. EEF
adds pedagogical judgement context so an assistant can adapt Oak material with
evidence strength, cost, impact, attribution, caveats, uncertainty, and
partial-coverage honesty intact.

The value claim for this surface is:

> EEF turns curriculum retrieval into evidence-calibrated lesson adaptation,
> while preserving professional judgement and uncertainty.

## Product Boundary

The EEF surface must support the full Oak and EEF-supported lesson-context
estate: all applicable subjects, key stages, topics, and lesson contexts. A
specific scenario may be used to test value, but examples do not narrow the
future product contract to one subject, key stage, topic, or lesson type.

Illustrative example only: for a Sunday-night cover lesson, an assistant can
find Oak material for the teacher's curriculum need, then use EEF evidence to
shape how that material is adapted. It might surface relevant evidence-informed
considerations, explain why they matter, preserve strength, cost, impact,
attribution, and caveats, and state what the evidence cannot prove. This is an
example of the value contract, not the only intended use case.

## Use Conditions

Use EEF evidence both when the teacher explicitly asks for evidence context and
when the assistant is already adapting, combining, or framing Oak material
pedagogically. Whenever the assistant uses EEF, it should briefly say what
prompted that invocation. Use a terse calling-agent pattern such as "EEF because:
[pedagogical choice]." The calling agent may vary the wording as needed, but the
reason should stay short and clear.

Do not use EEF evidence for:

- curriculum retrieval alone;
- guaranteed-outcome claims;
- individual-pupil or class-specific causal claims;
- policy decisions;
- preferred-action, single-answer, or chosen-option wording that replaces
  teacher judgement;
- contexts where relevance, caveats, or uncertainty cannot be preserved.

## Output Obligations

Teacher-facing output that uses EEF evidence must preserve:

- attribution;
- caveats;
- evidence strength;
- cost;
- impact;
- uncertainty;
- weak, partial, or absent evidence whenever it occurs.

EEF evidence is decision support for teacher professional judgement. It must not
be presented as automatic policy, a guarantee of learning gain, or a replacement
for teacher judgement. It should use options and trade-offs language, not
teacher-replacing selection language. The teacher is the expert: the assistant
provides options, evidence context, and honest limits, then gets out of the way
so the teacher can decide what to adopt or change.

`data_version` and `last_updated` are internal metadata for debugging and
logging. They are not teacher-facing evidence context and do not create a
freshness claim by themselves.
