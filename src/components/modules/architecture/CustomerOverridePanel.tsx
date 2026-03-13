import React from 'react';
import { useTheme } from '../../../theme/useTheme';
import { Mono } from '../../shared/Primitives';
import { CLOUD_PROVIDER_OPTIONS, MANAGEMENT_MODELS } from './types';
import type { PatternOverridesAPI } from './usePatternOverrides';

/* ═══════════════════════════════════════════════════════════════════════════
   CUSTOMER OVERRIDE PANEL — engagement-wide customer specifics
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  api: PatternOverridesAPI;
  accent: string;
}

const CustomerOverridePanel: React.FC<Props> = ({ api, accent }) => {
  const { t, isDark } = useTheme();
  const cs = api.customerSpecifics;

  const fieldLabel: React.CSSProperties = {
    fontFamily: t.fontM, fontSize: 8, color: t.textDim,
    letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 600, marginBottom: 4,
  };
  const inputBase: React.CSSProperties = {
    width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 5,
    color: t.text, fontFamily: t.fontB, fontSize: 11, padding: '7px 10px', outline: 'none',
  };
  const toggleRow: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '7px 10px', borderRadius: 5, border: `1px solid ${t.borderSubtle}`,
    background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
  };

  const Toggle = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) => (
    <div style={toggleRow}>
      <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft }}>{label}</span>
      <button onClick={onToggle} style={{
        width: 38, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', position: 'relative',
        background: value ? t.emerald + '35' : t.borderSubtle, transition: 'all 0.2s',
        boxShadow: value ? `0 0 8px ${t.emerald}15` : 'none',
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: 7, position: 'absolute', top: 3,
          left: value ? 21 : 3, background: value ? t.emerald : t.textDim,
          transition: 'all 0.2s',
        }} />
      </button>
    </div>
  );

  const NumberField = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
    <div>
      <div style={fieldLabel}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={() => onChange(Math.max(0, value - 1))}
          style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <input type="number" value={value} onChange={e => onChange(Math.max(0, +e.target.value || 0))}
          style={{ ...inputBase, width: 50, textAlign: 'center', fontFamily: t.fontM, fontWeight: 700, fontSize: 12 }} />
        <button onClick={() => onChange(value + 1)}
          style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
    </div>
  );

  return (
    <div style={{
      background: `linear-gradient(135deg, ${t.bgCard}, ${accent}03)`, borderRadius: t.r.lg,
      border: `1px solid ${accent}20`,
      padding: 20, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent 5%, ${accent}40 30%, ${accent}70 50%, ${accent}40 70%, transparent 95%)` }} />

      <div style={{ fontFamily: t.fontM, fontSize: 9, color: t.textDim, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
        Customer Environment
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Site Counts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <NumberField label="Branches" value={cs.branchCount} onChange={v => api.setSpecific('branchCount', v)} />
          <NumberField label="HQs" value={cs.hqCount} onChange={v => api.setSpecific('hqCount', v)} />
          <NumberField label="Data Centers" value={cs.dataCenterCount} onChange={v => api.setSpecific('dataCenterCount', v)} />
        </div>

        {/* Cloud Providers */}
        <div style={{ height: 1, background: t.borderSubtle, margin: '2px 0' }} />
        <div>
          <div style={fieldLabel}>Cloud Providers</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {CLOUD_PROVIDER_OPTIONS.map(cp => {
              const active = cs.cloudProviders.includes(cp);
              return (
                <button key={cp} onClick={() => api.toggleCloudProvider(cp)}
                  style={{
                    padding: '4px 10px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.15s',
                    border: `1px solid ${active ? t.cyan + '40' : t.borderSubtle}`,
                    background: active ? t.cyan + '12' : 'transparent',
                    color: active ? t.cyan : t.textDim,
                    fontFamily: t.fontM, fontSize: 9, fontWeight: 600,
                  }}>
                  {cp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Service Toggles */}
        <div style={{ height: 1, background: t.borderSubtle, margin: '2px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Toggle label="DIA Required" value={cs.diaRequired} onToggle={() => api.setSpecific('diaRequired', !cs.diaRequired)} />
          <Toggle label="MPLS Retained" value={cs.mplsRetained} onToggle={() => api.setSpecific('mplsRetained', !cs.mplsRetained)} />
          <Toggle label="SD-WAN Overlay" value={cs.sdwanOverlay} onToggle={() => api.setSpecific('sdwanOverlay', !cs.sdwanOverlay)} />
          <Toggle label="SASE / SSE Required" value={cs.saseRequired} onToggle={() => api.setSpecific('saseRequired', !cs.saseRequired)} />
          <Toggle label="Edge Compute Required" value={cs.edgeComputeRequired} onToggle={() => api.setSpecific('edgeComputeRequired', !cs.edgeComputeRequired)} />
          <Toggle label="AI Connectivity Required" value={cs.aiConnectivityRequired} onToggle={() => api.setSpecific('aiConnectivityRequired', !cs.aiConnectivityRequired)} />
          <Toggle label="3rd-Party Services Needed" value={cs.thirdPartyServicesNeeded} onToggle={() => api.setSpecific('thirdPartyServicesNeeded', !cs.thirdPartyServicesNeeded)} />
        </div>

        {/* Text fields */}
        <div style={{ height: 1, background: t.borderSubtle, margin: '2px 0' }} />
        <div>
          <div style={fieldLabel}>Segmentation Requirement</div>
          <input value={cs.segmentationRequirement} onChange={e => api.setSpecific('segmentationRequirement', e.target.value)} placeholder="e.g., PCI, guest WiFi isolation, IoT" style={inputBase} />
        </div>
        <div>
          <div style={fieldLabel}>Redundancy Requirement</div>
          <input value={cs.redundancyRequirement} onChange={e => api.setSpecific('redundancyRequirement', e.target.value)} placeholder="e.g., dual-homed, active-active, N+1" style={inputBase} />
        </div>
        <div>
          <div style={fieldLabel}>Operations Model</div>
          <select value={cs.operationsModel} onChange={e => api.setSpecific('operationsModel', e.target.value as any)} style={{ ...inputBase, cursor: 'pointer' }}>
            {MANAGEMENT_MODELS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomerOverridePanel;
