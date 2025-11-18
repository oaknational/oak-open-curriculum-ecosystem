# SDK Publishing and Versioning Plan

**Status**: PLANNED  
**Priority**: Medium (production hardening)  
**Created**: 2025-11-11  
**Owner**: Engineering

## Purpose

Establish a production-ready publishing and versioning workflow so that:

1. **Developers** can `pnpm install @oaknational/oak-curriculum-sdk` and use the SDK in their projects
2. **Users** can `pnpm dlx @oaknational/oak-curriculum-mcp-streamable-http --http` to start the HTTP MCP server locally
3. **Versioning** is consistent across all packages, reflected in server metadata and documentation
4. **Release pipeline** propagates versions consistently and automatically

## Current State

### What Works

- ✅ Monorepo structure with pnpm workspaces
- ✅ Internal workspace dependencies (`workspace:*`)
- ✅ Type-gen generates SDK from OpenAPI spec
- ✅ MCP servers work locally via `pnpm dev`

### What's Missing

- ❌ No packages published to npm
- ❌ No versioning strategy (all packages at 0.0.0)
- ❌ No release automation
- ❌ MCP servers don't expose version metadata
- ❌ No `bin` entry for `pnpm dlx` usage
- ❌ No package preparation (dependency bundling, tree-shaking)

## Goals

1. **Publishing**: All public packages publishable to npm registry
2. **Versioning**: Semantic versioning with automatic changelog generation
3. **Release Pipeline**: Automated release workflow
4. **Version Metadata**: Server version exposed via MCP protocol and `/` landing page
5. **CLI Entry Points**: MCP servers runnable via `pnpm dlx`
6. **Documentation**: Clear installation and usage instructions

## Architecture

### Package Publishing Strategy

**Public Packages** (published to npm):

- `@oaknational/oak-curriculum-sdk` - Core SDK
- `@oaknational/oak-curriculum-mcp-streamable-http` - HTTP MCP server
- `@oaknational/oak-curriculum-mcp-stdio` - STDIO MCP server
- `@oaknational/mcp-logger` - Logger library
- `@oaknational/mcp-transport` - Transport abstractions

**Private Packages** (not published):

- `oak-open-curriculum-semantic-search` - Internal app
- `oak-notion-mcp` - Example/demo only

### Versioning Strategy

**Approach**: Independent versioning per package (not monorepo-wide)

**Rationale**:

- SDK and servers evolve independently
- SDK version tied to OpenAPI schema version
- Server versions reflect feature additions (OAuth, observability, etc.)
- Logger/transport are utility libraries with own lifecycles

**Version Sources**:

```typescript
// packages/sdks/oak-curriculum-sdk/package.json
{
  "version": "0.5.0" // Matches OpenAPI schema version
}

// apps/oak-curriculum-mcp-streamable-http/package.json
{
  "version": "1.0.0" // Independent MCP server version
}
```

### Version Exposure

**MCP Server Metadata** (exposed via protocol):

```typescript
// server.ts
import { version } from './package.json' assert { type: 'json' };

const serverInfo = {
  name: 'oak-curriculum-mcp',
  version, // e.g., "1.0.0"
  // ... other metadata
};
```

**Landing Page** (exposed via GET `/`):

```html
<h1>Oak Curriculum MCP Server v1.0.0</h1>
<p>SDK Version: 0.5.0</p>
<p>OpenAPI Schema: 0.5.0-e01092929...</p>
```

**Package Metadata** (exposed via npm):

```json
{
  "name": "@oaknational/oak-curriculum-sdk",
  "version": "0.5.0",
  "description": "Type-safe SDK for Oak National Academy's Curriculum API",
  "keywords": ["oak", "education", "curriculum", "sdk", "mcp"]
}
```

### CLI Entry Points

**HTTP Server**:

```json
// apps/oak-curriculum-mcp-streamable-http/package.json
{
  "bin": {
    "oak-curriculum-mcp": "./bin/oak-curriculum-mcp.js"
  }
}
```

**Usage**:

```bash
# Install globally
pnpm add -g @oaknational/oak-curriculum-mcp-streamable-http

# Or run directly
pnpm dlx @oaknational/oak-curriculum-mcp-streamable-http

# Or with flags
pnpm dlx @oaknational/oak-curriculum-mcp-streamable-http --port 3000
```

**STDIO Server**:

```json
// apps/oak-curriculum-mcp-stdio/package.json
{
  "bin": {
    "oak-curriculum-mcp-stdio": "./bin/oak-curriculum-mcp.js"
  }
}
```

## Implementation Plan

### Phase 1: Package Preparation (1 week)

**Session 1: Package Metadata**

1. Update `package.json` for all public packages:
   - Add proper `description`, `keywords`, `author`, `license`
   - Add `repository`, `homepage`, `bugs` URLs
   - Specify `engines` (Node 18+)
   - Add `publishConfig` with access level
