export interface CoreLogger {
  debug(message: string, context?: unknown): void;
  info(message: string, context?: unknown): void;
  warn(message: string, context?: unknown): void;
  error(message: string, context?: unknown): void;
}

export interface CoreClock {
  now(): number;
}

export interface CoreStorage {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface CoreProviders {
  logger: CoreLogger;
  clock: CoreClock;
  storage: CoreStorage;
}

export type CoreRuntime = CoreProviders;

export function createRuntime(providers: CoreProviders): CoreRuntime {
  return providers;
}
