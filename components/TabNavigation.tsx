import React from 'react';
import { audioService } from '../services/audioService';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'ADMIN', label: 'ADMIN' },
  { id: 'TRACKER', label: 'TRACKER' },
  { id: 'STATUS', label: 'STATUS' },
  { id: 'SYSTEM', label: 'SYSTEM' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="sticky top-0 z-50 bg-black border-b-2 border-[#11d13b] pb-2 pt-4 px-2 flex justify-between md:justify-start gap-2 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            audioService.playClick();
            setActiveTab(tab.id);
          }}
          onMouseEnter={() => audioService.playHover()}
          className={`
            flex-1 md:flex-none px-4 py-2 text-xl font-bold uppercase tracking-widest transition-all duration-200
            ${activeTab === tab.id 
              ? 'bg-[#11d13b] text-black shadow-[0_0_15px_#11d13b]' 
              : 'bg-black text-[#11d13b] border border-[#11d13b] hover:bg-[#11d13b] hover:text-black hover:bg-opacity-20'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};