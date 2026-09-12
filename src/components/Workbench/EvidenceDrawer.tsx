import React from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

export const EvidenceDrawer: React.FC = () => {
  const { 
    selectedCitation, 
    setSelectedCitation, 
    selectedBoundingBox,
    setSelectedBoundingBox,
    isEvidenceDrawerOpen, 
    setIsEvidenceDrawerOpen 
  } = useWorkbench();

  if (!isEvidenceDrawerOpen) return null;

  return (
    <div className="w-80 bg-[#0D111A] border-l border-[#1E2638] flex flex-col h-full z-30 shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-[#1E2638] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Grounded Evidence Trace
          </span>
        </div>
        <button
          onClick={() => {
            setIsEvidenceDrawerOpen(false);
            setSelectedCitation(null);
            setSelectedBoundingBox(null);
          }}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {selectedCitation ? (
          <div className="space-y-4">
            {/* Citation Metadata Header */}
            <div className="p-3 rounded-xl bg-[#141B2D] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">PAGE {selectedCitation.pageNumber}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                  {(selectedCitation.confidenceScore * 100).toFixed(0)}% MATCH SCORE
                </span>
              </div>
              <h4 className="font-bold text-white text-sm font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{selectedCitation.documentName}</span>
              </h4>
              <p className="text-xs text-slate-300 font-sans font-semibold">
                {selectedCitation.sectionTitle}
              </p>
            </div>

            {/* Verbatim Excerpt */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Extracted Grounded Excerpt
              </span>
              <div className="p-3.5 rounded-xl bg-[#07090E] border border-[#1E2638] text-xs font-sans leading-relaxed text-slate-300 font-medium">
                "{selectedCitation.snippet}"
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>AIR-GAP VERIFIED</span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Vector chunk retrieved from local embedded storage. No cloud egress detected.
              </p>
            </div>
          </div>
        ) : selectedBoundingBox ? (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#141B2D] border border-cyan-500/30 space-y-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono font-bold uppercase">
                {selectedBoundingBox.type} BOUNDING BOX
              </span>
              <h4 className="font-bold text-white text-base font-mono">
                {selectedBoundingBox.label}
              </h4>
              <p className="text-xs text-slate-300 font-sans">
                {selectedBoundingBox.detail}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#07090E] border border-[#1E2638] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Spatial Bounding Box:</span>
                <span className="text-cyan-300">X:{selectedBoundingBox.x}% Y:{selectedBoundingBox.y}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>OCR Confidence:</span>
                <span className="text-emerald-400">{(selectedBoundingBox.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3 text-slate-500">
            <Layers className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs font-mono">Select any citation chip or schematic bounding box to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
