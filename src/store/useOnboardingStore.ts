import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from '../utils/storage';

interface OnboardingState {
  isComplete: boolean;
  currentStep: number;
  totalSteps: number;

  // Actions
  completeOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    set => ({
      isComplete: false,
      currentStep: 0,
      totalSteps: 5,

      completeOnboarding: () => set({isComplete: true}),

      nextStep: () =>
        set(state => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
        })),

      prevStep: () =>
        set(state => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),

      goToStep: (step: number) => set({currentStep: step}),

      resetOnboarding: () => set({isComplete: false, currentStep: 0}),
    }),
    {
      name: 'lockgoal-onboarding',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
