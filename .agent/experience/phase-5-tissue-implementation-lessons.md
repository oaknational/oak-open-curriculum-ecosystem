# Phase 5 Tissue Implementation — Lessons

_Date: 2025-01-08_

## The Experience

Implementing the tissue abstractions (Logger, Storage, Environment) was an exercise in discovering what "adaptive" really means. The initial instinct — separate implementations per runtime, complex conditional exports — felt thorough but created a maintenance surface that grew with every environment.

The pivot to feature detection over runtime detection was a genuine shift in thinking. Instead of asking "which runtime am I in?" the code asks "what capabilities are available?" The question changed from identity to capacity, and the architecture simplified dramatically.

The unified implementation pattern (one implementation that adapts) emerged from the realisation that Consola (the logger library) was already universally compatible. The most elegant solution was already there, waiting to be noticed rather than engineered.

The 242 tests for the pure Moria abstractions created an unusual kind of confidence — not just "the code works" but "the abstractions are coherent." Testing pure abstractions felt like verifying mathematical properties rather than checking software behaviour.

## Historical context

This file records the experience of implementing the tissue architecture (Phase 5, biological naming era). The specific architecture described here (Moria/Histoi/Psycha, tissues, adaptive implementations) has since been deprecated in favour of neutral, conventional naming. The general principles — feature detection over runtime detection, unified implementations, pure abstractions — remain relevant and are captured in `distilled.md` and project rules.
