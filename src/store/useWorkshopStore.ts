import { create } from 'zustand';
import type { PainScores, MaturityMap, WorkshopNote } from '../types';
import { INIT_PAIN_SCORES, INIT_MATURITY } from '../data/seed';

interface WorkshopState {
  // Navigation
  activeTab: number;
  setActiveTab: (tab: number) => void;

  // UI
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  copilotOpen: boolean;
  toggleCopilot: () => void;

  // Pain scores
  painScores: PainScores;
  setPainScore: (id: string, value: number) => void;

  // Maturity
  maturity: MaturityMap;
  setMaturityScore: (key: string, field: 'current' | 'target', value: number) => void;

  // Notes
  notes: WorkshopNote[];
  addNote: (type: WorkshopNote['type'], text: string) => void;
  removeNote: (id: number) => void;
}

export const useWorkshopStore = create<WorkshopState>((set) => ({
  activeTab: 0,
  setActiveTab: (tab) => set({ activeTab: tab }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  copilotOpen: false,
  toggleCopilot: () => set((s) => ({ copilotOpen: !s.copilotOpen })),

  painScores: { ...INIT_PAIN_SCORES },
  setPainScore: (id, value) => set((s) => ({ painScores: { ...s.painScores, [id]: value } })),

  maturity: { ...INIT_MATURITY },
  setMaturityScore: (key, field, value) =>
    set((s) => ({
      maturity: {
        ...s.maturity,
        [key]: { ...s.maturity[key], [field]: value },
      },
    })),

  notes: [
    { id: 1, type: 'assumption', text: 'All branches have minimum 100 Mbps broadband for SD-WAN underlay.' },
    { id: 2, type: 'question', text: 'Confirm Pinnacle Insurance sites can support Zscaler Client Connector.' },
    { id: 3, type: 'note', text: 'Robert confirmed: East DC lease expires Q2 2027 — factor into timeline.' },
    { id: 4, type: 'assumption', text: 'SASE PoC targets 5 NA branch sites (mix of urban and remote).' },
    { id: 5, type: 'question', text: 'Current state of identity federation across acquired entities?' },
  ],
  addNote: (type, text) =>
    set((s) => ({ notes: [...s.notes, { id: Date.now(), type, text }] })),
  removeNote: (id) =>
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
}));
