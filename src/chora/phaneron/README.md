# Phaneron (Φανερόν) - Visible Manifestation

**Etymology**: From Greek φανερός (phanerós) meaning "visible", "manifest", or "apparent"

**Philosophical Heritage**: In phenomenology, the phaneron is the totality of what is present to the mind at any given moment - all that is visible and manifest to consciousness.

## Why Phaneron?

We chose Phaneron for runtime configuration because it:

- **Makes Internal State Visible**: Exposes the organism's configuration
- **Manifests at Runtime**: Unlike stroma, this appears when the organism lives
- **Adapts to Environment**: Changes based on environmental conditions
- **Is Observable**: Can be inspected and understood from outside

## What Manifests Here

The visible configuration of our organism:

- **config/** - Runtime configuration that shapes behavior
  - Environment variables
  - Runtime settings
  - Feature flags

## Architectural Principles

1. **Runtime Visibility**: These values appear when the organism awakens
2. **Environmental Awareness**: Responds to the deployment environment
3. **Observable State**: Can be inspected to understand organism behavior
4. **Adaptive Configuration**: Allows organism to adapt without mutation

## The Manifest Nature

Like how an organism's phenotype is the visible manifestation of its genotype expressed in an environment, our phaneron:

- Takes the structural possibilities (stroma)
- Expresses them in a specific environment
- Makes internal state visible and inspectable
- Allows adaptation without code changes

The phaneron is where the abstract becomes concrete, where possibilities become actualities, where the organism reveals its current form to the world.

## 🗺️ Developer Quick Reference

**You're looking for configuration and environment settings!**

| What you need        | Where to find it | Example                 |
| -------------------- | ---------------- | ----------------------- |
| Get Notion config    | `config/`        | `getNotionConfig()`     |
| Access env vars      | `config/env.ts`  | `env.NOTION_API_KEY`    |
| Server configuration | `config/`        | `createMcpServerInfo()` |

### Common Imports

```typescript
// Configuration
import { getNotionConfig, createMcpServerInfo, env } from '@chora/phaneron';

// Types (from exports)
import type { NotionConfig, ServerConfig } from '@chora/phaneron';
```

### Quick Examples

```typescript
// Get Notion configuration
const config = getNotionConfig();
console.log(config.apiKey); // Safely accessed

// Access environment variables
const logLevel = env.LOG_LEVEL || 'info';

// Create server info for MCP
const serverInfo = createMcpServerInfo();
```

### Environment Variables

The following environment variables are recognized:

- `NOTION_API_KEY` - Your Notion integration token (required)
- `LOG_LEVEL` - Logging level: debug, info, warn, error (default: info)
- `NODE_ENV` - Environment: development, production, test

💡 **Remember**: Phaneron makes the invisible visible - it's where your app's configuration becomes manifest!
