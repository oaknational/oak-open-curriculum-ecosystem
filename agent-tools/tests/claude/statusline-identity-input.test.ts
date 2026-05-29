import { planStatuslineExecution } from '../../src/claude/statusline-identity-input';

describe('planStatuslineExecution', () => {
  it('extracts every renderable field from a full payload', () => {
    expect(
      planStatuslineExecution(
        JSON.stringify({
          session_id: 'c32a7d1d-a40b-4864-b4cd-bc4332a3e362',
          workspace: { current_dir: '/Users/dev/oak-wt-eef' },
          model: { display_name: 'Opus 4.7' },
          context_window: { used_percentage: 12 },
        }),
      ),
    ).toEqual({
      kind: 'render',
      inputs: {
        seed: 'c32a7d1d-a40b-4864-b4cd-bc4332a3e362',
        cwd: '/Users/dev/oak-wt-eef',
        model: 'Opus 4.7',
        usedPercentage: 12,
      },
    });
  });

  it('trims whitespace around session_id and cwd', () => {
    expect(planStatuslineExecution('{"session_id":"  abc-123  ","cwd":"  /repo  "}')).toEqual({
      kind: 'render',
      inputs: { seed: 'abc-123', cwd: '/repo', model: undefined, usedPercentage: undefined },
    });
  });

  it('falls back to the top-level cwd when workspace.current_dir is absent', () => {
    expect(planStatuslineExecution('{"cwd":"/fallback/dir"}')).toEqual({
      kind: 'render',
      inputs: {
        seed: undefined,
        cwd: '/fallback/dir',
        model: undefined,
        usedPercentage: undefined,
      },
    });
  });

  it('renders with absent fields when session_id is missing', () => {
    expect(planStatuslineExecution('{"model":{"display_name":"Opus 4.7"}}')).toEqual({
      kind: 'render',
      inputs: { seed: undefined, cwd: undefined, model: 'Opus 4.7', usedPercentage: undefined },
    });
  });

  it('plans a noop for empty stdin', () => {
    expect(planStatuslineExecution('')).toEqual({ kind: 'noop' });
  });

  it('plans a noop for unparseable JSON', () => {
    expect(planStatuslineExecution('not-json')).toEqual({ kind: 'noop' });
  });

  it('plans a noop when the payload is JSON but not an object', () => {
    expect(planStatuslineExecution('"abc-123"')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('123')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('null')).toEqual({ kind: 'noop' });
  });

  it('ignores non-string session_id and non-string model', () => {
    expect(planStatuslineExecution('{"session_id":42,"model":{"display_name":7}}')).toEqual({
      kind: 'render',
      inputs: { seed: undefined, cwd: undefined, model: undefined, usedPercentage: undefined },
    });
  });

  it('ignores blank session_id and non-finite used_percentage', () => {
    expect(
      planStatuslineExecution('{"session_id":"   ","context_window":{"used_percentage":"nope"}}'),
    ).toEqual({
      kind: 'render',
      inputs: { seed: undefined, cwd: undefined, model: undefined, usedPercentage: undefined },
    });
  });
});
