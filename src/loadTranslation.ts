import { RequestEventLoader } from "@builder.io/qwik-city";
import { QLOConfig } from "./config";

export type LoaderFn<T extends object> = (locale: string) => Promise<T> | T;

export type LoaderMap<T extends object> = {
  [locale: string]: LoaderFn<T>;
};

export type Loader<T extends object> = LoaderFn<T> | LoaderMap<T>;

export const loadTranslation = async <T extends object>(
  { params, sharedMap }: RequestEventLoader<any>,
  loader: Loader<T>
): Promise<T> => {
  const { locale } = params;
  const config: QLOConfig = sharedMap.get("dev.valls.qlo") ?? { locales: [] };

  if (typeof loader === "object") {
    const loaderFn =
      loader[locale] ??
      loader[locale.replace("-", "_")] ??
      loader[locale.split(/-|_/)[0]] ??
      loader["_"] ??
      loader[config.defaultLocale ?? config.locales[0]];
    return loaderFn?.(locale);
  }

  return loader(locale);
};
