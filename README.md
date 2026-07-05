# Catfolio 🐱

A small React Native app for building your own gallery of cats. You can upload photos, favourite the ones you love, and vote them up or down. It's built with Expo and [TheCatAPI](https://thecatapi.com).


## What it does

- **Upload** a cat photo from your device (`/upload`), with client-side validation and a friendly error if something goes wrong.
- **Browse** everything you've uploaded in a responsive two-column gallery (`/`).
- **Favourite / unfavourite** any cat with the heart button.
- **Vote** a cat up or down (scores run 1 to 10) and see the score update instantly.
- **Delete** a cat, view it full-screen (pinch to zoom), and pull to refresh.
- **Light and dark themes**, toggled from Settings and remembered between launches.

## Tech stack

| | |
|---|---|
| **Expo (SDK 54) + Expo Router** | file-based routing gives clean `/`, `/upload`, `/cat/[id]` routes and works in Expo Go |
| **TanStack Query** | server state, caching, and optimistic updates for votes, favourites and delete |
| **axios** | one configured client with the API key, a persistent `sub_id`, and error normalisation |
| **expo-image / expo-image-picker** | fast cached images (never stretched) and the device photo picker |
| **AsyncStorage** | persists the `sub_id` and the theme choice |
| **Reanimated + gesture-handler** | the pinch-to-zoom image viewer |
| **Jest + Testing Library** | unit tests for the scoring and voting logic, plus a couple of components |

## Getting started

You'll need Node 22 and a free API key from [thecatapi.com](https://thecatapi.com).

```bash
npm install

# add your API key
cp .env.example .env
# then set EXPO_PUBLIC_CAT_API_KEY=... in .env

npm run ios      # or: npm run android / npm run web
```

Or run `npx expo start` and open it in Expo Go. Without a key the app shows a banner telling you to add one, rather than failing silently.

## Tests

```bash
npm test
```

## Project structure

```
app/                 Expo Router screens
  (tabs)/            gallery, upload, favorites, settings
  cat/[id].js        cat detail + full-screen viewer
  _layout.js         providers (query client, theme, safe area) + navigation
src/
  api/               axios client + TheCatAPI endpoints
  hooks/             TanStack Query hooks (images / favourites / votes)
  components/         reusable UI (cards, header, pills, states, toasts)
  theme/             design tokens + light/dark provider
  utils/             helpers (score, sub_id, image validation, columns)
constants/config.js  API base URL + key
__tests__/           jest tests
```

## A few notes on decisions

- **`sub_id`**: TheCatAPI scopes favourites and votes to a `sub_id`, so the app generates one on first launch and persists it. That's how "your" cats, favourites and votes stay consistent.
- **Scoring**: the API stores a single vote per cat, so voting sends an absolute value (1 to 10) and the score is read from the latest vote rather than summing. That keeps it stable across refreshes.
- **No cat names**: TheCatAPI has no field to store a name, so I kept the UI to what the API can actually back, which is the image, favourite, score and votes.
- **Theming**: colours live in one place and every component reads them through a `useTheme()` hook, so light and dark switch instantly across the whole app.

## If I had more time

- Wire up pagination for very large galleries.
- Add a proper end-to-end test for the upload to gallery flow.
- Replace the placeholder settings artwork with a real illustration.
