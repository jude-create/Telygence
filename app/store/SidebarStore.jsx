import { create } from 'zustand'

export const useSidebarStore = create((set) => ({
  isCollapsed: false,
  isMobile: false,
  isOpen: false,

  toggleSidebar: () =>
    set((state) =>
      state.isMobile
        ? { isOpen: !state.isOpen }
        : { isCollapsed: !state.isCollapsed }
    ),

  openMobileDrawer: () => set({ isOpen: true }),
  closeMobileDrawer: () => set({ isOpen: false }),

  setMobile: (val) =>
    set((state) =>
      state.isMobile === val
        ? {}
        : { isMobile: val, isOpen: false, isCollapsed: val ? false : state.isCollapsed }
    ),
}))