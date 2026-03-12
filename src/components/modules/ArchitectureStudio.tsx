import React, { useState, useMemo, useCallback } from 'react';
import { useTheme } from '../../theme/useTheme';
import { Chip, Mono } from '../shared/Primitives';
import GttFutureState from './GttFutureState';

/* ═══════════════════════════════════════════════════════════════════════════
   USE CASE TEMPLATE DATA
   ═══════════════════════════════════════════════════════════════════════════ */

interface RequirementItem {
  id: string;
  label: string;
  category: string;
  critical: boolean;
}

interface UseCaseTemplate {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: 'cyan' | 'violet' | 'emerald' | 'rose';
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

type Designation = 'primary' | 'secondary' | 'not-selected' | null;

const TEMPLATES: UseCaseTemplate[] = [
  {
    id: 'on-demand',
    title: 'On-Demand Connectivity',
    subtitle: 'Agile, consumption-based network services provisioned in real-time',
    icon: '⚡',
    accentColor: 'cyan',
    requirementsSummary: 'Enable rapid provisioning of network connectivity services with elastic bandwidth, automated orchestration, and pay-per-use economics. Designed for organizations that need to spin up and tear down connections dynamically based on business demand, M&A activity, or seasonal workloads.',
    considerations: [
      'Requires API-driven orchestration platform with sub-hour provisioning SLAs',
      'Bandwidth elasticity must support burst scenarios without pre-commitment penalties',
      'Integration with existing ITSM/ServiceNow workflows for change management',
      'Consider geographic coverage gaps — not all PoPs support on-demand provisioning equally',
      'Evaluate provider lock-in risk: portability of orchestration APIs and automation scripts',
      'Security policy must propagate dynamically with each new connection instantiation',
      'Metering and chargeback models need alignment with finance/procurement processes',
    ],
    architectureCharacteristics: [
      { label: 'Provisioning Speed', value: '< 1 hour', icon: '⏱' },
      { label: 'Bandwidth Elasticity', value: '50 Mbps – 10 Gbps', icon: '📊' },
      { label: 'Contract Model', value: 'Consumption-based', icon: '💳' },
      { label: 'Orchestration', value: 'API / Portal / IaC', icon: '🔗' },
      { label: 'Availability SLA', value: '99.95%+', icon: '🛡' },
      { label: 'Global Reach', value: '60+ metros', icon: '🌐' },
    ],
    applicabilityTags: ['M&A Integration', 'Seasonal Scaling', 'DR/BC Activation', 'Event-Driven', 'DevOps Pipelines', 'Hybrid Cloud Burst'],
    businessDrivers: [
      'Reduce time-to-revenue for new site activations from weeks to hours',
      'Eliminate stranded bandwidth costs through consumption-based pricing',
      'Support M&A integration timelines without long-term circuit commitments',
      'Enable infrastructure-as-code practices for network automation',
      'Provide CFO-friendly OpEx model aligned with cloud economics',
    ],
    painPoints: [
      'Legacy MPLS circuits require 45-90 day lead times for new connections',
      'Over-provisioned bandwidth at 60%+ of sites leads to wasted spend',
      'Manual provisioning workflows create bottlenecks and human error',
      'Inability to rapidly stand up DR connectivity during incidents',
      'Rigid contracts prevent adapting to changing business requirements',
    ],
    requirementChecklist: [
      { id: 'od-1', label: 'API-driven provisioning with < 60 min activation', category: 'Core', critical: true },
      { id: 'od-2', label: 'Self-service portal for authorized requestors', category: 'Core', critical: true },
      { id: 'od-3', label: 'Bandwidth scaling without service interruption', category: 'Core', critical: true },
      { id: 'od-4', label: 'Integration with Terraform / Pulumi / CloudFormation', category: 'Automation', critical: false },
      { id: 'od-5', label: 'Real-time usage metering and cost dashboards', category: 'Observability', critical: true },
      { id: 'od-6', label: 'Automated security policy propagation on connect', category: 'Security', critical: true },
      { id: 'od-7', label: 'Multi-provider redundancy for critical paths', category: 'Resilience', critical: false },
      { id: 'od-8', label: 'ServiceNow / ITSM webhook integration', category: 'Automation', critical: false },
      { id: 'od-9', label: 'Guaranteed burst capacity with committed floor', category: 'Performance', critical: false },
      { id: 'od-10', label: 'Geographic PoP coverage across all target metros', category: 'Coverage', critical: true },
    ],
    diagramNodes: [
      { label: 'Orchestration\nPortal', icon: '🎛', x: 300, y: 30, group: 'control' },
      { label: 'API\nGateway', icon: '🔗', x: 300, y: 130, group: 'control' },
      { label: 'Branch\nSite A', icon: '🏢', x: 60, y: 250, group: 'edge' },
      { label: 'Branch\nSite B', icon: '🏢', x: 180, y: 250, group: 'edge' },
      { label: 'NaaS\nFabric', icon: '🌐', x: 300, y: 250, group: 'core' },
      { label: 'Cloud\nRegion', icon: '☁️', x: 420, y: 250, group: 'cloud' },
      { label: 'Data\nCenter', icon: '🏗', x: 540, y: 250, group: 'dc' },
      { label: 'Metering\nEngine', icon: '📊', x: 480, y: 130, group: 'control' },
    ],
    diagramEdges: [[0, 1], [1, 4], [2, 4], [3, 4], [4, 5], [4, 6], [1, 7]],
    recommendedWhen: [
      'Organization is actively pursuing M&A and needs rapid integration',
      'Seasonal or event-driven workloads create highly variable bandwidth demands',
      'Cloud-first strategy requires dynamic connectivity to multiple CSPs',
      'CFO mandates shift from CapEx to OpEx for network infrastructure',
      'DevOps teams require infrastructure-as-code for network provisioning',
    ],
    notIdealWhen: [
      'All sites have stable, predictable bandwidth needs with no variability',
      'Regulatory requirements mandate dedicated physical circuits (e.g., SWIFT)',
      'Organization lacks API/automation maturity to leverage orchestration',
      'Ultra-low latency requirements (< 5ms) demand dedicated wavelengths',
      'Budget model is locked into multi-year CapEx commitments',
    ],
  },
  {
    id: 'multi-cloud',
    title: 'Multi-Cloud Connectivity',
    subtitle: 'Unified fabric connecting workloads across AWS, Azure, GCP, and private clouds',
    icon: '☁️',
    accentColor: 'violet',
    requirementsSummary: 'Architect a cloud-interconnect fabric that provides deterministic, low-latency, and policy-consistent connectivity between multiple cloud service providers, on-premises data centers, and SaaS platforms. Eliminate the complexity of managing disparate cloud networking constructs by abstracting connectivity into a unified control plane.',
    considerations: [
      'Each CSP has unique networking primitives — VPC peering, VNet, Interconnect — requiring abstraction layer',
      'Egress cost optimization is critical: cloud-to-cloud traffic can generate significant unplanned costs',
      'DNS resolution strategy must work seamlessly across cloud boundaries',
      'Identity and access management must federate consistently across all cloud environments',
      'Data sovereignty and residency requirements may constrain routing paths between regions',
      'Network segmentation policies must translate consistently across CSP-native constructs',
      'Monitoring and troubleshooting requires correlated telemetry across cloud boundaries',
    ],
    architectureCharacteristics: [
      { label: 'Cloud Providers', value: 'AWS + Azure + GCP', icon: '☁️' },
      { label: 'Interconnect Latency', value: '< 10ms cross-cloud', icon: '⏱' },
      { label: 'Segmentation', value: 'Micro-segmented', icon: '🔒' },
      { label: 'Control Plane', value: 'Unified / Abstracted', icon: '🎛' },
      { label: 'Egress Optimization', value: 'Policy-driven routing', icon: '💰' },
      { label: 'Encryption', value: 'End-to-end (MACsec/IPsec)', icon: '🛡' },
    ],
    applicabilityTags: ['Hybrid Cloud', 'Cloud Migration', 'SaaS Integration', 'Data Residency', 'Disaster Recovery', 'Platform Engineering'],
    businessDrivers: [
      'Avoid vendor lock-in by distributing workloads across best-of-breed cloud platforms',
      'Meet data residency and sovereignty requirements through flexible routing',
      'Optimize cloud egress costs through intelligent traffic engineering',
      'Enable platform engineering teams to consume network-as-a-service across clouds',
      'Support disaster recovery with cross-cloud failover capabilities',
    ],
    painPoints: [
      'Siloed cloud networking teams managing each CSP independently',
      'Inconsistent security policies across AWS Security Groups, Azure NSGs, and GCP Firewall Rules',
      'Unpredictable and escalating cloud egress charges',
      'Lack of end-to-end visibility for cross-cloud application traffic flows',
      'Manual and error-prone process for extending network policies to new cloud regions',
    ],
    requirementChecklist: [
      { id: 'mc-1', label: 'Private interconnect to AWS, Azure, and GCP (Direct Connect / ExpressRoute / Interconnect)', category: 'Core', critical: true },
      { id: 'mc-2', label: 'Unified network policy engine across all cloud environments', category: 'Security', critical: true },
      { id: 'mc-3', label: 'Cross-cloud traffic visibility with flow-level analytics', category: 'Observability', critical: true },
      { id: 'mc-4', label: 'Egress cost optimization with policy-based routing', category: 'Cost', critical: true },
      { id: 'mc-5', label: 'Automated VPC/VNet provisioning via IaC templates', category: 'Automation', critical: false },
      { id: 'mc-6', label: 'DNS resolution across cloud boundaries (hybrid DNS)', category: 'Core', critical: true },
      { id: 'mc-7', label: 'Encryption in transit (MACsec on interconnect, IPsec overlay)', category: 'Security', critical: true },
      { id: 'mc-8', label: 'Multi-region failover with automated BGP path selection', category: 'Resilience', critical: false },
      { id: 'mc-9', label: 'Cloud network compliance reporting (CIS, SOC2)', category: 'Compliance', critical: false },
      { id: 'mc-10', label: 'SaaS application direct breakout optimization', category: 'Performance', critical: false },
    ],
    diagramNodes: [
      { label: 'Cloud\nRouter', icon: '🎛', x: 300, y: 30, group: 'control' },
      { label: 'AWS\nVPC', icon: '☁️', x: 80, y: 160, group: 'cloud' },
      { label: 'Azure\nVNet', icon: '☁️', x: 300, y: 160, group: 'cloud' },
      { label: 'GCP\nVPC', icon: '☁️', x: 520, y: 160, group: 'cloud' },
      { label: 'Interconnect\nFabric', icon: '🌐', x: 300, y: 280, group: 'core' },
      { label: 'On-Prem\nDC', icon: '🏗', x: 120, y: 370, group: 'dc' },
      { label: 'Policy\nEngine', icon: '🔒', x: 480, y: 370, group: 'security' },
      { label: 'SaaS\nPlatforms', icon: '📦', x: 300, y: 370, group: 'saas' },
    ],
    diagramEdges: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5], [4, 7], [0, 6]],
    recommendedWhen: [
      'Workloads are distributed across two or more CSPs by design or acquisition',
      'Data residency requirements demand flexible, region-aware routing',
      'Cloud egress costs are a top-3 line item in infrastructure spend',
      'Platform engineering team needs self-service cloud networking',
      'Active cloud migration with phased workload movement between environments',
    ],
    notIdealWhen: [
      'Organization is committed to a single CSP with no multi-cloud strategy',
      'All workloads are SaaS-consumed with no IaaS/PaaS footprint',
      'Network team lacks cloud networking skills across multiple platforms',
      'Budget does not support private interconnects (public internet is acceptable)',
      'Application architecture is monolithic with no distributed components',
    ],
  },
  {
    id: 'sdwan',
    title: 'SD-WAN',
    subtitle: 'Software-defined branch networking with intelligent path selection and centralized policy',
    icon: '🔀',
    accentColor: 'emerald',
    requirementsSummary: 'Deploy an SD-WAN overlay across branch and campus sites to replace or augment legacy MPLS with intelligent, application-aware path selection over broadband, LTE/5G, and private circuits. Centralize network policy management while enabling local internet breakout for cloud and SaaS applications.',
    considerations: [
      'Underlay diversity is critical — at minimum dual ISP or ISP + LTE at each site for resilience',
      'Application identification and classification policies must be tuned per-customer application portfolio',
      'Legacy MPLS decommission timeline must align with SD-WAN readiness milestones per site',
      'WAN optimization (dedup, compression, FEC) requirements vary by application sensitivity',
      'Zero-touch provisioning (ZTP) maturity determines rollout velocity — test early with pilot sites',
      'Integration with existing security stack (firewalls, proxies) or plan for convergence with SASE',
      'Cellular failover costs can surprise — negotiate pooled data plans across sites upfront',
    ],
    architectureCharacteristics: [
      { label: 'Topology', value: 'Hub-spoke + mesh', icon: '🔀' },
      { label: 'Transport', value: 'MPLS + Broadband + LTE', icon: '📡' },
      { label: 'Path Selection', value: 'Application-aware', icon: '🧠' },
      { label: 'Deployment', value: 'Zero-touch (ZTP)', icon: '📦' },
      { label: 'Encryption', value: 'AES-256 IPsec overlay', icon: '🔒' },
      { label: 'Management', value: 'Centralized orchestrator', icon: '🎛' },
    ],
    applicabilityTags: ['Branch Modernization', 'MPLS Migration', 'Cloud Breakout', 'Retail/Distributed', 'Cost Optimization', 'WAN Simplification'],
    businessDrivers: [
      'Reduce WAN costs by supplementing or replacing expensive MPLS with broadband',
      'Improve application performance through intelligent, real-time path selection',
      'Accelerate new site deployments with zero-touch provisioning',
      'Enable direct cloud/SaaS breakout to improve user experience and reduce backhaul',
      'Centralize network policy management across hundreds of distributed sites',
    ],
    painPoints: [
      'MPLS costs consuming 40-60% of total network budget with limited bandwidth growth',
      'Poor SaaS/cloud performance due to backhauling traffic through central data centers',
      'New site provisioning takes 60-90 days due to circuit lead times and manual config',
      'No application-level visibility into WAN performance metrics',
      'Branch firewall sprawl creating inconsistent security posture across locations',
    ],
    requirementChecklist: [
      { id: 'sd-1', label: 'Centralized orchestrator with single-pane management', category: 'Core', critical: true },
      { id: 'sd-2', label: 'Application-aware routing with real-time path selection', category: 'Core', critical: true },
      { id: 'sd-3', label: 'Support for broadband, MPLS, and LTE/5G transport simultaneously', category: 'Core', critical: true },
      { id: 'sd-4', label: 'Zero-touch provisioning for new site deployments', category: 'Operations', critical: true },
      { id: 'sd-5', label: 'Local internet breakout with security policy enforcement', category: 'Security', critical: true },
      { id: 'sd-6', label: 'WAN optimization: FEC, packet duplication, jitter buffering', category: 'Performance', critical: false },
      { id: 'sd-7', label: 'Segmentation (VRF-lite or VLAN) for traffic isolation', category: 'Security', critical: false },
      { id: 'sd-8', label: 'Integration with cloud gateways (AWS TGW, Azure vWAN)', category: 'Cloud', critical: false },
      { id: 'sd-9', label: 'Real-time application performance SLA monitoring', category: 'Observability', critical: true },
      { id: 'sd-10', label: 'Dual-CPE or HA appliance option for critical sites', category: 'Resilience', critical: false },
    ],
    diagramNodes: [
      { label: 'SD-WAN\nOrchestrator', icon: '🎛', x: 300, y: 20, group: 'control' },
      { label: 'Hub\nGateway', icon: '🏗', x: 300, y: 140, group: 'core' },
      { label: 'Branch\nCPE 1', icon: '🏢', x: 60, y: 280, group: 'edge' },
      { label: 'Branch\nCPE 2', icon: '🏢', x: 200, y: 280, group: 'edge' },
      { label: 'Branch\nCPE 3', icon: '🏢', x: 400, y: 280, group: 'edge' },
      { label: 'Branch\nCPE 4', icon: '🏢', x: 540, y: 280, group: 'edge' },
      { label: 'Cloud\nGateway', icon: '☁️', x: 120, y: 140, group: 'cloud' },
      { label: 'SaaS\nBreakout', icon: '🌐', x: 480, y: 140, group: 'saas' },
    ],
    diagramEdges: [[0, 1], [1, 2], [1, 3], [1, 4], [1, 5], [0, 6], [0, 7], [2, 6], [5, 7]],
    recommendedWhen: [
      'Organization has 20+ branch/retail/campus sites with WAN connectivity',
      'MPLS costs are disproportionate to bandwidth delivered',
      'SaaS adoption (O365, Salesforce, etc.) is degraded by centralized backhauling',
      'Rapid site deployment capability is a business requirement',
      'Network team is ready to shift from CLI-driven to policy-driven management',
    ],
    notIdealWhen: [
      'Fewer than 5 sites with stable, low-bandwidth requirements',
      'All applications are hosted on-premises with no cloud/SaaS dependencies',
      'Regulatory environment prohibits internet transport for sensitive traffic',
      'Organization has recently signed long-term MPLS contracts with heavy ETFs',
      'No broadband availability at majority of site locations',
    ],
  },
  {
    id: 'sase',
    title: 'SASE',
    subtitle: 'Converged networking and security-as-a-service delivered from the cloud edge',
    icon: '🛡',
    accentColor: 'rose',
    requirementsSummary: 'Converge SD-WAN, Secure Web Gateway (SWG), Cloud Access Security Broker (CASB), Zero Trust Network Access (ZTNA), and Firewall-as-a-Service (FWaaS) into a unified, cloud-delivered platform. Eliminate the branch security appliance stack by shifting enforcement to globally distributed PoPs closest to users and workloads.',
    considerations: [
      'SASE is a journey, not a single deployment — plan for phased convergence of networking and security',
      'Evaluate single-vendor vs. best-of-breed (SD-WAN + SSE) architecture tradeoffs carefully',
      'User experience monitoring is essential — SASE changes traffic paths and introduces new hops',
      'Existing security tool contracts and amortization schedules affect migration timeline',
      'Remote/hybrid workforce requirements may prioritize ZTNA and SWG over SD-WAN initially',
      'Data Loss Prevention (DLP) policies need to be mapped from existing tools to SASE platform',
      'Certificate management for TLS inspection at scale requires careful planning and exceptions',
    ],
    architectureCharacteristics: [
      { label: 'Architecture', value: 'Cloud-native SSE + SD-WAN', icon: '🏗' },
      { label: 'Zero Trust', value: 'Identity-centric ZTNA', icon: '🔐' },
      { label: 'Inspection', value: 'TLS 1.3 at line rate', icon: '🔍' },
      { label: 'PoP Coverage', value: '150+ global locations', icon: '🌐' },
      { label: 'Policy Model', value: 'User + App + Device context', icon: '📋' },
      { label: 'DLP', value: 'Inline + API-based', icon: '🛡' },
    ],
    applicabilityTags: ['Zero Trust', 'Remote Workforce', 'Security Consolidation', 'Cloud-First', 'Compliance', 'Branch Simplification'],
    businessDrivers: [
      'Consolidate 5-8 security point products into a unified cloud-delivered platform',
      'Enable zero trust access for hybrid/remote workforce without VPN complexity',
      'Reduce branch hardware footprint and associated maintenance/refresh costs',
      'Achieve consistent security posture regardless of user location or device',
      'Meet compliance requirements (NIST, ISO 27001, SOC2) with unified audit trail',
    ],
    painPoints: [
      'Branch security stack (FW, proxy, IDS/IPS) creates operational complexity and cost',
      'VPN infrastructure cannot scale for permanent hybrid workforce',
      'Inconsistent security policies between on-premises and remote users',
      'Shadow IT and unsanctioned SaaS usage lack visibility and control',
      'Security incidents take too long to investigate due to fragmented logging',
    ],
    requirementChecklist: [
      { id: 'sa-1', label: 'Cloud-delivered Secure Web Gateway (SWG) with TLS inspection', category: 'Core', critical: true },
      { id: 'sa-2', label: 'Zero Trust Network Access (ZTNA) replacing legacy VPN', category: 'Core', critical: true },
      { id: 'sa-3', label: 'Cloud Access Security Broker (CASB) for SaaS visibility and control', category: 'Core', critical: true },
      { id: 'sa-4', label: 'Firewall-as-a-Service (FWaaS) with L3-L7 inspection', category: 'Core', critical: true },
      { id: 'sa-5', label: 'SD-WAN integration (single-vendor or validated best-of-breed)', category: 'Network', critical: true },
      { id: 'sa-6', label: 'Data Loss Prevention (DLP) — inline and API-based', category: 'Security', critical: false },
      { id: 'sa-7', label: 'Digital Experience Monitoring (DEM) for end-user visibility', category: 'Observability', critical: false },
      { id: 'sa-8', label: 'Identity provider integration (Okta, Azure AD, Ping)', category: 'Identity', critical: true },
      { id: 'sa-9', label: 'Unified logging and SIEM/SOAR integration', category: 'Security', critical: false },
      { id: 'sa-10', label: 'Browser isolation for high-risk web categories', category: 'Security', critical: false },
    ],
    diagramNodes: [
      { label: 'SASE\nCloud', icon: '🛡', x: 300, y: 30, group: 'core' },
      { label: 'SWG', icon: '🌐', x: 120, y: 140, group: 'security' },
      { label: 'ZTNA', icon: '🔐', x: 260, y: 140, group: 'security' },
      { label: 'CASB', icon: '📋', x: 400, y: 140, group: 'security' },
      { label: 'FWaaS', icon: '🔥', x: 540, y: 140, group: 'security' },
      { label: 'Remote\nUsers', icon: '👤', x: 60, y: 280, group: 'edge' },
      { label: 'Branch\nSites', icon: '🏢', x: 220, y: 280, group: 'edge' },
      { label: 'Cloud\nApps', icon: '☁️', x: 380, y: 280, group: 'cloud' },
      { label: 'Private\nApps', icon: '🏗', x: 540, y: 280, group: 'dc' },
    ],
    diagramEdges: [[0, 1], [0, 2], [0, 3], [0, 4], [5, 1], [5, 2], [6, 0], [7, 3], [8, 2], [8, 4]],
    recommendedWhen: [
      'Organization is pursuing zero trust architecture transformation',
      'Hybrid/remote workforce exceeds 30% of total employees',
      'Security appliance refresh cycle is approaching (3+ tools EOL within 18 months)',
      'Cloud and SaaS adoption exceeds 50% of application portfolio',
      'CISO mandate to consolidate security vendors and reduce tool sprawl',
    ],
    notIdealWhen: [
      'All users are on-premises with no remote work policy',
      'Security tools were recently purchased with 3+ years remaining on contracts',
      'Application portfolio is 90%+ on-premises with minimal SaaS adoption',
      'Organization requires air-gapped or fully offline network segments',
      'Regulatory environment requires all traffic inspection to remain on-premises',
    ],
  },
];

