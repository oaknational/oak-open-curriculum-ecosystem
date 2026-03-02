import { spawnSync } from 'node:child_process';

export interface ProcessInfo {
  readonly pid?: string;
  readonly command?: string;
  readonly user?: string;
  readonly summary: string;
  readonly fullOutput: string;
}

export function describeExistingListeners(port: number): ProcessInfo | undefined {
  const lsofOutput = getLsofOutput(port);
  if (!lsofOutput) {
    return undefined;
  }

  const parsedInfo = parseLsofOutput(lsofOutput, port);
  return parsedInfo;
}

function getLsofOutput(port: number): string | undefined {
  const result = spawnSync('lsof', ['-nP', '-i', `TCP:${String(port)}`, '-sTCP:LISTEN'], {
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    return undefined;
  }

  const trimmed = result.stdout.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseLsofOutput(output: string, port: number): ProcessInfo {
  const lines = output.split('\n');
  const dataLines = lines.slice(1); // Skip header

  if (dataLines.length === 0) {
    return {
      summary: 'Process information could not be parsed',
      fullOutput: output,
    };
  }

  const firstLine = dataLines[0];
  if (!firstLine) {
    return {
      summary: 'Process information could not be parsed',
      fullOutput: output,
    };
  }

  const parts = firstLine.split(/\s+/);
  if (parts.length < 3) {
    return {
      summary: 'Process information could not be parsed',
      fullOutput: output,
    };
  }

  const command = parts[0];
  const pid = parts[1];
  const user = parts[2];
  const processDetails = getProcessDetails(pid);

  const summary = buildProcessSummary(port, pid, command, user, processDetails);

  return {
    pid,
    command,
    user,
    summary,
    fullOutput: output,
  };
}

function buildProcessSummary(
  port: number,
  pid: string,
  command: string,
  user: string,
  details: string | undefined,
): string {
  const lines = [
    `Process using port ${String(port)}:`,
    `  PID:     ${pid}`,
    `  Command: ${command}`,
    `  User:    ${user}`,
  ];

  if (details) {
    lines.push(`  Details: ${details}`);
  }

  return lines.join('\n');
}

function getProcessDetails(pid: string | undefined): string | undefined {
  if (!pid) {
    return undefined;
  }

  const result = spawnSync('ps', ['-p', pid, '-o', 'command='], {
    encoding: 'utf8',
  });

  if (result.status === 0) {
    const trimmed = result.stdout.trim();
    if (trimmed.length > 0) {
      // Truncate very long commands for readability
      return trimmed.length > 120 ? `${trimmed.slice(0, 117)}...` : trimmed;
    }
  }

  return undefined;
}
