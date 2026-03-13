import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../theme/useTheme';
import { useWorkshopStore } from '../../../store/useWorkshopStore';
import {
  GTT_ARCHITECTURE_ZONES,
  GTT_DIFFERENTIATOR_OVERLAYS,
  GTT_PATTERN_ELEMENTS,
  GTT_USE_CASE_TEMPLATES,
} from '../../../data/seed';
import { GlassCard, Mono, Chip } from '../../shared/Primitives';

/* ═══════════════════════════════════════════════════════════════════════════
   FUTURE STATE TAB — Work Area 2
   Three-panel layout: zone/overlay controls | structured canvas | inspector
   ═══════════════════════════════════════════════════════════════════════════ */

const DIFF_COLORS: Record<string, string> = {
  backbone: '#34d399', envision: '#3b82f6', 'envision-edge': '#a78bfa',
  'integrated-security': '#fb7185', 'global-consistency': '#fbbf24', vdc: '#22d3ee',
};
const DIFF_LABELS: Record<string, string> = {
  backbone: 'Backbone', envision: 'Envision', 'envision-edge': 'EnvisionEDGE',
  'integrated-security': 'Integrated Security', 'global-consistency': 'Global Consistency', vdc: 'VDC',
};

const ZONE_ORDER = GTT_ARCHITECTURE_ZONES.sort((a, b) => a.yOrder - b.yOrder);

