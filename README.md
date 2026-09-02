# VoltRoute

A range-aware EV delivery app built with Expo (React Native), React Native Paper, and react-native-maps.

## Prerequisites

- **Node.js 18+** (check with `node --version`)
- **Expo Go app** on your phone — [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - Your Expo Go app version MUST support **SDK 54**. Check under your profile icon in the app → it'll list supported SDK versions. If it doesn't support 54, uninstall and reinstall Expo Go fresh from the store (don't just tap "Update").
- Your phone and laptop must be on the **same WiFi network**.

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/voltroute.git
cd voltroute
npm install
```

⚠️ **Windows users:** if your Windows username contains a space (e.g. "John Smith"), clone this repo somewhere OUTSIDE your user folder — e.g. `C:\dev\voltroute` instead of `C:\Users\John Smith\...`. Several install commands break on paths with spaces.

## Running the app

```bash
npx expo start -c
```

The `-c` clears the Metro bundler cache — always use it after pulling changes or switching branches, to avoid stale-cache errors.

Scan the QR code with Expo Go (Camera app on iOS, Expo Go's built-in scanner on Android).

## Project structure
src/
├── data/
│ └── mockData.js # hardcoded coordinates: start location, delivery destinations, swap stations
├── hooks/
│ └── useBatterySim.js # battery drain simulation hook
├── logic/
│ ├── smartAccept.js # decides if an order is battery-safe
│ └── routing.js # distance calc + polyline building + closest swap station
└── components/
└── MapComponent.js # live map with GPS, markers, and routing


## Tech stack

- Expo SDK 54
- React Native 0.81.5 / React 19.1.0
- react-native-maps + expo-location (Member 2's part)
- React Native Paper (Member 1's UI part)

## Known gotchas

- **Never mix SDK versions.** If `npx expo start` throws codegen errors mentioning `AndroidSwitchNativeComponent` or similar, it means `node_modules` has packages from two different SDK versions. Fix: delete `node_modules`, `package-lock.json`, and `.expo`, then run `npm install` again.
- Google Maps API key is not yet configured — Android map *tiles* won't render without it, but all GPS/location logic and UI work fine without it for now.
- On Windows, run `npm cache clean --force` if `npx create-expo-app` or `npx expo install` throws a "Could not parse JSON" error — this is a known npm output-parsing bug, not a project issue.

## Branching

Each member works on their own branch:

```bash
git checkout -b member2-backend
```

Push and open a PR to merge into `main` rather than pushing straight to `main`, so others' commits don't get overwritten in a live build.