import React, { useState } from 'react';
import { useTheme } from '../../theme/useTheme';
import { useWorkshopStore } from '../../store/useWorkshopStore';
import UseCaseRequirementsTab from './architecture/UseCaseRequirementsTab';
import FutureStateTab from './architecture/FutureStateTab';

const TABS = [
  { key: 'requirements', label: 'Use Case & Requirements', icon: '📋' },
  { key: 'future-state', label: 'GTT Future-State Architecture', icon: '🏗' },
] as const;

const ArchitectureStudio: React.FC = () => {
  const { t, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const enabledCount = useWorkshopStore(s => s.patternElements.filter(p => p.enabled).length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: t.bg }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        padding: '0 16px', height: 44, flexShrink: 0,
        background: t.bgPanel, borderBottom: `1px solid ${t.border}`,
      }}>
        {/* GTT brand mark */}
        <div style={{
          width: 26, height: 26, borderRadius: 6, marginRight: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${t.emerald}, #059669)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: t.fontD, fontSize: 8, fontWeight: 900, color: '#fff',
          letterSpacing: 0.5, boxShadow: `0 0 10px ${t.emerald}25`,
        }}>GTT</div>

        {TABS.map((tab, i) => {
          const active = activeTab === i;
          return (
            <button key={tab.key} onClick={() => setActiveTab(i)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: active ? t.accent + '14' : 'transparent',
              color: active ? t.accent : t.textDim,
              fontFamily: t.fontD, fontSize: 11, fontWeight: active ? 700 : 500,
              transition: 'all 0.15s',
              boxShadow: active ? `inset 0 -2px 0 ${t.accent}50` : 'none',
            }}>
              <span style={{ fontSize: 13 }}>{tab.icon}</span>
              {tab.label}
              {i === 1 && enabledCount > 0 && (
                <span style={{
                  fontFamily: t.fontM, fontSize: 8, fontWeight: 700,
                  color: t.emerald, background: t.emerald + '14',
                  padding: '1px 5px', borderRadius: 3, marginLeft: 2,
                }}>{enabledCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 0 ? <UseCaseRequirementsTab /> : <FutureStateTab />}
      </div>
    </div>
  );
};

export default ArchitectureStudio;
