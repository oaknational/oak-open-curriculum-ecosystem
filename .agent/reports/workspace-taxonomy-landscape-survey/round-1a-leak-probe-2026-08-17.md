# Round-1a blindness-leak probe (zero-cost, pre-1b launch gate)

Mechanical grep over the committed `round-1-raw.json` (46 walkers) for
ratified-layout vocabulary, run 2026-08-17 as launch gate 3 of the 1b
fleet design. Patterns: `packages/(core|libs|sdks|design)` tier paths
("tier-path"), ADR references ("adr-ref"), actual estate directory
names `agent-tools|agent-graphs` ("estate-dir-name").

## Result: 20 of 46 walkers echo ratified-layout vocabulary

| Grounding | Echoing walkers | Signature |
| --------- | --------------- | --------- |
| repo-direct | 13 (idx 3, 6, 9, 12, 15, 18, 21, 27, 30, 33, 36, 39, 45) | ALL carry tier-path AND estate-dir-name |
| facts-sheet | 3 (idx 1, 4, 19) | tier-path only |
| requirements-only | 4 (idx 8, 14, 38, 41) | tier-path only |

No walker referenced an ADR by name.

## Reading

1. **The repo-direct leak is confirmed at full penetration.** Every
   echoing repo-direct walker names actual estate directories — they
   read the live layout (which the 1a FORBIDDEN list permitted) and
   reproduced its vocabulary. The 1a repo-direct arm is contaminated
   in exactly the direction the 2026-08-17 frame-challenger predicted:
   toward affirming the incumbent shape.
2. **Seven SEALED walkers echo the tier-path vocabulary anyway.**
   Facts-sheet and requirements-only walkers had no repository access,
   yet spontaneously produced `packages/core`-family layouts. That is
   direct evidence for the review's "third pole": the tiered-packages
   shape is partly INDUSTRY CONVENTION carried in model priors, not
   estate territory — precisely what the 1b decoy-estate controls are
   built to convict or acquit.
3. **Both readings weaken any "the 1a dominant basin is territory"
   claim** and are exactly why 1b's baselines, closed blindness,
   decoy controls, and free-form arm exist. The 1a archive remains an
   informative point in instrument space; this probe is part of its
   calibration record for the combined 1a+1b harvest.

Provenance: probe script inline in the session transcript; patterns
above are the complete pattern set; re-runnable in one minute against
the committed archive.
