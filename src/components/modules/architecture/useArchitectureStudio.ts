import { useState, useMemo, useCallback } from 'react';
import type { Designation, UseCaseTemplate } from './types';
import { FIT_DIMENSIONS } from './types';
import { TEMPLATES } from './templateData';
import { usePatternOverrides } from './usePatternOverrides';

/* ═══════════════════════════════════════════════════════════════════════════
   useArchitectureStudio
   Consolidated hook composing ALL Architecture Studio state.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface ArchitectureStudioAPI {
  /* ─── View state ─── */
  studioView: 'templates' | 'gtt-future';
  setStudioView: (v: 'templates' | 'gtt-future') => void;
  selectedId: string;
  setSelectedId: (id: string) => void;
  compareId: string | null;
  setCompareId: (id: string | null) => void;
  compareMode: boolean;
  setCompareMode: (v: boolean) => void;

  /* ─── Derived template lookups ─── */
  selected: UseCaseTemplate;
  compared: UseCaseTemplate | null;

  /* ─── Requirement checklist ─── */
  checkedItems: Record<string, boolean>;
  toggleCheck: (id: string) => void;
  checkedCount: (tmpl: UseCaseTemplate) => number;

  /* ─── Customer notes ─── */
  customerNotes: Record<string, string>;
  setNote: (tid: string, note: string) => void;

  /* ─── Fit scores ─── */
  fitScores: Record<string, Record<string, number>>;
  setFit: (tid: string, dim: string, score: number) => void;
  getFitScore: (tid: string, dim: string) => number;
  getAvgFit: (tid: string) => number;

  /* ─── Designations ─── */
  designations: Record<string, Designation>;
  cycleDesignation: (tid: string) => void;
  setDesignation: (tid: string, d: Designation) => void;
  primaryCount: number;
  secondaryCount: number;

  /* ─── Pattern overrides (composed) ─── */
  patternApi: ReturnType<typeof usePatternOverrides>;
}

export function useArchitectureStudio(): ArchitectureStudioAPI {
  /* ─── View state ─── */
  const [studioView, setStudioView] = useState<'templates' | 'gtt-future'>('templates');
  const [selectedId, setSelectedId] = useState<string>('on-demand');
  const [compareId, setCompareId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  /* ─── Requirement checklist ─── */
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const toggleCheck = useCallback((id: string) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] })), []);

  /* ─── Customer notes ─── */
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>({});
  const setNote = useCallback((tid: string, note: string) => setCustomerNotes(prev => ({ ...prev, [tid]: note })), []);

  /* ─── Fit scores ─── */
  const [fitScores, setFitScores] = useState<Record<string, Record<string, number>>>({});
  const setFit = useCallback((tid: string, dim: string, score: number) => setFitScores(prev => ({
    ...prev, [tid]: { ...(prev[tid] || {}), [dim]: score },
  })), []);

  /* ─── Designations ─── */
  const [designations, setDesignations] = useState<Record<string, Designation>>({});
  const cycleDesignation = useCallback((tid: string) => {
    const order: Designation[] = [null, 'primary', 'secondary', 'not-selected'];
    setDesignations(prev => {
      const cur = prev[tid] ?? null;
      const next = order[(order.indexOf(cur) + 1) % order.length];
      return { ...prev, [tid]: next };
    });
  }, []);
  const setDesignation = useCallback((tid: string, d: Designation) => setDesignations(prev => ({ ...prev, [tid]: d })), []);

  /* ─── Pattern overrides ─── */
  const patternApi = usePatternOverrides();

  /* ─── Derived ─── */
  const selected = useMemo(() => TEMPLATES.find(tp => tp.id === selectedId)!, [selectedId]);
  const compared = useMemo(() => compareId ? TEMPLATES.find(tp => tp.id === compareId) ?? null : null, [compareId]);

  const getFitScore = useCallback((tid: string, dim: string) => fitScores[tid]?.[dim] ?? 0, [fitScores]);
  const getAvgFit = useCallback((tid: string) => {
    const scores = FIT_DIMENSIONS.map(d => fitScores[tid]?.[d] ?? 0);
    const filled = scores.filter(s => s > 0);
    return filled.length ? Math.round(filled.reduce((a, b) => a + b, 0) / filled.length) : 0;
  }, [fitScores]);

  const checkedCount = useCallback((tmpl: UseCaseTemplate) => tmpl.requirementChecklist.filter(r => checkedItems[r.id]).length, [checkedItems]);

  const primaryCount = useMemo(() => Object.values(designations).filter(d => d === 'primary').length, [designations]);
  const secondaryCount = useMemo(() => Object.values(designations).filter(d => d === 'secondary').length, [designations]);

  return {
    studioView, setStudioView,
    selectedId, setSelectedId,
    compareId, setCompareId,
    compareMode, setCompareMode,
    selected, compared,
    checkedItems, toggleCheck, checkedCount,
    customerNotes, setNote,
    fitScores, setFit, getFitScore, getAvgFit,
    designations, cycleDesignation, setDesignation, primaryCount, secondaryCount,
    patternApi,
  };
}
