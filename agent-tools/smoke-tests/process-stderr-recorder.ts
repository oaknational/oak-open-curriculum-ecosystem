/** Run `body` while recording what this process writes to its own stderr. */
export async function recordingProcessStderr<T>(
  body: () => Promise<T>,
): Promise<{ readonly value: T; readonly written: string }> {
  const chunks: string[] = [];
  const write = process.stderr.write;
  process.stderr.write = (chunk: unknown): boolean => {
    chunks.push(String(chunk));
    return true;
  };
  try {
    const value = await body();
    return { value, written: chunks.join('') };
  } finally {
    process.stderr.write = write;
  }
}
