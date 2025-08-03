# ADR-017: Use Consola for Logging

## Status

Accepted

## Context

We need a logging solution that:

- Works in different environments (development, production, testing)
- Provides structured logging
- Has good developer experience
- Supports different log levels
- Can be easily mocked for testing

Options considered: console.log, winston, pino, consola

## Decision

Use Consola as the logging library.

## Rationale

- **Beautiful Output**: Attractive, readable logs in development
- **Universal**: Works in Node.js and browsers
- **Lightweight**: Minimal overhead and dependencies
- **Intuitive API**: Simple, chainable API
- **Built-in Types**: TypeScript support out of the box
- **Test Friendly**: Easy to mock and silence in tests
- **No Configuration**: Works great with zero configuration

## Consequences

### Positive

- Better developer experience with pretty logs
- Consistent logging across the application
- Easy to control log levels
- Automatic formatting of objects
- Built-in emoji support for clarity

### Negative

- Less powerful than winston or pino for production
- Another dependency to maintain
- May need to switch for advanced logging needs
- Not as performant as pino for high-volume

## Implementation

- Import consola and create logger instances
- Use appropriate log levels (error, warn, info, debug)
- Set log level via environment variable
- Mock in tests to avoid output noise
- Use structured logging for better parsing
- Leverage built-in formatting features
