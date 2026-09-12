import React, { useEffect, useRef, useState } from 'react';
import { Globe, MapPin, Radio, ShieldCheck, Zap } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

export const Interactive3DGlobe: React.FC = () => {
  const { activeScenario, selectScenario } = useWorkbench();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const locations = [
    { id: 'mrpl-offshore', name: 'MRPL Offshore Platform Charlie', sector: 'Oil & Gas', lat: 12.91, lng: 74.85, coords: '12.9141° N, 74.8560° E' },
    { id: 'ntpc-substation', name: 'NTPC Kanpur 400kV Substation', sector: 'Energy Grid', lat: 26.44, lng: 80.33, coords: '26.4499° N, 80.3319° E' },
    { id: 'isro-defense', name: 'ISRO Satish Dhawan Launch Complex', sector: 'Defense Aerospace', lat: 13.71, lng: 80.23, coords: '13.7199° N, 80.2304° E' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotation = 0;
    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 130;

      // Outer Atmosphere Glow Ring
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.25);
      glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
      glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Main Globe Sphere
      const sphereGrad = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, 10, centerX, centerY, radius);
      sphereGrad.addColorStop(0, '#101B2E');
      sphereGrad.addColorStop(0.7, '#0B111D');
      sphereGrad.addColorStop(1, '#05080E');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw Lat/Long Grid Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = -60; i <= 60; i += 30) {
        ctx.beginPath();
        const rad = (i * Math.PI) / 180;
        const rHeight = Math.cos(rad) * radius;
        const yOffset = Math.sin(rad) * radius;
        ctx.ellipse(centerX, centerY + yOffset * 0.4, radius * Math.cos(rad * 0.5), rHeight * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Animated Satellite Orbit Ring
      rotation += 0.008;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 1.35, radius * 0.55, rotation * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellite Icon Moving along orbit
      const satAngle = rotation * 1.5;
      const satX = centerX + Math.cos(satAngle) * radius * 1.35;
      const satY = centerY + Math.sin(satAngle) * radius * 0.55;
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(satX, satY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw Facility GPS Pins on Globe Surface
      locations.forEach((loc, idx) => {
        const isSelected = activeScenario.id === loc.id;
        const angle = (idx * (Math.PI * 2 / 3)) + rotation;
        const pinX = centerX + Math.cos(angle) * (radius * 0.75);
        const pinY = centerY + Math.sin(angle) * (radius * 0.6);

        // Pulsing Ring
        ctx.strokeStyle = isSelected ? '#00F0FF' : '#F59E0B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pinX, pinY, isSelected ? 8 : 5, 0, Math.PI * 2);
        ctx.stroke();

        // Pin Core
        ctx.fillStyle = isSelected ? '#00F0FF' : '#F59E0B';
        ctx.beginPath();
        ctx.arc(pinX, pinY, isSelected ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = '10px monospace';
        ctx.fillStyle = isSelected ? '#00F0FF' : '#94A3B8';
        ctx.fillText(loc.name.split(' ')[0], pinX + 10, pinY + 3);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeScenario]);

  return (
    <div className="p-5 rounded-2xl glass-panel-glow border border-cyan-500/30 space-y-4 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              GIS SATELLITE RADAR & FACILITY MAP
            </span>
          </div>
          <h3 className="font-bold text-white text-base font-mono mt-0.5">
            Sovereign Industrial Installation Radar
          </h3>
        </div>

        <div className="px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ISRO / NAVIC ORBIT SYNCED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* 3D Canvas Globe Viewport */}
        <div className="lg:col-span-2 flex items-center justify-center relative bg-[#07090E] rounded-xl p-4 border border-[#1E2638] cyber-grid-bg">
          <canvas ref={canvasRef} width={460} height={320} className="cursor-pointer" />
        </div>

        {/* Facility Location Selector Cards */}
        <div className="space-y-3 font-mono text-xs">
          <span className="text-slate-400 uppercase font-bold text-[11px]">Select Target Facility:</span>

          {locations.map((loc) => {
            const isSelected = activeScenario.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => selectScenario(loc.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-cyan-glow'
                    : 'bg-[#0D111A] border-[#1E2638] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex justify-between items-center font-bold">
                  <span className="flex items-center gap-1.5 text-white">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-amber-400'}`} />
                    {loc.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300">
                    {loc.sector}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">{loc.coords}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
