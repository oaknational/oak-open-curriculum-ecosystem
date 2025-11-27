original doc: <https://developers.openai.com/apps-sdk/guides/optimize-metadata>

# Optimize Metadata

## Why metadata matters

ChatGPT decides when to call your connector based on the metadata you provide. Well-crafted names, descriptions, and parameter docs increase recall on relevant prompts and reduce accidental activations. Treat metadata like product copy—it needs iteration, testing, and analytics.

## Gather a golden prompt set

Before you tune metadata, assemble a labelled dataset:

- **Direct prompts** – users explicitly name your product or data source.
- **Indirect prompts** – users describe the outcome they want without naming your tool.
- **Negative prompts** – cases where built-in tools or other connectors should handle the request.

Document the expected behaviour for each prompt (call your tool, do nothing, or use an alternative). You will reuse this set during regression testing.

## Draft metadata that guides the model

For each tool:

- **Name** – pair the domain with the action (`calendar.create_event`).
- **Description** – start with “Use this when…” and call out disallowed cases ("Do not use for reminders").
- **Parameter docs** – describe each argument, include examples, and use enums for constrained values.
- **Read-only hint** – annotate `readOnlyHint: true` on tools that never mutate state so ChatGPT can streamline confirmation.

## Evaluate in developer mode

1. Link your connector in ChatGPT developer mode.
2. Run through the golden prompt set and record the outcome: which tool was selected, what arguments were passed, and whether the component rendered.
3. For each prompt, track precision (did the right tool run?) and recall (did the tool run when it should?).

If the model picks the wrong tool, revise the descriptions to emphasise the intended scenario or narrow the tool’s scope.

## Iterate methodically

- Change one metadata field at a time so you can attribute improvements.
- Keep a log of revisions with timestamps and test results.
- Share diffs with reviewers to catch ambiguous copy before you deploy it.

After each revision, repeat the evaluation. Aim for high precision on negative prompts before chasing marginal recall improvements.

## Production monitoring

Once your connector is live:

- Review tool-call analytics weekly. Spikes in “wrong tool” confirmations usually indicate metadata drift.
- Capture user feedback and update descriptions to cover common misconceptions.
- Schedule periodic prompt replays, especially after adding new tools or changing structured fields.

Treat metadata as a living asset. The more intentional you are with wording and evaluation, the easier discovery and invocation become.
