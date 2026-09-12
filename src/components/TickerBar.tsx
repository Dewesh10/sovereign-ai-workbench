import React from 'react';
import { Activity, ShieldCheck, Cpu, Zap, AlertTriangle } from 'lucide-react';
import { useWorkbench } from '../context/WorkbenchContext';

export const TickerBar: React.FC = () => {
  const { gatewayStats, activeScenario } = useWorkbench();

  return (
    <div className="h-7 bg-[#05070C] border-b border-[#1E2638] flex items-center px-4 overflow-hidden text-[11px] font-mono text-slate-400 select-none">
      <div className="flex items-center gap-2 pr-4 border-r border-[#1E2638] font-bold text-cyan-400 flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>LIVE TELEMETRY STREAM</span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="whitespace-nowrap flex items-center gap-8 animate-scanline">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            AIR-GAP: {gatewayStats.airGapStatus} (0 KB EGRESS)
          </span>

          <span className="flex items-center gap-1.5 text-cyan-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            MODEL: {gatewayStats.activeModel}
          </span>

          <span className="flex items-center gap-1.5 text-amber-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            THROUGHPUT: {gatewayStats.tokensPerSec} t/s
          </span>

          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            INCIDENT MONITOR: {activeScenario.title}
          </span>

          <span className="text-slate-500">
            VRAM: {gatewayStats.vramUsedGb}GB / {gatewayStats.totalVramGb}GB
          </span>
        </div>
      </div>
    </div>
  );
};
