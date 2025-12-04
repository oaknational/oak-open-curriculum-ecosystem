---
title: Model Context Protocol (MCP) server
description: The Model Context Protocol (MCP) server provides a standardized interface for external clients to access Elastic Agent Builder tools. The MCP server is...
url: https://www.elastic.co/docs/solutions/search/agent-builder/mcp-server
---

# Model Context Protocol (MCP) server

The [**Model Context Protocol (MCP) server**](https://modelcontextprotocol.io/docs/getting-started/intro) provides a standardized interface for external clients to access Elastic Agent Builder tools.

## MCP server endpoint

The MCP server is available at:

```
{KIBANA_URL}/api/agent_builder/mcp
```

When using a custom Kibana Space, include the space name in the URL:

```
{KIBANA_URL}/s/{SPACE_NAME}/api/agent_builder/mcp
```

<tip>
  You can copy your MCP server URL directly in the Tools GUI. Refer to [Tools in Elastic Agent Builder > Copy your MCP server URL](/docs/solutions/search/agent-builder/tools#copy-your-mcp-server-url).
</tip>

## Configuring MCP clients

Most MCP clients (such as Claude Desktop, Cursor, VS Code, etc.) have similar configuration patterns. To connect to your Elastic instance, you need to provide your Kibana URL and API key in the client's configuration file, typically in the following format:

```json
{
  "mcpServers": {
    "elastic-agent-builder": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "${KIBANA_URL}/api/agent_builder/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ],
      "env": {
        "KIBANA_URL": "${KIBANA_URL}",
        "AUTH_HEADER": "ApiKey ${API_KEY}"
      }
    }
  }
}
```

<note>
  Set the following environment variables:
  ```bash
  export KIBANA_URL="your-kibana-url"
  export API_KEY="your-api-key"
  ```
  For information on generating API keys, refer to [API keys](https://www.elastic.co/docs/solutions/search/search-connection-details).Tools execute with the scope assigned to the API key. Make sure your API key has the appropriate permissions to only access the indices and data that you want to expose through the MCP server. To learn more, refer to [Model Context Protocol (MCP) server > API key application privileges](#api-key-application-privileges).
</note>

## API key application privileges

To access the MCP server endpoint, your API key must include Kibana application privileges.

### Development and testing

For development and testing purposes, you can create an unrestricted API key with full access:

```json
POST /_security/api_key
{
  "name": "my-mcp-api-key",
  "expiration": "1d",
  "role_descriptors": {
    "unrestricted": {
      "cluster": ["all"],
      "indices": [
        {
          "names": ["*"],
          "privileges": ["all"]
        }
      ]
    }
  }
}
```

### Production

For production environments, use a restricted API key with specific application privileges:

```json
POST /_security/api_key
{
  "name": "my-mcp-api-key",
  "expiration": "1d",
  "role_descriptors": {
    "mcp-access": {
      "cluster": ["all"],
      "indices": [
        {
          "names": ["*"],
          "privileges": ["read", "view_index_metadata"]
        }
      ],
      "applications": [
        {
          "application": "kibana-.kibana",
          "privileges": ["read_onechat", "space_read"],
          "resources": ["space:default"]
        }
      ]
    }
  }
}
```
