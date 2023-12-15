import {
  Link as QwikLink,
  LinkProps,
  useLocation,
} from "@builder.io/qwik-city";
import { Slot, component$ } from "@builder.io/qwik";
import { useQLOConfig } from "./context";
import getHrefLocaleChangeRegexp from "./getHrefLocaleChangeRegexp";

export type LocaleLinkProps = Omit<LinkProps, "href"> & {
  locale: string;
};

export const LocaleLink = component$(
  ({ locale, ...props }: LocaleLinkProps) => {
    const location = useLocation();
    const config = useQLOConfig();
    const regexp = getHrefLocaleChangeRegexp(location, config);
    const href = location.url.href.replace(regexp, `$1${locale}`);

    return (
      <QwikLink href={href} {...props}>
        <Slot />
      </QwikLink>
    );
  }
);
