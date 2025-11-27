import React from 'react';
import { Platform } from '../types';
import { LayoutDashboard, PlatformIcon, TrendingUp } from './Icons';

interface SidebarProps {
  currentPlatform: Platform;
  onSelectPlatform: (p: Platform) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPlatform, onSelectPlatform, isOpen, onClose }) => {
  const platforms = Object.values(Platform);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-30
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            TrendStream
          </span>
        </div>

        <nav className="p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
            Dashboards
          </div>
          
          {platforms.map((platform) => (
            <button
              key={platform}
              onClick={() => {
                onSelectPlatform(platform);
                onClose(); // Close on mobile after selection
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${currentPlatform === platform 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }
              `}
            >
              {platform === Platform.ALL ? (
                <LayoutDashboard className="w-5 h-5" />
              ) : (
                <PlatformIcon platform={platform} />
              )}
              {platform}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4 text-xs text-slate-500">
            <p>Powered by Gemini 2.5</p>
            <p className="mt-1">Real-time Search Grounding</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
