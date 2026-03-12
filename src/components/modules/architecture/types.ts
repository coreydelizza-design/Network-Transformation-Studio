/* ═══════════════════════════════════════════════════════════════════════════
   PATTERN ELEMENT TYPES — Architecture Studio
   Shared types for editable architecture pattern elements.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PatternElement {
  id: string;
  label: string;
  icon: string;
  category: string;
  description: string;
  applicable: boolean;
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

/** Customer-specific toggle flags that apply across the engagement. */
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

export const PHASE_LABELS: Record<number, string> = {
  0: 'Not Assigned',
  1: 'Phase 1 — Quick Wins',
  2: 'Phase 2 — Foundation',
  3: 'Phase 3 — Scale',
};

export const MANAGEMENT_MODELS = ['managed', 'co-managed', 'customer-managed'] as const;

export const CLOUD_PROVIDER_OPTIONS = ['AWS', 'Azure', 'GCP', 'Oracle', 'IBM', 'Other'] as const;
