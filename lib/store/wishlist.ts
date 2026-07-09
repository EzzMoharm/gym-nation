import { create } from "zustand";
import { toggleWishlistItem, getWishlistProductIds } from "@/app/dashboard/actions";
import { toast } from "sonner";

interface WishlistStore {
  wishlistIds: string[];
  isLoading: boolean;
  loadWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: [],
  isLoading: false,

  loadWishlist: async () => {
    set({ isLoading: true });
    try {
      const ids = await getWishlistProductIds();
      set({ wishlistIds: ids });
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId: string) => {
    // Optimistic update
    const currentIds = get().wishlistIds;
    const isAdded = currentIds.includes(productId);
    
    if (isAdded) {
      set({ wishlistIds: currentIds.filter((id) => id !== productId) });
    } else {
      set({ wishlistIds: [...currentIds, productId] });
    }

    try {
      const res = await toggleWishlistItem(productId);
      if (res.error) {
        // Rollback
        set({ wishlistIds: currentIds });
        if (res.error === "Not authenticated") {
          toast.error("Please log in to add items to your wishlist");
        } else {
          toast.error("Failed to update wishlist");
        }
      } else {
        toast.success(res.added ? "Added to wishlist" : "Removed from wishlist");
      }
    } catch (err) {
      // Rollback
      set({ wishlistIds: currentIds });
      toast.error("An error occurred. Please try again.");
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.includes(productId);
  },
}));
