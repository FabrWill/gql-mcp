# Graphql MCP Server

An model contexto protocol adapted to running and list graphql queries


| Environment Variable | Description | Default |
|----------|-------------|---------|
| `ENDPOINT` | GraphQL endpoint URL | `http://localhost:4000/graphql` |
| `HEADERS` | JSON string containing headers for requests | `{}` |
| `ALLOW_MUTATIONS` | Enable mutation operations (disabled by default) | `false` |

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
