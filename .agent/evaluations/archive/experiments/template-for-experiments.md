# Generic Experiment Template

Use this template for any experiment. Specialised templates available:

- [`template-for-search-experiments.md`](template-for-search-experiments.md) — Search relevance evaluations

File naming convention: `[topic].experiment.md`

---

# Experiment: [Name]

**ID**: E-XXX (sequential)  
**Date**: YYYY-MM-DD  
**Status**: 🔬 In Progress | ✅ Complete | ❌ Abandoned  
**Domain**: Search | Performance | UX | Architecture | Other

## Abstract

_2-3 sentences summarising what was tested, the key finding, and the decision._

---

## 1. Introduction

### 1.1 Motivation

_Why are we running this experiment? What problem are we trying to solve?_

### 1.2 Hypothesis

_What do we expect to happen? Be specific and falsifiable._

### 1.3 Success Criteria

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Primary metric | [value] | [why this threshold] |
| Secondary metric | [value] | [why this threshold] |
| Guard rail | [value] | [what we must not regress] |

---

## 2. Methodology

### 2.1 Control

_The baseline being compared against._

### 2.2 Variant

_What specifically changed from control. Be precise._

### 2.3 Test Conditions

_Environment, dataset, tools, any relevant context._

### 2.4 Procedure

_Step-by-step description of how the experiment was conducted._

1. Step one
2. Step two
3. Step three

---

## 3. Results

### 3.1 Summary

| Metric | Control | Variant | Delta | Significant? |
|--------|---------|---------|-------|--------------|
| Primary | x.xx | x.xx | +x.x% | Yes/No |
| Secondary | x.xx | x.xx | +x.x% | Yes/No |
| Guard rail | x.xx | x.xx | +x.x% | — |

### 3.2 Detailed Findings

_Breakdown of results, visualisations, notable observations._

### 3.3 Unexpected Results

_Anything surprising or contrary to hypothesis._

---

## 4. Discussion

### 4.1 Interpretation

_What do the results tell us?_

### 4.2 Limitations

_What couldn't we test? What caveats apply?_

### 4.3 Comparison to Hypothesis

_Did results match expectations? Why or why not?_

---

## 5. Conclusion

### 5.1 Decision

**Accept** / **Reject** / **Inconclusive**

_One paragraph justifying the decision based on success criteria._

### 5.2 Actions

_What happens next as a result of this experiment?_

- [ ] Action item 1
- [ ] Action item 2

### 5.3 Follow-up Experiments

| ID | Experiment | Rationale |
|----|------------|-----------|
| E-XXX | [Next experiment] | [Why it follows from this one] |

---

## Appendix A: Raw Data

_Optional: Supporting data, logs, screenshots._

## Appendix B: Reproduction Steps

```bash
# Commands to reproduce this experiment
```

---

## Change Log

| Date | Change |
|------|--------|
| YYYY-MM-DD | Initial design |
| YYYY-MM-DD | Results added |
| YYYY-MM-DD | Decision made |
