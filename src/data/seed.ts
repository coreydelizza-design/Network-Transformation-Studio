import type {
  Customer, MaturityDomain, MaturityMap, PainItem,
  RoadmapTrack, RoadmapItem, NavItem,
} from '../types';

/* ═══════════════════════════════════════════════════
   CUSTOMER PROFILE
   ═══════════════════════════════════════════════════ */
export const CUSTOMER: Customer = {
  name: 'Meridian Financial Group',
  shortName: 'MFG',
  industry: 'Financial Services & Insurance',
  revenue: '$4.2B',
  employees: '12,500+',
  sites: 187,
  countries: 14,
  regions: ['North America', 'EMEA', 'APAC'],
  workshopDate: 'March 11, 2026',
  workshopId: 'WS-2026-0311-MFG',
  workshopLead: 'Sarah Chen',
  workshopLeadTitle: 'Principal Solutions Architect',
  stakeholders: [
    { name: 'James Morrison', title: 'Chief Information Officer', focus: 'Digital transformation & modernization mandate', avatar: 'JM', tier: 'executive' },
    { name: 'Dr. Lisa Park', title: 'Chief Information Security Officer', focus: 'Zero trust migration & regulatory compliance', avatar: 'LP', tier: 'executive' },
    { name: 'Robert Tanaka', title: 'VP Network & Infrastructure', focus: 'Network modernization & carrier consolidation', avatar: 'RT', tier: 'leader' },
    { name: 'Maria Santos', title: 'VP IT Operations', focus: 'Service delivery & operational efficiency', avatar: 'MS', tier: 'leader' },
    { name: 'David Kim', title: 'Director, Cloud Engineering', focus: 'Multi-cloud strategy & connectivity', avatar: 'DK', tier: 'technical' },
    { name: 'Aisha Patel', title: 'Head of IT Procurement', focus: 'Vendor consolidation & TCO optimization', avatar: 'AP', tier: 'technical' },
  ],
};

/* ═══════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════ */
export const NAV: NavItem[] = [
  { id: 0, label: 'Command Center', short: 'Command', icon: '◆', phase: null },
  { id: 1, label: 'Executive Context', short: 'Context', icon: '◎', phase: 1 },
  { id: 2, label: 'Current-State Estate', short: 'Estate', icon: '▦', phase: 2 },
  { id: 3, label: 'Pain & Constraints', short: 'Pain', icon: '▲', phase: 3 },
  { id: 4, label: 'Maturity Assessment', short: 'Maturity', icon: '◉', phase: 4 },
  { id: 5, label: 'Future-State Vision', short: 'Vision', icon: '◈', phase: 5 },
  { id: 6, label: 'Architecture Studio', short: 'Studio', icon: '✦', phase: 6 },
  { id: 7, label: 'Value & Tradeoffs', short: 'Value', icon: '⬡', phase: 7 },
  { id: 8, label: 'Transformation Roadmap', short: 'Roadmap', icon: '▸', phase: 8 },
  { id: 9, label: 'Workshop Deliverables', short: 'Deliver', icon: '◧', phase: 9 },
];

/* ═══════════════════════════════════════════════════
   MATURITY MODEL
   ═══════════════════════════════════════════════════ */
export const MATURITY_DOMAINS: MaturityDomain[] = [
  { key: 'netArch', label: 'Network Architecture', short: 'Network' },
  { key: 'secArch', label: 'Security Architecture', short: 'Security' },
  { key: 'cloudConn', label: 'Cloud Connectivity', short: 'Cloud' },
  { key: 'resilience', label: 'Resilience & Availability', short: 'Resilience' },
  { key: 'observability', label: 'Observability & Analytics', short: 'Observability' },
  { key: 'automation', label: 'Automation & Orchestration', short: 'Automation' },
  { key: 'branchStd', label: 'Branch Standardization', short: 'Branch' },
  { key: 'supportModel', label: 'Support Operating Model', short: 'Support' },
  { key: 'governance', label: 'Governance & Compliance', short: 'Governance' },
  { key: 'aiEdge', label: 'AI & Edge Readiness', short: 'AI/Edge' },
];

export const INIT_MATURITY: MaturityMap = {
  netArch: { current: 2, target: 4 }, secArch: { current: 2, target: 5 },
  cloudConn: { current: 3, target: 5 }, resilience: { current: 3, target: 4 },
  observability: { current: 1, target: 4 }, automation: { current: 1, target: 4 },
  branchStd: { current: 2, target: 5 }, supportModel: { current: 2, target: 4 },
  governance: { current: 3, target: 4 }, aiEdge: { current: 1, target: 3 },
};

/* ═══════════════════════════════════════════════════
   PAIN POINTS
   ═══════════════════════════════════════════════════ */
