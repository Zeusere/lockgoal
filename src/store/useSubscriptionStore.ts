import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from '../utils/storage';
import {PlanId} from '../services/revenueCatService';

interface SubscriptionState {
  isSubscribed: boolean;
  currentPlan: PlanId | null;
  setSubscription: (plan: PlanId) => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    set => ({
      isSubscribed: false,
      currentPlan: null,
      setSubscription: plan => set({isSubscribed: true, currentPlan: plan}),
    }),
    {
      name: 'lockgoal-subscription',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
