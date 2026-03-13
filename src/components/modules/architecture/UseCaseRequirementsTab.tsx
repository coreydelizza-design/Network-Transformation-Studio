import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../theme/useTheme';
import { useWorkshopStore } from '../../../store/useWorkshopStore';
import { GTT_USE_CASE_TEMPLATES, GTT_PATTERN_ELEMENTS, GTT_DIFFERENTIATOR_OVERLAYS } from '../../../data/seed';
import { GlassCard, SectionHeader, Chip, Mono } from '../../shared/Primitives';

/* ═══════════════════════════════════════════════════════════════════════════
   USE CASE & REQUIREMENTS TAB — Work Area 1
   Template selection → requirements intake → pattern library → recommendations
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Differentiator color map ── */
const DIFF_COLORS: Record<string, string> = {
  backbone: '#34d399',
  envision: '#3b82f6',
  'envision-edge': '#a78bfa',
  'integrated-security': '#fb7185',
  'global-consistency': '#fbbf24',
  vdc: '#22d3ee',
};

const DIFF_LABELS: Record<string, string> = {
  backbone: 'Backbone',
  envision: 'Envision',
  'envision-edge': 'EnvisionEDGE',
  'integrated-security': 'Integrated Security',
  'global-consistency': 'Global Consistency',
  vdc: 'VDC',
};

/* ── Category display ── */
const CATEGORY_ORDER: string[] = ['site', 'user', 'transport', 'backbone', 'security', 'cloud', 'edge', 'operations'];
const CATEGORY_LABELS: Record<string, string> = {
  site: 'Sites', user: 'Users', transport: 'Transport', backbone: 'Backbone',
  security: 'Security', cloud: 'Cloud & VDC', edge: 'Edge', operations: 'Operations',
};
const CATEGORY_ICONS: Record<string, string> = {
  site: '🏢', user: '👤', transport: '🔗', backbone: '🌐',
  security: '🛡', cloud: '☁', edge: '⚙', operations: '📊',
};

/* ── Multi-select option sets ── */
const REGION_OPTIONS = ['North America', 'EMEA', 'APAC', 'LATAM'] as const;
const SITE_TYPE_OPTIONS = ['branch', 'hub', 'dc', 'retail', 'plant', 'remote-user'];
const SECURITY_OPTIONS = ['firewall', 'sse', 'sase', 'ztna', 'casb', 'swg', 'dlp', 'soc'];
const COMPLIANCE_OPTIONS = ['sox', 'pci-dss', 'gdpr', 'hipaa', 'sovereignty'];
const CLOUD_OPTIONS = ['aws', 'azure', 'gcp', 'oracle', 'vdc'];

const BANDWIDTH_TIERS = ['standard', 'high', 'premium'] as const;
const RESILIENCY_TIERS = ['basic', 'enhanced', 'mission-critical'] as const;
const BREAKOUT_OPTIONS = ['centralized', 'regional', 'local'] as const;
const SERVICE_LEVELS = ['co-managed', 'fully-managed', 'advisory'] as const;


