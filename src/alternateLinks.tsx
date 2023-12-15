import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useQLOConfig } from "./context";
import getHrefLocaleChangeRegexp from "./getHrefLocaleChangeRegexp";

export const AlternateLinks = component$(() => {
  const location = useLocation();
  const config = useQLOConfig();
  const regexp = getHrefLocaleChangeRegexp(location, config);

  return (
    <>
      {config.locales
        .filter(
          (locale) =>
            location.params.locale && locale !== location.params.locale
        )
        .map((locale) => {
          const href = location.url.href.replace(regexp, `$1${locale}`);
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
