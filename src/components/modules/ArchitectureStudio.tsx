import React, { useCallback } from 'react';
import { useTheme } from '../../theme/useTheme';
import { Chip, Mono } from '../shared/Primitives';
import GttFutureState from './GttFutureState';
import {
  PatternElementInspector,
  PatternElementList,
  CustomerOverridePanel,
  ElementSummaryPanel,
  useArchitectureStudio,
  PATTERN_ELEMENTS,
  APPLICABILITY_META,
  TEMPLATES,
  DESIGNATION_META,
  FIT_DIMENSIONS,
} from './architecture';
import type { UseCaseTemplate, Designation } from './architecture';
/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

const ArchitectureStudio: React.FC = () => {
  const { t, isDark } = useTheme();

  /* ─── State (consolidated hook) ─── */
  const studio = useArchitectureStudio();
  const {
    studioView, setStudioView, selectedId, setSelectedId,
    compareId, setCompareId, compareMode, setCompareMode,
    selected, compared, checkedItems, toggleCheck, checkedCount,
    customerNotes, setNote, fitScores, setFit, getFitScore, getAvgFit,
    designations, cycleDesignation, setDesignation, primaryCount, secondaryCount,
    patternApi,
  } = studio;

  const accentFor = useCallback((color: UseCaseTemplate['accentColor']) => t[color], [t]);
  const accent = accentFor(selected.accentColor);

  /* ═══════════════════════════════════════════════════════════════════════════
     SHARED STYLES
     ═══════════════════════════════════════════════════════════════════════════ */

  const panelStyle = (acc: string): React.CSSProperties => ({
    background: t.bgCard,
    borderRadius: t.r.lg,
    border: `1px solid ${acc}20`,
    padding: 20,
    backdropFilter: 'blur(12px)',
    position: 'relative',
    overflow: 'hidden',
  });

  const panelGlow = (acc: string): React.CSSProperties => ({
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    background: `linear-gradient(90deg, transparent, ${acc}50, transparent)`,
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: t.fontM, fontSize: 9, color: t.textDim,
    letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10,
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     DESIGNATION SELECTOR (inline button group)
     ═══════════════════════════════════════════════════════════════════════════ */

  const renderDesignationSelector = (tid: string, compact = false) => {
    const current = designations[tid] ?? null;
    const options: { value: Designation; label: string; icon: string }[] = [
      { value: 'primary', label: compact ? 'PRI' : 'Primary', icon: '★' },
      { value: 'secondary', label: compact ? 'SEC' : 'Secondary', icon: '◆' },
      { value: 'not-selected', label: compact ? 'OUT' : 'Excluded', icon: '—' },
    ];
    return (
      <div style={{
        display: 'inline-flex', borderRadius: 6, overflow: 'hidden',
        border: `1px solid ${t.border}`, background: t.bgInput,
      }}>
        {options.map((opt, i) => {
          const active = current === opt.value;
          const meta = opt.value ? DESIGNATION_META[opt.value] : null;
          const c = meta ? t[meta.colorKey] : t.textDim;
          return (
            <button
              key={opt.value || 'none'}
              onClick={(e) => { e.stopPropagation(); setDesignation(tid, active ? null : opt.value); }}
              style={{
                padding: compact ? '3px 8px' : '4px 12px',
                border: 'none',
                borderRight: i < options.length - 1 ? `1px solid ${t.border}` : 'none',
                background: active ? c + '18' : 'transparent',
                color: active ? c : t.textDim,
                fontFamily: t.fontD, fontSize: compact ? 9 : 10, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <span style={{ fontSize: compact ? 9 : 11 }}>{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     DIAGRAM RENDERER
     ═══════════════════════════════════════════════════════════════════════════ */

  const renderDiagram = (tmpl: UseCaseTemplate, acc: string) => {
    const groupColors: Record<string, string> = {
      control: t.accent, core: acc, edge: t.amber, cloud: t.cyan,
      dc: t.violet, security: t.rose, saas: t.emerald,
    };
    const elements = patternApi.getElements(tmpl.id);
    return (
      <svg viewBox="0 0 640 420" style={{ width: '100%', height: '100%', minHeight: 220 }}>
        <defs>
          <filter id={`glow-${tmpl.id}`}>
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id={`edge-grad-${tmpl.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={acc} stopOpacity="0.5" />
            <stop offset="100%" stopColor={acc} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {tmpl.diagramEdges.map(([fi, ti], i) => {
          const from = elements[fi] || tmpl.diagramNodes[fi];
          const to = elements[ti] || tmpl.diagramNodes[ti];
          if (!from || !to) return null;
          const fMeta = APPLICABILITY_META[elements[fi]?.applicability ?? 'active'];
          const tMeta = APPLICABILITY_META[elements[ti]?.applicability ?? 'active'];
          const edgeOp = Math.min(fMeta.edgeOpacity, tMeta.edgeOpacity);
          if (edgeOp <= 0) return null;
          const x1 = from.x + 30, y1 = from.y + 25, x2 = to.x + 30, y2 = to.y + 25;
          const dx = x2 - x1, dy = y2 - y1;
          return (
            <path key={i}
              d={`M ${x1} ${y1} C ${x1 + dx * 0.4} ${y1 + dy * 0.1}, ${x2 - dx * 0.4} ${y2 - dy * 0.1}, ${x2} ${y2}`}
              stroke={`url(#edge-grad-${tmpl.id})`} opacity={edgeOp}
              strokeWidth={1.5} fill="none" filter={`url(#glow-${tmpl.id})`} />
          );
        })}
        {elements.map((el, i) => {
          const gc = groupColors[el.group] || acc;
          const isInspected = patternApi.inspectedId === el.id;
          const hasOverride = !!patternApi.overrides[el.id];
          const aMeta = APPLICABILITY_META[el.applicability];
          const statusColor = t[aMeta.colorKey];
          const isInactive = el.applicability === 'not-applicable';
          return (
            <g key={el.id} style={{ cursor: 'pointer', opacity: aMeta.nodeOpacity }}
              onClick={() => patternApi.inspectElement(isInspected ? null : el.id)}>
              <rect x={el.x - 2} y={el.y - 2} width={64} height={54} rx={12}
                fill="transparent" stroke={isInspected ? gc : 'transparent'} strokeWidth={2}
                strokeDasharray={isInspected ? '4 2' : 'none'} />
              <rect x={el.x} y={el.y} width={60} height={50} rx={10}
                fill={isInactive
                  ? isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
                  : isInspected ? gc + '18' : isDark ? gc + '10' : gc + '0c'}
                stroke={isInactive
                  ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')
                  : gc + (isInspected ? '60' : '35')}
                strokeWidth={isInspected ? 1.5 : 1.2}
                strokeDasharray={aMeta.dashArray} />
              <rect x={el.x} y={el.y} width={60} height={1.5} rx={1}
                fill={isInactive ? t.textDim : gc} opacity={isInactive ? 0.15 : isInspected ? 0.7 : 0.4} />
              {/* Override indicator */}
              {hasOverride && <circle cx={el.x + 54} cy={el.y + 6} r={3} fill={t.amber} />}
              {/* Status indicator dot (bottom-left, for optional/future/inactive) */}
              {el.applicability !== 'active' && (
                <circle cx={el.x + 6} cy={el.y + 44} r={3.5}
                  fill={statusColor} opacity={0.7} />
              )}
              {el.quantity > 1 && !isInactive && (
                <g>
                  <rect x={el.x + 42} y={el.y + 40} width={18} height={12} rx={3}
                    fill={gc + '20'} stroke={gc + '40'} strokeWidth={0.5} />
                  <text x={el.x + 51} y={el.y + 49} textAnchor="middle"
                    style={{ fontSize: 7, fontFamily: t.fontM, fill: gc, fontWeight: 700 }}>×{el.quantity}</text>
                </g>
              )}
              <text x={el.x + 30} y={el.y + 18} textAnchor="middle"
                style={{ fontSize: 16, filter: isInactive ? 'grayscale(0.9)' : 'none' }}>{el.icon}</text>
              {el.label.split('\n').map((line, li) => (
                <text key={li} x={el.x + 30} y={el.y + 33 + li * 11} textAnchor="middle"
                  style={{
                    fontSize: 8, fontFamily: t.fontM, fontWeight: 600,
                    fill: isInactive ? t.textDim : t.textSoft,
                    textDecoration: isInactive ? 'line-through' : 'none',
                  }}>{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     TEMPLATE CONTENT PANELS
     ═══════════════════════════════════════════════════════════════════════════ */

  const renderTemplateContent = (tmpl: UseCaseTemplate, isCompare = false) => {
    const acc = accentFor(tmpl.accentColor);
    const checked = checkedCount(tmpl);
    const total = tmpl.requirementChecklist.length;
    const avg = getAvgFit(tmpl.id);
    const desg = designations[tmpl.id] ?? null;
    const desgMeta = desg ? DESIGNATION_META[desg] : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, minWidth: 0 }}>

        {/* ── OVERVIEW HEADER ── */}
        <div style={{ ...panelStyle(acc), padding: '24px 28px' }}>
          <div style={panelGlow(acc)} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: t.r.md, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, background: `linear-gradient(135deg, ${acc}20, ${acc}08)`, border: `1px solid ${acc}30`,
              boxShadow: `0 0 20px ${acc}15`, flexShrink: 0,
            }}>{tmpl.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 2 }}>
                <h2 style={{ fontFamily: t.fontD, fontSize: isCompare ? 16 : 20, fontWeight: 800, color: t.text, margin: 0, letterSpacing: -0.3 }}>
                  {tmpl.title}
                </h2>
                {desgMeta && (
                  <span style={{
                    fontFamily: t.fontM, fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 5,
                    background: t[desgMeta.colorKey] + '15', color: t[desgMeta.colorKey],
                    border: `1px solid ${t[desgMeta.colorKey]}25`,
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <span>{desgMeta.symbol}</span> {desgMeta.short}
                  </span>
                )}
                {avg > 0 && (
                  <span style={{
                    fontFamily: t.fontM, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    background: avg >= 7 ? t.emerald + '15' : avg >= 4 ? t.amber + '15' : t.rose + '15',
                    color: avg >= 7 ? t.emerald : avg >= 4 ? t.amber : t.rose,
                  }}>{avg}/10 FIT</span>
                )}
              </div>
              <p style={{ fontFamily: t.fontB, fontSize: 12, color: t.textMuted, margin: '4px 0 0', lineHeight: 1.5 }}>
                {tmpl.subtitle}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                {tmpl.applicabilityTags.map(tag => (
                  <Chip key={tag} color={acc} small>{tag}</Chip>
                ))}
              </div>
              {/* Designation selector in header */}
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                  Designation
                </span>
                {renderDesignationSelector(tmpl.id)}
              </div>
            </div>
          </div>
          <p style={{ fontFamily: t.fontB, fontSize: 12, color: t.textSoft, margin: '16px 0 0', lineHeight: 1.7 }}>
            {tmpl.requirementsSummary}
          </p>
        </div>

        {/* ── ARCHITECTURE CHARACTERISTICS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: 8 }}>
          {tmpl.architectureCharacteristics.map(ch => (
            <div key={ch.label} style={{ ...panelStyle(acc), padding: '12px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{ch.icon}</div>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                {ch.label}
              </div>
              <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: acc }}>{ch.value}</div>
            </div>
          ))}
        </div>

        {/* ── REQUIREMENTS + CONSIDERATIONS (two-column) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? '1fr' : '1fr 1fr', gap: 16 }}>
          {/* Requirements Panel */}
          <div style={panelStyle(acc)}>
            <div style={panelGlow(acc)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={labelStyle}>Requirements Checklist</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 48, height: 4, borderRadius: 2, background: t.borderSubtle, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${total > 0 ? (checked / total) * 100 : 0}%`, background: acc, borderRadius: 2, transition: 'width 0.4s' }} />
                </div>
                <Mono color={acc} size={9}>{checked}/{total}</Mono>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tmpl.requirementChecklist.map(req => {
                const isChecked = !!checkedItems[req.id];
                return (
                  <div key={req.id} onClick={() => toggleCheck(req.id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px', borderRadius: t.r.sm,
                      cursor: 'pointer', transition: 'all 0.15s',
                      background: isChecked ? acc + '08' : 'transparent',
                      border: `1px solid ${isChecked ? acc + '25' : t.borderSubtle}`,
                    }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${isChecked ? acc : t.textDim}`,
                      background: isChecked ? acc + '20' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1, transition: 'all 0.15s',
                    }}>
                      {isChecked && <span style={{ color: acc, fontSize: 11, fontWeight: 800 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: t.fontB, fontSize: 11, color: isChecked ? t.text : t.textSoft, lineHeight: 1.4 }}>
                        {req.label}
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                        <span style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim }}>{req.category}</span>
                        {req.critical && <span style={{ fontFamily: t.fontM, fontSize: 8, color: t.rose, fontWeight: 700 }}>CRITICAL</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Considerations Panel */}
          <div style={panelStyle(acc)}>
            <div style={panelGlow(acc)} />
            <div style={labelStyle}>Considerations & Expectations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tmpl.considerations.map((c, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '10px 12px', borderRadius: t.r.sm,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${t.borderSubtle}`,
                }}>
                  <span style={{
                    color: acc, fontFamily: t.fontM, fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1,
                    width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: acc + '10',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.6 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DIAGRAM + BUSINESS DRIVERS / PAIN POINTS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? '1fr' : '1fr 1fr', gap: 16 }}>
          {/* Diagram Panel */}
          <div style={panelStyle(acc)}>
            <div style={panelGlow(acc)} />
            <div style={labelStyle}>Reference Architecture Diagram</div>
            <div style={{
              background: isDark ? 'rgba(6,10,20,0.6)' : 'rgba(240,242,245,0.8)',
              borderRadius: t.r.md, border: `1px solid ${t.borderSubtle}`, padding: 12,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: t.r.md,
                backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(40,55,85,0.2)' : 'rgba(148,163,184,0.15)'} 1px, transparent 1px)`,
                backgroundSize: '20px 20px', pointerEvents: 'none',
              }} />
              {renderDiagram(tmpl, acc)}
            </div>
          </div>

          {/* Business Drivers + Pain Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={panelStyle(acc)}>
              <div style={panelGlow(acc)} />
              <div style={labelStyle}>Business Drivers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tmpl.businessDrivers.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{
                      color: t.emerald, fontSize: 8, marginTop: 3, flexShrink: 0,
                      width: 14, height: 14, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: t.emerald + '12',
                    }}>▲</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={panelStyle(acc)}>
              <div style={panelGlow(acc)} />
              <div style={labelStyle}>Pain Points Addressed</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tmpl.painPoints.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{
                      color: t.rose, fontSize: 8, marginTop: 3, flexShrink: 0,
                      width: 14, height: 14, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: t.rose + '12',
                    }}>◆</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RECOMMENDED WHEN / NOT IDEAL WHEN ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div style={panelStyle(t.emerald)}>
            <div style={panelGlow(t.emerald)} />
            <div style={{ ...labelStyle, color: t.emerald }}>Recommended When</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tmpl.recommendedWhen.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: t.emerald, fontSize: 11, marginTop: 1, flexShrink: 0, fontWeight: 700 }}>✓</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={panelStyle(t.rose)}>
            <div style={panelGlow(t.rose)} />
            <div style={{ ...labelStyle, color: t.rose }}>Not Ideal When</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tmpl.notIdealWhen.map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: t.rose, fontSize: 11, marginTop: 1, flexShrink: 0, fontWeight: 700 }}>✕</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FIT-TO-CUSTOMER MAPPING ── */}
        <div style={panelStyle(acc)}>
          <div style={panelGlow(acc)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={labelStyle}>Fit-to-Customer Mapping</div>
            {avg > 0 && (
              <div style={{
                fontFamily: t.fontD, fontSize: 22, fontWeight: 800,
                color: avg >= 7 ? t.emerald : avg >= 4 ? t.amber : t.rose,
                display: 'flex', alignItems: 'baseline', gap: 2,
              }}>
                {avg}<span style={{ fontSize: 11, fontWeight: 600, color: t.textDim }}>/10</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FIT_DIMENSIONS.map(dim => {
              const score = getFitScore(tmpl.id, dim);
              const barColor = score >= 7 ? t.emerald : score >= 4 ? t.amber : score > 0 ? t.rose : t.textDim;
              return (
                <div key={dim}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft }}>{dim}</span>
                    <span style={{ fontFamily: t.fontM, fontSize: 11, fontWeight: 700, color: score > 0 ? barColor : t.textDim, minWidth: 20, textAlign: 'right' }}>
                      {score || '—'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <button key={i} onClick={() => setFit(tmpl.id, dim, i + 1)}
                        style={{
                          flex: 1, height: 8, borderRadius: 3, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                          background: i < score
                            ? `linear-gradient(135deg, ${barColor}cc, ${barColor})`
                            : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
                          boxShadow: i < score ? `0 0 8px ${barColor}25` : 'none',
                        }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CUSTOMER NOTES ── */}
        <div style={panelStyle(acc)}>
          <div style={panelGlow(acc)} />
          <div style={labelStyle}>Customer Notes</div>
          <textarea
            value={customerNotes[tmpl.id] || ''}
            onChange={e => setNote(tmpl.id, e.target.value)}
            placeholder={`Capture customer-specific notes for ${tmpl.title}...\n\nConsider: environment specifics, constraints, stakeholder feedback, timeline considerations, budget context...`}
            rows={5}
            style={{
              width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: t.r.sm,
              color: t.text, fontFamily: t.fontB, fontSize: 12, padding: '12px 14px', resize: 'vertical',
              lineHeight: 1.6, outline: 'none',
            }}
          />
          {customerNotes[tmpl.id] && (
            <div style={{ marginTop: 6, fontFamily: t.fontM, fontSize: 8, color: t.textDim }}>
              {customerNotes[tmpl.id].length} characters
            </div>
          )}
        </div>

        {/* ── ELEMENT SUMMARY ── */}
        <ElementSummaryPanel elements={patternApi.getElements(tmpl.id)} accent={acc} />

        {/* ── PATTERN ELEMENTS & CUSTOMER OVERRIDES ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isCompare ? '1fr' : '1fr 1fr', gap: 16 }}>
          {/* Pattern Element List */}
          <div style={panelStyle(acc)}>
            <div style={panelGlow(acc)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={labelStyle}>Pattern Elements</div>
              {patternApi.overrideCount(tmpl.id) > 0 && (
                <div style={{
                  fontFamily: t.fontM, fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: t.amber + '15', color: t.amber,
                }}>
                  {patternApi.overrideCount(tmpl.id)} modified
                </div>
              )}
            </div>
            <PatternElementList
              elements={patternApi.getElements(tmpl.id)}
              accent={acc}
              api={patternApi}
            />
          </div>

          {/* Customer Override Panel */}
          <CustomerOverridePanel api={patternApi} accent={acc} />
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     SELECTOR CARD
     ═══════════════════════════════════════════════════════════════════════════ */

  const renderSelectorCard = (tmpl: UseCaseTemplate) => {
    const acc = accentFor(tmpl.accentColor);
    const isSelected = selectedId === tmpl.id;
    const isCompared = compareId === tmpl.id;
    const checked = checkedCount(tmpl);
    const total = tmpl.requirementChecklist.length;
    const avg = getAvgFit(tmpl.id);
    const desg = designations[tmpl.id] ?? null;
    const desgMeta = desg ? DESIGNATION_META[desg] : null;

    return (
      <div
        key={tmpl.id}
        onClick={() => {
          if (compareMode) {
            if (selectedId !== tmpl.id) setCompareId(tmpl.id === compareId ? null : tmpl.id);
          } else {
            setSelectedId(tmpl.id);
          }
        }}
        style={{
          padding: '14px 16px', borderRadius: t.r.md, cursor: 'pointer', transition: 'all 0.2s',
          background: isSelected ? acc + '12' : isCompared ? acc + '08' : 'transparent',
          border: `1.5px solid ${isSelected ? acc + '50' : isCompared ? acc + '30' : t.borderSubtle}`,
          position: 'relative', overflow: 'hidden',
          opacity: desg === 'not-selected' ? 0.55 : 1,
        }}
      >
        {/* Active indicator bar */}
        {isSelected && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: acc, borderRadius: '0 2px 2px 0' }} />}

        {/* Top-right badges */}
        <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', gap: 4 }}>
          {isCompared && (
            <span style={{ fontFamily: t.fontM, fontSize: 7, color: acc, background: acc + '15', padding: '2px 5px', borderRadius: 3, fontWeight: 700 }}>
              COMPARE
            </span>
          )}
          {desgMeta && (
            <span style={{
              fontFamily: t.fontM, fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 3,
              color: t[desgMeta.colorKey], background: t[desgMeta.colorKey] + '15',
              display: 'inline-flex', alignItems: 'center', gap: 2,
            }}>
              {desgMeta.symbol} {desgMeta.short}
            </span>
          )}
        </div>

        {/* Icon + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, background: acc + '12', border: `1px solid ${acc}25`, flexShrink: 0,
          }}>{tmpl.icon}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: isSelected ? acc : t.text }}>
              {tmpl.title}
            </div>
            <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, letterSpacing: 0.5, marginTop: 1 }}>
              {tmpl.applicabilityTags.slice(0, 2).join(' · ')}
            </div>
          </div>
        </div>

        {/* Progress + Fit indicators */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
            <div style={{ flex: 1, maxWidth: 50, height: 3, borderRadius: 2, background: t.borderSubtle, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${total > 0 ? (checked / total) * 100 : 0}%`, background: acc, borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
            <Mono size={8} color={checked > 0 ? acc : t.textDim}>{checked}/{total}</Mono>
          </div>
          {avg > 0 && (
            <Mono size={8} color={avg >= 7 ? t.emerald : avg >= 4 ? t.amber : t.rose}>{avg}/10</Mono>
          )}
        </div>

        {/* Compact designation selector */}
        <div onClick={e => e.stopPropagation()}>
          {renderDesignationSelector(tmpl.id, true)}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════════════════════ */

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── LEFT PANEL — Template Selector ── */}
      <div style={{
        width: 250, background: t.bgPanel, borderRight: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 14px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${t.accent}, ${t.violet})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: t.fontD, fontSize: 13, fontWeight: 900, color: '#fff',
            }}>A</div>
            <div>
              <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 800, color: t.text }}>Architecture</div>
              <Mono color={t.accent} size={7}>USE CASE STUDIO</Mono>
            </div>
          </div>
        </div>

        {/* Template Cards */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
          <div style={{ ...labelStyle, padding: '0 6px', marginBottom: 8 }}>Use Case Templates</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TEMPLATES.map(tmpl => (
              <React.Fragment key={tmpl.id}>{renderSelectorCard(tmpl)}</React.Fragment>
            ))}
          </div>
        </div>

        {/* Designation Summary */}
        {(primaryCount > 0 || secondaryCount > 0) && (
          <div style={{
            padding: '10px 14px', borderTop: `1px solid ${t.border}`,
            background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)',
          }}>
            <div style={{ ...labelStyle, marginBottom: 6 }}>Selection Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {TEMPLATES.filter(tp => designations[tp.id] === 'primary').map(tp => (
                <div key={tp.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: t.emerald, fontFamily: t.fontM, fontSize: 10, fontWeight: 700 }}>★</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft }}>{tp.title}</span>
                </div>
              ))}
              {TEMPLATES.filter(tp => designations[tp.id] === 'secondary').map(tp => (
                <div key={tp.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: t.amber, fontFamily: t.fontM, fontSize: 10, fontWeight: 700 }}>◆</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 10, color: t.textSoft }}>{tp.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare Toggle */}
        <div style={{ padding: '10px 12px', borderTop: `1px solid ${t.border}` }}>
          <button
            onClick={() => {
              const next = !compareMode;
              setCompareMode(next);
              if (!next) setCompareId(null);
              else {
                const other = TEMPLATES.find(tp => tp.id !== selectedId);
                if (other) setCompareId(other.id);
              }
            }}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: t.r.sm,
              border: `1px solid ${compareMode ? t.violet + '50' : t.border}`,
              background: compareMode ? t.violet + '12' : t.bgInput,
              color: compareMode ? t.violet : t.textMuted,
              fontFamily: t.fontD, fontSize: 11, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <span style={{ fontSize: 14 }}>{compareMode ? '◈' : '⬡'}</span>
            {compareMode ? 'Exit Compare' : 'Compare Templates'}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div style={{
          height: 48, background: t.bgPanel, borderBottom: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* View Toggle */}
            <div style={{
              display: 'inline-flex', borderRadius: 7, overflow: 'hidden',
              border: `1px solid ${t.border}`, background: t.bgInput,
            }}>
              {([
                { key: 'templates' as const, label: 'Templates & Requirements', icon: '◧' },
                { key: 'gtt-future' as const, label: 'GTT Future State', icon: '◈' },
              ]).map((v, i) => {
                const active = studioView === v.key;
                const vc = v.key === 'gtt-future' ? t.emerald : t.accent;
                return (
                  <button key={v.key} onClick={() => setStudioView(v.key)}
                    style={{
                      padding: '5px 14px', border: 'none',
                      borderRight: i === 0 ? `1px solid ${t.border}` : 'none',
                      background: active ? vc + '15' : 'transparent',
                      color: active ? vc : t.textDim,
                      fontFamily: t.fontD, fontSize: 10, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                    <span style={{ fontSize: 12 }}>{v.icon}</span> {v.label}
                  </button>
                );
              })}
            </div>
            <Chip color={accent} small>{selected.title}</Chip>
            {studioView === 'templates' && compared && (
              <>
                <span style={{ color: t.textDim, fontSize: 11 }}>vs</span>
                <Chip color={accentFor(compared.accentColor)} small>{compared.title}</Chip>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {primaryCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: t.emerald, fontSize: 11 }}>★</span>
                <Mono size={9} color={t.emerald}>{primaryCount} primary</Mono>
              </div>
            )}
            {secondaryCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: t.amber, fontSize: 11 }}>◆</span>
                <Mono size={9} color={t.amber}>{secondaryCount} secondary</Mono>
              </div>
            )}
            <div style={{ width: 1, height: 16, background: t.border }} />
            <Mono size={9}>{Object.values(checkedItems).filter(Boolean).length} items checked</Mono>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {studioView === 'gtt-future' ? (
            <GttFutureState useCaseId={selectedId} onBack={() => setStudioView('templates')} patternApi={patternApi} />
          ) : compareMode && compared ? (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: 20, borderRight: `1px solid ${t.border}` }}>
                {renderTemplateContent(selected, true)}
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {renderTemplateContent(compared, true)}
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {renderTemplateContent(selected)}
            </div>
          )}

          {/* Pattern Element Inspector — slide-out right panel */}
          {patternApi.inspectedElement && (
            <PatternElementInspector
              element={patternApi.inspectedElement}
              api={patternApi}
              accent={accent}
              onClose={() => patternApi.inspectElement(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureStudio;
