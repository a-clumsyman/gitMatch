import { API_BASE_URL } from '../api/config';

export const fetchProfile = async (username: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${username}`);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}; 