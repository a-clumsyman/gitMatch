import React, { useEffect, useRef, useState } from "react";
import { Profile } from "../utils/api";
import { isTouchDevice } from "../utils/device";

const Icons = {
  star: (
    <svg
      className="w-4 h-4 text-[#E3B341]"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
    </svg>
  ),
  commit: (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h8M12 8v8m0-8V4m0 16v-4"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  code: (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M4.72 3.22a.75.75 0 0 1 1.06 1.06L2.06 8l3.72 3.72a.75.75 0 1 1-1.06 1.06L.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25zm6.56 0a.75.75 0 1 0-1.06 1.06L13.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06l4.25-4.25a.75.75 0 0 0 0-1.06l-4.25-4.25z" />
    </svg>
  ),
  repository: (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h18v18H3V3zm0 4.5h18M7.5 3v18"
      />
    </svg>
  ),
  followers: (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  ),
};

interface UserCardProps {
  profile: Profile;
}

const UserCard: React.FC<UserCardProps> = ({ profile }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [avatarError, setAvatarError] = useState(false);
  const isTouch = isTouchDevice();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: MouseEvent | Touch) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0]);
    };

    const resetTilt = () => {
      card.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    if (!isTouch) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", resetTilt);
      card.addEventListener("mouseenter", resetTilt);
    } else {
      card.addEventListener("touchmove", handleTouchMove, { passive: false });
      card.addEventListener("touchend", resetTilt);
    }

    return () => {
      if (!isTouch) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", resetTilt);
        card.removeEventListener("mouseenter", resetTilt);
      } else {
        card.removeEventListener("touchmove", handleTouchMove);
        card.removeEventListener("touchend", resetTilt);
      }
    };
  }, [isTouch]);

  // Fallback avatar component
  const FallbackAvatar = () => (
    <div className="relative w-16 h-16 rounded-full border border-white/20 ring-2 ring-white/10 bg-[#161B22] flex items-center justify-center">
      <span className="text-2xl font-bold text-white/70">
        {profile.username.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  // Safe number formatting
  const formatNumber = (value: number | undefined | null): string => {
    if (typeof value !== "number") return "0";
    return value.toLocaleString() || "0";
  };

  return (
    <div
      ref={cardRef}
      className="w-full sm:w-[420px] bg-[#0D1117]/40 rounded-2xl backdrop-blur-md 
        border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] 
        backdrop-saturate-[180%] transition-all duration-300 ease-out 
        hover:border-white/20 relative overflow-hidden p-6 sm:p-8
        hover:shadow-[0_15px_45px_rgba(0,0,0,0.35)]"
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        touchAction: isTouch ? "none" : "auto",
        transformOrigin: "center center",
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Background gradient with enhanced depth */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"
        style={{ transform: "translateZ(1px)" }}
      />

      <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
        {/* Profile Section */}
        <div className="flex items-center space-x-4 sm:space-x-5 mb-8 sm:mb-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-sm" />
            {!avatarError ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                className="relative w-16 h-16 rounded-full border border-white/20 ring-2 ring-white/10"
                onError={() => setAvatarError(true)}
                loading="lazy"
              />
            ) : (
              <FallbackAvatar />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white/90 mb-1">
              {profile.username}
            </h2>
            {profile.git_age && (
              <p className="text-sm text-gray-400/90">
                {profile.git_age.years > 0
                  ? `${profile.git_age.years} years on GitHub`
                  : `${profile.git_age.days} days on GitHub`}
              </p>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { value: profile.repositories, icon: Icons.repository },
            { value: profile.followers, icon: Icons.followers },
            { value: profile.total_stars, icon: Icons.star },
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div
                className="absolute -inset-1 bg-gradient-to-br from-purple-500/10 to-blue-500/10 
                            rounded-xl blur-sm group-hover:from-purple-500/20 group-hover:to-blue-500/20 
                            transition-all duration-300"
              />
              <div
                className="relative text-center p-6 bg-[#161B22]/30 rounded-xl 
                            backdrop-blur-sm border border-white/5 transition-colors duration-300"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="text-3xl font-bold text-white/90">
                    {formatNumber(item.value)}
                  </div>
                  <div>{item.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Language and Commits Section */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-400/90 mb-2">Top Language</div>
            <div className="flex items-center gap-2">
              <div>{Icons.code}</div>
              <span className="text-lg font-bold text-white/90">
                {profile.top_language || "Unknown"}
              </span>
            </div>
          </div>
          {profile.monthly_commits !== undefined && (
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-400/90 mb-2">This Month</div>
              <div className="flex items-center gap-2">
                <div>{Icons.commit}</div>
                <span className="text-lg font-bold text-white/90">
                  {formatNumber(profile.monthly_commits)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Repositories Section */}
        {profile.latest_repos?.length > 0 && (
          <div>
            <div className="text-sm text-gray-400/90 mb-4">
              Latest Repositories
            </div>
            <div className="space-y-4">
              {profile.latest_repos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block relative h-[88px]"
                >
                  <div
                    className="absolute -inset-1 bg-gradient-to-br from-purple-500/10 to-blue-500/10 
                                rounded-xl blur-sm group-hover:from-purple-500/20 group-hover:to-blue-500/20 
                                transition-all duration-300"
                  />
                  <div
                    className="relative h-full p-4 bg-[#161B22]/30 rounded-xl backdrop-blur-sm 
                                border border-white/5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-1 overflow-hidden">
                      <div className="font-bold text-white/90 truncate">
                        {repo.name}
                      </div>
                      <div className="text-sm text-gray-400/90 line-clamp-1">
                        {repo.description || "No description available"}
                      </div>
                    </div>
                    <div className="text-sm flex items-center space-x-3 pt-2">
                      <span className="flex items-center gap-1">
                        <div>{Icons.star}</div>
                        <div className="text-[#E3B341]/90">
                          {formatNumber(repo.stars)}
                        </div>
                      </span>
                      <span className="text-gray-400/90">{repo.language}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
