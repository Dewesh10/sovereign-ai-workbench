import React, { useState } from 'react';
import { Shield, ShieldAlert, Lock, Cpu, HardDrive, Terminal, CheckCircle2, AlertTriangle, Key, Zap } from 'lucide-react';

export const AgentSandboxManager: React.FC = () => {
  const [elevatedMode, setElevatedMode] = useState<boolean>(false);
  const [activeScopes, setActiveScopes] = useState<string[]>([
    'scope:read_schematic',
    'scope:execute_math',
    'scope:fs_temp_only',
    'scope:no_net_egress',
    'scope:crypto_sign'
  ]);

  const [syscallLogs] = useState([
    { id: 1, time: '14:35:02', syscall: 'sys_read', target: '/schematics/p_and_id_01.svg', status: 'ALLOWED', scope: 'scope:read_schematic' },
    { id: 2, time: '14:35:04', syscall: 'sys_connect', target: 'api.cloud.com:443', status: 'INTERCEPTED & BLOCKED', scope: 'scope:no_net_egress' },
    { id: 3, time: '14:35:05', syscall: 'sys_execve', target: 'python mawp_calculator.py', status: 'ALLOWED (CONTAINED)', scope: 'scope:execute_math' },
    { id: 4, time: '14:35:08', syscall: 'sys_write', target: '/etc/shadow', status: 'BLOCKED (EACCES)', scope: 'scope:fs_temp_only' }
  ]);

  const toggleElevatedToken = () => {
    if (elevatedMode) {
      setElevatedMode(false);
      setActiveScopes(prev => prev.filter(s => s !== 'scope:elevated_operator'));
    } else {
      setElevatedMode(true);
      setActiveScopes(prev => [...prev, 'scope:elevated_operator']);
    }
  };

  return (
    <div className="bg-[#0b0f17] border border-cyan-500/30 rounded-xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
              Capability-Based Agent Sandbox Policy Manager
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                CONTAINED SECCOMP BPF
              </span>
            </h3>
            <p className="text-xs text-gray-400 font-mono">Fine-grained permission scopes & real-time syscall isolation kernel</p>
          </div>
        </div>

        {/* Elevated Permission Toggle */}
        <button
          onClick={toggleElevatedToken}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
            elevatedMode
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-slate-800 border-slate-700 text-gray-300 hover:border-slate-500'
          }`}
        >
          <Key size={16} className={elevatedMode ? 'text-amber-400 animate-pulse' : ''} />
          {elevatedMode ? 'Capability Token: ELEVATED OPERATOR' : 'Request Token Elevation'}
        </button>
      </div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Memory Limit */}
        <div className="bg-[#07090e] border border-slate-800 p-4 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400">
            <HardDrive size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Sandbox VRAM Limit</span>
            <div className="text-sm font-bold font-mono text-white">256 MB (Cgroups v2)</div>
          </div>
        </div>

        {/* CPU Limit */}
        <div className="bg-[#07090e] border border-slate-800 p-4 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
            <Cpu size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Process CPU Hard Limit</span>
            <div className="text-sm font-bold font-mono text-white">2.0s Max Timeout</div>
          </div>
        </div>

        {/* Air Gap Status */}
        <div className="bg-[#07090e] border border-slate-800 p-4 rounded-lg flex items-center gap-3">
          <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
            <Shield size={20} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Socket Egress Rules</span>
            <div className="text-sm font-bold font-mono text-indigo-300">0 Outbound Sockets</div>
          </div>
        </div>
      </div>

      {/* Active Permission Scopes Badge List */}
      <div>
        <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase mb-3 flex items-center gap-2">
          <Zap size={14} className="text-cyan-400" />
          Active Capability Scopes Assigned to Agent Swarm
        </h4>
        <div className="flex flex-wrap gap-2">
          {activeScopes.map((scope) => (
            <div
              key={scope}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border ${
                scope === 'scope:elevated_operator'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-200'
              }`}
            >
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>{scope}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Syscall Intercept Log Feed */}
      <div>
        <h4 className="text-xs font-mono font-bold text-slate-300 uppercase mb-3 flex items-center gap-2">
          <Terminal size={14} className="text-cyan-400" />
          Real-Time Sandbox Syscall Intercept Audit Stream
        </h4>
        <div className="bg-black/60 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
          {syscallLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between border-b border-slate-900 pb-1.5 last:border-0 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{log.time}</span>
                <span className="text-cyan-300 font-bold">{log.syscall}</span>
                <span className="text-gray-400">({log.target})</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                log.status.includes('BLOCKED') || log.status.includes('INTERCEPTED')
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
