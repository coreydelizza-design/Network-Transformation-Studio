import React from 'react';
import { useTheme } from '../../../theme/useTheme';
import { Chip, Mono } from '../../shared/Primitives';
import type { PatternElement } from './types';
import { PHASE_LABELS } from './types';
import type { PatternOverridesAPI } from './usePatternOverrides';

/* ═══════════════════════════════════════════════════════════════════════════
   PATTERN ELEMENT LIST — compact, clickable inventory of all elements
   ═══════════════════════════════════════════════════════════════════════════ */

interface Props {
  elements: PatternElement[];
  accent: string;
  api: PatternOverridesAPI;
}

const PatternElementList: React.FC<Props> = ({ elements, accent, api }) => {
  const { t, isDark } = useTheme();

  const groupColors: Record<string, string> = {
    control: t.accent, core: accent, edge: t.amber, cloud: t.cyan,
    dc: t.violet, security: t.rose, saas: t.emerald,
  };

  // Group elements by category
  const groups = elements.reduce<Record<string, PatternElement[]>>((acc, el) => {
    (acc[el.category] = acc[el.category] || []).push(el);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Object.entries(groups).map(([cat, items]) => {
        const catColor = groupColors[items[0]?.group] || accent;
        return (
          <div key={cat}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: catColor }} />
              <Mono size={8} color={catColor}>{cat}</Mono>
              <Mono size={8}>{items.length}</Mono>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {items.map(el => {
                const gc = groupColors[el.group] || accent;
                const isInspected = api.inspectedId === el.id;
                const hasOverride = !!api.overrides[el.id];
                return (
                  <div
                    key={el.id}
                    onClick={() => api.inspectElement(isInspected ? null : el.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: isInspected ? gc + '10' : 'transparent',
                      border: `1px solid ${isInspected ? gc + '30' : t.borderSubtle}`,
                      opacity: el.applicable ? 1 : 0.45,
                    }}
                  >
                    <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }}>{el.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 600, color: isInspected ? gc : t.text }}>
                          {el.label}
                        </span>
                        {hasOverride && <div style={{ width: 5, height: 5, borderRadius: 3, background: t.amber, flexShrink: 0 }} />}
                      </div>
                      <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, marginTop: 1 }}>
                        {el.deploymentRole}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {el.quantity > 0 && (
                        <span style={{
                          fontFamily: t.fontM, fontSize: 9, fontWeight: 700, color: gc,
                          background: gc + '12', padding: '2px 6px', borderRadius: 4,
                        }}>×{el.quantity}</span>
                      )}
                      {el.implementationPhase > 0 && (
                        <span style={{
                          fontFamily: t.fontM, fontSize: 7, fontWeight: 700, color: t.textDim,
                          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                          padding: '2px 5px', borderRadius: 3,
                        }}>P{el.implementationPhase}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PatternElementList;
