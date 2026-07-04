import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("WebMeet-Theme") || "light",
    setTheme: (newTheme) => {
      localStorage.setItem("WebMeet-Theme", newTheme);
      set({ theme: newTheme });
    }
}));
  