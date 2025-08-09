/**
 * Pure message buffer for accumulating and processing newline-delimited messages
 * This is a pure class with no IO or side effects
 */
export class MessageBuffer {
  private buffer = '';

  /**
   * Add data to the buffer
   */
  append(data: string): void {
    this.buffer += data;
  }

  /**
   * Extract complete messages from the buffer
   * Returns array of complete message strings and keeps incomplete data in buffer
   */
  extractMessages(): string[] {
    const lines = this.buffer.split('\n');

    // Keep the last incomplete line in the buffer
    this.buffer = lines.pop() ?? '';

    // Return non-empty complete lines
    return lines.filter((line) => line.trim().length > 0);
  }

  /**
   * Clear the buffer
   */
  clear(): void {
    this.buffer = '';
  }

  /**
   * Get current buffer content (for testing)
   */
  getBuffer(): string {
    return this.buffer;
  }
}
