import React, { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Quest, CATEGORIES } from '../types';
import { audioService } from '../services/audioService';

interface StatsTabProps {
  quests: Quest[];
  totalXP: number;
  level: number;
}

export const StatsTab: React.FC<StatsTabProps> = ({ quests, totalXP, level }) => {
  
  const chartData = useMemo(() => {
    // Initialize standard categories
    const stats: Record<string, number> = {};
    CATEGORIES.forEach(c => {
      if (c !== 'OTHER') stats[c] = 0;
    });
    stats['OTHER'] = 0; // Catch-all for custom ones

    // Aggregate XP
    quests.forEach(q => {
      const completionCount = Object.keys(q.history).length;
      // XP Calculation: 1 Minute = 1 XP
      const totalQuestXP = completionCount * q.duration;
      
      const isStandard = CATEGORIES.includes(q.category as any);
      const key = isStandard && q.category !== 'OTHER' ? q.category : 'OTHER';
      
      stats[key] = (stats[key] || 0) + totalQuestXP;
    });

    // Format for Recharts
    return Object.entries(stats).map(([subject, A]) => ({
      subject,
      A,
      fullMark: Math.max(...Object.values(stats), 100) * 1.2 // Dynamic scaling
    }));
  }, [quests]);

  return (
    <div className="p-4 space-y-8 bg-black">
      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-[#11d13b] p-4 text-center bg-black">
          <div className="text-sm opacity-70 mb-1">CURRENT LEVEL</div>
          <div className="text-5xl font-bold text-glow">{level}</div>
        </div>
        <div className="border-2 border-[#11d13b] p-4 text-center bg-black">
          <div className="text-sm opacity-70 mb-1">TOTAL XP</div>
          <div className="text-5xl font-bold text-glow">{totalXP}</div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="border border-[#11d13b] p-4 bg-black relative min-h-[400px]">
        <h3 className="absolute top-2 left-2 text-sm border-b border-[#11d13b]">S.P.E.C.I.A.L. STATUS</h3>
        <div className="h-[350px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#11d13b" strokeOpacity={0.3} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#11d13b', fontSize: 12, fontFamily: 'VT323' }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
              <Radar
                name="Stats"
                dataKey="A"
                stroke="#11d13b"
                strokeWidth={3}
                fill="#11d13b"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Nuclear Option */}
      <div className="border-t border-[#11d13b] pt-8 mt-12">
        <button
          onClick={() => {
            audioService.playClick();
            (window as any).resetStatus();
          }}
          className="w-full py-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-colors font-bold text-xl tracking-widest uppercase"
        >
          [ RESET OVERSEER STATUS ]
        </button>
        <p className="text-red-600 text-xs text-center mt-2 opacity-70">
          * WARNING: THIS ACTION WILL PERMANENTLY ERASE ALL PROGRESS.
        </p>
      </div>
    </div>
  );
};