export interface ContextCostFileSystem {
  readonly readFileUtf8: (absolutePath: string) => Promise<string>;
  readonly expandGlob: (cwd: string, pattern: string) => Promise<readonly string[]>;
}

export class ContextCostFileReadError extends Error {
  readonly absolutePath: string;

  constructor(absolutePath: string, cause: unknown) {
    super(
      `failed to read ${absolutePath}: ${cause instanceof Error ? cause.message : String(cause)}`,
      { cause },
    );
    this.absolutePath = absolutePath;
    this.name = 'ContextCostFileReadError';
  }
}
