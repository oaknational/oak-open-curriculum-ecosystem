# Schema Cache

This folder contains a cache of the OpenAPI schema for the Oak National Academy Curriculum API.

It is used as an offline fallback for the type generation process, e.g. when running in a CI environment.

It is updated at type generation time, iff the `info.version` in the fetched schema is different from the version in the cache.
