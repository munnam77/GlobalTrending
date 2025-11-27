import React from 'react';
import { 
  Youtube, 
  Twitter, 
  Instagram, 
  Video, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Filter,
  RefreshCw,
  Search,
  LayoutDashboard,
  BarChart2,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { Platform } from '../types';

export const PlatformIcon = ({ platform, className = "w-5 h-5" }: { platform: Platform, className?: string }) => {
  switch (platform) {
    case Platform.YOUTUBE:
      return <Youtube className={`${className} text-red-500`} />;
    case Platform.TIKTOK:
      // Lucide doesn't have TikTok, using Video as placeholder with specific color
      return <Video className={`${className} text-pink-500`} />;
    case Platform.TWITTER:
      return <Twitter className={`${className} text-blue-400`} />;
    case Platform.INSTAGRAM:
      return <Instagram className={`${className} text-purple-500`} />;
    default:
      return <TrendingUp className={`${className} text-emerald-400`} />;
  }
};

export { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Filter, 
  RefreshCw, 
  Search,
  LayoutDashboard,
  BarChart2,
  Menu,
  X,
  ExternalLink
};
