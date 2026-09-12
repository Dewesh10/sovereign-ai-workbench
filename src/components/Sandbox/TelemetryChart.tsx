import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { useWorkbench } from '../../context/WorkbenchContext';

export const TelemetryChart: React.FC = () => {
  const { activeScenario } = useWorkbench();

  return (
    <div className="p-4 rounded-2xl glass-panel border border-[#1E2638] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Live Telemetry Stream & Anomaly Degradation Curve
          </h3>
          <p className="text-xs text-slate-400">Ingested sensor feeds plotted against calculated design safety thresholds.</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeScenario.telemetry} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPressure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2638" />
            <XAxis dataKey="timestamp" stroke="#64748B" fontSize={11} fontFamily="monospace" />
            <YAxis stroke="#64748B" fontSize={11} fontFamily="monospace" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0D111A', borderColor: '#00F0FF', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace' }}
              itemStyle={{ color: '#F8FAFC' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
            <Area type="monotone" dataKey="pressureBar" name="Pressure (bar)" stroke="#00F0FF" fillOpacity={1} fill="url(#colorPressure)" />
            <Area type="monotone" dataKey="temperatureC" name="Temperature (°C)" stroke="#F59E0B" fillOpacity={1} fill="url(#colorTemp)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
