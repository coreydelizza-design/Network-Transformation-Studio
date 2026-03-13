import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../../theme/useTheme';
import { useWorkshopStore } from '../../store/useWorkshopStore';
import { MATURITY_DOMAINS, PAIN_ITEMS } from '../../data/seed';
import { Chip, Mono, GlassCard, SectionHeader } from '../shared/Primitives';

/* ═══════════════════════════════════════════════════════════
   INFRASTRUCTURE DATA — Current State
   Derived from Estate Mapper (tab 2) seed data.
   Each node maps to related pain points + maturity domains
   so risk and health indicators flow from tabs 3–4.
   ═══════════════════════════════════════════════════════════ */

interface InfraNode {
  id: string;
  label: string;
  detail: string;
  icon: string;
  layer: 'cloud' | 'security' | 'network' | 'dc' | 'site';
  x: number;
  y: number;
  painIds: string[];      // keys into painScores
  maturityKeys: string[]; // keys into maturity
  status: 'healthy' | 'warning' | 'critical' | 'eol';
}

interface InfraEdge { from: string; to: string; style?: 'solid' | 'dashed'; }

const CURRENT_NODES: InfraNode[] = [
  // ── Cloud tier ──
  { id: 'aws', label: 'AWS (×2 regions)', detail: 'us-east-1, eu-west-1 — VPN over internet', icon: '☁', layer: 'cloud', x: 260, y: 40, painIds: ['cloudPerf'], maturityKeys: ['cloudConn'], status: 'warning' },
  { id: 'azure', label: 'Azure (×2 regions)', detail: 'East US, UK South — ExpressRoute partial', icon: '☁', layer: 'cloud', x: 460, y: 40, painIds: ['cloudPerf'], maturityKeys: ['cloudConn'], status: 'warning' },

  // ── Security tier ──
  { id: 'pa_fw', label: 'Palo Alto NGFW', detail: '62 sites — PA-5260 HA cluster', icon: '🧱', layer: 'security', x: 60, y: 155, painIds: ['secFrag'], maturityKeys: ['secArch'], status: 'healthy' },
  { id: 'asa', label: 'Cisco ASA (Legacy)', detail: '45 sites — End of Support Q3 2026', icon: '🧱', layer: 'security', x: 230, y: 155, painIds: ['secFrag', 'outage'], maturityKeys: ['secArch'], status: 'eol' },
  { id: 'zscaler', label: 'Zscaler ZIA (Partial)', detail: '34 of 187 sites enrolled', icon: '🔒', layer: 'security', x: 400, y: 155, painIds: ['secFrag', 'visibility'], maturityKeys: ['secArch'], status: 'warning' },
  { id: 'crowdstrike', label: 'CrowdStrike XDR', detail: 'All endpoints — Falcon platform', icon: '🛡', layer: 'security', x: 580, y: 155, painIds: [], maturityKeys: ['secArch'], status: 'healthy' },

  // ── Network core ──
  { id: 'mpls', label: 'MPLS Backbone', detail: 'AT&T (78 ckt) + Lumen (52 ckt) + 3 others', icon: '🌐', layer: 'network', x: 180, y: 280, painIds: ['carrierSprawl', 'outage', 'vendorPerf'], maturityKeys: ['netArch', 'resilience'], status: 'warning' },
  { id: 'sdwan_partial', label: 'SD-WAN (Partial)', detail: 'Viptela — 34 of 187 sites', icon: '📡', layer: 'network', x: 420, y: 280, painIds: ['manualOps', 'deployDelay'], maturityKeys: ['netArch', 'automation'], status: 'warning' },

  // ── Data centers ──
  { id: 'dc_east', label: 'East DC (Primary)', detail: 'Equinix NY5 — Core compute + storage', icon: '🖥', layer: 'dc', x: 60, y: 280, painIds: ['outage', 'mttr'], maturityKeys: ['resilience'], status: 'healthy' },
  { id: 'dc_west', label: 'West DC (DR)', detail: 'Equinix SV5 — Disaster recovery', icon: '🖥', layer: 'dc', x: 60, y: 380, painIds: ['mttr'], maturityKeys: ['resilience'], status: 'healthy' },
  { id: 'dc_lon', label: 'London DC', detail: 'Equinix LD8 — EMEA hub', icon: '🖥', layer: 'dc', x: 620, y: 280, painIds: ['outage'], maturityKeys: ['resilience'], status: 'healthy' },

  // ── Sites ──
  { id: 'hq_nyc', label: 'NYC Headquarters', detail: '2,500 users — Dual ISP + MPLS', icon: '🏛', layer: 'site', x: 30, y: 480, painIds: ['outage'], maturityKeys: ['branchStd'], status: 'healthy' },
  { id: 'br_na', label: 'NA Branches (52)', detail: 'Mixed MPLS + broadband', icon: '🏢', layer: 'site', x: 180, y: 480, painIds: ['carrierSprawl', 'deployDelay', 'manualOps'], maturityKeys: ['branchStd'], status: 'warning' },
  { id: 'br_emea', label: 'EMEA Branches (24)', detail: 'London hub-and-spoke', icon: '🏢', layer: 'site', x: 340, y: 480, painIds: ['carrierSprawl', 'deployDelay'], maturityKeys: ['branchStd'], status: 'warning' },
  { id: 'br_apac', label: 'APAC Branches (11)', detail: 'Singapore hub', icon: '🏢', layer: 'site', x: 490, y: 480, painIds: ['deployDelay', 'visibility'], maturityKeys: ['branchStd'], status: 'warning' },
  { id: 'acquired', label: 'Acquired Sites (45)', detail: 'Pinnacle + NorthStar — pending integration', icon: '🏗', layer: 'site', x: 640, y: 480, painIds: ['maIntegration', 'secFrag', 'deployDelay'], maturityKeys: ['branchStd', 'secArch'], status: 'critical' },
];

