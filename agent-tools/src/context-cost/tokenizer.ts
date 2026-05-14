export interface Tokenizer {
  readonly estimate: (text: string) => number;
}

export const charsOverFourTokenizer: Tokenizer = {
  estimate: (text) => Math.ceil(text.length / 4),
};
