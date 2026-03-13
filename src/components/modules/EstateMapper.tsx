import React from 'react';
import { useTheme } from '../../theme/useTheme';
import { GlassCard, SectionHeader, Chip, MetricBlock, BarMeter, PageHeader } from '../shared/Primitives';

const EstateMapper: React.FC = () => {
  const { t } = useTheme();
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
    </div>
  );
};

export default EstateMapper;
