import type {
  Customer, MaturityDomain, MaturityMap, PainItem, PaletteItem,
  RoadmapTrack, RoadmapItem, ArchTemplate, ArchNode, ArchEdge, NavItem, NodeMeta,
  GttUseCaseTemplate, PatternElement, ArchitectureZone,
  GttDifferentiatorOverlay, CustomerRequirements,
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
   ARCHITECTURE PALETTE
   ═══════════════════════════════════════════════════ */
export const PALETTE: PaletteItem[] = [
  { type: 'hq', label: 'Headquarters', icon: '🏛', cat: 'Sites', color: '#3b82f6', defaultMeta: { role: 'Primary HQ', status: 'active', criticality: 'critical' } },
  { type: 'branch', label: 'Branch Office', icon: '🏢', cat: 'Sites', color: '#6366f1', defaultMeta: { role: 'Regional branch', status: 'active', criticality: 'medium' } },
  { type: 'retail', label: 'Retail / Advisory', icon: '🏪', cat: 'Sites', color: '#8b5cf6', defaultMeta: { role: 'Customer-facing site', status: 'active', criticality: 'medium' } },
  { type: 'plant', label: 'Manufacturing', icon: '🏭', cat: 'Sites', color: '#a855f7', defaultMeta: { role: 'Production facility', status: 'active', criticality: 'high' } },
  { type: 'warehouse', label: 'Warehouse / Logistics', icon: '📦', cat: 'Sites', color: '#c084fc', defaultMeta: { role: 'Distribution hub', status: 'active', criticality: 'medium' } },
  { type: 'callcenter', label: 'Contact Center', icon: '📞', cat: 'Sites', color: '#e879f9', defaultMeta: { role: 'Customer support', status: 'active', criticality: 'high' } },
  { type: 'sdwan', label: 'SD-WAN Node', icon: '📡', cat: 'Network', color: '#f97316', defaultMeta: { role: 'SD-WAN edge device', status: 'active', criticality: 'high' } },
  { type: 'router', label: 'Core Router', icon: '🔀', cat: 'Network', color: '#f59e0b', defaultMeta: { role: 'Core routing', status: 'active', criticality: 'critical' } },
  { type: 'lb', label: 'Load Balancer', icon: '⚖️', cat: 'Network', color: '#ec4899', defaultMeta: { role: 'Traffic distribution', status: 'active', criticality: 'high' } },
  { type: 'vpn', label: 'VPN Gateway', icon: '🔐', cat: 'Network', color: '#f43f5e', defaultMeta: { role: 'Encrypted tunnel', status: 'active', criticality: 'high' } },
  { type: 'mpls', label: 'MPLS PE', icon: '🔗', cat: 'Network', color: '#d97706', defaultMeta: { role: 'MPLS provider edge', status: 'decommission', criticality: 'medium' } },
  { type: 'internet', label: 'Internet Edge', icon: '🌐', cat: 'Network', color: '#10b981', defaultMeta: { role: 'Internet breakout', status: 'active', criticality: 'high' } },
  { type: 'firewall', label: 'Firewall / NGFW', icon: '🧱', cat: 'Security', color: '#ef4444', defaultMeta: { role: 'Perimeter security', status: 'active', criticality: 'critical' } },
  { type: 'sase', label: 'SASE / SSE', icon: '🔒', cat: 'Security', color: '#dc2626', defaultMeta: { role: 'Secure access service edge', status: 'planned', criticality: 'critical' } },
  { type: 'ztna', label: 'ZTNA Broker', icon: '🛡️', cat: 'Security', color: '#b91c1c', defaultMeta: { role: 'Zero trust access', status: 'planned', criticality: 'critical' } },
  { type: 'waf', label: 'WAF', icon: '🌊', cat: 'Security', color: '#fca5a5', defaultMeta: { role: 'Web application firewall', status: 'active', criticality: 'high' } },
  { type: 'cloud_aws', label: 'AWS Region', icon: '☁️', cat: 'Cloud', color: '#f97316', defaultMeta: { role: 'AWS cloud region', status: 'active', criticality: 'critical' } },
  { type: 'cloud_azure', label: 'Azure Region', icon: '☁️', cat: 'Cloud', color: '#3b82f6', defaultMeta: { role: 'Azure cloud region', status: 'active', criticality: 'critical' } },
  { type: 'cloud_gcp', label: 'GCP Region', icon: '☁️', cat: 'Cloud', color: '#22d3ee', defaultMeta: { role: 'GCP cloud region', status: 'active', criticality: 'high' } },
  { type: 'saas', label: 'SaaS Platform', icon: '💻', cat: 'Cloud', color: '#06b6d4', defaultMeta: { role: 'SaaS application', status: 'active', criticality: 'high' } },
  { type: 'colo', label: 'Colocation', icon: '🔌', cat: 'Cloud', color: '#2dd4bf', defaultMeta: { role: 'Colo facility', status: 'active', criticality: 'high' } },
  { type: 'dc', label: 'Data Center', icon: '🖥️', cat: 'Cloud', color: '#14b8a6', defaultMeta: { role: 'Enterprise data center', status: 'active', criticality: 'critical' } },
  { type: 'ai_edge', label: 'AI / Edge Node', icon: '🤖', cat: 'Edge / Compute', color: '#84cc16', defaultMeta: { role: 'Edge compute / AI', status: 'planned', criticality: 'medium' } },
  { type: 'iot_gw', label: 'IoT Gateway', icon: '📲', cat: 'Edge / Compute', color: '#65a30d', defaultMeta: { role: 'IoT aggregation', status: 'planned', criticality: 'medium' } },
  { type: 'vdc', label: 'Virtual Data Center', icon: '💾', cat: 'Edge / Compute', color: '#4ade80', defaultMeta: { role: 'Virtual DC / VPC', status: 'active', criticality: 'high' } },
  { type: 'cdn', label: 'CDN / Edge Cache', icon: '⚡', cat: 'Edge / Compute', color: '#a3e635', defaultMeta: { role: 'Content delivery', status: 'active', criticality: 'medium' } },
  { type: 'noc', label: 'NOC / SOC', icon: '👁️', cat: 'Operations', color: '#eab308', defaultMeta: { role: 'Operations center', status: 'active', criticality: 'high' } },
  { type: 'observability', label: 'Observability Stack', icon: '📊', cat: 'Operations', color: '#facc15', defaultMeta: { role: 'Monitoring & analytics', status: 'active', criticality: 'high' } },
  { type: 'automation', label: 'Automation Engine', icon: '⚙️', cat: 'Operations', color: '#a3a3a3', defaultMeta: { role: 'Orchestration', status: 'planned', criticality: 'medium' } },
  { type: 'managed', label: 'Managed Service', icon: '🛠️', cat: 'Operations', color: '#94a3b8', defaultMeta: { role: 'MSP layer', status: 'planned', criticality: 'medium' } },
];

export const PALETTE_CATS = ['Sites', 'Network', 'Security', 'Cloud', 'Edge / Compute', 'Operations'];

export const EMPTY_META: NodeMeta = { name: '', role: '', status: 'active', owner: '', notes: '', criticality: 'medium', phase: 0 };

export const palItem = (type: string) => PALETTE.find(p => p.type === type) || PALETTE[0];

/* ═══════════════════════════════════════════════════
   ARCHITECTURE TEMPLATES
   ═══════════════════════════════════════════════════ */
const currentNodes: ArchNode[] = [
  { id: 't1', type: 'hq', label: 'NYC Headquarters', x: 440, y: 50, meta: { name: 'NYC Headquarters', role: 'Primary HQ — 2,500 users', status: 'active', owner: 'Robert Tanaka', notes: 'Dual ISP, MPLS primary', criticality: 'critical', phase: 0 } },
  { id: 't2', type: 'dc', label: 'East Data Center', x: 180, y: 200, meta: { name: 'East Data Center', role: 'Primary DC — Equinix NY5', status: 'active', owner: 'Robert Tanaka', notes: 'Core compute + storage', criticality: 'critical', phase: 0 } },
  { id: 't3', type: 'dc', label: 'West Data Center', x: 180, y: 340, meta: { name: 'West Data Center', role: 'DR site — Equinix SV5', status: 'active', owner: 'Robert Tanaka', notes: 'Disaster recovery', criticality: 'high', phase: 0 } },
  { id: 't4', type: 'firewall', label: 'Core FW Cluster', x: 440, y: 200, meta: { name: 'Core Firewall Cluster', role: 'PA-5260 HA pair', status: 'active', owner: 'Dr. Lisa Park', notes: 'Primary perimeter', criticality: 'critical', phase: 0 } },
  { id: 't5', type: 'cloud_aws', label: 'AWS us-east-1', x: 700, y: 130, meta: { name: 'AWS us-east-1', role: 'Primary cloud region', status: 'active', owner: 'David Kim', notes: 'Direct Connect 10G', criticality: 'critical', phase: 0 } },
  { id: 't6', type: 'cloud_azure', label: 'Azure East US', x: 700, y: 280, meta: { name: 'Azure East US', role: 'Secondary cloud', status: 'active', owner: 'David Kim', notes: 'ExpressRoute 5G', criticality: 'high', phase: 0 } },
  { id: 't7', type: 'branch', label: 'NA Branches (52)', x: 60, y: 460, meta: { name: 'NA Branch Offices', role: '52 sites — MPLS + Internet', status: 'active', owner: 'Robert Tanaka', notes: 'Mixed connectivity', criticality: 'high', phase: 0 } },
  { id: 't8', type: 'branch', label: 'EMEA Branches (24)', x: 280, y: 460, meta: { name: 'EMEA Branches', role: '24 sites', status: 'active', owner: 'Robert Tanaka', notes: 'London hub', criticality: 'high', phase: 0 } },
  { id: 't9', type: 'branch', label: 'APAC Branches (11)', x: 500, y: 460, meta: { name: 'APAC Branches', role: '11 sites', status: 'active', owner: 'Robert Tanaka', notes: 'Singapore hub', criticality: 'medium', phase: 0 } },
  { id: 't10', type: 'sdwan', label: 'SD-WAN Controller', x: 280, y: 330, meta: { name: 'Viptela vManage', role: 'SD-WAN orchestration', status: 'active', owner: 'Robert Tanaka', notes: 'Partial — 34 sites', criticality: 'high', phase: 0 } },
  { id: 't11', type: 'sase', label: 'Zscaler ZIA/ZPA', x: 560, y: 360, meta: { name: 'Zscaler', role: 'Cloud security — partial', status: 'review', owner: 'Dr. Lisa Park', notes: '34 sites enrolled', criticality: 'high', phase: 0 } },
  { id: 't12', type: 'firewall', label: 'Cisco ASA (Legacy)', x: 60, y: 330, meta: { name: 'Cisco ASA 5500-X', role: 'Legacy branch FW', status: 'at-risk', owner: 'Dr. Lisa Park', notes: '45 units — EoS Q3 2026!', criticality: 'critical', phase: 0 } },
  { id: 't13', type: 'mpls', label: 'AT&T MPLS Core', x: 160, y: 460, meta: { name: 'AT&T MPLS', role: 'Primary WAN underlay', status: 'decommission', owner: 'Aisha Patel', notes: '78 circuits', criticality: 'high', phase: 0 } },
  { id: 't14', type: 'observability', label: 'SolarWinds + PRTG', x: 720, y: 440, meta: { name: 'Legacy Monitoring', role: 'Fragmented monitoring', status: 'at-risk', owner: 'Maria Santos', notes: 'No cloud visibility', criticality: 'medium', phase: 0 } },
  { id: 't15', type: 'saas', label: 'Salesforce / M365', x: 840, y: 200, meta: { name: 'SaaS Platforms', role: 'Salesforce + M365', status: 'active', owner: 'David Kim', notes: 'Performance complaints', criticality: 'high', phase: 0 } },
];

const currentEdges: ArchEdge[] = [
  { from: 't1', to: 't4' }, { from: 't4', to: 't2' }, { from: 't4', to: 't5' },
  { from: 't4', to: 't6' }, { from: 't2', to: 't3' }, { from: 't7', to: 't13' },
  { from: 't8', to: 't13' }, { from: 't13', to: 't4' }, { from: 't10', to: 't4' },
  { from: 't7', to: 't10' }, { from: 't8', to: 't10' }, { from: 't9', to: 't11' },
  { from: 't11', to: 't5' }, { from: 't11', to: 't6' }, { from: 't5', to: 't15' },
  { from: 't6', to: 't15' }, { from: 't12', to: 't7' }, { from: 't14', to: 't4' },
];

export const TEMPLATES: Record<string, ArchTemplate> = {
  blank: { label: 'Blank Canvas', desc: 'Start from scratch', nodes: [], edges: [] },
  current: { label: 'Meridian Current-State', desc: 'Pre-loaded estate mapping', nodes: currentNodes, edges: currentEdges },
  future: {
    label: 'Target-State Template', desc: 'Cloud-first SASE architecture',
    nodes: [
      { id: 'f1', type: 'hq', label: 'NYC HQ (Modernized)', x: 420, y: 50, meta: { name: 'NYC HQ', role: 'SASE-enabled HQ', status: 'planned', owner: 'Robert Tanaka', notes: 'Direct-to-cloud', criticality: 'critical', phase: 2 } },
      { id: 'f2', type: 'sase', label: 'Global SASE Fabric', x: 420, y: 200, meta: { name: 'Zscaler ZT Exchange', role: 'Unified SASE', status: 'planned', owner: 'Dr. Lisa Park', notes: 'Replaces legacy FW', criticality: 'critical', phase: 1 } },
      { id: 'f3', type: 'sdwan', label: 'SD-WAN Fabric', x: 180, y: 340, meta: { name: 'SD-WAN Overlay', role: 'Universal underlay', status: 'planned', owner: 'Robert Tanaka', notes: 'All 187 sites', criticality: 'critical', phase: 2 } },
      { id: 'f4', type: 'cloud_aws', label: 'AWS Multi-Region', x: 660, y: 120, meta: { name: 'AWS Multi-Region', role: 'Primary cloud', status: 'planned', owner: 'David Kim', notes: 'NaaS interconnect', criticality: 'critical', phase: 2 } },
      { id: 'f5', type: 'cloud_azure', label: 'Azure Multi-Region', x: 660, y: 260, meta: { name: 'Azure', role: 'Secondary + M365', status: 'planned', owner: 'David Kim', notes: 'ExpressRoute', criticality: 'critical', phase: 2 } },
      { id: 'f6', type: 'cloud_gcp', label: 'GCP us-central', x: 660, y: 400, meta: { name: 'GCP Region', role: 'AI/ML workloads', status: 'planned', owner: 'David Kim', notes: 'Cloud Interconnect', criticality: 'high', phase: 3 } },
      { id: 'f7', type: 'branch', label: 'Standardized Branches', x: 60, y: 460, meta: { name: '187 Branches', role: 'Golden template', status: 'planned', owner: 'Robert Tanaka', notes: 'SD-WAN + SASE', criticality: 'high', phase: 2 } },
      { id: 'f8', type: 'observability', label: 'Full-Stack DEM', x: 420, y: 450, meta: { name: 'Unified Observability', role: 'DEM + NPM + AIOps', status: 'planned', owner: 'Maria Santos', notes: 'ThousandEyes + Datadog', criticality: 'high', phase: 2 } },
      { id: 'f9', type: 'ai_edge', label: 'Edge AI Nodes', x: 180, y: 460, meta: { name: 'Edge AI Compute', role: 'Distributed inference', status: 'planned', owner: 'David Kim', notes: 'Phase 3', criticality: 'medium', phase: 3 } },
      { id: 'f10', type: 'automation', label: 'NetOps Automation', x: 660, y: 460, meta: { name: 'Network-as-Code', role: 'CI/CD pipeline', status: 'planned', owner: 'Maria Santos', notes: 'Terraform + Ansible', criticality: 'high', phase: 2 } },
      { id: 'f11', type: 'ztna', label: 'ZTNA Universal', x: 230, y: 200, meta: { name: 'Zero Trust Access', role: 'Identity-first access', status: 'planned', owner: 'Dr. Lisa Park', notes: 'Replaces VPN', criticality: 'critical', phase: 1 } },
    ],
    edges: [
      { from: 'f1', to: 'f2' }, { from: 'f2', to: 'f4' }, { from: 'f2', to: 'f5' },
      { from: 'f2', to: 'f6' }, { from: 'f7', to: 'f3' }, { from: 'f3', to: 'f2' },
      { from: 'f11', to: 'f2' }, { from: 'f7', to: 'f9' }, { from: 'f8', to: 'f2' },
      { from: 'f8', to: 'f3' }, { from: 'f10', to: 'f3' }, { from: 'f10', to: 'f2' },
      { from: 'f1', to: 'f11' },
    ],
  },
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

/* ═══════════════════════════════════════════════════
   GTT USE CASE TEMPLATES
   ═══════════════════════════════════════════════════ */
export const GTT_USE_CASE_TEMPLATES: GttUseCaseTemplate[] = [
  {
    id: 'global-sdwan',
    label: 'Global SD-WAN Transformation',
    icon: '🌐',
    color: '#3b82f6',
    description: 'Replace legacy MPLS with a global SD-WAN fabric spanning all regions. Leverage GTT Tier-1 backbone for deterministic underlay performance and Envision for unified orchestration and analytics.',
    category: 'WAN',
    defaultRequirements: {
      bandwidthTier: 'high',
      resiliencyTier: 'enhanced',
      internetBreakout: 'regional',
      managedServiceLevel: 'fully-managed',
    },
    recommendedPatternIds: ['sd-wan', 'gtt-backbone', 'envision-edge', 'managed-noc'],
  },
  {
    id: 'secure-branch',
    label: 'Secure Branch Modernization',
    icon: '🏢',
    color: '#a78bfa',
    description: 'Standardize branch connectivity with integrated networking and security at every site. Deploy virtualized edge functions to consolidate appliances and enforce consistent security posture globally.',
    category: 'Edge',
    defaultRequirements: {
      bandwidthTier: 'standard',
      resiliencyTier: 'enhanced',
      securityNeeds: ['firewall', 'sse', 'ztna'],
      internetBreakout: 'local',
      managedServiceLevel: 'co-managed',
    },
    recommendedPatternIds: ['envision-edge', 'firewall', 'sse', 'sd-wan'],
  },
  {
    id: 'sase-sse',
    label: 'SASE / SSE Transformation',
    icon: '🛡',
    color: '#fb7185',
    description: 'Converge networking and security into a cloud-delivered SASE architecture. Eliminate backhauling, enforce zero-trust access policies, and gain unified visibility across all users and applications.',
    category: 'Security',
    defaultRequirements: {
      securityNeeds: ['sase', 'ztna', 'casb', 'swg', 'dlp'],
      internetBreakout: 'local',
      resiliencyTier: 'enhanced',
      managedServiceLevel: 'co-managed',
    },
    recommendedPatternIds: ['sase', 'ztna', 'casb', 'swg', 'dlp'],
  },
  {
    id: 'hybrid-cloud-vdc',
    label: 'Hybrid Cloud + VDC',
    icon: '☁',
    color: '#22d3ee',
    description: 'Build a hybrid cloud fabric connecting on-premises data centers to public cloud and GTT VDC. Deliver low-latency cloud on-ramps with consistent security policy and workload portability.',
    category: 'Cloud',
    defaultRequirements: {
      cloudEnvironments: ['aws', 'azure', 'vdc'],
      bandwidthTier: 'premium',
      resiliencyTier: 'mission-critical',
      internetBreakout: 'regional',
      managedServiceLevel: 'co-managed',
    },
    recommendedPatternIds: ['vdc', 'cloud-aws', 'cloud-azure', 'gtt-backbone', 'cloud-onramp'],
  },
  {
    id: 'retail-edge',
    label: 'Retail / Multi-site Edge Standardization',
    icon: '🏪',
    color: '#fb923c',
    description: 'Deploy a repeatable, zero-touch edge stack across hundreds of retail or distributed locations. Standardize connectivity, security, and local compute with centralized orchestration and rapid provisioning.',
    category: 'Edge',
    defaultRequirements: {
      siteTypes: ['retail', 'branch'],
      bandwidthTier: 'standard',
      resiliencyTier: 'basic',
      internetBreakout: 'local',
      managedServiceLevel: 'fully-managed',
    },
    recommendedPatternIds: ['envision-edge', 'sd-wan', 'lte-backup', 'local-compute'],
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing / Plant Connectivity',
    icon: '🏭',
    color: '#64748b',
    description: 'Connect industrial plants and manufacturing sites with segmented, resilient networking. Isolate OT from IT traffic, enforce strict access control, and support local compute for real-time process data.',
    category: 'Edge',
    defaultRequirements: {
      siteTypes: ['plant', 'hub', 'dc'],
      bandwidthTier: 'high',
      resiliencyTier: 'mission-critical',
      securityNeeds: ['firewall', 'ztna'],
      internetBreakout: 'regional',
      managedServiceLevel: 'co-managed',
    },
    recommendedPatternIds: ['envision-edge', 'local-compute', 'firewall', 'segmentation'],
  },
  {
    id: 'dc-exit',
    label: 'Data Center Exit / Cloud Migration',
    icon: '🔄',
    color: '#06b6d4',
    description: 'Migrate workloads out of owned or leased data centers to public cloud and GTT VDC. Re-architect connectivity to eliminate legacy cross-connects and deliver cloud-native network paths.',
    category: 'Cloud',
    defaultRequirements: {
      cloudEnvironments: ['aws', 'azure', 'vdc'],
      bandwidthTier: 'premium',
      resiliencyTier: 'enhanced',
      internetBreakout: 'regional',
      managedServiceLevel: 'fully-managed',
    },
    recommendedPatternIds: ['vdc', 'cloud-aws', 'cloud-azure', 'gtt-backbone', 'dia'],
  },
  {
    id: 'business-continuity',
    label: 'Business Continuity / Resiliency',
    icon: '🔒',
    color: '#34d399',
    description: 'Design a multi-path, multi-region resilient architecture that sustains operations through carrier failures, site outages, and cloud disruptions. Guarantee recovery-time objectives with automated failover.',
    category: 'Resilience',
    defaultRequirements: {
      resiliencyTier: 'mission-critical',
      bandwidthTier: 'high',
      internetBreakout: 'regional',
      managedServiceLevel: 'fully-managed',
    },
    recommendedPatternIds: ['gtt-backbone', 'dual-transport', 'lte-backup', 'vdc'],
  },
  {
    id: 'regulated-sovereignty',
    label: 'Regulated / Sovereignty-Sensitive Deployment',
    icon: '⚖',
    color: '#eab308',
    description: 'Deploy network and cloud infrastructure that meets strict data sovereignty, residency, and regulatory requirements. Ensure traffic stays in-region with compliant hosting and auditable security controls.',
    category: 'Compliance',
    defaultRequirements: {
      dataSovereignty: true,
      complianceNeeds: ['gdpr', 'sovereignty'],
      securityNeeds: ['firewall', 'soc'],
      resiliencyTier: 'enhanced',
      internetBreakout: 'regional',
      managedServiceLevel: 'co-managed',
    },
    recommendedPatternIds: ['vdc', 'firewall', 'segmentation', 'soc'],
  },
  {
    id: 'ai-edge',
    label: 'AI Edge / Local Processing',
    icon: '🤖',
    color: '#a3e635',
    description: 'Position compute and inference at the network edge for latency-sensitive AI and ML workloads. Leverage GTT backbone for model distribution and Envision Edge for orchestrated edge lifecycle management.',
    category: 'Edge',
    defaultRequirements: {
      localCompute: true,
      bandwidthTier: 'premium',
      resiliencyTier: 'enhanced',
      internetBreakout: 'local',
      managedServiceLevel: 'co-managed',
    },
    recommendedPatternIds: ['envision-edge', 'local-compute', 'gtt-backbone', 'vdc'],
  },
];

/* ═══════════════════════════════════════════════════
   GTT PATTERN ELEMENTS
   ═══════════════════════════════════════════════════ */
export const GTT_PATTERN_ELEMENTS: PatternElement[] = [
  // ── Sites ──
  {
    id: 'branch-site', label: 'Branch Site', icon: '🏢',
    category: 'site', placementZone: 'branch', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { bandwidth: '100 Mbps', users: 50, haEnabled: false },
    customerNotes: '',
    narrativeImpact: 'Represents a standard branch office requiring secure, optimized connectivity to corporate and cloud resources.',
  },
  {
    id: 'regional-hub', label: 'Regional Hub', icon: '🏛',
    category: 'site', placementZone: 'branch', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { bandwidth: '1 Gbps', users: 500, haEnabled: true },
    customerNotes: '',
    narrativeImpact: 'Establishes a regional aggregation point for traffic consolidation, breakout, and localized service delivery.',
  },
  {
    id: 'data-center', label: 'Data Center', icon: '🖥',
    category: 'site', placementZone: 'cloud-vdc', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { bandwidth: '10 Gbps', tier: 'Tier III', redundancy: 'active-active' },
    customerNotes: '',
    narrativeImpact: 'Anchors the architecture with an enterprise data center hosting critical workloads and shared services.',
  },
  {
    id: 'retail-site', label: 'Retail Site', icon: '🏪',
    category: 'site', placementZone: 'branch', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { bandwidth: '50 Mbps', posTerminals: 4, guestWifi: true },
    customerNotes: '',
    narrativeImpact: 'Adds a lightweight retail location with PCI-compliant segmentation and guest wireless isolation.',
  },
  {
    id: 'plant-site', label: 'Plant / Industrial Site', icon: '🏭',
    category: 'site', placementZone: 'branch', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { bandwidth: '500 Mbps', otSegmented: true, localBreakout: false },
    customerNotes: '',
    narrativeImpact: 'Introduces an industrial site with OT/IT segmentation and deterministic connectivity for process-critical systems.',
  },
  {
    id: 'remote-user', label: 'Remote User', icon: '👤',
    category: 'user', placementZone: 'user-app', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { accessMethod: 'ZTNA', mfaEnforced: true },
    customerNotes: '',
    narrativeImpact: 'Extends secure, identity-aware access to remote and mobile users without relying on legacy VPN infrastructure.',
  },

  // ── Transport ──
  {
    id: 'dia', label: 'Dedicated Internet Access', icon: '🌍',
    category: 'transport', placementZone: 'access', gttDifferentiator: 'backbone',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { bandwidth: '500 Mbps', sla: '99.95%', burstable: true },
    customerNotes: '',
    narrativeImpact: 'Delivers GTT DIA with SLA-backed uptime as the primary or secondary internet path at each site.',
  },
  {
    id: 'broadband', label: 'Broadband Underlay', icon: '📡',
    category: 'transport', placementZone: 'access', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { bandwidth: '200 Mbps', provider: 'local-isp' },
    customerNotes: '',
    narrativeImpact: 'Adds cost-effective broadband as a secondary underlay for non-critical traffic or SD-WAN diversity.',
  },
  {
    id: 'mpls', label: 'MPLS Circuit (Legacy)', icon: '🔗',
    category: 'transport', placementZone: 'access', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { bandwidth: '100 Mbps', cos: 'gold', contractEnd: '2027-Q2' },
    customerNotes: '',
    narrativeImpact: 'Retains existing MPLS connectivity during migration, scheduled for phased decommission as SD-WAN matures.',
  },
  {
    id: 'lte-backup', label: 'LTE / 5G Backup', icon: '📶',
    category: 'transport', placementZone: 'access', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { technology: '4G/5G', failoverOnly: true, dataCapGb: 50 },
    customerNotes: '',
    narrativeImpact: 'Provides cellular failover to maintain site connectivity during primary circuit outages or degradation.',
  },
  {
    id: 'dual-transport', label: 'Dual-Transport Resilience', icon: '⚡',
    category: 'transport', placementZone: 'access', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { primary: 'DIA', secondary: 'broadband', failoverMs: 500 },
    customerNotes: '',
    narrativeImpact: 'Ensures sub-second failover between diverse transport paths for mission-critical site availability.',
  },

  // ── Backbone ──
  {
    id: 'gtt-backbone', label: 'GTT Tier-1 IP Backbone', icon: '🌐',
    category: 'backbone', placementZone: 'backbone', gttDifferentiator: 'backbone',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { regions: 'global', latencySla: true, ipv6: true },
    customerNotes: '',
    narrativeImpact: 'Adds GTT Tier-1 backbone as the global transport fabric with SLA-grade latency, jitter, and packet-loss guarantees.',
  },
  {
    id: 'cloud-onramp', label: 'Cloud On-Ramp', icon: '🚀',
    category: 'backbone', placementZone: 'backbone', gttDifferentiator: 'backbone',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { providers: 'AWS, Azure', directConnect: true },
    customerNotes: '',
    narrativeImpact: 'Establishes dedicated cloud on-ramps via GTT backbone for low-latency, private-path access to hyperscaler environments.',
  },

  // ── Security ──
  {
    id: 'firewall', label: 'Next-Gen Firewall', icon: '🔥',
    category: 'security', placementZone: 'security', gttDifferentiator: 'integrated-security',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { vendor: 'Palo Alto', threatPrevention: true, ipsEnabled: true },
    customerNotes: '',
    narrativeImpact: 'Enforces perimeter and micro-segmentation policies with deep packet inspection and threat prevention at every trust boundary.',
  },
  {
    id: 'sse', label: 'Security Service Edge', icon: '🛡',
    category: 'security', placementZone: 'security', gttDifferentiator: 'integrated-security',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { vendor: 'Zscaler', proxyMode: 'inline', sslInspection: true },
    customerNotes: '',
    narrativeImpact: 'Delivers cloud-based security inspection for all internet-bound traffic, eliminating the need for on-premises proxy infrastructure.',
  },
  {
    id: 'sase', label: 'SASE Platform', icon: '🔐',
    category: 'security', placementZone: 'security', gttDifferentiator: 'integrated-security',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { vendor: 'integrated', networkIntegrated: true },
    customerNotes: '',
    narrativeImpact: 'Converges SD-WAN and security into a unified SASE platform for consistent policy enforcement from any location.',
  },
  {
    id: 'ztna', label: 'Zero Trust Network Access', icon: '🔑',
    category: 'security', placementZone: 'security', gttDifferentiator: 'integrated-security',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { identityProvider: 'Azure AD', devicePosture: true, mfa: true },
    customerNotes: '',
    narrativeImpact: 'Replaces legacy VPN with identity-and-context-aware application access that verifies every session before granting connectivity.',
  },
  {
    id: 'casb', label: 'Cloud Access Security Broker', icon: '☁',
    category: 'security', placementZone: 'security', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { inlineMode: true, apiMode: true, sanctionedApps: 200 },
    customerNotes: '',
    narrativeImpact: 'Provides visibility and control over sanctioned and unsanctioned SaaS usage with inline and API-based enforcement.',
  },
  {
    id: 'swg', label: 'Secure Web Gateway', icon: '🌐',
    category: 'security', placementZone: 'security', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { urlFiltering: true, malwareScanning: true, sslDecrypt: true },
    customerNotes: '',
    narrativeImpact: 'Filters and inspects all web traffic to block threats, enforce acceptable use, and maintain regulatory compliance.',
  },
  {
    id: 'dlp', label: 'Data Loss Prevention', icon: '📋',
    category: 'security', placementZone: 'security', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { policyEngine: 'regex+ml', channels: 'web, email, endpoint' },
    customerNotes: '',
    narrativeImpact: 'Prevents exfiltration of sensitive data across web, email, and endpoint channels using policy-driven content inspection.',
  },
  {
    id: 'soc', label: 'Security Operations Center', icon: '🎯',
    category: 'security', placementZone: 'ops', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { coverage: '24x7', siemIntegrated: true, responseTimeSla: '15 min' },
    customerNotes: '',
    narrativeImpact: 'Provides 24×7 security monitoring, threat detection, and incident response with SLA-backed mean-time-to-acknowledge.',
  },

  // ── Cloud ──
  {
    id: 'vdc', label: 'GTT Virtual Data Center', icon: '🏗',
    category: 'cloud', placementZone: 'cloud-vdc', gttDifferentiator: 'vdc',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { region: 'EU-West', computeTier: 'high-performance', storageType: 'SSD' },
    customerNotes: '',
    narrativeImpact: 'Deploys GTT VDC as a sovereign-ready, backbone-connected hosting platform with guaranteed data residency and low-latency cloud access.',
  },
  {
    id: 'cloud-aws', label: 'AWS Environment', icon: '🟠',
    category: 'cloud', placementZone: 'cloud-vdc', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { regions: 'us-east-1, eu-west-1', directConnect: true },
    customerNotes: '',
    narrativeImpact: 'Connects AWS workloads via dedicated cloud on-ramp with private, SLA-grade paths instead of public internet transit.',
  },
  {
    id: 'cloud-azure', label: 'Azure Environment', icon: '🔵',
    category: 'cloud', placementZone: 'cloud-vdc', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { regions: 'eastus, westeurope', expressRoute: true },
    customerNotes: '',
    narrativeImpact: 'Integrates Azure via ExpressRoute for deterministic performance to Microsoft 365, Azure workloads, and hybrid identity services.',
  },
  {
    id: 'cloud-gcp', label: 'GCP Environment', icon: '🟢',
    category: 'cloud', placementZone: 'cloud-vdc', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { regions: 'us-central1, europe-west1', partnerInterconnect: true },
    customerNotes: '',
    narrativeImpact: 'Extends connectivity to Google Cloud via Partner Interconnect for analytics, AI/ML, and data platform workloads.',
  },

  // ── Edge ──
  {
    id: 'envision-edge', label: 'GTT EnvisionEDGE', icon: '⚙',
    category: 'edge', placementZone: 'branch', gttDifferentiator: 'envision-edge',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { formFactor: 'virtual', vnfs: 'firewall, sd-wan, router', zeroTouch: true },
    customerNotes: '',
    narrativeImpact: 'Deploys GTT EnvisionEDGE as a virtualized universal CPE, hosting multiple network functions on a single platform with zero-touch provisioning.',
  },
  {
    id: 'local-compute', label: 'Edge Compute', icon: '💻',
    category: 'edge', placementZone: 'branch', gttDifferentiator: 'envision-edge',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { gpuEnabled: false, containerRuntime: 'containerd', storageGb: 256 },
    customerNotes: '',
    narrativeImpact: 'Positions compute capacity at the network edge for latency-sensitive applications, local data processing, and AI inference workloads.',
  },
  {
    id: 'segmentation', label: 'Network Segmentation', icon: '🔀',
    category: 'edge', placementZone: 'branch', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { method: 'VRF + VLAN', zones: 'corporate, guest, iot, ot' },
    customerNotes: '',
    narrativeImpact: 'Enforces micro-segmentation at the branch to isolate corporate, guest, IoT, and OT traffic domains with strict inter-zone policies.',
  },

  // ── Operations ──
  {
    id: 'managed-noc', label: 'GTT Managed NOC', icon: '📊',
    category: 'operations', placementZone: 'ops', gttDifferentiator: 'global-consistency',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { coverage: '24x7', proactiveMonitoring: true, changeManagement: true },
    customerNotes: '',
    narrativeImpact: 'Provides GTT 24×7 network operations center with proactive monitoring, automated alerting, and managed change execution.',
  },
  {
    id: 'envision-platform', label: 'GTT Envision Platform', icon: '📈',
    category: 'operations', placementZone: 'ops', gttDifferentiator: 'envision',
    applicable: true, enabled: false, quantity: 1,
    editableProps: { analytics: true, selfService: true, apiAccess: true },
    customerNotes: '',
    narrativeImpact: 'Delivers unified visibility, analytics, and self-service orchestration across the entire GTT-managed network estate via the Envision portal.',
  },
  {
    id: 'orchestrator', label: 'SD-WAN Orchestrator', icon: '🎛',
    category: 'operations', placementZone: 'ops', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { vendor: 'VMware/Fortinet', policyTemplates: true, apiDriven: true },
    customerNotes: '',
    narrativeImpact: 'Centralizes SD-WAN policy management, template-driven provisioning, and application-aware routing decisions across all sites.',
  },
  {
    id: 'sd-wan', label: 'SD-WAN Overlay', icon: '🔀',
    category: 'transport', placementZone: 'access', gttDifferentiator: null,
    applicable: true, enabled: false, quantity: 1,
    editableProps: { vendor: 'VMware/Fortinet', appAwareRouting: true, encryption: 'AES-256' },
    customerNotes: '',
    narrativeImpact: 'Establishes an intelligent SD-WAN overlay with application-aware routing, encryption, and dynamic path selection across all transport links.',
  },
];

/* ═══════════════════════════════════════════════════
   GTT ARCHITECTURE ZONES
   ═══════════════════════════════════════════════════ */
export const GTT_ARCHITECTURE_ZONES: ArchitectureZone[] = [
  { id: 'user-app',  label: 'Users & Applications',     color: '#3b82f6', yOrder: 0 },
  { id: 'branch',    label: 'Branch / Site Layer',       color: '#a78bfa', yOrder: 1 },
  { id: 'access',    label: 'Access / Transport',        color: '#fbbf24', yOrder: 2 },
  { id: 'backbone',  label: 'GTT Backbone',              color: '#34d399', yOrder: 3 },
  { id: 'security',  label: 'Security Services',         color: '#fb7185', yOrder: 4 },
  { id: 'cloud-vdc', label: 'Cloud / VDC / DC',          color: '#22d3ee', yOrder: 5 },
  { id: 'ops',       label: 'Operations / Observability', color: '#eab308', yOrder: 6 },
];

/* ═══════════════════════════════════════════════════
   GTT DIFFERENTIATOR OVERLAYS
   ═══════════════════════════════════════════════════ */
export const GTT_DIFFERENTIATOR_OVERLAYS: GttDifferentiatorOverlay[] = [
  {
    id: 'backbone',
    label: 'Global Tier 1 Backbone',
    icon: '🌐',
    color: '#34d399',
    description: 'GTT operates one of the largest Tier-1 IP backbones globally, delivering deterministic latency, packet loss, and jitter SLAs across 600+ PoPs.',
    affectedZones: ['backbone', 'access'],
  },
  {
    id: 'envision',
    label: 'Unified Edge-Core-Cloud',
    icon: '📈',
    color: '#3b82f6',
    description: 'The Envision platform provides a single pane of glass for orchestration, analytics, and lifecycle management spanning edge, core, and cloud domains.',
    affectedZones: ['user-app', 'branch', 'access', 'backbone', 'security', 'cloud-vdc', 'ops'],
  },
  {
    id: 'envision-edge',
    label: 'EnvisionEDGE Virtualized Edge',
    icon: '⚙',
    color: '#a78bfa',
    description: 'EnvisionEDGE virtualizes branch network functions onto a universal CPE platform, eliminating appliance sprawl with zero-touch deployment and centralized VNF lifecycle management.',
    affectedZones: ['branch', 'security'],
  },
  {
    id: 'integrated-security',
    label: 'Integrated Networking + Security',
    icon: '🛡',
    color: '#fb7185',
    description: 'GTT embeds security functions directly into the network fabric — firewall, SSE, ZTNA, and SASE — delivering consistent policy enforcement without separate security appliance stacks.',
    affectedZones: ['access', 'backbone', 'security'],
  },
  {
    id: 'global-consistency',
    label: 'Global Service Consistency',
    icon: '🌍',
    color: '#fbbf24',
    description: 'Standardized service delivery across all regions ensures every site — regardless of geography — receives the same SLA, security posture, and operational support model.',
    affectedZones: ['user-app', 'branch', 'access', 'backbone', 'security', 'cloud-vdc', 'ops'],
  },
  {
    id: 'vdc',
    label: 'VDC Hybrid Cloud Platform',
    icon: '🏗',
    color: '#22d3ee',
    description: 'GTT Virtual Data Center provides sovereign-ready, backbone-connected IaaS with guaranteed data residency, enabling hybrid cloud architectures without public internet dependency.',
    affectedZones: ['cloud-vdc', 'backbone'],
  },
];

/* ═══════════════════════════════════════════════════
   DEFAULT CUSTOMER REQUIREMENTS
   ═══════════════════════════════════════════════════ */
export const DEFAULT_REQUIREMENTS: CustomerRequirements = {
  customerName: 'Meridian Financial Group',
  industry: 'Financial Services & Insurance',
  regions: ['North America', 'EMEA', 'APAC'],
  siteCount: 187,
  siteTypes: ['branch', 'hub', 'dc', 'remote-user'],
  bandwidthTier: 'high',
  resiliencyTier: 'enhanced',
  securityNeeds: ['firewall', 'sse', 'ztna', 'casb', 'swg', 'dlp', 'soc'],
  complianceNeeds: ['sox', 'pci-dss', 'gdpr'],
  cloudEnvironments: ['aws', 'azure', 'vdc'],
  internetBreakout: 'regional',
  dataSovereignty: true,
  localCompute: false,
  managedServiceLevel: 'co-managed',
  notes: 'Prioritize carrier consolidation and zero-trust migration. M&A integration capability is a strategic requirement.',
};