const DESIGNATION_META: Record<string, { label: string; short: string; colorKey: 'emerald' | 'amber' | 'slate'; symbol: string }> = {
  primary:        { label: 'Primary Use Case',   short: 'PRIMARY',   colorKey: 'emerald', symbol: '★' },
  secondary:      { label: 'Secondary Use Case',  short: 'SECONDARY', colorKey: 'amber',   symbol: '◆' },
  'not-selected': { label: 'Not Selected',        short: 'EXCLUDED',  colorKey: 'slate',   symbol: '—' },
};

const FIT_DIMENSIONS = ['Strategic Alignment', 'Technical Readiness', 'Budget Fit', 'Timeline Feasibility', 'Organizational Readiness'];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const ArchitectureStudio: React.FC = () => {
  const { t, isDark } = useTheme();

  /* ─── State ─── */
  const [studioView, setStudioView] = useState<'templates' | 'gtt-future'>('templates');
  const [selectedId, setSelectedId] = useState<string>('on-demand');
  const [compareId, setCompareId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>({});
  const [fitScores, setFitScores] = useState<Record<string, Record<string, number>>>({});
  const [designations, setDesignations] = useState<Record<string, Designation>>({});

  const selected = useMemo(() => TEMPLATES.find(tp => tp.id === selectedId)!, [selectedId]);
  const compared = useMemo(() => compareId ? TEMPLATES.find(tp => tp.id === compareId) : null, [compareId]);

  const accentFor = useCallback((color: UseCaseTemplate['accentColor']) => t[color], [t]);
  const accent = accentFor(selected.accentColor);

  /* ─── Actions ─── */
  const toggleCheck = (id: string) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  const setNote = (tid: string, note: string) => setCustomerNotes(prev => ({ ...prev, [tid]: note }));
  const setFit = (tid: string, dim: string, score: number) => setFitScores(prev => ({
    ...prev, [tid]: { ...(prev[tid] || {}), [dim]: score },
  }));
  const cycleDesignation = (tid: string) => {
    const order: Designation[] = [null, 'primary', 'secondary', 'not-selected'];
    const cur = designations[tid] ?? null;
    const next = order[(order.indexOf(cur) + 1) % order.length];
    setDesignations(prev => ({ ...prev, [tid]: next }));
  };
  const setDesignation = (tid: string, d: Designation) => setDesignations(prev => ({ ...prev, [tid]: d }));

  /* ─── Derived ─── */
  const getFitScore = (tid: string, dim: string) => fitScores[tid]?.[dim] ?? 0;
  const getAvgFit = (tid: string) => {
    const scores = FIT_DIMENSIONS.map(d => getFitScore(tid, d));
    const filled = scores.filter(s => s > 0);
    return filled.length ? Math.round(filled.reduce((a, b) => a + b, 0) / filled.length) : 0;
  };
  const checkedCount = (tmpl: UseCaseTemplate) => tmpl.requirementChecklist.filter(r => checkedItems[r.id]).length;

  const primaryCount = Object.values(designations).filter(d => d === 'primary').length;
  const secondaryCount = Object.values(designations).filter(d => d === 'secondary').length;

  /* ═══════════════════════════════════════════════════════════════════════════
     SHARED STYLES
     ═══════════════════════════════════════════════════════════════════════════ */

  const panelStyle = (acc: string): React.CSSProperties => ({
    background: t.bgCard,
    borderRadius: t.r.lg,
    border: `1px solid ${acc}20`,
    padding: 20,
    backdropFilter: 'blur(12px)',
    position: 'relative',
    overflow: 'hidden',
  });

  const panelGlow = (acc: string): React.CSSProperties => ({
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    background: `linear-gradient(90deg, transparent, ${acc}50, transparent)`,
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: t.fontM, fontSize: 9, color: t.textDim,
    letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10,
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     DESIGNATION SELECTOR (inline button group)
     ═══════════════════════════════════════════════════════════════════════════ */

  const renderDesignationSelector = (tid: string, compact = false) => {
    const current = designations[tid] ?? null;
    const options: { value: Designation; label: string; icon: string }[] = [
      { value: 'primary', label: compact ? 'PRI' : 'Primary', icon: '★' },
      { value: 'secondary', label: compact ? 'SEC' : 'Secondary', icon: '◆' },
      { value: 'not-selected', label: compact ? 'OUT' : 'Excluded', icon: '—' },
    ];
    return (
      <div style={{
        display: 'inline-flex', borderRadius: 6, overflow: 'hidden',
        border: `1px solid ${t.border}`, background: t.bgInput,
      }}>
        {options.map((opt, i) => {
          const active = current === opt.value;
          const meta = opt.value ? DESIGNATION_META[opt.value] : null;
          const c = meta ? t[meta.colorKey] : t.textDim;
          return (
            <button
              key={opt.value || 'none'}
              onClick={(e) => { e.stopPropagation(); setDesignation(tid, active ? null : opt.value); }}
              style={{
                padding: compact ? '3px 8px' : '4px 12px',
                border: 'none',
                borderRight: i < options.length - 1 ? `1px solid ${t.border}` : 'none',
                background: active ? c + '18' : 'transparent',
                color: active ? c : t.textDim,
                fontFamily: t.fontD, fontSize: compact ? 9 : 10, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <span style={{ fontSize: compact ? 9 : 11 }}>{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     DIAGRAM RENDERER
     ═══════════════════════════════════════════════════════════════════════════ */

  const renderDiagram = (tmpl: UseCaseTemplate, acc: string) => {
    const groupColors: Record<string, string> = {
      control: t.accent, core: acc, edge: t.amber, cloud: t.cyan,
      dc: t.violet, security: t.rose, saas: t.emerald,
    };
    return (
      <svg viewBox="0 0 640 420" style={{ width: '100%', height: '100%', minHeight: 220 }}>
        <defs>
          <filter id={`glow-${tmpl.id}`}>
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id={`edge-grad-${tmpl.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={acc} stopOpacity="0.5" />
            <stop offset="100%" stopColor={acc} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {tmpl.diagramEdges.map(([fi, ti], i) => {
          const from = tmpl.diagramNodes[fi];
          const to = tmpl.diagramNodes[ti];
          if (!from || !to) return null;
          const x1 = from.x + 30, y1 = from.y + 25, x2 = to.x + 30, y2 = to.y + 25;
          const dx = x2 - x1, dy = y2 - y1;
          return (
            <path key={i}
              d={`M ${x1} ${y1} C ${x1 + dx * 0.4} ${y1 + dy * 0.1}, ${x2 - dx * 0.4} ${y2 - dy * 0.1}, ${x2} ${y2}`}
              stroke={`url(#edge-grad-${tmpl.id})`}
              strokeWidth={1.5} fill="none" filter={`url(#glow-${tmpl.id})`} />
          );
        })}
        {tmpl.diagramNodes.map((node, i) => {
          const gc = groupColors[node.group] || acc;
          return (
            <g key={i}>
              <rect x={node.x} y={node.y} width={60} height={50} rx={10}
                fill={isDark ? gc + '10' : gc + '0c'}
                stroke={gc + '35'} strokeWidth={1.2} />
              <rect x={node.x} y={node.y} width={60} height={1.5} rx={1}
                fill={gc} opacity={0.4} />
              <text x={node.x + 30} y={node.y + 18} textAnchor="middle"
                style={{ fontSize: 16 }}>{node.icon}</text>
              {node.label.split('\n').map((line, li) => (
                <text key={li} x={node.x + 30} y={node.y + 33 + li * 11} textAnchor="middle"
                  style={{ fontSize: 8, fontFamily: t.fontM, fill: t.textSoft, fontWeight: 600 }}>{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TEMPLATE CONTENT PANELS
     ═══════════════════════════════════════════════════════════════════════════ */

  const renderTemplateContent = (tmpl: UseCaseTemplate, isCompare = false) => {
    const acc = accentFor(tmpl.accentColor);
    const checked = checkedCount(tmpl);
    const total = tmpl.requirementChecklist.length;
    const avg = getAvgFit(tmpl.id);
    const desg = designations[tmpl.id] ?? null;
    const desgMeta = desg ? DESIGNATION_META[desg] : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minWidth: 0 }}>

        {/* ── OVERVIEW HEADER ── */}
        <div style={{ ...panelStyle(acc), padding: '24px 28px' }}>
          <div style={panelGlow(acc)} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: t.r.md, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, background: `linear-gradient(135deg, ${acc}20, ${acc}08)`, border: `1px solid ${acc}30`,
              boxShadow: `0 0 20px ${acc}15`, flexShrink: 0,
            }}>{tmpl.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 2 }}>
                <h2 style={{ fontFamily: t.fontD, fontSize: isCompare ? 16 : 20, fontWeight: 800, color: t.text, margin: 0, letterSpacing: -0.3 }}>
                  {tmpl.title}
                </h2>
                {desgMeta && (
                  <span style={{
                    fontFamily: t.fontM, fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 5,
                    background: t[desgMeta.colorKey] + '15', color: t[desgMeta.colorKey],
                    border: `1px solid ${t[desgMeta.colorKey]}25`,
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <span>{desgMeta.symbol}</span> {desgMeta.short}
                  </span>
                )}
                {avg > 0 && (
                  <span style={{
                    fontFamily: t.fontM, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    background: avg >= 7 ? t.emerald + '15' : avg >= 4 ? t.amber + '15' : t.rose + '15',
                    color: avg >= 7 ? t.emerald : avg >= 4 ? t.amber : t.rose,
                  }}>{avg}/10 FIT</span>
                )}
              </div>
              <p style={{ fontFamily: t.fontB, fontSize: 12, color: t.textMuted, margin: '4px 0 0', lineHeight: 1.5 }}>
                {tmpl.subtitle}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                {tmpl.applicabilityTags.map(tag => (
                  <Chip key={tag} color={acc} small>{tag}</Chip>
                ))}
              </div>
              {/* Designation selector in header */}
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                  Designation
                </span>
                {renderDesignationSelector(tmpl.id)}
              </div>
            </div>
          </div>
          <p style={{ fontFamily: t.fontB, fontSize: 12, color: t.textSoft, margin: '16px 0 0', lineHeight: 1.7 }}>
            {tmpl.requirementsSummary}
          </p>
        </div>

        {/* ── ARCHITECTURE CHARACTERISTICS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: 8 }}>
          {tmpl.architectureCharacteristics.map(ch => (
            <div key={ch.label} style={{ ...panelStyle(acc), padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{ch.icon}</div>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                {ch.label}
              </div>
              <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: acc }}>{ch.value}</div>
            </div>
          ))}
        </div>

        {/* ── REQUIREMENTS + CONSIDERATIONS (two-column) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? '1fr' : '1fr 1fr', gap: 16 }}>
          {/* Requirements Panel */}
          <div style={panelStyle(acc)}>
            <div style={panelGlow(acc)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={labelStyle}>Requirements Checklist</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 48, height: 4, borderRadius: 2, background: t.borderSubtle, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${total > 0 ? (checked / total) * 100 : 0}%`, background: acc, borderRadius: 2, transition: 'width 0.4s' }} />
                </div>
                <Mono color={acc} size={9}>{checked}/{total}</Mono>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tmpl.requirementChecklist.map(req => {
                const isChecked = !!checkedItems[req.id];
                return (
                  <div key={req.id} onClick={() => toggleCheck(req.id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px', borderRadius: t.r.sm,
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: isChecked ? acc + '08' : 'transparent',
                      border: `1px solid ${isChecked ? acc + '25' : t.borderSubtle}`,
                    }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${isChecked ? acc : t.textDim}`,
                      background: isChecked ? acc + '20' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1, transition: 'all 0.15s',
                    }}>
                      {isChecked && <span style={{ color: acc, fontSize: 11, fontWeight: 800 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: t.fontB, fontSize: 11, color: isChecked ? t.text : t.textSoft, lineHeight: 1.4 }}>
                        {req.label}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                        <span style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim }}>{req.category}</span>
                        {req.critical && <span style={{ fontFamily: t.fontM, fontSize: 8, color: t.rose, fontWeight: 700 }}>CRITICAL</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Considerations Panel */}
          <div style={panelStyle(acc)}>
            <div style={panelGlow(acc)} />
            <div style={labelStyle}>Considerations & Expectations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tmpl.considerations.map((c, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '10px 12px', borderRadius: t.r.sm,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${t.borderSubtle}`,
                }}>
                  <span style={{
                    color: acc, fontFamily: t.fontM, fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1,
                    width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: acc + '10',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.6 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DIAGRAM + BUSINESS DRIVERS / PAIN POINTS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? '1fr' : '1fr 1fr', gap: 16 }}>
          {/* Diagram Panel */}
          <div style={panelStyle(acc)}>
            <div style={panelGlow(acc)} />
            <div style={labelStyle}>Reference Architecture Diagram</div>
            <div style={{
              background: isDark ? 'rgba(6,10,20,0.6)' : 'rgba(240,242,245,0.8)',
              borderRadius: t.r.md, border: `1px solid ${t.borderSubtle}`, padding: 12,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: t.r.md,
                backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(40,55,85,0.2)' : 'rgba(148,163,184,0.15)'} 1px, transparent 1px)`,
                backgroundSize: '20px 20px', pointerEvents: 'none',
              }} />
              {renderDiagram(tmpl, acc)}
            </div>
          </div>

          {/* Business Drivers + Pain Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={panelStyle(acc)}>
              <div style={panelGlow(acc)} />
              <div style={labelStyle}>Business Drivers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tmpl.businessDrivers.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{
                      color: t.emerald, fontSize: 8, marginTop: 3, flexShrink: 0,
                      width: 14, height: 14, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: t.emerald + '12',
                    }}>▲</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={panelStyle(acc)}>
              <div style={panelGlow(acc)} />
              <div style={labelStyle}>Pain Points Addressed</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tmpl.painPoints.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{
                      color: t.rose, fontSize: 8, marginTop: 3, flexShrink: 0,
                      width: 14, height: 14, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: t.rose + '12',
                    }}>◆</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RECOMMENDED WHEN / NOT IDEAL WHEN ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div style={panelStyle(t.emerald)}>
            <div style={panelGlow(t.emerald)} />
            <div style={{ ...labelStyle, color: t.emerald }}>Recommended When</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tmpl.recommendedWhen.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: t.emerald, fontSize: 11, marginTop: 1, flexShrink: 0, fontWeight: 700 }}>✓</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={panelStyle(t.rose)}>
            <div style={panelGlow(t.rose)} />
            <div style={{ ...labelStyle, color: t.rose }}>Not Ideal When</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tmpl.notIdealWhen.map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: t.rose, fontSize: 11, marginTop: 1, flexShrink: 0, fontWeight: 700 }}>✕</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FIT-TO-CUSTOMER MAPPING ── */}
        <div style={panelStyle(acc)}>
          <div style={panelGlow(acc)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={labelStyle}>Fit-to-Customer Mapping</div>
            {avg > 0 && (
              <div style={{
                fontFamily: t.fontD, fontSize: 22, fontWeight: 800,
                color: avg >= 7 ? t.emerald : avg >= 4 ? t.amber : t.rose,
                display: 'flex', alignItems: 'baseline', gap: 2,
              }}>
                {avg}<span style={{ fontSize: 11, fontWeight: 600, color: t.textDim }}>/10</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FIT_DIMENSIONS.map(dim => {
              const score = getFitScore(tmpl.id, dim);
              const barColor = score >= 7 ? t.emerald : score >= 4 ? t.amber : score > 0 ? t.rose : t.textDim;
              return (
                <div key={dim}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft }}>{dim}</span>
                    <span style={{ fontFamily: t.fontM, fontSize: 11, fontWeight: 700, color: score > 0 ? barColor : t.textDim, minWidth: 20, textAlign: 'right' }}>
                      {score || '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <button key={i} onClick={() => setFit(tmpl.id, dim, i + 1)}
                        style={{
                          flex: 1, height: 8, borderRadius: 3, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                          background: i < score
                            ? `linear-gradient(135deg, ${barColor}cc, ${barColor})`
                            : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
                          boxShadow: i < score ? `0 0 8px ${barColor}25` : 'none',
                        }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CUSTOMER NOTES ── */}
        <div style={panelStyle(acc)}>
          <div style={panelGlow(acc)} />
          <div style={labelStyle}>Customer Notes</div>
          <textarea
            value={customerNotes[tmpl.id] || ''}
            onChange={e => setNote(tmpl.id, e.target.value)}
            placeholder={`Capture customer-specific notes for ${tmpl.title}...\n\nConsider: environment specifics, constraints, stakeholder feedback, timeline considerations, budget context...`}
            rows={5}
            style={{
              width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: t.r.sm,
              color: t.text, fontFamily: t.fontB, fontSize: 12, padding: '12px 14px', resize: 'vertical',
              lineHeight: 1.6, outline: 'none',
            }}
          />
          {customerNotes[tmpl.id] && (
            <div style={{ marginTop: 6, fontFamily: t.fontM, fontSize: 8, color: t.textDim }}>
              {customerNotes[tmpl.id].length} characters
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     SELECTOR CARD
     ═══════════════════════════════════════════════════════════════════════════ */

  const renderSelectorCard = (tmpl: UseCaseTemplate) => {
    const acc = accentFor(tmpl.accentColor);
    const isSelected = selectedId === tmpl.id;
    const isCompared = compareId === tmpl.id;
    const checked = checkedCount(tmpl);
    const total = tmpl.requirementChecklist.length;
    const avg = getAvgFit(tmpl.id);
    const desg = designations[tmpl.id] ?? null;
    const desgMeta = desg ? DESIGNATION_META[desg] : null;

    return (
      <div
        key={tmpl.id}
        onClick={() => {
          if (compareMode) {
            if (selectedId !== tmpl.id) setCompareId(tmpl.id === compareId ? null : tmpl.id);
          } else {
            setSelectedId(tmpl.id);
          }
        }}
        style={{
          padding: '14px 16px', borderRadius: t.r.md, cursor: 'pointer', transition: 'all 0.2s',
          background: isSelected ? acc + '12' : isCompared ? acc + '08' : 'transparent',
          border: `1.5px solid ${isSelected ? acc + '50' : isCompared ? acc + '30' : t.borderSubtle}`,
          position: 'relative', overflow: 'hidden',
          opacity: desg === 'not-selected' ? 0.55 : 1,
        }}
      >
        {/* Active indicator bar */}
        {isSelected && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: acc, borderRadius: '0 2px 2px 0' }} />}

        {/* Top-right badges */}
        <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 4 }}>
          {isCompared && (
            <span style={{ fontFamily: t.fontM, fontSize: 7, color: acc, background: acc + '15', padding: '2px 5px', borderRadius: 3, fontWeight: 700 }}>
              COMPARE
            </span>
          )}
          {desgMeta && (
            <span style={{
              fontFamily: t.fontM, fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3,
              color: t[desgMeta.colorKey], background: t[desgMeta.colorKey] + '15',
              display: 'inline-flex', alignItems: 'center', gap: 2,
            }}>
              {desgMeta.symbol} {desgMeta.short}
            </span>
          )}
        </div>

        {/* Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, background: acc + '12', border: `1px solid ${acc}25`, flexShrink: 0,
          }}>{tmpl.icon}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: isSelected ? acc : t.text }}>
              {tmpl.title}
            </div>
            <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, letterSpacing: 0.5, marginTop: 1 }}>
              {tmpl.applicabilityTags.slice(0, 2).join(' · ')}
            </div>
          </div>
        </div>

        {/* Progress + Fit indicators */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
            <div style={{ flex: 1, maxWidth: 50, height: 3, borderRadius: 2, background: t.borderSubtle, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${total > 0 ? (checked / total) * 100 : 0}%`, background: acc, borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
            <Mono size={8} color={checked > 0 ? acc : t.textDim}>{checked}/{total}</Mono>
          </div>
          {avg > 0 && (
            <Mono size={8} color={avg >= 7 ? t.emerald : avg >= 4 ? t.amber : t.rose}>{avg}/10</Mono>
          )}
        </div>

        {/* Compact designation selector */}
        <div onClick={e => e.stopPropagation()}>
          {renderDesignationSelector(tmpl.id, true)}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════════════════════ */

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── LEFT PANEL — Template Selector ── */}
      <div style={{
        width: 250, background: t.bgPanel, borderRight: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${t.accent}, ${t.violet})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: t.fontD, fontSize: 13, fontWeight: 900, color: '#fff',
            }}>A</div>
            <div>
              <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 800, color: t.text }}>Architecture</div>
              <Mono color={t.accent} size={7}>USE CASE STUDIO</Mono>
            </div>
          </div>
        </div>

        {/* Template Cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
          <div style={{ ...labelStyle, padding: '0 6px', marginBottom: 8 }}>Use Case Templates</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TEMPLATES.map(tmpl => (
              <React.Fragment key={tmpl.id}>{renderSelectorCard(tmpl)}</React.Fragment>
            ))}
          </div>
        </div>

        {/* Designation Summary */}
        {(primaryCount > 0 || secondaryCount > 0) && (
          <div style={{
            padding: '10px 14px', borderTop: `1px solid ${t.border}`,
            background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
          }}>
            <div style={{ ...labelStyle, marginBottom: 6 }}>Selection Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {TEMPLATES.filter(tp => designations[tp.id] === 'primary').map(tp => (
                <div key={tp.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: t.emerald, fontFamily: t.fontM, fontSize: 10, fontWeight: 700 }}>★</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft }}>{tp.title}</span>
                </div>
              ))}
              {TEMPLATES.filter(tp => designations[tp.id] === 'secondary').map(tp => (
                <div key={tp.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: t.amber, fontFamily: t.fontM, fontSize: 10, fontWeight: 700 }}>◆</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft }}>{tp.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare Toggle */}
        <div style={{ padding: '10px 12px', borderTop: `1px solid ${t.border}` }}>
          <button
            onClick={() => {
              const next = !compareMode;
              setCompareMode(next);
              if (!next) setCompareId(null);
              else {
                const other = TEMPLATES.find(tp => tp.id !== selectedId);
                if (other) setCompareId(other.id);
              }
            }}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: t.r.sm,
              border: `1px solid ${compareMode ? t.violet + '50' : t.border}`,
              background: compareMode ? t.violet + '12' : t.bgInput,
              color: compareMode ? t.violet : t.textMuted,
              fontFamily: t.fontD, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>{compareMode ? '◈' : '⬡'}</span>
            {compareMode ? 'Exit Compare' : 'Compare Templates'}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div style={{
          height: 48, background: t.bgPanel, borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* View Toggle */}
            <div style={{
              display: 'inline-flex', borderRadius: 7, overflow: 'hidden',
              border: `1px solid ${t.border}`, background: t.bgInput,
            }}>
              {([
                { key: 'templates' as const, label: 'Templates & Requirements', icon: '◧' },
                { key: 'gtt-future' as const, label: 'GTT Future State', icon: '◈' },
              ]).map((v, i) => {
                const active = studioView === v.key;
                const vc = v.key === 'gtt-future' ? t.emerald : t.accent;
                return (
                  <button key={v.key} onClick={() => setStudioView(v.key)}
                    style={{
                      padding: '5px 14px', border: 'none',
                      borderRight: i === 0 ? `1px solid ${t.border}` : 'none',
                      background: active ? vc + '15' : 'transparent',
                      color: active ? vc : t.textDim,
                      fontFamily: t.fontD, fontSize: 10, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                    <span style={{ fontSize: 12 }}>{v.icon}</span> {v.label}
                  </button>
                );
              })}
            </div>
            <Chip color={accent} small>{selected.title}</Chip>
            {studioView === 'templates' && compared && (
              <>
                <span style={{ color: t.textDim, fontSize: 11 }}>vs</span>
                <Chip color={accentFor(compared.accentColor)} small>{compared.title}</Chip>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {primaryCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: t.emerald, fontSize: 11 }}>★</span>
                <Mono size={9} color={t.emerald}>{primaryCount} primary</Mono>
              </div>
            )}
            {secondaryCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: t.amber, fontSize: 11 }}>◆</span>
                <Mono size={9} color={t.amber}>{secondaryCount} secondary</Mono>
              </div>
            )}
            <div style={{ width: 1, height: 16, background: t.border }} />
            <Mono size={9}>{Object.values(checkedItems).filter(Boolean).length} items checked</Mono>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {studioView === 'gtt-future' ? (
            <GttFutureState useCaseId={selectedId} onBack={() => setStudioView('templates')} />
          ) : compareMode && compared ? (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: 20, borderRight: `1px solid ${t.border}` }}>
                {renderTemplateContent(selected, true)}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {renderTemplateContent(compared, true)}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {renderTemplateContent(selected)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureStudio;
