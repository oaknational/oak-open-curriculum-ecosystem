# ADR-007: Accept Current Technical Debt as Architectural Markers

## Status

Accepted

## Context

After implementing stricter linting rules, we discovered 103 relative parent import violations (`../` imports). Initial attempts to fix these through various refactoring approaches:

- Foundation layer approach increased violations (101→128)
- Flat structure created chaos (178 errors)
- TypeScript path mappings only masked the problem

These violations reveal deeper architectural truths about coupling and domain boundaries.

## Decision

Keep relative import violations as warnings, not errors. Treat them as architectural truth detectors that reveal where our physical structure doesn't match our logical structure.

## Rationale

- **Immediate Stability**: System is currently working well
- **Learning Opportunity**: Violations teach us about natural domain boundaries
- **Cost/Benefit**: Major refactoring would provide little immediate business value
- **Future Guidance**: Warnings serve as markers for future refactoring
- **Avoid Masking**: Better to see the truth than hide it with aliases
- **Architectural Evolution**: Let the architecture evolve naturally over time

### Scientific Validation

Complex systems research (Scheffer et al., 2009) shows that systems approaching critical transitions exhibit "early warning signals" including:

- Increasing autocorrelation (tighter coupling)
- Rising variance (unstable relationships)
- Slower recovery (changes propagate slowly)

Our 103 import warnings are precisely such signals - they indicate where the architecture is approaching transitions and naturally wants to form new boundaries. This isn't technical debt, it's architectural intelligence.

## Consequences

### Positive

- No risk of breaking working system
- Team can focus on feature development
- Natural refactoring opportunities become clear over time
- Warnings provide ongoing architectural insights
- Avoid premature architectural decisions

### Negative

- 103 warnings in the codebase
- May appear as "unfinished" to external observers
- Risk of warnings being ignored over time
- New developers might be confused by the warnings

## Implementation

- Configure ESLint rule as 'warn' not 'error'
- Document why warnings exist in architecture docs
- Use warnings as input for architectural planning
- Review warning patterns quarterly
- Refactor only when clear business need emerges
- Track warning count as architectural health metric
