import { tool } from "ai";
import { z } from "zod";
import type { ValyuContentsConfig } from "./types.js";

/**
 * Creates a content extraction tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu contents extraction
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { contents } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'Extract and summarize this article: https://example.com/article',
 *   tools: {
 *     contents: contents(),
 *   },
 * });
 * ```
 */
export function contents(config: ValyuContentsConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    responseLength = "max",
    extractEffort = "auto",
  } = config;

  return tool({
    description: "Extract clean, structured content from URLs. Use this to read and process web pages, articles, and documents.",
    inputSchema: z.object({
      urls: z.array(z.string().url()).min(1).max(10).describe("Array of URLs to extract content from (1-10 URLs)"),
    }),
    execute: async ({ urls }) => {
      if (!apiKey) {
        throw new Error("VALYU_API_KEY is required. Set it in environment variables or pass it in config.");
      }

      const requestBody: any = {
        urls,
        response_length: responseLength,
        extract_effort: extractEffort,
      };

      try {
        const response = await fetch("https://api.valyu.ai/v1/contents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Valyu API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to extract content with Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
