import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import {zustandStorage} from '../utils/storage';
import {STORAGE_KEYS} from '../utils/storage';

export type Locale = 'en' | 'es';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    set => ({
      locale: 'en',
      setLocale: locale => set({locale}),
    }),
    {
      name: STORAGE_KEYS.LOCALE,
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => ({locale: state.locale}),
    }
  )
);
