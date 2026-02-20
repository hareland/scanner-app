# Capacitor Scanner App


# Running locally

## 1. Install dependencies

```bash
npx giget@latest gh:hareland/scanner-app
```

> Then from the root of the project:
```bash
pnpm i && cd electron && npm i && cd ..
```

## 2. Run dev 
```bas
pnpm dev --host=0.0.0.0
```

## 3. Run app

### iOS

> Ensure that you have set a Team ID in Xcode -> if you are not on mine.

```bash
npx cap run ios [--live-reload] [--target=<deviceUUID>]
```

### Electron

> This MUST be run while `pnpm dev --host=0.0.0.0` OR AFTER `pnpm generate`

```bash
npx cap open electron
```