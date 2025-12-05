# Troubleshooting Guide

## Overview

This guide helps diagnose and resolve common issues with the Oak Notion MCP Server. Follow the steps in order for each issue.

## Quick Diagnostics

Run these commands to check your setup:

```bash
# Check Node.js version (must be 22+)
node --version

# Check if the package is installed
npm ls oak-notion-mcp

# Test the server directly
NOTION_API_KEY=your_notion_api_key_here

# Check environment variables
echo $NOTION_API_KEY
```

## Common Issues

### 1. MCP Server Not Working in Dev Mode

#### Symptom

```text
MCP tools fail with connection errors
"Failed to connect" messages when using Notion tools
```

#### Cause

The dev server uses `tsx` in `--watch` mode, which can crash and need restarting.

#### Solutions

1. **Check connection status**:

   ```text
   /mcp
   ```

2. **If it shows "failed to connect"**:
   - Exit the conversation session
   - Restart with `claude --continue`
   - Try the MCP command again

3. **Monitor the dev server**:
   - Check the terminal running `pnpm dev`
   - Look for crash messages or errors
   - Restart if needed with Ctrl+C then `pnpm dev`

### 2. Server Won't Start

#### Symptom

```text
Error: NOTION_API_KEY is required but not found
```

#### Solutions

1. **Check environment variable**:

   ```shell
   echo $NOTION_API_KEY
   ```

2. **Set the environment variable**:

   ```bash
   export NOTION_API_KEY="secret_your_actual_key_here"
   ```

3. **Use a .env file** (in project root):

   ```bash
   echo "NOTION_API_KEY=secret_your_actual_key_here" > .env
   ```

4. **Check Claude configuration**:

   ```json
   {
     "mcpServers": {
       "notion": {
         "env": {
           "NOTION_API_KEY": "secret_your_actual_key_here"
         }
       }
     }
   }
   ```

### 2. Authentication Errors

#### Symptom

```text
Error: Invalid API key
APIResponseError: API token is invalid
```

#### Solutions

1. **Verify API key format**:
   - Should start with `secret_`
   - No extra spaces or quotes
   - Exactly as provided by Notion

2. **Check Notion integration**:
   - Go to Notion Settings → Integrations
   - Ensure integration is active
   - Regenerate key if needed

3. **Test API key directly**:

   ```shell
   curl -X GET 'https://api.notion.com/v1/users/me' \
     -H 'Authorization: Bearer REDACTED' \
     -H 'Notion-Version: 2022-06-28'
   ```

### 3. Permission Errors

#### Symptom

```text
Error: Insufficient permissions
You do not have access to this resource
```

#### Solutions

1. **Share pages with integration**:
   - Open the Notion page/database
   - Click "Share" button
   - Invite your integration
   - Grant at least "Read" access

2. **Check workspace access**:
   - Integration must be added to workspace
   - Admin may need to approve

3. **Verify specific permissions**:
   - Pages: Must be shared individually
   - Databases: Parent page must also be shared
   - Users: Requires workspace-level access

### 4. Connection Issues

#### Symptom

```text
Error: Connection timeout
Network error: ECONNREFUSED
```

#### Solutions

1. **Check internet connection**:

   ```shell
   ping api.notion.com
   ```

2. **Verify firewall/proxy**:
   - Ensure HTTPS (443) is allowed
   - Check corporate proxy settings
   - Try without VPN

3. **Test Notion API directly**:

   ```shell
   curl https://api.notion.com/v1/users
   ```

### 5. MCP Client Integration Issues

#### Symptom

- Server starts but Claude can't connect
- "MCP server not found" errors

#### Solutions

1. **Check Claude configuration path**:
   - Claude Desktop: `~/.claude/settings.json`
   - Claude Code: Check with `claude mcp list`

2. **Verify command syntax**:

   ```json
   {
     "mcpServers": {
       "notion": {
         "command": "npx",
         "args": ["oak-notion-mcp"],
         "env": {
           "NOTION_API_KEY": "${NOTION_API_KEY}"
         }
       }
     }
   }
   ```

3. **Test with absolute path**:

   ```json
   {
     "command": "node",
     "args": ["/absolute/path/to/oak-notion-mcp/dist/index.js"]
   }
   ```

### 6. Resource Not Found

#### Symptom

```text
Error: Page/Database not found
Resource with ID xxx does not exist
```

#### Solutions

1. **Verify ID format**:
   - Must be UUID with hyphens
   - ✅ `0b76f124-6d3f-4363-b7cd-9c80f8dd5d99`
   - ❌ `0b76f1246d3f4363b7cd9c80f8dd5d99`

