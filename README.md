# Capacitor Scanner App

Scan, save and create QR codes and barcodes. A static Nuxt SPA wrapped by Capacitor for iOS, and it runs in a browser
too.

- **App shell**: [`@frigear-nu/mobile`](https://docs.frigear.dev/modules/interface/mobile) — one tab list (`mobile.tabs`
  in `nuxt.config.ts`) for the native iOS tab bar and navbar
  ([`@capgo/capacitor-native-navigation`](https://github.com/Cap-go/capacitor-native-navigation)) and the web header
  and tab bar in a browser. The tab bar hides while a sheet or dialog is open. Haptics, confirm, action sheets and
  share go through `useNative()`. It builds on [`nuxt-capacitor`](https://github.com/hareland/nuxt-capacitor), which
  writes `capacitor.config.json` from `nuxt.config.ts` (don't edit or commit it).
- **UI**: [Konsta UI](https://konstaui.com/vue) for the native-feeling pieces (lists, sheets, dialogs),
  [Nuxt UI](https://ui.nuxt.com) and [`@frigear-nu/ui`](https://docs.frigear.dev/modules/interface/ui) for forms,
  buttons, toasts and patterns.

## Running locally

Uses [pnpm](https://pnpm.io).

```bash
pnpm dlx giget@latest gh:hareland/scanner-app
```

```bash
pnpm install
```

### Browser

```bash
pnpm dev
```

### iOS

Needs Xcode. Swift Package Manager, no CocoaPods. Set your Team under Signing & Capabilities in Xcode if you are not on
mine (don't commit it).

```bash
pnpm ios:run
```

That generates the SPA, syncs it into `ios/App/App/public` and launches on a simulator or device you pick. Or sync and
open Xcode yourself:

```bash
pnpm ios:sync && pnpm ios:open
```

Run `pnpm ios:sync` after every `pnpm install`: the Swift packages point into `node_modules`. `pnpm ios:doctor` lists
missing Capacitor plugins.

For live reload on a device, run the dev server on your network and point the app at it:

```bash
pnpm dev --host=0.0.0.0
```

```bash
pnpm cap run ios --live-reload
```