const CURRENT_EDGES: InfraEdge[] = [
  { from: 'hq_nyc', to: 'dc_east' }, { from: 'dc_east', to: 'mpls' }, { from: 'dc_west', to: 'mpls' },
  { from: 'mpls', to: 'br_na' }, { from: 'mpls', to: 'br_emea' }, { from: 'mpls', to: 'br_apac' },
  { from: 'dc_east', to: 'pa_fw' }, { from: 'pa_fw', to: 'mpls' },
  { from: 'sdwan_partial', to: 'br_na', style: 'dashed' }, { from: 'zscaler', to: 'sdwan_partial', style: 'dashed' },
  { from: 'dc_east', to: 'aws', style: 'dashed' }, { from: 'dc_east', to: 'azure', style: 'dashed' },
  { from: 'dc_lon', to: 'br_emea' }, { from: 'asa', to: 'acquired' },
  { from: 'crowdstrike', to: 'dc_east' },
];

/* ═══════════════════════════════════════════════════════════
   GTT FUTURE STATE OVERLAY — Driven by tab 5 sliders
   Each component appears when its threshold is met.
   ═══════════════════════════════════════════════════════════ */

interface GttNode {
  id: string;
  label: string;
  detail: string;
  icon: string;
  x: number;
  y: number;
  sliderKey: string;
  threshold: number;
  replaces: string[]; // IDs of current nodes this supersedes
}

const GTT_NODES: GttNode[] = [
  { id: 'gtt_sdwan', label: 'GTT SD-WAN Fabric', detail: 'Managed overlay — all 187 sites', icon: '📡', x: 320, y: 340, sliderKey: 'netModel', threshold: 5, replaces: ['mpls', 'sdwan_partial'] },
  { id: 'gtt_sase', label: 'GTT SASE / SSE', detail: 'SWG + CASB + ZTNA + FWaaS', icon: '🔒', x: 340, y: 110, sliderKey: 'zeroTrust', threshold: 6, replaces: ['asa', 'zscaler'] },
  { id: 'gtt_backbone', label: 'GTT Tier-1 Backbone', detail: 'AS3257 — global SLA-grade underlay', icon: '🌐', x: 320, y: 220, sliderKey: 'resil', threshold: 6, replaces: [] },
  { id: 'gtt_cloud', label: 'GTT Cloud On-Ramp', detail: 'Direct Connect + ExpressRoute + GCI', icon: '☁', x: 360, y: 40, sliderKey: 'cloudAdj', threshold: 6, replaces: [] },
  { id: 'gtt_envision', label: 'GTT Envision (DEM)', detail: 'Full-stack observability + DEM', icon: '📊', x: 580, y: 340, sliderKey: 'observ', threshold: 6, replaces: [] },
  { id: 'gtt_noc', label: 'GTT Managed NOC', detail: '24/7 follow-the-sun operations', icon: '👁', x: 680, y: 340, sliderKey: 'supportModel', threshold: 6, replaces: [] },
  { id: 'gtt_orch', label: 'GTT Orchestrator', detail: 'Automation + NetOps CI/CD', icon: '⚙', x: 520, y: 220, sliderKey: 'auto', threshold: 7, replaces: [] },
  { id: 'gtt_edge', label: 'GTT Edge Compute', detail: 'Distributed compute at branch', icon: '⚡', x: 180, y: 400, sliderKey: 'aiEdge', threshold: 5, replaces: [] },
];

