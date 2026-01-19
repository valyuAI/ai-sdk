import { tool } from "ai";
import { z } from "zod";
import type { ValyuLifeSciencesSearchConfig } from "./types.js";

/**
 * Creates a life sciences search tool powered by Valyu for use with Vercel AI SDK
 *
 * @param config - Configuration options for the Valyu life sciences search
 * @returns A tool that can be used with AI SDK's generateText, streamText, etc.
 *
 * @example
 * ```ts
 * import { generateText } from "ai";
 * import { lifeSciencesSearch } from "@valyu/ai-sdk";
 * import { openai } from "@ai-sdk/openai";
 *
 * const { text } = await generateText({
 *   model: openai('gpt-5'),
 *   prompt: 'Find clinical trials for GLP-1 agonists in obesity',
 *   tools: {
 *     lifeSciencesSearch: lifeSciencesSearch({ maxNumResults: 5 }),
 *   },
 * });
 * ```
 */
export function lifeSciencesSearch(config: ValyuLifeSciencesSearchConfig = {}) {
  const {
    apiKey = process.env.VALYU_API_KEY,
    searchType = "proprietary",
    maxNumResults = 5,
    includedSources = [
      // Clinical and regulatory
      "valyu/valyu-clinical-trials",
      "valyu/valyu-drug-labels",
      // Pharmaceutical databases
      "valyu/valyu-chembl",
      "valyu/valyu-pubchem",
      "valyu/valyu-drugbank",
      "valyu/valyu-open-targets",
      // Healthcare
      "valyu/valyu-npi-registry",
      "valyu/valyu-who-icd",
      // Genomics (NCBI)
      "valyu/valyu-ncbi-gene",
      "valyu/valyu-ncbi-snp",
      "valyu/valyu-ncbi-clinvar",
      "valyu/valyu-ncbi-geo",
      "valyu/valyu-ncbi-sra",
    ],
    ...otherOptions
  } = config;

  return tool({
    description: "Search life sciences databases including clinical trials, drug data (ChEMBL, DrugBank, PubChem), FDA labels, genomics (NCBI Gene, SNP, ClinVar, GEO, SRA), and healthcare data (NPI registry, WHO ICD codes). Use for biomedical research, drug discovery, and genomics queries.",
    inputSchema: z.object({
      query: z.string().min(1).max(500).describe("Natural language query (e.g., 'BRCA1 mutations in breast cancer', 'Phase 3 melanoma immunotherapy trials', 'GLP-1 agonist mechanisms')"),
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
          throw new Error(`Failed to search life sciences data with Valyu: ${error.message}`);
        }
        throw error;
      }
    },
  });
}
