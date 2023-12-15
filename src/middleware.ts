import { RequestEvent } from "@builder.io/qwik-city";
import { default as AL } from "accept-language";
import { QLOConfig } from "./config";

export const qloMiddleware = (config: QLOConfig) => {
  const acceptLanguage = AL.create();
  acceptLanguage.languages(config.locales);

  return async ({
    params,
    url,
    redirect,
    error,
    locale,
    cookie,
    sharedMap,
    request: { headers },
  }: RequestEvent<any>) => {
    sharedMap.set("dev.valls.qlo", config);
    const cookieName = config.localeCookie ?? "QLO_LOCALE";
    const getCookieLocale = () => {
      if (cookie.has(cookieName)) {
        return acceptLanguage.get(cookie.get(cookieName)?.value);
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

      const locale =
        getCookieLocale() ||
        acceptLanguage.get(headers.get("accept-language")) ||
        config.defaultLocale ||
        config.locales[0];

      if (locale) {
        const redirectURL = foundBaseURL.endsWith("/")
          ? `${foundBaseURL}${locale}${url.search}`
          : `${foundBaseURL}/${locale}${url.search}`;
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
