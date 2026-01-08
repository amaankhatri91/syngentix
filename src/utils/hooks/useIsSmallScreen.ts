import { useState, useEffect } from "react";

/**
 * Custom hook that returns true when the screen width is 1440px or less
 * 
 * @returns {boolean} true if screen width <= 1440px, false otherwise
 * 
 * @example
 * ```tsx
 * const isSmallScreen = useIsSmallScreen();
 * 
 * return (
 *   <div>
 *     {isSmallScreen ? <MobileView /> : <DesktopView />}
 *   </div>
 * );
 * ```
 */
const useIsSmallScreen = (): boolean => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(() => {
    // Handle SSR - check if window exists
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth <= 1440;
  });

  useEffect(() => {
    // Handle SSR - return early if window doesn't exist
    if (typeof window === "undefined") {
      return;
    }

    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 1522);
    };

    // Check initial screen size
    checkScreenSize();

    // Add resize event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return isSmallScreen;
};

export default useIsSmallScreen;

