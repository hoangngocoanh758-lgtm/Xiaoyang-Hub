# Xiaoyang AI Toolbox (Bilibili Subtitle Extractor)

This is a Vue 3 + Vue Router + Vuex + Tailwind CSS frontend project. The core feature is extracting and converting Bilibili AI subtitles, alongside a navigation page, toolbox entry, portfolio view, and about page.

## Features

- Bilibili AI subtitle parsing and preview
- Export formats (SRT / TXT)
- Navigation page and toolbox entry
- Portfolio and about pages
- Unified header navigation and dynamic page titles

## Tech Stack

- Vue 3
- Vue Router 4
- Vuex 4
- Tailwind CSS
- Vue CLI 5
- Jest + Cypress

## Local Development

pnpm is recommended, npm is also supported.

```bash
pnpm install
pnpm dev
```

or

```bash
npm install
npm run dev
```

## Build and Lint

```bash
npm run build
```

```bash
npm run lint
```

## Tests

```bash
npm run test:unit
```

```bash
npm run test:e2e
```

## Project Structure

```
public/              Static entry
src/
  assets/            Style assets
  components/        UI components
  router/            Router config
  services/          Subtitle parsing and preview logic
  store/             Vuex state management
  views/             Page views
tests/               Unit and E2E tests
```

## Usage

1. Open the toolbox page and enter the subtitle extractor
2. In Bilibili DevTools Network, find the ai_subtitle response JSON
3. Paste the JSON into the input box for automatic parsing and preview
4. Choose the export format and copy or download

## Development Note

- Recommended npm registry mirror: registry.npmmirror.com

## License

This repository is for personal project showcase purposes.
