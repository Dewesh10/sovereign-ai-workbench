import React, { useState } from 'react';
import { 
  GitFork, 
  BrainCircuit, 
  Eye, 
  Terminal, 
  Database, 
  ShieldAlert, 
  FileText,
  Activity,
  Zap,
  Clock,
  Sliders
} from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { AgentNode } from '../../types/workbench';
import { AgentInspectorModal } from './AgentInspectorModal';

export const SwarmNodeMap: React.FC = () => {
  const { agentNodes, isSimulatingAgent } = useWorkbench();
  const [inspectNode, setInspectNode] = useState<AgentNode | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'planner': return BrainCircuit;
      case 'vision_ocr': return Eye;
      case 'python_sandbox': return Terminal;
      case 'rag_vector': return Database;
      case 'compliance_verifier': return ShieldAlert;
      case 'report_writer': return FileText;
      default: return GitFork;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#07090E] p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <GitFork className="w-5 h-5 text-cyan-400" />
            <span>Multi-Agent Swarm Topology Network</span>
          </h2>
          <p className="text-xs text-slate-400">Live visual graph showing specialized agents. Click any agent node to configure hyperparameters & sandboxed tools.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border flex items-center gap-1.5 ${
            isSimulatingAgent
              ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 animate-pulse'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
          }`}>
            <Activity className="w-4 h-4" />
            <span>{isSimulatingAgent ? 'SWARM EXECUTING STEPS...' : 'SWARM READY & SYNCED'}</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas Topology Graph Grid */}
      <div className="relative glass-panel rounded-2xl p-8 border border-cyan-500/20 cyber-grid-bg min-h-[440px] flex items-center justify-center">
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/20 stroke-2">
          <line x1="20%" y1="50%" x2="50%" y2="25%" strokeDasharray="4 4" className="animate-pulse" />
          <line x1="50%" y1="25%" x2="80%" y2="50%" strokeDasharray="4 4" className="animate-pulse" />
          <line x1="20%" y1="50%" x2="50%" y2="75%" strokeDasharray="4 4" className="animate-pulse" />
          <line x1="50%" y1="75%" x2="80%" y2="50%" strokeDasharray="4 4" className="animate-pulse" />
          <line x1="50%" y1="25%" x2="50%" y2="75%" strokeDasharray="4 4" className="animate-pulse" />
        </svg>

        {/* Agent Node Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 w-full max-w-5xl">
          {agentNodes.map((node) => {
            const Icon = getIcon(node.type);
            const isCompleted = node.status === 'completed';
            const isRunning = node.status === 'running';

            return (
              <div
                key={node.id}
                onClick={() => setInspectNode(node)}
                className={`p-5 rounded-2xl border transition-all space-y-3 cursor-pointer group ${
                  isRunning
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-cyan-glow animate-pulse-glow scale-[1.03]'
                    : isCompleted
                    ? 'bg-[#0E1726] border-emerald-500/40 hover:border-cyan-400 shadow-emerald-glow'
                    : 'bg-[#0D111A] border-[#1E2638] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isRunning
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : isCompleted
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Sliders className="w-3 h-3" />
                      Configure
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isRunning
                        ? 'bg-cyan-500 text-slate-950 font-extrabold animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-500'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base font-mono group-hover:text-cyan-300 transition-colors">
                    {node.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {node.role}
                  </p>
                </div>

                {node.lastOutput && (
                  <div className="p-2.5 rounded-lg bg-[#07090E] border border-[#1E2638] text-[11px] font-mono text-cyan-300">
                    "{node.lastOutput}"
                  </div>
                )}

                <div className="pt-2 border-t border-[#1E2638] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {node.latencyMs}ms
                  </span>
                  <span className="flex items-center gap-1 text-amber-300">
                    <Zap className="w-3 h-3 text-amber-400" />
                    {node.tokensUsed} tokens
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {inspectNode && (
        <AgentInspectorModal node={inspectNode} onClose={() => setInspectNode(null)} />
      )}
    </div>
  );
};
