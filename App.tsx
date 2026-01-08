import React, { useState, useEffect } from 'react';
import { TabNavigation } from './components/TabNavigation';
import { AdminTab } from './components/AdminTab';
import { TrackerTab } from './components/TrackerTab';
import { StatsTab } from './components/StatsTab';
import { SystemTab } from './components/SystemTab';
import { Quest, AppState, STORAGE_KEY } from './types';

// Default initial state
const INITIAL_STATE: AppState = {
  quests: [],
  totalXP: 0,
  level: 1,
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('TRACKER');
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Data corruption detected");
      }
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  // Global Reset Function (Nuclear Option)
  useEffect(() => {
    (window as any).resetStatus = function() {
      if (!confirm("WARNING: WIPE ALL XP AND HISTORY?")) return;

      // 1. Clear XP and Level
      const wipedQuests = state.quests.map(q => ({ ...q, history: {} }));
      const cleanState = {
        quests: wipedQuests,
        totalXP: 0,
        level: 1
      };

      // 2. Save Immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanState));
      
      // 3. Force Reload
      window.location.reload();
    };
  }, [state]);

  // Actions
  const addQuest = (quest: Quest) => {
    setState(prev => ({ ...prev, quests: [...prev.quests, quest] }));
  };

  const deleteQuest = (id: string) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.filter(q => q.id !== id)
    }));
  };

  const toggleHistory = (questId: string, date: string) => {
    setState(prev => {
      const quests = prev.quests.map(q => {
        if (q.id !== questId) return q;

        const newHistory = { ...q.history };
        const wasCompleted = !!newHistory[date];
        
        if (wasCompleted) {
          delete newHistory[date];
        } else {
          newHistory[date] = true;
        }

        return { ...q, history: newHistory };
      });

      // Recalculate total XP based on DURATION (1 min = 1 XP)
      let newTotalXP = 0;
      quests.forEach(q => {
        const completions = Object.keys(q.history).length;
        newTotalXP += completions * q.duration;
      });

      const newLevel = Math.floor(newTotalXP / 100) + 1;

      return {
        quests,
        totalXP: newTotalXP,
        level: newLevel
      };
    });
  };

  const loadExternalState = (newState: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  if (!loaded) return <div className="text-[#11d13b] p-10">INITIALIZING PIP-BOY OS...</div>;

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-black text-[#11d13b] font-mono pb-[200px] relative z-10">
      
      {/* Header / Brand */}
      <div className="p-4 border-b-4 border-[#11d13b] mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-glow tracking-tighter">PIP-BOY LIFE</h1>
          <div className="text-sm opacity-70">ROBCO INDUSTRIES (TM) TERM-LINK PROTOCOL</div>
        </div>
        <div className="text-right">
          <div className="text-xs">LVL</div>
          <div className="text-3xl font-bold">{state.level}</div>
        </div>
      </div>

      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mt-6 border-x-2 border-[#11d13b] min-h-[500px] shadow-[0_0_20px_rgba(17,209,59,0.1)] mx-2 md:mx-0 bg-black">
        {activeTab === 'ADMIN' && (
          <AdminTab quests={state.quests} addQuest={addQuest} deleteQuest={deleteQuest} />
        )}
        {activeTab === 'TRACKER' && (
          <TrackerTab quests={state.quests} toggleHistory={toggleHistory} />
        )}
        {activeTab === 'STATUS' && (
          <StatsTab 
            quests={state.quests} 
            totalXP={state.totalXP} 
            level={state.level}
          />
        )}
        {activeTab === 'SYSTEM' && (
          <SystemTab state={state} loadState={loadExternalState} />
        )}
      </main>

      <footer className="mt-8 text-center opacity-50 text-xs">
        <p>VAULT-TEC REMINDS YOU: DISCIPLINE IS KEY TO SURVIVAL.</p>
      </footer>
    </div>
  );
};

export default App;