2. Add `README.md` to each public package
3. Add `LICENSE` file (MIT) to repo root

**Session 2: Version Management**

1. Install Changesets: `pnpm add -D @changesets/cli`
2. Initialize Changesets: `pnpm changeset init`
3. Configure Changesets for independent versioning
4. Add version scripts to root `package.json`
5. Document changeset workflow in CONTRIBUTING.md

**Session 3: CLI Entry Points**

1. Create `bin/oak-curriculum-mcp.js` in HTTP server
2. Create `bin/oak-curriculum-mcp-stdio.js` in STDIO server
3. Make scripts executable (`chmod +x`)
4. Add shebang (`#!/usr/bin/env node`)
5. Test with `node bin/oak-curriculum-mcp.js`

**Session 4: Version Exposure**

1. Update server initialization to read version from `package.json`
2. Expose version in MCP server metadata
3. Update landing page to display versions
4. Add version to structured logging output

**Acceptance**:

- ✅ All packages have complete metadata
- ✅ Changesets configured and documented
- ✅ CLI entry points work locally
- ✅ Versions exposed in server metadata and landing page

### Phase 2: Build & Bundle Configuration (1 week)

**Session 1: SDK Build Optimization**

1. Review tsup configuration for SDK
2. Configure tree-shaking and minification
3. Ensure type declarations generated correctly
4. Test SDK imports in external project

**Session 2: Server Build Optimization**

1. Configure tsup for servers
2. Bundle dependencies (exclude peer dependencies)
3. Generate standalone executables
4. Test server startup time

**Session 3: Pre-publish Scripts**

1. Add `prepublishOnly` script for type-gen + build
2. Add `files` field to limit published content
3. Verify generated artifacts with `npm pack --dry-run`
4. Test local installation with `pnpm link`

**Acceptance**:

- ✅ SDK builds efficiently with proper tree-shaking
- ✅ Servers bundle correctly with all dependencies
- ✅ Pre-publish scripts ensure artifacts up to date
- ✅ Local linking works for testing

### Phase 3: Release Automation (3-5 days)

**Session 1: GitHub Actions Workflow**

1. Create `.github/workflows/release.yml`
2. Configure npm authentication (NPM_TOKEN secret)
3. Add changeset version bump step
4. Add changeset publish step
5. Configure git tagging

**Session 2: Release Process Documentation**

1. Document release workflow in CONTRIBUTING.md
2. Create release checklist
3. Add troubleshooting guide
4. Document rollback procedure

**Session 3: Initial Release**

1. Create changesets for initial versions
2. Run `pnpm changeset version`
3. Review generated CHANGELOG.md files
4. Test publish to npm (dry-run first)
5. Publish initial versions

**Acceptance**:

- ✅ GitHub Actions workflow configured and tested
- ✅ Release process documented
- ✅ Initial versions published to npm
- ✅ Installation works: `pnpm add @oaknational/oak-curriculum-sdk`
- ✅ CLI works: `pnpm dlx @oaknational/oak-curriculum-mcp-streamable-http`

### Phase 4: Post-Release Validation (2 days)

**Session 1: Installation Testing**

1. Create test project in separate directory
2. Test SDK installation and usage
3. Test MCP server installation and startup
4. Test `pnpm dlx` execution
5. Document any issues

**Session 2: Documentation Updates**

1. Update main README with installation instructions
2. Update package READMEs with npm badges
3. Update quick-start guide
4. Update API documentation
5. Announce release (if appropriate)

**Acceptance**:

- ✅ SDK installation tested in fresh project
- ✅ MCP servers runnable via `pnpm dlx`
- ✅ Documentation complete and accurate
- ✅ npm package pages look good

## Configuration Examples

### Root package.json

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.1"
  }
}
```

### .changeset/config.json

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["oak-open-curriculum-semantic-search", "oak-notion-mcp"]
}
```

### SDK package.json

```json
{
  "name": "@oaknational/oak-curriculum-sdk",
  "version": "0.5.0",
  "description": "Type-safe SDK for Oak National Academy's Curriculum API with MCP tool generation",
  "keywords": ["oak", "education", "curriculum", "sdk", "mcp", "openapi", "typescript"],
  "author": "Oak National Academy",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/oaknational/oak-curriculum-mcp.git",
    "directory": "packages/sdks/oak-curriculum-sdk"
  },
  "homepage": "https://github.com/oaknational/oak-curriculum-mcp",
  "bugs": "https://github.com/oaknational/oak-curriculum-mcp/issues",
  "engines": {
    "node": ">=18.0.0"
  },
  "publishConfig": {
    "access": "public"
  },
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "prepublishOnly": "pnpm type-gen && pnpm build"
  }
}
```

### HTTP Server package.json