const GTT_EDGES: { from: string; to: string; showWhen: string }[] = [
  { from: 'gtt_backbone', to: 'gtt_sdwan', showWhen: 'gtt_sdwan' },
  { from: 'gtt_sdwan', to: 'br_na', showWhen: 'gtt_sdwan' },
  { from: 'gtt_sdwan', to: 'br_emea', showWhen: 'gtt_sdwan' },
  { from: 'gtt_sdwan', to: 'br_apac', showWhen: 'gtt_sdwan' },
  { from: 'gtt_sdwan', to: 'acquired', showWhen: 'gtt_sdwan' },
  { from: 'gtt_sase', to: 'gtt_cloud', showWhen: 'gtt_sase' },
  { from: 'gtt_sase', to: 'gtt_backbone', showWhen: 'gtt_sase' },
  { from: 'gtt_cloud', to: 'aws', showWhen: 'gtt_cloud' },
  { from: 'gtt_cloud', to: 'azure', showWhen: 'gtt_cloud' },
  { from: 'gtt_envision', to: 'gtt_sdwan', showWhen: 'gtt_envision' },
  { from: 'gtt_noc', to: 'gtt_envision', showWhen: 'gtt_noc' },
  { from: 'gtt_orch', to: 'gtt_sdwan', showWhen: 'gtt_orch' },
  { from: 'gtt_edge', to: 'gtt_sdwan', showWhen: 'gtt_edge' },
  { from: 'gtt_backbone', to: 'dc_east', showWhen: 'gtt_backbone' },
  { from: 'gtt_backbone', to: 'dc_lon', showWhen: 'gtt_backbone' },
  { from: 'gtt_sase', to: 'crowdstrike', showWhen: 'gtt_sase' },
  { from: 'hq_nyc', to: 'gtt_sdwan', showWhen: 'gtt_sdwan' },
];

const LAYER_META: Record<string, { label: string; color: string }> = {
  cloud: { label: 'Cloud', color: '#22d3ee' },
  security: { label: 'Security', color: '#fb7185' },
  network: { label: 'Network', color: '#3b82f6' },
  dc: { label: 'Data Centers', color: '#14b8a6' },
  site: { label: 'Sites', color: '#a78bfa' },
  gtt: { label: 'GTT Solution', color: '#34d399' },
};

const STATUS_C: Record<string, string> = { healthy: '#34d399', warning: '#fbbf24', critical: '#fb7185', eol: '#ef4444' };

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
type ViewMode = 'current' | 'future' | 'overlay';

