#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { parse } from "graphql/language";
import { z } from "zod";
import { introspectEndpoint } from "./helpers/introspection.js";

const EnvSchema = z.object({
  ENDPOINT: z.string().url().default("http://localhost:4000/graphql"),
  ALLOW_MUTATIONS: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default("false"),
  HEADERS: z
    .string()
    .default("{}")
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch (e) {
        throw new Error("HEADERS must be a valid JSON string");
      }
    }),
});

const env = EnvSchema.parse(process.env);

const server = new McpServer({
  name: "GQL-mcp-server",
  version: "1.0.0",
  description: `GraphQL MCP server for ${env.ENDPOINT}`,
});

server.resource(
  "schema",
  new URL(env.ENDPOINT).href,
  async (uri: any) => {
    try {
      let schema = await introspectEndpoint(env.ENDPOINT, env.HEADERS);

      return {
        contents: [
          {
            uri: uri.href,
            text: schema,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get GraphQL schema: ${error}`);
    }
  }
);

server.tool(
  "inspect",
  "Inspect this server",
  {
    __ignore__: z
      .boolean()
      .default(false)
      .describe("This does not do anything"),
  },
  async () => {
    console.log("Inspecting server");
    return {
      content: [
        {
          type: "text",
          text: "This is a test",
        },
      ],
    };
  }
);

server.tool(
  "introspect",
  "Introspect the GraphQL schema, use this tool before doing a query to get the schema information if you do not have it available as a resource already.",
  {
    // This is a workaround to help clients that can't handle an empty object as an argument
    // They will often send undefined instead of an empty object which is not allowed by the schema
    __ignore__: z
      .boolean()
      .default(false)
      .describe("This does not do anything"),
  },
  async () => {
    try {
      const schema = await introspectEndpoint(env.ENDPOINT, env.HEADERS);

      return {
        content: [
          {
            type: "text",
            text: schema,
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Failed to introspect schema: ${error}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "query",
  "Query a GraphQL endpoint with the given query and variables",
  {
    query: z.string(),
    variables: z.string().optional(),
  },
  async ({ query, variables }) => {
    try {
      const parsedQuery = parse(query);

      // Check if the query is a mutation
      const isMutation = parsedQuery.definitions.some(
        (def) =>
          def.kind === "OperationDefinition" && def.operation === "mutation"
      );

      if (isMutation && !env.ALLOW_MUTATIONS) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Mutations are not allowed unless you enable them in the configuration. Please use a query operation instead.",
            },
          ],
        };
      }
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Invalid GraphQL query: ${error}`,
          },
        ],
      };
    }

    try {
      const response = await fetch(env.ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...env.HEADERS,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();

        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `GraphQL request failed: ${response.statusText}\n${responseText}`,
            },
          ],
        };
      }

      const data = (await response.json()) as any;

      if (data.errors && data.errors.length > 0) {
        // Contains GraphQL errors
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `The GraphQL response has errors, please fix the query: ${JSON.stringify(
                data,
                null,
                2
              )}`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to execute GraphQL query: ${error}`);
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(
    `Started graphql mcp server for endpoint: ${env.ENDPOINT}`
  );
}

main().catch((error) => {
  console.error(`Fatal error in main(): ${error}`);
  process.exit(1);
});
