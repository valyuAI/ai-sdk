/**
 * Response length presets for controlling content size per result
 * - short: ~25,000 characters
 * - medium: ~50,000 characters
 * - large: ~100,000 characters
 * - max: Full content (no limit)
 */
export type ValyuResponseLengthPreset = "short" | "medium" | "large" | "max";

/**
 * Response length can be a preset or a specific character count
 */
export type ValyuResponseLength = ValyuResponseLengthPreset | number;

/**
 * Base configuration options for all Valyu search tools
 */
export interface ValyuBaseConfig {
  /**
   * Your Valyu API key. Get one at https://platform.valyu.ai
   * Defaults to process.env.VALYU_API_KEY
   */
  apiKey?: string;

  /**
   * Search type (default: "proprietary")
   * - proprietary: Access premium sources including academic papers, financial data, etc.
   * - web: Standard web search
   * - all: Search across all sources
   */
  searchType?: "proprietary" | "web" | "all";

  /**
   * Maximum number of results to return (default: 10)
   */
  maxNumResults?: number;

  /**
   * Maximum price per query in CPM (cost per thousand retrievals)
   * Use this to control costs
   */
  maxPrice?: number;

  /**
   * Relevance threshold (0-1) to filter results by match quality
   */
  relevanceThreshold?: number;

  /**
   * Flag for agentic integration (default: true)
   */
  isToolCall?: boolean;

  /**
   * Controls the length of content returned per result.
   * Can be a preset ('short', 'medium', 'large', 'max') or a specific character count.
   * - short: ~25,000 characters
   * - medium: ~50,000 characters
   * - large: ~100,000 characters
   * - max: Full content (no limit)
   */
  responseLength?: ValyuResponseLength;
}

/**
 * Configuration for universal search tool
 */
export interface ValyuSearchConfig extends ValyuBaseConfig {
  /**
   * List of specific sources to include
   */
  includedSources?: string[];

  /**
   * Category to focus the search on
   */
  category?: string;
}

/**
 * Configuration for web search tool
 */
export interface ValyuWebSearchConfig extends ValyuBaseConfig {
  /**
   * List of specific sources to include
   */
  includedSources?: string[];

  /**
   * Category to focus the search on
   */
  category?: string;
}

/**
 * Configuration for finance search tool
 */
export interface ValyuFinanceSearchConfig extends ValyuBaseConfig {
  /**
   * List of financial sources to include
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "stocks", "earnings", "market-data")
   */
  category?: string;
}

/**
 * Configuration for academic paper search tool
 */
export interface ValyuAcademicSearchConfig extends ValyuBaseConfig {
  /**
   * List of academic sources to include
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "computer-science", "physics", "mathematics")
   */
  category?: string;
}

/**
 * Configuration for life sciences search tool
 */
export interface ValyuLifeSciencesSearchConfig extends ValyuBaseConfig {
  /**
   * List of life sciences sources to include
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "clinical-trials", "genomics", "drug-discovery")
   */
  category?: string;
}

/**
 * Configuration for patent search tool
 */
export interface ValyuPatentSearchConfig extends ValyuBaseConfig {
  /**
   * List of patent sources to include
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "technology", "pharmaceutical", "mechanical")
   */
  category?: string;
}

/**
 * Configuration for SEC search tool
 */
export interface ValyuSecSearchConfig extends ValyuBaseConfig {
  /**
   * List of SEC filing sources to include
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "10-K", "10-Q", "8-K", "proxy")
   */
  category?: string;
}

/**
 * Configuration for economics search tool
 */
export interface ValyuEconomicsSearchConfig extends ValyuBaseConfig {
  /**
   * List of economics sources to include
   */
  includedSources?: string[];

  /**
   * Category to focus on (e.g., "labor-statistics", "economic-indicators", "government-spending")
   */
  category?: string;
}

/**
 * Configuration for company research tool
 */
export interface ValyuCompanyResearchConfig {
  /**
   * Your Valyu API key. Get one at https://platform.valyu.ai
   * Defaults to process.env.VALYU_API_KEY
   */
  apiKey?: string;

  /**
   * Maximum price per API call in cents (default: 100 = $1.00)
   * This controls the cost limit for each section of the research report
   */
  dataMaxPrice?: number;
}

/**
 * Configuration for contents extraction tool
 */
export interface ValyuContentsConfig {
  /**
   * Your Valyu API key. Get one at https://platform.valyu.ai
   * Defaults to process.env.VALYU_API_KEY
   */
  apiKey?: string;

  /**
   * Response length preset (default: "max")
   */
  responseLength?: ValyuResponseLengthPreset;

  /**
   * Extraction effort level (default: "auto")
   */
  extractEffort?: "auto" | "low" | "medium" | "high";
}

/**
 * Source type for search results
 */
export type ValyuSourceType =
  | "general"
  | "website"
  | "forum"
  | "paper"
  | "data"
  | "report"
  | "health_data"
  | "clinical_trial"
  | "drug_label"
  | "grants";

/**
 * Data type classification
 */
export type ValyuDataType = "unstructured" | "structured";

/**
 * Search result returned from Valyu DeepSearch API
 */
export interface ValyuSearchResult {
  /** Unique identifier for the result */
  id: string;
  /** Title of the content */
  title: string;
  /** URL for the result (includes UTM parameters from Valyu) */
  url: string;
  /** Context text in markdown format with LaTeX equations where applicable */
  content: string;
  /** Source type ('web' or dataset name like 'valyu/valyu-arxiv') */
  source: string;
  /** Character count of the content */
  length: number;
  /** Cost of this result in dollars */
  price: number;
  /** Type of data */
  data_type: ValyuDataType;
  /** Specific source type (website, paper, clinical_trial, etc.) */
  source_type: ValyuSourceType;
  /** Associated image URL (if available) */
  image_url?: string | { main?: string };
  /** Publication date in YYYY-MM-DD format */
  publication_date?: string;
  /** Digital Object Identifier (for academic content) */
  doi?: string;
  /** Citation information */
  citation?: string;
  /** Number of citations (for academic papers) */
  citation_count?: number;
  /** List of author names */
  authors?: string[];
  /** Markdown references for citations in the content */
  references?: string;
  /** Any additional metadata fields */
  [key: string]: any;
}

/**
 * Count of results by source type
 */
export interface ValyuResultsBySource {
  /** Number of web results */
  web: number;
  /** Number of proprietary results */
  proprietary: number;
}

/**
 * API response from Valyu DeepSearch endpoint
 * This includes the full response with all metadata for maximum flexibility
 */
export interface ValyuApiResponse {
  /** Whether the request was successful */
  success: boolean;
  /** Error message (empty if successful). May contain recommendations to improve search results */
  error: string;
  /** Unique transaction ID for this request */
  tx_id: string;
  /** The query string that was searched */
  query: string;
  /** Array of search results sorted by relevance */
  results: ValyuSearchResult[];
  /** Count of results by source type */
  results_by_source: ValyuResultsBySource;
  /** Total cost in cost per mille (CPM) */
  total_deduction_pcm: number;
  /** Total cost in dollars */
  total_deduction_dollars: number;
  /** Total character count of all results */
  total_characters: number;
  /** Any additional fields from the API */
  [key: string]: any;
}
