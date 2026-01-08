import React, { useState } from 'react';
import { Quest, CATEGORIES } from '../types';
import { audioService } from '../services/audioService';

interface AdminTabProps {
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  deleteQuest: (id: string) => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({ quests, addQuest, deleteQuest }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState<string>(''); // Using string to allow empty placeholder
  const [categorySelection, setCategorySelection] = useState<string>('STRENGTH');
  const [customCategory, setCustomCategory] = useState('');

  const handleAdd = () => {
    const durationNum = parseInt(duration);
    
    // Validation: Name required, Duration must be a number > 0
    if (!name.trim() || isNaN(durationNum) || durationNum <= 0) return;
    
    const finalCategory = categorySelection === 'OTHER' 
      ? (customCategory.trim() || 'MISC') 
      : categorySelection;

    const newQuest: Quest = {
      id: crypto.randomUUID(),
      name,
      duration: durationNum,
      category: finalCategory,
      history: {}
    };

    addQuest(newQuest);
    audioService.playSuccess();
    
    // Reset form
    setName('');
    setDuration('');
    setCategorySelection('STRENGTH');
    setCustomCategory('');
  };

  return (
    <div className="space-y-8 p-4">
      <div className="border-2 border-[#11d13b] p-4 bg-black shadow-[0_0_10px_rgba(17,209,59,0.3)]">
        <h2 className="text-2xl mb-4 border-b border-[#11d13b] pb-2 text-glow">NEW ROUTINE PROTOCOL</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm opacity-80">ROUTINE NAME</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black border border-[#11d13b] p-2 text-xl focus:outline-none focus:ring-2 focus:ring-[#11d13b]"
              placeholder="ENTER DESIGNATION..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm opacity-80">DURATION (MINS)</label>
              <input 
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                className="bg-black border border-[#11d13b] p-2 text-lg focus:outline-none placeholder-[#11d13b] placeholder-opacity-50"
                placeholder="ENTER MINUTES..."
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm opacity-80">CATEGORY</label>
              <div className="flex gap-2">
                <select 
                  value={categorySelection} 
                  onChange={(e) => setCategorySelection(e.target.value)}
                  className="bg-black border border-[#11d13b] p-2 text-lg focus:outline-none flex-1"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {categorySelection === 'OTHER' && (
                  <input 
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="TYPE..."
                    className="bg-black border border-[#11d13b] p-2 w-1/2 focus:outline-none animate-pulse"
                  />
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={handleAdd}
            onMouseEnter={() => audioService.playHover()}
            className="w-full bg-[#11d13b] text-black font-bold py-3 text-xl hover:bg-opacity-90 active:scale-95 transition-transform"
          >
            [ INITIATE PROTOCOL ]
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl border-b border-[#11d13b] inline-block pr-8">ACTIVE PROTOCOLS</h3>
        {quests.length === 0 && <p className="opacity-50 blink">NO DATA FOUND...</p>}
        
        <div className="grid gap-4">
          {quests.map(quest => (
            <div key={quest.id} className="flex justify-between items-center border border-[#11d13b] p-3 hover:bg-[#11d13b] hover:bg-opacity-10 transition-colors">
              <div>
                <div className="font-bold text-lg">{quest.name}</div>
                <div className="text-xs opacity-70 flex gap-2">
                  <span>[{quest.category}]</span>
                  <span>TIME: {quest.duration}m</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  audioService.playClick();
                  deleteQuest(quest.id);
                }}
                className="text-[#11d13b] hover:text-red-500 p-2 border border-transparent hover:border-red-500 transition-all"
                title="TERMINATE"
              >
                [TRASH]
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};