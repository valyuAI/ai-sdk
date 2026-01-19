import { tool } from "ai";
import { z } from "zod";
import type { ValyuAcademicSearchConfig } from "./types.js";

/**
 * Creates an academic paper search tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu academic search
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { academicSearch } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'Find recent research papers on transformer architectures',
 *   tools: {
 *     academicSearch: academicSearch({ maxNumResults: 5 }),
 *   },
 * });
 * ```
 */
export function academicSearch(config: ValyuAcademicSearchConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    searchType = "proprietary",
    maxNumResults = 5,
    includedSources = [
      "valyu/valyu-arxiv",
      "valyu/valyu-biorxiv",
      "valyu/valyu-medrxiv",
      "valyu/valyu-pubmed",
    ],
    ...otherOptions
  } = config;

  return tool({
    description: "Search academic papers and preprints from arXiv, PubMed, bioRxiv, and medRxiv. Use for research papers across all scientific disciplines.",
    inputSchema: z.object({
      query: z.string().min(1).max(500).describe("Natural language query (e.g., 'transformer architectures for protein folding', 'CRISPR gene editing mechanisms')"),
    }),
    execute: async ({ query }) => {
      if (!apiKey) {
        throw new Error("VALYU_API_KEY is required. Set it in environment variables or pass it in config.");
      }

      const requestBody: any = {
        query,
        search_type: searchType,
        max_num_results: maxNumResults,
        included_sources: includedSources,
      };

      if (otherOptions.maxPrice !== undefined) {
        requestBody.max_price = otherOptions.maxPrice;
      }
      if (otherOptions.relevanceThreshold !== undefined) {
        requestBody.relevance_threshold = otherOptions.relevanceThreshold;
      }
      if (otherOptions.category) {
        requestBody.category = otherOptions.category;
      }
      if (otherOptions.responseLength !== undefined) {
        requestBody.response_length = otherOptions.responseLength;
      }

      try {
        const response = await fetch("https://api.valyu.ai/v1/deepsearch", {
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
          throw new Error(`Failed to search academic papers with Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