const ArchitectureStudio: React.FC = () => {
  const { t, isDark } = useTheme();
  const { painScores, maturity, visionSliders, visionPosture } = useWorkshopStore();

  const [viewMode, setViewMode] = useState<ViewMode>('overlay');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layers, setLayers] = useState<Record<string, boolean>>({ cloud: true, security: true, network: true, dc: true, site: true, gtt: true });
  const [zoom, setZoom] = useState(0.92);
  const [pan, setPan] = useState({ x: 20, y: 10 });
  const [panning, setPanning] = useState<{ sx: number; sy: number; sp: { x: number; y: number } } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Derived: which GTT nodes are active based on slider thresholds ──
  const activeGtt = useMemo(() => {
    const ids = new Set<string>();
    GTT_NODES.forEach(g => { if ((visionSliders[g.sliderKey] || 0) >= g.threshold) ids.add(g.id); });
    return ids;
  }, [visionSliders]);

  const activeGttNodes = useMemo(() => GTT_NODES.filter(g => activeGtt.has(g.id)), [activeGtt]);
  const supersededIds = useMemo(() => {
    const ids = new Set<string>();
    activeGttNodes.forEach(g => g.replaces.forEach(r => ids.add(r)));
    return ids;
  }, [activeGttNodes]);

  // ── Risk + maturity derivation for each current node ──
  const nodeRisk = useCallback((node: InfraNode) => {
    if (!node.painIds.length) return 0;
    return Math.max(...node.painIds.map(id => painScores[id] || 0));
  }, [painScores]);

  const nodeMaturityGap = useCallback((node: InfraNode) => {
    if (!node.maturityKeys.length) return 0;
    return Math.max(...node.maturityKeys.map(k => {
      const m = maturity[k];
      return m ? m.target - m.current : 0;
    }));
  }, [maturity]);

  // ── Canvas interactions ──
  const handleWheel = useCallback((e: WheelEvent) => { e.preventDefault(); setZoom(z => Math.max(0.35, Math.min(2.2, z + (e.deltaY > 0 ? -0.06 : 0.06)))); }, []);
  useEffect(() => { const el = canvasRef.current; if (!el) return; el.addEventListener('wheel', handleWheel, { passive: false }); return () => el.removeEventListener('wheel', handleWheel); }, [handleWheel]);

  const onCanvasDown = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('[data-bg]') && e.target !== canvasRef.current) return;
    setPanning({ sx: e.clientX, sy: e.clientY, sp: { ...pan } });
    setSelectedId(null);
  }, [pan]);
  const onCanvasMove = useCallback((e: React.MouseEvent) => {
    if (!panning) return;
    setPan({ x: panning.sp.x + e.clientX - panning.sx, y: panning.sp.y + e.clientY - panning.sy });
  }, [panning]);
  const onCanvasUp = useCallback(() => setPanning(null), []);

  // ── Edge drawing ──
  const allNodes = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    CURRENT_NODES.forEach(n => map.set(n.id, n));
    activeGttNodes.forEach(n => map.set(n.id, n));
    return map;
  }, [activeGttNodes]);

  const drawEdge = (fromId: string, toId: string) => {
    const f = allNodes.get(fromId), to2 = allNodes.get(toId);
    if (!f || !to2) return '';
    const W = 118, H = 70;
    const x1 = f.x + W / 2, y1 = f.y + H / 2, x2 = to2.x + W / 2, y2 = to2.y + H / 2, dx = x2 - x1;
    return `M ${x1} ${y1} C ${x1 + dx * 0.4} ${y1}, ${x2 - dx * 0.4} ${y2}, ${x2} ${y2}`;
  };

  const gridDot = isDark ? 'rgba(40,55,85,0.22)' : 'rgba(148,163,184,0.15)';
  const showCurrent = viewMode === 'current' || viewMode === 'overlay';
  const showFuture = viewMode === 'future' || viewMode === 'overlay';

  const selectedCurrent = selectedId ? CURRENT_NODES.find(n => n.id === selectedId) : null;
  const selectedGtt = selectedId ? GTT_NODES.find(n => n.id === selectedId) : null;

  // ── Upstream data summaries ──
  const topPains = useMemo(() =>
    [...PAIN_ITEMS].map(p => ({ ...p, score: painScores[p.id] || 0 })).sort((a, b) => b.score - a.score).filter(p => p.score >= 6),
  [painScores]);

  const biggestGaps = useMemo(() =>
    MATURITY_DOMAINS.map(d => ({ ...d, gap: (maturity[d.key]?.target || 0) - (maturity[d.key]?.current || 0) })).sort((a, b) => b.gap - a.gap).slice(0, 5),
  [maturity]);

  /* ═══════════════════════════════════════════════════════ */
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ═══ LEFT PANEL — CONTROLS ═══ */}
      <div style={{ width: 220, background: t.bgPanel, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${t.emerald}, #059669)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontD, fontSize: 8, fontWeight: 900, color: '#fff', letterSpacing: 0.3 }}>GTT</div>
            <div>
              <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 800, color: t.text }}>Customer Environment</div>
              <Mono color={t.emerald} size={7}>ARCHITECTURE STUDIO</Mono>
            </div>
          </div>
          <p style={{ fontFamily: t.fontB, fontSize: 10, color: t.textDim, lineHeight: 1.5, margin: 0 }}>
            Current state from Estate Mapper, risks from Pain Engine, health from Maturity, GTT overlay from Future Vision.
          </p>
        </div>

        {/* View mode */}
        <div style={{ padding: '12px 12px 8px', borderBottom: `1px solid ${t.border}` }}>
          <Mono size={8}>VIEW MODE</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {([
              { key: 'current' as ViewMode, label: 'Current State', color: t.amber, desc: 'Customer today' },
              { key: 'future' as ViewMode, label: 'GTT Solution', color: t.emerald, desc: 'Proposed overlay' },
              { key: 'overlay' as ViewMode, label: 'Overlay View', color: t.accent, desc: 'Both layers' },
            ]).map(m => (
              <button key={m.key} onClick={() => setViewMode(m.key)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: t.r.sm, width: '100%', textAlign: 'left',
                border: `1px solid ${viewMode === m.key ? m.color + '50' : t.borderSubtle}`,
                background: viewMode === m.key ? m.color + '10' : 'transparent',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: viewMode === m.key ? m.color : t.textDim, boxShadow: viewMode === m.key ? `0 0 6px ${m.color}` : 'none' }} />
                <div>
                  <div style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 600, color: viewMode === m.key ? m.color : t.text }}>{m.label}</div>
                  <div style={{ fontFamily: t.fontB, fontSize: 9, color: t.textDim }}>{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Layer toggles */}
        <div style={{ padding: '12px 12px 8px', borderBottom: `1px solid ${t.border}` }}>
          <Mono size={8}>LAYERS</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 8 }}>
            {Object.entries(LAYER_META).map(([key, meta]) => (
              <button key={key} onClick={() => setLayers(p => ({ ...p, [key]: !p[key] }))} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 4, width: '100%', textAlign: 'left',
                border: `1px solid ${layers[key] ? meta.color + '30' : 'transparent'}`,
                background: layers[key] ? meta.color + '08' : 'transparent',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: layers[key] ? meta.color : t.textDim + '40', border: `1px solid ${layers[key] ? meta.color : t.border}` }} />
                <span style={{ fontFamily: t.fontD, fontSize: 10, fontWeight: 600, color: layers[key] ? meta.color : t.textDim }}>{meta.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data source badges */}
        <div style={{ padding: '12px 12px', flex: 1, overflowY: 'auto' }}>
          <Mono size={8}>DATA SOURCES</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {[
              { tab: 'Tab 2', label: 'Estate Mapper', status: '16 nodes', color: t.blue },
              { tab: 'Tab 3', label: 'Pain Engine', status: `${topPains.length} risks ≥ 6`, color: t.rose },
              { tab: 'Tab 4', label: 'Maturity', status: `Top gap: ${biggestGaps[0]?.gap || 0}`, color: t.amber },
              { tab: 'Tab 5', label: 'Future Vision', status: `${activeGtt.size} GTT active`, color: t.emerald },
            ].map((d, i) => (
              <div key={i} style={{ padding: '8px 10px', borderRadius: t.r.sm, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: t.fontD, fontSize: 10, fontWeight: 600, color: d.color }}>{d.label}</span>
                  <Chip color={d.color} small>{d.tab}</Chip>
                </div>
                <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, marginTop: 2 }}>{d.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* GTT activation list */}
        <div style={{ padding: '10px 12px', borderTop: `1px solid ${t.border}` }}>
          <Mono size={8}>GTT COMPONENTS ({activeGtt.size}/{GTT_NODES.length})</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
            {GTT_NODES.map(g => {
              const on = activeGtt.has(g.id);
              const val = visionSliders[g.sliderKey] || 0;
              return (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', borderRadius: 3, opacity: on ? 1 : 0.35 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: on ? '#34d399' : t.textDim }} />
                  <span style={{ fontFamily: t.fontB, fontSize: 9, color: on ? t.text : t.textDim, flex: 1 }}>{g.label}</span>
                  <span style={{ fontFamily: t.fontM, fontSize: 7, color: on ? '#34d399' : t.textDim }}>{val}/{g.threshold}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ CENTER — CANVAS ═══ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ height: 40, background: t.bgPanel, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: viewMode === 'current' ? t.amber : viewMode === 'future' ? t.emerald : t.accent }} />
              <span style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 700, color: viewMode === 'current' ? t.amber : viewMode === 'future' ? t.emerald : t.accent }}>
                {viewMode === 'current' ? 'Current State' : viewMode === 'future' ? 'GTT Future State' : 'Overlay — Current + GTT'}
              </span>
            </div>
            {viewMode === 'overlay' && supersededIds.size > 0 && (
              <Chip color={t.amber} small>{supersededIds.size} superseded</Chip>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mono size={9}>{showCurrent ? CURRENT_NODES.length : 0} + {showFuture ? activeGtt.size : 0} nodes</Mono>
            <Mono size={9}>{Math.round(zoom * 100)}%</Mono>
            <button onClick={() => { setZoom(0.92); setPan({ x: 20, y: 10 }); }} style={{ padding: '2px 8px', borderRadius: 4, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontFamily: t.fontM, fontSize: 8 }}>FIT</button>
          </div>
        </div>

        {/* Canvas */}
        <div ref={canvasRef} onMouseDown={onCanvasDown} onMouseMove={onCanvasMove} onMouseUp={onCanvasUp} onMouseLeave={onCanvasUp}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: panning ? 'grabbing' : 'grab', background: t.bgCanvas }}>
          <div data-bg="1" style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${gridDot} 1px, transparent 1px)`, backgroundSize: `${22 * zoom}px ${22 * zoom}px`, backgroundPosition: `${pan.x % (22 * zoom)}px ${pan.y % (22 * zoom)}px`, pointerEvents: 'none' }} />
          <div data-bg="1" style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 40% 30%, ${viewMode === 'future' ? t.emerald : t.amber}03, transparent 60%)`, pointerEvents: 'none' }} />

          <div style={{ position: 'absolute', transformOrigin: '0 0', transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}>
            {/* ── SVG EDGES ── */}
            <svg style={{ position: 'absolute', top: -1500, left: -1500, width: 5000, height: 5000, pointerEvents: 'none', overflow: 'visible' }}>
              <defs>
                <linearGradient id="eCur" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor={t.amber} stopOpacity="0.4" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" /></linearGradient>
                <linearGradient id="eGtt" x1="0%" y1="0%" x2="100%"><stop offset="0%" stopColor="#34d399" stopOpacity="0.6" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" /></linearGradient>
                <filter id="eg"><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              {/* Current edges */}
              {showCurrent && CURRENT_EDGES.map((e, i) => {
                if (!layers[CURRENT_NODES.find(n => n.id === e.from)?.layer || ''] || !layers[CURRENT_NODES.find(n => n.id === e.to)?.layer || '']) return null;
                const d = drawEdge(e.from, e.to);
                if (!d) return null;
                const dimmed = viewMode === 'overlay' && (supersededIds.has(e.from) || supersededIds.has(e.to));
                return <path key={`c${i}`} d={d} stroke="url(#eCur)" strokeWidth={e.style === 'dashed' ? 1.2 : 1.6} strokeDasharray={e.style === 'dashed' ? '6 4' : undefined} fill="none" filter="url(#eg)" opacity={dimmed ? 0.2 : 0.6} />;
              })}
              {/* GTT edges */}
              {showFuture && layers.gtt && GTT_EDGES.map((e, i) => {
                if (!activeGtt.has(e.showWhen)) return null;
                const d = drawEdge(e.from, e.to);
                if (!d) return null;
                return <path key={`g${i}`} d={d} stroke="url(#eGtt)" strokeWidth={2.2} fill="none" filter="url(#eg)" />;
              })}
            </svg>

            {/* ── CURRENT NODES ── */}
            {showCurrent && CURRENT_NODES.map(node => {
              if (!layers[node.layer]) return null;
              const sel = selectedId === node.id;
              const risk = nodeRisk(node);
              const gap = nodeMaturityGap(node);
              const dimmed = viewMode === 'overlay' && supersededIds.has(node.id);
              const layerC = LAYER_META[node.layer]?.color || t.accent;
              const riskC = risk >= 8 ? '#fb7185' : risk >= 6 ? '#fbbf24' : '#34d399';
              return (
                <div key={node.id} onClick={() => setSelectedId(node.id)}
                  style={{
                    position: 'absolute', left: node.x, top: node.y, width: 118,
                    borderRadius: 10, overflow: 'hidden', userSelect: 'none', cursor: 'pointer',
                    background: sel ? `${layerC}15` : t.bgCard,
                    border: `1.5px solid ${sel ? layerC : layerC + '30'}`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: sel ? `0 0 20px ${layerC}15, 0 4px 16px rgba(0,0,0,${isDark ? '0.35' : '0.08'})` : `0 2px 10px rgba(0,0,0,${isDark ? '0.25' : '0.06'})`,
                    opacity: dimmed ? 0.35 : 1,
                    transition: 'opacity 0.3s, border-color 0.2s',
                  }}>
                  <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${layerC}${sel ? 'aa' : '50'}, transparent)` }} />
                  {/* Risk badge */}
                  {risk >= 5 && <div style={{ position: 'absolute', top: 4, right: 5, width: 16, height: 16, borderRadius: 4, background: riskC + '20', border: `1px solid ${riskC}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontM, fontSize: 7, fontWeight: 700, color: riskC }}>{risk}</div>}
                  {/* Maturity gap */}
                  {gap >= 2 && <div style={{ position: 'absolute', top: 4, left: 5, fontFamily: t.fontM, fontSize: 6, color: t.amber, background: t.amber + '15', padding: '1px 4px', borderRadius: 3, border: `1px solid ${t.amber}30` }}>Δ{gap}</div>}
                  <div style={{ padding: '7px 6px 5px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, lineHeight: 1 }}>{node.icon}</div>
                    <div style={{ fontFamily: t.fontD, fontSize: 9, fontWeight: 600, color: t.text, marginTop: 4, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</div>
                  </div>
                  <div style={{ height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: STATUS_C[node.status] + '10', borderTop: `1px solid ${t.borderSubtle}` }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: STATUS_C[node.status] }} />
                    <span style={{ fontFamily: t.fontM, fontSize: 6.5, color: STATUS_C[node.status], letterSpacing: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>{node.status}</span>
                  </div>
                  {dimmed && <div style={{ position: 'absolute', inset: 0, background: t.bgCanvas + '80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: t.fontM, fontSize: 7, color: t.emerald, letterSpacing: 1 }}>GTT ▸</span>
                  </div>}
                </div>
              );
            })}

            {/* ── GTT FUTURE NODES ── */}
            {showFuture && layers.gtt && activeGttNodes.map(node => {
              const sel = selectedId === node.id;
              return (
                <div key={node.id} onClick={() => setSelectedId(node.id)}
                  style={{
                    position: 'absolute', left: node.x, top: node.y, width: 118,
                    borderRadius: 10, overflow: 'hidden', userSelect: 'none', cursor: 'pointer',
                    background: sel ? '#34d39918' : isDark ? 'rgba(6,40,30,0.85)' : 'rgba(236,253,245,0.9)',
                    border: `1.5px solid ${sel ? '#34d399' : '#34d39950'}`,
                    backdropFilter: 'blur(10px)',
                    boxShadow: sel ? '0 0 24px rgba(52,211,153,0.2), 0 4px 16px rgba(0,0,0,0.15)' : `0 2px 12px rgba(0,0,0,${isDark ? '0.3' : '0.07'}), 0 0 12px rgba(52,211,153,0.06)`,
                  }}>
                  <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #34d399aa, transparent)' }} />
                  <div style={{ position: 'absolute', top: 4, right: 5 }}>
                    <Chip color="#34d399" small>GTT</Chip>
                  </div>
                  <div style={{ padding: '7px 6px 5px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, lineHeight: 1, filter: sel ? 'drop-shadow(0 0 6px rgba(52,211,153,0.4))' : 'none' }}>{node.icon}</div>
                    <div style={{ fontFamily: t.fontD, fontSize: 9, fontWeight: 600, color: t.text, marginTop: 4, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</div>
                  </div>
                  <div style={{ height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#34d39910', borderTop: `1px solid ${t.borderSubtle}` }}>
                    <span style={{ fontFamily: t.fontM, fontSize: 6.5, color: '#34d399', letterSpacing: 0.8, fontWeight: 600 }}>PROPOSED</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL — INSPECTOR ═══ */}
      <div style={{ width: 270, background: t.bgPanel, borderLeft: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>

        {!selectedCurrent && !selectedGtt ? (
          /* ── Dashboard: upstream data summary ── */
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <Mono color={t.accent} size={9}>ENVIRONMENT DASHBOARD</Mono>
            </div>

            {/* Pain risks */}
            <div>
              <Mono size={8} color={t.rose}>TOP RISKS (from Pain Engine)</Mono>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                {topPains.slice(0, 5).map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: t.r.sm, background: (p.score >= 8 ? t.rose : t.amber) + '06', border: `1px solid ${(p.score >= 8 ? t.rose : t.amber)}12` }}>
                    <span style={{ fontSize: 12 }}>{p.icon}</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft, flex: 1 }}>{p.label}</span>
                    <span style={{ fontFamily: t.fontD, fontSize: 14, fontWeight: 800, color: p.score >= 8 ? t.rose : t.amber }}>{p.score}</span>
                  </div>
                ))}
                {topPains.length === 0 && <div style={{ fontFamily: t.fontB, fontSize: 10, color: t.textDim, padding: 8 }}>No pains ≥ 6 — adjust in tab 3</div>}
              </div>
            </div>

            {/* Maturity gaps */}
            <div>
              <Mono size={8} color={t.amber}>MATURITY GAPS (from Assessment)</Mono>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                {biggestGaps.map(d => {
                  const gc = d.gap >= 3 ? t.rose : d.gap >= 2 ? t.amber : t.emerald;
                  return (
                    <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: t.r.sm, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
                      <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft, flex: 1 }}>{d.short}</span>
                      <span style={{ fontFamily: t.fontM, fontSize: 9, color: t.textDim }}>{maturity[d.key]?.current}→{maturity[d.key]?.target}</span>
                      <span style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 800, color: gc }}>Δ{d.gap}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vision summary */}
            <div>
              <Mono size={8} color={t.emerald}>VISION (from Future State)</Mono>
              <div style={{ marginTop: 6, padding: '8px 10px', borderRadius: t.r.sm, background: t.emerald + '06', border: `1px solid ${t.emerald}12` }}>
                <div style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 700, color: t.emerald, marginBottom: 4 }}>
                  {visionPosture.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {Object.entries(visionSliders).filter(([, v]) => v >= 7).map(([k, v]) => (
                    <Chip key={k} color={t.emerald} small>{k.replace(/([A-Z])/g, ' $1').trim()} {v}</Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* Active GTT summary */}
            <div>
              <Mono size={8} color={t.cyan}>GTT SOLUTION ({activeGtt.size} active)</Mono>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
                {activeGttNodes.map(g => (
                  <div key={g.id} onClick={() => setSelectedId(g.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: t.r.sm, background: '#34d39906', border: '1px solid #34d39912', cursor: 'pointer' }}>
                    <span style={{ fontSize: 14 }}>{g.icon}</span>
                    <div>
                      <div style={{ fontFamily: t.fontD, fontSize: 10, fontWeight: 600, color: t.emerald }}>{g.label}</div>
                      <div style={{ fontFamily: t.fontB, fontSize: 9, color: t.textDim }}>{g.detail}</div>
                    </div>
                  </div>
                ))}
                {activeGtt.size === 0 && <div style={{ fontFamily: t.fontB, fontSize: 10, color: t.textDim, padding: 8 }}>Increase sliders in tab 5 to activate GTT components</div>}
              </div>
            </div>
          </div>
        ) : selectedCurrent ? (
          /* ── Current node inspector ── */
          <div className="animate-fade-in" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ textAlign: 'center', padding: '14px 10px', background: (LAYER_META[selectedCurrent.layer]?.color || t.accent) + '08', borderRadius: 9, border: `1px solid ${(LAYER_META[selectedCurrent.layer]?.color || t.accent)}20` }}>
              <span style={{ fontSize: 34 }}>{selectedCurrent.icon}</span>
              <div style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 700, color: LAYER_META[selectedCurrent.layer]?.color, marginTop: 6 }}>{selectedCurrent.label}</div>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, marginTop: 2, letterSpacing: 1 }}>{selectedCurrent.layer.toUpperCase()} LAYER</div>
            </div>

            <div style={{ padding: '8px 10px', borderRadius: t.r.sm, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
              <Mono size={8}>DETAIL</Mono>
              <div style={{ fontFamily: t.fontB, fontSize: 12, color: t.textSoft, marginTop: 4, lineHeight: 1.5 }}>{selectedCurrent.detail}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ padding: '8px 10px', borderRadius: t.r.sm, background: STATUS_C[selectedCurrent.status] + '08', border: `1px solid ${STATUS_C[selectedCurrent.status]}20`, textAlign: 'center' }}>
                <Mono size={7}>STATUS</Mono>
                <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: STATUS_C[selectedCurrent.status], marginTop: 2, textTransform: 'uppercase' }}>{selectedCurrent.status}</div>
              </div>
              <div style={{ padding: '8px 10px', borderRadius: t.r.sm, background: (nodeRisk(selectedCurrent) >= 7 ? t.rose : t.amber) + '08', border: `1px solid ${(nodeRisk(selectedCurrent) >= 7 ? t.rose : t.amber)}20`, textAlign: 'center' }}>
                <Mono size={7}>RISK SCORE</Mono>
                <div style={{ fontFamily: t.fontD, fontSize: 18, fontWeight: 800, color: nodeRisk(selectedCurrent) >= 7 ? t.rose : nodeRisk(selectedCurrent) >= 5 ? t.amber : t.emerald, marginTop: 2 }}>{nodeRisk(selectedCurrent) || '—'}</div>
              </div>
            </div>

            {/* Related pains */}
            {selectedCurrent.painIds.length > 0 && (
              <div>
                <Mono size={8} color={t.rose}>RELATED PAIN POINTS</Mono>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                  {selectedCurrent.painIds.map(id => {
                    const item = PAIN_ITEMS.find(p => p.id === id);
                    const score = painScores[id] || 0;
                    return item ? (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 3, background: (score >= 7 ? t.rose : t.amber) + '06' }}>
                        <span style={{ fontSize: 10 }}>{item.icon}</span>
                        <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft, flex: 1 }}>{item.label}</span>
                        <span style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: score >= 7 ? t.rose : t.amber }}>{score}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Related maturity */}
            {selectedCurrent.maturityKeys.length > 0 && (
              <div>
                <Mono size={8} color={t.amber}>MATURITY DOMAINS</Mono>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                  {selectedCurrent.maturityKeys.map(k => {
                    const dom = MATURITY_DOMAINS.find(d => d.key === k);
                    const m = maturity[k];
                    const gap = m ? m.target - m.current : 0;
                    const gc = gap >= 3 ? t.rose : gap >= 2 ? t.amber : t.emerald;
                    return dom && m ? (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 3, background: t.bgGlass }}>
                        <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft, flex: 1 }}>{dom.short}</span>
                        <span style={{ fontFamily: t.fontM, fontSize: 9, color: t.textDim }}>{m.current}→{m.target}</span>
                        <span style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 700, color: gc }}>Δ{gap}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* GTT supersession */}
            {supersededIds.has(selectedCurrent.id) && (
              <div style={{ padding: '10px 12px', borderRadius: t.r.sm, background: t.emerald + '08', border: `1px solid ${t.emerald}20` }}>
                <div style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 700, color: t.emerald, marginBottom: 4 }}>⬆ Superseded by GTT</div>
                <div style={{ fontFamily: t.fontB, fontSize: 10, color: t.textDim, lineHeight: 1.5 }}>
                  {activeGttNodes.filter(g => g.replaces.includes(selectedCurrent.id)).map(g => g.label).join(', ')} replaces this component in the future state.
                </div>
              </div>
            )}

            <button onClick={() => setSelectedId(null)} style={{ padding: '7px', borderRadius: t.r.sm, border: `1px solid ${t.border}`, background: 'transparent', color: t.textDim, fontFamily: t.fontD, fontSize: 10, fontWeight: 600 }}>← Back to Dashboard</button>
          </div>
        ) : selectedGtt ? (
          /* ── GTT node inspector ── */
          <div className="animate-fade-in" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ textAlign: 'center', padding: '14px 10px', background: '#34d39908', borderRadius: 9, border: '1px solid #34d39920' }}>
              <span style={{ fontSize: 34, filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.3))' }}>{selectedGtt.icon}</span>
              <div style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 700, color: '#34d399', marginTop: 6 }}>{selectedGtt.label}</div>
              <Chip color="#34d399" small>GTT SOLUTION</Chip>
            </div>

            <div style={{ padding: '8px 10px', borderRadius: t.r.sm, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
              <Mono size={8}>DETAIL</Mono>
              <div style={{ fontFamily: t.fontB, fontSize: 12, color: t.textSoft, marginTop: 4, lineHeight: 1.5 }}>{selectedGtt.detail}</div>
            </div>

            <div style={{ padding: '8px 10px', borderRadius: t.r.sm, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
              <Mono size={8}>ACTIVATION</Mono>
              <div style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, marginTop: 4 }}>
                Driven by <strong style={{ color: t.accent }}>{selectedGtt.sliderKey}</strong> slider (currently {visionSliders[selectedGtt.sliderKey]}/{selectedGtt.threshold} threshold)
              </div>
              <div style={{ marginTop: 6, height: 4, background: t.bgHover, borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${Math.min((visionSliders[selectedGtt.sliderKey] || 0) / 10 * 100, 100)}%`, background: '#34d399', borderRadius: 2 }} />
              </div>
            </div>

            {selectedGtt.replaces.length > 0 && (
              <div style={{ padding: '8px 10px', borderRadius: t.r.sm, background: t.amber + '06', border: `1px solid ${t.amber}15` }}>
                <Mono size={8} color={t.amber}>REPLACES</Mono>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                  {selectedGtt.replaces.map(id => {
                    const cn = CURRENT_NODES.find(n => n.id === id);
                    return cn ? (
                      <div key={id} onClick={() => setSelectedId(id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 3, background: t.bgGlass, cursor: 'pointer' }}>
                        <span style={{ fontSize: 12 }}>{cn.icon}</span>
                        <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft }}>{cn.label}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div style={{ fontFamily: t.fontB, fontSize: 10, color: t.textDim, lineHeight: 1.5, fontStyle: 'italic', padding: '4px 0' }}>
              Adjust the <strong>{selectedGtt.sliderKey}</strong> slider in tab 5 (Future State Vision) to control activation.
            </div>

            <button onClick={() => setSelectedId(null)} style={{ padding: '7px', borderRadius: t.r.sm, border: `1px solid ${t.border}`, background: 'transparent', color: t.textDim, fontFamily: t.fontD, fontSize: 10, fontWeight: 600 }}>← Back to Dashboard</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ArchitectureStudio;
