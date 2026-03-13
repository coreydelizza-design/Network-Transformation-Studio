/* ═══════════════════════════════════════════════════════════════════════════
   ARCHITECTURE STUDIO — Type Definitions
   Central type file for the entire Architecture Studio module.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Applicability ───────────────────────────────────────────────────── */

/** Four-state applicability model for pattern elements. */
export type ApplicabilityStatus = 'active' | 'not-applicable' | 'optional' | 'future-phase';

export const APPLICABILITY_OPTIONS: { value: ApplicabilityStatus; label: string; symbol: string }[] = [
  { value: 'active',          label: 'Active',         symbol: '●' },
  { value: 'optional',        label: 'Optional',       symbol: '◐' },
  { value: 'future-phase',    label: 'Future Phase',   symbol: '◔' },
  { value: 'not-applicable',  label: 'Not Applicable', symbol: '○' },
];

/** Visual metadata for each applicability status — diagrams, badges, lists. */
export const APPLICABILITY_META: Record<ApplicabilityStatus, {
  label: string; symbol: string;
  nodeOpacity: number;
  edgeOpacity: number;
  listOpacity: number;
  dashArray: string;
  colorKey: 'emerald' | 'rose' | 'amber' | 'violet';
}> = {
  'active':         { label: 'Active',         symbol: '●', nodeOpacity: 1,    edgeOpacity: 1,    listOpacity: 1,    dashArray: '',       colorKey: 'emerald' },
  'optional':       { label: 'Optional',       symbol: '◐', nodeOpacity: 0.65, edgeOpacity: 0.45, listOpacity: 0.75, dashArray: '6 3',    colorKey: 'amber'   },
  'future-phase':   { label: 'Future Phase',   symbol: '◔', nodeOpacity: 0.50, edgeOpacity: 0.25, listOpacity: 0.60, dashArray: '3 3',    colorKey: 'violet'  },
  'not-applicable': { label: 'Not Applicable', symbol: '○', nodeOpacity: 0.22, edgeOpacity: 0,    listOpacity: 0.38, dashArray: '2 4',    colorKey: 'rose'    },
};

/* ─── Pattern Elements ────────────────────────────────────────────────── */

export interface PatternElement {
  id: string;
  label: string;
  icon: string;
  category: string;
  description: string;
  applicability: ApplicabilityStatus;
  quantity: number;
  deploymentRole: string;
  networkType: string;
  securityAttributes: string;
  performanceAttributes: string;
  resiliencyAttributes: string;
  managementModel: 'managed' | 'co-managed' | 'customer-managed';
  providerModel: string;
  implementationPhase: 0 | 1 | 2 | 3;
  customerNotes: string;
  /* visual placement (used by diagrams) */
  x: number;
  y: number;
  group: string;
  tier?: number;
}

/** Customer-editable overrides — every field is optional. */
export type PatternOverride = Partial<Omit<PatternElement, 'id' | 'x' | 'y' | 'group' | 'tier'>>;

/* ─── Use Case Templates ──────────────────────────────────────────────── */

export interface RequirementItem {
  id: string;
  label: string;
  category: string;
  critical: boolean;
}

export type AccentColor = 'cyan' | 'violet' | 'emerald' | 'rose';

export interface UseCaseTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: AccentColor;
  requirementsSummary: string;
  considerations: string[];
  architectureCharacteristics: { label: string; value: string; icon: string }[];
  applicabilityTags: string[];
  businessDrivers: string[];
  painPoints: string[];
  requirementChecklist: RequirementItem[];
  diagramNodes: { label: string; icon: string; x: number; y: number; group: string }[];
  diagramEdges: [number, number][];
  recommendedWhen: string[];
  notIdealWhen: string[];
}

/* ─── GTT Future-State Solutions ──────────────────────────────────────── */

export interface GttSolution {
  useCaseId: string;
  title: string;
  solutionName: string;
  icon: string;
  accentColor: AccentColor;
  narrative: string;
  architectureHighlights: { label: string; detail: string; icon: string }[];
  orchestration: { title: string; points: string[] };
  connectivityModel: { title: string; underlay: string[]; overlay: string[]; model: string };
  integrations: { cloud: string[]; security: string[]; edge: string[]; api: string[] };
  keyValueBullets: string[];
  diagramNodes: { label: string; icon: string; x: number; y: number; group: string; tier: number }[];
  diagramEdges: [number, number, string?][];
  differentiators: { title: string; detail: string }[];
  implementationNotes: { phase: string; title: string; detail: string; duration: string }[];
}

/* ─── Designation ─────────────────────────────────────────────────────── */

export type Designation = 'primary' | 'secondary' | 'not-selected' | null;

export const DESIGNATION_META: Record<string, {
  label: string; short: string;
  colorKey: 'emerald' | 'amber' | 'slate';
  symbol: string;
}> = {
  primary:        { label: 'Primary Use Case',  short: 'PRIMARY',   colorKey: 'emerald', symbol: '★' },
  secondary:      { label: 'Secondary Use Case', short: 'SECONDARY', colorKey: 'amber',   symbol: '◆' },
  'not-selected': { label: 'Not Selected',       short: 'EXCLUDED',  colorKey: 'slate',   symbol: '—' },
};

export const FIT_DIMENSIONS = [
  'Strategic Alignment',
  'Technical Readiness',
  'Budget Fit',
  'Timeline Feasibility',
  'Organizational Readiness',
] as const;

/* ─── Customer Specifics ──────────────────────────────────────────────── */

export interface CustomerSpecifics {
  branchCount: number;
  hqCount: number;
  dataCenterCount: number;
  cloudProviders: string[];
  diaRequired: boolean;
  mplsRetained: boolean;
  sdwanOverlay: boolean;
  saseRequired: boolean;
  edgeComputeRequired: boolean;
  aiConnectivityRequired: boolean;
  thirdPartyServicesNeeded: boolean;
  segmentationRequirement: string;
  redundancyRequirement: string;
  operationsModel: 'managed' | 'co-managed' | 'customer-managed';
}

export const DEFAULT_CUSTOMER_SPECIFICS: CustomerSpecifics = {
  branchCount: 0,
  hqCount: 0,
  dataCenterCount: 0,
  cloudProviders: [],
  diaRequired: false,
  mplsRetained: false,
  sdwanOverlay: false,
  saseRequired: false,
  edgeComputeRequired: false,
  aiConnectivityRequired: false,
  thirdPartyServicesNeeded: false,
  segmentationRequirement: '',
  redundancyRequirement: '',
  operationsModel: 'managed',
};

/* ─── Shared Constants ────────────────────────────────────────────────── */

export const PHASE_LABELS: Record<number, string> = {
  0: 'Not Assigned',
  1: 'Phase 1 — Quick Wins',
  2: 'Phase 2 — Foundation',
  3: 'Phase 3 — Scale',
};

export const MANAGEMENT_MODELS = ['managed', 'co-managed', 'customer-managed'] as const;

export const CLOUD_PROVIDER_OPTIONS = ['AWS', 'Azure', 'GCP', 'Oracle', 'IBM', 'Other'] as const;

/* ─── Helpers ─────────────────────────────────────────────────────────── */

export const isElementActive = (el: PatternElement): boolean =>
  el.applicability === 'active' || el.applicability === 'optional';

export const shouldDrawEdges = (el: PatternElement): boolean =>
  el.applicability !== 'not-applicable';
