export interface ProcessInvocation {
  readonly executable: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: Readonly<Record<string, string>>;
  readonly maxStdoutBytes: number;
  readonly maxStderrBytes: number;
}

export interface ProcessResult {
  readonly status: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdout: Uint8Array;
  readonly stderr: Uint8Array;
  readonly error: Error | undefined;
}

export interface ProcessPort {
  run(input: ProcessInvocation): ProcessResult;
}

export interface ClockPort {
  now(): Date;
}

export interface EnvironmentPort {
  readonly values: NodeJS.ProcessEnv;
}

export interface PublicationPort {
  publish(bytes: Uint8Array): void;
}
