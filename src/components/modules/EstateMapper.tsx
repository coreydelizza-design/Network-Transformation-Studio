import React, { useState, useMemo } from 'react';
import { useTheme } from '../../theme/useTheme';
import { useWorkshopStore } from '../../store/useWorkshopStore';
import { GlassCard, SectionHeader, Chip, MetricBlock, BarMeter, PageHeader, Mono } from '../shared/Primitives';

const FAMILY_ORDER = ['Connectivity', 'Security', 'Cloud', 'Edge', 'Managed', 'Voice'] as const;

const EstateMapper: React.FC = () => {
  const { t, isDark } = useTheme();
  const { gttServices, toggleGttService, updateGttServiceNotes } = useWorkshopStore();
  const [gttFilter, setGttFilter] = useState<string>('All');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    if (gttFilter === 'All') return gttServices;
    if (gttFilter === 'In Place') return gttServices.filter(s => s.inPlace);
    if (gttFilter === 'Not Deployed') return gttServices.filter(s => !s.inPlace);
    return gttServices.filter(s => s.family === gttFilter);
  }, [gttServices, gttFilter]);

  const inPlaceCount = gttServices.filter(s => s.inPlace).length;
  const expansionCount = gttServices.filter(s => s.expandable && !s.inPlace).length;
  const sites = [
    { type: 'Headquarters', count: 2, icon: '🏛', sub: 'NYC, London' },
    { type: 'Branch Offices', count: 87, icon: '🏢', sub: 'NA: 52 · EMEA: 24 · APAC: 11' },
    { type: 'Retail Locations', count: 42, icon: '🏪', sub: 'Customer-facing advisory' },
    { type: 'Operations Centers', count: 4, icon: '📞', sub: 'Contact centers' },
    { type: 'Data Centers', count: 3, icon: '🖥', sub: 'East, West, London' },
    { type: 'Cloud Regions', count: 4, icon: '☁', sub: 'AWS ×2, Azure ×2' },
    { type: 'Colo Facilities', count: 5, icon: '🔌', sub: 'Equinix, CyrusOne' },
    { type: 'Acquired Sites', count: 45, icon: '🏗', sub: 'Pending integration' },
  ];
  const carriers = [
    { name: 'AT&T Business', circuits: 78, pct: 35 }, { name: 'Lumen Technologies', circuits: 52, pct: 23 },
    { name: 'Verizon Business', circuits: 41, pct: 18 }, { name: 'Comcast Enterprise', circuits: 28, pct: 13 },
    { name: 'Regional ISPs', circuits: 24, pct: 11 },
  ];
  const cc = [t.blue, t.violet, t.cyan, t.amber, t.slate];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageHeader title="Current-State Estate Mapper" subtitle="Map sites, carriers, security tools, cloud connectivity, and operational complexity." phase="2" accent={t.blue} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[{ l: 'Total Sites', v: '187', s: '14 countries', c: t.accent }, { l: 'Carriers', v: '5+', s: '223 circuits', c: t.amber }, { l: 'Fragmentation', v: '8.2', s: 'HIGH', c: t.rose }, { l: 'Op Risk', v: '7.9', s: 'ELEVATED', c: t.orange }].map((m, i) => (
          <GlassCard key={i} accent={m.c} className={`animate-fade-up delay-${i+1}`} style={{ padding: 18 }}><MetricBlock label={m.l} value={m.v} sub={m.s} color={m.c} /></GlassCard>
        ))}
      </div>
      <GlassCard className="animate-fade-up delay-2">
        <SectionHeader tag="FOOTPRINT" sub="Inventory by site type">Site Estate Inventory</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {sites.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: t.r.md, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
              <span style={{ fontSize: 28 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: t.fontD, fontSize: 24, fontWeight: 800, color: t.text, lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 600, color: t.textSoft, marginTop: 2 }}>{s.type}</div>
                <div style={{ fontFamily: t.fontM, fontSize: 10, color: t.textDim, marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <GlassCard className="animate-fade-up delay-3" accent={t.amber}>
          <SectionHeader tag="CARRIERS" sub="Provider distribution">Carrier & Circuit Analysis</SectionHeader>
          {carriers.map((c, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 600, color: t.text }}>{c.name}</span>
                <span style={{ fontFamily: t.fontM, fontSize: 11, color: t.textMuted }}>{c.circuits} circuits</span>
              </div>
              <BarMeter value={c.pct} color={cc[i]} />
            </div>
          ))}
        </GlassCard>
        <GlassCard className="animate-fade-up delay-4" accent={t.rose}>
          <SectionHeader tag="SECURITY" sub="Current security inventory">Security Stack</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[
              { tech: 'Palo Alto NGFW', scope: '62 sites', st: 'Active', c: t.emerald },
              { tech: 'Cisco ASA (Legacy)', scope: '45 sites — EoS risk', st: 'EOL Risk', c: t.rose },
              { tech: 'Zscaler ZIA', scope: '34 sites — partial', st: 'Active', c: t.emerald },
              { tech: 'Fortinet FortiGate', scope: '28 sites — acquired', st: 'Review', c: t.amber },
              { tech: 'Check Point NGFW', scope: '18 sites — sunset', st: 'Sunset', c: t.orange },
              { tech: 'CrowdStrike XDR', scope: 'All endpoints', st: 'Active', c: t.emerald },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: t.r.md, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
                <div><div style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 600, color: t.text }}>{item.tech}</div><div style={{ fontFamily: t.fontB, fontSize: 11, color: t.textDim }}>{item.scope}</div></div>
                <Chip color={item.c}>{item.st}</Chip>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* GTT Service Inventory */}
      <GlassCard className="animate-fade-up delay-5" accent={t.emerald}>
        <SectionHeader tag="GTT SERVICES" accent={t.emerald} sub={`${inPlaceCount} active · ${expansionCount} expansion opportunities`}>
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
                            {/* Toggle */}
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

                        {/* Expanded detail */}
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
                                  {svc.contractEnd || '—'}
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
    </div>
  );
};

export default EstateMapper;
