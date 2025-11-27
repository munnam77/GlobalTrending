import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import StatsOverview from './components/StatsOverview';
import { Platform, TimeRange, TrendingVideo } from './types';
import { fetchTrendingData } from './services/gemini';
import { 
  Menu, 
  Search, 
  RefreshCw,
} from './components/Icons';

const App: React.FC = () => {
  const [currentPlatform, setCurrentPlatform] = useState<Platform>(Platform.ALL);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.DAY);
  const [videos, setVideos] = useState<TrendingVideo[]>([]);
  const [topic, setTopic] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // To show loading progress text
  const [loadingText, setLoadingText] = useState("Initializing...");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoadingText("Connecting to Gemini AI...");
    
    // Simulate steps for better UX
    setTimeout(() => setLoadingText("Scanning Search Grounding..."), 800);
    setTimeout(() => setLoadingText("Analyzing Social Trends..."), 1500);
    
    try {
      const data = await fetchTrendingData(currentPlatform, timeRange);
      setVideos(data.videos);
      setTopic(data.topic);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trending data. The AI service might be busy or the API key is missing.");
    } finally {
      setLoading(false);
    }
  }, [currentPlatform, timeRange]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <Sidebar 
        currentPlatform={currentPlatform} 
        onSelectPlatform={setCurrentPlatform}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen flex flex-col transition-all duration-300">
        
        {/* Header */}
        <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
                  {currentPlatform === Platform.ALL ? 'Global Trending' : `${currentPlatform} Trends`}
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block font-medium">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="hidden md:flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                {Object.values(TimeRange).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`
                      px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200
                      ${timeRange === range 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }
                    `}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <button 
                onClick={loadData}
                disabled={loading}
                className={`
                  p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20
                  disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 active:scale-95
                `}
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Time Range (visible only on small screens) */}
          <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {Object.values(TimeRange).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border
                  ${timeRange === range 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                  }
                `}
              >
                {range}
              </button>
            ))}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Stats Section */}
            {!loading && !error && videos.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <StatsOverview videos={videos} trendingTopic={topic} />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-2xl text-center my-8 max-w-lg mx-auto">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Data Unavailable</h3>
                <p className="text-sm mb-6">{error}</p>
                <button 
                  onClick={loadData}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-red-500/20"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading State Skeleton */}
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-medium text-white mb-2">{loadingText}</h3>
                <p className="text-slate-500 text-sm">Gathering real-time insights from global platforms...</p>
              </div>
            )}

            {/* Video Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && videos.length === 0 && (
              <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed">
                <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/20">
                  <Search className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">No specific trends found</h3>
                <p className="text-slate-400 mt-2 max-w-md mx-auto">
                    We couldn't find specific video matches for this criteria right now. Try selecting a specific platform or checking back later.
                </p>
                <button 
                  onClick={loadData}
                  className="mt-6 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Refresh Feed
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
