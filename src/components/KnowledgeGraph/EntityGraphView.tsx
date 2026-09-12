import React, { useState } from 'react';
import { Network, Database, ShieldAlert, Cpu, Layers, Activity } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { KnowledgeNode } from '../../types/workbench';

export const EntityGraphView: React.FC = () => {
  const { knowledgeNodes, knowledgeEdges } = useWorkbench();
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(knowledgeNodes[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredNodes = filterCategory === 'ALL' 
    ? knowledgeNodes 
    : knowledgeNodes.filter(n => n.category === filterCategory);

  return (
    <div className="flex flex-col h-full bg-[#07090E] p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Enterprise Asset Knowledge Graph & Entity Matrix</span>
          </h2>
          <p className="text-xs text-slate-400">Semantic graph connecting physical assets, telemetry sensors, API 510 regulations, and calculated metrics.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#0D111A] p-1.5 rounded-xl border border-[#1E2638] text-xs font-mono">
          {['ALL', 'ASSET', 'REGULATION', 'SENSOR', 'METRIC'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Graph & Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Visual Graph Viewport */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-cyan-500/30 relative min-h-[420px] flex items-center justify-center cyber-grid-bg">
          {/* SVG Edge Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-cyan-500/30 stroke-2">
            {knowledgeEdges.map((edge) => {
              const src = knowledgeNodes.find(n => n.id === edge.source);
              const tgt = knowledgeNodes.find(n => n.id === edge.target);
              if (!src || !tgt) return null;
              return (
                <g key={edge.id}>
                  <line x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y} strokeDasharray="6 3" className="animate-pulse" />
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 - 8}
                    fill="#94A3B8"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.relation}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Knowledge Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-xl border transition-all cursor-pointer select-none space-y-1 ${
                  isSelected
                    ? 'bg-cyan-950 border-cyan-400 shadow-cyan-glow scale-110 z-30'
                    : node.category === 'ASSET'
                    ? 'bg-[#0E1726] border-cyan-500/50'
                    : node.category === 'REGULATION'
                    ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                    : node.category === 'SENSOR'
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                    : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-white">{node.label}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{node.category}</div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Details Inspector Panel */}
        <div className="glass-panel rounded-2xl p-5 border border-[#1E2638] space-y-4 font-mono text-xs">
          <div className="border-b border-[#1E2638] pb-3">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              ENTITY NODE INSPECTOR
            </span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">
              {selectedNode ? selectedNode.label : 'Select a Knowledge Node'}
            </h3>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#07090E] border border-[#1E2638] space-y-1">
                <span className="text-slate-400">Category:</span>
                <div className="font-bold text-cyan-300">{selectedNode.category}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#07090E] border border-[#1E2638] space-y-1">
                <span className="text-slate-400">Entity Description:</span>
                <div className="text-slate-200 leading-relaxed font-sans">{selectedNode.details}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#07090E] border border-[#1E2638] space-y-2">
                <span className="text-slate-400">Connected Graph Relations:</span>
                <div className="space-y-1">
                  {knowledgeEdges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(e => (
                      <div key={e.id} className="text-[11px] text-cyan-400">
                        {e.source === selectedNode.id ? `──[${e.relation}]──>` : `<──[${e.relation}]──`} {e.target === selectedNode.id ? e.source : e.target}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500">Click any knowledge graph node to inspect relationships.</p>
          )}
        </div>
      </div>
    </div>
  );
};
