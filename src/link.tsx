import {
  Link as QwikLink,
  LinkProps,
  useLocation,
} from "@builder.io/qwik-city";
import { component$, useComputed$ } from "@builder.io/qwik";
import { useQLOConfig } from "./context";

export const Link = component$(({ href, ...props }: LinkProps) => {
  const config = useQLOConfig();
  const location = useLocation();
  const computedHref = useComputed$(() => {
    if (!href) {
      return undefined;
    }

    if (
      !location.params.locale ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      !href.startsWith("/")
    ) {
      return href;
    }

    const baseURLs = config.baseURLs ?? ["/"];
    const foundBaseURL = baseURLs
      .map((url) => (url.endsWith("/") ? url : `${url}/`))
      .find(
        (baseURL) =>
          location.url.pathname.startsWith(baseURL) ||
          location.url.pathname === baseURL ||
          location.url.pathname === baseURL.replace(/\/$/, "")
      );

    if (!foundBaseURL) {
      return href;
    }

    return `${foundBaseURL}${location.params.locale}/${href.replace(
      /^\//,
      ""
    )}`;
  });

  return <QwikLink href={computedHref.value} {...props} />;
});
