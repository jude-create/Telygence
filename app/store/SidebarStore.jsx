import { create } from 'zustand'

export const useSidebarStore = create((set, get) => ({
  isCollapsed: false,
  isMobile: false,
  isOpen: false,

  toggleSidebar: () => {
    const { isMobile, isOpen, isCollapsed } = get()
    if (isMobile) {
      set({ isOpen: !isOpen })
    } else {
      set({ isCollapsed: !isCollapsed })
    }
  },

  setMobile: (val) => {
    set({ isMobile: val })
    if (!val) set({ isOpen: false })
  },

  closeMobileDrawer: () => set({ isOpen: false }),
}))
