# Operating Model and Topology

This deep dive covers how the repository describes an agent's working stance,
interaction planes, and local-doctrine refinements.

## Canonical Anchors

- [ADR-119](../../../../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)
- [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- [How the Agentic Engineering System Works](../../../../docs/foundation/agentic-engineering-system.md)
- [practice.md](../../../practice-core/practice.md)

## Primary Source Material

- [workbench-agent-operating-topology.md](../workbench-agent-operating-topology.md)
- [cross-platform-agent-surface-matrix.md](../../cross-platform-agent-surface-matrix.md)
- [platform-adapter-formats.md](../../platform-adapter-formats.md)
- [agentic-engineering-practice.md](../../prog-frame/agentic-engineering-practice.md)
- [history-of-the-practice.md](../../history-of-the-practice.md)
- [2026-02-21-cross-agent-standardisation-landscape.research.md](../../../plans/agentic-engineering-enhancements/2026-02-21-cross-agent-standardisation-landscape.research.md)
- [openai_claude_gemini_apps_sdk_comparison.md](../../../research/openai_claude_gemini_apps_sdk_comparison.md)

## Current Synthesis

- The workbench topology note is the clearest compact model of the turn-level
  operating system: visible exchange, execution channel, posture selector,
  private feed, evidence surfaces, and local doctrine.
- ADR-119 and `agentic-engineering-system.md` supply the higher-order framing:
  philosophy, structure, and tooling. The workbench note sits below that as an
  operating-model extract rather than a replacement.
- ADR-125, the surface matrix, and the adapter-format reference show that
  portability here means **canonical content plus asymmetric adapters**, not
  cross-platform symmetry.
- The most useful synthesis path is therefore:
  canonical doctrine -> operating-model note -> live platform surfaces ->
  cross-vendor research.

## Good Follow-Up Questions

- Which parts of the operating model are local doctrine versus broad platform
  defaults?
- Where does platform asymmetry materially change what a workflow can promise?
- Which operating-model concepts deserve graduation into broader human-facing
  docs, and which should stay as reference notes?

## Related Lanes

- [research operating-model lane](../../../research/agentic-engineering/operating-model-and-platforms/README.md)
- [formal synthesis lane](../../../reports/agentic-engineering/deep-dive-syntheses/README.md)
- [deep-dives index](./README.md)
- [hub README](../README.md)
