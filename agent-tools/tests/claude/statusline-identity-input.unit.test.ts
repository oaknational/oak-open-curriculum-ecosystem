import { planStatuslineExecution } from '../../src/claude/statusline-identity-input';

describe('planStatuslineExecution', () => {
  it('plans derivation when stdin contains a non-empty session_id string', () => {
    expect(
      planStatuslineExecution(
        '{"session_id":"c32a7d1d-a40b-4864-b4cd-bc4332a3e362","model":{"display_name":"Opus 4.7"}}',
      ),
    ).toEqual({
      kind: 'derive',
      seed: 'c32a7d1d-a40b-4864-b4cd-bc4332a3e362',
    });
  });

  it('trims whitespace around session_id values', () => {
    expect(planStatuslineExecution('{"session_id":"  abc-123  "}')).toEqual({
      kind: 'derive',
      seed: 'abc-123',
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
    expect(planStatuslineExecution('[]')).toEqual({ kind: 'noop' });
  });

  it('plans a noop when session_id is missing', () => {
    expect(planStatuslineExecution('{"model":{"display_name":"Opus 4.7"}}')).toEqual({
      kind: 'noop',
    });
  });

  it('plans a noop when session_id is not a string', () => {
    expect(planStatuslineExecution('{"session_id":42}')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('{"session_id":null}')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('{"session_id":false}')).toEqual({ kind: 'noop' });
  });

  it('plans a noop when session_id trims to empty', () => {
    expect(planStatuslineExecution('{"session_id":""}')).toEqual({ kind: 'noop' });
    expect(planStatuslineExecution('{"session_id":"   "}')).toEqual({ kind: 'noop' });
  });
});
