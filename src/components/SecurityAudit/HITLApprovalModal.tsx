import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Key, Lock } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { HITLAction } from '../../types/workbench';

export const HITLApprovalModal: React.FC<{ action: HITLAction; onClose: () => void }> = ({ action, onClose }) => {
  const { approveHITLAction, rejectHITLAction } = useWorkbench();
  const [operatorPin, setOperatorPin] = useState('');

  const handleApprove = () => {
    approveHITLAction(action.id);
    onClose();
  };

  const handleReject = () => {
    rejectHITLAction(action.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D111A] border border-rose-500/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl shadow-rose-950/50 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-sm font-bold">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>CRITICAL HITL APPROVAL GATE</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white">
            RISK: {action.riskLevel}
          </span>
        </div>

        <div className="space-y-3 font-sans">
          <h3 className="font-bold text-white text-base font-mono">
            {action.actionTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-[#07090E] p-3 rounded-xl border border-[#1E2638]">
            {action.description}
          </p>

          <div className="p-3 rounded-xl bg-[#141B2D] border border-[#2A364F] space-y-1 font-mono text-xs">
            <div className="text-slate-400">Requested By: <span className="text-cyan-300 font-bold">{action.requestedByAgent}</span></div>
            <div className="text-slate-400">Timestamp: <span className="text-slate-200">{action.timestamp}</span></div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Operator Cryptographic PIN Signature</span>
            </label>
            <input
              type="password"
              value={operatorPin}
              onChange={(e) => setOperatorPin(e.target.value)}
              placeholder="Enter Operator Signature PIN (e.g. 8940)"
              className="w-full bg-[#07090E] text-xs font-mono text-cyan-300 px-3 py-2 rounded-xl border border-[#1E2638] focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReject}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-all cursor-pointer"
          >
            REJECT ACTION
          </button>
          <button
            onClick={handleApprove}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-mono text-xs font-extrabold shadow-rose-950 transition-all cursor-pointer"
          >
            SIGN & APPROVE CRYPTOGRAPHICALLY
          </button>
        </div>
      </div>
    </div>
  );
};
