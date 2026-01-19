// Export all search tools
export { search } from "./search.js";
export { webSearch } from "./web-search.js";
export { financeSearch } from "./finance-search.js";
export { academicSearch } from "./academic-search.js";
export { lifeSciencesSearch } from "./life-sciences-search.js";
export { patentSearch } from "./patent-search.js";
export { secSearch } from "./sec-search.js";
export { economicsSearch } from "./economics-search.js";
export { companyResearch } from "./company-research.js";
export { contents } from "./contents.js";

// Backwards-compatible aliases (deprecated)
export { lifeSciencesSearch as bioSearch } from "./life-sciences-search.js";
export { academicSearch as paperSearch } from "./academic-search.js";

// Export datasources discovery tools
export { datasources, datasourcesCategories } from "./datasources.js";

// Export all types
export type {
  ValyuBaseConfig,
  ValyuSearchConfig,
  ValyuWebSearchConfig,
  ValyuFinanceSearchConfig,
  ValyuAcademicSearchConfig,
  ValyuLifeSciencesSearchConfig,
  ValyuPatentSearchConfig,
  ValyuSecSearchConfig,
  ValyuEconomicsSearchConfig,
  ValyuCompanyResearchConfig,
  ValyuContentsConfig,
  ValyuSearchResult,
  ValyuApiResponse,
  ValyuResultsBySource,
  ValyuSourceType,
  ValyuDataType,
  ValyuResponseLength,
  ValyuResponseLengthPreset,
  // Backwards-compatible type aliases (deprecated)
  ValyuLifeSciencesSearchConfig as ValyuBioSearchConfig,
  ValyuAcademicSearchConfig as ValyuPaperSearchConfig,
} from "./types.js";
export type { ValyuDatasourcesConfig } from "./datasources.js";
