import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  Layers, 
  FileCheck2,
  Info,
  MapPin,
  Ruler,
  Plus
} from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';
import { BoundingBox, PinAnnotation } from '../../types/workbench';
import { AssetHealthModal } from './AssetHealthModal';

export const BlueprintViewer: React.FC = () => {
  const { 
    activeScenario, 
    selectedBoundingBox, 
    setSelectedBoundingBox,
    selectedAssetHealth,
    setSelectedAssetHealth,
    setIsEvidenceDrawerOpen,
    pinAnnotations,
    addPinAnnotation
  } = useWorkbench();

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [hoveredBox, setHoveredBox] = useState<BoundingBox | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'pin' | 'ruler'>('select');

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1.0);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'pin') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      addPinAnnotation({
        x,
        y,
        label: 'Field Note Pin',
        note: `Inspection pin dropped at spatial X:${x}%, Y:${y}%`,
        author: 'Operator Dewesh'
      });
      setActiveTool('select');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#07090E] relative overflow-hidden">
      {/* Top Toolbar */}
      <div className="px-4 py-2.5 bg-[#0D111A] border-b border-[#1E2638] flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Multimodal Blueprint & P&ID Schematic Canvas
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Interactive Inspection Tools */}
          <div className="flex items-center gap-1 bg-[#141B2D] p-1 rounded-lg border border-[#2A364F] text-xs font-mono">
            <button
              onClick={() => setActiveTool('select')}
              className={`px-2 py-1 rounded cursor-pointer ${activeTool === 'select' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Inspect
            </button>
            <button
              onClick={() => setActiveTool('pin')}
              className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer ${activeTool === 'pin' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <MapPin className="w-3 h-3" />
              Pin Drop
            </button>
          </div>

          {/* Layer Toggle */}
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
              showBoundingBoxes 
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300' 
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Bounding Box Layer</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#141B2D] p-1 rounded-lg border border-[#2A364F] text-xs font-mono text-slate-300">
            <button onClick={handleZoomOut} className="p-1 hover:bg-slate-800 rounded cursor-pointer" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-cyan-300">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={handleZoomIn} className="p-1 hover:bg-slate-800 rounded cursor-pointer" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleResetZoom} className="p-1 hover:bg-slate-800 rounded ml-1 cursor-pointer" title="Reset Zoom">
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative cyber-grid-bg">
        <div 
          onClick={handleCanvasClick}
          className={`relative transition-transform duration-200 ease-out shadow-2xl rounded-xl overflow-hidden border border-[#1E2638] ${
            activeTool === 'pin' ? 'cursor-crosshair' : ''
          }`}
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Blueprint SVG Schematic Image */}
          <img
            src={activeScenario.blueprintImageUrl}
            alt={activeScenario.title}
            className="w-[800px] h-[500px] object-cover block select-none"
          />

          {/* Overlay Bounding Boxes */}
          {showBoundingBoxes && activeScenario.boundingBoxes.map((box) => {
            const isSelected = selectedBoundingBox?.id === box.id;
            const isHovered = hoveredBox?.id === box.id;

            return (
              <div
                key={box.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBoundingBox(box);
                  if (box.assetHealth) {
                    setSelectedAssetHealth(box.assetHealth);
                  }
                  setIsEvidenceDrawerOpen(true);
                }}
                onMouseEnter={() => setHoveredBox(box)}
                onMouseLeave={() => setHoveredBox(null)}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
                className={`absolute rounded transition-all cursor-pointer flex flex-col justify-between p-1.5 border-2 ${
                  box.type === 'violation'
                    ? 'border-rose-500 bg-rose-500/10 shadow-rose-950'
                    : box.type === 'valve'
                    ? 'border-amber-400 bg-amber-400/10'
                    : 'border-cyan-400 bg-cyan-400/10'
                } ${isSelected || isHovered ? 'ring-4 ring-cyan-400 scale-[1.02] z-30' : 'z-10'}`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded text-white ${
                    box.type === 'violation' ? 'bg-rose-600' : 'bg-slate-900/90 text-cyan-300'
                  }`}>
                    {box.label}
                  </span>
                  <span className="text-[9px] font-mono bg-slate-950/90 px-1 rounded text-emerald-400">
                    {(box.confidence * 100).toFixed(0)}% OCR
                  </span>
                </div>
              </div>
            );
          })}

          {/* Pin Drop Annotations */}
          {pinAnnotations.map((pin) => (
            <div
              key={pin.id}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-40 group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-cyan-glow animate-bounce">
                <MapPin className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-[#0D111A] border border-cyan-500 text-[11px] font-mono text-cyan-200 shadow-xl z-50">
                <div className="font-bold text-white">{pin.label}</div>
                <div>{pin.note}</div>
                <div className="text-[9px] text-slate-400 pt-1 border-t border-slate-800">{pin.author} • {pin.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Spatial Status Bar */}
      <div className="px-4 py-2 bg-[#0D111A] border-t border-[#1E2638] flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span>Ingested File: <strong className="text-slate-200">{activeScenario.documents[0]}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold">{pinAnnotations.length} Field Pins Active</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">Click any asset box to launch Asset Health Inspector</span>
        </div>
      </div>

      {selectedAssetHealth && (
        <AssetHealthModal asset={selectedAssetHealth} onClose={() => setSelectedAssetHealth(null)} />
      )}
    </div>
  );
};
