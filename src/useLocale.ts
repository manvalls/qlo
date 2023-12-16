import { useComputed$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useQLOConfig } from "./context";

export const useLocale = () => {
  const location = useLocation();
  const config = useQLOConfig();

  return useComputed$(() => {
    const locale = location.params.locale;
    if (locale) {
      return locale;
    }

    return config.defaultLocale || config.locales[0];
  });
};
