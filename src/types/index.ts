/** Core data model for Network Transformation Studio */

export interface Customer {
  name: string;
  shortName: string;
  industry: string;
  revenue: string;
  employees: string;
  sites: number;
  countries: number;
  regions: string[];
  workshopDate: string;
  workshopId: string;
  workshopLead: string;
  workshopLeadTitle: string;
  stakeholders: Stakeholder[];
}

export interface Stakeholder {
  name: string;
  title: string;
  focus: string;
  avatar: string;
  tier: 'executive' | 'leader' | 'technical';
}

export interface MaturityDomain {
  key: string;
  label: string;
  short: string;
}

export interface MaturityScore {
  current: number;
  target: number;
}

export type MaturityMap = Record<string, MaturityScore>;

export interface PainItem {
  id: string;
  label: string;
  desc: string;
  icon: string;
  cat: string;
}

export type PainScores = Record<string, number>;

export interface PaletteItem {
  type: string;
  label: string;
  icon: string;
  cat: string;
  color: string;
  defaultMeta?: Partial<NodeMeta>;
}

export interface NodeMeta {
  name: string;
  role: string;
  status: string;
  owner: string;
  notes: string;
  criticality: string;
  phase: number;
}

export interface ArchNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  meta: NodeMeta;
}

export interface ArchEdge {
  from: string;
  to: string;
}

export interface ArchTemplate {
  label: string;
  desc: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export interface RoadmapTrack {
  id: string;
  label: string;
  color: string;
}

export interface RoadmapItem {
  track: string;
  phase: number;
  label: string;
  type: 'quickwin' | 'milestone';
}

export interface WorkshopNote {
  id: number;
  type: 'note' | 'assumption' | 'question' | 'decision';
  text: string;
}

export interface NavItem {
  id: number;
  label: string;
  short: string;
  icon: string;
  phase: number | null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Architecture Studio — GTT solution design types
   ═══════════════════════════════════════════════════════════════════════════ */

export interface GttUseCaseTemplate {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  category: 'WAN' | 'Security' | 'Cloud' | 'Edge' | 'Resilience' | 'Compliance';
  defaultRequirements: Partial<CustomerRequirements>;
  recommendedPatternIds: string[];
}

export interface CustomerRequirements {
  customerName: string;
  industry: string;
  regions: ('North America' | 'EMEA' | 'APAC' | 'LATAM')[];
  siteCount: number;
  siteTypes: string[];
  bandwidthTier: 'standard' | 'high' | 'premium';
  resiliencyTier: 'basic' | 'enhanced' | 'mission-critical';
  securityNeeds: string[];
  complianceNeeds: string[];
  cloudEnvironments: string[];
  internetBreakout: 'centralized' | 'regional' | 'local';
  dataSovereignty: boolean;
  localCompute: boolean;
  managedServiceLevel: 'co-managed' | 'fully-managed' | 'advisory';
  notes: string;
}

export interface PatternElement {
  id: string;
  label: string;
  icon: string;
  category: 'site' | 'transport' | 'backbone' | 'security' | 'cloud' | 'edge' | 'operations' | 'user';
  placementZone: 'branch' | 'access' | 'backbone' | 'security' | 'cloud-vdc' | 'user-app' | 'ops';
  gttDifferentiator: 'backbone' | 'envision' | 'envision-edge' | 'integrated-security' | 'global-consistency' | 'vdc' | null;
  applicable: boolean;
  enabled: boolean;
  quantity: number;
  editableProps: Record<string, string | number | boolean>;
  customerNotes: string;
  narrativeImpact: string;
}

export interface ArchitectureZone {
  id: string;
  label: string;
  color: string;
  yOrder: number;
}

export interface GttDifferentiatorOverlay {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
  affectedZones: string[];
}

export interface GttService {
  id: string;
  product: string;
  family: 'Connectivity' | 'Security' | 'Cloud' | 'Edge' | 'Managed' | 'Voice';
  icon: string;
  color: string;
  inPlace: boolean;
  status: 'active' | 'pending' | 'trial' | 'not-deployed';
  sites: number | null;
  coverage: string;
  contractEnd: string;
  notes: string;
  expandable: boolean;
}
