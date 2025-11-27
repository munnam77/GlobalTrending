import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { TrendingVideo, Platform } from '../types';

interface StatsOverviewProps {
  videos: TrendingVideo[];
  trendingTopic: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ videos, trendingTopic }) => {
  // Calculate stats dynamically
  const totalViews = videos.reduce((acc, curr) => {
    let val = 0;
    const str = curr.views.toUpperCase().replace(/,/g, '').replace(/\+/g, ''); // remove commas and pluses
    
    // Extract numeric part first
    const match = str.match(/[\d.]+/);
    if (match) {
        const num = parseFloat(match[0]);
        if (str.includes('M') || str.includes('MILLION')) val = num * 1000000;
        else if (str.includes('K') || str.includes('THOUSAND')) val = num * 1000;
        else if (str.includes('B') || str.includes('BILLION')) val = num * 1000000000;
        else val = num;
    }
    
    return acc + val;
  }, 0);

  // Group by platform
  const platformCounts = videos.reduce((acc, curr) => {
    acc[curr.platform] = (acc[curr.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(platformCounts).map(([name, count]) => ({
    name,
    count
  }));

  const COLORS = ['#818cf8', '#34d399', '#f472b6', '#60a5fa', '#a78bfa'];

  const formatViews = (num: number) => {
    if (num === 0) return "N/A";
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Key Metric Card 1 */}
      <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-800/70 transition-colors">
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Estimated Total Views</h4>
        <div className="mt-2 text-4xl font-bold text-white tracking-tight">
          {formatViews(totalViews)}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded font-medium">
            Active Now
          </div>
          <span className="text-xs text-slate-500">Across {videos.length} videos</span>
        </div>
      </div>

       {/* Key Metric Card 2 */}
       <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-800/70 transition-colors">
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Top Trending Topic</h4>
        <div className="mt-2 text-2xl font-bold text-white leading-snug break-words">
          "{trendingTopic}"
        </div>
        <div className="mt-4 text-xs text-indigo-400 bg-indigo-500/10 inline-block px-2 py-1 rounded w-fit font-medium">
          Highest Engagement
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col hover:bg-slate-800/70 transition-colors">
        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Platform Distribution</h4>
        <div className="flex-1 min-h-[100px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
