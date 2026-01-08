import React, { useMemo } from 'react';
import { Quest } from '../types';
import { audioService } from '../services/audioService';

interface TrackerTabProps {
  quests: Quest[];
  toggleHistory: (questId: string, date: string) => void;
}

export const TrackerTab: React.FC<TrackerTabProps> = ({ quests, toggleHistory }) => {
  // Generate current week dates (Mon-Sun)
  const weekDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const day = today.getDay(); 
    // Adjust to make Monday index 0 (Sunday is usually 0 in JS)
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    
    const monday = new Date(today.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const getDayStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const isToday = dateStr === todayStr;
    const isPast = date < new Date(new Date().setHours(0,0,0,0));
    const isFuture = date > new Date(new Date().setHours(23,59,59,999));

    return { dateStr, isToday, isPast, isFuture };
  };

  return (
    <div className="p-2 md:p-4 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr>
            <th className="p-2 border-b-2 border-[#11d13b] w-1/3">ROUTINE</th>
            {weekDates.map(date => {
              const { dateStr, isToday } = getDayStatus(date);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
              const dayNum = date.getDate();
              
              return (
                <th key={dateStr} className={`
                  p-2 text-center border-b-2 border-[#11d13b]
                  ${isToday ? 'border-t-2 bg-[#11d13b] bg-opacity-20 animate-pulse' : ''}
                `}>
                  <div className="text-lg md:text-xl font-bold">{dayName} {dayNum}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {quests.map(quest => (
            <tr key={quest.id} className="border-b border-[#11d13b] border-opacity-30 hover:bg-[#11d13b] hover:bg-opacity-5">
              <td className="p-3 font-bold truncate max-w-[150px]">
                {quest.name}
                <div className="text-[10px] opacity-60">{quest.duration} MINS</div>
              </td>
              {weekDates.map(date => {
                const { dateStr, isToday } = getDayStatus(date);
                const isCompleted = !!quest.history[dateStr];

                return (
                  <td key={dateStr} className="p-2 text-center">
                    <div className="flex justify-center">
                      <input 
                        type="checkbox"
                        checked={isCompleted}
                        disabled={!isToday} // Strict Temporal Locking
                        onChange={() => {
                          audioService.playClick();
                          if (!isCompleted) audioService.playSuccess();
                          toggleHistory(quest.id, dateStr);
                        }}
                        className={`
                          appearance-none border-2 border-[#11d13b] w-6 h-6 md:w-8 md:h-8
                          ${isCompleted ? 'bg-[#11d13b] shadow-[0_0_8px_#11d13b]' : 'bg-transparent'}
                          ${!isToday ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110 transition-transform'}
                        `}
                      />
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          {quests.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-8 opacity-50">NO ROUTINES INITIALIZED. CHECK ADMIN CONSOLE.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};