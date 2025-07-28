# E2E Tests

End-to-end tests that use real IO operations.

These tests are separated from unit/integration/API tests and must be run manually using:

```bash
pnpm test:e2e
```

E2E tests are NOT run automatically in CI/CD or pre-push hooks. They require manual execution because they:

- Connect to real Notion API
- Perform actual file system operations
- May have side effects
- Require real environment configuration
