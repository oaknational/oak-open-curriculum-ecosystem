I couldn't start the seam analysis because the two sides aren't here to look at. The working directory (`<workspace>`) is empty, and the repository around it has no commits and only a `.gitconfig`. There's no code, no tests and no contracts to compare.

This method checks what the producer actually guarantees against what the consumer actually assumes. Guessing either side would mean deciding for an endpoint what it promises, which is exactly the mistake that causes integration bugs. So I need the following from you:

1. **The two sides:** the path or repository for each, the exact version (commit or tag) that fails together, and where each one's contract lives (spec, schema, API docs, or just its tests).
2. **The connection:** how data or calls get from one to the other. For example, a direct function call, an HTTP or RPC call, a message queue, a file or database handoff, or a transformation or mapping step.
3. **One failing case:** the input, the result you expected, and the result you got. One concrete wrong answer usually narrows the search more than anything else.
4. **What the consumer does with the result:** what it relies on it for, and at what volume, concurrency and timing.

Once I have those, I'll write down what each side promises and assumes, compare the two in your real environment, and look for cases where both sides are correct on their own but wrong together. I'll then send any missing promise back to the side responsible for it.

While you gather that, these are the usual reasons two sides that each pass their tests still give wrong results together:

- **Same shape, different meaning:** units, currency, time zone, encoding, 0- vs 1-based indexing, inclusive vs exclusive ranges, or what null or empty means. The data passes schema checks but means something different.
- **Different versions:** each side's tests run against a mock or fixture of the other side's older or newer contract.
- **Ordering and duplicates:** the consumer assumes things arrive in order or exactly once, but the producer delivers at least once, or retries cause duplicates.
- **Partial results:** pagination, truncation or timeouts return a valid-looking but incomplete result that the consumer treats as complete.
- **Identity:** IDs or keys are regenerated, normalised or case-folded on one side, so records join to the wrong partner.
- **Precision and rounding:** float vs decimal, or rounding done at different stages.
- **Defaults:** a field is left out and each side fills in a different default.
- **Timing:** eventual consistency, where the consumer reads before the producer's write is visible.

If your failing case matches one of these, tell me which. I'll start the seam analysis there.
