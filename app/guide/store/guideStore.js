'use client';
import { create } from 'zustand';

const useGuideStore = create((set, get) => ({
  // Set of expanded dimension IDs (multi-expand)
  openDimensions: new Set(),

  // Set of selected subtag IDs
  selectedTags: new Set(),

  toggleDimension(id) {
    set((state) => {
      const isOpen = state.openDimensions.has(id);
      // 배타적 토글: 클릭한 dimension만 열고 나머지는 닫음
      return { openDimensions: isOpen ? new Set() : new Set([id]) };
    });
  },

  toggleTag(id) {
    set((state) => {
      const next = new Set(state.selectedTags);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedTags: next };
    });
  },

  // How many tags belong to a given dimension (to show badge counts)
  getTagCountForDimension(dimensionTags) {
    const { selectedTags } = get();
    return dimensionTags.filter((t) => selectedTags.has(t.id)).length;
  },

  reset() {
    set({ openDimensions: new Set(), selectedTags: new Set() });
  },
}));

export default useGuideStore;
