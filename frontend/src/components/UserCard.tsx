import React, { useEffect, useRef } from "react";
import { Profile } from "../utils/api";
import { isTouchDevice } from "../utils/device";

interface UserCardProps {
  profile: Profile;
}

const UserCard: React.FC<UserCardProps> = ({ profile }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouch = isTouchDevice();

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    let rafId: number;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
      currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

      card.style.transform = `
        perspective(1000px) 
        rotateX(${currentRotateX}deg) 
        rotateY(${currentRotateY}deg)
      `;

      rafId = requestAnimationFrame(animate);
    };

    const handleMove = (x: number, y: number) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const mouseX = x - rect.left;
      const mouseY = y - rect.top;

      targetRotateX = ((mouseY - centerY) / centerY) * -7;
      targetRotateY = ((mouseX - centerX) / centerX) * 7;
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    const handleLeave = () => {
      targetRotateX = 0;
      targetRotateY = 0;
    };

    const handleEnter = () => {
      rafId = requestAnimationFrame(animate);
    };

    // Add both mouse and touch event listeners
    if (!isTouch) {
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleLeave);
      card.addEventListener("mouseenter", handleEnter);
    } else {
      card.addEventListener("touchmove", handleTouchMove, { passive: false });
      card.addEventListener("touchend", handleLeave);
      card.addEventListener("touchstart", handleEnter);
    }

    return () => {
      if (!isTouch) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleLeave);
        card.removeEventListener("mouseenter", handleEnter);
      } else {
        card.removeEventListener("touchmove", handleTouchMove);
        card.removeEventListener("touchend", handleLeave);
        card.removeEventListener("touchstart", handleEnter);
      }
      cancelAnimationFrame(rafId);
    };
  }, [isTouch]);

  return (
    <div
      ref={cardRef}
      className={`
        w-full sm:w-[420px] bg-[#0D1117]/40 rounded-2xl backdrop-blur-md 
        border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] 
        backdrop-saturate-[180%] transition-all duration-300 ease-out 
        hover:border-white/20 relative isolate overflow-hidden
        ${isTouch ? "touch-none" : ""} 
        ${isTouch ? "p-6" : "p-6 sm:p-8"} 
      `}
      style={{
        transformStyle: "preserve-3d",
        transform: "perspective(1000px)",
        willChange: "transform",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      {/* Content container with glass effect */}
      <div className="relative z-10">
        <div
          className={`
          flex items-center space-x-4 sm:space-x-5 mb-8 sm:mb-10
          ${isTouch ? "touch-pan-y" : ""}
        `}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-sm" />
            <img
              src={profile.avatar}
              alt={profile.username}
              className="relative w-16 h-16 rounded-full border border-white/20 ring-2 ring-white/10"
            />
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

        <div className="grid grid-cols-2 gap-4 mb-10">
          {["Repositories", "Followers"].map((label, i) => (
            <div key={label} className="relative group">
              <div
                className="absolute -inset-1 bg-gradient-to-br from-purple-500/10 to-blue-500/10 
                            rounded-xl blur-sm group-hover:from-purple-500/20 group-hover:to-blue-500/20 
                            transition-all duration-300"
              />
              <div
                className="relative text-center p-6 bg-[#161B22]/30 rounded-xl 
                            backdrop-blur-sm border border-white/5 transition-colors duration-300"
              >
                <div className="text-3xl font-bold text-white/90 mb-1">
                  {i === 0 ? profile.repositories : profile.followers}
                </div>
                <div className="text-sm text-gray-400/90">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="text-sm text-gray-400/90 mb-3">Top Language</div>
          <div className="text-xl font-bold text-white/90">
            {profile.top_language}
          </div>
        </div>

        {profile.latest_repos && profile.latest_repos.length > 0 && (
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
                      <span className="text-[#E3B341]/90 flex items-center">
                        <span className="mr-1">★</span> {repo.stars}
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
