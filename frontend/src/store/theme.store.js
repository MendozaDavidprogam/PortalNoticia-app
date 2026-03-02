import { create } from 'zustand'
export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('nh-theme') || 'dark',
  toggle: () => set((s) => {
    const next = s.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('nh-theme', next)
    document.documentElement.setAttribute('data-theme', next)
    return { theme: next }
  }),
}))
