import React, { useEffect, useRef } from 'react';
import { Mic, Volume2, Radio } from 'lucide-react';

interface AudioWaveformVisualizerProps {
  isActive?: boolean;
  mode?: 'listening' | 'speaking' | 'idle';
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  isActive = true,
  mode = 'listening',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw background cyber grid lines
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Multiple Animated Sine Waves
      const waves = [
        { color: 'rgba(0, 242, 254, 0.8)', freq: 0.03, amp: mode === 'speaking' ? 25 : 12, speed: 0.08 },
        { color: 'rgba(16, 185, 129, 0.6)', freq: 0.02, amp: mode === 'speaking' ? 20 : 8, speed: -0.05 },
        { color: 'rgba(59, 130, 246, 0.5)', freq: 0.04, amp: mode === 'speaking' ? 15 : 6, speed: 0.1 },
      ];

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * wave.freq + phase * wave.speed) * wave.amp * (isActive ? 1 : 0.2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      phase += 0.5;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, mode]);

  return (
    <div className="flex items-center gap-3 bg-[#0b0f17] border border-cyan-500/20 px-3 py-1.5 rounded-lg shadow-inner">
      <div className="flex items-center gap-1.5">
        <Radio size={14} className="text-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-wide">
          {mode === 'listening' ? 'Acoustic Diagnostic Listener' : 'Voice Synthesis Outbound'}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={140}
        height={32}
        className="rounded bg-black/40 border border-slate-800"
      />

      <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        LIVE 44.1 kHz
      </div>
    </div>
  );
};
