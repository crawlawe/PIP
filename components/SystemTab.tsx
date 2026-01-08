import React, { useRef } from 'react';
import { AppState, STORAGE_KEY } from '../types';
import { audioService } from '../services/audioService';

interface SystemTabProps {
  state: AppState;
  loadState: (state: AppState) => void;
}

export const SystemTab: React.FC<SystemTabProps> = ({ state, loadState }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    audioService.playClick();
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `PIPBOY_DATA_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    audioService.playClick();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation
        if (json.quests && typeof json.totalXP === 'number') {
          loadState(json);
          audioService.playSuccess();
          alert('HOLOTAPE LOADED SUCCESSFULLY. SYSTEM RESTARTING...');
          window.location.reload();
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        alert('ERROR: HOLOTAPE CORRUPTED.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center h-[60vh] space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl text-glow">DATA MANAGEMENT</h2>
        <p className="opacity-60 text-sm max-w-md mx-auto">
          ENSURE REGULAR BACKUPS TO PREVENT DATA LOSS DUE TO RADIATION OR RAIDER ATTACKS.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <button
          onClick={handleExport}
          onMouseEnter={() => audioService.playHover()}
          className="w-full border-2 border-[#11d13b] py-4 hover:bg-[#11d13b] hover:text-black transition-all flex justify-center items-center gap-2 group"
        >
          <span className="animate-pulse group-hover:animate-none">▼</span> 
          [ EXPORT HOLOTAPE ]
        </button>

        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".json"
          />
          <button
            onClick={handleImportClick}
            onMouseEnter={() => audioService.playHover()}
            className="w-full border-2 border-[#11d13b] py-4 hover:bg-[#11d13b] hover:text-black transition-all flex justify-center items-center gap-2 group"
          >
             <span className="animate-pulse group-hover:animate-none">▲</span>
             [ LOAD HOLOTAPE ]
          </button>
        </div>
      </div>
    </div>
  );
};