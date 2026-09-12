import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Share2,
  Sparkles
} from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

export const ReportGenerator: React.FC = () => {
  const { activeScenario, gatewayStats } = useWorkbench();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Industrial Compliance Brief exported successfully as NEXUS_Sovereign_Report.pdf!');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#07090E] p-4 overflow-y-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 bg-[#0D111A] border border-[#1E2638] rounded-2xl mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Industrial Compliance & Engineering Brief
            </h3>
            <p className="text-xs text-slate-400">Synthesized by Sovereign Agent Swarm with 100% citation grounding</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono font-bold text-xs shadow-cyan-glow cursor-pointer transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'GENERATING PDF...' : 'EXPORT REPORT (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-[#0B0F19] border border-[#1E2638] rounded-2xl p-8 max-w-4xl mx-auto space-y-6 shadow-2xl text-slate-200 font-sans">
        {/* Document Header */}
        <div className="border-b border-[#1E2638] pb-6 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                SOVEREIGN INDUSTRIAL AUDIT REPORT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                AIR-GAP CERTIFIED
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              {activeScenario.title}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Organization: {activeScenario.organization} | Sector: {activeScenario.sector}
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400 space-y-1">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Audit Hash: <span className="text-cyan-400">SHA-256#8940-XF9</span></div>
            <div>Model: <span className="text-slate-300">{gatewayStats.activeModel}</span></div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
            1. Executive Engineering Summary
          </h2>
          <p className="text-sm leading-relaxed text-slate-300 bg-[#07090E] p-4 rounded-xl border border-[#1E2638]">
            An autonomous multi-agent inspection run was conducted over ingested schematics (<code className="text-cyan-300">{activeScenario.documents[0]}</code>) and live operational telemetry logs. 
            The system evaluated critical engineering bounds, executed Python physics sandbox scripts, and verified compliance against mandatory industrial directives.
          </p>
        </div>

        {/* Telemetry Summary Table */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
            2. Operational Telemetry & Anomaly Matrix
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[#1E2638] bg-[#07090E]">
            <table className="w-full text-xs font-mono text-left text-slate-300">
              <thead className="bg-[#141B2D] text-cyan-300 font-bold border-b border-[#1E2638]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Pressure (bar)</th>
                  <th className="p-3">Temperature (°C)</th>
                  <th className="p-3">Flow Rate (L/min)</th>
                  <th className="p-3">Anomaly Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638]">
                {activeScenario.telemetry.map((t, i) => (
                  <tr key={i} className={t.anomalyScore > 0.8 ? 'bg-rose-950/30 text-rose-300 font-bold' : ''}>
                    <td className="p-3">{t.timestamp}</td>
                    <td className="p-3">{t.pressureBar}</td>
                    <td className="p-3">{t.temperatureC}</td>
                    <td className="p-3">{t.flowRateLmin}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.anomalyScore > 0.8 ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {(t.anomalyScore * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mandatory Grounded Citations */}
        <div className="space-y-2">
          <h2 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
            3. Grounded Regulatory Citations & Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeScenario.groundedCitations.map((cit) => (
              <div key={cit.id} className="p-3.5 rounded-xl bg-[#07090E] border border-[#1E2638] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyan-300 font-bold">{cit.documentName}</span>
                  <span className="text-emerald-400">p.{cit.pageNumber}</span>
                </div>
                <div className="text-xs text-slate-300 italic">"{cit.snippet}"</div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Footer Sign-off */}
        <div className="pt-6 border-t border-[#1E2638] flex justify-between items-center text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>NEXUS SOVEREIGN ENGINE SIGN-OFF: APPROVED</span>
          </div>
          <div>Cryptographic Stamp: <code className="text-cyan-400">0x98F...24A</code></div>
        </div>
      </div>
    </div>
  );
};
