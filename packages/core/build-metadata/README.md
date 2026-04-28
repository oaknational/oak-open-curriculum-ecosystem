# @oaknational/build-metadata

Shared helpers for:

- resolving application version metadata
- resolving git SHA metadata
- deciding whether Vercel should ignore a production build

Apps keep their own thin Vercel wrapper scripts, but the policy logic lives
here so multiple Vercel-hosted apps can reuse the same behaviour.
