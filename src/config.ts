import { CookieOptions } from "@builder.io/qwik-city";

export type QLOConfig = {
  defaultLocale?: string;
  locales: string[];
  baseURLs?: string[];
  localeCookie?: string;
  cookieOptions?: CookieOptions;
};
