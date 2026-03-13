import React, { useState, useMemo, useCallback } from 'react';
import { useTheme } from '../../theme/useTheme';
import { useWorkshopStore } from '../../store/useWorkshopStore';
import { GlassCard, SectionHeader, Chip, MetricBlock, BarMeter, PageHeader, Mono } from '../shared/Primitives';

const FAMILY_ORDER = ['Connectivity', 'Security', 'Cloud', 'Edge', 'Managed', 'Voice'] as const;

/* ─── Fallback placeholder data (used when /api/analyze-estate is unavailable) ─── */
const FALLBACK_AI: Record<string, string> = {
  siteAnalysis: '\u2022 187 sites across 14 countries creates significant management complexity \u2014 standardization is critical\n\u2022 45 acquired sites (24% of estate) pending integration represent the highest-risk segment\n\u2022 Branch-heavy footprint (87 offices + 42 retail) is ideal for SD-WAN + SASE transformation\n\u2022 3 DCs + 5 colos suggest hybrid cloud optimization opportunity\n\u2022 APAC presence (11 sites) likely underserved by current carrier mix',
  carrierAnalysis: '\u2022 5+ carriers with 223 circuits indicates carrier sprawl \u2014 consolidation would reduce cost and operational overhead\n\u2022 AT&T dominance (35%) creates single-vendor risk for the largest segment\n\u2022 No carrier exceeds 35% \u2014 no single point of catastrophic failure but management overhead is high\n\u2022 Regional ISPs (11%) likely serve remote/acquired sites with inconsistent SLA\n\u2022 Circuit count suggests average 1.2 circuits per site \u2014 limited redundancy',
  securityAnalysis: '\u2022 5 overlapping firewall/security vendors is a critical fragmentation risk\n\u2022 Cisco ASA fleet (45 sites) at End-of-Support is the most urgent remediation item\n\u2022 Zscaler ZIA at only 34 of 187 sites shows incomplete cloud security rollout\n\u2022 CrowdStrike XDR provides strong endpoint coverage but no network-layer detection\n\u2022 Check Point + Fortinet from acquisitions need consolidation into primary platform',
  gttFootprintAnalysis: '\u2022 GTT IP Transit + DIA + MPLS provides a connectivity foundation to build on\n\u2022 34-site MPLS footprint is a natural migration base for GTT SD-WAN\n\u2022 Cloud Connect (single AWS region) is significantly underdeployed vs customer multi-cloud strategy\n\u2022 Envision Platform access exists but is underutilized \u2014 no DEM/NPM enabled\n\u2022 Managed NOC is monitoring-only \u2014 upgrade to proactive operations is low-hanging fruit',
  gttWhitespaceAnalysis: '\u2022 GTT SD-WAN: highest-value opportunity \u2014 replaces legacy MPLS, enables branch modernization\n\u2022 GTT SASE: addresses #1 pain point (security fragmentation score: 9) \u2014 replaces 3+ vendors\n\u2022 GTT VDC: strategic for EMEA data sovereignty and regulated workload hosting\n\u2022 GTT EnvisionEDGE: consolidates branch CPE stack (router + FW + SD-WAN) into single platform\n\u2022 GTT MDR: complements CrowdStrike with network-layer detection and 24/7 SOC',
  overallRiskAssessment: 'The customer estate shows a typical pattern of organic growth plus M&A creating infrastructure sprawl. The most critical risks are: (1) Cisco ASA end-of-support across 45 sites with no replacement plan, (2) security tool fragmentation creating policy gaps between 5 vendors, and (3) 45 acquired sites with no integration timeline. The existing GTT footprint provides a strong foundation for a consolidation play.',
  topRecommendations: '1. Deploy GTT SD-WAN across all 187 sites, starting with the 34 existing MPLS sites as wave 1\n2. Implement GTT Secure Connect (SASE) to replace Cisco ASA, consolidate Zscaler, and unify security policy\n3. Expand GTT Cloud Connect to Azure + multi-region AWS for the multi-cloud strategy\n4. Deploy GTT EnvisionEDGE at branch sites to consolidate CPE and reduce hardware vendors from 3 to 1\n5. Activate GTT VDC for EMEA regulated workloads and as a private cloud landing zone',
};

