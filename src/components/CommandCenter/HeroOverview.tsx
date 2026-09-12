import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Database, 
  Bot, 
  ArrowRight,
  Zap,
  Activity,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { Interactive3DGlobe } from './Interactive3DGlobe';

export const HeroOverview: React.FC = () => {
  const { activeScenario, qualityMetrics, setActiveTab, runAgentSimulation } = useWorkbench();

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel-glow p-6 border border-cyan-500/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40">
                {activeScenario.sector.toUpperCase()} SECTOR
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                SOVEREIGN AIR-GAP 100%
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              {activeScenario.title}
            </h1>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              {activeScenario.description}
            </p>
          </div>

          {/* Quick Action Trigger */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => {
                setActiveTab('workbench');
                runAgentSimulation();
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-mono font-extrabold text-sm shadow-cyan-glow hover:opacity-95 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>LAUNCH WORKBENCH DEMO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D GIS Satellite Map */}
      <Interactive3DGlobe />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
            <span>MULTI-AGENT SWARM</span>
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono flex items-baseline gap-2">
            <span>6 / 6</span>
            <span className="text-xs text-emerald-400 font-normal">Active & Synced</span>
          </div>
          <p className="text-xs text-slate-400">Planner, OCR, Python, RAG, Verifier, Writer</p>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
            <span>CITATION GROUNDING</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono flex items-baseline gap-2">
            <span>{qualityMetrics.citationGroundingRate}%</span>
            <span className="text-xs text-emerald-400 font-normal">Verified</span>
          </div>
          <p className="text-xs text-slate-400">Page-level bounding boxes & OCR coordinates</p>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
            <span>PYTHON SANDBOX KERNEL</span>
            <Terminal className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono flex items-baseline gap-2">
            <span>142 ms</span>
            <span className="text-xs text-amber-400 font-normal">Execution Latency</span>
          </div>
          <p className="text-xs text-slate-400">Isolated NumPy & Pandas physics evaluation</p>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-mono">
            <span>HALLUCINATION PREVENTION</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono flex items-baseline gap-2">
            <span>{qualityMetrics.hallucinationPreventionScore}%</span>
            <span className="text-xs text-purple-400 font-normal">Benchmark Score</span>
          </div>
          <p className="text-xs text-slate-400">Strict RAG refusal & verification guardrails</p>
        </div>
      </div>
    </div>
  );
};
