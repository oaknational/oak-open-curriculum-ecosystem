I couldn't start the revision because there's nothing here to revise yet. The working directory (`<workspace>`) is empty and the repository has no commits. The only file is a `.gitconfig` in the parent folder. I didn't find a service contract, a specification, interface definitions, schemas, code or tests.

Revising a specification starts from a changed condition, so I need two things before I can do any of it:

1. **The current specification or contract.** Either a path or repository I can read, or the text pasted here. This includes whatever currently defines the service, such as an API definition, schema, SLA document, code or tests.
2. **The condition that changed.** I need the old wording, the new wording, who made the change (for example a product owner, legal, or a customer agreement) and the date it takes effect. For example: "responses within 500 ms at p99" became "within 800 ms at p95", or "retries are idempotent" became "idempotent only with an `Idempotency-Key` header".

It also helps to know where the things that might depend on the old condition live, such as client code, other services, monitoring or alert thresholds, SLAs with customers, runbooks and test suites. That tells me how far to search.

Once I have these, I'll:
- update the affected obligation and keep its identifier;
- check whether the change is compatible in meaning, in behaviour, in who authorised it and in the evidence that supports it;
- list everything that relies on the old condition (code, tests, clients, alerts, documents) and say whether each one still holds, breaks, or needs a decision;
- return the revised specification with a record of what changed, the open questions, and any integration points that need a closer check.

I'd rather not make up a contract and a change to demonstrate this, because the list of what depends on it would then be invented too.
