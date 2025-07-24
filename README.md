# gql-mcp-server

A Model Context Protocol server that enables LLMs to interact with GraphQL APIs. This implementation provides schema introspection and query execution capabilities, allowing models to discover and use GraphQL APIs dynamically.


| Environment Variable | Description | Default |
|----------|-------------|---------|
| `ENDPOINT` | GraphQL endpoint URL | `http://localhost:4000/graphql` |
| `HEADERS` | JSON string containing headers for requests | `{}` |
| `ALLOW_MUTATIONS` | Enable mutation operations (disabled by default) | `false` |
| `NAME` | Name of the MCP server | `mcp-graphql` |

### Examples

```bash
# Basic usage with a local GraphQL server
ENDPOINT=http://localhost:3000/graphql npx mcp-graphql

# Using with custom headers
ENDPOINT=https://api.example.com/graphql HEADERS='{"Authorization":"Bearer token123"}' npx mcp-graphql

# Enable mutation operations
ENDPOINT=http://localhost:3000/graphql ALLOW_MUTATIONS=true npx mcp-graphql

# Using a local schema file instead of introspection
ENDPOINT=http://localhost:3000/graphql SCHEMA=./schema.graphql npx mcp-graphql
```

## Resources


- **schema**: The server exposes the GraphQL schema as a resource that clients can access. This is either the local schema file or based on an introspection query.

## Available Tools

The server provides two main tools:

1. **introspect**: This tool retrieves the GraphQL schema. Use this first if you don't have access to the schema as a resource.
This uses either the local schema file or an introspection query.

2. **query**: Execute GraphQL queries against the endpoint. By default, mutations are disabled unless `ALLOW_MUTATIONS` is set to `true`.

## Installation

### Installing Manually

It can be manually installed to cursor:
```json
{
  "mcpServers": {
    "gql-mcp-server": {
      "command": "npx",
      "args": ["mcp-graphql"],
      "env": {
          "ENDPOINT": "https://localhost",
          "HEADERS": "{\"x-api-key\":\"apikey\"}"
      }
    }
  }
}
```
