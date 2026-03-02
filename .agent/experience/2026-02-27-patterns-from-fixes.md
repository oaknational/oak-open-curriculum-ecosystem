# Patterns from Fixes

**Date**: 2026-02-27
**Tags**: type-safety, code-generation, practice-evolution

The generator fix was surprisingly clean. Two `as` casts in a single template
file propagated into 24 generated tool files — the amplification effect of
generators. But the reverse was also true: two localised template changes
eliminated all 24 instances. No consumer code changed. The runtime already
treated invoke output as input to validation; the type system just hadn't
been told.

What was unexpected was how naturally the fixes became patterns. The const
map approach (Cast 1) and the unknown-until-validated approach (Cast 2) both
existed as implicit knowledge — things experienced engineers "just know" —
but had never been written down. Writing them down as patterns with
`use_this_when` triggers transformed them from tacit knowledge into
discoverable guidance.

The barrier to entry for patterns felt right: the four criteria (broadly
applicable, proven, prevents a recurring mistake, stable) excluded most
session-specific learnings. Only the two that were genuinely reusable passed.
The napkin captures everything; distilled.md refines; patterns settle only what
has proven itself through implementation. Each stage has a different bar, and
that graduated filtering is what prevents the pattern library from becoming a
dumping ground.

The shift that matters: before this session, type assertions in generated code
were framed as "a documentation gap" — something to acknowledge. The reframe
to "a generator bug" changed the entire approach. Documentation exceptions
are entropy; generator fixes are engineering. The distinction is about whether
you accept the problem or solve it.