const UseCaseRequirementsTab: React.FC = () => {
  const { t, isDark } = useTheme();
  const store = useWorkshopStore();

  const [expandedElement, setExpandedElement] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleCollapse = (key: string) =>
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const selectedTemplate = useMemo(
    () => GTT_USE_CASE_TEMPLATES.find(t => t.id === store.selectedUseCaseId) || null,
    [store.selectedUseCaseId],
  );

  const groupedElements = useMemo(() => {
    const groups: Record<string, typeof store.patternElements> = {};
    for (const el of store.patternElements) {
      (groups[el.category] = groups[el.category] || []).push(el);
    }
    return groups;
  }, [store.patternElements]);

  /* ── Derived recommendations ── */
  const recommendations = useMemo(() => {
    if (!selectedTemplate) return [];
    const reqs = store.customerRequirements;
    const recs: { icon: string; title: string; description: string; whyGtt: string }[] = [];

    if (selectedTemplate.recommendedPatternIds.includes('gtt-backbone')) {
      recs.push({
        icon: '🌐', title: 'GTT Tier-1 Backbone',
        description: `Route traffic across ${reqs.regions.length} region${reqs.regions.length > 1 ? 's' : ''} on a single SLA-backed backbone, eliminating multi-carrier complexity.`,
        whyGtt: 'GTT operates one of the largest Tier-1 IP networks globally with native low-latency paths between 600+ PoPs.',
      });
    }
    if (selectedTemplate.recommendedPatternIds.includes('envision-edge')) {
      recs.push({
        icon: '⚙', title: 'EnvisionEDGE at Every Site',
        description: `Deploy virtualized edge across ${reqs.siteCount} sites to consolidate branch appliances and enable zero-touch provisioning.`,
        whyGtt: 'EnvisionEDGE replaces multiple physical appliances with a single universal CPE hosting SD-WAN, firewall, and routing as VNFs.',
      });
    }
    if (selectedTemplate.recommendedPatternIds.includes('vdc')) {
      recs.push({
        icon: '🏗', title: 'GTT Virtual Data Center',
        description: `Host ${reqs.dataSovereignty ? 'sovereignty-compliant ' : ''}workloads in backbone-connected VDC with guaranteed data residency.`,
        whyGtt: 'VDC provides IaaS directly on the GTT backbone — no public internet dependency — with in-region data sovereignty controls.',
      });
    }
    if (reqs.securityNeeds.length >= 3 || selectedTemplate.recommendedPatternIds.includes('sase')) {
      recs.push({
        icon: '🛡', title: 'Integrated Security Stack',
        description: `Converge ${reqs.securityNeeds.length} security functions into the network fabric for consistent policy enforcement.`,
        whyGtt: 'GTT embeds firewall, SSE, ZTNA, and SASE directly into the managed network, eliminating bolt-on security appliance stacks.',
      });
    }
    if (selectedTemplate.recommendedPatternIds.includes('managed-noc') || reqs.managedServiceLevel === 'fully-managed') {
      recs.push({
        icon: '📊', title: '24×7 Managed Operations',
        description: `Offload network operations to GTT NOC with proactive monitoring and ${reqs.resiliencyTier === 'mission-critical' ? 'mission-critical' : 'enhanced'} SLAs.`,
        whyGtt: 'GTT Managed NOC provides follow-the-sun operations with automated alerting, change management, and Envision portal visibility.',
      });
    }
    if (reqs.regions.length >= 3) {
      recs.push({
        icon: '🌍', title: 'Global Service Consistency',
        description: `Deliver identical SLAs, security posture, and operational support across ${reqs.regions.join(', ')}.`,
        whyGtt: 'Single-provider global reach eliminates regional carrier patchwork and ensures uniform service delivery worldwide.',
      });
    }

    return recs.slice(0, 6);
  }, [selectedTemplate, store.customerRequirements]);

  /* ═══════════════════════════════════════════════════════════════════════
     Shared sub-component styles
     ═══════════════════════════════════════════════════════════════════════ */
  const fieldLabel: React.CSSProperties = {
    fontFamily: t.fontM, fontSize: 8, color: t.textDim,
    letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 5,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 5,
    color: t.text, fontFamily: t.fontB, fontSize: 11, padding: '7px 10px', outline: 'none',
    transition: 'border-color 0.15s',
  };

  /* ── Inline sub-components ── */

  const Toggle = ({ value, onToggle, label }: { value: boolean; onToggle: () => void; label: string }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '7px 10px', borderRadius: 5, border: `1px solid ${t.borderSubtle}`,
      background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
    }}>
      <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft }}>{label}</span>
      <button onClick={onToggle} style={{
        width: 38, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', position: 'relative',
        background: value ? t.emerald + '35' : t.borderSubtle, transition: 'all 0.2s',
        boxShadow: value ? `0 0 8px ${t.emerald}15` : 'none',
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: 7, position: 'absolute', top: 3,
          left: value ? 21 : 3, background: value ? t.emerald : t.textDim, transition: 'all 0.2s',
        }} />
      </button>
    </div>
  );

  const MultiChipSelect = ({ options, selected, onToggle, color }: {
    options: readonly string[]; selected: string[]; onToggle: (v: string) => void; color?: string;
  }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        const c = color || t.accent;
        return (
          <button key={opt} onClick={() => onToggle(opt)} style={{
            padding: '4px 10px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
            border: `1px solid ${active ? c + '40' : t.borderSubtle}`,
            background: active ? c + '12' : 'transparent',
            color: active ? c : t.textDim,
            fontFamily: t.fontM, fontSize: 9, fontWeight: 600,
          }}>
            {opt.toUpperCase()}
          </button>
        );
      })}
    </div>
  );

  const SingleSelect = ({ options, value, onChange, color }: {
    options: readonly string[]; value: string; onChange: (v: string) => void; color?: string;
  }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(opt => {
        const active = value === opt;
        const c = color || t.accent;
        return (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: '4px 10px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
            border: `1px solid ${active ? c + '50' : t.borderSubtle}`,
            background: active ? c + '18' : 'transparent',
            color: active ? c : t.textDim,
            fontFamily: t.fontM, fontSize: 9, fontWeight: 600,
            boxShadow: active ? `0 0 6px ${c}12` : 'none',
          }}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        );
      })}
    </div>
  );

  const CollapsibleGroup = ({ id, title, icon, children }: {
    id: string; title: string; icon: string; children: React.ReactNode;
  }) => {
    const collapsed = collapsedSections[id];
    return (
      <div style={{ marginBottom: 6 }}>
        <button onClick={() => toggleCollapse(id)} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '8px 10px', borderRadius: 6, border: `1px solid ${t.borderSubtle}`,
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          cursor: 'pointer', transition: 'all 0.15s',
        }}>
          <span style={{ fontSize: 12 }}>{icon}</span>
          <span style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 700, color: t.text, flex: 1, textAlign: 'left' }}>{title}</span>
          <span style={{ fontFamily: t.fontM, fontSize: 10, color: t.textDim, transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
        </button>
        {!collapsed && (
          <div style={{ padding: '12px 10px 4px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {children}
          </div>
        )}
      </div>
    );
  };

  const toggleArrayItem = (field: keyof typeof store.customerRequirements, value: string) => {
    const current = store.customerRequirements[field] as string[];
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    store.setCustomerRequirements({ [field]: next });
  };

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 24,
      padding: '24px 28px', overflowY: 'auto', height: '100%',
      maxWidth: 1200, margin: '0 auto', width: '100%',
    }}>

      {/* ══════════════════════════════════════════════════════════════════
         SECTION A — Use Case Template Selector
         ══════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeader tag="A" accent={t.accent}>
          Solution Use Case
        </SectionHeader>
        <p style={{ fontFamily: t.fontB, fontSize: 12, color: t.textMuted, margin: '-10px 0 14px' }}>
          Select a use case to auto-configure requirements and recommended pattern elements.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12,
        }}>
          {GTT_USE_CASE_TEMPLATES.map(tpl => {
            const isSelected = store.selectedUseCaseId === tpl.id;
            const diffIds: string[] = [];
            for (const pid of tpl.recommendedPatternIds) {
              const d = GTT_PATTERN_ELEMENTS.find(p => p.id === pid)?.gttDifferentiator;
              if (d) diffIds.push(d);
            }
            const uniqueDiffs = [...new Set(diffIds)];

            return (
              <GlassCard
                key={tpl.id}
                accent={isSelected ? tpl.color : undefined}
                glow={isSelected}
                onClick={() => store.applyUseCaseTemplate(tpl.id)}
                style={{
                  padding: 16, cursor: 'pointer',
                  border: isSelected
                    ? `2px solid ${tpl.color}60`
                    : `1px solid ${t.borderSubtle}`,
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: tpl.color + '14',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                    border: `1px solid ${tpl.color}20`,
                  }}>
                    {tpl.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{
                        fontFamily: t.fontD, fontSize: 12, fontWeight: 700,
                        color: isSelected ? tpl.color : t.text,
                      }}>
                        {tpl.label}
                      </span>
                    </div>
                    <Chip color={tpl.color} small>{tpl.category}</Chip>
                    <p style={{
                      fontFamily: t.fontB, fontSize: 10, color: t.textDim,
                      margin: '6px 0 0', lineHeight: 1.5,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {tpl.description}
                    </p>
                  </div>
                </div>

                {/* Differentiator badges */}
                {uniqueDiffs.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
                    {uniqueDiffs.map(d => (
                      <span key={d} style={{
                        fontFamily: t.fontM, fontSize: 7, fontWeight: 700,
                        color: DIFF_COLORS[d] || t.textDim,
                        background: (DIFF_COLORS[d] || t.textDim) + '14',
                        border: `1px solid ${(DIFF_COLORS[d] || t.textDim)}25`,
                        padding: '2px 6px', borderRadius: 3,
                        letterSpacing: 0.5, textTransform: 'uppercase',
                      }}>
                        {DIFF_LABELS[d] || d}
                      </span>
                    ))}
                  </div>
                )}

                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 20, height: 20, borderRadius: 10,
                    background: tpl.color, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                  }}>✓</div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
         SECTION B — Requirements Intake Panel
         ══════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeader tag="B" accent={t.cyan}>
          Requirements Intake
        </SectionHeader>

        <GlassCard accent={t.cyan} style={{ padding: 18 }}>
          <CollapsibleGroup id="profile" title="Customer Profile" icon="🏢">
            <div>
              <div style={fieldLabel}>Customer Name</div>
              <input
                value={store.customerRequirements.customerName}
                onChange={e => store.setCustomerRequirements({ customerName: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <div style={fieldLabel}>Industry</div>
              <input
                value={store.customerRequirements.industry}
                onChange={e => store.setCustomerRequirements({ industry: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <div style={fieldLabel}>Regions</div>
              <MultiChipSelect
                options={REGION_OPTIONS}
                selected={store.customerRequirements.regions}
                onToggle={v => toggleArrayItem('regions', v)}
                color={t.cyan}
              />
            </div>
            <div>
              <div style={fieldLabel}>Site Count</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => store.setCustomerRequirements({ siteCount: Math.max(0, store.customerRequirements.siteCount - 10) })}
                  style={{ width: 28, height: 28, borderRadius: 5, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <input
                  type="number"
                  value={store.customerRequirements.siteCount}
                  onChange={e => store.setCustomerRequirements({ siteCount: Math.max(0, +e.target.value || 0) })}
                  style={{ ...inputStyle, width: 70, textAlign: 'center', fontFamily: t.fontM, fontWeight: 700, fontSize: 13 }}
                />
                <button onClick={() => store.setCustomerRequirements({ siteCount: store.customerRequirements.siteCount + 10 })}
                  style={{ width: 28, height: 28, borderRadius: 5, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
            </div>
            <div>
              <div style={fieldLabel}>Site Types</div>
              <MultiChipSelect
                options={SITE_TYPE_OPTIONS}
                selected={store.customerRequirements.siteTypes}
                onToggle={v => toggleArrayItem('siteTypes', v)}
                color={t.violet}
              />
            </div>
          </CollapsibleGroup>

          <CollapsibleGroup id="infra" title="Infrastructure" icon="🔗">
            <div>
              <div style={fieldLabel}>Bandwidth Tier</div>
              <SingleSelect
                options={BANDWIDTH_TIERS}
                value={store.customerRequirements.bandwidthTier}
                onChange={v => store.setCustomerRequirements({ bandwidthTier: v as typeof store.customerRequirements.bandwidthTier })}
                color={t.accent}
              />
            </div>
            <div>
              <div style={fieldLabel}>Resiliency Tier</div>
              <SingleSelect
                options={RESILIENCY_TIERS}
                value={store.customerRequirements.resiliencyTier}
                onChange={v => store.setCustomerRequirements({ resiliencyTier: v as typeof store.customerRequirements.resiliencyTier })}
                color={t.emerald}
              />
            </div>
            <div>
              <div style={fieldLabel}>Internet Breakout</div>
              <SingleSelect
                options={BREAKOUT_OPTIONS}
                value={store.customerRequirements.internetBreakout}
                onChange={v => store.setCustomerRequirements({ internetBreakout: v as typeof store.customerRequirements.internetBreakout })}
                color={t.amber}
              />
            </div>
          </CollapsibleGroup>

          <CollapsibleGroup id="security" title="Security & Compliance" icon="🛡">
            <div>
              <div style={fieldLabel}>Security Needs</div>
              <MultiChipSelect
                options={SECURITY_OPTIONS}
                selected={store.customerRequirements.securityNeeds}
                onToggle={v => toggleArrayItem('securityNeeds', v)}
                color={t.rose}
              />
            </div>
            <div>
              <div style={fieldLabel}>Compliance Needs</div>
              <MultiChipSelect
                options={COMPLIANCE_OPTIONS}
                selected={store.customerRequirements.complianceNeeds}
                onToggle={v => toggleArrayItem('complianceNeeds', v)}
                color={t.amber}
              />
            </div>
            <Toggle
              label="Data Sovereignty Required"
              value={store.customerRequirements.dataSovereignty}
              onToggle={() => store.setCustomerRequirements({ dataSovereignty: !store.customerRequirements.dataSovereignty })}
            />
          </CollapsibleGroup>

          <CollapsibleGroup id="cloud" title="Cloud & Compute" icon="☁">
            <div>
              <div style={fieldLabel}>Cloud Environments</div>
              <MultiChipSelect
                options={CLOUD_OPTIONS}
                selected={store.customerRequirements.cloudEnvironments}
                onToggle={v => toggleArrayItem('cloudEnvironments', v)}
                color={t.cyan}
              />
            </div>
            <Toggle
              label="Local Edge Compute Required"
              value={store.customerRequirements.localCompute}
              onToggle={() => store.setCustomerRequirements({ localCompute: !store.customerRequirements.localCompute })}
            />
          </CollapsibleGroup>

          <CollapsibleGroup id="service" title="Service Model" icon="⚙">
            <div>
              <div style={fieldLabel}>Managed Service Level</div>
              <SingleSelect
                options={SERVICE_LEVELS}
                value={store.customerRequirements.managedServiceLevel}
                onChange={v => store.setCustomerRequirements({ managedServiceLevel: v as typeof store.customerRequirements.managedServiceLevel })}
                color={t.emerald}
              />
            </div>
            <div>
              <div style={fieldLabel}>Notes</div>
              <textarea
                value={store.customerRequirements.notes}
                onChange={e => store.setCustomerRequirements({ notes: e.target.value })}
                placeholder="Additional requirements, constraints, or context..."
                rows={3}
                style={{
                  ...inputStyle,
                  resize: 'vertical', minHeight: 60,
                  fontFamily: t.fontB, fontSize: 11, lineHeight: 1.6,
                }}
              />
            </div>
          </CollapsibleGroup>
        </GlassCard>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
         SECTION C — Pattern Elements Library
         ══════════════════════════════════════════════════════════════════ */}
      <section>
        <SectionHeader tag="C" accent={t.violet}>
          Pattern Elements Library
        </SectionHeader>
        <p style={{ fontFamily: t.fontB, fontSize: 12, color: t.textMuted, margin: '-10px 0 14px' }}>
          Enable, configure, and annotate the building blocks of your solution architecture.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CATEGORY_ORDER.filter(cat => groupedElements[cat]).map(cat => {
            const elements = groupedElements[cat];
            const catIcon = CATEGORY_ICONS[cat] || '◆';
            const catLabel = CATEGORY_LABELS[cat] || cat;
            const enabledCount = elements.filter(e => e.enabled).length;

            return (
              <GlassCard key={cat} style={{ padding: 16 }}>
                {/* Category header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 14 }}>{catIcon}</span>
                  <span style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text }}>{catLabel}</span>
                  <div style={{ flex: 1, height: 1, background: t.borderSubtle, marginLeft: 4 }} />
                  <span style={{
                    fontFamily: t.fontM, fontSize: 8, fontWeight: 700,
                    color: enabledCount > 0 ? t.emerald : t.textDim,
                    background: enabledCount > 0 ? t.emerald + '14' : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                    padding: '2px 7px', borderRadius: 3,
                  }}>
                    {enabledCount}/{elements.length}
                  </span>
                </div>

                {/* Element rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {elements.map(el => {
                    const isExpanded = expandedElement === el.id;
                    const diffColor = el.gttDifferentiator ? DIFF_COLORS[el.gttDifferentiator] : null;

                    return (
                      <div key={el.id}>
                        <div
                          onClick={() => setExpandedElement(isExpanded ? null : el.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                            transition: 'all 0.15s',
                            background: isExpanded
                              ? (diffColor || t.accent) + '08'
                              : el.enabled
                                ? 'transparent'
                                : isDark ? 'rgba(255,255,255,0.008)' : 'rgba(0,0,0,0.008)',
                            border: `1px solid ${isExpanded ? (diffColor || t.accent) + '30' : t.borderSubtle}`,
                            borderLeft: diffColor
                              ? `3px solid ${diffColor}${el.enabled ? '80' : '30'}`
                              : `1px solid ${isExpanded ? (diffColor || t.accent) + '30' : t.borderSubtle}`,
                            opacity: el.enabled ? 1 : 0.5,
                          }}
                        >
                          {/* Icon */}
                          <span style={{
                            fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0,
                            filter: el.enabled ? 'none' : 'grayscale(0.8)',
                          }}>{el.icon}</span>

                          {/* Label + narrative */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{
                                fontFamily: t.fontD, fontSize: 11, fontWeight: 600,
                                color: el.enabled ? t.text : t.textDim,
                                textDecoration: el.enabled ? 'none' : 'line-through',
                                textDecorationColor: t.textDim + '40',
                              }}>
                                {el.label}
                              </span>
                              {el.gttDifferentiator && (
                                <span style={{
                                  fontFamily: t.fontM, fontSize: 7, fontWeight: 700,
                                  color: diffColor || t.textDim,
                                  background: (diffColor || t.textDim) + '14',
                                  padding: '1px 5px', borderRadius: 3,
                                  letterSpacing: 0.4, textTransform: 'uppercase',
                                }}>
                                  {DIFF_LABELS[el.gttDifferentiator] || el.gttDifferentiator}
                                </span>
                              )}
                            </div>
                            <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, marginTop: 1 }}>
                              {el.placementZone}
                            </div>
                          </div>

                          {/* Quantity stepper */}
                          {el.enabled && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                onClick={() => store.setPatternQuantity(el.id, Math.max(1, el.quantity - 1))}
                                style={{
                                  width: 20, height: 20, borderRadius: 4,
                                  border: `1px solid ${t.border}`, background: t.bgInput,
                                  color: t.textMuted, fontSize: 11, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                              >−</button>
                              <span style={{
                                fontFamily: t.fontM, fontSize: 10, fontWeight: 700,
                                color: diffColor || t.accent,
                                minWidth: 24, textAlign: 'center',
                              }}>{el.quantity}</span>
                              <button
                                onClick={() => store.setPatternQuantity(el.id, el.quantity + 1)}
                                style={{
                                  width: 20, height: 20, borderRadius: 4,
                                  border: `1px solid ${t.border}`, background: t.bgInput,
                                  color: t.textMuted, fontSize: 11, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                              >+</button>
                            </div>
                          )}

                          {/* Enable toggle */}
                          <button
                            onClick={e => { e.stopPropagation(); store.togglePatternElement(el.id); }}
                            style={{
                              width: 34, height: 18, borderRadius: 9, border: 'none',
                              cursor: 'pointer', position: 'relative', flexShrink: 0,
                              background: el.enabled ? t.emerald + '35' : t.borderSubtle,
                              transition: 'all 0.2s',
                              boxShadow: el.enabled ? `0 0 6px ${t.emerald}15` : 'none',
                            }}
                          >
                            <div style={{
                              width: 12, height: 12, borderRadius: 6, position: 'absolute', top: 3,
                              left: el.enabled ? 19 : 3,
                              background: el.enabled ? t.emerald : t.textDim,
                              transition: 'all 0.2s',
                            }} />
                          </button>
                        </div>

                        {/* Expanded inline editor */}
                        {isExpanded && (
                          <div style={{
                            marginTop: 4, padding: '12px 14px', borderRadius: 6,
                            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                            border: `1px solid ${t.borderSubtle}`,
                            borderTop: 'none', borderTopLeftRadius: 0, borderTopRightRadius: 0,
                          }}>
                            {/* Narrative impact */}
                            <div style={{ marginBottom: 10 }}>
                              <Mono size={7} color={t.textDim}>Narrative Impact</Mono>
                              <p style={{
                                fontFamily: t.fontB, fontSize: 11, color: t.textSoft,
                                margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic',
                              }}>
                                {el.narrativeImpact}
                              </p>
                            </div>

                            {/* Editable props display */}
                            {Object.keys(el.editableProps).length > 0 && (
                              <div style={{ marginBottom: 10 }}>
                                <Mono size={7} color={t.textDim}>Configuration</Mono>
                                <div style={{
                                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                  gap: 6, marginTop: 4,
                                }}>
                                  {Object.entries(el.editableProps).map(([key, val]) => (
                                    <div key={key} style={{
                                      padding: '4px 8px', borderRadius: 4,
                                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                                      border: `1px solid ${t.borderSubtle}`,
                                    }}>
                                      <div style={{ fontFamily: t.fontM, fontSize: 7, color: t.textDim, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                      </div>
                                      <div style={{ fontFamily: t.fontB, fontSize: 10, color: t.text, marginTop: 1 }}>
                                        {typeof val === 'boolean' ? (val ? '✓ Yes' : '✗ No') : String(val)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Customer notes */}
                            <div>
                              <Mono size={7} color={t.textDim}>Customer Notes</Mono>
                              <textarea
                                value={el.customerNotes}
                                onChange={e => store.setPatternNote(el.id, e.target.value)}
                                placeholder="Add customer-specific notes for this element..."
                                rows={2}
                                style={{
                                  ...inputStyle,
                                  marginTop: 4, resize: 'vertical', minHeight: 40,
                                  fontFamily: t.fontB, fontSize: 10, lineHeight: 1.5,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
         SECTION D — Recommendations Panel
         ══════════════════════════════════════════════════════════════════ */}
      {selectedTemplate && recommendations.length > 0 && (
        <section>
          <SectionHeader tag="D" accent={t.emerald}>
            GTT Recommendations
          </SectionHeader>
          <p style={{ fontFamily: t.fontB, fontSize: 12, color: t.textMuted, margin: '-10px 0 14px' }}>
            Based on <strong style={{ color: t.text }}>{selectedTemplate.label}</strong> and your requirements profile.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12,
          }}>
            {recommendations.map((rec, i) => (
              <GlassCard key={i} accent={t.emerald} style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: t.emerald + '14',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    border: `1px solid ${t.emerald}20`,
                  }}>
                    {rec.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 4,
                    }}>
                      {rec.title}
                    </div>
                    <p style={{
                      fontFamily: t.fontB, fontSize: 10, color: t.textSoft,
                      margin: '0 0 8px', lineHeight: 1.5,
                    }}>
                      {rec.description}
                    </p>
                    <div style={{
                      padding: '6px 10px', borderRadius: 5,
                      background: t.emerald + '08',
                      border: `1px solid ${t.emerald}15`,
                    }}>
                      <div style={{
                        fontFamily: t.fontM, fontSize: 7, color: t.emerald,
                        letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 3,
                      }}>
                        Why GTT
                      </div>
                      <p style={{
                        fontFamily: t.fontB, fontSize: 10, color: t.textDim,
                        margin: 0, lineHeight: 1.5,
                      }}>
                        {rec.whyGtt}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* Bottom spacer for scroll comfort */}
      <div style={{ height: 32, flexShrink: 0 }} />
    </div>
  );
};

export default UseCaseRequirementsTab;
