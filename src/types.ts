export interface Video {
  id: string; // unique video reference like "v1" or "v2"
  title: string;
  youtubeUrl: string; // youtube watch / share url e.g. "https://www.youtube.com/watch?v=HXYeP9h7XxE"
  duration: string;
  description: string;
  completed?: boolean;
  language?: string; // "c" | "cpp" | "java" | "python"
  exampleCode?: string;
  practicePrompt?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  category: string;
  totalVideos: number;
  videos: Video[];
  accentColor: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  grade?: string; // e.g. "Outstanding" | "Excellent" | "Very Good"
  score?: number; // e.g. 48
}

export interface UserState {
  uid?: string;
  name: string;
  email: string;
  isLoggedIn: boolean;
  avatar: string;
  bio: string;
  completedVideoIds: string[]; // values format "playlistID-videoID"
  bookmarkedVideoIds: string[]; // values format "playlistID-videoID"
  xp: number;
  streak: number;
  certificates: Certificate[];
  watchHistory: { playlistId: string; videoId: string; timestamp: string }[];
  examScores?: Record<string, number>; // mapping of playlistId => exam score out of 50
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface ForumMessage {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  message: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface StaticCourseNote {
  videoUniqueId: string; // "playlistID-videoID"
  noteText: string;
  updatedAt: string;
}
