# gql-mcp-server

A Model Context Protocol server that enables LLMs to interact with GraphQL APIs. This implementation provides schema introspection and query execution capabilities, allowing models to discover and use GraphQL APIs dynamically.


| Environment Variable | Description | Default |
|----------|-------------|---------|
| `ENDPOINT` | GraphQL endpoint URL | `http://localhost:4000/graphql` |
| `HEADERS` | JSON string containing headers for requests | `{}` |
| `ALLOW_MUTATIONS` | Enable mutation operations (disabled by default) | `false` |
| `NAME` | Name of the MCP server | `mcp-graphql` |

## Resources


- **schema**: exposes the GraphQL Schema to easy use by the IA

## Available Tools
1. **introspect**: This tool retrieves the GraphQL schema. used to index or get a new funciton by the LLM

2. **query**: Execute GraphQL queries.

## Installation

### Installing Manually

start with installing the dependencies

```
npm i
``` 

after run the build of the package

```
npm run build
```

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
