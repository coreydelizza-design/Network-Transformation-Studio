import React from 'react';
import { useTheme } from '../../../theme/useTheme';
import { Chip, Mono } from '../../shared/Primitives';
import type { PatternElement, PatternOverride } from './types';
import { PHASE_LABELS, MANAGEMENT_MODELS } from './types';
import type { PatternOverridesAPI } from './usePatternOverrides';

/* ═══════════════════════════════════════════════════════════════════════════
   PATTERN ELEMENT INSPECTOR — Slide-out editor panel
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  element: PatternElement;
  api: PatternOverridesAPI;
  accent: string;
  onClose: () => void;
}

const PatternElementInspector: React.FC<Props> = ({ element, api, accent, onClose }) => {
  const { t, isDark } = useTheme();
  const el = element;
  const hasOverrides = !!api.overrides[el.id];

  const set = (field: keyof PatternOverride, value: unknown) => api.setOverride(el.id, field, value);

  /* ─── Shared styles ─── */
  const fieldLabel: React.CSSProperties = {
    fontFamily: t.fontM, fontSize: 8, color: t.textDim,
    letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4,
  };
  const inputBase: React.CSSProperties = {
    width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 5,
    color: t.text, fontFamily: t.fontB, fontSize: 11, padding: '7px 10px', outline: 'none',
  };
  const selectBase: React.CSSProperties = { ...inputBase, cursor: 'pointer' };
  const textareaBase: React.CSSProperties = { ...inputBase, resize: 'vertical' as const, lineHeight: 1.5 };
  const toggleRow: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 10px', borderRadius: 5, border: `1px solid ${t.borderSubtle}`,
    background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
  };
  const sectionGap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };

  const groupColors: Record<string, string> = {
    control: t.accent, core: accent, edge: t.amber, cloud: t.cyan,
    dc: t.violet, security: t.rose, saas: t.emerald,
  };
  const gc = groupColors[el.group] || accent;

  return (
    <div style={{
      width: 320, background: t.bgPanel, borderLeft: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', borderBottom: `1px solid ${t.border}`,
        background: gc + '06', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${gc}50, transparent)` }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Mono size={8} color={gc}>ELEMENT INSPECTOR</Mono>
          <div style={{ display: 'flex', gap: 6 }}>
            {hasOverrides && (
              <button onClick={() => api.clearOverride(el.id)} title="Revert to base template"
                style={{ padding: '3px 8px', borderRadius: 4, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textDim, fontFamily: t.fontM, fontSize: 8, cursor: 'pointer' }}>
                Reset
              </button>
            )}
            <button onClick={onClose}
              style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ×
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, background: gc + '15', border: `1px solid ${gc}30`, flexShrink: 0,
          }}>{el.icon}</div>
          <div>
            <div style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 700, color: t.text }}>{el.label}</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 3 }}>
              <Chip color={gc} small>{el.category}</Chip>
              {hasOverrides && <Chip color={t.amber} small>Modified</Chip>}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Identity ── */}
        <div style={sectionGap}>
          <Mono size={8} color={t.textDim}>Identity</Mono>
          <div>
            <div style={fieldLabel}>Label</div>
            <input value={el.label} onChange={e => set('label', e.target.value)} style={{ ...inputBase, fontFamily: t.fontD, fontWeight: 600 }} />
          </div>
          <div>
            <div style={fieldLabel}>Category</div>
            <input value={el.category} onChange={e => set('category', e.target.value)} style={inputBase} />
          </div>
          <div>
            <div style={fieldLabel}>Description</div>
            <textarea value={el.description} onChange={e => set('description', e.target.value)} rows={3} style={textareaBase} />
          </div>
        </div>

        {/* ── Applicability & Quantity ── */}
        <div style={sectionGap}>
          <Mono size={8} color={t.textDim}>Applicability & Quantity</Mono>
          <div style={toggleRow}>
            <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft }}>Applicable</span>
            <button onClick={() => set('applicable', !el.applicable)} style={{
              width: 38, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', position: 'relative',
              background: el.applicable ? t.emerald + '30' : t.borderSubtle, transition: 'all 0.2s',
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: 7, position: 'absolute', top: 3,
                left: el.applicable ? 21 : 3, background: el.applicable ? t.emerald : t.textDim,
                transition: 'all 0.2s', boxShadow: `0 0 4px ${el.applicable ? t.emerald + '40' : 'transparent'}`,
              }} />
            </button>
          </div>
          <div>
            <div style={fieldLabel}>Quantity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button onClick={() => set('quantity', Math.max(0, el.quantity - 1))}
                style={{ width: 28, height: 28, borderRadius: 5, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <input type="number" value={el.quantity} onChange={e => set('quantity', Math.max(0, +e.target.value || 0))}
                style={{ ...inputBase, width: 60, textAlign: 'center', fontFamily: t.fontM, fontWeight: 700, fontSize: 13 }} />
              <button onClick={() => set('quantity', el.quantity + 1)}
                style={{ width: 28, height: 28, borderRadius: 5, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>
        </div>

        {/* ── Deployment ── */}
        <div style={sectionGap}>
          <Mono size={8} color={t.textDim}>Deployment</Mono>
          <div>
            <div style={fieldLabel}>Deployment Role</div>
            <input value={el.deploymentRole} onChange={e => set('deploymentRole', e.target.value)} style={inputBase} />
          </div>
          <div>
            <div style={fieldLabel}>Network Type</div>
            <input value={el.networkType} onChange={e => set('networkType', e.target.value)} style={inputBase} />
          </div>
          <div>
            <div style={fieldLabel}>Implementation Phase</div>
            <select value={el.implementationPhase} onChange={e => set('implementationPhase', +e.target.value)} style={selectBase}>
              {Object.entries(PHASE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* ── Attributes ── */}
        <div style={sectionGap}>
          <Mono size={8} color={t.textDim}>Attributes</Mono>
          <div>
            <div style={fieldLabel}>Security</div>
            <textarea value={el.securityAttributes} onChange={e => set('securityAttributes', e.target.value)} rows={2} style={textareaBase} />
          </div>
          <div>
            <div style={fieldLabel}>Performance</div>
            <textarea value={el.performanceAttributes} onChange={e => set('performanceAttributes', e.target.value)} rows={2} style={textareaBase} />
          </div>
          <div>
            <div style={fieldLabel}>Resiliency</div>
            <textarea value={el.resiliencyAttributes} onChange={e => set('resiliencyAttributes', e.target.value)} rows={2} style={textareaBase} />
          </div>
        </div>

        {/* ── Operations ── */}
        <div style={sectionGap}>
          <Mono size={8} color={t.textDim}>Operations</Mono>
          <div>
            <div style={fieldLabel}>Management Model</div>
            <select value={el.managementModel} onChange={e => set('managementModel', e.target.value)} style={selectBase}>
              {MANAGEMENT_MODELS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <div style={fieldLabel}>Provider / Ownership</div>
            <input value={el.providerModel} onChange={e => set('providerModel', e.target.value)} style={inputBase} />
          </div>
        </div>

        {/* ── Customer Notes ── */}
        <div style={sectionGap}>
          <Mono size={8} color={t.textDim}>Customer Notes</Mono>
          <textarea
            value={el.customerNotes}
            onChange={e => set('customerNotes', e.target.value)}
            placeholder="Capture customer-specific notes for this element..."
            rows={4}
            style={textareaBase}
          />
        </div>
      </div>
    </div>
  );
};

export default PatternElementInspector;
