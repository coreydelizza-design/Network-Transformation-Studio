/* ─── Components ─── */
export { default as PatternElementInspector } from './PatternElementInspector';
export { default as PatternElementList } from './PatternElementList';
export { default as CustomerOverridePanel } from './CustomerOverridePanel';
export { default as ApplicabilityBadge } from './ApplicabilityBadge';
export { default as PatternElementToggle } from './PatternElementToggle';
export { default as ElementSummaryPanel } from './ElementSummaryPanel';

/* ─── Hooks ─── */
export { usePatternOverrides } from './usePatternOverrides';
export type { PatternOverridesAPI } from './usePatternOverrides';
export { useArchitectureStudio } from './useArchitectureStudio';
export type { ArchitectureStudioAPI } from './useArchitectureStudio';

/* ─── Types ─── */
export type {
  PatternElement, PatternOverride, CustomerSpecifics, ApplicabilityStatus,
  UseCaseTemplate, GttSolution, RequirementItem, AccentColor, Designation,
} from './types';

/* ─── Constants ─── */
export { APPLICABILITY_META, DESIGNATION_META, FIT_DIMENSIONS, isElementActive, shouldDrawEdges } from './types';
export { PATTERN_ELEMENTS } from './patternData';
export { TEMPLATES } from './templateData';
export { GTT_SOLUTIONS } from './gttSolutionData';
