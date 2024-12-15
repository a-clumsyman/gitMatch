export const isTouchDevice = (): boolean => {
  // More reliable touch detection
  return (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    // @ts-ignore
    (navigator.msMaxTouchPoints > 0)
  );
}; 