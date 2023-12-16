import {
  Link as QwikLink,
  LinkProps,
  useLocation,
} from "@builder.io/qwik-city";
import { Slot, component$, useComputed$ } from "@builder.io/qwik";
import { useQLOConfig } from "./context";

export const Link = component$(({ href, ...props }: LinkProps) => {
  const config = useQLOConfig();
  const location = useLocation();
  const computedHref = useComputed$(() => {
    if (
      !href ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      !href.startsWith("/")
    ) {
      return href;
    }

    const {
      params: { locale },
      url: { pathname },
    } = location;

    if (!locale) {
      return href;
    }

    const baseURLs = config.baseURLs ?? ["/"];
    const foundBaseURL = baseURLs
      .map((url) => (url.endsWith("/") ? url : `${url}/`))
      .find(
        (baseURL) =>
          pathname.startsWith(baseURL) ||
          pathname === baseURL ||
          pathname === baseURL.replace(/\/$/, "")
      );

    if (!foundBaseURL) {
      return href;
    }

    return `${foundBaseURL}${location.params.locale}${href}`;
  });

  return (
    <QwikLink href={computedHref.value} {...props}>
      <Slot />
    </QwikLink>
  );
});
