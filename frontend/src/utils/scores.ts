import { Profile } from './api';

export function calculateMatchScore(profile1: Profile, profile2: Profile): number {
  // Language compatibility (40%)
  const languageScore = profile1.top_language === profile2.top_language ? 40 : 20;

  // Repository balance (30%)
  const repoRatio = Math.min(profile1.repositories, profile2.repositories) / 
                   Math.max(profile1.repositories, profile2.repositories);
  const repoScore = repoRatio * 30;

  // Community engagement (30%)
  const totalFollowers = profile1.followers + profile2.followers;
  const followerScore = Math.min(totalFollowers / 100 * 30, 30);

  return Math.round(languageScore + repoScore + followerScore);
} 