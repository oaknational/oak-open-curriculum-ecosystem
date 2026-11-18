I can't answer that yet because I don't know which two services you mean. The working directory (`<workspace>`) is empty and nothing was attached, so I have no specifications to compare.

To check whether they work together, I need:

1. **Both services, with exact versions**, and where each one's contract lives: an OpenAPI or gRPC spec, a README or SLA, an event schema, a runbook, or for a human service, who handles what.
2. **How they connect.** For example: A calls B, A transforms data for B, A authorizes B to act, or A's output feeds B's decisions.
3. **What depends on the connection.** What does the consumer do based on it, at what volume, with what latency or consistency needs, and for whom?
4. **Any shared context** that isn't in either spec: retry and timeout settings, queues or gateways between them, shared databases or quotas, deployment and versioning setup.

You can paste the specs, put the files in the working directory, or point me to a repo path.

Once I have those, I'll write down what each side promises and what it assumes. Then I'll check whether one side's promises cover the other side's assumptions, and look for concrete ways the pair fails even though each service works alone. Typical examples are retries that duplicate an effect, a mapping that keeps the right shape but loses units, and version pairs that were never tested together. You'll get a verdict of "holds", "holds under these conditions", "fails" or "can't tell from what's provided", plus a list of what's missing from each service's spec.
