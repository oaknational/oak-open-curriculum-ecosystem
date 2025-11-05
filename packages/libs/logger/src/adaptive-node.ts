import { createConsola, type ConsolaInstance, type ConsolaOptions } from 'consola';
import { mkdirSync, createWriteStream, type WriteStream as NodeWriteStream } from 'node:fs';

import { ConsolaLogger } from './consola-logger';
import { MultiSinkLogger } from './multi-sink-logger';
import {
  createFileSink,
  type FileSinkInterface,
  type FileSystem,
  type SimpleWriteStream,
} from './file-sink';
import { convertLogLevel, toConsolaLevel } from './log-level-conversion';
import {
  DEFAULT_HTTP_SINK_CONFIG,
  DEFAULT_STDIO_SINK_CONFIG,
  type LoggerSinkConfig,
} from './sink-config';
import type { Logger, LoggerOptions } from './types';

function toBufferEncoding(encoding?: string): BufferEncoding {
  if (encoding === 'utf8' || encoding === 'ascii' || encoding === 'utf-8') {
    return 'utf8';
  }
  return 'utf8';
}

function adaptWriteStream(stream: NodeWriteStream): SimpleWriteStream {
  return {
    write: (chunk: string, encoding?: string, cb?: (error?: Error | null) => void): boolean => {
      const bufferEncoding = toBufferEncoding(encoding);
      if (cb) {
        return stream.write(chunk, bufferEncoding, cb);
      }
      return stream.write(chunk, bufferEncoding);
    },
    end: (cb?: () => void): SimpleWriteStream => {
      stream.end(cb);
      return adaptWriteStream(stream);
    },
  };
}

const NODE_FILE_SYSTEM: FileSystem = {
  mkdirSync,
  createWriteStream: (path: string, options?: { flags?: string }) =>
    adaptWriteStream(createWriteStream(path, options)),
};

function resolveFileSink(config?: LoggerSinkConfig['file']): FileSinkInterface | null {
  if (!config) {
    return null;
  }

  return createFileSink(config, NODE_FILE_SYSTEM);
}

function createConfiguredConsola(
  options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
): ConsolaInstance {
  const numericLevel = options?.level ? convertLogLevel(options.level) : 20;
  const consolaLevel = toConsolaLevel(numericLevel);

  let consola = createConsola({
    level: consolaLevel,
    ...options?.consolaOptions,
  });

  if (options?.name) {
    consola = consola.withTag(options.name);
  }

  return consola;
}

export function createAdaptiveLogger(
  options?: LoggerOptions & { consolaOptions?: Partial<ConsolaOptions> },
  consolaInstance?: ConsolaInstance,
  sinkConfig?: LoggerSinkConfig,
): Logger {
  const consola = consolaInstance ?? createConfiguredConsola(options);
  const consolaLogger = new ConsolaLogger(consola, options?.context ?? {});

  const effectiveSinkConfig = sinkConfig ?? DEFAULT_STDIO_SINK_CONFIG;
  const fileSink = resolveFileSink(effectiveSinkConfig.file);

  if (effectiveSinkConfig.stdout || fileSink) {
    return new MultiSinkLogger(consolaLogger, effectiveSinkConfig, fileSink);
  }

  return new MultiSinkLogger(consolaLogger, effectiveSinkConfig, null);
}

export { DEFAULT_HTTP_SINK_CONFIG, DEFAULT_STDIO_SINK_CONFIG };
