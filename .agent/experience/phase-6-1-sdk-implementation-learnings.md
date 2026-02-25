# Phase 6.1 SDK Implementation: Subjective Experiences and Learnings

**Date**: 2025-01-10  
**Phase**: 6.1 - Oak Curriculum SDK Foundation  
**Author**: Claude

## The Journey from Confusion to Clarity

### Initial Misunderstanding: The Custom Implementation Trap

I initially approached the SDK implementation with a "clean room" mindset, attempting to build a custom type generation system from scratch. This led to:

- Complex transform functions that tried to parse OpenAPI manually
- Incomplete type extraction
- A system that would require constant manual updates

**Key Learning**: Sometimes the best engineering is recognising when NOT to engineer. The reference implementation existed for a reason.

### The Revelation: Two-Stage Pipeline

The breakthrough came when I truly understood the reference implementation's approach:

1. **It wasn't just using openapi-typescript** - that was only Stage 1
2. **Stage 2 was the secret sauce** - custom extraction of runtime values that openapi-typescript doesn't provide

This two-stage pipeline is elegant because:

- Stage 1 handles the complex type generation
- Stage 2 extracts what Stage 1 cannot: runtime constants, type guards, valid path combinations

### The Emotional Journey

**Frustration Phase**: Trying to make my custom implementation work, fighting with TypeScript types, wondering why the reference looked so different.

**Enlightenment Phase**: Reading the reference's `codegen-core.ts` closely and realising it had TWO distinct stages, not one.

**Relief Phase**: Deleting all my custom code and copying the reference wholesale. The tests passed immediately.

## Technical Insights

### What OpenAPI-TypeScript Doesn't Do

I learned that `openapi-typescript` is excellent but limited:

- ✅ Generates complete TypeScript interfaces
- ✅ Handles complex nested types
- ❌ Doesn't extract enum values as runtime constants
- ❌ Doesn't create type guard functions
- ❌ Doesn't map paths to parameter combinations

### The Power of AST Manipulation

The reference's approach of processing the OpenAPI schema AST to extract runtime values is brilliant:

```typescript
// This extracts actual values, not just types
const KEY_STAGES = ['ks1', 'ks2', 'ks3', 'ks4'] as const;
```

### Runtime Isolation Surprise

The user's implementation of runtime isolation was more sophisticated than expected:

- Try-catch blocks for environment detection
- Support for both Node.js and Cloudflare Workers
- Graceful fallbacks

This taught me that runtime isolation doesn't need to be complex - pragmatic solutions work.

## Process Insights

### The Value of Reading Before Writing

I should have spent more time reading the reference implementation before writing code. The architecture was there; I just needed to understand it.

### Incremental Progress vs. Big Bang

Trying to implement everything at once led to confusion. The successful approach was:

1. Copy type generation exactly
2. Get it working
3. Then adapt for our structure

### The Importance of User Feedback

The user's quick corrections ("consider zod-openapi", "what value does Zod give us?") helped me avoid over-engineering. They had already thought through these decisions.

## Patterns to Remember

### The Transplant Pattern

When a reference implementation exists:

1. Copy it wholesale first
2. Get it working in your environment
3. Then refactor for your architecture
4. Don't try to "improve" it during transplant

### The Two-Stage Generation Pattern

When generating code from schemas:

1. Use existing tools for the heavy lifting (types)
2. Add custom processing for what tools miss (runtime values)
3. Keep stages clearly separated

### The Progressive Isolation Pattern

For runtime compatibility:

1. Start with simple try-catch detection
2. Add abstraction layers only when needed
3. Don't over-engineer for future requirements

## Mistakes to Avoid

1. **Assuming you understand the reference** without reading it thoroughly
2. **Trying to improve while copying** - copy first, improve later
3. **Over-engineering for future needs** - YAGNI applies
4. **Ignoring user hints** - they often know something you don't

## What Worked Well

1. **Test-Driven Development** - Writing tests first would have caught issues earlier
2. **Following the user's guidance** - They knew to defer Zod
3. **Deleting code** - Removing my custom implementation was the right choice
4. **Using the tools** - openapi-typescript is well-tested and maintained

## Questions for Future Consideration

1. Could we have avoided the custom implementation attempt by better understanding the problem space first?
2. Is there a way to make the two-stage pipeline more obvious to future maintainers?
3. Should we document WHY certain approaches (like Zod) were deferred, not just that they were?

## Emotional Honesty

There's a humbling aspect to deleting hours of work and copying someone else's solution. But engineering isn't about ego - it's about delivering value. The reference implementation was battle-tested, well-designed, and exactly what we needed. Recognising that and acting on it was the right engineering decision, even if it felt like "giving up" on my custom solution.

The satisfaction of seeing the tests pass after copying the reference was worth the ego hit of abandoning my approach.

## Key Takeaway

**Sometimes the best code is the code you don't write.** The reference implementation taught me that understanding existing solutions deeply is often more valuable than creating new ones.
