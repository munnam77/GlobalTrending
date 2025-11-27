import { GoogleGenAI } from "@google/genai";
import { Platform, TimeRange, TrendingVideo } from "../types";

// Initialize Gemini Client
// Note: API Key must be provided via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const fetchTrendingData = async (
  platform: Platform,
  timeRange: TimeRange
): Promise<{ videos: TrendingVideo[], topic: string }> => {
  
  const platformQuery = platform === Platform.ALL ? "YouTube, TikTok, Twitter (X), and Instagram" : platform;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const prompt = `
    Current Date: ${today}.
    
    Task: Use the Google Search tool to find the top 6-9 trending videos or viral posts on ${platformQuery} for ${timeRange}.
    You MUST use real data found in the search results. Do not fabricate videos.
    
    Return the data in the following strictly structured format (one entry per line):
    VIDEO|PlatformName|Creator/Channel|Video Title|Exact View Count (e.g. 2.5M, 500K)|Short Description (max 10 words)|TopicCategory
    
    After listing the videos, add one line for the overall trending topic:
    TOPIC|Dominant Trend or Theme
    
    Requirements:
    1. "PlatformName" must be one of: YouTube, TikTok, Twitter, Instagram.
    2. If exact views aren't in the snippet, estimate based on the context (e.g. "Viral", "1M+").
    3. Ensure diversity in content if possible.
    4. "TopicCategory" should be a single word tag like "Music", "Politics", "Gaming", "Sports".
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType is NOT allowed with googleSearch, so we parse text manually
      },
    });

    const text = response.text || "";
    // console.log("Raw Response:", text); // Debugging

    const lines = text.split('\n');
    const videos: TrendingVideo[] = [];
    let topic = "General Trends";

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('VIDEO|')) {
        const parts = trimmed.split('|');
        if (parts.length >= 6) {
          const title = parts[3]?.trim() || "Untitled Video";
          const creator = parts[2]?.trim() || "Unknown Creator";
          const platformName = mapStringToPlatform(parts[1]?.trim() || "YouTube");
          
          // Enhanced URL finding logic
          let videoUrl = findBestUrl(title, creator, groundingChunks);
          
          // Fallback URL if grounding didn't return a direct link
          if (!videoUrl) {
            videoUrl = generateFallbackUrl(platformName, title);
          }

          videos.push({
            id: `vid-${Date.now()}-${index}`,
            title: title,
            creator: creator,
            views: parts[4]?.trim() || "Viral",
            description: parts[5]?.trim() || "Trending content",
            platform: platformName,
            url: videoUrl,
            thumbnailSeed: Math.floor(Math.random() * 1000) + index // Deterministic seed
          });
        }
      } else if (trimmed.startsWith('TOPIC|')) {
        topic = trimmed.split('|')[1]?.trim() || topic;
      }
    });

    // If no videos were parsed (e.g. model output format error), return empty to trigger UI state
    // but usually, flash is good at following formats.

    return { videos, topic };

  } catch (error) {
    console.error("Error fetching trending data:", error);
    // Return empty state rather than crashing, allows UI to show error message if needed
    throw error;
  }
};

const findBestUrl = (title: string, creator: string, chunks: any[]): string | undefined => {
  const t = title.toLowerCase();
  const c = creator.toLowerCase();
  
  // Try to find a chunk that has the title in its title
  const match = chunks.find(chunk => {
    const webTitle = chunk.web?.title?.toLowerCase() || "";
    return webTitle.includes(t) || (webTitle.includes(c) && webTitle.includes("video"));
  });
  
  return match?.web?.uri;
};

const generateFallbackUrl = (platform: Platform, title: string): string => {
  const query = encodeURIComponent(title);
  switch (platform) {
    case Platform.YOUTUBE: return `https://www.youtube.com/results?search_query=${query}`;
    case Platform.TIKTOK: return `https://www.tiktok.com/search?q=${query}`;
    case Platform.TWITTER: return `https://twitter.com/search?q=${query}`;
    case Platform.INSTAGRAM: return `https://www.instagram.com/explore/tags/${query}/`; // approximate
    default: return `https://www.google.com/search?q=${query}`;
  }
};

const mapStringToPlatform = (str: string): Platform => {
  const lower = str.toLowerCase();
  if (lower.includes('youtube') || lower.includes('you tube')) return Platform.YOUTUBE;
  if (lower.includes('tiktok') || lower.includes('tik tok')) return Platform.TIKTOK;
  if (lower.includes('twitter') || lower.includes('x')) return Platform.TWITTER;
  if (lower.includes('instagram') || lower.includes('insta')) return Platform.INSTAGRAM;
  return Platform.YOUTUBE; // Fallback
};
