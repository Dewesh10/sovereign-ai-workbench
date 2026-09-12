import React from 'react';
import { Sparkles, FileText, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

export const QuickScenarioGrid: React.FC = () => {
  const { scenarios, activeScenario, selectScenario, setActiveTab, runAgentSimulation } = useWorkbench();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Industrial Demo Scenarios</span>
          </h2>
          <p className="text-xs text-slate-400">Select a pre-configured industrial scenario to demonstrate live reasoning, sandbox execution, and citation grounding.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {scenarios.map((scenario) => {
          const isSelected = scenario.id === activeScenario.id;
          return (
            <div
              key={scenario.id}
              onClick={() => selectScenario(scenario.id)}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-[#0F1726] border-cyan-500/70 shadow-cyan-glow scale-[1.02]'
                  : 'bg-[#0B0F17] border-[#1A2234] hover:border-cyan-500/40 hover:bg-[#0E1421] hover:-translate-y-1'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900 text-cyan-400 border border-slate-800">
                    {scenario.sector}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-base leading-snug font-sans">
                  {scenario.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1A2234] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>{scenario.documents.length} Docs Grounded</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectScenario(scenario.id);
                    setActiveTab('workbench');
                    runAgentSimulation();
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold group"
                >
                  <span>Launch Demo</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
