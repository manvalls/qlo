import {
  createContextId,
  useContext,
  useContextProvider,
  useTask$,
  component$,
  Slot,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { QLOConfig } from "./config";
import { useLocation } from "@builder.io/qwik-city";

const QLOContext = createContextId<QLOConfig>("dev.valls.qlo");
export const useQLOConfig = () => useContext(QLOContext);

export const QLOProvider = component$(({ config }: { config: QLOConfig }) => {
  const location = useLocation();
  useContextProvider(QLOContext, config);

  useTask$(({ track }) => {
    const locale = track(() => location.params.locale) ?? "";

    if (isServer) {
      return;
    }

    document.children[0].setAttribute("lang", locale);
  });

  return <Slot />;
});
