import { useEffect } from "react";
import useTheme from "./useTheme";
import { getIconColor } from "@/utils/common";

const useThemeBackground = () => {
  const { theme, isDark } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    
    // Set data-theme attribute for CSS selectors
    root.setAttribute("data-theme", theme);
    
    // Background colors
    const backgroundColor = isDark ? "#0C1116" : "#ffffff";
    root.style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
    
    // Heading text colors (h1, h2, h3, h4, h5)
    root.style.setProperty("--heading-color", getIconColor(isDark));
    
    // Paragraph and span text colors
    const textColor = isDark ? "#BDC9F5" : "#5A5A5A";
    root.style.setProperty("--text-color", textColor);
  }, [theme, isDark]);
};

export default useThemeBackground;

