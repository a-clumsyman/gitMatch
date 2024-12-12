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
  top_language: string;
  top_repos: Repository[];
}

const API_URL = import.meta.env.VITE_API_URL;

export async function getProfile(username: string): Promise<Profile> {
  const response = await fetch(`${API_URL}/profile/${username}`);
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
} 