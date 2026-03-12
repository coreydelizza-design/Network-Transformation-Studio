import React from 'react';
import { useWorkshopStore } from './store/useWorkshopStore';
import AppShell from './components/layout/AppShell';
import CommandCenter from './components/modules/CommandCenter';
import ExecutiveContext from './components/modules/ExecutiveContext';
import EstateMapper from './components/modules/EstateMapper';
import PainEngine from './components/modules/PainEngine';
import MaturityAssessment from './components/modules/MaturityAssessment';
import FutureStateVision from './components/modules/FutureStateVision';
import ArchitectureStudio from './components/modules/ArchitectureStudio';
import TradeoffLab from './components/modules/TradeoffLab';
import TransformationRoadmap from './components/modules/TransformationRoadmap';
import Deliverables from './components/modules/Deliverables';

const TABS: Record<number, React.FC> = {
  0: CommandCenter,
  1: ExecutiveContext,
  2: EstateMapper,
  3: PainEngine,
  4: MaturityAssessment,
  5: FutureStateVision,
  6: ArchitectureStudio,
  7: TradeoffLab,
  8: TransformationRoadmap,
  9: Deliverables,
};

const App: React.FC = () => {
  const { activeTab } = useWorkshopStore();
  const TabComponent = TABS[activeTab] || CommandCenter;

  return (
    <AppShell>
      <TabComponent />
    </AppShell>
  );
};

export default App;
