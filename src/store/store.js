import { create } from 'zustand';

export const useAppStore = create((set) => ({
  file: null,
  setFile: (file) => set({ file }),
  
  analyticsData: null,
  setAnalyticsData: (data) => set({ analyticsData: data }),
  
  status: 'idle', // 'idle', 'parsing', 'success', 'error'
  setStatus: (status) => set({ status }),
  
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),

  resetUploadState: () => set({ 
    file: null,
    analyticsData: null,
    status: 'idle',
    isDragging: false
  })
}));