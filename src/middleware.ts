import { RequestEvent } from "@builder.io/qwik-city";
import { QLOConfig } from "./config";

export const qloMiddleware = (config: QLOConfig) => {
  const cookieName = config.localeCookie ?? "QLO_LOCALE";

  function findLocale(locale?: string) {
    if (!locale) {
      return;
    }

    return config.locales.find(
      (l) =>
        l === locale ||
        l === locale.replace("-", "_") ||
        l === locale.split(/-|_/)[0]
    );
  }

  function getAcceptLanguageLocale(acceptLanguageHeader?: string | null) {
    if (!acceptLanguageHeader) {
      return;
    }

    const acceptLanguage = acceptLanguageHeader
      .split(",")
      .map((l) => l.split(";")[0].trim());

    for (const locale of acceptLanguage) {
      const foundLocale = findLocale(locale);
      if (foundLocale) {
        return foundLocale;
      }
    }
  }

  return async ({
    params,
    url,
    redirect,
    error,
    locale,
    cookie,
    sharedMap,
    request: { headers },
    env,
  }: RequestEvent<any>) => {
    const qloOrigin = env.get("QLO_ORIGIN") || "";
    sharedMap.set("dev.valls.qlo", config);

    if (!params.locale) {
      const baseURLs = config.baseURLs ?? ["/"];
      const foundBaseURL = baseURLs.find(
        (baseURL) => url.pathname === baseURL || baseURL === `${url.pathname}/`
      );

      if (!foundBaseURL) {
        return;
      }

      const locale =
        findLocale(cookie.get(cookieName)?.value) ||
        getAcceptLanguageLocale(headers.get("accept-language")) ||
        config.defaultLocale ||
        config.locales[0];

      if (locale) {
        const redirectURL = foundBaseURL.endsWith("/")
          ? `${foundBaseURL}${locale}${url.search}`
          : `${foundBaseURL}/${locale}${url.search}`;
        throw redirect(307, `${qloOrigin}${redirectURL}`);
      }

      return;
    }

    if (!config.locales.includes(params.locale)) {
      throw error(404, "Not found");
    }

    const qloHostname = new URL(qloOrigin).hostname;
    if (url.hostname !== qloHostname) {
      throw redirect(307, `${qloOrigin}${url.pathname}${url.search}`);
    }

    if (config.cookieOptions) {
      const cookieLocale = findLocale(cookie.get(cookieName)?.value);
      if (!cookieLocale || cookieLocale !== params.locale) {
        cookie.set(cookieName, params.locale, config.cookieOptions);
      }
    }

    locale(params.locale);
    return;
  };
};
