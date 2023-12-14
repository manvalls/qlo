import { RequestEvent } from "@builder.io/qwik-city";
import acceptLanguage from "accept-language";
import { QLOConfig } from "./config";

export const qloMiddleware = (config: QLOConfig) => {
  acceptLanguage.languages(config.locales);

  return async ({
    params,
    url,
    redirect,
    error,
    locale,
    cookie,
    sharedMap,
  }: RequestEvent<any>) => {
    sharedMap.set("dev.valls.qlo", config);
    const cookieName = config.localeCookie ?? "QLO_LOCALE";
    const getCookieLocale = () => {
      const cookieValue = cookie.get(cookieName);
      if (cookieValue && config.locales.includes(cookieValue.value)) {
        return cookieValue.value;
      }
    };

    if (!params.locale) {
      const baseURLs = config.baseURLs ?? ["/"];
      const foundBaseURL = baseURLs.find(
        (baseURL) => url.pathname === baseURL || baseURL === `${url.pathname}/`
      );

      if (!foundBaseURL) {
        return;
      }

      const cookieLocale = getCookieLocale();
      if (cookieLocale) {
        const redirectURL = foundBaseURL.endsWith("/")
          ? `${foundBaseURL}${cookieLocale}${url.search}`
          : `${foundBaseURL}/${cookieLocale}${url.search}`;
        throw redirect(307, redirectURL);
      }

      return;
    }

    if (!config.locales.includes(params.locale)) {
      throw error(404, "Not found");
    }

    if (config.cookieOptions) {
      const cookieLocale = getCookieLocale();
      if (!cookieLocale || cookieLocale !== params.locale) {
        cookie.set(cookieName, params.locale, config.cookieOptions);
      }
    }

    locale(params.locale);
    return;
  };
};
