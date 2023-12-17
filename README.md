# Qwik locale utils (QLO)

TL;DR: check the [reference app](https://github.com/manvalls/qlo-qwik-app/tree/main)

## Setup guide

Add a config file:

```javascript
// qloconfig.ts
export default {
  locales: ["en", "es"],
  defaultLocale: "en",
};
```

Add the middleware to your root layout:

```javascript
// layout.tsx
import { qloMiddleware } from "qlo";
import qloConfig from "~/qloconfig";

export const onGet: RequestHandler = async (ev) => {
  // ...
  return qloMiddleware(qloConfig)(ev);
};
```

Set the `lang` attribute from `opts.locale` in your entry file:

```javascript
// entry.ssr.tsx
// ...

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      lang: opts.locale + "",
      ...opts.containerAttributes,
    },
  });
}
```

Add `QLOProvider` under `QwikCityProvider` and `AlternateLinks` under `head` to your root:

```javascript
// root.tsx
import qloConfig from "./qloconfig";
import { AlternateLinks, QLOProvider } from "qlo";

export default component$(() => {
  return (
    <QwikCityProvider>
      <QLOProvider config={qloConfig}>
        <head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
          <AlternateLinks />
          <RouterHead />
          <ServiceWorkerRegister />
        </head>
        <body>
          <RouterOutlet />
        </body>
      </QLOProvider>
    </QwikCityProvider>
  );
});
```

Place all your pages under `src/routes/[locale]` and create an empty file at `src/routes/index.ts`:

```javascript
// src/routes/index.ts
// Will get redirected to the correct locale
// by QLO's middleware
```

## Usage

### `loadTranslation`

Function used to load translations within route loaders:

```javascript
import { loadTranslation } from "qlo";

export const useThing = routeLoader$(async (ev) => {
  const t = await loadTranslation(ev, {
    en: () =>
      Promise.resolve({
        greeting: "Hello",
      }),
    es: () =>
      Promise.resolve({
        greeting: "Hola",
      }),
  });

  console.log(t.greeting); // "Hello" or "Hola" depending on the locale
});
```

### `useTranslation`

Hook used to load translations within components:

```javascript
import { component$, $ } from "@builder.io/qwik";
import { useTranslation } from "qlo";

export default component$(() => {
  const t = useTranslation(
    {
      greeting: "", // Initial state
    },
    {
      en: $(() => ({
        greeting: "Hello",
      })),
      es: $(() => ({
        greeting: "Hola",
      })),
    }
  );

  return <div>{t.greeting}</div>; // "Hello" or "Hola" depending on the locale
});
```

### `useLocale`

Hook used to get the current locale:

```javascript
import { component$ } from "@builder.io/qwik";
import { useLocale } from "qlo";

export default component$(() => {
  const locale = useLocale();

  return <div>{locale.value}</div>; // "en" or "es" depending on the locale
});
```

### `Link`

Drop-in replacement for Qwik City's `Link` component that adds the current locale to the URL:

```javascript
import { component$ } from "@builder.io/qwik";
import { Link } from "qlo";

export default component$(() => {
  return <Link href="/page">Click me</Link>; // "/en/page" or "/es/page" depending on the locale
});
```

### `LocaleLink`

Generates a link replacing the current locale with the one provided:

```javascript
import { component$ } from "@builder.io/qwik";
import { LocaleLink } from "qlo";

export default component$(() => {
  return <LocaleLink locale="es">Ver esta página en Español</LocaleLink>;
});
```
