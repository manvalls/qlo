import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useQLOConfig } from "./context";

export const AlternateLinks = component$(() => {
  const location = useLocation();
  const config = useQLOConfig();
  const baseURLs = config.baseURLs ?? ["/"];
  const regexp = new RegExp(
    `(${location.url.origin
      .replace(/\//g, "\\/")
      .replace(/\./g, "\\.")})(${baseURLs
      .map((baseURL) => baseURL.replace(/\//g, "\\/"))
      .join("|")})\\/?${location.params.locale}(?=/|\\?|$)`
  );

  return (
    <>
      {config.locales
        .filter(
          (locale) =>
            location.params.locale && locale !== location.params.locale
        )
        .map((locale) => {
          const href = location.url.href.replace(regexp, `$1$2${locale}`);
          return (
            <link
              rel="alternate"
              hreflang={locale}
              href={href}
              key={locale}
            ></link>
          );
        })}
    </>
  );
});
