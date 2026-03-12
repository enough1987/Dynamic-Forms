import queryBuilderConfig from './queryBuilder.json'
import queryBuilderConfig1 from './queryBuilder1.json'
import queryBuilderConfig2 from './queryBuilder2.json'
import queryBuilderConfig3 from './queryBuilder3.json'
import queryBuilderConfig4 from './queryBuilder4.json'
import queryBuilderConfig5 from './queryBuilder5.json'

export const queryBuilderConfigs = [
  queryBuilderConfig,
  queryBuilderConfig1,
  queryBuilderConfig2,
  queryBuilderConfig3,
  queryBuilderConfig4,
  queryBuilderConfig5,
]

const SUGGESTIONS1 = [
  'Find patients with elevated CRP and ESR levels…',
  'Compare biomarker trends across age groups…',
  'Show metadata for samples with abnormal CBC results…',
  'Analyse correlation between BMI and HbA1c values…',
  'Filter cohort by ICD-10 diagnosis code J18.9…',
]

const SUGGESTIONS2 = [
  'List samples with missing genotype metadata…',
  'Run differential expression on tumour vs normal tissue…',
  'Summarise lipid panel outliers in hypertension group…',
  'Show WBC count distribution across patient cohorts…',
  'Identify samples with low DNA concentration for re-extraction…',
]

const SUGGESTIONS3 = [
  'Compare survival rates between treatment arms…',
  'Find patients with comorbid diabetes and hypertension…',
  'Show RNA-seq read depth per sample in batch 3…',
  'Analyse microbiome diversity across disease stages…',
  'Filter by pathology report: adenocarcinoma grade II…',
]

const SUGGESTIONS4 = [
  'Show methylation patterns in BRCA1 promoter region…',
  'List participants with incomplete follow-up data…',
  'Compare platelet counts pre- and post-treatment…',
  'Find outliers in liver enzyme panels (ALT, AST, GGT)…',
  'Correlate cytokine levels with clinical severity score…',
]

const SUGGESTIONS5 = [
  'Identify CNV regions overlapping known oncogenes…',
  'Show allele frequency distribution for SNP rs429358…',
  'Filter samples by tissue type: peripheral blood mononuclear cells…',
  'Compare eGFR trends in chronic kidney disease cohort…',
  'Run pathway enrichment on DEGs from inflammatory response…',
]

export const SUGGESTIONS = [...SUGGESTIONS1, ...SUGGESTIONS2, ...SUGGESTIONS3, ...SUGGESTIONS4, ...SUGGESTIONS5]
