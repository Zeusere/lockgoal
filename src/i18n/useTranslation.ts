import {useLocaleStore} from '../store/useLocaleStore';
import {translate, type Locale} from './translations';

export function useTranslation() {
  const locale = useLocaleStore(state => state.locale);
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(locale, key, params);
  return {t, locale};
}

export type {Locale};
