import {create} from 'zustand';

interface FocusState {
  isFocusModeActive: boolean;
  countdown: number | null;
  startCountdown: () => void;
  setCountdown: (value: number | null) => void;
  activateFocusMode: () => void;
  deactivateFocusMode: () => void;
}

export const useFocusStore = create<FocusState>(set => ({
  isFocusModeActive: false,
  countdown: null,
  startCountdown: () => set({countdown: 3}),
  setCountdown: value => set({countdown: value}),
  activateFocusMode: () => set({isFocusModeActive: true, countdown: null}),
  deactivateFocusMode: () => set({isFocusModeActive: false, countdown: null}),
}));
