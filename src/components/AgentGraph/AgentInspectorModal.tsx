import React, { useState } from 'react';
import { X, Sliders, Cpu, Save, Terminal, ShieldAlert } from 'lucide-react';
import { AgentNode } from '../../types/workbench';
import { useWorkbench } from '../../context/WorkbenchContext';

export const AgentInspectorModal: React.FC<{ node: AgentNode; onClose: () => void }> = ({ node, onClose }) => {
  const { setAgentNodes } = useWorkbench();
  
  const [temperature, setTemperature] = useState(node.hyperparameters?.temperature ?? 0.1);
  const [topP, setTopP] = useState(node.hyperparameters?.topP ?? 0.95);
  const [contextWindow, setContextWindow] = useState(node.hyperparameters?.contextWindow ?? 32768);
  const [systemPrompt, setSystemPrompt] = useState(node.hyperparameters?.systemPrompt ?? `System orchestrator role for ${node.name}`);

  const handleSave = () => {
    setAgentNodes(prev => prev.map(n => n.id === node.id ? {
      ...n,
      hyperparameters: {
        temperature,
        topP,
        maxTokens: 4096,
        contextWindow,
        systemPrompt,
        allowedTools: node.hyperparameters?.allowedTools || ['all']
      }
    } : n));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0D111A] border border-cyan-500/50 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-200 font-sans">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-lg font-mono">
              Agent Config: {node.name}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {/* Temperature Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Sampling Temperature:</span>
              <span className="text-cyan-300 font-bold">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Top-P Slider */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Top-P Nucleus Sampling:</span>
              <span className="text-cyan-300 font-bold">{topP}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Context Window */}
          <div className="space-y-1">
            <span>Context Window Size:</span>
            <select
              value={contextWindow}
              onChange={(e) => setContextWindow(parseInt(e.target.value))}
              className="w-full bg-[#07090E] text-cyan-300 p-2 rounded-xl border border-[#1E2638] cursor-pointer"
            >
              <option value={16384}>16,384 Tokens (Standard)</option>
              <option value={32768}>32,768 Tokens (Extended RAG)</option>
              <option value={65536}>65,536 Tokens (Multimodal Deep Context)</option>
              <option value={131072}>131,072 Tokens (Full Sovereign Document)</option>
            </select>
          </div>

          {/* System Prompt Override */}
          <div className="space-y-1">
            <span>Agent System Prompt Directive:</span>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full bg-[#07090E] text-slate-200 p-3 rounded-xl border border-[#1E2638] focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold cursor-pointer">
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-mono font-bold text-xs shadow-cyan-glow cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>SAVE HYPERPARAMETERS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
