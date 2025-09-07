import { describe, it, expect } from 'vitest';
import { formatMessage, parseMessage } from '../src/message-formatter.js';
import type { JsonRpcMessage } from '../src/types.js';

describe('formatMessage', () => {
  it('should format a JSON-RPC request message', () => {
    const message: JsonRpcMessage = {
      jsonrpc: '2.0',
      method: 'test',
      params: { value: 42 },
      id: 1,
    };

    const formatted = formatMessage(message);
    expect(formatted).toBe('{"jsonrpc":"2.0","method":"test","params":{"value":42},"id":1}\n');
  });

  it('should format a JSON-RPC notification (no id)', () => {
    const message: JsonRpcMessage = {
      jsonrpc: '2.0',
      method: 'notify',
      params: ['hello'],
    };

    const formatted = formatMessage(message);
    expect(formatted).toBe('{"jsonrpc":"2.0","method":"notify","params":["hello"]}\n');
  });

  it('should format a JSON-RPC response', () => {
    const message: JsonRpcMessage = {
      jsonrpc: '2.0',
      result: 'success',
      id: 1,
    };

    const formatted = formatMessage(message);
    expect(formatted).toBe('{"jsonrpc":"2.0","result":"success","id":1}\n');
  });

  it('should format a JSON-RPC error response', () => {
    const message: JsonRpcMessage = {
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request',
      },
      id: null,
    };

    const formatted = formatMessage(message);
    expect(formatted).toBe(
      '{"jsonrpc":"2.0","error":{"code":-32600,"message":"Invalid Request"},"id":null}\n',
    );
  });
});

describe('parseMessage', () => {
  it('should parse a valid JSON-RPC request', () => {
    const line = '{"jsonrpc":"2.0","method":"test","params":{"value":42},"id":1}';
    const parsed = parseMessage(line);

    expect(parsed).toEqual({
      jsonrpc: '2.0',
      method: 'test',
      params: { value: 42 },
      id: 1,
    });
  });

  it('should parse a valid JSON-RPC notification', () => {
    const line = '{"jsonrpc":"2.0","method":"notify"}';
    const parsed = parseMessage(line);

    expect(parsed).toEqual({
      jsonrpc: '2.0',
      method: 'notify',
    });
  });

  it('should parse a valid JSON-RPC response', () => {
    const line = '{"jsonrpc":"2.0","result":"success","id":1}';
    const parsed = parseMessage(line);

    expect(parsed).toEqual({
      jsonrpc: '2.0',
      result: 'success',
      id: 1,
    });
  });

  it('should handle whitespace around the message', () => {
    const line = '  {"jsonrpc":"2.0","method":"test","id":1}  ';
    const parsed = parseMessage(line);

    expect(parsed).toEqual({
      jsonrpc: '2.0',
      method: 'test',
      id: 1,
    });
  });

  it('should return null for invalid JSON', () => {
    const line = 'not valid json';
    const parsed = parseMessage(line);
    expect(parsed).toBeNull();
  });

  it('should return null for empty string', () => {
    const parsed = parseMessage('');
    expect(parsed).toBeNull();
  });

  it('should return null for whitespace-only string', () => {
    const parsed = parseMessage('   \t\n  ');
    expect(parsed).toBeNull();
  });

  it('should return null for non-2.0 JSON-RPC version', () => {
    const line = '{"jsonrpc":"1.0","method":"test"}';
    const parsed = parseMessage(line);
    expect(parsed).toBeNull();
  });

  it('should return null for missing jsonrpc field', () => {
    const line = '{"method":"test","id":1}';
    const parsed = parseMessage(line);
    expect(parsed).toBeNull();
  });

  it('should return null for message without method or id', () => {
    const line = '{"jsonrpc":"2.0","params":{}}';
    const parsed = parseMessage(line);
    expect(parsed).toBeNull();
  });

  it('should accept id with value 0', () => {
    const line = '{"jsonrpc":"2.0","result":"ok","id":0}';
    const parsed = parseMessage(line);

    expect(parsed).toEqual({
      jsonrpc: '2.0',
      result: 'ok',
      id: 0,
    });
  });

  it('should accept null id in error responses', () => {
    const line = '{"jsonrpc":"2.0","error":{"code":-32700,"message":"Parse error"},"id":null}';
    const parsed = parseMessage(line);

    expect(parsed).toEqual({
      jsonrpc: '2.0',
      error: {
        code: -32700,
        message: 'Parse error',
      },
      id: null,
    });
  });
});
