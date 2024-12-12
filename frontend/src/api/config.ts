export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://git-match-backend.vercel.app'  // Production backend
  : 'http://localhost:8000';                // Development backend 