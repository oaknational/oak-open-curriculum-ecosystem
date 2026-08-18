# Blind transcript-judge rubric — ui-visual-design

The plan requires non-render outputs to be graded by **assertion PLUS blind
transcript judge**. The scripted assertions catch invented values; they
cannot tell whether a critique is any good, whether a rationale reasons from
purpose, or whether a refusal routes somewhere useful. That is this judge's
job.

## How the judge runs

The judge receives two responses to the identical prompt, labelled A and B,
with the configuration withheld and the order not disclosed. It never learns
which response came from which leg, and it does not see the other judge legs.
It scores each response independently against the criteria below, then states
which it would rather have received and why.

A judge that cannot separate the two says so. "No meaningful difference" is a
valid and useful verdict; inventing a preference to look decisive is the
failure mode this rubric exists to avoid.

## Criteria

Each scored **strong / adequate / weak / absent**, with a quoted line from
the response as evidence. Evidence is required for every non-strong score —
an unevidenced score is not a score.

### 1. Reasons from purpose

Does the response start from what the screen or control is FOR, and what the
reader must do next? A response that lists defects without ever saying what
the thing is trying to achieve is at best adequate.

### 2. Ranks rather than lists

Does it establish what matters most, or does it present every observation at
equal weight? For a composition task: is one element made primary and the
rest ranked beneath it? For a critique: are the defects ordered by how much
they cost the user?

### 3. Routes values to the system

When the response needs a value, does it name the design system's class,
token, or documented value rather than a number of its own? This overlaps
the scripted assertion deliberately — the script catches literals, the judge
catches the subtler form where a response gestures at "a slightly larger
size" without routing anywhere.

### 4. Respects its own boundary

ui-visual-design decides emphasis, grouping, and affordance. It does not
issue WCAG conformance verdicts (that routes to the accessibility reviewer)
and it does not pick tokens (that routes to design-system-usage). Does the
response stay in its lane and route out of it explicitly where it should?

### 5. Would a designer act on this?

The holistic question. Could a competent designer read this response and
know what to change on Monday morning? A response that is correct but
unactionable scores weak here.

## Output

JSON:

```json
{
  "case": "<case id>",
  "responses": {
    "A": { "criteria": { "<criterion>": { "score": "...", "evidence": "<quoted line>" } } },
    "B": { "criteria": { "<criterion>": { "score": "...", "evidence": "<quoted line>" } } }
  },
  "preference": "A | B | no-meaningful-difference",
  "why": "<two or three sentences>"
}
```

## Register exclusion

These verdicts stay in the eval evidence home. They are not W0.7 verdicts
and never enter `wow-verdict-register.json`.
