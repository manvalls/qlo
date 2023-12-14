import { QRL, useStore, useTask$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useQLOConfig } from "./context";

export type ModifierQRL<T extends object> = QRL<
  (t: T, locale: string) => Promise<void> | void
>;

export type ModifierMap<T extends object> = {
  [locale: string]: ModifierQRL<T>;
};

export type Modifier<T extends object> = ModifierQRL<T> | ModifierMap<T>;

export const useTranslation = <T extends object>(
  initialState: T,
  modifier: Modifier<T>
) => {
  const store = useStore<T>(initialState);
  const location = useLocation();
  const config = useQLOConfig();

  useTask$(async ({ track }) => {
    const locale = track(() => location.params.locale) ?? "";

    if (typeof modifier === "object") {
      const modifierFn =
        modifier[locale] ??
        modifier[locale.replace("-", "_")] ??
        modifier[locale.split(/-|_/)[0]] ??
        modifier["_"] ??
        modifier[config.defaultLocale ?? config.locales[0]];
      await modifierFn?.(store, locale);
    } else {
      await modifier(store, locale);
    }
  });

  return store;
};