export const PAIN_ITEMS: PainItem[] = [
  { id: 'outage', label: 'Outage Frequency', desc: 'Unplanned downtime events per quarter', icon: '⚡', cat: 'Reliability' },
  { id: 'mttr', label: 'Mean Time to Resolve', desc: 'Hours to restore service after incident', icon: '⏱', cat: 'Reliability' },
  { id: 'cloudPerf', label: 'Cloud Application Performance', desc: 'Latency and throughput to SaaS/IaaS', icon: '☁', cat: 'Performance' },
  { id: 'secFrag', label: 'Security Tool Fragmentation', desc: 'Overlapping, siloed security platforms', icon: '🛡', cat: 'Security' },
  { id: 'carrierSprawl', label: 'Carrier & Circuit Sprawl', desc: 'Multi-vendor complexity and cost leakage', icon: '🔗', cat: 'Operations' },
  { id: 'visibility', label: 'Network Visibility Gaps', desc: 'Blind spots in traffic and performance', icon: '👁', cat: 'Operations' },
  { id: 'deployDelay', label: 'Site Deployment Velocity', desc: 'Weeks/months to provision new locations', icon: '🚀', cat: 'Agility' },
  { id: 'maIntegration', label: 'M&A Integration Friction', desc: 'Time and complexity to integrate acquisitions', icon: '🏢', cat: 'Strategic' },
  { id: 'ticketVolume', label: 'Ticket Volume & Escalations', desc: 'Operational overhead from manual processes', icon: '🎫', cat: 'Operations' },
  { id: 'manualOps', label: 'Manual Operations Burden', desc: 'CLI-driven changes, no automation pipeline', icon: '🔧', cat: 'Operations' },
  { id: 'vendorPerf', label: 'Vendor SLA Performance', desc: 'Missed SLAs and accountability gaps', icon: '📉', cat: 'Vendor' },
];

export const INIT_PAIN_SCORES: Record<string, number> = {
  outage: 8, mttr: 7, cloudPerf: 6, secFrag: 9, carrierSprawl: 7,
  visibility: 5, deployDelay: 6, maIntegration: 8, ticketVolume: 4, manualOps: 7, vendorPerf: 3,
};

/* ═══════════════════════════════════════════════════
   ROADMAP
   ═══════════════════════════════════════════════════ */
export const ROADMAP_TRACKS: RoadmapTrack[] = [
  { id: 'network', label: 'Network Fabric', color: '#3b82f6' },
  { id: 'security', label: 'Security & Zero Trust', color: '#fb7185' },
  { id: 'cloud', label: 'Cloud Connectivity', color: '#22d3ee' },
  { id: 'operations', label: 'Operations & AIOps', color: '#fbbf24' },
  { id: 'support', label: 'Support Model', color: '#a78bfa' },
  { id: 'governance', label: 'Governance & Policy', color: '#34d399' },
  { id: 'branch', label: 'Branch Rollout', color: '#fb923c' },
  { id: 'legacy', label: 'Legacy Retirement', color: '#64748b' },
  { id: 'observability', label: 'Observability Stack', color: '#eab308' },
  { id: 'automation', label: 'Automation Pipeline', color: '#a3e635' },
];

export const SEED_ROADMAP: RoadmapItem[] = [
  { track: 'network', phase: 0, label: 'SD-WAN PoC — 5 pilot branches', type: 'quickwin' },
  { track: 'network', phase: 1, label: 'Regional SD-WAN fabric (NA)', type: 'milestone' },
  { track: 'network', phase: 1, label: 'EMEA & APAC extension', type: 'milestone' },
  { track: 'network', phase: 2, label: 'Full mesh + DIA migration', type: 'milestone' },
  { track: 'security', phase: 0, label: 'SASE/SSE PoC (Zscaler)', type: 'quickwin' },
  { track: 'security', phase: 0, label: 'Zero trust blueprint', type: 'quickwin' },
  { track: 'security', phase: 1, label: 'ZT identity & device trust', type: 'milestone' },
  { track: 'security', phase: 2, label: 'Unified SASE + XDR', type: 'milestone' },
  { track: 'cloud', phase: 0, label: 'Cloud interconnect audit', type: 'quickwin' },
  { track: 'cloud', phase: 1, label: 'Multi-cloud NaaS fabric', type: 'milestone' },
  { track: 'cloud', phase: 2, label: 'Cloud-native net functions', type: 'milestone' },
  { track: 'operations', phase: 0, label: 'Runbook automation (top 20)', type: 'quickwin' },
  { track: 'operations', phase: 1, label: 'AIOps event correlation', type: 'milestone' },
  { track: 'operations', phase: 2, label: 'Self-healing automation', type: 'milestone' },
  { track: 'support', phase: 1, label: 'Managed services onboarding', type: 'milestone' },
  { track: 'support', phase: 2, label: 'Outcome-based SLA model', type: 'milestone' },
  { track: 'governance', phase: 0, label: 'Policy-as-code framework', type: 'quickwin' },
  { track: 'governance', phase: 1, label: 'Automated compliance', type: 'milestone' },
  { track: 'branch', phase: 1, label: 'Golden branch template', type: 'milestone' },
  { track: 'branch', phase: 2, label: '187-site standardization', type: 'milestone' },
  { track: 'legacy', phase: 0, label: 'Legacy circuit audit', type: 'quickwin' },
  { track: 'legacy', phase: 1, label: 'MPLS offload wave 1', type: 'milestone' },
  { track: 'legacy', phase: 2, label: 'Full legacy decommission', type: 'milestone' },
  { track: 'observability', phase: 0, label: 'Unified dashboard', type: 'quickwin' },
  { track: 'observability', phase: 1, label: 'Full-stack DEM + NPM', type: 'milestone' },
  { track: 'automation', phase: 1, label: 'Network-as-code CI/CD', type: 'milestone' },
  { track: 'automation', phase: 2, label: 'Intent-based orchestration', type: 'milestone' },
];
