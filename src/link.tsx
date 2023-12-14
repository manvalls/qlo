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

    const baseURLs = config.baseURLs ?? ["/"];
    const foundBaseURL = baseURLs
      .map((url) => (url.endsWith("/") ? url : `${url}/`))
      .find(
        (baseURL) =>
          location.url.pathname.startsWith(baseURL) ||
          location.url.pathname === baseURL ||
          location.url.pathname === baseURL.replace(/\/$/, "")
      );

    if (
      !foundBaseURL ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      !href.startsWith("/")
    ) {
      return href;
    }

    return `${foundBaseURL}${href.replace(/^\//, "")}`;
  });

  return <QwikLink href={computedHref.value} {...props} />;
});
