/**
 * Terminal write helpers shared by the CLI runners. Lines are sanitised:
 * C0/C1 control characters (other than tab and newline) are stripped so an
 * attacker-controllable string reaching the operator's terminal -- a crafted
 * item id, a YAML error echo, a duplicate-key refusal -- cannot smuggle ANSI
 * escapes that rewrite the output the operator reads (e.g. visually forging
 * a green verdict line over a refusal). Security-expert finding, R0b
 * gateway 2026-07-07.
 *
 * @packageDocumentation
 */

/** True for C0 (except tab u0009 / newline u000A), DEL, and C1 code points. */
function isTerminalControlCode(code: number): boolean {
  if (code < 0x20) {
    return code !== 0x09 && code !== 0x0a;
  }
  return code >= 0x7f && code <= 0x9f;
}

/** The message with terminal control characters stripped (tab/newline kept). */
export function sanitiseTerminalLine(message: string): string {
  let sanitised = '';
  for (const character of message) {
    if (!isTerminalControlCode(character.codePointAt(0) ?? 0)) {
      sanitised += character;
    }
  }
  return sanitised;
}

export function writeLine(message: string): void {
  process.stdout.write(`${sanitiseTerminalLine(message)}\n`);
}

export function writeErrorLine(message: string): void {
  process.stderr.write(`${sanitiseTerminalLine(message)}\n`);
}
