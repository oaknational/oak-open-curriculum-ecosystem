# openapi-zod-client-adapter

Adapter for openapi-zod-client that enforces Zod v3/v4 boundary.

The internals of this workspace are the ONLY place that Zod 3 compatible code is permitted. That code comes exclusively from openapi-zod-client, we MUST NOT introduce any Zod 3 code anywhere else in the workspace.

The public API of this workspace is Zod v4 compatible ONLY. The function of this workspace is to transform the Zod v3 output from openapi-zod-client into Zod v4 compatible code.

ONLY Zod v4 compatible code is permitted to be exported from this workspace.
