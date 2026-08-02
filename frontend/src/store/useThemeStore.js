import { create } from "zustand";

const THEME_KEY = "chatapp-theme";
const LIGHT = "talkora";
const DARK = "talkora-dark";

const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "orbit") return LIGHT;
  if (stored === "orbit-dark") return DARK;
  if (stored === LIGHT || stored === DARK) return stored;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? DARK : LIGHT;
};

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === DARK ? LIGHT : DARK;
    get().setTheme(next);
  },
}));

// apply immediately on load
document.documentElement.setAttribute("data-theme", getInitialTheme());