2. **Extract correct ID from Notion**:
   - Open page in Notion
   - Copy link
   - ID is after last dash in URL

3. **Check if resource exists**:
   - Page might be deleted
   - Database might be archived
   - ID might be from different workspace

### 7. Rate Limiting

#### Symptom

```text
Error: Rate limited
Too many requests
```

#### Solutions

1. **Wait and retry**:
   - Notion rate limits reset quickly
   - Server has automatic retry logic

2. **Reduce request frequency**:
   - Batch operations when possible
   - Cache results client-side

3. **Check for loops**:
   - Ensure not making repeated requests
   - Add delays between operations

### 8. Empty or Partial Results

#### Symptom

- Search returns no results
- Database queries are empty
- Missing content

#### Solutions

1. **Check sharing permissions**:
   - All parent pages must be shared
   - Databases need explicit sharing

2. **Verify search syntax**:
   - Searches are case-insensitive
   - Special characters may need escaping

3. **Check pagination**:
   - Default page size is 10
   - Use `page_size` for more results

### 9. PII Scrubbing Issues

#### Symptom

- Email addresses showing as `...@domain.com`
- Missing user information

#### Expected Behavior

This is intentional! Emails are scrubbed for privacy:

- `john.doe@example.com` → `joh...@example.com`

### 10. Intermittent Test Failures with `/@fs/` Errors

#### Symptom

```text
Error: Cannot find module '/@fs/Users/.../oak-curriculum-sdk/dist/mcp/stub-tool-executor.js'
```

Test failures that appear intermittently during `pnpm check` or `pnpm qg` but pass when running `pnpm test` alone.

#### Cause

Race condition where Vitest attempts to resolve modules while Turborepo is building workspace dependencies in parallel. The `/@fs/` prefix indicates Vite's file system resolution failed mid-build.

#### Solution

Ensure `turbo.json` has the correct test dependency:

```json
"test": {
  "dependsOn": ["^build"],
  "cache": true,
  ...
}
```

The `^build` dependency ensures all workspace dependencies are fully built before tests start.

If the issue persists:

```bash
pnpm clean
pnpm make
pnpm test
```

See [ADR 065: Turbo Task Dependencies](../architecture/architectural-decisions/065-turbo-task-dependencies.md) for details.

### 11. Build/Installation Issues

#### Symptom

```text
Error: Cannot find module
ESM errors
```

#### Solutions

1. **Check Node.js version**:

   ```shell
   node --version  # Must be 22+
   ```

2. **Clear npm cache**:

   ```shell
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

3. **Use correct package manager**:

   ```bash
   # If globally installed
   npm install -g oak-notion-mcp@latest

   # If in project
   npm install oak-notion-mcp@latest
   ```

## Debug Mode

Enable debug logging for more information:

```bash
# Set log level to debug
LOG_LEVEL=debug npx oak-notion-mcp

# In Claude configuration
{
  "env": {
    "NOTION_API_KEY": "...",
    "LOG_LEVEL": "debug"
  }
}
```

## Getting Help

If issues persist:

1. **Check logs**:
   - Look for error messages
   - Note any error codes
   - Check timestamps

2. **Gather information**:
   - Node.js version
   - Package version
   - Error messages
   - Configuration used

3. **Report issue**:
   - GitHub Issues: [oak-mcp-ecosystem/issues](https://github.com/oaknational/oak-mcp-ecosystem/issues)
   - Include all gathered information
   - Redact sensitive data (API keys)

## Common Error Codes

| Code                 | Meaning               | Solution                        |
| -------------------- | --------------------- | ------------------------------- |
| `INVALID_PARAMS`     | Bad input format      | Check argument types and format |
| `RESOURCE_NOT_FOUND` | Page/DB doesn't exist | Verify ID and permissions       |
| `PERMISSION_DENIED`  | No access rights      | Share resource with integration |
| `RATE_LIMITED`       | Too many requests     | Wait and retry                  |
| `INTERNAL_ERROR`     | Server error          | Check logs, report if persists  |

## Performance Tips

1. **Use specific queries**: More specific = faster
2. **Limit page content requests**: Only when needed
3. **Cache discovery results**: Workspace structure rarely changes
4. **Batch related operations**: Reduce round trips

## Security Reminders

- Never share API keys publicly
- Use environment variables
- Rotate keys regularly
- Check integration permissions
- Monitor usage in Notion settings
