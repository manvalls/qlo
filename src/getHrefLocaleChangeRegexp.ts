import { RouteLocation } from "@builder.io/qwik-city";
import { QLOConfig } from "./config";

export default function getHrefLocaleChangeRegexp(
  location: RouteLocation,
  config: QLOConfig
) {
  const baseURLs = config.baseURLs ?? ["/"];
  const {
    url: { origin },
    params: { locale },
  } = location;

  return new RegExp(
    `(${origin.replace(/\//g, "\\/").replace(/\./g, "\\.")}(?:${baseURLs
      .map((baseURL) => baseURL.replace(/\//g, "\\/"))
      .join("|")}))\\/?${locale}(?=/|\\?|$)`
  );
}
