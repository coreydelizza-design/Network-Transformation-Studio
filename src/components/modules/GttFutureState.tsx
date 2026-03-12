import React, { useState } from 'react';
import { useTheme } from '../../theme/useTheme';
import { Chip, Mono } from '../shared/Primitives';

/* ═══════════════════════════════════════════════════════════════════════════
   GTT FUTURE-STATE SOLUTION DATA
   ═══════════════════════════════════════════════════════════════════════════ */

interface GttSolution {
  useCaseId: string;
  title: string;
  solutionName: string;
  icon: string;
  accentColor: 'cyan' | 'violet' | 'emerald' | 'rose';
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

const GTT_SOLUTIONS: GttSolution[] = [
  {
    useCaseId: 'on-demand',
    title: 'On-Demand Connectivity',
    solutionName: 'GTT Envision — On-Demand Network Fabric',
    icon: '⚡',
    accentColor: 'cyan',
    narrative: 'GTT delivers on-demand connectivity through the Envision intelligent networking platform, providing API-first, consumption-based network services across a global Tier 1 IP backbone spanning 260+ PoPs in over 200 markets. The GTT on-demand fabric enables sub-hour provisioning of private, internet, and cloud-connect services with elastic bandwidth scaling from 50 Mbps to 100 Gbps — all orchestrated through a unified portal, RESTful APIs, or infrastructure-as-code integrations. Enterprises gain the agility to spin up connections for M&A integrations, seasonal workloads, and DR activation without traditional circuit lead times or long-term commitments.',
    architectureHighlights: [
      { label: 'Global Backbone', detail: 'Tier 1 IP backbone with 260+ PoPs across Americas, EMEA, and APAC. Fully meshed core with sub-50ms latency between major metros.', icon: '🌐' },
      { label: 'Elastic Provisioning', detail: 'Real-time bandwidth allocation from 50 Mbps to 100 Gbps with granular 10 Mbps increments. No truck rolls, no lead times.', icon: '📊' },
      { label: 'API-First Orchestration', detail: 'Full lifecycle management via RESTful APIs — provision, modify, monitor, and decommission connections programmatically.', icon: '🔗' },
      { label: 'Multi-Service Fabric', detail: 'Single fabric supports Layer 2 point-to-point, Layer 3 VPN, internet, and direct cloud connects — all on-demand.', icon: '🔀' },
      { label: 'Consumption Billing', detail: 'Pay-per-use metering with configurable committed floors and burstable ceilings. Real-time cost visibility and chargeback support.', icon: '💳' },
      { label: 'SLA-Backed', detail: '99.99% availability SLA on backbone, 99.95% on access. Guaranteed provisioning SLAs with service credits.', icon: '🛡' },
    ],
    orchestration: {
      title: 'Envision Orchestration Platform',
      points: [
        'Single-pane portal for real-time provisioning, monitoring, and lifecycle management',
        'RESTful API with OpenAPI 3.0 spec — supports Terraform, Pulumi, and Ansible providers',
        'Automated service validation and acceptance testing on each provisioning event',
        'Role-based access control with SSO/SAML integration for enterprise identity',
        'Real-time telemetry dashboards with per-flow bandwidth, latency, and loss metrics',
        'Event-driven webhooks for ServiceNow, PagerDuty, and custom ITSM integration',
        'Self-service bandwidth modification with zero-downtime scaling',
        'Programmable network intent policies for automated traffic engineering',
      ],
    },
    connectivityModel: {
      title: 'Connectivity Architecture',
      underlay: [
        'GTT Tier 1 IP backbone (AS 3257) with full transit-free peering',
        'Dense metro fiber rings with diverse last-mile access options',
        'NNI peering with 100+ regional and local access providers',
        'Wavelength and dark fiber options for ultra-high bandwidth requirements',
      ],
      overlay: [
        'MPLS-based L3 VPN with per-tenant VRF isolation',
        'VPLS/EVPN Layer 2 stretch for data center interconnect',
        'IPsec encrypted overlay for internet-based connectivity',
        'Segment Routing (SR-MPLS) for traffic engineering flexibility',
      ],
      model: 'Hub-and-spoke, any-to-any mesh, or hybrid topologies — all configurable on-demand. Each connection is an independent service instance with dedicated bandwidth guarantees and independent SLA tracking.',
    },
    integrations: {
      cloud: [
        'AWS Direct Connect — on-demand via GTT CloudConnect with hosted and dedicated options',
        'Azure ExpressRoute — automated provisioning through GTT partner peering',
        'Google Cloud Interconnect — partner and dedicated interconnect support',
        'Oracle FastConnect, IBM Direct Link, and 20+ cloud on-ramps',
      ],
      security: [
        'Integrated DDoS mitigation with GTT DDoS Shield (volumetric + application-layer)',
        'Clean-pipe internet services with BGP Flowspec filtering',
        'IPsec encryption on all overlay connections with AES-256-GCM',
        'Optional Managed Firewall service at GTT PoPs for edge security enforcement',
      ],
      edge: [
        'GTT Connect — managed last-mile with SD-WAN CPE options at branch locations',
        'Colocation cross-connects at 500+ data centers globally',
        'Edge compute hosting at select GTT PoPs for latency-sensitive workloads',
        'IoT connectivity options for distributed sensor and device networks',
      ],
      api: [
        'OpenAPI 3.0 specification with interactive Swagger documentation',
        'Terraform provider (registry.terraform.io/providers/gtt) for IaC workflows',
        'Webhook event streams for real-time status, billing, and SLA notifications',
        'Bulk operations API for fleet-wide changes across hundreds of connections',
      ],
    },
    keyValueBullets: [
      'Provision connectivity in under 60 minutes vs. 45-90 day industry average',
      'Eliminate 100% of stranded bandwidth costs with consumption-based billing',
      'Reduce network procurement cycle from weeks to API calls',
      'Achieve 99.99% backbone availability with proactive path optimization',
      'Integrate network provisioning directly into CI/CD and DevOps pipelines',
      'Scale from 50 Mbps to 100 Gbps on a single connection without contract changes',
      'Unify multi-cloud connectivity under a single orchestration platform',
      'Support M&A integration timelines with zero long-term commitment risk',
    ],
    diagramNodes: [
      { label: 'GTT Envision\nPortal & API', icon: '🎛', x: 280, y: 10, group: 'control', tier: 0 },
      { label: 'Orchestration\nEngine', icon: '⚙️', x: 280, y: 90, group: 'control', tier: 0 },
      { label: 'GTT Tier 1\nBackbone', icon: '🌐', x: 280, y: 190, group: 'core', tier: 1 },
      { label: 'Branch\nSite A', icon: '🏢', x: 40, y: 300, group: 'edge', tier: 2 },
      { label: 'Branch\nSite B', icon: '🏢', x: 160, y: 300, group: 'edge', tier: 2 },
      { label: 'Data\nCenter', icon: '🏗', x: 280, y: 300, group: 'dc', tier: 2 },
      { label: 'AWS\nDirect Connect', icon: '☁️', x: 400, y: 300, group: 'cloud', tier: 2 },
      { label: 'Azure\nExpressRoute', icon: '☁️', x: 520, y: 300, group: 'cloud', tier: 2 },
      { label: 'Metering &\nBilling', icon: '📊', x: 480, y: 90, group: 'control', tier: 0 },
      { label: 'DDoS\nShield', icon: '🛡', x: 80, y: 90, group: 'security', tier: 0 },
    ],
    diagramEdges: [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [1, 8], [9, 2]],
    differentiators: [
      { title: 'Tier 1 Backbone Ownership', detail: 'GTT owns and operates a global Tier 1 IP backbone (AS 3257) — no resold capacity, no third-party dependencies on core routing. This means deterministic performance, full route control, and the ability to engineer traffic paths that multi-tenant overlay providers cannot match.' },
      { title: 'True Sub-Hour Provisioning', detail: 'Unlike competitors who quote "on-demand" but require manual LOAs and cross-connects, GTT pre-stages capacity across metro fiber rings and NNI partners. API-triggered provisioning activates pre-positioned circuits with automated validation — genuine sub-60-minute delivery.' },
      { title: 'Consumption-Native Billing', detail: 'GTT\'s metering engine was built for consumption economics — not retrofitted onto legacy MPLS billing. Per-minute granularity, committed floor with burstable ceiling, and real-time cost APIs enable FinOps integration that traditional telcos cannot support.' },
      { title: 'Cloud-Native Integration Depth', detail: 'GTT maintains direct peering and partner interconnects with all major CSPs. On-demand cloud connects are provisioned through native CSP APIs — no manual cross-connect tickets, no partner queue delays.' },
      { title: 'Global Reach Without Complexity', detail: '260+ PoPs across 200+ markets with consistent API and portal experience everywhere. Same provisioning SLAs whether connecting offices in Manhattan or manufacturing sites in Southeast Asia.' },
    ],
    implementationNotes: [
      { phase: 'Phase 0', title: 'Discovery & Design', detail: 'GTT solution architects conduct site surveys, validate access options, and design the on-demand fabric topology. API credentials and Terraform modules are provisioned for the customer\'s IaC pipeline.', duration: '1-2 weeks' },
      { phase: 'Phase 1', title: 'Core Fabric Activation', detail: 'GTT backbone interconnects and cloud on-ramps are activated. Portal and API access goes live. Initial pilot connections are provisioned and validated with automated acceptance testing.', duration: '2-3 weeks' },
      { phase: 'Phase 2', title: 'Site Onboarding', detail: 'Branch and data center sites are onboarded to the on-demand fabric in waves. Each site activation includes last-mile provisioning, CPE deployment (if applicable), and automated connectivity validation.', duration: '4-8 weeks (wave-based)' },
      { phase: 'Phase 3', title: 'Optimization & Handoff', detail: 'Traffic engineering policies are tuned based on real-world telemetry. ITSM integrations are validated end-to-end. Customer operations team receives runbook documentation and completes enablement training.', duration: '2 weeks' },
    ],
  },
  {
    useCaseId: 'multi-cloud',
    title: 'Multi-Cloud Connectivity',
    solutionName: 'GTT CloudConnect — Unified Multi-Cloud Fabric',
    icon: '☁️',
    accentColor: 'violet',
    narrative: 'GTT CloudConnect delivers a unified multi-cloud interconnect fabric that abstracts the complexity of managing disparate cloud networking across AWS, Azure, GCP, Oracle, and 20+ cloud and SaaS platforms. Built on GTT\'s Tier 1 backbone with dedicated cloud exchange peering in every major cloud region, CloudConnect provides deterministic low-latency paths between clouds, on-premises data centers, and SaaS endpoints — all managed through a single orchestration layer. Enterprises gain consistent network policy enforcement, correlated cross-cloud telemetry, and egress-optimized routing that can reduce cloud networking costs by 30-50%.',
    architectureHighlights: [
      { label: 'Cloud Exchange Fabric', detail: 'Direct peering at 40+ cloud exchange points globally. Dedicated interconnects to all major CSPs with automated provisioning.', icon: '☁️' },
      { label: 'Egress Optimization', detail: 'Intelligent routing engine that selects optimal egress paths to minimize CSP data transfer charges. Policy-based routing across clouds.', icon: '💰' },
      { label: 'Unified Policy Engine', detail: 'Single policy definition propagates consistently across all cloud environments — micro-segmentation, access control, and encryption.', icon: '🔒' },
      { label: 'Cross-Cloud Telemetry', detail: 'Correlated flow analytics across cloud boundaries with application-level performance metrics and dependency mapping.', icon: '📊' },
      { label: 'Hybrid DNS', detail: 'Managed DNS resolution service that works seamlessly across on-premises, multi-cloud, and SaaS environments.', icon: '🌐' },
      { label: 'MACsec Encryption', detail: 'Hardware-accelerated MACsec encryption on all interconnect links — line-rate encryption with zero performance penalty.', icon: '🛡' },
    ],
    orchestration: {
      title: 'CloudConnect Orchestration Layer',
      points: [
        'Unified dashboard showing all cloud interconnects, bandwidth utilization, and cross-cloud traffic flows',
        'Automated cloud interconnect provisioning — Direct Connect, ExpressRoute, Cloud Interconnect — through single API',
        'Egress cost analytics with real-time routing recommendations and automated policy enforcement',
        'Cross-cloud network policy synchronization with drift detection and remediation',
        'VPC/VNet lifecycle automation with Terraform modules for each major CSP',
        'Performance SLA monitoring with per-cloud and per-application latency tracking',
        'Capacity planning engine with predictive analytics for bandwidth right-sizing',
        'Multi-tenant isolation with per-workload segmentation across shared interconnects',
      ],
    },
    connectivityModel: {
      title: 'Multi-Cloud Interconnect Architecture',
      underlay: [
        'GTT backbone with dedicated cloud exchange capacity at major CSP regions',
        'Direct physical cross-connects at Equinix, Digital Realty, CoreSite, and 50+ colocation facilities',
        'Diverse path engineering with automatic failover between primary and secondary interconnects',
        '100GE+ interconnect capacity with elastic scaling per CSP',
      ],
      overlay: [
        'EVPN-VXLAN fabric for workload-level micro-segmentation across clouds',
        'IPsec mesh overlay for CSP-to-CSP traffic encryption',
        'SD-WAN integration layer for branch-to-cloud traffic optimization',
        'API gateway mesh for cross-cloud service discovery and routing',
      ],
      model: 'Hub-through-GTT topology where GTT\'s backbone serves as the intelligent intermediary between all cloud environments. Traffic flows through GTT\'s optimized routing engine rather than costly cloud-to-cloud peering, enabling egress optimization and consistent policy enforcement regardless of the source and destination cloud.',
    },
    integrations: {
      cloud: [
        'AWS Direct Connect — dedicated and hosted connections with Transit Gateway integration',
        'Azure ExpressRoute — Global Reach enabled with route filtering and Microsoft peering',
        'Google Cloud Interconnect — partner and dedicated with Cloud Router BGP integration',
        'Oracle FastConnect — 1-10 Gbps dedicated connections with OCI virtual circuit support',
        'IBM Cloud Direct Link — dedicated and connect options with VPC routing',
        'Multi-cloud Kubernetes networking — cross-cluster service mesh connectivity',
      ],
      security: [
        'MACsec on all physical interconnects (IEEE 802.1AE) with rotated keys',
        'IPsec overlay encryption for all cloud-to-cloud traffic with AES-256-GCM',
        'Micro-segmentation policies that translate to native CSP security group rules',
        'DDoS mitigation across all cloud ingress/egress points',
      ],
      edge: [
        'On-premises data center connectivity with sub-10ms latency to nearest GTT PoP',
        'Branch office direct cloud access via GTT SD-WAN integration',
        'Colocation cross-connects with pre-staged capacity for rapid scaling',
        'Edge compute integration for latency-sensitive multi-cloud workloads',
      ],
      api: [
        'Unified cloud interconnect API — single interface to provision connections to any CSP',
        'Egress cost optimization API with real-time routing recommendations',
        'Cross-cloud network policy API with intent-based configuration',
        'Terraform multi-cloud networking module library (AWS + Azure + GCP)',
      ],
    },
    keyValueBullets: [
      'Reduce cloud egress costs by 30-50% through GTT-optimized routing paths',
      'Achieve sub-10ms cross-cloud latency between major regions',
      'Eliminate siloed cloud networking with a single management plane',
      'Enforce consistent security policies across all cloud environments automatically',
      'Provision new cloud interconnects in hours vs. weeks through CSP portals',
      'Gain end-to-end visibility across cloud boundaries with correlated telemetry',
      'Support data residency and sovereignty requirements with policy-based routing',
      'Scale cloud interconnect capacity independently without renegotiating CSP agreements',
    ],
    diagramNodes: [
      { label: 'CloudConnect\nOrchestrator', icon: '🎛', x: 280, y: 10, group: 'control', tier: 0 },
      { label: 'Policy\nEngine', icon: '🔒', x: 120, y: 10, group: 'security', tier: 0 },
      { label: 'Egress\nOptimizer', icon: '💰', x: 440, y: 10, group: 'control', tier: 0 },
      { label: 'GTT Cloud\nExchange', icon: '🌐', x: 280, y: 120, group: 'core', tier: 1 },
      { label: 'AWS\nRegion', icon: '☁️', x: 60, y: 240, group: 'cloud', tier: 2 },
      { label: 'Azure\nRegion', icon: '☁️', x: 200, y: 240, group: 'cloud', tier: 2 },
      { label: 'GCP\nRegion', icon: '☁️', x: 360, y: 240, group: 'cloud', tier: 2 },
      { label: 'Oracle\nCloud', icon: '☁️', x: 500, y: 240, group: 'cloud', tier: 2 },
      { label: 'On-Prem\nDC', icon: '🏗', x: 120, y: 340, group: 'dc', tier: 3 },
      { label: 'SaaS\nPlatforms', icon: '📦', x: 440, y: 340, group: 'saas', tier: 3 },
    ],
    diagramEdges: [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9]],
    differentiators: [
      { title: 'Backbone-as-Cloud-Fabric', detail: 'Unlike overlay-only multi-cloud providers, GTT\'s Tier 1 backbone serves as the physical interconnect layer between clouds. Traffic stays on GTT-owned infrastructure rather than traversing the public internet or costly CSP peering — delivering deterministic performance and significant egress savings.' },
      { title: 'Native CSP Integration', detail: 'GTT maintains direct engineering relationships and API integrations with all major CSPs. CloudConnect provisions native cloud interconnects (Direct Connect, ExpressRoute, Cloud Interconnect) through GTT\'s API — not resold virtual circuits with additional latency hops.' },
      { title: 'Egress Cost Intelligence', detail: 'GTT\'s egress optimization engine analyzes real-time traffic patterns and CSP pricing to route cross-cloud traffic through the most cost-effective path. Customers typically see 30-50% reduction in cloud networking costs within the first quarter.' },
      { title: 'Cross-Cloud Policy Consistency', detail: 'CloudConnect\'s unified policy engine translates intent-based network policies into CSP-native security constructs (AWS Security Groups, Azure NSGs, GCP Firewall Rules) — ensuring identical enforcement regardless of which cloud hosts the workload.' },
    ],
    implementationNotes: [
      { phase: 'Phase 0', title: 'Cloud Environment Assessment', detail: 'GTT cloud architects assess current multi-cloud topology, traffic patterns, and egress costs. Design optimal interconnect placement and routing policy.', duration: '2 weeks' },
      { phase: 'Phase 1', title: 'Core Interconnect Activation', detail: 'Primary cloud exchange interconnects are activated at each CSP region. MACsec encryption is configured and validated. Egress optimization policies are baselined.', duration: '3-4 weeks' },
      { phase: 'Phase 2', title: 'Policy & Telemetry Deployment', detail: 'Unified network policies are deployed across all cloud environments. Cross-cloud telemetry correlation is activated. Egress optimization engine begins active routing.', duration: '2-3 weeks' },
      { phase: 'Phase 3', title: 'Optimization & Operations', detail: 'Egress cost optimization is tuned based on 30-day traffic baselines. Operations team is trained on CloudConnect portal and API. Runbooks are validated through DR simulation.', duration: '2 weeks' },
    ],
  },
  {
    useCaseId: 'sdwan',
    title: 'SD-WAN',
    solutionName: 'GTT Managed SD-WAN — Intelligent Branch Networking',
    icon: '🔀',
    accentColor: 'emerald',
    narrative: 'GTT Managed SD-WAN transforms branch and campus networking by combining GTT\'s global underlay infrastructure with best-of-breed SD-WAN overlay technology — available through partnerships with VMware VeloCloud, Fortinet, and Versa Networks. GTT delivers the full stack: diverse underlay transport (MPLS, DIA, broadband, LTE/5G), SD-WAN CPE deployment, centralized policy orchestration, and 24/7 NOC-backed operations. The solution replaces rigid, expensive MPLS-only architectures with intelligent, application-aware path selection that optimizes performance while reducing WAN costs by 30-60%.',
    architectureHighlights: [
      { label: 'Multi-Vendor Choice', detail: 'VMware VeloCloud, Fortinet Secure SD-WAN, or Versa FlexVNF — customer selects best-fit platform. GTT operates all three with certified engineering teams.', icon: '🔀' },
      { label: 'Integrated Underlay', detail: 'GTT delivers MPLS, DIA, broadband, and LTE/5G as bundled underlay transport. Single provider for overlay + underlay eliminates finger-pointing.', icon: '📡' },
      { label: 'Application Intelligence', detail: 'Deep packet inspection identifies 3,000+ applications. Per-app SLA policies route traffic across optimal paths in real-time.', icon: '🧠' },
      { label: 'Zero-Touch Deployment', detail: 'Pre-staged CPE shipped directly to site. Device auto-provisions from cloud orchestrator — no on-site engineer required.', icon: '📦' },
      { label: 'Cloud-Integrated', detail: 'Direct cloud breakout to AWS, Azure, GCP via GTT CloudConnect. Eliminates backhaul latency for SaaS and cloud workloads.', icon: '☁️' },
      { label: 'GTT NOC Operations', detail: '24/7/365 GTT Network Operations Center monitors, troubleshoots, and optimizes the SD-WAN fabric. Proactive alerting and incident management.', icon: '🎛' },
    ],
    orchestration: {
      title: 'GTT SD-WAN Management Platform',
      points: [
        'Centralized orchestrator with real-time visibility into all branch sites and transport links',
        'Application-aware policy engine with drag-and-drop SLA policy creation',
        'Per-application, per-site performance dashboards with historical trending',
        'Automated failover and path selection with sub-second switchover',
        'Bandwidth aggregation across multiple underlay links for maximum throughput',
        'WAN optimization (FEC, dedup, compression) configurable per application class',
        'Segmentation with per-tenant VRF isolation for regulatory and compliance use cases',
        'Change management workflow integration with approval gates and rollback capability',
      ],
    },
    connectivityModel: {
      title: 'SD-WAN Transport Architecture',
      underlay: [
        'GTT MPLS — dedicated Layer 3 VPN with guaranteed SLAs for critical traffic',
        'GTT Dedicated Internet Access (DIA) — symmetric bandwidth with GTT backbone routing',
        'Third-party broadband — cable, fiber, DSL aggregation with GTT tunnel orchestration',
        'LTE/5G cellular — primary or failover with pooled data plans across sites',
      ],
      overlay: [
        'AES-256 IPsec encrypted tunnels across all underlay transports',
        'Dynamic path selection based on real-time latency, jitter, and loss measurements',
        'Application-specific tunnel policies (e.g., voice over MPLS, web over broadband)',
        'Mesh tunnels between sites with automatic topology discovery',
      ],
      model: 'Hybrid hub-spoke and dynamic mesh topology. Hub sites maintain full-mesh connectivity to all branch locations. Branch-to-branch traffic can traverse direct mesh tunnels when demand warrants. Cloud traffic exits at the nearest GTT PoP via CloudConnect integration.',
    },
    integrations: {
      cloud: [
        'GTT CloudConnect integration for direct cloud breakout at GTT PoPs',
        'Virtual SD-WAN gateways in AWS, Azure, and GCP for cloud workload connectivity',
        'SaaS application optimization with direct breakout and application-aware steering',
        'Cloud security service chaining (Zscaler, Netskope, Palo Alto Prisma) via service insertion',
      ],
      security: [
        'Integrated next-gen firewall on SD-WAN CPE (Fortinet platform)',
        'URL filtering and intrusion prevention (IPS) at branch edge',
        'Micro-segmentation with per-VLAN security policy enforcement',
        'Security service chaining to cloud-delivered SSE platforms',
      ],
      edge: [
        'Managed CPE lifecycle — provisioning, monitoring, firmware, and hardware replacement',
        'Dual-CPE high-availability option for critical sites',
        'IoT segmentation with dedicated VLANs and restricted internet access policies',
        'Guest WiFi isolation with captive portal and bandwidth throttling',
      ],
      api: [
        'REST API for site provisioning and policy management automation',
        'SNMP and streaming telemetry for integration with existing NMS platforms',
        'ServiceNow CMDB synchronization for asset and change management',
        'Custom reporting API for executive dashboard and chargeback workflows',
      ],
    },
    keyValueBullets: [
      'Reduce WAN costs by 30-60% by replacing MPLS-only with hybrid transport',
      'Improve SaaS/cloud application performance by 40-70% with local internet breakout',
      'Deploy new branch sites in days vs. months with zero-touch provisioning',
      'Achieve 99.99% WAN availability through intelligent multi-path failover',
      'Gain application-level visibility across all branch locations from a single dashboard',
      'Eliminate branch firewall sprawl with integrated security on SD-WAN CPE',
      'Single provider accountability for overlay + underlay eliminates vendor finger-pointing',
      'GTT 24/7 NOC operations reduces internal network team burden by 50%+',
    ],
    diagramNodes: [
      { label: 'GTT SD-WAN\nOrchestrator', icon: '🎛', x: 280, y: 10, group: 'control', tier: 0 },
      { label: 'GTT\nNOC', icon: '👁', x: 480, y: 10, group: 'control', tier: 0 },
      { label: 'GTT Backbone\n+ CloudConnect', icon: '🌐', x: 280, y: 110, group: 'core', tier: 1 },
      { label: 'Hub\nGateway', icon: '🏗', x: 120, y: 110, group: 'dc', tier: 1 },
      { label: 'Cloud\nGateway', icon: '☁️', x: 440, y: 110, group: 'cloud', tier: 1 },
      { label: 'Branch\nCPE 1', icon: '🏢', x: 40, y: 240, group: 'edge', tier: 2 },
      { label: 'Branch\nCPE 2', icon: '🏢', x: 160, y: 240, group: 'edge', tier: 2 },
      { label: 'Branch\nCPE 3', icon: '🏢', x: 280, y: 240, group: 'edge', tier: 2 },
      { label: 'Branch\nCPE 4', icon: '🏢', x: 400, y: 240, group: 'edge', tier: 2 },
      { label: 'Retail\nCPE 5', icon: '🏪', x: 520, y: 240, group: 'edge', tier: 2 },
      { label: 'SSE\nService', icon: '🛡', x: 80, y: 10, group: 'security', tier: 0 },
    ],
    diagramEdges: [[0, 2], [0, 3], [0, 4], [1, 0], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [3, 2], [4, 2], [10, 2]],
    differentiators: [
      { title: 'Overlay + Underlay Integration', detail: 'GTT is one of the few global providers that delivers both the SD-WAN overlay and the underlying transport (MPLS, DIA, broadband) as an integrated solution. Single contract, single SLA, single NOC — no finger-pointing between overlay vendor and transport provider.' },
      { title: 'Multi-Vendor Platform Flexibility', detail: 'Unlike single-vendor managed SD-WAN providers, GTT offers VMware VeloCloud, Fortinet, and Versa — allowing customers to select the platform that best fits their technical requirements, existing security stack, and organizational preferences.' },
      { title: 'Global Managed Service at Scale', detail: 'GTT operates SD-WAN fabrics for enterprises with 50 to 5,000+ sites across 200+ markets. Local access procurement, CPE logistics, and 24/7 NOC operations are handled globally with consistent service delivery regardless of geography.' },
      { title: 'Integrated Cloud & Security', detail: 'SD-WAN integrates directly with GTT CloudConnect for optimal cloud breakout and with GTT\'s security partners for SASE convergence — creating a unified networking + security + cloud fabric managed by a single provider.' },
      { title: 'Proven Migration Methodology', detail: 'GTT has executed hundreds of MPLS-to-SD-WAN migrations with a proven, phased methodology that ensures zero downtime. Parallel running periods, automated validation, and rollback capability are standard on every deployment.' },
    ],
    implementationNotes: [
      { phase: 'Phase 0', title: 'Assessment & Design', detail: 'GTT conducts site survey, application profiling, and transport assessment for all locations. SD-WAN platform selection is finalized and detailed design is produced.', duration: '2-3 weeks' },
      { phase: 'Phase 1', title: 'Hub & Pilot Deployment', detail: 'Hub gateway and cloud gateway are deployed. Pilot sites (5-10) are onboarded with full SD-WAN stack. Application policies are tuned and validated.', duration: '3-4 weeks' },
      { phase: 'Phase 2', title: 'Branch Rollout', detail: 'Remaining sites are onboarded in waves of 10-20 per week. Zero-touch provisioning is used where possible. Legacy MPLS runs in parallel during transition.', duration: '8-16 weeks (site count dependent)' },
      { phase: 'Phase 3', title: 'MPLS Decommission & Optimization', detail: 'Legacy MPLS circuits are decommissioned after SD-WAN validation at each site. Application policies are optimized based on production telemetry.', duration: '4-6 weeks' },
    ],
  },
  {
    useCaseId: 'sase',
    title: 'SASE',
    solutionName: 'GTT Secure Connect — Converged SASE Platform',
    icon: '🛡',
    accentColor: 'rose',
    narrative: 'GTT Secure Connect delivers a fully converged SASE (Secure Access Service Edge) solution that unifies SD-WAN networking with cloud-delivered Security Service Edge (SSE) — combining Secure Web Gateway (SWG), Zero Trust Network Access (ZTNA), Cloud Access Security Broker (CASB), Firewall-as-a-Service (FWaaS), and Data Loss Prevention (DLP) into a single managed platform. Built on partnerships with Zscaler, Palo Alto Prisma Access, and Fortinet, and delivered over GTT\'s global backbone, Secure Connect eliminates the branch security appliance stack while ensuring consistent zero trust enforcement for every user, device, and application — regardless of location.',
    architectureHighlights: [
      { label: 'Converged Architecture', detail: 'SD-WAN + SSE in a single managed platform. Networking and security policies are unified — not bolted together from separate consoles.', icon: '🏗' },
      { label: 'Zero Trust Enforcement', detail: 'Identity-centric access control with continuous verification. Every session is authenticated, authorized, and encrypted regardless of network location.', icon: '🔐' },
      { label: 'Global SSE PoP Coverage', detail: '150+ SSE enforcement points worldwide ensure sub-25ms security inspection latency for users in any geography.', icon: '🌐' },
      { label: 'TLS Inspection at Scale', detail: 'Full TLS 1.3 decryption and inspection at line rate. Certificate management and exception handling are automated and monitored.', icon: '🔍' },
      { label: 'Unified DLP', detail: 'Inline and API-based data loss prevention across web, SaaS, and private applications with customizable policies and incident workflows.', icon: '🛡' },
      { label: 'Digital Experience Monitoring', detail: 'End-to-end path visibility from user device through SSE to application — proactive detection of performance degradation.', icon: '📊' },
    ],
    orchestration: {
      title: 'GTT Secure Connect Management',
      points: [
        'Unified portal for SD-WAN networking and SSE security policy management',
        'Identity provider integration (Okta, Azure AD, Ping) for user-context security policies',
        'Application discovery and classification with shadow IT detection',
        'Real-time threat intelligence feeds with automated policy enforcement',
        'Incident response workflow with SIEM/SOAR integration (Splunk, Sentinel, QRadar)',
        'Compliance reporting dashboards for NIST, ISO 27001, SOC2, and GDPR',
        'Digital Experience Monitoring (DEM) with synthetic and real-user performance tracking',
        'Change management with approval workflows and policy rollback capability',
      ],
    },
    connectivityModel: {
      title: 'SASE Connectivity Architecture',
      underlay: [
        'GTT SD-WAN underlay (MPLS, DIA, broadband, LTE/5G) for branch connectivity',
        'GTT backbone direct-path to nearest SSE enforcement PoP',
        'Client connector (agent) for remote user traffic steering to SSE cloud',
        'Agentless browser access for BYOD and third-party contractor scenarios',
      ],
      overlay: [
        'GRE/IPsec tunnels from SD-WAN CPE to SSE enforcement PoP',
        'ZTNA application tunnels replacing legacy VPN concentrators',
        'CASB API connectors for out-of-band SaaS data inspection',
        'Browser isolation sessions for high-risk web categories',
      ],
      model: 'All traffic — branch, remote user, and cloud — routes through GTT\'s nearest SSE enforcement PoP for consistent security inspection. SD-WAN CPEs steer traffic via GRE/IPsec tunnels. Remote users connect via lightweight client connector. The SSE PoP applies the full security stack (SWG, ZTNA, CASB, FWaaS, DLP) before forwarding to the destination application.',
    },
    integrations: {
      cloud: [
        'Native integration with AWS, Azure, and GCP for inline cloud workload security',
        'SaaS application connectors for Office 365, Salesforce, Box, and 100+ apps',
        'Cloud workload protection with east-west traffic inspection',
        'Service mesh security for Kubernetes-based microservices architectures',
      ],
      security: [
        'Zscaler ZIA + ZPA — SWG, ZTNA, and CASB as GTT-managed security services',
        'Palo Alto Prisma Access — cloud-delivered NGFW with advanced threat prevention',
        'Fortinet SASE — integrated FortiGate + FortiClient for unified threat management',
        'Threat intelligence — GTT aggregates feeds from 30+ sources for real-time protection',
      ],
      edge: [
        'Managed SD-WAN CPE with security service chaining at branch edge',
        'Client connector deployment and lifecycle management for remote users',
        'IoT device profiling and segmentation with restricted access policies',
        'Guest network isolation with separate security policy enforcement',
      ],
      api: [
        'Security policy API for automated rule management and compliance enforcement',
        'Threat intelligence API with IOC feeds and custom blocklist management',
        'User activity API for SIEM integration and security analytics',
        'Compliance reporting API for automated audit evidence collection',
      ],
    },
    keyValueBullets: [
      'Consolidate 5-8 security point products into a single managed SASE platform',
      'Reduce branch security hardware costs by 70% by eliminating appliance stacks',
      'Enable zero trust access for 100% of users — office, remote, and mobile',
      'Achieve consistent security posture across all locations and user types',
      'Improve SaaS application performance by 40% with direct-to-cloud security inspection',
      'Reduce mean-time-to-detect (MTTD) by 60% with unified security telemetry',
      'Meet NIST, ISO 27001, and SOC2 compliance with automated reporting and audit trails',
      'GTT-managed operations reduces security team burden by 50% for routine policy management',
    ],
    diagramNodes: [
      { label: 'GTT Secure\nConnect Portal', icon: '🎛', x: 280, y: 10, group: 'control', tier: 0 },
      { label: 'Identity\nProvider', icon: '🔐', x: 120, y: 10, group: 'security', tier: 0 },
      { label: 'Threat\nIntel', icon: '👁', x: 440, y: 10, group: 'security', tier: 0 },
      { label: 'SSE Cloud\n(SWG+ZTNA+CASB)', icon: '🛡', x: 280, y: 110, group: 'core', tier: 1 },
      { label: 'FWaaS', icon: '🔥', x: 120, y: 110, group: 'security', tier: 1 },
      { label: 'DLP\nEngine', icon: '📋', x: 440, y: 110, group: 'security', tier: 1 },
      { label: 'Remote\nUsers', icon: '👤', x: 40, y: 260, group: 'edge', tier: 2 },
      { label: 'Branch\nSD-WAN', icon: '🏢', x: 180, y: 260, group: 'edge', tier: 2 },
      { label: 'SaaS\nApps', icon: '📦', x: 360, y: 260, group: 'saas', tier: 2 },
      { label: 'Private\nApps', icon: '🏗', x: 520, y: 260, group: 'dc', tier: 2 },
      { label: 'SIEM /\nSOAR', icon: '📊', x: 560, y: 10, group: 'control', tier: 0 },
    ],
    diagramEdges: [[0, 3], [1, 3], [2, 3], [3, 4], [3, 5], [6, 3], [7, 3], [3, 8], [3, 9], [3, 10]],
    differentiators: [
      { title: 'True Convergence, Not Integration', detail: 'GTT Secure Connect delivers SD-WAN and SSE as a unified managed service — not separate products stitched together with API bridges. Single policy console, single support path, single SLA. This eliminates the operational overhead of managing two vendors and the gaps that emerge at integration boundaries.' },
      { title: 'Multi-Vendor SSE Choice', detail: 'GTT partners with Zscaler, Palo Alto, and Fortinet for the SSE layer — giving customers the ability to select the security platform that best aligns with their existing investments, compliance requirements, and technical preferences. No vendor lock-in.' },
      { title: 'GTT Backbone Advantage', detail: 'Remote and branch user traffic reaches the nearest SSE PoP via GTT\'s optimized backbone — not via commodity internet paths. This delivers lower latency to security inspection and better application performance compared to SASE providers that rely on public internet routing.' },
      { title: 'Managed Security Operations', detail: 'GTT\'s Security Operations team provides 24/7 monitoring, threat response, and policy management. Security events are triaged and escalated according to customer-defined runbooks — reducing the burden on internal security teams by 50% for routine operations.' },
      { title: 'Phased Migration Support', detail: 'GTT\'s SASE migration methodology supports phased convergence — start with ZTNA for remote users, expand to SWG for branch breakout, then add CASB and DLP. Existing security tool contracts are respected with parallel running periods until natural expiry.' },
    ],
    implementationNotes: [
      { phase: 'Phase 0', title: 'Security Assessment & Architecture', detail: 'GTT security architects assess current security stack, identify consolidation candidates, and design target SASE architecture. Identity provider integration and initial policy mapping are completed.', duration: '2-3 weeks' },
      { phase: 'Phase 1', title: 'ZTNA & Remote User Enablement', detail: 'ZTNA is deployed for remote/hybrid workforce — replacing legacy VPN infrastructure. Client connector is deployed to user devices. Identity-based access policies are activated.', duration: '3-4 weeks' },
      { phase: 'Phase 2', title: 'Branch SASE Convergence', detail: 'Branch SD-WAN CPEs are configured to steer traffic through SSE PoPs. SWG, CASB, and FWaaS policies are activated per site. Branch firewall appliances are decommissioned.', duration: '6-10 weeks (wave-based)' },
      { phase: 'Phase 3', title: 'DLP & Advanced Security', detail: 'DLP policies are activated across web, SaaS, and private apps. Browser isolation is enabled for high-risk categories. Full compliance reporting is activated and validated.', duration: '3-4 weeks' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface GttFutureStateProps {
  useCaseId: string;
  onBack: () => void;
}

const GttFutureState: React.FC<GttFutureStateProps> = ({ useCaseId, onBack }) => {
  const { t, isDark } = useTheme();
  const [expandedDiff, setExpandedDiff] = useState<number | null>(null);

  const solution = GTT_SOLUTIONS.find(s => s.useCaseId === useCaseId);
  if (!solution) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: t.textMuted, fontFamily: t.fontB }}>
        No GTT solution mapping found for this use case.
      </div>
    );
  }

