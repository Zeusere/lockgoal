import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from '../utils/storage';

interface AuthState {
  isRegistered: boolean;
  userId: string | null;
  email: string | null;
  setRegistered: (userId: string, email: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isRegistered: false,
      userId: null,
      email: null,
      setRegistered: (userId, email) => set({isRegistered: true, userId, email}),
    }),
    {
      name: 'lockgoal-auth',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
