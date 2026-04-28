# Portability and Platform Surfaces

This deep dive covers how the practice travels across tools, what adapter
surfaces exist, and where cross-vendor differences matter.

## Canonical Anchors

- [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
- [ADR-124](../../../../docs/architecture/architectural-decisions/124-practice-propagation-model.md)
- [cross-platform-agent-surface-matrix.md](../../cross-platform-agent-surface-matrix.md)
- [platform-adapter-formats.md](../../platform-adapter-formats.md)

## Primary Source Material

- [2026-02-21-cross-agent-standardisation-landscape.research.md](../../../plans/agentic-engineering-enhancements/2026-02-21-cross-agent-standardisation-landscape.research.md)
- [openai_claude_gemini_apps_sdk_comparison.md](../../../research/openai_claude_gemini_apps_sdk_comparison.md)
- [official-mcp-app-skills.md](../../official-mcp-app-skills.md)
- [agent-support-tools-specification.md](../../internal/agent-support-tools-specification.md)
- [workbench-agent-operating-topology.md](../workbench-agent-operating-topology.md)

## Current Synthesis

- Portability here is a three-layer discipline: canonical content in `.agent/`,
  thin adapters per platform, and entry points that boot the same doctrine from
  each host.
- The surface matrix matters because portability is **not** symmetry. Some
  platforms support commands but not hooks; some support sub-agents but not
  native rules. The live matrix is the authority on what is actually wired.
- The broader standardisation and vendor-comparison research is most useful as
  surrounding context: it explains why the repo's adapter model converged on
  markdown-heavy, thin-wrapper formats, and where it intentionally diverges.
- Portability and discoverability intersect. A hub or lane must not imply
  support that the live matrix does not claim.

## Good Follow-Up Questions

- Which surfaces should remain local contract only, and which should graduate
  into more public-facing portability docs?
- Where does a cross-vendor comparison add real decision value versus
  duplicating the live matrix?
- Which future plans most strongly depend on clearer platform-surface routing?

## Related Lanes

- [research operating-model lane](../../../research/agentic-engineering/operating-model-and-platforms/README.md)
- [plans collection](../../../plans/agentic-engineering-enhancements/README.md)
- [deep-dives index](./README.md)
- [hub README](../README.md)