  const acc = t[solution.accentColor];

  /* ─── Shared Styles ─── */
  const panelStyle = (c: string): React.CSSProperties => ({
    background: t.bgCard, borderRadius: t.r.lg, border: `1px solid ${c}20`,
    padding: 20, backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden',
  });
  const glow = (c: string): React.CSSProperties => ({
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    background: `linear-gradient(90deg, transparent, ${c}50, transparent)`,
  });
  const label: React.CSSProperties = {
    fontFamily: t.fontM, fontSize: 9, color: t.textDim,
    letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10,
  };

  /* ─── Diagram ─── */
  const groupColors: Record<string, string> = {
    control: t.accent, core: acc, edge: t.amber, cloud: t.cyan,
    dc: t.violet, security: t.rose, saas: t.emerald,
  };

  const renderDiagram = () => (
    <svg viewBox="0 0 620 380" style={{ width: '100%', height: '100%', minHeight: 240 }}>
      <defs>
        <filter id="gtt-glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <linearGradient id="gtt-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={acc} stopOpacity="0.5" />
          <stop offset="100%" stopColor={acc} stopOpacity="0.12" />
        </linearGradient>
      </defs>
      {/* Tier bands */}
      {[0, 1, 2, 3].map(tier => {
        const nodes = solution.diagramNodes.filter(n => n.tier === tier);
        if (!nodes.length) return null;
        const minY = Math.min(...nodes.map(n => n.y)) - 15;
        const maxY = Math.max(...nodes.map(n => n.y)) + 60;
        return (
          <rect key={tier} x={5} y={minY} width={610} height={maxY - minY}
            rx={10} fill={acc} opacity={isDark ? 0.02 : 0.015}
            stroke={acc} strokeOpacity={0.06} strokeWidth={1} />
        );
      })}
      {/* Edges */}
      {solution.diagramEdges.map(([fi, ti], i) => {
        const from = solution.diagramNodes[fi];
        const to = solution.diagramNodes[ti];
        if (!from || !to) return null;
        const x1 = from.x + 35, y1 = from.y + 28, x2 = to.x + 35, y2 = to.y + 28;
        const dx = x2 - x1, dy = y2 - y1;
        return (
          <path key={i}
            d={`M ${x1} ${y1} C ${x1 + dx * 0.35} ${y1 + dy * 0.15}, ${x2 - dx * 0.35} ${y2 - dy * 0.15}, ${x2} ${y2}`}
            stroke="url(#gtt-edge)" strokeWidth={1.5} fill="none" filter="url(#gtt-glow)" />
        );
      })}
      {/* Nodes */}
      {solution.diagramNodes.map((node, i) => {
        const gc = groupColors[node.group] || acc;
        return (
          <g key={i}>
            <rect x={node.x} y={node.y} width={70} height={56} rx={10}
              fill={isDark ? gc + '0e' : gc + '0a'}
              stroke={gc + '30'} strokeWidth={1.2} />
            <rect x={node.x} y={node.y} width={70} height={2} rx={1}
              fill={gc} opacity={0.5} />
            <text x={node.x + 35} y={node.y + 20} textAnchor="middle"
              style={{ fontSize: 17 }}>{node.icon}</text>
            {node.label.split('\n').map((line, li) => (
              <text key={li} x={node.x + 35} y={node.y + 35 + li * 11} textAnchor="middle"
                style={{ fontSize: 8, fontFamily: t.fontM, fill: t.textSoft, fontWeight: 600 }}>{line}</text>
            ))}
          </g>
        );
      })}
    </svg>
  );

