import { describe, it, expect } from 'vitest';
import { MessageBuffer } from '../src/message-buffer.js';

describe('MessageBuffer', () => {
  describe('append', () => {
    it('should append data to the buffer', () => {
      const buffer = new MessageBuffer();
      buffer.append('hello');
      expect(buffer.getBuffer()).toBe('hello');

      buffer.append(' world');
      expect(buffer.getBuffer()).toBe('hello world');
    });

    it('should handle empty strings', () => {
      const buffer = new MessageBuffer();
      buffer.append('');
      expect(buffer.getBuffer()).toBe('');
    });
  });

  describe('extractMessages', () => {
    it('should extract complete messages separated by newlines', () => {
      const buffer = new MessageBuffer();
      buffer.append('message1\nmessage2\n');

      const messages = buffer.extractMessages();
      expect(messages).toEqual(['message1', 'message2']);
      expect(buffer.getBuffer()).toBe('');
    });

    it('should keep incomplete message in buffer', () => {
      const buffer = new MessageBuffer();
      buffer.append('message1\nincomplete');

      const messages = buffer.extractMessages();
      expect(messages).toEqual(['message1']);
      expect(buffer.getBuffer()).toBe('incomplete');
    });

    it('should handle data arriving in chunks', () => {
      const buffer = new MessageBuffer();

      // First chunk
      buffer.append('msg');
      expect(buffer.extractMessages()).toEqual([]);
      expect(buffer.getBuffer()).toBe('msg');

      // Second chunk completes the message
      buffer.append('1\nmsg2\n');
      expect(buffer.extractMessages()).toEqual(['msg1', 'msg2']);
      expect(buffer.getBuffer()).toBe('');
    });

    it('should filter out empty lines', () => {
      const buffer = new MessageBuffer();
      buffer.append('message1\n\n\nmessage2\n');

      const messages = buffer.extractMessages();
      expect(messages).toEqual(['message1', 'message2']);
    });

    it('should handle lines with only whitespace', () => {
      const buffer = new MessageBuffer();
      buffer.append('message1\n   \n\t\nmessage2\n');

      const messages = buffer.extractMessages();
      expect(messages).toEqual(['message1', 'message2']);
    });

    it('should return empty array when no complete messages', () => {
      const buffer = new MessageBuffer();
      buffer.append('incomplete');

      const messages = buffer.extractMessages();
      expect(messages).toEqual([]);
      expect(buffer.getBuffer()).toBe('incomplete');
    });
  });

  describe('clear', () => {
    it('should clear the buffer', () => {
      const buffer = new MessageBuffer();
      buffer.append('some data');
      expect(buffer.getBuffer()).toBe('some data');

      buffer.clear();
      expect(buffer.getBuffer()).toBe('');
    });
  });

  describe('getBuffer', () => {
    it('should return current buffer content', () => {
      const buffer = new MessageBuffer();
      expect(buffer.getBuffer()).toBe('');

      buffer.append('test');
      expect(buffer.getBuffer()).toBe('test');
    });
  });
});
