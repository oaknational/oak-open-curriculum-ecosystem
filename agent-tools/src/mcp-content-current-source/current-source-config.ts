const AUDIT_ROOT = '.agent/reports/mcp-agent-facing-content-audit';
export const BASELINE_ARTIFACT = `${AUDIT_ROOT}/registry.json`;
export const CURRENT_SOURCE_ARTIFACT = `${AUDIT_ROOT}/current-source.json`;
export const CURRENT_SOURCE_ANCHORS = `${AUDIT_ROOT}/current-source-anchors.json`;
export const AUDIT_REPORT = `${AUDIT_ROOT}/report.md`;
export const BASELINE_COMMIT = '240a598607b96485f50c0dfd6df154d673a90a25';
// The sha pins the registry as maintained on main (last reviewed evolution:
// 1bc098d6f delta-refresh, eb30beffe/6b9267ab0 annotation rounds, b6bf4ce7f);
// BASELINE_COMMIT stays the phase-(a) capture commit: the item anchors
// measure each served item against the original audit's capture.
export const BASELINE_REGISTRY_SHA256 =
  'be4ca4382113515c3358e5711827db2165305ca65ec37f7180bd3dfa509729cf';
