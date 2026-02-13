import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from '../utils/storage';

interface AppState {
  // Selected apps to block
  blockedAppIds: string[];

  // Actions
  toggleApp: (appId: string) => void;
  setBlockedApps: (appIds: string[]) => void;
  isAppBlocked: (appId: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      blockedAppIds: ['instagram', 'tiktok', 'twitter'],

      toggleApp: (appId: string) => {
        const state = get();
        const isBlocked = state.blockedAppIds.includes(appId);
        set({
          blockedAppIds: isBlocked
            ? state.blockedAppIds.filter(id => id !== appId)
            : [...state.blockedAppIds, appId],
        });
      },

      setBlockedApps: (appIds: string[]) => {
        set({blockedAppIds: appIds});
      },

      isAppBlocked: (appId: string) => {
        return get().blockedAppIds.includes(appId);
      },
    }),
    {
      name: 'lockgoal-apps',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
