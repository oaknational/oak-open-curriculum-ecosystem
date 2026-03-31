# Widget Renderer Reactivation

**Boundary**: experience-surfaces-and-extensions
**Legacy Stream Label**: extensions
**Status**: ❌ SUPERSEDED by WS3 clean-break rebuild
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)
**Created**: 2026-02-23
**Last Updated**: 2026-03-31
**Superseded By**: `sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`

---

## Supersession Notice

This plan is **no longer viable**. The WS3 clean-break rebuild deletes all
files referenced here (`widget-renderer-registry.ts`, `widget-renderers/*.ts`,
`widget-script.ts`, `widget-script-state.ts`) in Phase 1.

The replacement approach builds rich UI views as React components inside a
fresh MCP App, not by uncommenting parked renderers in the deleted string-
template framework.

For the active execution plan, read:

- `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
- Phase 4 (curriculum-model view) and Phase 5 (user-search view) deliver the
  equivalent functionality through the React MCP App

## Historical Context (Preserved for Reference)

This plan originally proposed reactivating parked widget renderers (search,
browse, explore) by uncommenting entries in `TOOL_RENDERER_MAP`. That approach
assumed the legacy widget framework would survive as a foundation. The WS3
decision (2026-03-28) chose total replacement instead.

## Related Documents

| Document | Purpose |
|----------|---------|
| [WS3 clean-break rebuild](../../../sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md) | Replacement plan |
| [MCP extensions roadmap](../../../sdk-and-mcp-enhancements/roadmap.md) | Strategic context |
| [Widget search rendering (archived)](../../archive/completed/widget-search-rendering.md) | Historical context |
