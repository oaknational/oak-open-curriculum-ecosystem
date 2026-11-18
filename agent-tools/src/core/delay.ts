/**
 * Wait `milliseconds`: the real clock behind every injected sleep seam.
 *
 * @param milliseconds - How long to wait.
 */
export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
