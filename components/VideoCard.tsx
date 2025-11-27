import React from 'react';
import { TrendingVideo } from '../types';
import { PlatformIcon, Eye, Users, ExternalLink } from './Icons';
import { Platform } from '../types';

interface VideoCardProps {
  video: TrendingVideo;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  // Generate a placeholder image that is consistent for this video ID
  // Using a darker, more tech-focused placeholder or specific keywords if possible
  const imageUrl = `https://picsum.photos/seed/${video.id}${video.thumbnailSeed}/600/338`;

  const getPlatformColor = (p: Platform) => {
    switch (p) {
      case Platform.YOUTUBE: return 'hover:shadow-red-500/20 hover:border-red-500/50';
      case Platform.TIKTOK: return 'hover:shadow-pink-500/20 hover:border-pink-500/50';
      case Platform.TWITTER: return 'hover:shadow-blue-400/20 hover:border-blue-400/50';
      case Platform.INSTAGRAM: return 'hover:shadow-purple-500/20 hover:border-purple-500/50';
      default: return 'hover:shadow-indigo-500/20 hover:border-indigo-500/50';
    }
  };

  return (
    <div className={`
      group relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 
      transition-all duration-300 hover:shadow-lg ${getPlatformColor(video.platform)} flex flex-col h-full
    `}>
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img 
          src={imageUrl} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

        {/* Platform Badge */}
        <div className="absolute top-2 right-2 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/50 flex items-center gap-1.5 shadow-lg">
          <PlatformIcon platform={video.platform} className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold tracking-wide uppercase text-slate-200">{video.platform}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
          {video.title}
        </h3>
        
        <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-grow">
          {video.description}
        </p>

        <div className="mt-auto pt-3 border-t border-slate-700/50 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-300 min-w-0">
            <div className="p-1 rounded-full bg-slate-700/50">
                <Users className="w-3 h-3 text-slate-400" />
            </div>
            <span className="font-medium truncate text-xs text-slate-300">{video.creator}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full ml-2">
            <Eye className="w-3 h-3" />
            <span className="font-bold text-xs whitespace-nowrap">{video.views}</span>
          </div>
        </div>
      </div>
      
      {/* Action Overlay */}
      <a 
        href={video.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
        aria-label={`View ${video.title} on ${video.platform}`}
      >
        <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
           <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl border border-slate-700">
             Watch Video <ExternalLink className="w-4 h-4" />
           </div>
        </div>
      </a>
    </div>
  );
};

export default VideoCard;
