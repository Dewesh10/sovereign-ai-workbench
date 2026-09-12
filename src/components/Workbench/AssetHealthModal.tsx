import React from 'react';
import { X, ShieldAlert, CheckCircle2, Activity, Calendar, Wrench, FileText, AlertTriangle } from 'lucide-react';
import { AssetHealthSpec } from '../../types/workbench';

export const AssetHealthModal: React.FC<{ asset: AssetHealthSpec; onClose: () => void }> = ({ asset, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D111A] border border-cyan-500/50 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-200 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-cyan-400 border border-slate-700">
                {asset.type}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                asset.status === 'CRITICAL_ALERT' ? 'bg-rose-950 text-rose-400 border border-rose-500/40' : 'bg-emerald-950 text-emerald-400'
              }`}>
                STATUS: {asset.status}
              </span>
            </div>
            <h3 className="font-extrabold text-white text-xl font-mono">
              {asset.name}
            </h3>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#07090E] border border-[#1E2638] space-y-1">
            <span className="text-slate-400">Pressure Load:</span>
            <div className="text-base font-bold text-rose-400">{asset.currentPressureBar} / {asset.pressureRatingBar} bar</div>
            <span className="text-[10px] text-rose-300">+16.5% Over Limit</span>
          </div>

          <div className="p-3 rounded-xl bg-[#07090E] border border-[#1E2638] space-y-1">
            <span className="text-slate-400">Core Temp & Vibration:</span>
            <div className="text-base font-bold text-amber-300">{asset.temperatureC}°C | {asset.vibrationMms} mm/s</div>
            <span className="text-[10px] text-amber-400">Vibration Warning</span>
          </div>

          <div className="p-3 rounded-xl bg-[#07090E] border border-[#1E2638] space-y-1">
            <span className="text-slate-400">Compliance Score:</span>
            <div className="text-base font-bold text-purple-300">{asset.complianceScore}%</div>
            <span className="text-[10px] text-purple-400">API 510 Standard</span>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="p-4 rounded-xl bg-[#141B2D] border border-[#2A364F] space-y-2 text-xs font-mono">
          <div className="grid grid-cols-2 gap-2">
            <div>Manufacturer: <strong className="text-white">{asset.manufacturer}</strong></div>
            <div>Serial No: <strong className="text-cyan-300">{asset.serialNumber}</strong></div>
            <div>Last Scan Date: <strong className="text-slate-300">{asset.lastInspectionDate}</strong></div>
            <div>Next Inspection: <strong className="text-rose-400">{asset.nextInspectionDue}</strong></div>
          </div>
        </div>

        {/* Maintenance History */}
        <div className="space-y-2">
          <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wrench className="w-4 h-4" />
            <span>Inspection & Ultrasonic Scan Log</span>
          </h4>
          <div className="overflow-x-auto rounded-xl border border-[#1E2638] bg-[#07090E]">
            <table className="w-full text-xs font-mono text-left text-slate-300">
              <thead className="bg-[#141B2D] text-cyan-300 font-bold border-b border-[#1E2638]">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Maintenance / Inspection Action</th>
                  <th className="p-2.5">Technician</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638]">
                {asset.maintenanceHistory.map((m, i) => (
                  <tr key={i}>
                    <td className="p-2.5 text-slate-400">{m.date}</td>
                    <td className="p-2.5 font-bold text-white">{m.action}</td>
                    <td className="p-2.5 text-cyan-300">{m.technician}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
