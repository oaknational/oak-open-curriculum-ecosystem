import type { ContextCostFileSystem } from './file-system.js';
import { ContextCostFileReadError } from './file-system.js';
import type { Tokenizer } from './tokenizer.js';

export interface TokenizedRow {
  readonly path: string;
  readonly chars: number;
  readonly tokens: number;
}

export async function tokenizeFile(
  path: string,
  absolutePath: string,
  fs: ContextCostFileSystem,
  tokenizer: Tokenizer,
): Promise<TokenizedRow> {
  try {
    const content = await fs.readFileUtf8(absolutePath);
    return {
      path,
      chars: content.length,
      tokens: tokenizer.estimate(content),
    };
  } catch (error) {
    throw new ContextCostFileReadError(absolutePath, error);
  }
}
