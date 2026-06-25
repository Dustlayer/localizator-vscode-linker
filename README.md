# Localizator Linker

## Features

Makes it possible to open react-i18n usages to be opened in the localizator app. This extension expects only one `useTranslation` declaration per file and reads the `keyPrefix` from there.

```ts
const { t } = useTranslation(undefined, { keyPrefix: "mainMenu.detailsTab" });
```

Usage like this:

```ts
{
  t("description");
}
```

Becomes a link that can be opened via `CMD + Click` which is then handled by the localizator app.

## Requirements

`Localizator` needs to be installed.

## Release Notes

### 0.0.1

Initial release
