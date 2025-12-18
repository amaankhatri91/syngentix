import { useEffect } from "react";
import { useAppSelector } from "@/store";

const useThemeBackground = () => {
  const { theme } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const root = document.documentElement;
    
    // Set data-theme attribute for CSS selectors
    root.setAttribute("data-theme", theme);
    
    // Background colors
    const backgroundColor = theme === "dark" ? "#0C1116" : "#ffffff";
    root.style.backgroundColor = backgroundColor;
    document.body.style.backgroundColor = backgroundColor;
    
    // Heading text colors (h1, h2, h3, h4, h5)
    const headingColor = theme === "dark" ? "#ffffff" : "#162230";
    root.style.setProperty("--heading-color", headingColor);
    
    // Paragraph and span text colors
    const textColor = theme === "dark" ? "#BDC9F5" : "#5A5A5A";
    root.style.setProperty("--text-color", textColor);
  }, [theme]);
};

export default useThemeBackground;