const FutureStateTab: React.FC = () => {
  const { t, isDark } = useTheme();
  const store = useWorkshopStore();

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  /* ── Derived data ── */
  const enabledElements = useMemo(
    () => store.patternElements.filter(p => p.enabled),
    [store.patternElements],
  );

  const elementsByZone = useMemo(() => {
    const map: Record<string, typeof enabledElements> = {};
    for (const zone of ZONE_ORDER) map[zone.id] = [];
    for (const el of enabledElements) {
      if (map[el.placementZone]) map[el.placementZone].push(el);
    }
    return map;
  }, [enabledElements]);

  const selectedElement = useMemo(
    () => (selectedElementId ? store.patternElements.find(p => p.id === selectedElementId) || null : null),
    [selectedElementId, store.patternElements],
  );

  const selectedTemplate = useMemo(
    () => GTT_USE_CASE_TEMPLATES.find(t => t.id === store.selectedUseCaseId) || null,
    [store.selectedUseCaseId],
  );

  const narrative = useMemo(
    () => enabledElements.map(el => el.narrativeImpact).join(' '),
    [enabledElements],
  );

  /* ── Overlay zone lookup ── */
  const overlaysByZone = useMemo(() => {
    const map: Record<string, typeof GTT_DIFFERENTIATOR_OVERLAYS> = {};
    for (const zone of ZONE_ORDER) map[zone.id] = [];
    for (const ov of GTT_DIFFERENTIATOR_OVERLAYS) {
      if (!store.activeOverlays.includes(ov.id)) continue;
      for (const zid of ov.affectedZones) {
        if (map[zid]) map[zid].push(ov);
      }
    }
    return map;
  }, [store.activeOverlays]);

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{
      display: 'flex', height: '100%', overflow: 'hidden',
      background: t.bg,
    }}>

      {/* ══════════════════════════════════════════════════════════════════
         LEFT SIDEBAR — Zone & Overlay Controls
         ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        width: 220, flexShrink: 0, borderRight: `1px solid ${t.border}`,
        background: t.bgPanel, display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Zones */}
        <div style={{ padding: '16px 14px 10px' }}>
          <Mono size={8} color={t.textDim}>Architecture Zones</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {ZONE_ORDER.map(zone => {
              const count = elementsByZone[zone.id]?.length || 0;
              return (
                <div key={zone.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 5,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${t.borderSubtle}`,
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 3,
                    background: zone.color, flexShrink: 0,
                    boxShadow: `0 0 6px ${zone.color}30`,
                  }} />
                  <span style={{
                    fontFamily: t.fontB, fontSize: 10, color: t.text, flex: 1,
                  }}>
                    {zone.label}
                  </span>
                  <span style={{
                    fontFamily: t.fontM, fontSize: 8, fontWeight: 700,
                    color: count > 0 ? zone.color : t.textDim,
                    background: count > 0 ? zone.color + '14' : 'transparent',
                    padding: '1px 5px', borderRadius: 3, minWidth: 16, textAlign: 'center',
                  }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: t.borderSubtle, margin: '4px 14px' }} />

        {/* Overlays */}
        <div style={{ padding: '10px 14px', flex: 1 }}>
          <Mono size={8} color={t.textDim}>Differentiator Overlays</Mono>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            {GTT_DIFFERENTIATOR_OVERLAYS.map(ov => {
              const active = store.activeOverlays.includes(ov.id);
              return (
                <button
                  key={ov.id}
                  onClick={() => store.toggleOverlay(ov.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    padding: '7px 8px', borderRadius: 5, cursor: 'pointer',
                    background: active ? ov.color + '0a' : 'transparent',
                    border: `1px solid ${active ? ov.color + '30' : t.borderSubtle}`,
                    transition: 'all 0.15s', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                    background: active ? ov.color + '18' : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13,
                    border: `1px solid ${active ? ov.color + '25' : t.borderSubtle}`,
                    transition: 'all 0.15s',
                  }}>
                    {ov.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: t.fontD, fontSize: 9, fontWeight: 700,
                      color: active ? ov.color : t.textDim,
                      marginBottom: 2, transition: 'color 0.15s',
                    }}>
                      {ov.label}
                    </div>
                    <div style={{
                      fontFamily: t.fontB, fontSize: 8, color: t.textDim,
                      lineHeight: 1.4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {ov.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Narrative */}
        <div style={{ padding: '10px 14px 16px' }}>
          <button style={{
            width: '100%', padding: '10px 14px', borderRadius: 6,
            background: `linear-gradient(135deg, ${t.emerald}20, ${t.emerald}08)`,
            border: `1px solid ${t.emerald}30`,
            color: t.emerald, fontFamily: t.fontD, fontSize: 10, fontWeight: 700,
            letterSpacing: 0.8, cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <span style={{ fontSize: 12 }}>✦</span>
            Generate Narrative
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
         CENTER — Structured Zone Canvas
         ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        background: isDark
          ? `radial-gradient(circle at 50% 30%, rgba(56,189,248,0.03), transparent 60%), ${t.bg}`
          : `radial-gradient(circle at 50% 30%, rgba(14,165,233,0.03), transparent 60%), ${t.bg}`,
        position: 'relative',
      }}>
        {/* Dot grid background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div style={{
          padding: '20px 24px', position: 'relative', minHeight: '100%',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {/* Canvas header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12, padding: '0 4px',
          }}>
            <div>
              <span style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 700, color: t.text }}>
                Future-State Architecture
              </span>
              {selectedTemplate && (
                <span style={{
                  fontFamily: t.fontM, fontSize: 8, color: t.accent,
                  marginLeft: 10, letterSpacing: 1, fontWeight: 600,
                }}>
                  {selectedTemplate.label.toUpperCase()}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                fontFamily: t.fontM, fontSize: 8, color: t.textDim, fontWeight: 600,
              }}>
                {enabledElements.length} elements
              </span>
              <span style={{
                width: 6, height: 6, borderRadius: 3,
                background: enabledElements.length > 0 ? t.emerald : t.textDim,
                boxShadow: enabledElements.length > 0 ? `0 0 6px ${t.emerald}40` : 'none',
              }} />
            </div>
          </div>

          {/* Zone bands */}
          {ZONE_ORDER.map(zone => {
            const zoneElements = elementsByZone[zone.id] || [];
            const zoneOverlays = overlaysByZone[zone.id] || [];

            return (
              <div
                key={zone.id}
                style={{
                  position: 'relative',
                  minHeight: 80,
                  borderRadius: 8,
                  background: zone.color + (isDark ? '08' : '06'),
                  border: `1px solid ${zone.color}15`,
                  overflow: 'hidden',
                  transition: 'all 0.15s',
                }}
              >
                {/* Overlay ribbons (behind elements) */}
                {zoneOverlays.map(ov => (
                  <div
                    key={ov.id}
                    style={{
                      position: 'absolute', inset: 0,
                      background: ov.color + (isDark ? '08' : '06'),
                      borderLeft: `3px solid ${ov.color}60`,
                      pointerEvents: 'none',
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <span style={{
                      fontFamily: t.fontM, fontSize: 6, fontWeight: 700,
                      color: ov.color + '50', letterSpacing: 1.5,
                      textTransform: 'uppercase',
                      writingMode: 'vertical-lr',
                      transform: 'rotate(180deg)',
                      padding: '6px 2px',
                    }}>
                      {ov.label}
                    </span>
                  </div>
                ))}

                {/* Zone label */}
                <div style={{
                  position: 'absolute', top: 6, left: zoneOverlays.length > 0 ? 18 : 10,
                  display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: 2,
                    background: zone.color,
                    boxShadow: `0 0 4px ${zone.color}30`,
                  }} />
                  <span style={{
                    fontFamily: t.fontM, fontSize: 7, fontWeight: 700,
                    color: zone.color, letterSpacing: 1.5,
                    textTransform: 'uppercase', opacity: 0.7,
                  }}>
                    {zone.label}
                  </span>
                </div>

                {/* Elements row */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 8,
                  padding: '26px 12px 10px',
                  paddingLeft: zoneOverlays.length > 0 ? 22 : 12,
                  position: 'relative', zIndex: 1,
                }}>
                  {zoneElements.length === 0 && (
                    <span style={{
                      fontFamily: t.fontB, fontSize: 9, color: t.textDim,
                      fontStyle: 'italic', padding: '8px 0',
                    }}>
                      No elements in this zone
                    </span>
                  )}
                  {zoneElements.map(el => {
                    const isSelected = selectedElementId === el.id;
                    const diffColor = el.gttDifferentiator ? DIFF_COLORS[el.gttDifferentiator] : null;

                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(isSelected ? null : el.id)}
                        style={{
                          width: 110, padding: '8px 10px', borderRadius: 6,
                          cursor: 'pointer', transition: 'all 0.15s',
                          background: isSelected
                            ? (diffColor || zone.color) + '14'
                            : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
                          border: `1px solid ${isSelected ? (diffColor || zone.color) + '50' : t.borderSubtle}`,
                          borderLeft: diffColor
                            ? `3px solid ${diffColor}80`
                            : `1px solid ${isSelected ? (diffColor || zone.color) + '50' : t.borderSubtle}`,
                          boxShadow: isSelected
                            ? `0 0 12px ${(diffColor || zone.color)}15`
                            : isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
                          position: 'relative',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 16 }}>{el.icon}</span>
                          {el.quantity > 1 && (
                            <span style={{
                              fontFamily: t.fontM, fontSize: 8, fontWeight: 700,
                              color: diffColor || zone.color,
                              background: (diffColor || zone.color) + '14',
                              padding: '1px 4px', borderRadius: 3,
                            }}>
                              ×{el.quantity}
                            </span>
                          )}
                        </div>
                        <div style={{
                          fontFamily: t.fontD, fontSize: 9, fontWeight: 600,
                          color: t.text, marginTop: 4,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {el.label}
                        </div>
                        {/* Differentiator dot */}
                        {diffColor && (
                          <div style={{
                            position: 'absolute', top: 5, right: 5,
                            width: 6, height: 6, borderRadius: 3,
                            background: diffColor,
                            boxShadow: `0 0 4px ${diffColor}40`,
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
         RIGHT INSPECTOR — Element Detail + Solution Summary
         ══════════════════════════════════════════════════════════════════ */}
      <div style={{
        width: 260, flexShrink: 0, borderLeft: `1px solid ${t.border}`,
        background: t.bgPanel, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {selectedElement ? (
          /* ── Element Detail ── */
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Header */}
            <div style={{
              padding: '14px 12px', borderRadius: 8,
              background: `linear-gradient(135deg, ${t.bgCard}, ${(selectedElement.gttDifferentiator ? DIFF_COLORS[selectedElement.gttDifferentiator] : t.accent) + '08'})`,
              border: `1px solid ${t.borderSubtle}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${(selectedElement.gttDifferentiator ? DIFF_COLORS[selectedElement.gttDifferentiator] : t.accent)}50, transparent)`,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: (selectedElement.gttDifferentiator ? DIFF_COLORS[selectedElement.gttDifferentiator] : t.accent) + '14',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                  border: `1px solid ${(selectedElement.gttDifferentiator ? DIFF_COLORS[selectedElement.gttDifferentiator] : t.accent)}20`,
                }}>
                  {selectedElement.icon}
                </div>
                <div>
                  <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text }}>
                    {selectedElement.label}
                  </div>
                  <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, marginTop: 2 }}>
                    {selectedElement.category} · {selectedElement.placementZone}
                  </div>
                </div>
              </div>
            </div>

            {/* GTT Differentiator */}
            {selectedElement.gttDifferentiator && (
              <div style={{
                padding: '8px 10px', borderRadius: 6,
                background: DIFF_COLORS[selectedElement.gttDifferentiator] + '0a',
                border: `1px solid ${DIFF_COLORS[selectedElement.gttDifferentiator]}20`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: 3,
                    background: DIFF_COLORS[selectedElement.gttDifferentiator],
                    boxShadow: `0 0 4px ${DIFF_COLORS[selectedElement.gttDifferentiator]}40`,
                  }} />
                  <Mono size={7} color={DIFF_COLORS[selectedElement.gttDifferentiator]}>
                    GTT Differentiator
                  </Mono>
                </div>
                <span style={{
                  fontFamily: t.fontD, fontSize: 10, fontWeight: 700,
                  color: DIFF_COLORS[selectedElement.gttDifferentiator],
                }}>
                  {DIFF_LABELS[selectedElement.gttDifferentiator]}
                </span>
                <p style={{
                  fontFamily: t.fontB, fontSize: 9, color: t.textDim,
                  margin: '4px 0 0', lineHeight: 1.5,
                }}>
                  {GTT_DIFFERENTIATOR_OVERLAYS.find(o => o.id === selectedElement.gttDifferentiator)?.description || ''}
                </p>
              </div>
            )}

            {/* Quantity */}
            <div>
              <Mono size={7} color={t.textDim}>Quantity</Mono>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <button
                  onClick={() => store.setPatternQuantity(selectedElement.id, Math.max(1, selectedElement.quantity - 1))}
                  style={{
                    width: 26, height: 26, borderRadius: 5,
                    border: `1px solid ${t.border}`, background: t.bgInput,
                    color: t.textMuted, fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >−</button>
                <input
                  type="number"
                  value={selectedElement.quantity}
                  onChange={e => store.setPatternQuantity(selectedElement.id, Math.max(1, +e.target.value || 1))}
                  style={{
                    width: 50, textAlign: 'center',
                    background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 5,
                    color: t.text, fontFamily: t.fontM, fontSize: 12, fontWeight: 700,
                    padding: '5px 4px', outline: 'none',
                  }}
                />
                <button
                  onClick={() => store.setPatternQuantity(selectedElement.id, selectedElement.quantity + 1)}
                  style={{
                    width: 26, height: 26, borderRadius: 5,
                    border: `1px solid ${t.border}`, background: t.bgInput,
                    color: t.textMuted, fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >+</button>
              </div>
            </div>

            {/* Customer Notes */}
            <div>
              <Mono size={7} color={t.textDim}>Customer Notes</Mono>
              <textarea
                value={selectedElement.customerNotes}
                onChange={e => store.setPatternNote(selectedElement.id, e.target.value)}
                placeholder="Add notes for this element..."
                rows={3}
                style={{
                  width: '100%', marginTop: 4, resize: 'vertical', minHeight: 50,
                  background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 5,
                  color: t.text, fontFamily: t.fontB, fontSize: 10, lineHeight: 1.6,
                  padding: '7px 10px', outline: 'none',
                }}
              />
            </div>

            {/* Narrative Impact */}
            <div>
              <Mono size={7} color={t.textDim}>Narrative Impact</Mono>
              <p style={{
                fontFamily: t.fontB, fontSize: 10, color: t.textSoft,
                margin: '4px 0 0', lineHeight: 1.6, fontStyle: 'italic',
              }}>
                {selectedElement.narrativeImpact}
              </p>
            </div>

            {/* Enabled toggle */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 10px', borderRadius: 5,
              border: `1px solid ${t.borderSubtle}`,
              background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
            }}>
              <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft }}>
                Enabled
              </span>
              <button
                onClick={() => store.togglePatternElement(selectedElement.id)}
                style={{
                  width: 38, height: 20, borderRadius: 10, border: 'none',
                  cursor: 'pointer', position: 'relative',
                  background: selectedElement.enabled ? t.emerald + '35' : t.borderSubtle,
                  transition: 'all 0.2s',
                  boxShadow: selectedElement.enabled ? `0 0 8px ${t.emerald}15` : 'none',
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: 7, position: 'absolute', top: 3,
                  left: selectedElement.enabled ? 21 : 3,
                  background: selectedElement.enabled ? t.emerald : t.textDim,
                  transition: 'all 0.2s',
                }} />
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => {
                store.togglePatternElement(selectedElement.id);
                setSelectedElementId(null);
              }}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: 6,
                background: t.rose + '10', border: `1px solid ${t.rose}25`,
                color: t.rose, fontFamily: t.fontD, fontSize: 10, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <span style={{ fontSize: 10 }}>✕</span>
              Remove from Architecture
            </button>
          </div>
        ) : (
          /* ── Solution Summary ── */
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Header */}
            <div style={{
              padding: '14px 12px', borderRadius: 8,
              background: `linear-gradient(135deg, ${t.bgCard}, ${t.accent}06)`,
              border: `1px solid ${t.borderSubtle}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${t.accent}40, transparent)`,
              }} />
              <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 2 }}>
                Solution Summary
              </div>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim }}>
                {store.customerRequirements.customerName} · {store.customerRequirements.industry}
              </div>
            </div>

            {/* Selected template */}
            {selectedTemplate && (
              <div style={{
                padding: '8px 10px', borderRadius: 6,
                background: selectedTemplate.color + '0a',
                border: `1px solid ${selectedTemplate.color}20`,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>{selectedTemplate.icon}</span>
                <div>
                  <div style={{ fontFamily: t.fontD, fontSize: 10, fontWeight: 700, color: selectedTemplate.color }}>
                    {selectedTemplate.label}
                  </div>
                  <Chip color={selectedTemplate.color} small>{selectedTemplate.category}</Chip>
                </div>
              </div>
            )}

            {/* Elements per zone */}
            <div>
              <Mono size={7} color={t.textDim}>Elements by Zone</Mono>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
                {ZONE_ORDER.map(zone => {
                  const count = elementsByZone[zone.id]?.length || 0;
                  if (count === 0) return null;
                  return (
                    <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: 2,
                        background: zone.color,
                      }} />
                      <span style={{ fontFamily: t.fontB, fontSize: 9, color: t.textSoft, flex: 1 }}>
                        {zone.label}
                      </span>
                      <span style={{
                        fontFamily: t.fontM, fontSize: 9, fontWeight: 700, color: zone.color,
                      }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active overlays */}
            {store.activeOverlays.length > 0 && (
              <div>
                <Mono size={7} color={t.textDim}>Active Differentiators</Mono>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                  {GTT_DIFFERENTIATOR_OVERLAYS
                    .filter(ov => store.activeOverlays.includes(ov.id))
                    .map(ov => (
                      <span key={ov.id} style={{
                        fontFamily: t.fontM, fontSize: 7, fontWeight: 700,
                        color: ov.color,
                        background: ov.color + '14',
                        border: `1px solid ${ov.color}25`,
                        padding: '2px 6px', borderRadius: 3,
                        letterSpacing: 0.5, textTransform: 'uppercase',
                      }}>
                        {ov.icon} {ov.label}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Solution Narrative */}
            {enabledElements.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                  <Mono size={7} color={t.textDim}>Solution Narrative</Mono>
                  <div style={{ flex: 1, height: 1, background: t.borderSubtle }} />
                </div>
                <div style={{
                  padding: '10px 12px', borderRadius: 6,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${t.borderSubtle}`,
                }}>
                  <p style={{
                    fontFamily: t.fontB, fontSize: 10, color: t.textSoft,
                    margin: 0, lineHeight: 1.7,
                  }}>
                    {narrative}
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {enabledElements.length === 0 && (
              <div style={{
                padding: '20px 12px', textAlign: 'center',
                borderRadius: 6, border: `1px dashed ${t.borderSubtle}`,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }}>✦</div>
                <p style={{
                  fontFamily: t.fontB, fontSize: 10, color: t.textDim,
                  margin: 0, lineHeight: 1.5,
                }}>
                  Select a use case template and enable pattern elements to build your architecture.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureStateTab;
