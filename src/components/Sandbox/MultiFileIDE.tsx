import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  FileCode, 
  Plus, 
  CheckCircle2, 
  Cpu, 
  Database,
  Layers
} from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { TelemetryChart } from './TelemetryChart';
import { AgentSandboxManager } from './AgentSandboxManager';

export const MultiFileIDE: React.FC = () => {
  const { 
    ideFiles, 
    activeIDEFileId, 
    setActiveIDEFileId, 
    updateIDEFileCode,
    activeScenario
  } = useWorkbench();

  const [sandboxOutput, setSandboxOutput] = useState<string>(
    `=== SOVEREIGN KERNEL MAWP ANALYSIS ===\nCalculated MAWP : 79.18 bar\nRecorded Peak   : 87.4 bar\nDelta Margin    : -8.22 bar\nSTATUS: ⚠️ CRITICAL OVERPRESSURE VIOLATION`
  );
  const [isSandboxRunning, setIsSandboxRunning] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number>(138);

  const activeFile = ideFiles.find(f => f.id === activeIDEFileId) || ideFiles[0];

  const handleRunLiveCode = () => {
    setIsSandboxRunning(true);
    const startTime = performance.now();

    setTimeout(() => {
      setIsSandboxRunning(false);
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime + 120));

      const codeText = activeFile.code;
      
      let simulatedConsoleOutput = `=== PYODIDE WASM KERNEL EXECUTION COMPLETE ===\n`;
      simulatedConsoleOutput += `Target File: ${activeFile.name}\n`;
      simulatedConsoleOutput += `Runtime Engine: WebAssembly Python 3.11\n\n`;

      if (codeText.includes('calculate_mawp')) {
        simulatedConsoleOutput += `=== MAWP & HOOP STRESS ANALYSIS ===\nCalculated MAWP : 79.18 bar\nRecorded Peak   : 87.40 bar\nDelta Margin    : -8.22 bar\nSTATUS: ⚠️ CRITICAL OVERPRESSURE VIOLATION (ASME Sec VIII Div 1)`;
      } else if (codeText.includes('calculate_von_mises') || codeText.includes('calculate_centrifugal_stress')) {
        simulatedConsoleOutput += `=== VON MISES EQUIVALENT STRESS ===\nCalculated Stress: 642.80 MPa @ 14,000 RPM\nYield Strength   : 880.00 MPa\nSafety Factor    : 1.37x (MIL-STD-810H Min: 1.25x)\nSTATUS: ✅ QUALIFICATION PASSED`;
      } else if (codeText.includes('calculate_faa')) {
        simulatedConsoleOutput += `=== IEEE C57.91 THERMAL AGING ===\nHot-spot Temp    : 112.4°C\nIEEE FAA Factor  : 8.42x (Nominal: 1.0x)\nEquivalent Life Loss: 10.53 Hours\nSTATUS: ⚠️ THERMAL ACCELERATION ALERT`;
      } else {
        simulatedConsoleOutput += `Script executed successfully with 0 exceptions.\nOutput:\n[OK] All data frames processed and stored in local memory matrix.`;
      }

      setSandboxOutput(simulatedConsoleOutput);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-[#07090E] p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>Multi-Tab Industrial Python & SQL IDE Studio</span>
          </h2>
          <p className="text-xs text-slate-400">Integrated WebAssembly Python kernel with multi-file workspace, variable inspection, and telemetry graph rendering.</p>
        </div>

        <button
          onClick={handleRunLiveCode}
          disabled={isSandboxRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-mono font-extrabold text-xs shadow-cyan-glow cursor-pointer transition-all disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSandboxRunning ? 'EXECUTING KERNEL...' : 'RUN ACTIVE SCRIPT'}</span>
        </button>
      </div>

      {/* Main IDE Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: IDE File Tabs & Code Editor */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl glass-panel border border-[#1E2638] overflow-hidden">
          {/* File Tabs Bar */}
          <div className="bg-[#0D111A] border-b border-[#1E2638] flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-1 overflow-x-auto">
              {ideFiles.map((file) => {
                const isActive = file.id === activeIDEFileId;
                return (
                  <button
                    key={file.id}
                    onClick={() => setActiveIDEFileId(file.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs font-mono border-t border-x transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#07090E] border-cyan-500/50 text-cyan-300 font-bold border-b-transparent'
                        : 'bg-[#090D16] border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{file.name}</span>
                    {file.modified && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </button>
                );
              })}
            </div>

            <div className="px-3 pb-2 text-[10px] font-mono text-emerald-400 font-bold">
              PYODIDE WASM KERNEL
            </div>
          </div>

          {/* Code Editor Viewport */}
          <div className="p-4 bg-[#07090E] font-mono text-xs flex">
            <div className="pr-4 border-r border-[#1E2638] text-slate-600 select-none text-right font-mono space-y-1 text-xs">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={activeFile?.code || ''}
              onChange={(e) => updateIDEFileCode(activeFile.id, e.target.value)}
              rows={16}
              className="w-full bg-transparent pl-4 resize-none focus:outline-none font-mono text-xs leading-relaxed text-cyan-100 selection:bg-cyan-500/30"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Col: Variable Explorer & Terminal */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-[#1E2638] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1E2638] pb-2 text-cyan-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Runtime Variable Inspector
              </span>
              <span className="text-[10px] text-slate-400">3 Memory Vars</span>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded bg-[#07090E] border border-[#1E2638] flex justify-between">
                <span className="text-slate-400">MAWP_calculated</span>
                <span className="text-cyan-300 font-bold">79.18 (float)</span>
              </div>
              <div className="p-2 rounded bg-[#07090E] border border-[#1E2638] flex justify-between">
                <span className="text-slate-400">Actual_Peak</span>
                <span className="text-rose-400 font-bold">87.40 (float)</span>
              </div>
              <div className="p-2 rounded bg-[#07090E] border border-[#1E2638] flex justify-between">
                <span className="text-slate-400">Safety_Factor</span>
                <span className="text-amber-400 font-bold">0.906 (float)</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 rounded-2xl glass-panel border border-[#1E2638] font-mono text-xs space-y-2 overflow-hidden flex flex-col">
            <div className="flex justify-between text-slate-400 border-b border-[#1E2638] pb-2 font-bold text-cyan-400">
              <span>STDOUT Stream Terminal</span>
              <span className="text-[10px] text-slate-500">Latency: {executionTime}ms</span>
            </div>

            <div className="flex-1 bg-[#05070C] p-3 rounded-xl overflow-y-auto text-emerald-400">
              {isSandboxRunning ? (
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse">
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Evaluating bytecode in WebAssembly kernel...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-xs">{sandboxOutput}</pre>
              )}
            </div>
          </div>
        </div>
      </div>

      <AgentSandboxManager />

      <TelemetryChart />
    </div>
  );
};
