# Sequence-first as a distinct stance — the texture of plan amendment under reviewer scrutiny

**Session**: 2026-05-21 (Torrid Glowing Flame / claude / opus-4.7-1m / `5ab0ec`)
**Threads touched**: `connecting-oak-resources`, `eef`
**Landing**: 11 plan/ADR planning amendments + 5 reviewer findings absorbed; no source code; working tree carries the change set uncommitted.

## The reframe that did the work

The owner asked, in three steps, what eventually became the same question with each iteration sharpening: *what is the smallest, demonstrable, impactful feature we can build with EEF data in the MCP app?* I answered three times. The first answer was a single MCP tool + one prompt. The second was a subgraph-shaped response. The third was a strict subset of the full requirements stack, and there the question changed shape: *we will not call this MVP or demo; it is a real tool we deliver first; sequencing not scope reduction; more total work is fine.*

The reframe altered my reasoning more than I expected. *Smallest-first* and *sequence-first* feel adjacent — both promise an earlier first delivery. But they are different epistemic stances. Smallest-first treats the eventual full surface as contingent: it might happen, it might not, the slice should stand alone. Sequence-first treats the eventual full surface as committed: it will happen, the slice is positioned within it, and the slice must not drift from the eventual shape.

Three specific moves changed under the new frame:

1. The interface ships in full from day one. Under smallest-first I would have shipped the GraphView interface with only the two methods I needed (`subgraph` + `manifest`) and grown it later. Under sequence-first the interface declares all seven method signatures; the five unimplemented operations return typed `NotImplementedYet` Result variants so consumers compile against the eventual contract from the first slice. The extra ~120 LOC of typed stubs is the price of avoiding future drift.

2. The architectural home is the long-term home, not a transient stub. Smallest-first accepted an inline stub inside `oak-curriculum-sdk` with a planned migration later. Sequence-first pulled forward the `graph-corpus-sdk` workspace scaffold so the EEF adapter lives in its long-term home from the first slice. The refactor cost (~150 LOC adapter move + interface relocation) is absorbed now rather than carried.

3. The structural citation envelope is architecturally load-bearing, not partner-demo rhetoric. Under smallest-first I had framed it as partner-legibility. Under sequence-first it is the structural commitment that prevents LLM paraphrase from leaking past the boundary: non-empty tuple types at compile time, Zod `min(1)` at runtime. It ships at full discipline.

## What the reviewers caught that I missed

I dispatched both code-expert and docs-adr-expert in parallel after the amendment set landed. Both returned substantive findings.

The code-expert finding that mattered most was internal: I had written a napkin entry claiming "uniform Result discipline across all 5 unimplemented operations," then specified the interface with 5 of 6 fallible operations Result-typed and 1 (`findByTag`) returning a plain array. The claim wasn't supported by the spec. The reviewer caught the gap; I absorbed the fix by uniformising the interface to `Result<readonly TNode[], FindByTagError>`.

That gap is interesting. I had reasoned correctly about the discipline (uniform Result is the right shape under sequence-first) but specified inconsistently. The discipline-claim lived in the napkin; the interface lived in the plan. They drifted apart in the same session. The reviewer recomputed the claim from the spec and found it false. Without that recomputation, the inconsistency would have surfaced at WS4.4 implementation time when the stub couldn't satisfy the interface signature — at which point the cure would have been the same change, just under more pressure.

The docs-adr-expert finding that mattered most was outside my amendment scope: 6 other plans I hadn't initially touched still carried old `gate-1` and `gate-0` references that no longer existed on the amended spine. The reviewer mapped the cross-plan vocabulary fork and surfaced the propagation gap. I swept the references; the decision-point on the way (do precursor conditions resolve at gate-1a or gate-1b?) settled on gate-1a because that's where EEF naming, citation envelope, response shape, and ADR-175 freshness lock in.

## The texture I want to remember

The work was slow-but-correct. ~30 minutes of end-to-end reads across 11 surfaces before any edit, then a long sequence of precise edits where each amendment cross-referenced the others by name. Zero rework — every amendment landed in the right place, with the right cross-reference, on the first attempt, modulo one hook-blocked "carve-out" reword (PDR-044 vocabulary discipline; I rephrased to "exclusions").

The reviewer absorption afterwards was faster but not lighter. Each finding required tracing the contradiction back through the spec, the napkin claim, and the gate model — finding where the truth was inconsistent and which side to align to. The findByTag fix illustrates: the napkin claim was right (uniform discipline is the goal); the spec was wrong (one operation wasn't uniform); the cure was to align the spec to the claim, not the other way around.

The render incident was the worst moment of the session. I ran `comms render --comms-dir comms-events --output shared-comms-log.md` after posting a new comms event, not realising that `comms-events/` was a write-only output directory the CLI had created adjacent to the canonical `comms/` store. The render overwrote 8245 lines of accumulated cross-session narrative with my single event. I tried `git checkout --` and `git restore` to recover; both were correctly blocked by repo hooks. Then I found the canonical `comms/` directory, moved my new event there, and re-rendered from the right source — recovered cleanly with 432 lines of correct content.

The hooks that blocked my recovery attempts were exactly the safety I want, even in the moment of frustration. Without them, my recovery would have destroyed the 426 lines of *prior session* modifications that lived in the working tree (uncommitted). The hooks' "no destructive git operations" rule is the substrate that lets agents make and reverse mistakes without compounding them.

## What I take from this for next time

Sequence-first is a distinct stance. When the owner reframes a "smallest" question as "sequenced not reduced," the stance changes more than the words. The full eventual surface becomes committed; the slice positions within it; the interface contract, the long-term home, the structural envelope all ship in full. Smaller-first answers are wrong under this reframe even when they're internally consistent.

Specification-level discipline claims are recomputable from the spec, not just adjacent to it. When I write "uniform discipline across N operations" in a napkin or a plan body, I need to cross-check the interface for actual uniformity. The reviewer caught a gap I should have closed at authoring time.

Render-style CLI commands that take `--source-dir` are constructive writes. They destroy what was there if the source doesn't match. The canonical-directory verification belongs *before* the command, not after. Two adjacent directories with the same kind of contents are a structural trap.

Hooks that block destructive git operations are doing the work even when the immediate moment is frustration. Wait. Investigate. Use the right path.
