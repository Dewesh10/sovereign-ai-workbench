import React, { useState } from 'react';
import { WorkbenchProvider, useWorkbench } from './context/WorkbenchContext';
import { TickerBar } from './components/TickerBar';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HeroOverview } from './components/CommandCenter/HeroOverview';
import { QuickScenarioGrid } from './components/CommandCenter/QuickScenarioGrid';
import { AgentChatView } from './components/Workbench/AgentChatView';
import { BlueprintViewer } from './components/Workbench/BlueprintViewer';
import { EvidenceDrawer } from './components/Workbench/EvidenceDrawer';
import { ReportGenerator } from './components/Workbench/ReportGenerator';
import { SwarmNodeMap } from './components/AgentGraph/SwarmNodeMap';
import { ToolRegistry } from './components/AgentGraph/ToolRegistry';
import { EntityGraphView } from './components/KnowledgeGraph/EntityGraphView';
import { MultiFileIDE } from './components/Sandbox/MultiFileIDE';
import { MultimodalPipeline } from './components/Ingestion/MultimodalPipeline';
import { SecurityConsole } from './components/SecurityAudit/SecurityConsole';
import { BenchmarkConsole } from './components/QualityMetrics/BenchmarkConsole';
import { Bot, FileText, Layers } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useWorkbench();
  const [workbenchSubTab, setWorkbenchSubTab] = useState<'blueprint' | 'report'>('blueprint');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#07090E]">
      <TickerBar />
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-hidden relative flex">
          {activeTab === 'command' && (
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <HeroOverview />
              <QuickScenarioGrid />
            </div>
          )}

          {activeTab === 'workbench' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Chat Thread */}
              <div className="w-[450px] flex-shrink-0 flex flex-col h-full border-r border-[#1E2638]">
                <AgentChatView />
              </div>

              {/* Center Column: Interactive Canvas or Printable Report */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Sub Tab Bar */}
                <div className="px-4 py-2 bg-[#0D111A] border-b border-[#1E2638] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWorkbenchSubTab('blueprint')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        workbenchSubTab === 'blueprint'
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Blueprint & P&ID Canvas</span>
                    </button>

                    <button
                      onClick={() => setWorkbenchSubTab('report')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        workbenchSubTab === 'report'
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Printable Inspection Brief</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                  {workbenchSubTab === 'blueprint' ? <BlueprintViewer /> : <ReportGenerator />}
                </div>
              </div>

              {/* Right Drawer: Evidence Grounding */}
              <EvidenceDrawer />
            </div>
          )}

          {activeTab === 'ingestion' && (
            <div className="flex-1 overflow-hidden">
              <MultimodalPipeline />
            </div>
          )}

          {activeTab === 'agent-graph' && (
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <SwarmNodeMap />
              <ToolRegistry />
            </div>
          )}

          {activeTab === 'knowledge-graph' && (
            <div className="flex-1 overflow-hidden">
              <EntityGraphView />
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="flex-1 overflow-hidden">
              <MultiFileIDE />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex-1 overflow-hidden">
              <SecurityConsole />
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="flex-1 overflow-hidden">
              <BenchmarkConsole />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <WorkbenchProvider>
      <MainLayout />
    </WorkbenchProvider>
  );
}

export default App;
