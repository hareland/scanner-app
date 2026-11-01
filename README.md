# Capacitor Scanner App

Scan, save and create QR codes and barcodes. A static Nuxt SPA (`ssr: false`) wrapped by Capacitor for iOS, and it
runs in a browser too.

- **UI**: [Konsta UI](https://konstaui.com/vue) for the native-feeling pieces (lists, sheets, dialogs, the browser
  navbar and tabbar), [Nuxt UI](https://ui.nuxt.com) and [`@frigear-nu/ui`](https://docs.frigear.dev/modules/ui) for
  forms, buttons, toasts and patterns.
- **Native chrome**: on a device the navbar and tab bar are native
  ([`@capgo/capacitor-native-navigation`](https://github.com/Cap-go/capacitor-native-navigation)); they hide while a
  sheet or dialog is open. Confirm, copy, share, open-link and haptics go through Capacitor plugins (`app/lib/native.ts`).
- **Config**: [`nuxt-capacitor`](https://github.com/hareland/nuxt-capacitor) writes `capacitor.config.json` from
  `nuxt.config.ts` (don't edit or commit it).

## Running locally

```bash
npx giget@latest gh:hareland/scanner-app
```

```bash
npm install
```

### Browser

```bash
npm run dev
```

### iOS

Needs Xcode. Swift Package Manager, no CocoaPods. Set your Team under Signing & Capabilities in Xcode if you are not on
mine (don't commit it).

```bash
npm run ios:run
```

That generates the SPA, syncs it into `ios/App/App/public` and launches on a simulator or device you pick. Or sync and
open Xcode yourself:

```bash
npm run ios:sync && npm run ios:open
```

For live reload on a device, run the dev server on your network and point the app at it:

```bash
npm run dev -- --host=0.0.0.0
```

```bash
npx cap run ios --live-reload
```
