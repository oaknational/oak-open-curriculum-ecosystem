export function writeLine(message: string): void {
  process.stdout.write(`${message}\n`);
}

export function writeErrorLine(message: string): void {
  process.stderr.write(`${message}\n`);
}
