import React from "react";
import { Profile } from "../utils/api";

interface UserCardProps {
  profile: Profile;
}

const UserCard: React.FC<UserCardProps> = ({ profile }) => {
  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
      <div className="flex items-center space-x-4">
        <img
          src={profile.avatar}
          alt={profile.username}
          className="w-16 h-16 rounded-full border-2 border-white/10"
        />
        <div>
          <h2 className="text-xl font-bold text-white">{profile.username}</h2>
          <p className="text-gray-400">{profile.bio}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-900/50 rounded-xl">
          <div className="text-2xl font-bold text-white">
            {profile.repositories}
          </div>
          <div className="text-sm text-gray-400">Repositories</div>
        </div>
        <div className="text-center p-3 bg-gray-900/50 rounded-xl">
          <div className="text-2xl font-bold text-white">
            {profile.followers}
          </div>
          <div className="text-sm text-gray-400">Followers</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-400">Top Language</div>
        <div className="text-lg font-semibold text-white">
          {profile.top_language}
        </div>
      </div>

      {profile.top_repos && profile.top_repos.length > 0 && (
        <div className="mt-4">
          <div className="text-sm text-gray-400 mb-2">Top Repositories</div>
          <div className="space-y-2">
            {profile.top_repos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-900/50 rounded-xl hover:bg-gray-700/50 transition-colors"
              >
                <div className="font-semibold text-white">{repo.name}</div>
                <div className="text-sm text-gray-400">{repo.description}</div>
                <div className="mt-1 text-sm">
                  <span className="text-yellow-400">★ {repo.stars}</span>
                  <span className="ml-3 text-gray-400">{repo.language}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
