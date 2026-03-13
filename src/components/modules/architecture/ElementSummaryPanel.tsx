import React from 'react';
import { useTheme } from '../../../theme/useTheme';
import { Mono } from '../../shared/Primitives';
import type { PatternElement } from './types';
import { APPLICABILITY_META } from './types';

/* ═══════════════════════════════════════════════════════════════════════════
   ELEMENT SUMMARY PANEL — counts of active / inactive / future / managed
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  elements: PatternElement[];
  accent: string;
}

const ElementSummaryPanel: React.FC<Props> = ({ elements, accent }) => {
  const { t, isDark } = useTheme();

  const active      = elements.filter(e => e.applicability === 'active').length;
  const optional    = elements.filter(e => e.applicability === 'optional').length;
  const futurePhase = elements.filter(e => e.applicability === 'future-phase').length;
  const inactive    = elements.filter(e => e.applicability === 'not-applicable').length;
  const managed     = elements.filter(e => e.applicability !== 'not-applicable' && e.managementModel === 'managed').length;
  const coManaged   = elements.filter(e => e.applicability !== 'not-applicable' && e.managementModel === 'co-managed').length;
  const custManaged = elements.filter(e => e.applicability !== 'not-applicable' && e.managementModel === 'customer-managed').length;

  const Stat = ({ label, count, color }: { label: string; count: number; color: string }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '5px 8px', borderRadius: 4,
      background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
      border: `1px solid ${t.borderSubtle}`,
    }}>
      <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft }}>{label}</span>
      <span style={{
        fontFamily: t.fontM, fontSize: 11, fontWeight: 800, color,
        minWidth: 20, textAlign: 'right',
      }}>{count}</span>
    </div>
  );

  return (
    <div style={{
      background: t.bgCard, borderRadius: t.r.lg, border: `1px solid ${accent}20`,
      padding: 14, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${accent}50, transparent)`,
      }} />

      <div style={{
        fontFamily: t.fontM, fontSize: 9, color: t.textDim,
        letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10,
      }}>
        Element Summary
      </div>

      {/* Top-line total */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10,
      }}>
        <span style={{ fontFamily: t.fontD, fontSize: 22, fontWeight: 800, color: accent }}>
          {elements.length}
        </span>
        <span style={{ fontFamily: t.fontM, fontSize: 9, color: t.textDim }}>
          total elements
        </span>
      </div>

      {/* Applicability breakdown */}
      <div style={{
        fontFamily: t.fontM, fontSize: 8, color: t.textDim,
        letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6,
      }}>
        Applicability
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
        <Stat label={`${APPLICABILITY_META['active'].symbol} Active`}         count={active}      color={t.emerald} />
        <Stat label={`${APPLICABILITY_META['optional'].symbol} Optional`}     count={optional}    color={t.amber}   />
        <Stat label={`${APPLICABILITY_META['future-phase'].symbol} Future Phase`} count={futurePhase} color={t.violet}  />
        <Stat label={`${APPLICABILITY_META['not-applicable'].symbol} Inactive`}   count={inactive}    color={t.rose}    />
      </div>

      {/* Mini bar visualization */}
      {elements.length > 0 && (
        <div style={{
          display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1,
          marginBottom: 12,
        }}>
          {active > 0 && (
            <div style={{ flex: active, background: t.emerald, borderRadius: 2, transition: 'flex 0.3s' }} />
          )}
          {optional > 0 && (
            <div style={{ flex: optional, background: t.amber, borderRadius: 2, transition: 'flex 0.3s' }} />
          )}
          {futurePhase > 0 && (
            <div style={{ flex: futurePhase, background: t.violet, borderRadius: 2, transition: 'flex 0.3s' }} />
          )}
          {inactive > 0 && (
            <div style={{ flex: inactive, background: t.rose + '60', borderRadius: 2, transition: 'flex 0.3s' }} />
          )}
        </div>
      )}

      {/* Management breakdown */}
      <div style={{
        fontFamily: t.fontM, fontSize: 8, color: t.textDim,
        letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6,
      }}>
        Management Model
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Stat label="GTT Managed"      count={managed}     color={t.cyan}    />
        <Stat label="Co-Managed"        count={coManaged}   color={t.amber}   />
        <Stat label="Customer Managed"  count={custManaged} color={t.emerald} />
      </div>
    </div>
  );
};

export default ElementSummaryPanel;
