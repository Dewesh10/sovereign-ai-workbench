import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  FileUp, 
  GitFork, 
  Terminal, 
  ShieldCheck, 
  BarChart3,
  Network,
  Sparkles
} from 'lucide-react';
import { useWorkbench } from '../context/WorkbenchContext';
import { ActiveTab } from '../types/workbench';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, hitlActions } = useWorkbench();
  const pendingHitlCount = hitlActions.filter(a => a.status === 'PENDING').length;

  const menuItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'command', label: 'Command Center', icon: LayoutDashboard },
    { id: 'workbench', label: 'Live Workbench', icon: Bot },
    { id: 'ingestion', label: 'Document Pipeline', icon: FileUp },
    { id: 'agent-graph', label: 'Agent Topology', icon: GitFork },
    { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Network },
    { id: 'sandbox', label: 'Python & SQL IDE', icon: Terminal },
    { id: 'security', label: 'Security & Audit', icon: ShieldCheck, badge: pendingHitlCount },
    { id: 'quality', label: 'Quality & Benchmarks', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-[#05070B] border-r border-[#1A2234] flex flex-col justify-between p-3 select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase">
          System Modules
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 text-cyan-300 border border-cyan-500/40 font-semibold shadow-cyan-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0B0F17]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 rounded-xl bg-[#0B0F17] border border-[#1A2234] space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ENTERPRISE SOVEREIGN</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Built for confidential industrial operations with 100% air-gap evidence grounding.
        </p>
        <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-[#1A2234]">
          v2.4.0-Sovereign-Release
        </div>
      </div>
    </aside>
  );
};
