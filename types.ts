export enum Platform {
  ALL = 'All Platforms',
  YOUTUBE = 'YouTube',
  TIKTOK = 'TikTok',
  TWITTER = 'X (Twitter)',
  INSTAGRAM = 'Instagram'
}

export enum TimeRange {
  DAY = 'Today',
  WEEK = 'This Week',
  MONTH = 'This Month'
}

export interface TrendingVideo {
  id: string;
  title: string;
  creator: string;
  views: string; // Keeping as string to handle "1.2M", "500K" etc.
  description: string;
  platform: Platform;
  url?: string;
  thumbnailSeed?: number;
}

export interface DashboardStats {
  totalViews: string;
  topPlatform: string;
  trendingTopic: string;
}
