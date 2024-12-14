export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Primary check for touch support
  const hasTouch = Boolean(
    'ontouchstart' in window ||
    window.navigator.maxTouchPoints > 0
  );

  // Secondary check for mobile devices
  const isMobile = Boolean(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );

  return hasTouch || isMobile;
}; 