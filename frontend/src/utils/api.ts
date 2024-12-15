export interface Repository {
  name: string;
  stars: number;
  description: string;
  url: string;
  language: string;
}

export interface Profile {
  username: string;
  avatar: string;
  bio: string;
  repositories: number;
  followers: number;
  total_stars: number;
  top_language: string;
  latest_repos: Repository[];
  git_age?: {
    years: number;
    days: number;
  };
  created_at?: string;
  monthly_commits?: number;
}

// Add interface for recent user
export interface RecentUser {
  username: string;
  avatar: string;
}

// Use the deployed backend URL
const API_URL = import.meta.env.PROD 
  ? 'https://git-match-backend.vercel.app'  // Production URL
  : 'http://localhost:8000';                // Development URL

export async function getProfile(username: string): Promise<Profile> {
  try {
    const response = await fetch(`${API_URL}/profile/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
}

// Add function to fetch recent users
export async function getRecentUsers(): Promise<RecentUser[]> {
  try {
    const response = await fetch(`${API_URL}/recent-users`);
    if (!response.ok) {
      throw new Error('Failed to fetch recent users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return [];
  }
} 