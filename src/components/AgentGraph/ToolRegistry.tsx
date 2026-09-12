import React from 'react';
import { Terminal, Eye, Database, ShieldAlert, Wrench, CheckCircle } from 'lucide-react';

export const ToolRegistry: React.FC = () => {
  const tools = [
    {
      name: 'python_execution_sandbox',
      category: 'Mathematical Physics Engine',
      icon: Terminal,
      description: 'Executes Python code safely in isolated memory kernel to calculate ASME MAWP, IEEE thermal aging, and hoop stress formulas.',
      status: 'Sandboxed & Active',
      executions: 142
    },
    {
      name: 'multimodal_ocr_parse',
      category: 'Spatial Blueprint Vision',
      icon: Eye,
      description: 'Extracts spatial coordinates, bounding box regions, and P&ID component labels from engineering PDFs.',
      status: 'Active',
      executions: 389
    },
    {
      name: 'hybrid_vector_rag',
      category: 'Air-Gap Grounding Matrix',
      icon: Database,
      description: 'Hybrid dense semantic + sparse BM25 keyword search returning page-level citations with zero cloud egress.',
      status: 'Active',
      executions: 812
    },
    {
      name: 'compliance_guardrail_gate',
      category: 'Safety & Governance',
      icon: ShieldAlert,
      description: 'Intercepts high-risk operations and enforces Human-in-the-Loop cryptographic operator approval.',
      status: 'Enforced',
      executions: 45
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-400" />
          <span>Registered Agent Tool Capabilities</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <div key={idx} className="p-4 rounded-xl glass-panel border border-[#1E2638] space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-cyan-300">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{tool.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {tool.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {tool.description}
              </p>
              <div className="pt-2 border-t border-[#1E2638] text-[11px] font-mono text-slate-400 flex justify-between">
                <span>Category: {tool.category}</span>
                <span className="text-slate-300">{tool.executions} Total Runs</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
