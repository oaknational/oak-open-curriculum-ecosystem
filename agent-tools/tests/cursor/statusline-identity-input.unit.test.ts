import { planCursorStatuslineExecution } from '../../src/cursor/statusline-identity-input';

describe('planCursorStatuslineExecution', () => {
  it('plans derivation when stdin contains a non-empty session_id string', () => {
    expect(
      planCursorStatuslineExecution(
        '{"session_id":"9879e4f0-a40b-4864-b4cd-bc4332a3e362","model":{"display_name":"GPT-5.5"}}',
      ),
    ).toEqual({
      kind: 'derive',
      seed: '9879e4f0-a40b-4864-b4cd-bc4332a3e362',
    });
  });

  it('trims whitespace around session_id values', () => {
    expect(planCursorStatuslineExecution('{"session_id":"  abc-123  "}')).toEqual({
      kind: 'derive',
      seed: 'abc-123',
    });
  });

  it('plans a noop for empty stdin', () => {
    expect(planCursorStatuslineExecution('')).toEqual({ kind: 'noop' });
  });

  it('plans a noop for unparseable JSON', () => {
    expect(planCursorStatuslineExecution('not-json')).toEqual({ kind: 'noop' });
  });

  it('plans a noop when the payload is JSON but not an object', () => {
    expect(planCursorStatuslineExecution('"abc-123"')).toEqual({ kind: 'noop' });
    expect(planCursorStatuslineExecution('123')).toEqual({ kind: 'noop' });
    expect(planCursorStatuslineExecution('null')).toEqual({ kind: 'noop' });
    expect(planCursorStatuslineExecution('[]')).toEqual({ kind: 'noop' });
  });

  it('plans a noop when session_id is missing', () => {
    expect(planCursorStatuslineExecution('{"model":{"display_name":"GPT-5.5"}}')).toEqual({
      kind: 'noop',
    });
  });

  it('plans a noop when session_id is not a string', () => {
    expect(planCursorStatuslineExecution('{"session_id":42}')).toEqual({ kind: 'noop' });
    expect(planCursorStatuslineExecution('{"session_id":null}')).toEqual({ kind: 'noop' });
    expect(planCursorStatuslineExecution('{"session_id":false}')).toEqual({ kind: 'noop' });
  });

  it('plans a noop when session_id trims to empty', () => {
    expect(planCursorStatuslineExecution('{"session_id":""}')).toEqual({ kind: 'noop' });
    expect(planCursorStatuslineExecution('{"session_id":"   "}')).toEqual({ kind: 'noop' });
  });
});
