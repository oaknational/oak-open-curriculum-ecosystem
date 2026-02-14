# ADR-016: Use dotenv for Environment Configuration

## Status

Accepted

## Context

We need a way to manage configuration, particularly sensitive values like API keys. Options include:

- Environment variables only
- Configuration files (JSON, YAML)
- dotenv files
- Configuration services

The solution must be secure, developer-friendly, and work across environments.

## Decision

Use dotenv for local development configuration, with direct environment variables in production.

## Rationale

- **Developer Experience**: Easy to set up local configuration
- **Security**: .env files can be gitignored
- **Flexibility**: Works with existing environment variable patterns
- **Standard Practice**: Common pattern in Node.js ecosystem
- **Production Ready**: Can skip dotenv in production
- **Documentation**: .env.example serves as configuration documentation

## Consequences

### Positive

- Simple local development setup
- Clear separation of configuration from code
- Easy to document required variables
- Works seamlessly with CI/CD systems
- No configuration in version control

### Negative

- Additional dependency (though marked as external)
- Developers must copy .env.example to .env
- Risk of committing .env files accidentally
- Need to manage multiple .env files for different environments

## Implementation

- Use dotenv package for loading .env files
- Create .env.example with all required variables
- Add .env to .gitignore
- Load dotenv only in development
- Validate environment variables with Zod
- Document all variables in .env.example

## Operational Security Policy

Real credentials are expected only in untracked local environment files:

- Root workspace `.env`
- Workspace `.env.local` files

Tracked files, including `.env.example`, must contain placeholders only.
Exceptions for secret-like examples are limited to `.agent/reference-docs/**`
via tooling allowlist, with line-specific allowlisting used elsewhere only when
strictly necessary.

Current enforcement:

- `pnpm secrets:scan:all`
- `pnpm secrets:scan:all-refs`
- CI secret scan step in `.github/workflows/ci.yml`
- `pnpm check` includes the scan step and is required for quality gates
