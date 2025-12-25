import { useAppSelector } from "@/store";

const useTheme = () => {
  const { theme } = useAppSelector((state) => state.auth);
  const isDark = theme === "dark";

  return {
    theme,
    isDark,
  };
};

export default useTheme;


