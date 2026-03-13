import React, { useState } from 'react';
import { useTheme } from '../../theme/useTheme';
import { NAV } from '../../data/seed';
import { useWorkshopStore } from '../../store/useWorkshopStore';
import { GlassCard, SectionHeader, Chip, MetricBlock, PhaseTag } from '../shared/Primitives';

const TIER_COLORS: Record<string, string> = { executive: '#fb7185', leader: '#a78bfa', technical: '#22d3ee' };
const ALL_REGIONS = ['North America', 'EMEA', 'APAC', 'LATAM'] as const;
const TIER_OPTIONS: ('executive' | 'leader' | 'technical')[] = ['executive', 'leader', 'technical'];

const CommandCenter: React.FC = () => {
  const { t } = useTheme();
  const {
    customer, updateCustomer, updateStakeholder, addStakeholder, removeStakeholder, resetCustomer,
    setActiveTab: setTab, painScores, maturity,
  } = useWorkshopStore();
  const [editMode, setEditMode] = useState(false);
  const done = 3;
  const matArr = Object.values(maturity);
  const avgMat = (matArr.reduce((s, d) => s + d.current, 0) / matArr.length).toFixed(1);
  const critPains = Object.entries(painScores).filter(([, v]) => v >= 7).length;

  const inputStyle: React.CSSProperties = {
    background: t.bgInput || t.bgGlass, border: `1px solid ${t.border}`, borderRadius: 5,
    color: t.text, fontFamily: t.fontB, fontSize: 13, padding: '5px 8px', outline: 'none', width: '100%',
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: t.fontM, fontSize: 9, color: t.textDim, letterSpacing: 1, marginBottom: 3, display: 'block',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Banner */}
      <div className="animate-fade-up" style={{ position: 'relative', borderRadius: t.r.xl, overflow: 'hidden', background: `linear-gradient(135deg, ${t.bgDeep}, ${t.bgGlass})`, border: `1px solid ${t.border}` }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${t.accent}08, transparent 60%), radial-gradient(ellipse at 80% 20%, ${t.violet}06, transparent 50%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${t.accent}40, transparent)` }} />
        <div style={{ padding: '32px 32px 24px', position: 'relative' }}>
          {/* Edit toggle */}
          <div style={{ position: 'absolute', top: 16, right: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
            {editMode && (
              <button onClick={resetCustomer} style={{
                padding: '4px 10px', borderRadius: 5, cursor: 'pointer', border: `1px solid ${t.rose}40`,
                background: t.rose + '10', color: t.rose, fontFamily: t.fontM, fontSize: 9, fontWeight: 600,
              }}>Reset to Default</button>
            )}
            <button onClick={() => setEditMode(!editMode)} style={{
              padding: '5px 12px', borderRadius: 5, cursor: 'pointer', border: `1px solid ${editMode ? t.emerald + '50' : t.border}`,
              background: editMode ? t.emerald + '12' : 'transparent', color: editMode ? t.emerald : t.textDim,
              fontFamily: t.fontM, fontSize: 10, fontWeight: 600, transition: 'all 0.15s',
            }}>{editMode ? 'Done' : 'Edit Profile'}</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontFamily: t.fontM, fontSize: 10, color: t.accent, letterSpacing: 2.5, fontWeight: 600, marginBottom: 8 }}>ACTIVE WORKSHOP — {customer.workshopId}</div>
              {editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 480 }}>
                  <div>
                    <span style={labelStyle}>COMPANY NAME</span>
                    <input value={customer.name} onChange={e => updateCustomer({ name: e.target.value })} style={{ ...inputStyle, fontFamily: t.fontD, fontSize: 22, fontWeight: 900, padding: '8px 10px' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <span style={labelStyle}>INDUSTRY</span>
                      <input value={customer.industry} onChange={e => updateCustomer({ industry: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <span style={labelStyle}>REVENUE</span>
                      <input value={customer.revenue} onChange={e => updateCustomer({ revenue: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <span style={labelStyle}>EMPLOYEES</span>
                      <input value={customer.employees} onChange={e => updateCustomer({ employees: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <span style={labelStyle}>SITES</span>
                      <input type="number" value={customer.sites} onChange={e => updateCustomer({ sites: parseInt(e.target.value) || 0 })} style={inputStyle} />
                    </div>
                    <div>
                      <span style={labelStyle}>COUNTRIES</span>
                      <input type="number" value={customer.countries} onChange={e => updateCustomer({ countries: parseInt(e.target.value) || 0 })} style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <span style={labelStyle}>REGIONS</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {ALL_REGIONS.map(r => {
                        const active = customer.regions.includes(r);
                        return (
                          <button key={r} onClick={() => {
                            const regions = active ? customer.regions.filter(x => x !== r) : [...customer.regions, r];
                            updateCustomer({ regions });
                          }} style={{
                            padding: '4px 10px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
                            border: `1px solid ${active ? t.cyan + '50' : t.borderSubtle}`,
                            background: active ? t.cyan + '14' : 'transparent',
                            color: active ? t.cyan : t.textDim,
                            fontFamily: t.fontM, fontSize: 10, fontWeight: 600,
                          }}>{r}</button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 style={{ fontFamily: t.fontD, fontSize: 32, fontWeight: 900, color: t.text, margin: 0, letterSpacing: -1 }}>{customer.name}</h1>
                  <div style={{ fontFamily: t.fontB, fontSize: 14, color: t.textMuted, marginTop: 8 }}>{customer.industry} · {customer.revenue} · {customer.employees} · {customer.sites} Sites</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>{customer.regions.map(r => <Chip key={r} color={t.cyan}>{r}</Chip>)}</div>
                </>
              )}
            </div>
            <div style={{ textAlign: 'right', minWidth: 200 }}>
              <div style={{ fontFamily: t.fontM, fontSize: 10, color: t.textDim, letterSpacing: 1.5 }}>WORKSHOP LEAD</div>
              {editMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4, alignItems: 'flex-end' }}>
                  <input value={customer.workshopLead} onChange={e => updateCustomer({ workshopLead: e.target.value })} style={{ ...inputStyle, textAlign: 'right', fontFamily: t.fontD, fontWeight: 700 }} />
                  <input value={customer.workshopLeadTitle} onChange={e => updateCustomer({ workshopLeadTitle: e.target.value })} style={{ ...inputStyle, textAlign: 'right', fontSize: 11 }} />
                  <div>
                    <span style={{ ...labelStyle, textAlign: 'right' }}>DATE</span>
                    <input value={customer.workshopDate} onChange={e => updateCustomer({ workshopDate: e.target.value })} style={{ ...inputStyle, textAlign: 'right', fontSize: 11 }} />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: t.fontD, fontSize: 16, fontWeight: 700, color: t.text, marginTop: 4 }}>{customer.workshopLead}</div>
                  <div style={{ fontFamily: t.fontB, fontSize: 12, color: t.textMuted }}>{customer.workshopLeadTitle}</div>
                  <div style={{ fontFamily: t.fontM, fontSize: 11, color: t.textDim, marginTop: 6 }}>{customer.workshopDate}</div>
                </>
              )}
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontFamily: t.fontM, fontSize: 10, color: t.textDim, letterSpacing: 1.5 }}>WORKSHOP JOURNEY</span>
              <span style={{ fontFamily: t.fontM, fontSize: 11, color: t.accent, fontWeight: 600 }}>{done}/9 PHASES COMPLETE</span>
            </div>
            <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
              {NAV.filter(n => n.phase).map(n => (
                <div key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, height: 6, borderRadius: 3, cursor: 'pointer', background: n.phase! <= done ? t.accent : n.phase === done + 1 ? t.accent + '40' : t.border, boxShadow: n.phase! <= done ? `0 0 6px ${t.accent}30` : 'none', transition: 'all 0.3s' }} title={n.label} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 3 }}>{NAV.filter(n => n.phase).map(n => (
              <div key={n.id} style={{ flex: 1, textAlign: 'center' }}><span style={{ fontFamily: t.fontM, fontSize: 8, color: n.phase! <= done ? t.accent : t.textDim }}>{n.short}</span></div>
            ))}</div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Sites', value: String(customer.sites), sub: `across ${customer.countries} countries`, color: t.accent },
          { label: 'Avg Maturity', value: avgMat, sub: 'of 5.0 target scale', color: t.amber },
          { label: 'Critical Pains', value: String(critPains), sub: 'severity \u2265 7', color: t.rose },
          { label: 'Stakeholders', value: String(customer.stakeholders.length), sub: 'in session', color: t.violet },
        ].map((m, i) => (
          <GlassCard key={i} accent={m.color} className={`animate-fade-up delay-${i + 1}`} style={{ padding: 20 }}>
            <MetricBlock label={m.label} value={m.value} sub={m.sub} color={m.color} />
          </GlassCard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Stakeholders */}
        <GlassCard className="animate-fade-up delay-2">
          <SectionHeader tag="PARTICIPANTS" sub="Key decision-makers in session">Workshop Stakeholders</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {customer.stakeholders.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', borderRadius: t.r.md, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${TIER_COLORS[s.tier]}40, ${TIER_COLORS[s.tier]}15)`, border: `1px solid ${TIER_COLORS[s.tier]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontM, fontSize: 12, fontWeight: 700, color: TIER_COLORS[s.tier], flexShrink: 0 }}>{s.avatar}</div>
                {editMode ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input value={s.name} onChange={e => updateStakeholder(i, { name: e.target.value })} placeholder="Name" style={{ ...inputStyle, flex: 1, fontSize: 12, fontFamily: t.fontD, fontWeight: 600 }} />
                      <select value={s.tier} onChange={e => updateStakeholder(i, { tier: e.target.value as 'executive' | 'leader' | 'technical' })} style={{ ...inputStyle, width: 100, fontSize: 10 }}>
                        {TIER_OPTIONS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                      </select>
                    </div>
                    <input value={s.title} onChange={e => updateStakeholder(i, { title: e.target.value })} placeholder="Title" style={{ ...inputStyle, fontSize: 10 }} />
                    <input value={s.focus} onChange={e => updateStakeholder(i, { focus: e.target.value })} placeholder="Focus area" style={{ ...inputStyle, fontSize: 10 }} />
                  </div>
                ) : (
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 600, color: t.text }}>{s.name}</div>
                    <div style={{ fontFamily: t.fontB, fontSize: 11, color: t.textDim }}>{s.title}</div>
                    <div style={{ fontFamily: t.fontB, fontSize: 10, color: TIER_COLORS[s.tier], marginTop: 1 }}>{s.focus}</div>
                  </div>
                )}
                {editMode && (
                  <button onClick={() => removeStakeholder(i)} style={{
                    width: 24, height: 24, borderRadius: 6, border: `1px solid ${t.rose}30`,
                    background: t.rose + '10', color: t.rose, cursor: 'pointer',
                    fontFamily: t.fontM, fontSize: 13, fontWeight: 700, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>&times;</button>
                )}
              </div>
            ))}
            {editMode && (
              <button onClick={() => addStakeholder({ name: '', title: '', focus: '', avatar: 'ST', tier: 'technical' })} style={{
                padding: '10px 14px', borderRadius: t.r.md, cursor: 'pointer', transition: 'all 0.15s',
                border: `1px dashed ${t.emerald}40`, background: t.emerald + '06',
                color: t.emerald, fontFamily: t.fontM, fontSize: 11, fontWeight: 600,
              }}>+ Add Stakeholder</button>
            )}
          </div>
        </GlassCard>
        {/* Module Nav */}
        <GlassCard className="animate-fade-up delay-3">
          <SectionHeader tag="NAVIGATION" sub="Select any module to begin or resume">Workshop Modules</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {NAV.filter(n => n.phase).map(n => {
              const isDone = n.phase! <= done;
              const isCur = n.phase === done + 1;
              return (
                <div key={n.id} onClick={() => setTab(n.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: t.r.md, cursor: 'pointer', transition: 'all 0.2s', background: isCur ? t.accent + '08' : isDone ? t.emerald + '05' : 'transparent', border: `1px solid ${isCur ? t.accent + '30' : isDone ? t.emerald + '15' : 'transparent'}` }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? t.emerald + '20' : isCur ? t.accent + '15' : t.bgHover, border: `1px solid ${isDone ? t.emerald + '40' : isCur ? t.accent + '30' : t.border}`, fontFamily: t.fontM, fontSize: 10, fontWeight: 700, color: isDone ? t.emerald : isCur ? t.accent : t.textDim }}>{isDone ? '\u2713' : n.phase}</div>
                  <span style={{ flex: 1, fontFamily: t.fontD, fontSize: 13, color: isDone ? t.emerald : isCur ? t.accent : t.textSoft, fontWeight: isDone || isCur ? 600 : 400 }}>{n.label}</span>
                  {isCur && <Chip color={t.accent} size="sm">Next</Chip>}
                  <span style={{ color: t.textDim }}>\u203A</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="animate-fade-up delay-4" accent={t.blue}>
        <SectionHeader tag="STRATEGIC CONTEXT" sub="Primary transformation drivers">Business Driver Alignment</SectionHeader>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[{ l: 'Cloud-First Acceleration', c: t.cyan }, { l: 'Zero Trust Security Mandate', c: t.rose }, { l: 'M&A Integration (\u00d72)', c: t.violet }, { l: 'Branch Standardization', c: t.orange }, { l: 'Carrier Consolidation', c: t.amber }, { l: 'AI & Edge Readiness', c: t.lime }].map((d, i) => <Chip key={i} color={d.c} size="md">{d.l}</Chip>)}
        </div>
      </GlassCard>
    </div>
  );
};

export default CommandCenter;
