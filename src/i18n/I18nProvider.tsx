'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import type { Locale } from './config';
import type { ClientMessages } from './dictionaries';

type Vars = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  messages: ClientMessages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolve(messages: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);
}

function interpolate(value: string, vars?: Vars): string {
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

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
 * Translation accessor. Resolves a dot-path against the active dictionary.
 * - String leaves are returned with optional `{var}` interpolation.
 * - Array / object leaves are returned as-is (typed via the generic) for
 *   lists like bullet points or FAQ entries.
 * - A missing key returns the path itself, making gaps visible in dev.
 */
export function useT() {
  const { messages } = useI18n();
  return useCallback(
    <T = string,>(path: string, vars?: Vars): T => {
      const found = resolve(messages, path);
      if (found === undefined) return path as unknown as T;
      if (typeof found === 'string') return interpolate(found, vars) as unknown as T;
      return found as T;
    },
    [messages]
  );
}

export function useLocale(): Locale {
  return useI18n().locale;
}