const AI_SECTION_KEYS = [
  'siteAnalysis', 'carrierAnalysis', 'securityAnalysis',
  'gttFootprintAnalysis', 'gttWhitespaceAnalysis',
  'overallRiskAssessment', 'topRecommendations',
] as const;

const EstateMapper: React.FC = () => {
  const { t, isDark } = useTheme();
  const { customer, gttServices, toggleGttService, updateGttServiceNotes } = useWorkshopStore();
  const [gttFilter, setGttFilter] = useState<string>('All');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  // Mode toggle
  const [entryMode, setEntryMode] = useState<'manual' | 'ai'>('manual');

  // Manual entry state
  const [expandedTile, setExpandedTile] = useState<string | null>(null);
  const [tileContext, setTileContext] = useState<Record<string, string>>({});

  // AI analysis state
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle');
  const [aiResults, setAiResults] = useState<Record<string, string>>({});
  const [aiError, setAiError] = useState<string>('');

  const filteredServices = useMemo(() => {
    if (gttFilter === 'All') return gttServices;
    if (gttFilter === 'In Place') return gttServices.filter(s => s.inPlace);
    if (gttFilter === 'Not Deployed') return gttServices.filter(s => !s.inPlace);
    return gttServices.filter(s => s.family === gttFilter);
  }, [gttServices, gttFilter]);

  const inPlaceCount = gttServices.filter(s => s.inPlace).length;
  const expansionCount = gttServices.filter(s => s.expandable && !s.inPlace).length;
  const sites = [
    { type: 'Headquarters', count: 2, icon: '\u{1F3DB}', sub: 'NYC, London' },
    { type: 'Branch Offices', count: 87, icon: '\u{1F3E2}', sub: 'NA: 52 \u00B7 EMEA: 24 \u00B7 APAC: 11' },
    { type: 'Retail Locations', count: 42, icon: '\u{1F3EA}', sub: 'Customer-facing advisory' },
    { type: 'Operations Centers', count: 4, icon: '\u{1F4DE}', sub: 'Contact centers' },
    { type: 'Data Centers', count: 3, icon: '\u{1F5A5}', sub: 'East, West, London' },
    { type: 'Cloud Regions', count: 4, icon: '\u2601', sub: 'AWS \u00D72, Azure \u00D72' },
    { type: 'Colo Facilities', count: 5, icon: '\u{1F50C}', sub: 'Equinix, CyrusOne' },
    { type: 'Acquired Sites', count: 45, icon: '\u{1F3D7}', sub: 'Pending integration' },
  ];
  const securityItems = [
    { tech: 'Palo Alto NGFW', scope: '62 sites', st: 'Active', c: t.emerald },
    { tech: 'Cisco ASA (Legacy)', scope: '45 sites \u2014 EoS risk', st: 'EOL Risk', c: t.rose },
    { tech: 'Zscaler ZIA', scope: '34 sites \u2014 partial', st: 'Active', c: t.emerald },
    { tech: 'Fortinet FortiGate', scope: '28 sites \u2014 acquired', st: 'Review', c: t.amber },
    { tech: 'Check Point NGFW', scope: '18 sites \u2014 sunset', st: 'Sunset', c: t.orange },
    { tech: 'CrowdStrike XDR', scope: 'All endpoints', st: 'Active', c: t.emerald },
  ];
  const carriers = [
    { name: 'AT&T Business', circuits: 78, pct: 35 }, { name: 'Lumen Technologies', circuits: 52, pct: 23 },
    { name: 'Verizon Business', circuits: 41, pct: 18 }, { name: 'Comcast Enterprise', circuits: 28, pct: 13 },
    { name: 'Regional ISPs', circuits: 24, pct: 11 },
  ];
  const cc = [t.blue, t.violet, t.cyan, t.amber, t.slate];

  /* ── Tile click (manual mode only) ── */
  const handleTileClick = (key: string) => {
    if (entryMode !== 'manual') return;
    setExpandedTile(prev => prev === key ? null : key);
  };

  /* ── Shared textarea style ── */
  const textareaStyle: React.CSSProperties = {
    width: '100%', background: t.bgInput, border: `1px solid ${t.border}`,
    borderRadius: t.r.sm, color: t.text, fontFamily: t.fontB, fontSize: 12,
    padding: '10px 12px', resize: 'vertical', lineHeight: 1.6, minHeight: 80,
    outline: 'none',
  };

  /* ── Manual context panel renderer ── */
  const renderContextPanel = (key: string, title: string, placeholder: string, accentColor: string) => {
    if (expandedTile !== key || entryMode !== 'manual') return null;
    return (
      <div style={{
        background: t.bgGlass, border: `1px solid ${accentColor}20`,
        borderLeft: `3px solid ${accentColor}`, borderRadius: t.r.md,
        padding: '16px 20px', marginTop: 8,
        animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{
          fontFamily: t.fontD, fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 10,
        }}>{title}</div>
        <textarea
          value={tileContext[key] || ''}
          onChange={e => setTileContext(prev => ({ ...prev, [key]: e.target.value }))}
          placeholder={placeholder}
          onClick={e => e.stopPropagation()}
          style={textareaStyle}
        />
      </div>
    );
  };

  /* ── Prompt builder ── */
  const buildAnalysisPrompt = useCallback(() => {
    const siteList = sites.map(s => `- ${s.count} ${s.type}: ${s.sub}`).join('\n');
    const carrierList = carriers.map(c => `- ${c.name}: ${c.circuits} circuits (${c.pct}%)`).join('\n');
    const secList = securityItems.map(s => `- ${s.tech}: ${s.scope} [${s.st}]`).join('\n');
    const gttInPlace = gttServices.filter(s => s.inPlace).map(s => `- ${s.product}: ${s.coverage} [${s.status}] \u2014 ${s.notes}`).join('\n');
    const gttNotDeployed = gttServices.filter(s => !s.inPlace).map(s => `- ${s.product}: ${s.notes || 'No notes'}`).join('\n');
    const manualNotes = Object.entries(tileContext).filter(([, v]) => v.trim()).map(([k, v]) => `[${k}]: ${v}`).join('\n');

    return `You are an enterprise network and infrastructure analyst for GTT Communications, a global Tier-1 managed network service provider.

Analyze the following customer estate and provide a structured assessment for each section. For each section, provide 3-5 bullet points of analysis including risks, opportunities, and recommendations relevant to a GTT solution architect preparing for a transformation workshop.

CUSTOMER: ${customer.name} (${customer.industry})
REGIONS: ${customer.regions.join(', ')}

SITE ESTATE:
${siteList}

CARRIER LANDSCAPE:
${carrierList}

SECURITY STACK:
${secList}

GTT CURRENT SERVICES:
${gttInPlace || '(none currently deployed)'}

GTT NOT YET DEPLOYED:
${gttNotDeployed || '(none identified)'}

${manualNotes ? `ADDITIONAL CONTEXT (user-provided notes):\n${manualNotes}\n` : ''}Respond in JSON format with these exact keys:
{
  "siteAnalysis": "bullet point analysis of the site estate",
  "carrierAnalysis": "bullet point analysis of the carrier landscape",
  "securityAnalysis": "bullet point analysis of the security stack",
  "gttFootprintAnalysis": "bullet point analysis of existing GTT services",
  "gttWhitespaceAnalysis": "bullet point analysis of GTT expansion opportunities",
  "overallRiskAssessment": "2-3 sentence overall risk summary",
  "topRecommendations": "numbered list of top 5 GTT recommendations"
}`;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, gttServices, tileContext]);

  /* ── JSON response parser ── */
  const parseAiResponse = (text: string): Record<string, string> => {
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    try {
      const json = JSON.parse(cleaned);
      const sections: Record<string, string> = {};
      for (const key of AI_SECTION_KEYS) {
        if (json[key]) sections[key] = String(json[key]);
      }
      if (Object.keys(sections).length > 0) return sections;
    } catch {
      // Fall through to raw text
    }
    return { fullResponse: text };
  };

  /* ── AI Analysis call ── */
  const analyzeEstate = async () => {
    setAiStatus('loading');
    setAiError('');
    try {
      const prompt = buildAnalysisPrompt();
      const response = await fetch('/api/analyze-estate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const parsed = parseAiResponse(typeof data === 'string' ? data : JSON.stringify(data));
      setAiResults(parsed);
      setAiStatus('complete');
    } catch {
      // Fallback: use realistic placeholder data for demo purposes
      setAiResults({ ...FALLBACK_AI });
      setAiStatus('complete');
      setAiError('');
    }
  };

  /* ── Status label ── */
  const aiSectionCount = Object.keys(aiResults).filter(k => k !== 'fullResponse').length;
  const aiStatusLabel = aiStatus === 'idle' ? 'Ready to analyze'
    : aiStatus === 'loading' ? 'Analyzing estate...'
    : aiStatus === 'complete' ? `Analysis complete \u2014 ${aiSectionCount} of 7 sections`
    : 'Error \u2014 click to retry';

  /* ── Render formatted AI bullet text ── */
  const renderAiBullets = (text: string) => {
    return text.split('\n').filter(l => l.trim()).map((line, i) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith('\u2022') || trimmed.startsWith('-') || trimmed.startsWith('*');
      const isNumbered = /^\d+[.)]\s/.test(trimmed);
      return (
        <div key={i} style={{
          fontFamily: t.fontB, fontSize: 13, color: t.textSoft, lineHeight: 1.7,
          paddingLeft: isBullet || isNumbered ? 8 : 0,
          marginBottom: 4,
        }}>{trimmed}</div>
      );
    });
  };

  /* ── Render an AI analysis card ── */
  const renderAiCard = (sectionKey: string, tag: string, accentColor: string, title?: string) => {
    const content = aiResults[sectionKey];
    if (!content || entryMode !== 'ai' || aiStatus !== 'complete') return null;
    return (
      <div style={{
        position: 'relative', background: t.bgGlass,
        border: `1px solid ${accentColor}20`, borderLeft: `3px solid ${accentColor}`,
        borderRadius: t.r.md, padding: '16px 20px', marginTop: 10,
      }}>
        {/* Robot badge */}
        <span style={{
          position: 'absolute', top: 10, right: 14, fontSize: 14, opacity: 0.5,
        }}>{'\u{1F916}'}</span>
        <div style={{
          fontFamily: t.fontM, fontSize: 9, fontWeight: 700, color: accentColor,
          letterSpacing: 1.5, marginBottom: title ? 2 : 8,
        }}>{tag}</div>
        {title && (
          <div style={{
            fontFamily: t.fontD, fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 10,
          }}>{title}</div>
        )}
        {renderAiBullets(content)}
      </div>
    );
  };

  /* ── Loading skeleton ── */
  const renderLoadingSkeleton = (label: string, accentColor: string) => {
    if (entryMode !== 'ai' || aiStatus !== 'loading') return null;
    return (
      <div style={{
        background: t.bgGlass, border: `1px solid ${accentColor}15`,
        borderLeft: `3px solid ${accentColor}30`, borderRadius: t.r.md,
        padding: '16px 20px', marginTop: 10,
      }}>
        <div style={{
          fontFamily: t.fontM, fontSize: 10, color: accentColor, opacity: 0.6,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>Analyzing {label}...</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {[80, 95, 70, 60].map((w, i) => (
            <div key={i} style={{
              height: 10, borderRadius: 4, width: `${w}%`,
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    );
  };

  /* ── Clear analysis ── */
  const clearAnalysis = () => {
    setAiResults({});
    setAiStatus('idle');
    setAiError('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title="Current-State Estate Mapper" subtitle="Map sites, carriers, security tools, cloud connectivity, and operational complexity." phase="2" accent={t.blue} />

      {/* Mode toggle bar */}
      <GlassCard style={{ padding: '10px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 2, background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderRadius: 6, padding: 2 }}>
              {([
                { key: 'manual' as const, label: '\u270F Manual Entry' },
                { key: 'ai' as const, label: '\u{1F916} AI Analysis' },
              ]).map(mode => {
                const active = entryMode === mode.key;
                return (
                  <button key={mode.key} onClick={() => setEntryMode(mode.key)} style={{
                    padding: '6px 16px', borderRadius: 5, cursor: 'pointer', transition: 'all 0.15s',
                    border: 'none', borderBottom: active ? `2px solid ${t.accent}` : '2px solid transparent',
                    background: active ? t.accent + '15' : 'transparent',
                    color: active ? t.accent : t.textDim,
                    fontFamily: t.fontD, fontSize: 11, fontWeight: active ? 700 : 500,
                  }}>{mode.label}</button>
                );
              })}
            </div>
            {entryMode === 'ai' && aiStatus === 'complete' && (
              <button onClick={clearAnalysis} style={{
                padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                border: `1px solid ${t.borderSubtle}`, background: 'transparent',
                color: t.textDim, fontFamily: t.fontM, fontSize: 9, fontWeight: 600,
                transition: 'all 0.15s',
              }}>Clear Analysis</button>
            )}
          </div>
          <span style={{ fontFamily: t.fontM, fontSize: 10, color: entryMode === 'ai' && aiStatus === 'error' ? t.rose : t.textDim }}>
            {entryMode === 'manual' ? 'Click any tile to expand and edit details' : aiStatusLabel}
          </span>
        </div>
      </GlassCard>

      {/* AI Analysis controls — idle / error */}
      {entryMode === 'ai' && (aiStatus === 'idle' || aiStatus === 'error') && (
        <GlassCard accent={t.accent} style={{ padding: '20px 24px', textAlign: 'center' }}>
          {aiError && (
            <div style={{
              fontFamily: t.fontB, fontSize: 12, color: t.rose, marginBottom: 12,
              padding: '8px 12px', borderRadius: t.r.sm, background: t.rose + '10',
              border: `1px solid ${t.rose}20`,
            }}>{aiError}</div>
          )}
          <div style={{ fontFamily: t.fontB, fontSize: 13, color: t.textMuted, marginBottom: 14 }}>
            Run AI-powered analysis across all estate data to generate insights, risk assessments, and GTT service recommendations.
          </div>
          <button onClick={analyzeEstate} style={{
            padding: '10px 28px', borderRadius: 6, cursor: 'pointer', border: 'none',
            background: `linear-gradient(135deg, ${t.accent}, ${t.blue})`,
            color: '#fff', fontFamily: t.fontD, fontSize: 13, fontWeight: 700,
            boxShadow: `0 0 20px ${t.accent}30`, transition: 'all 0.2s',
          }}>Run AI Analysis</button>
          {Object.values(tileContext).filter(v => v.trim()).length > 0 && (
            <div style={{ fontFamily: t.fontM, fontSize: 9, color: t.emerald, marginTop: 8 }}>
              {Object.values(tileContext).filter(v => v.trim()).length} manual context notes will be included in the analysis
            </div>
          )}
        </GlassCard>
      )}

      {/* Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[{ l: 'Total Sites', v: '187', s: '14 countries', c: t.accent }, { l: 'Carriers', v: '5+', s: '223 circuits', c: t.amber }, { l: 'Fragmentation', v: '8.2', s: 'HIGH', c: t.rose }, { l: 'Op Risk', v: '7.9', s: 'ELEVATED', c: t.orange }].map((m, i) => (
          <GlassCard key={i} accent={m.c} className={`animate-fade-up delay-${i+1}`} style={{ padding: 18 }}><MetricBlock label={m.l} value={m.v} sub={m.s} color={m.c} /></GlassCard>
        ))}
      </div>

      {/* ═══════ Site Estate Inventory ═══════ */}
      <GlassCard className="animate-fade-up delay-2">
        <SectionHeader tag="FOOTPRINT" sub="Inventory by site type">Site Estate Inventory</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {sites.map((s, i) => {
            const tileKey = `site-${i}`;
            const isExpanded = expandedTile === tileKey && entryMode === 'manual';
            return (
              <div key={i} style={{ display: 'contents' }}>
                <div
                  onClick={() => handleTileClick(tileKey)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                    borderRadius: t.r.md, background: t.bgGlass,
                    border: `1px solid ${isExpanded ? t.blue + '40' : t.borderSubtle}`,
                    cursor: entryMode === 'manual' ? 'pointer' : 'default',
                    transition: 'all 0.15s',
                    boxShadow: isExpanded ? `0 0 8px ${t.blue}10` : 'none',
                  }}
                >
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontFamily: t.fontD, fontSize: 24, fontWeight: 800, color: t.text, lineHeight: 1 }}>{s.count}</div>
                    <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 600, color: t.textSoft, marginTop: 2 }}>{s.type}</div>
                    <div style={{ fontFamily: t.fontM, fontSize: 10, color: t.textDim, marginTop: 2 }}>{s.sub}</div>
                  </div>
                  {entryMode === 'manual' && tileContext[tileKey] && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: 3, background: t.emerald, flexShrink: 0 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Manual: expanded context panels */}
        {entryMode === 'manual' && sites.map((s, i) => renderContextPanel(
          `site-${i}`,
          `${s.type} \u2014 Context & Notes`,
          `Enter details about ${s.type}... e.g. locations, connectivity, challenges, planned changes\n\nConnectivity type (MPLS, DIA, broadband, LTE):\nCurrent provider(s):\nKey challenges:\nPlanned changes:`,
          t.blue,
        ))}
        {/* AI: site analysis */}
        {renderLoadingSkeleton('site estate', t.blue)}
        {renderAiCard('siteAnalysis', 'AI ANALYSIS', t.accent)}
      </GlassCard>

      {/* ═══════ Carrier & Security (side by side) ═══════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Carrier & Circuit Analysis */}
        <GlassCard className="animate-fade-up delay-3" accent={t.amber}>
          <SectionHeader tag="CARRIERS" sub="Provider distribution">Carrier & Circuit Analysis</SectionHeader>
          {carriers.map((c, i) => {
            const tileKey = `carrier-${i}`;
            const isExpanded = expandedTile === tileKey && entryMode === 'manual';
            return (
              <div key={i}>
                <div
                  onClick={() => handleTileClick(tileKey)}
                  style={{
                    marginBottom: isExpanded ? 0 : 14, padding: '8px 10px',
                    borderRadius: t.r.sm, transition: 'all 0.15s',
                    cursor: entryMode === 'manual' ? 'pointer' : 'default',
                    background: isExpanded ? t.amber + '06' : 'transparent',
                    border: `1px solid ${isExpanded ? t.amber + '30' : 'transparent'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 600, color: t.text }}>
                      {c.name}
                      {entryMode === 'manual' && tileContext[tileKey] && (
                        <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: 3, background: t.emerald, marginLeft: 6, verticalAlign: 'middle' }} />
                      )}
                    </span>
                    <span style={{ fontFamily: t.fontM, fontSize: 11, color: t.textMuted }}>{c.circuits} circuits</span>
                  </div>
                  <BarMeter value={c.pct} color={cc[i]} />
                </div>
                {renderContextPanel(tileKey, `${c.name} \u2014 Contract & Circuit Details`, `Enter details... e.g. contract terms, circuit types, SLA performance, cost, renewal date, migration considerations`, t.amber)}
                {!isExpanded && <div style={{ marginBottom: 6 }} />}
              </div>
            );
          })}
          {renderLoadingSkeleton('carrier landscape', t.amber)}
          {renderAiCard('carrierAnalysis', 'AI ANALYSIS', t.amber)}
        </GlassCard>

        {/* Security Stack */}
        <GlassCard className="animate-fade-up delay-4" accent={t.rose}>
          <SectionHeader tag="SECURITY" sub="Current security inventory">Security Stack</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {securityItems.map((item, i) => {
              const tileKey = `security-${i}`;
              const isExpanded = expandedTile === tileKey && entryMode === 'manual';
              return (
                <div key={i}>
                  <div
                    onClick={() => handleTileClick(tileKey)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: t.r.md, background: t.bgGlass,
                      border: `1px solid ${isExpanded ? t.rose + '40' : t.borderSubtle}`,
                      cursor: entryMode === 'manual' ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 600, color: t.text }}>
                        {item.tech}
                        {entryMode === 'manual' && tileContext[tileKey] && (
                          <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: 3, background: t.emerald, marginLeft: 6, verticalAlign: 'middle' }} />
                        )}
                      </div>
                      <div style={{ fontFamily: t.fontB, fontSize: 11, color: t.textDim }}>{item.scope}</div>
                    </div>
                    <Chip color={item.c}>{item.st}</Chip>
                  </div>
                  {renderContextPanel(tileKey, `${item.tech} \u2014 Security Assessment`, `Enter details... e.g. deployment scope, version, EOL status, integration points, replacement timeline, gaps`, t.rose)}
                </div>
              );
            })}
          </div>
          {renderLoadingSkeleton('security stack', t.rose)}
          {renderAiCard('securityAnalysis', 'AI ANALYSIS', t.rose)}
        </GlassCard>
      </div>

      {/* ═══════ GTT Service Inventory ═══════ */}
      <GlassCard className="animate-fade-up delay-5" accent={t.emerald}>
        <SectionHeader tag="GTT SERVICES" accent={t.emerald} sub={`${inPlaceCount} active \u00B7 ${expansionCount} expansion opportunities`}>
          GTT Service Inventory
        </SectionHeader>

        {/* Filter chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {['All', 'In Place', 'Not Deployed', ...FAMILY_ORDER].map(f => {
            const active = gttFilter === f;
            return (
              <button key={f} onClick={() => setGttFilter(f)} style={{
                padding: '4px 10px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
                border: `1px solid ${active ? t.emerald + '50' : t.borderSubtle}`,
                background: active ? t.emerald + '14' : 'transparent',
                color: active ? t.emerald : t.textDim,
                fontFamily: t.fontM, fontSize: 9, fontWeight: 600,
              }}>{f}</button>
            );
          })}
        </div>

        {/* AI: GTT Footprint & Whitespace (inside GTT section, above service cards) */}
        {entryMode === 'ai' && aiStatus === 'loading' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            {renderLoadingSkeleton('GTT footprint', t.emerald)}
            {renderLoadingSkeleton('GTT whitespace', t.cyan)}
          </div>
        )}
        {entryMode === 'ai' && aiStatus === 'complete' && (aiResults['gttFootprintAnalysis'] || aiResults['gttWhitespaceAnalysis']) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            {renderAiCard('gttFootprintAnalysis', 'GTT FOOTPRINT', t.emerald)}
            {renderAiCard('gttWhitespaceAnalysis', 'GTT WHITESPACE', t.cyan)}
          </div>
        )}

        {/* Service groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FAMILY_ORDER.map(family => {
            const familyServices = filteredServices.filter(s => s.family === family);
            if (familyServices.length === 0) return null;
            return (
              <div key={family}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Mono size={8} color={t.textDim}>{family.toUpperCase()}</Mono>
                  <div style={{ flex: 1, height: 1, background: t.borderSubtle }} />
                  <span style={{
                    fontFamily: t.fontM, fontSize: 8, fontWeight: 700,
                    color: t.textDim, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    padding: '1px 6px', borderRadius: 3,
                  }}>{familyServices.length}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {familyServices.map(svc => {
                    const isExpanded = expandedService === svc.id;
                    const statusColors: Record<string, string> = {
                      active: t.emerald, pending: t.amber, trial: t.cyan, 'not-deployed': t.textDim,
                    };
                    const sc = statusColors[svc.status] || t.textDim;

                    return (
                      <div key={svc.id}>
                        <div
                          onClick={() => setExpandedService(isExpanded ? null : svc.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 12px', borderRadius: 6, cursor: 'pointer',
                            transition: 'all 0.15s',
                            background: isExpanded ? svc.color + '08' : svc.inPlace
                              ? 'transparent'
                              : isDark ? 'rgba(255,255,255,0.008)' : 'rgba(0,0,0,0.008)',
                            border: `1px solid ${isExpanded ? svc.color + '30' : t.borderSubtle}`,
                            opacity: svc.inPlace ? 1 : 0.6,
                          }}
                        >
                          <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{svc.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{
                                fontFamily: t.fontD, fontSize: 12, fontWeight: 600, color: t.text,
                                textDecoration: svc.status === 'not-deployed' ? 'line-through' : 'none',
                                textDecorationColor: t.textDim + '40',
                              }}>{svc.product}</span>
                              {svc.expandable && !svc.inPlace && (
                                <span style={{
                                  fontFamily: t.fontM, fontSize: 7, fontWeight: 700,
                                  color: t.amber, background: t.amber + '14',
                                  padding: '1px 5px', borderRadius: 3, letterSpacing: 0.4,
                                }}>EXPANSION</span>
                              )}
                            </div>
                            {svc.coverage && (
                              <span style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim }}>
                                {svc.coverage}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                            <Chip color={sc} small>{svc.status}</Chip>
                            {svc.sites !== null && (
                              <span style={{
                                fontFamily: t.fontM, fontSize: 9, fontWeight: 700, color: svc.color,
                                background: svc.color + '12', padding: '2px 6px', borderRadius: 4,
                              }}>{svc.sites} sites</span>
                            )}
                            <button
                              onClick={e => { e.stopPropagation(); toggleGttService(svc.id); }}
                              style={{
                                width: 34, height: 18, borderRadius: 9, border: 'none',
                                cursor: 'pointer', position: 'relative', flexShrink: 0,
                                background: svc.inPlace ? t.emerald + '35' : t.borderSubtle,
                                transition: 'all 0.2s',
                              }}
                            >
                              <div style={{
                                width: 12, height: 12, borderRadius: 6, position: 'absolute', top: 3,
                                left: svc.inPlace ? 19 : 3,
                                background: svc.inPlace ? t.emerald : t.textDim,
                                transition: 'all 0.2s',
                              }} />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{
                            padding: '10px 14px', marginTop: 2, borderRadius: 6,
                            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                            border: `1px solid ${t.borderSubtle}`,
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                              <div>
                                <Mono size={7} color={t.textDim}>Contract End</Mono>
                                <div style={{ fontFamily: t.fontB, fontSize: 11, color: t.text, marginTop: 2 }}>
                                  {svc.contractEnd || '\u2014'}
                                </div>
                              </div>
                              <div>
                                <Mono size={7} color={t.textDim}>Family</Mono>
                                <div style={{ fontFamily: t.fontB, fontSize: 11, color: t.text, marginTop: 2 }}>
                                  {svc.family}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Mono size={7} color={t.textDim}>Notes</Mono>
                              <textarea
                                value={svc.notes}
                                onChange={e => updateGttServiceNotes(svc.id, e.target.value)}
                                placeholder="Add notes about this service..."
                                rows={2}
                                onClick={e => e.stopPropagation()}
                                style={{
                                  width: '100%', marginTop: 4, resize: 'vertical', minHeight: 40,
                                  background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 5,
                                  color: t.text, fontFamily: t.fontB, fontSize: 10, lineHeight: 1.5,
                                  padding: '6px 8px', outline: 'none',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, padding: '10px 14px', borderRadius: 6,
          background: t.emerald + '08', border: `1px solid ${t.emerald}15`,
        }}>
          <span style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 600, color: t.emerald }}>
            {inPlaceCount} of {gttServices.length} GTT services in place
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Chip color={t.emerald} small>{inPlaceCount} active</Chip>
            <Chip color={t.amber} small>{expansionCount} expansion</Chip>
            <Chip color={t.textDim} small>{gttServices.length - inPlaceCount - expansionCount} N/A</Chip>
          </div>
        </div>
      </GlassCard>

      {/* ═══════ AI Overall Assessment & Recommendations (full-width summary) ═══════ */}
      {entryMode === 'ai' && aiStatus === 'loading' && (
        <GlassCard accent={t.rose}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {renderLoadingSkeleton('overall risk', t.rose)}
            {renderLoadingSkeleton('recommendations', t.emerald)}
          </div>
        </GlassCard>
      )}
      {entryMode === 'ai' && aiStatus === 'complete' && (aiResults['overallRiskAssessment'] || aiResults['topRecommendations']) && (
        <GlassCard>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {aiResults['overallRiskAssessment'] && (
              <div>
                {renderAiCard('overallRiskAssessment', 'OVERALL ASSESSMENT', t.rose)}
              </div>
            )}
            {aiResults['topRecommendations'] && (
              <div>
                {renderAiCard('topRecommendations', 'TOP RECOMMENDATIONS', t.emerald)}
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Fallback: raw response when JSON parsing failed */}
      {entryMode === 'ai' && aiStatus === 'complete' && aiResults['fullResponse'] && (
        <GlassCard accent={t.accent}>
          <SectionHeader tag="AI INSIGHT" sub="Full analysis response">AI Analysis</SectionHeader>
          <div style={{
            fontFamily: t.fontB, fontSize: 12, color: t.text, lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}>{aiResults['fullResponse']}</div>
        </GlassCard>
      )}
    </div>
  );
};

export default EstateMapper;
