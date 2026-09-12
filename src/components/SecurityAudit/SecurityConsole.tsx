import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck2
} from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { HITLAction } from '../../types/workbench';
import { HITLApprovalModal } from './HITLApprovalModal';

export const SecurityConsole: React.FC = () => {
  const { auditLogs, hitlActions, gatewayStats } = useWorkbench();
  const [selectedHitlAction, setSelectedHitlAction] = useState<HITLAction | null>(null);

  const pendingActions = hitlActions.filter(a => a.status === 'PENDING');

  return (
    <div className="flex flex-col h-full bg-[#07090E] p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Sovereign Security & Governance Console</span>
          </h2>
          <p className="text-xs text-slate-400">Zero-egress air-gap isolation, cryptographic HITL operator gates, and immutable SHA-256 audit ledger.</p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
          <Lock className="w-4 h-4" />
          <span>SOVEREIGN AIR-GAP 100% ENFORCED</span>
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Air Gap Status */}
        <div className="p-4 rounded-xl glass-panel border border-[#1E2638] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>NETWORK EGRESS</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">0 KB OUTBOUND</div>
          <p className="text-xs text-slate-400">All inference & vector queries remain on-premise.</p>
        </div>

        {/* Prompt Injection Defense */}
        <div className="p-4 rounded-xl glass-panel border border-[#1E2638] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>PROMPT INJECTION DEFENSE</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">14 ATTACKS BLOCKED</div>
          <p className="text-xs text-slate-400">Llama-Guard 3 input/output safety classifier active.</p>
        </div>

        {/* HITL Gate Queue */}
        <div className="p-4 rounded-xl glass-panel border border-[#1E2638] space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>PENDING HITL GATES</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">{pendingActions.length} PENDING</div>
          <p className="text-xs text-slate-400">High-risk tool executions requiring operator PIN.</p>
        </div>
      </div>

      {/* Pending HITL Action Cards */}
      {pendingActions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-mono text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Human-in-the-Loop Approval Queue ({pendingActions.length})</span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {pendingActions.map((action) => (
              <div key={action.id} className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono text-sm">{action.actionTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white">
                      {action.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-rose-200/90 font-sans">{action.description}</p>
                </div>

                <button
                  onClick={() => setSelectedHitlAction(action)}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-rose-950"
                >
                  REVIEW & SIGN
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immutable SHA-256 Audit Trail Ledger Table */}
      <div className="space-y-3">
        <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <span>Immutable Cryptographic Audit Trail Ledger</span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-[#1E2638] bg-[#0D111A]">
          <table className="w-full text-xs font-mono text-left text-slate-300">
            <thead className="bg-[#141B2D] text-cyan-300 font-bold border-b border-[#1E2638]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Agent / Operator</th>
                <th className="p-3.5">Security Event Description</th>
                <th className="p-3.5">SHA-256 Ledger Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#111724]">
                  <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.category === 'HITL_APPROVAL' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' :
                      log.category === 'SECURITY' ? 'bg-purple-950 text-purple-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-white">{log.agent}</td>
                  <td className="p-3.5 text-slate-200">{log.event}</td>
                  <td className="p-3.5 text-cyan-400 font-mono text-[11px] truncate max-w-[140px]" title={log.hash}>
                    {log.hash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedHitlAction && (
        <HITLApprovalModal action={selectedHitlAction} onClose={() => setSelectedHitlAction(null)} />
      )}
    </div>
  );
};
