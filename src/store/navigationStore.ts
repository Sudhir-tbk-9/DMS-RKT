import { create } from "zustand"
import type { NavigationTree } from "@/@types/navigation"
import { apiGetMenuItem } from "@/services/MenuItem"
import { log } from "console"

interface NavigationState {
  menuItems: NavigationTree[]
  fetchMenuItems: () => Promise<void>
}

const useNavigationStore = create<NavigationState>()((set, get) => ({
  menuItems: [],

  fetchMenuItems: async () => {
    if (get().menuItems.length > 0) return 
console.log("something random ")
    try {
      const response = (await apiGetMenuItem()) as { data: NavigationTree[] }
      const menuItems = response.data || []
      console.log("✅ Fetched menu items:", menuItems);
      
      set({ menuItems })
    } catch (error) {
      console.error("❌ Error fetching menu items:", error)
      set({ menuItems: [] })
    }
  },
}))

export default useNavigationStore