```json
{
  "name": "@oaknational/oak-curriculum-mcp-streamable-http",
  "version": "1.0.0",
  "description": "Oak Curriculum MCP Server (HTTP transport with OAuth 2.1)",
  "keywords": ["oak", "mcp", "model-context-protocol", "http", "oauth"],
  "bin": {
    "oak-curriculum-mcp": "./bin/oak-curriculum-mcp.js"
  },
  "files": ["dist", "bin", "README.md", "LICENSE"],
  "engines": {
    "node": ">=18.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### bin/oak-curriculum-mcp.js

```javascript
#!/usr/bin/env node
import '../dist/server.js';
```

### GitHub Actions Workflow

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install --frozen-lockfile

      - run: pnpm type-gen

      - run: pnpm build

      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          version: pnpm changeset version
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Release Workflow

### For Contributors

1. **Make changes** to code
2. **Create changeset**: `pnpm changeset`
   - Select packages affected
   - Choose semver bump type (major/minor/patch)
   - Write user-facing changelog entry
3. **Commit changeset** with code changes
4. **Open PR** - changeset bot comments with preview

### For Maintainers

1. **Merge PR** with changeset
2. **Changesets bot** creates "Version Packages" PR
3. **Review** version bumps and CHANGELOGs
4. **Merge** "Version Packages" PR
5. **GitHub Actions** publishes to npm automatically
6. **Git tags** created for each published version

### Manual Release (if needed)

```bash
# 1. Create changesets for all changes
pnpm changeset

# 2. Bump versions and generate CHANGELOGs
pnpm changeset version

# 3. Build everything
pnpm type-gen && pnpm build

# 4. Publish (dry-run first)
pnpm changeset publish --dry-run

# 5. Publish for real
pnpm changeset publish

# 6. Push tags
git push --follow-tags
```

## Testing Strategy

### Pre-Release Testing

1. **Local Linking**:

   ```bash
   cd packages/sdks/oak-curriculum-sdk
   pnpm link --global

   cd ~/test-project
   pnpm link --global @oaknational/oak-curriculum-sdk
   ```

2. **Dry-Run Publish**:

   ```bash
   pnpm changeset publish --dry-run
   npm pack --dry-run
   ```

3. **Tarball Inspection**:
   ```bash
   npm pack
   tar -tzf *.tgz
   ```

### Post-Release Testing

1. **Fresh Install**:

   ```bash
   mkdir test-sdk && cd test-sdk
   pnpm init
   pnpm add @oaknational/oak-curriculum-sdk
   ```

2. **CLI Execution**:

   ```bash
   pnpm dlx @oaknational/oak-curriculum-mcp-streamable-http --help
   ```

3. **Version Verification**:
   ```bash
   curl http://localhost:3000/
   # Should show version
   ```

## Success Criteria

1. ✅ SDK installable: `pnpm add @oaknational/oak-curriculum-sdk`
2. ✅ HTTP server runnable: `pnpm dlx @oaknational/oak-curriculum-mcp-streamable-http`
3. ✅ STDIO server runnable: `pnpm dlx @oaknational/oak-curriculum-mcp-stdio`
4. ✅ Versions exposed in server metadata
5. ✅ Versions displayed on landing page
6. ✅ Changesets workflow documented
7. ✅ GitHub Actions release automation working
8. ✅ CHANGELOG.md generated automatically
9. ✅ npm package pages look professional
10. ✅ Installation instructions in README

## Risks and Mitigation

**Risk**: Breaking changes in published packages

- **Mitigation**: Start with 0.x.x versions; document semver policy; use changesets for clear communication

**Risk**: npm publish failures

- **Mitigation**: Dry-run first; test with npm link; have rollback procedure; use `npm unpublish` cautiously

**Risk**: Version drift between packages

- **Mitigation**: Independent versioning strategy; clear dependency declarations; automated testing

**Risk**: CLI entry points don't work on all platforms

- **Mitigation**: Test on Linux, macOS, Windows; use cross-platform shebang; document platform requirements

**Risk**: Large bundle sizes

- **Mitigation**: Tree-shaking with tsup; peer dependencies for large libs; bundle analysis

## Future Enhancements

- Automated version bumping based on conventional commits
- Pre-release versions (alpha, beta, rc)
- Canary releases for testing
- Multiple distribution tags (latest, next, canary)
- Download stats monitoring
- Automated security updates via Dependabot
- Bundle size monitoring in CI

## Related Plans

- `dev-tooling-and-dev-ai-support/` - Testing and infrastructure
- `sdk-and-mcp-enhancements/` - SDK content improvements
- `pipeline-enhancements/` - Type-gen pipeline improvements
- `mcp-oauth-implementation-plan.md` - Production-ready OAuth (related to v1.0.0)

## References

- [Changesets Documentation](https://github.com/changesets/changesets)
- [pnpm Publishing](https://pnpm.io/cli/publish)
- [npm CLI Documentation](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
