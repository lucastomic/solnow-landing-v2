import 'server-only';
import type { Locale } from './config';

const dictionaries = {
  es: () => import('@/messages/es.json').then((m) => m.default),
  en: () => import('@/messages/en.json').then((m) => m.default),
};

export type Messages = Awaited<ReturnType<(typeof dictionaries)['es']>>;

export const getDictionary = async (locale: Locale): Promise<Messages> =>
  dictionaries[locale]();