  /* ─── Integration Section ─── */
  const integrationSections: { key: keyof typeof solution.integrations; label: string; icon: string; color: string }[] = [
    { key: 'cloud', label: 'Cloud Integration', icon: '☁️', color: t.cyan },
    { key: 'security', label: 'Security Integration', icon: '🔒', color: t.rose },
    { key: 'edge', label: 'Edge & Access', icon: '📡', color: t.amber },
    { key: 'api', label: 'API & Automation', icon: '🔗', color: t.emerald },
  ];

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════════ */

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          ...panelStyle(acc), padding: '28px 32px',
          background: `linear-gradient(135deg, ${t.bgCard}, ${acc}06)`,
        }}>
          <div style={glow(acc)} />
          {/* Back + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <button onClick={onBack} style={{
              padding: '5px 12px', borderRadius: t.r.sm, border: `1px solid ${t.border}`,
              background: t.bgInput, color: t.textMuted, fontFamily: t.fontD, fontSize: 10, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span style={{ fontSize: 12 }}>←</span> Templates
            </button>
            <Mono size={8}>{solution.title}</Mono>
            <span style={{ color: t.textDim, fontFamily: t.fontM, fontSize: 8 }}>→</span>
            <Mono size={8} color={acc}>GTT FUTURE STATE</Mono>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: t.r.lg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, background: `linear-gradient(135deg, ${acc}25, ${acc}08)`,
              border: `1.5px solid ${acc}35`, boxShadow: `0 0 30px ${acc}18, inset 0 1px 0 rgba(255,255,255,0.05)`,
              flexShrink: 0,
            }}>{solution.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{
                  fontFamily: t.fontM, fontSize: 8, fontWeight: 700, padding: '3px 10px', borderRadius: 4,
                  background: acc + '15', color: acc, border: `1px solid ${acc}25`, letterSpacing: 1.5,
                }}>GTT FUTURE STATE</span>
              </div>
              <h1 style={{ fontFamily: t.fontD, fontSize: 24, fontWeight: 800, color: t.text, margin: '6px 0 0', letterSpacing: -0.5 }}>
                {solution.solutionName}
              </h1>
              <p style={{ fontFamily: t.fontB, fontSize: 13, color: t.textSoft, margin: '10px 0 0', lineHeight: 1.75, maxWidth: 800 }}>
                {solution.narrative}
              </p>
            </div>
          </div>
        </div>

        {/* ── ARCHITECTURE HIGHLIGHTS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {solution.architectureHighlights.map(h => (
            <div key={h.label} style={{ ...panelStyle(acc), padding: '16px 18px' }}>
              <div style={glow(acc)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{h.icon}</span>
                <span style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text }}>{h.label}</span>
              </div>
              <p style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.6, margin: 0 }}>{h.detail}</p>
            </div>
          ))}
        </div>

        {/* ── KEY VALUE BULLETS ── */}
        <div style={panelStyle(acc)}>
          <div style={glow(acc)} />
          <div style={label}>Key Value Outcomes</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {solution.keyValueBullets.map((v, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px',
                borderRadius: t.r.sm, background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
                border: `1px solid ${t.borderSubtle}`,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: acc + '12', color: acc, fontFamily: t.fontM, fontSize: 9, fontWeight: 800, flexShrink: 0, marginTop: 1,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── DIAGRAM ── */}
        <div style={panelStyle(acc)}>
          <div style={glow(acc)} />
          <div style={label}>GTT Future-State Architecture</div>
          <div style={{
            background: isDark ? 'rgba(6,10,20,0.5)' : 'rgba(240,242,245,0.7)',
            borderRadius: t.r.md, border: `1px solid ${t.borderSubtle}`, padding: 16,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: t.r.md,
              backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(40,55,85,0.18)' : 'rgba(148,163,184,0.12)'} 1px, transparent 1px)`,
              backgroundSize: '20px 20px', pointerEvents: 'none',
            }} />
            {renderDiagram()}
          </div>
        </div>

        {/* ── ORCHESTRATION + CONNECTIVITY MODEL (two-column) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Orchestration */}
          <div style={panelStyle(acc)}>
            <div style={glow(acc)} />
            <div style={label}>{solution.orchestration.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {solution.orchestration.points.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 10px',
                  borderRadius: t.r.sm, border: `1px solid ${t.borderSubtle}`,
                  background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
                }}>
                  <span style={{
                    color: acc, fontFamily: t.fontM, fontSize: 9, fontWeight: 700, flexShrink: 0, marginTop: 2,
                    width: 16, height: 16, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: acc + '10',
                  }}>⚙</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connectivity Model */}
          <div style={panelStyle(acc)}>
            <div style={glow(acc)} />
            <div style={label}>{solution.connectivityModel.title}</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.cyan, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                Underlay Transport
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {solution.connectivityModel.underlay.map((u, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: t.cyan, fontWeight: 700, fontSize: 8, marginTop: 3, flexShrink: 0 }}>▸</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.4 }}>{u}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.violet, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                Overlay Network
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {solution.connectivityModel.overlay.map((o, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: t.violet, fontWeight: 700, fontSize: 8, marginTop: 3, flexShrink: 0 }}>▸</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.4 }}>{o}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '12px 14px', borderRadius: t.r.sm,
              background: acc + '06', border: `1px solid ${acc}15`,
            }}>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: acc, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                Model
              </div>
              <p style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.6, margin: 0 }}>
                {solution.connectivityModel.model}
              </p>
            </div>
          </div>
        </div>

        {/* ── INTEGRATIONS GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {integrationSections.map(sec => (
            <div key={sec.key} style={panelStyle(sec.color)}>
              <div style={glow(sec.color)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{sec.icon}</span>
                <span style={{ ...label, marginBottom: 0, color: sec.color }}>{sec.label}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {solution.integrations[sec.key].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{
                      color: sec.color, fontWeight: 700, fontSize: 8, marginTop: 3, flexShrink: 0,
                      width: 12, height: 12, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: sec.color + '10',
                    }}>✦</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── GTT DIFFERENTIATION ── */}
        <div style={panelStyle(acc)}>
          <div style={glow(acc)} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${acc}25, ${acc}10)`, border: `1px solid ${acc}30`,
              fontFamily: t.fontD, fontSize: 11, fontWeight: 900, color: acc,
            }}>G</div>
            <div style={label}>GTT Differentiation</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {solution.differentiators.map((d, i) => (
              <div key={i}
                onClick={() => setExpandedDiff(expandedDiff === i ? null : i)}
                style={{
                  padding: '14px 16px', borderRadius: t.r.md, cursor: 'pointer', transition: 'all 0.2s',
                  background: expandedDiff === i ? acc + '08' : isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
                  border: `1px solid ${expandedDiff === i ? acc + '25' : t.borderSubtle}`,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: acc + '12', color: acc, fontFamily: t.fontM, fontSize: 9, fontWeight: 800, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text, flex: 1 }}>{d.title}</span>
                  <span style={{ color: t.textDim, fontSize: 12, transition: 'transform 0.2s', transform: expandedDiff === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
                {expandedDiff === i && (
                  <p style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.7, margin: '10px 0 0 32px' }}>
                    {d.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── IMPLEMENTATION NOTES ── */}
        <div style={panelStyle(acc)}>
          <div style={glow(acc)} />
          <div style={label}>Implementation Roadmap</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {solution.implementationNotes.map((note, i) => {
              const phaseColors = [t.cyan, t.emerald, t.amber, t.violet];
              const pc = phaseColors[i % phaseColors.length];
              return (
                <div key={i} style={{
                  display: 'flex', gap: 16, padding: '16px 18px', borderRadius: t.r.md,
                  background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
                  border: `1px solid ${t.borderSubtle}`, position: 'relative', overflow: 'hidden',
                }}>
                  {/* Phase color bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: pc }} />
                  <div style={{ flexShrink: 0, textAlign: 'center', paddingLeft: 4 }}>
                    <div style={{
                      fontFamily: t.fontM, fontSize: 8, fontWeight: 800, color: pc,
                      background: pc + '12', padding: '3px 8px', borderRadius: 4, letterSpacing: 1,
                    }}>{note.phase}</div>
                    <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, marginTop: 4 }}>{note.duration}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 4 }}>{note.title}</div>
                    <p style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.6, margin: 0 }}>{note.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GttFutureState;
