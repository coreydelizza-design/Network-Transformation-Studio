import React, { useState } from 'react';
import { useTheme } from '../../theme/useTheme';
import { Chip, Mono } from '../shared/Primitives';
import { PatternElementList, CustomerOverridePanel, ElementSummaryPanel, APPLICABILITY_META, GTT_SOLUTIONS } from './architecture';
import type { PatternOverridesAPI } from './architecture';

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface GttFutureStateProps {
  useCaseId: string;
  onBack: () => void;
  patternApi: PatternOverridesAPI;
}

const GttFutureState: React.FC<GttFutureStateProps> = ({ useCaseId, onBack, patternApi }) => {
  const { t, isDark } = useTheme();
  const [expandedDiff, setExpandedDiff] = useState<number | null>(null);

  const solution = GTT_SOLUTIONS.find(s => s.useCaseId === useCaseId);
  if (!solution) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: t.textMuted, fontFamily: t.fontB }}>
        No GTT solution mapping found for this use case.
      </div>
    );
  }

  const acc = t[solution.accentColor];

  /* ─── Shared Styles ─── */
  const panelStyle = (c: string): React.CSSProperties => ({
    background: t.bgCard, borderRadius: t.r.lg, border: `1px solid ${c}20`,
    padding: 20, backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden',
  });
  const glow = (c: string): React.CSSProperties => ({
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    background: `linear-gradient(90deg, transparent 5%, ${c}40 30%, ${c}70 50%, ${c}40 70%, transparent 95%)`,
  });
  const label: React.CSSProperties = {
    fontFamily: t.fontM, fontSize: 9, color: t.textDim,
    letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600, marginBottom: 10,
  };

  /* ─── Diagram ─── */
  const groupColors: Record<string, string> = {
    control: t.accent, core: acc, edge: t.amber, cloud: t.cyan,
    dc: t.violet, security: t.rose, saas: t.emerald,
  };

  const renderDiagram = () => {
    const elements = patternApi.getElements(solution.useCaseId);
    return (
      <svg viewBox="0 0 620 380" style={{ width: '100%', height: '100%', minHeight: 240 }}>
        <defs>
          <filter id="gtt-glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="gtt-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={acc} stopOpacity="0.5" />
            <stop offset="100%" stopColor={acc} stopOpacity="0.12" />
          </linearGradient>
        </defs>
        {/* Tier bands */}
        {[0, 1, 2, 3].map(tier => {
          const nodes = solution.diagramNodes.filter(n => n.tier === tier);
          if (!nodes.length) return null;
          const minY = Math.min(...nodes.map(n => n.y)) - 15;
          const maxY = Math.max(...nodes.map(n => n.y)) + 60;
          return (
            <rect key={tier} x={5} y={minY} width={610} height={maxY - minY}
              rx={10} fill={acc} opacity={isDark ? 0.02 : 0.015}
              stroke={acc} strokeOpacity={0.06} strokeWidth={1} />
          );
        })}
        {/* Tier labels */}
        {[0, 1, 2, 3].map(tier => {
          const nodes = solution.diagramNodes.filter(n => n.tier === tier);
          if (!nodes.length) return null;
          const tierLabels = ['ORCHESTRATION', 'CORE FABRIC', 'EDGE / ACCESS', 'SERVICES'];
          const midY = (Math.min(...nodes.map(n => n.y)) + Math.max(...nodes.map(n => n.y))) / 2 + 28;
          return (
            <text key={`tl-${tier}`} x={14} y={midY} style={{
              fontSize: 7, fontFamily: t.fontM, fontWeight: 700, fill: acc,
              letterSpacing: 1.5, opacity: 0.35,
            }} transform={`rotate(-90, 14, ${midY})`} textAnchor="middle">
              {tierLabels[tier]}
            </text>
          );
        })}
        {/* Edges */}
        {solution.diagramEdges.map(([fi, ti], i) => {
          const from = elements[fi] || solution.diagramNodes[fi];
          const to = elements[ti] || solution.diagramNodes[ti];
          if (!from || !to) return null;
          const fMeta = APPLICABILITY_META[elements[fi]?.applicability ?? 'active'];
          const tMeta = APPLICABILITY_META[elements[ti]?.applicability ?? 'active'];
          const edgeOp = Math.min(fMeta.edgeOpacity, tMeta.edgeOpacity);
          if (edgeOp <= 0) return null;
          const x1 = from.x + 35, y1 = from.y + 28, x2 = to.x + 35, y2 = to.y + 28;
          const dx = x2 - x1, dy = y2 - y1;
          return (
            <path key={i}
              d={`M ${x1} ${y1} C ${x1 + dx * 0.35} ${y1 + dy * 0.15}, ${x2 - dx * 0.35} ${y2 - dy * 0.15}, ${x2} ${y2}`}
              stroke="url(#gtt-edge)" strokeWidth={1.5} fill="none" filter="url(#gtt-glow)" opacity={edgeOp} />
          );
        })}
        {/* Nodes — clickable with pattern element data */}
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
              <rect x={el.x - 2} y={el.y - 2} width={74} height={60} rx={12}
                fill="transparent" stroke={isInspected ? gc : 'transparent'} strokeWidth={2}
                strokeDasharray={isInspected ? '4 2' : 'none'} />
              <rect x={el.x} y={el.y} width={70} height={56} rx={10}
                fill={isInactive
                  ? isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
                  : isInspected ? gc + '18' : isDark ? gc + '0e' : gc + '0a'}
                stroke={isInactive
                  ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')
                  : gc + (isInspected ? '60' : '30')}
                strokeWidth={isInspected ? 1.5 : 1.2}
                strokeDasharray={aMeta.dashArray} />
              <rect x={el.x} y={el.y} width={70} height={2} rx={1}
                fill={isInactive ? t.textDim : gc} opacity={isInactive ? 0.15 : isInspected ? 0.7 : 0.5} />
              {hasOverride && <circle cx={el.x + 64} cy={el.y + 6} r={3} fill={t.amber} />}
              {el.applicability !== 'active' && (
                <circle cx={el.x + 6} cy={el.y + 50} r={3.5}
                  fill={statusColor} opacity={0.7} />
              )}
              {el.quantity > 1 && !isInactive && (
                <g>
                  <rect x={el.x + 50} y={el.y + 44} width={20} height={12} rx={3}
                    fill={gc + '20'} stroke={gc + '40'} strokeWidth={0.5} />
                  <text x={el.x + 60} y={el.y + 53} textAnchor="middle"
                    style={{ fontSize: 7, fontFamily: t.fontM, fill: gc, fontWeight: 700 }}>×{el.quantity}</text>
                </g>
              )}
              <text x={el.x + 35} y={el.y + 20} textAnchor="middle"
                style={{ fontSize: 17, filter: isInactive ? 'grayscale(0.9)' : 'none' }}>{el.icon}</text>
              {el.label.split('\n').map((line, li) => (
                <text key={li} x={el.x + 35} y={el.y + 35 + li * 11} textAnchor="middle"
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

  /* ─── Integration Section ─── */
  const integrationSections: { key: keyof typeof solution.integrations; label: string; icon: string; color: string }[] = [
    { key: 'cloud', label: 'Cloud Integration', icon: '☁️', color: t.cyan },
    { key: 'security', label: 'Security Integration', icon: '🔒', color: t.rose },
    { key: 'edge', label: 'Edge & Access', icon: '📡', color: t.amber },
    { key: 'api', label: 'API & Automation', icon: '🔗', color: t.emerald },
  ];

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════════ */

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1100 }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          ...panelStyle(acc), padding: '32px 36px',
          background: `linear-gradient(135deg, ${t.bgCard}, ${acc}08, ${t.bgCard})`,
        }}>
          <div style={glow(acc)} />
          {/* Back + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <button onClick={onBack} style={{
              padding: '6px 14px', borderRadius: t.r.sm, border: `1px solid ${t.border}`,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', color: t.textMuted,
              fontFamily: t.fontD, fontSize: 10, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 13 }}>←</span> Templates
            </button>
            <Mono size={8}>{solution.title}</Mono>
            <span style={{ color: t.textDim, fontFamily: t.fontM, fontSize: 8 }}>→</span>
            <Mono size={8} color={acc}>GTT FUTURE STATE</Mono>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: t.r.xl, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38, background: `linear-gradient(135deg, ${acc}25, ${acc}10)`,
              border: `1.5px solid ${acc}40`, boxShadow: `0 0 40px ${acc}20, 0 4px 20px ${acc}12, inset 0 1px 0 rgba(255,255,255,0.06)`,
              flexShrink: 0,
            }}>{solution.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{
                  fontFamily: t.fontM, fontSize: 8, fontWeight: 700, padding: '4px 12px', borderRadius: 5,
                  background: `linear-gradient(135deg, ${acc}18, ${acc}10)`, color: acc, border: `1px solid ${acc}30`,
                  letterSpacing: 1.8, boxShadow: `0 1px 6px ${acc}12`,
                }}>GTT FUTURE STATE</span>
              </div>
              <h1 style={{ fontFamily: t.fontD, fontSize: 26, fontWeight: 800, color: t.text, margin: '8px 0 0', letterSpacing: -0.5 }}>
                {solution.solutionName}
              </h1>
              <p style={{ fontFamily: t.fontB, fontSize: 13, color: t.textSoft, margin: '10px 0 0', lineHeight: 1.75, maxWidth: 800 }}>
                {solution.narrative}
              </p>
            </div>
          </div>
        </div>

        {/* ── ARCHITECTURE HIGHLIGHTS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {solution.architectureHighlights.map(h => (
            <div key={h.label} style={{ ...panelStyle(acc), padding: '18px 20px', background: `linear-gradient(145deg, ${t.bgCard}, ${acc}03)` }}>
              <div style={glow(acc)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{h.icon}</span>
                <span style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text }}>{h.label}</span>
              </div>
              <p style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.6, margin: 0 }}>{h.detail}</p>
            </div>
          ))}
        </div>

        {/* ── KEY VALUE BULLETS ── */}
        <div style={panelStyle(acc)}>
          <div style={glow(acc)} />
          <div style={label}>Key Value Outcomes</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {solution.keyValueBullets.map((v, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px',
                borderRadius: t.r.sm, background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
                border: `1px solid ${t.borderSubtle}`,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: acc + '12', color: acc, fontFamily: t.fontM, fontSize: 9, fontWeight: 800, flexShrink: 0, marginTop: 1,
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── DIAGRAM ── */}
        <div style={panelStyle(acc)}>
          <div style={glow(acc)} />
          <div style={label}>GTT Future-State Architecture</div>
          <div style={{
            background: isDark ? 'rgba(6,10,20,0.5)' : 'rgba(240,242,245,0.7)',
            borderRadius: t.r.md, border: `1px solid ${t.borderSubtle}`, padding: 16,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: t.r.md,
              backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(40,55,85,0.18)' : 'rgba(148,163,184,0.12)'} 1px, transparent 1px)`,
              backgroundSize: '16px 16px', pointerEvents: 'none',
            }} />
            {renderDiagram()}
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
              {(['active', 'optional', 'future-phase', 'not-applicable'] as const).map(status => {
                const m = APPLICABILITY_META[status];
                const c = t[m.colorKey];
                return (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: c, opacity: m.nodeOpacity,
                      border: status === 'not-applicable' ? `1px dashed ${c}60` : 'none', boxSizing: 'border-box' }} />
                    <span style={{ fontFamily: t.fontM, fontSize: 7, color: t.textDim, letterSpacing: 0.5 }}>{m.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── ORCHESTRATION + CONNECTIVITY MODEL (two-column) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Orchestration */}
          <div style={panelStyle(acc)}>
            <div style={glow(acc)} />
            <div style={label}>{solution.orchestration.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {solution.orchestration.points.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 10px',
                  borderRadius: t.r.sm, border: `1px solid ${t.borderSubtle}`,
                  background: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
                }}>
                  <span style={{
                    color: acc, fontFamily: t.fontM, fontSize: 9, fontWeight: 700, flexShrink: 0, marginTop: 2,
                    width: 16, height: 16, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: acc + '10',
                  }}>⚙</span>
                  <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connectivity Model */}
          <div style={panelStyle(acc)}>
            <div style={glow(acc)} />
            <div style={label}>{solution.connectivityModel.title}</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.cyan, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                Underlay Transport
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {solution.connectivityModel.underlay.map((u, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: t.cyan, fontWeight: 700, fontSize: 8, marginTop: 3, flexShrink: 0 }}>▸</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.4 }}>{u}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.violet, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                Overlay Network
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {solution.connectivityModel.overlay.map((o, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <span style={{ color: t.violet, fontWeight: 700, fontSize: 8, marginTop: 3, flexShrink: 0 }}>▸</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.4 }}>{o}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              padding: '12px 14px', borderRadius: t.r.sm,
              background: acc + '06', border: `1px solid ${acc}15`,
            }}>
              <div style={{ fontFamily: t.fontM, fontSize: 8, color: acc, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                Model
              </div>
              <p style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.6, margin: 0 }}>
                {solution.connectivityModel.model}
              </p>
            </div>
          </div>
        </div>

        {/* ── INTEGRATIONS GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {integrationSections.map(sec => (
            <div key={sec.key} style={panelStyle(sec.color)}>
              <div style={glow(sec.color)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 16 }}>{sec.icon}</span>
                <span style={{ ...label, marginBottom: 0, color: sec.color }}>{sec.label}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {solution.integrations[sec.key].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{
                      color: sec.color, fontWeight: 700, fontSize: 8, marginTop: 3, flexShrink: 0,
                      width: 12, height: 12, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: sec.color + '10',
                    }}>✦</span>
                    <span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── GTT DIFFERENTIATION ── */}
        <div style={panelStyle(acc)}>
          <div style={glow(acc)} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${acc}25, ${acc}10)`, border: `1px solid ${acc}30`,
              fontFamily: t.fontD, fontSize: 11, fontWeight: 900, color: acc,
            }}>G</div>
            <div style={label}>GTT Differentiation</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {solution.differentiators.map((d, i) => (
              <div key={i}
                onClick={() => setExpandedDiff(expandedDiff === i ? null : i)}
                style={{
                  padding: '14px 16px', borderRadius: t.r.md, cursor: 'pointer', transition: 'all 0.2s',
                  background: expandedDiff === i ? acc + '08' : isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)',
                  border: `1px solid ${expandedDiff === i ? acc + '25' : t.borderSubtle}`,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(135deg, ${acc}20, ${acc}08)`, color: acc,
                    fontFamily: t.fontM, fontSize: 10, fontWeight: 800, flexShrink: 0,
                    border: `1px solid ${acc}15`,
                  }}>{i + 1}</span>
                  <span style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text, flex: 1 }}>{d.title}</span>
                  <span style={{ color: t.textDim, fontSize: 12, transition: 'transform 0.2s', transform: expandedDiff === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>
                {expandedDiff === i && (
                  <p style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.7, margin: '10px 0 0 32px' }}>
                    {d.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── IMPLEMENTATION NOTES ── */}
        <div style={panelStyle(acc)}>
          <div style={glow(acc)} />
          <div style={label}>Implementation Roadmap</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
            {/* Vertical timeline connector */}
            <div style={{
              position: 'absolute', left: 28, top: 20, bottom: 20, width: 2,
              background: `linear-gradient(180deg, ${t.cyan}30, ${t.emerald}30, ${t.amber}30, ${t.violet}30)`,
              borderRadius: 1, zIndex: 0,
            }} />
            {solution.implementationNotes.map((note, i) => {
              const phaseColors = [t.cyan, t.emerald, t.amber, t.violet];
              const pc = phaseColors[i % phaseColors.length];
              return (
                <div key={i} style={{
                  display: 'flex', gap: 16, padding: '16px 18px', borderRadius: t.r.md,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.018)',
                  border: `1px solid ${t.borderSubtle}`, position: 'relative', overflow: 'hidden',
                  zIndex: 1, marginLeft: 14,
                }}>
                  {/* Phase color bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: pc, borderRadius: '2px 0 0 2px' }} />
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute', left: -22, top: '50%', transform: 'translateY(-50%)',
                    width: 10, height: 10, borderRadius: 5, background: pc, border: `2px solid ${t.bgCard}`,
                    zIndex: 1,
                  }} />
                  <div style={{ flexShrink: 0, textAlign: 'center', paddingLeft: 4 }}>
                    <div style={{
                      fontFamily: t.fontM, fontSize: 8, fontWeight: 800, color: pc,
                      background: pc + '12', padding: '3px 8px', borderRadius: 4, letterSpacing: 1,
                    }}>{note.phase}</div>
                    <div style={{ fontFamily: t.fontM, fontSize: 8, color: t.textDim, marginTop: 4 }}>{note.duration}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 4 }}>{note.title}</div>
                    <p style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.6, margin: 0 }}>{note.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ELEMENT SUMMARY ── */}
        <ElementSummaryPanel elements={patternApi.getElements(solution.useCaseId)} accent={acc} />

        {/* ── PATTERN ELEMENTS & CUSTOMER OVERRIDES ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Pattern Element List */}
          <div style={panelStyle(acc)}>
            <div style={glow(acc)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={label}>Pattern Elements</div>
              {patternApi.overrideCount(solution.useCaseId) > 0 && (
                <div style={{
                  fontFamily: t.fontM, fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: t.amber + '15', color: t.amber,
                }}>
                  {patternApi.overrideCount(solution.useCaseId)} modified
                </div>
              )}
            </div>
            <PatternElementList
              elements={patternApi.getElements(solution.useCaseId)}
              accent={acc}
              api={patternApi}
            />
          </div>

          {/* Customer Override Panel */}
          <CustomerOverridePanel api={patternApi} accent={acc} />
        </div>

      </div>
    </div>
  );
};

export default GttFutureState;
