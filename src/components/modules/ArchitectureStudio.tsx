import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../../theme/useTheme';
import { STATUS_COLORS, CRIT_COLORS, PHASE_COLORS, PHASE_LABELS, CAT_COLORS } from '../../theme/tokens';
import { PALETTE, PALETTE_CATS, TEMPLATES, EMPTY_META, palItem } from '../../data/seed';
import type { ArchNode, WorkshopNote } from '../../types';
import { Chip, Mono } from '../shared/Primitives';
import { useWorkshopStore } from '../../store/useWorkshopStore';

const ArchitectureStudio: React.FC = () => {
  const { t, isDark } = useTheme();
  const { archNodes: nodes, archEdges: edges, setArchNodes: setNodes, setArchEdges: setEdges, loadTemplate, notes, addNote, removeNote } = useWorkshopStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);
  const [panning, setPanning] = useState<{ startX: number; startY: number; startPan: { x: number; y: number } } | null>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'current' | 'future'>('current');
  const [palSearch, setPalSearch] = useState('');
  const [palCat, setPalCat] = useState('All');
  const [rightPanel, setRightPanel] = useState<'inspector' | 'notes'>('inspector');
  const [showLayers, setShowLayers] = useState<Record<string, boolean>>({ Sites: true, Network: true, Security: true, Cloud: true, 'Edge / Compute': true, Operations: true });
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState<WorkshopNote['type']>('note');
  const [showTemplates, setShowTemplates] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nc = useRef(100);

  const selectedNode = selectedId ? nodes.find(n => n.id === selectedId) : null;
  const nd = (id: string) => nodes.find(n => n.id === id);

  const filteredPalette = useMemo(() => {
    let items = PALETTE;
    if (palCat !== 'All') items = items.filter(p => p.cat === palCat);
    if (palSearch) { const q = palSearch.toLowerCase(); items = items.filter(p => p.label.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)); }
    return items;
  }, [palCat, palSearch]);

  const visibleNodes = useMemo(() => nodes.filter(n => showLayers[palItem(n.type).cat] !== false), [nodes, showLayers]);

  const handleWheel = useCallback((e: WheelEvent) => { e.preventDefault(); setZoom(z => Math.max(0.25, Math.min(3, z + (e.deltaY > 0 ? -0.08 : 0.08)))); }, []);
  useEffect(() => { const el = canvasRef.current; if (!el) return; el.addEventListener('wheel', handleWheel, { passive: false }); return () => el.removeEventListener('wheel', handleWheel); }, [handleWheel]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== canvasRef.current && !(e.target as HTMLElement).closest('[data-canvas-bg]')) return;
    setPanning({ startX: e.clientX, startY: e.clientY, startPan: { ...pan } });
    setSelectedId(null);
    if (connectFrom) setConnectFrom(null);
  }, [pan, connectFrom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (panning) { setPan({ x: panning.startPan.x + e.clientX - panning.startX, y: panning.startPan.y + e.clientY - panning.startY }); return; }
    if (!dragging || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    setNodes(nodes.map(n => n.id === dragging.id ? { ...n, x: Math.round((e.clientX - r.left - pan.x) / zoom - dragging.ox), y: Math.round((e.clientY - r.top - pan.y) / zoom - dragging.oy) } : n));
  }, [dragging, panning, zoom, pan, nodes, setNodes]);

  const handleMouseUp = useCallback(() => { setDragging(null); setPanning(null); }, []);

  const handleNodeMouseDown = (e: React.MouseEvent, node: ArchNode) => {
    e.stopPropagation();
    if (connectFrom) {
      if (connectFrom !== node.id && !edges.some(ed => (ed.from === connectFrom && ed.to === node.id) || (ed.from === node.id && ed.to === connectFrom)))
        setEdges([...edges, { from: connectFrom, to: node.id }]);
      setConnectFrom(null); return;
    }
    const r = canvasRef.current!.getBoundingClientRect();
    setDragging({ id: node.id, ox: (e.clientX - r.left - pan.x) / zoom - node.x, oy: (e.clientY - r.top - pan.y) / zoom - node.y });
    setSelectedId(node.id); setRightPanel('inspector');
  };

  const addNode = (type: string) => {
    const p = palItem(type); const id = 'n' + (++nc.current);
    setNodes([...nodes, { id, type, label: p.label, x: Math.round((-pan.x + 400) / zoom + (Math.random() - 0.5) * 120), y: Math.round((-pan.y + 250) / zoom + (Math.random() - 0.5) * 80), meta: { ...EMPTY_META, ...p.defaultMeta, name: p.label } }]);
  };

  const removeNode = (id: string) => { setNodes(nodes.filter(n => n.id !== id)); setEdges(edges.filter(e => e.from !== id && e.to !== id)); if (selectedId === id) setSelectedId(null); };

  const updateMeta = (key: string, val: string | number) => {
    if (!selectedId) return;
    setNodes(nodes.map(n => n.id === selectedId ? { ...n, meta: { ...n.meta, [key]: val }, ...(key === 'name' ? { label: val as string } : {}) } : n));
  };

  const doLoadTemplate = (key: string) => { loadTemplate(key); setPan({ x: 0, y: 0 }); setZoom(1); setSelectedId(null); setShowTemplates(false); };

  const drawEdge = (from: ArchNode, to: ArchNode) => {
    const W = 110, H = 72, x1 = from.x + W / 2, y1 = from.y + H / 2, x2 = to.x + W / 2, y2 = to.y + H / 2, dx = x2 - x1;
    return `M ${x1} ${y1} C ${x1 + dx * 0.35} ${y1}, ${x2 - dx * 0.35} ${y2}, ${x2} ${y2}`;
  };

  const noteColors: Record<string, string> = { note: t.accent, assumption: t.amber, question: t.rose, decision: t.emerald };
  const gridDot = isDark ? 'rgba(40,55,85,0.25)' : 'rgba(148,163,184,0.2)';

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* LEFT PALETTE */}
      <div style={{ width: 210, background: t.bgPanel, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '14px 12px 10px', borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(135deg, ${t.accent}, ${t.cyan})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontD, fontSize: 12, fontWeight: 900, color: '#fff' }}>A</div>
            <div><div style={{ fontFamily: t.fontD, fontSize: 12, fontWeight: 800, color: t.text }}>Architecture</div><Mono color={t.accent} size={7}>DESIGN STUDIO</Mono></div>
          </div>
          <input value={palSearch} onChange={e => setPalSearch(e.target.value)} placeholder="Search..." style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 6, color: t.text, fontFamily: t.fontB, fontSize: 11, padding: '6px 10px' }} />
        </div>
        <div style={{ padding: '6px 8px 2px', display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {['All', ...PALETTE_CATS].map(c => (
            <button key={c} onClick={() => setPalCat(c)} style={{ padding: '3px 7px', borderRadius: 4, fontFamily: t.fontM, fontSize: 8, background: palCat === c ? (c === 'All' ? t.accent : CAT_COLORS[c] || t.accent) + '20' : 'transparent', border: `1px solid ${palCat === c ? (c === 'All' ? t.accent : CAT_COLORS[c] || t.accent) + '40' : 'transparent'}`, color: palCat === c ? (c === 'All' ? t.accent : CAT_COLORS[c]) : t.textDim }}>{c}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px' }}>
          {(palCat === 'All' ? PALETTE_CATS : [palCat]).map(cat => {
            const items = filteredPalette.filter(p => p.cat === cat);
            if (!items.length) return null;
            return (<div key={cat} style={{ marginBottom: 8 }}><Mono color={CAT_COLORS[cat]} size={8}>{cat}</Mono>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
                {items.map(p => (<div key={p.type} onClick={() => addNode(p.type)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 8px', borderRadius: 5, cursor: 'pointer', background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{p.icon}</span><span style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft }}>{p.label}</span><span style={{ marginLeft: 'auto', fontFamily: t.fontM, fontSize: 8, color: t.textDim }}>+</span>
                </div>))}
              </div>
            </div>);
          })}
        </div>
        <div style={{ padding: '6px 8px', borderTop: `1px solid ${t.border}` }}>
          <button onClick={() => setShowTemplates(!showTemplates)} style={{ width: '100%', padding: '7px', borderRadius: 6, border: `1px solid ${t.border}`, background: showTemplates ? t.accent + '12' : t.bgInput, color: showTemplates ? t.accent : t.textMuted, fontFamily: t.fontD, fontSize: 11, fontWeight: 600 }}>{showTemplates ? '▾ Templates' : '▸ Templates'}</button>
          {showTemplates && <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {Object.entries(TEMPLATES).map(([k, tmpl]) => (<button key={k} onClick={() => doLoadTemplate(k)} style={{ padding: '6px 8px', borderRadius: 5, border: `1px solid ${t.borderSubtle}`, background: t.bgGlass, color: t.text, textAlign: 'left', fontFamily: t.fontB, fontSize: 10 }}><div style={{ fontWeight: 600 }}>{tmpl.label}</div><div style={{ fontSize: 9, color: t.textDim }}>{tmpl.desc}</div></button>))}
          </div>}
        </div>
      </div>

      {/* CENTER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ height: 44, background: t.bgPanel, borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', background: t.bgInput, borderRadius: 6, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
              {(['current', 'future'] as const).map(m => (<button key={m} onClick={() => setViewMode(m)} style={{ padding: '5px 14px', border: 'none', fontFamily: t.fontD, fontSize: 11, fontWeight: 600, background: viewMode === m ? (m === 'current' ? t.amber : t.emerald) + '20' : 'transparent', color: viewMode === m ? (m === 'current' ? t.amber : t.emerald) : t.textDim, borderRight: m === 'current' ? `1px solid ${t.border}` : 'none' }}>{m === 'current' ? '● Current' : '◆ Future'}</button>))}
            </div>
            <button onClick={() => setConnectFrom(connectFrom ? null : '__ready')} style={{ padding: '5px 12px', borderRadius: 6, fontFamily: t.fontD, fontSize: 11, fontWeight: 600, background: connectFrom ? t.cyan + '20' : 'transparent', border: `1px solid ${connectFrom ? t.cyan + '50' : t.border}`, color: connectFrom ? t.cyan : t.textMuted }}>{connectFrom ? '● Click nodes...' : '⊕ Connect'}</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Mono size={9}>{visibleNodes.length} nodes</Mono><Mono size={9}>{edges.length} edges</Mono><Mono size={9}>{Math.round(zoom * 100)}%</Mono>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {PALETTE_CATS.map(cat => (<button key={cat} onClick={() => setShowLayers(p => ({ ...p, [cat]: !p[cat] }))} title={cat} style={{ width: 22, height: 22, borderRadius: 4, border: `1px solid ${showLayers[cat] ? (CAT_COLORS[cat] || t.accent) + '50' : t.borderSubtle}`, background: showLayers[cat] ? (CAT_COLORS[cat] || t.accent) + '15' : 'transparent', fontSize: 9, color: showLayers[cat] ? CAT_COLORS[cat] : t.textDim, fontFamily: t.fontM, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cat[0]}</button>))}
            <div style={{ width: 1, height: 18, background: t.border, margin: '0 2px' }} />
            <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} style={{ width: 24, height: 24, borderRadius: 5, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            <button onClick={() => setZoom(z => Math.max(0.25, z - 0.2))} style={{ width: 24, height: 24, borderRadius: 5, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={{ padding: '3px 8px', borderRadius: 5, border: `1px solid ${t.border}`, background: t.bgInput, color: t.textMuted, fontFamily: t.fontM, fontSize: 8 }}>FIT</button>
          </div>
        </div>

        {/* Canvas */}
        <div ref={canvasRef} onMouseDown={handleCanvasMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: panning ? 'grabbing' : connectFrom ? 'crosshair' : 'grab', background: t.bgCanvas }}>
          <div data-canvas-bg="true" style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${gridDot} 1px, transparent 1px)`, backgroundSize: `${24 * zoom}px ${24 * zoom}px`, backgroundPosition: `${pan.x % (24 * zoom)}px ${pan.y % (24 * zoom)}px`, pointerEvents: 'none' }} />
          <div data-canvas-bg="true" style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 40% 30%, ${viewMode === 'current' ? t.amber : t.emerald}03, transparent 60%)`, pointerEvents: 'none' }} />

          <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
            <svg style={{ position: 'absolute', top: -2000, left: -2000, width: 6000, height: 6000, pointerEvents: 'none', overflow: 'visible' }}>
              <defs>
                <linearGradient id="egC" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={t.amber} stopOpacity="0.6" /><stop offset="100%" stopColor={t.orange} stopOpacity="0.3" /></linearGradient>
                <linearGradient id="egF" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={t.accent} stopOpacity="0.6" /><stop offset="100%" stopColor={t.cyan} stopOpacity="0.3" /></linearGradient>
                <filter id="eGlow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              {edges.map((e, i) => {
                const f = nd(e.from), to = nd(e.to);
                if (!f || !to || showLayers[palItem(f.type).cat] === false || showLayers[palItem(to.type).cat] === false) return null;
                return <path key={i} d={drawEdge(f, to)} stroke={viewMode === 'current' ? 'url(#egC)' : 'url(#egF)'} strokeWidth={2} fill="none" filter="url(#eGlow)" />;
              })}
            </svg>

            {visibleNodes.map(node => {
              const p = palItem(node.type); const sel = selectedId === node.id; const m = node.meta;
              const cc = CRIT_COLORS[m.criticality] || t.slate; const sc = STATUS_COLORS[m.status] || t.slate; const pc = PHASE_COLORS[m.phase] || 'transparent';
              return (
                <div key={node.id} className="canvas-node" onMouseDown={e => handleNodeMouseDown(e, node)}
                  style={{ position: 'absolute', left: node.x, top: node.y, width: 110, userSelect: 'none', zIndex: sel ? 50 : 10, borderRadius: 10, background: sel ? p.color + '15' : t.bgCard, border: `1.5px solid ${sel ? p.color : p.color + '35'}`, backdropFilter: 'blur(12px)', boxShadow: sel ? `0 0 24px ${p.color}20, 0 4px 20px rgba(0,0,0,${isDark ? '0.4' : '0.1'})` : `0 2px 12px rgba(0,0,0,${isDark ? '0.35' : '0.08'})`, cursor: connectFrom ? 'crosshair' : 'grab', overflow: 'hidden' }}>
                  <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${p.color}${sel ? 'aa' : '50'}, transparent)` }} />
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: cc, boxShadow: `0 0 6px ${cc}80` }} />
                  {m.phase > 0 && <div style={{ position: 'absolute', top: 5, left: 6 }}><Chip color={pc} small>P{m.phase}</Chip></div>}
                  <div style={{ padding: '8px 8px 6px', textAlign: 'center' }}>
                    <div style={{ fontSize: 26, lineHeight: 1, filter: sel ? `drop-shadow(0 0 8px ${p.color}50)` : 'none', marginTop: 2 }}>{p.icon}</div>
                    <div style={{ fontFamily: t.fontD, fontSize: 10, fontWeight: 600, color: t.text, marginTop: 5, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px' }}>{node.label}</div>
                    <div style={{ fontFamily: t.fontM, fontSize: 7, color: p.color, marginTop: 2, letterSpacing: 0.8, opacity: 0.8 }}>{p.cat.toUpperCase()}</div>
                  </div>
                  <div style={{ height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, background: sc + '10', borderTop: `1px solid ${t.borderSubtle}` }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: sc }} />
                    <span style={{ fontFamily: t.fontM, fontSize: 7, color: sc, letterSpacing: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>{m.status}</span>
                  </div>
                  {connectFrom && connectFrom !== '__ready' && connectFrom !== node.id && <div style={{ position: 'absolute', inset: -3, borderRadius: 12, border: `2px dashed ${t.cyan}70`, pointerEvents: 'none' }} />}
                </div>
              );
            })}
          </div>

          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 7, background: t.bgPanel, border: `1px solid ${t.border}`, backdropFilter: 'blur(8px)' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: viewMode === 'current' ? t.amber : t.emerald }} />
            <span style={{ fontFamily: t.fontD, fontSize: 11, fontWeight: 700, color: viewMode === 'current' ? t.amber : t.emerald }}>{viewMode === 'current' ? 'Current-State' : 'Future-State'}</span>
          </div>

          <div style={{ position: 'absolute', bottom: 10, left: 10, width: 130, height: 80, borderRadius: 7, background: t.bgPanel + 'ee', border: `1px solid ${t.border}`, overflow: 'hidden' }}>
            <svg width="130" height="80" viewBox="-100 -50 1100 700">
              {visibleNodes.map(n => <rect key={n.id} x={n.x} y={n.y} width={10} height={7} rx={2} fill={palItem(n.type).color} opacity={selectedId === n.id ? 1 : 0.4} />)}
              <rect x={-pan.x / zoom} y={-pan.y / zoom} width={800 / zoom} height={500 / zoom} fill="none" stroke={t.accent} strokeWidth={3} rx={4} opacity={0.3} />
            </svg>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 260, background: t.bgPanel, borderLeft: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}` }}>
          {([{ key: 'inspector' as const, label: 'Inspector' }, { key: 'notes' as const, label: 'Notes' }]).map(tab => (
            <button key={tab.key} onClick={() => setRightPanel(tab.key)} style={{ flex: 1, padding: '11px 8px', border: 'none', background: rightPanel === tab.key ? t.accent + '10' : 'transparent', color: rightPanel === tab.key ? t.accent : t.textDim, fontFamily: t.fontD, fontSize: 11, fontWeight: 600, borderBottom: rightPanel === tab.key ? `2px solid ${t.accent}` : '2px solid transparent' }}>{tab.label}</button>
          ))}
        </div>

        {rightPanel === 'inspector' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {!selectedNode ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 32, opacity: 0.15, marginBottom: 10 }}>✦</div>
                <div style={{ fontFamily: t.fontD, fontSize: 13, fontWeight: 600, color: t.textMuted, marginBottom: 4 }}>No Node Selected</div>
                <div style={{ fontFamily: t.fontB, fontSize: 12, color: t.textDim, lineHeight: 1.5 }}>Click a component on canvas to inspect.</div>
              </div>
            ) : (() => {
              const p = palItem(selectedNode.type); const m = selectedNode.meta;
              const inputSt = { width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 5, color: t.text, fontFamily: t.fontB, fontSize: 12, padding: '6px 9px' } as const;
              const selSt = { ...inputSt, cursor: 'pointer' as const };
              const fl = (label: string) => <div style={{ fontFamily: t.fontM, fontSize: 9, color: t.textDim, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 3, fontWeight: 600 }}>{label}</div>;

              return (
                <div className="animate-fade-in" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ textAlign: 'center', padding: '14px 10px', background: p.color + '08', borderRadius: 9, border: `1px solid ${p.color}20` }}>
                    <span style={{ fontSize: 34, filter: `drop-shadow(0 0 8px ${p.color}40)` }}>{p.icon}</span>
                    <div style={{ fontFamily: t.fontM, fontSize: 8, color: p.color, fontWeight: 600, marginTop: 5, letterSpacing: 1.5 }}>{p.cat.toUpperCase()} — {p.label.toUpperCase()}</div>
                  </div>
                  <div>{fl('Name')}<input value={m.name} onChange={e => updateMeta('name', e.target.value)} style={{ ...inputSt, fontFamily: t.fontD, fontWeight: 600 }} /></div>
                  <div>{fl('Role')}<input value={m.role} onChange={e => updateMeta('role', e.target.value)} style={inputSt} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>{fl('Status')}<select value={m.status} onChange={e => updateMeta('status', e.target.value)} style={selSt}>{Object.keys(STATUS_COLORS).map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}</select></div>
                    <div>{fl('Criticality')}<select value={m.criticality} onChange={e => updateMeta('criticality', e.target.value)} style={selSt}>{Object.keys(CRIT_COLORS).map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}</select></div>
                  </div>
                  <div>{fl('Owner')}<input value={m.owner} onChange={e => updateMeta('owner', e.target.value)} style={inputSt} /></div>
                  <div>{fl('Phase')}<select value={m.phase} onChange={e => updateMeta('phase', +e.target.value)} style={selSt}>{PHASE_LABELS.map((l, i) => <option key={i} value={i}>{l}</option>)}</select></div>
                  <div>{fl('Notes')}<textarea value={m.notes} onChange={e => updateMeta('notes', e.target.value)} rows={3} style={{ ...inputSt, resize: 'vertical' as const }} /></div>
                  <div style={{ padding: '8px 10px', borderRadius: 7, background: t.bgGlass, border: `1px solid ${t.borderSubtle}` }}><Mono size={8}>Connections: {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).length}</Mono></div>
                  <button onClick={() => setConnectFrom(selectedNode.id)} style={{ padding: '9px', borderRadius: 7, border: `1px solid ${t.accent}30`, background: t.accent + '10', color: t.accent, fontFamily: t.fontD, fontSize: 11, fontWeight: 600 }}>⊕ Connect from here</button>
                  <button onClick={() => removeNode(selectedNode.id)} style={{ padding: '9px', borderRadius: 7, border: `1px solid ${t.rose}25`, background: t.rose + '08', color: t.rose, fontFamily: t.fontD, fontSize: 11, fontWeight: 600 }}>Remove</button>
                </div>
              );
            })()}
          </div>
        )}

        {rightPanel === 'notes' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {notes.map(n => (
                <div key={n.id} style={{ padding: '8px 10px', borderRadius: 7, background: (noteColors[n.type] || t.accent) + '06', border: `1px solid ${(noteColors[n.type] || t.accent)}15` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><Chip color={noteColors[n.type]} small>{n.type}</Chip><button onClick={() => removeNote(n.id)} style={{ background: 'none', border: 'none', color: t.textDim, fontSize: 11 }}>×</button></div>
                  <div style={{ fontFamily: t.fontB, fontSize: 11, color: t.textSoft, lineHeight: 1.5 }}>{n.text}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 10, borderTop: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 5 }}>
                {(['note', 'assumption', 'question', 'decision'] as const).map(typ => (<button key={typ} onClick={() => setNewNoteType(typ)} style={{ padding: '2px 7px', borderRadius: 3, border: `1px solid ${newNoteType === typ ? (noteColors[typ]) + '40' : 'transparent'}`, background: newNoteType === typ ? noteColors[typ] + '15' : 'transparent', color: newNoteType === typ ? noteColors[typ] : t.textDim, fontFamily: t.fontM, fontSize: 8 }}>{typ}</button>))}
              </div>
              <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Capture a note..." rows={2} style={{ width: '100%', background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: 5, color: t.text, fontFamily: t.fontB, fontSize: 11, padding: '7px 9px', resize: 'none', marginBottom: 5 }} />
              <button onClick={() => { if (newNote.trim()) { addNote(newNoteType, newNote.trim()); setNewNote(''); } }} style={{ width: '100%', padding: 7, borderRadius: 5, border: 'none', background: `linear-gradient(135deg, ${t.accent}, ${t.cyan})`, color: '#fff', fontFamily: t.fontD, fontSize: 11, fontWeight: 600 }}>Add Note</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchitectureStudio;
