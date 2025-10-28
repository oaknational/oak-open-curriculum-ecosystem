export type SpacingToken = 'stack' | 'cluster' | 'section' | 'grid' | 'inline-base' | 'inline-wide';

const SPACING_MAP: Record<SpacingToken, string> = {
  stack: 'var(--app-gap-stack)',
  cluster: 'var(--app-gap-cluster)',
  section: 'var(--app-gap-section)',
  grid: 'var(--app-gap-grid)',
  'inline-base': 'var(--app-layout-inline-padding-base)',
  'inline-wide': 'var(--app-layout-inline-padding-wide)',
};

export function getSpacingVar(token: SpacingToken): string {
  const value = SPACING_MAP[token];
  if (!value) {
    throw new Error(`Unknown spacing token: ${token}`);
  }
  return value;
}
