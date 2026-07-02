import { planStatuslineExecution } from '../../src/claude/statusline-identity-input';

describe('planStatuslineExecution', () => {
  it('extracts the renderable fields from a full payload', () => {
    expect(
      planStatuslineExecution(
        JSON.stringify({
          session_id: 'c32a7d1d-a40b-4864-b4cd-bc4332a3e362',
          workspace: { current_dir: '/repo/oak-wt-eef' },
          model: { display_name: 'Opus 4.7' },
          context_window: { used_percentage: 12 },
        }),
      ),
    ).toMatchObject({
      kind: 'render',
      inputs: {
        seed: 'c32a7d1d-a40b-4864-b4cd-bc4332a3e362',
        cwd: '/repo/oak-wt-eef',
        model: 'Opus 4.7',
        usedPercentage: 12,
      },
    });
  });

  it('extracts the five-hour and seven-day consumed percentages and reset instants', () => {
    expect(
      planStatuslineExecution(
        JSON.stringify({
          rate_limits: {
            five_hour: { used_percentage: 23.5, resets_at: 1738425600 },
            seven_day: { used_percentage: 41, resets_at: 1738857600 },
          },
        }),
      ),
    ).toMatchObject({
      kind: 'render',
      inputs: {
        fiveHourPercentage: 23.5,
        fiveHourResetsAt: 1738425600,
        sevenDayPercentage: 41,
        sevenDayResetsAt: 1738857600,
      },
    });
  });

  it('treats each rate-limit window as independently optional', () => {
    expect(
      planStatuslineExecution(
        JSON.stringify({ rate_limits: { five_hour: { used_percentage: 7 } } }),
      ),
    ).toMatchObject({ inputs: { fiveHourPercentage: 7, sevenDayPercentage: undefined } });
  });

  it('ignores rate limits that are absent, malformed, or non-finite', () => {
    expect(planStatuslineExecution('{}')).toMatchObject({
      inputs: { fiveHourPercentage: undefined, sevenDayPercentage: undefined },
    });
    expect(
      planStatuslineExecution(
        '{"rate_limits":{"five_hour":{"used_percentage":"nope"},"seven_day":42}}',
      ),
    ).toMatchObject({ inputs: { fiveHourPercentage: undefined, sevenDayPercentage: undefined } });
  });

  it('trims whitespace around session_id and cwd', () => {
    expect(planStatuslineExecution('{"session_id":"  abc-123  ","cwd":"  /repo  "}')).toMatchObject(
      {
        inputs: { seed: 'abc-123', cwd: '/repo' },
      },
    );
  });

  it('falls back to the top-level cwd when workspace.current_dir is absent', () => {
    expect(planStatuslineExecution('{"cwd":"/fallback/dir"}')).toMatchObject({
      inputs: { cwd: '/fallback/dir' },
    });
  });

  it('plans a noop for empty stdin, unparseable JSON, or a non-object payload', () => {
    expect(planStatuslineExecution('')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('not-json')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('"abc-123"')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('123')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('null')).toEqual({ kind: 'noop' });
  });

  it('ignores a non-string session_id, a non-string model, and a non-finite used_percentage', () => {
    expect(planStatuslineExecution('{"session_id":42,"model":{"display_name":7}}')).toMatchObject({
      inputs: { seed: undefined, model: undefined },
    });
    expect(
      planStatuslineExecution('{"session_id":"   ","context_window":{"used_percentage":"nope"}}'),
    ).toMatchObject({ inputs: { seed: undefined, usedPercentage: undefined } });
  });
});
