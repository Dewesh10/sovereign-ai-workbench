import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Layers, 
  Sparkles, 
  Play, 
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useWorkbench } from '../context/WorkbenchContext';

export const Navbar: React.FC = () => {
  const { 
    scenarios, 
    activeScenario, 
    selectScenario, 
    gatewayStats, 
    toggleSovereignMode,
    hitlActions,
    runAgentSimulation,
    isSimulatingAgent
  } = useWorkbench();

  const pendingHitlCount = hitlActions.filter(a => a.status === 'PENDING').length;

  return (
    <header className="h-16 bg-[#05070B]/90 border-b border-[#1A2234] px-5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/40 shadow-cyan-glow">
          <Layers className="w-5 h-5 text-cyan-400 animate-pulse-glow" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#05070B]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-base text-white font-mono">NEXUS<span className="text-cyan-400">.SOVEREIGN</span></span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
              v2.4.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono hidden sm:block">
            Industrial Agentic AI Operating System
          </p>
        </div>
      </div>

      {/* Center: Industrial Scenario Switcher */}
      <div className="hidden md:flex items-center gap-2 bg-[#0B0F17] p-1.5 rounded-xl border border-[#1A2234]">
        <Sparkles className="w-4 h-4 text-amber-400 ml-1.5" />
        <span className="text-xs font-mono font-medium text-slate-300">Scenario:</span>
        <select
          value={activeScenario.id}
          onChange={(e) => selectScenario(e.target.value)}
          className="bg-[#101726] text-xs font-mono text-cyan-300 font-semibold px-3 py-1.5 rounded-lg border border-[#232F48] focus:outline-none focus:border-cyan-400 cursor-pointer"
        >
          {scenarios.map(s => (
            <option key={s.id} value={s.id}>
              [{s.sector}] {s.title}
            </option>
          ))}
        </select>

        {/* 1-Click Demo Trigger */}
        <button
          onClick={() => runAgentSimulation()}
          disabled={isSimulatingAgent}
          className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 px-3.5 py-1.5 rounded-lg shadow-cyan-glow transition-all disabled:opacity-50 cursor-pointer ml-1"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isSimulatingAgent ? 'EXECUTING DEMO...' : 'RUN ENTERPRISE DEMO'}</span>
        </button>
      </div>

      {/* Right: Telemetry & Air-Gap Security Badges */}
      <div className="flex items-center gap-3">
        {/* Model Gateway Stats */}
        <div className="hidden xl:flex items-center gap-3 bg-[#0B0F17] px-3.5 py-1.5 rounded-xl border border-[#1A2234] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">VRAM:</span>
            <span className="text-cyan-300 font-semibold">{gatewayStats.vramUsedGb} / {gatewayStats.totalVramGb} GB</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-semibold">{gatewayStats.tokensPerSec} t/s</span>
          </div>
        </div>

        {/* Sovereign Air-Gap Toggle Badge */}
        <button
          onClick={toggleSovereignMode}
          title="Click to toggle Sovereign Local vs Enterprise Gateway"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
            gatewayStats.sovereignMode 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 shadow-emerald-glow'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-400'
          }`}
        >
          {gatewayStats.sovereignMode ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">AIR-GAP SOVEREIGN</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">CLOUD HYBRID</span>
            </>
          )}
        </button>

        {/* HITL Pending Actions Indicator */}
        {pendingHitlCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono font-bold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{pendingHitlCount} HITL GATE</span>
          </div>
        )}
      </div>
    </header>
  );
};
