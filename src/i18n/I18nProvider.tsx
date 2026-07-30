'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Locale } from './config';
import type { ClientMessages } from './dictionaries';
import { createTranslator, type Translate } from './resolve';

interface I18nContextValue {
  locale: Locale;
  messages: ClientMessages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: ClientMessages;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}

/**
 * Traductor para componentes cliente. La contraparte de servidor es `getT`, en
 * `dictionaries.ts`; ambas comparten la resolución y tienen la misma firma, de
 * modo que mover un componente entre servidor y cliente solo cambia esta línea.
 *
 * Ojo: aquí solo está el subconjunto del diccionario que `getClientDictionary`
 * envía al navegador. Si un componente cliente estrena un namespace, hay que
 * añadirlo allí o `t` devolverá la ruta en crudo.
 */
export function useT(): Translate {
  const { messages } = useI18n();
  return useMemo(() => createTranslator(messages), [messages]);
}

export function useLocale(): Locale {
  return useI18n().locale;
}
