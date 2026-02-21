# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React project. Main code lives in `src/`:

- `src/main.jsx` bootstraps the app, and `src/App.jsx` composes the main screen.
- `src/components/` contains gameplay and UI components (shared UI is in `src/components/ui/`).
- `src/hooks/` holds stateful logic (`useUpgradeState.js`).
- `src/services/` contains pure game logic (`upgradeRules.js`).
- `src/data/` stores upgrade definitions and constants (`src/data/constants/`).
- `public/` stores banana image assets; `dist/` is build output (do not edit directly).

## Build, Test, and Development Commands

- `npm ci`: install dependencies from `package-lock.json`.
- `npm run dev`: start local dev server with HMR.
- `npm run build`: produce production bundle in `dist/`.
- `npm run preview`: serve the built app locally.
- `npm run lint`: run ESLint across the repository.
- `npm run format`: apply Prettier formatting.

Deployment is automated by `.github/workflows/deploy.yml` on pushes to `main`, publishing `dist/` to GitHub Pages.

## Coding Style & Naming Conventions

- Use functional React components and ES modules.
- Follow Prettier config: 2-space indent, `singleQuote: true`, semicolons, trailing commas, `printWidth: 80`.
- Run `npm run format` before committing, especially after UI or refactor changes.
- File naming:
  - Components: `PascalCase.jsx` (example: `UpgradePanel.jsx`)
  - Hooks: `useSomething.js` (example: `useUpgradeState.js`)
  - Constants/data modules: `camelCase.js` in `src/data/constants/`
- Keep game rules in `src/services/` and avoid embedding them in UI components.

## Testing Guidelines

There is currently no automated test suite configured. Before opening a PR:

- Run `npm run format`, `npm run lint`, and `npm run build`.
- Manually verify core flows: click scoring, upgrades, auto spawn, and tier unlock behavior.

If adding tests, prefer Vitest + React Testing Library and place specs alongside source as `*.test.js(x)`.

## Commit & Pull Request Guidelines

- Follow the existing Conventional Commit style seen in history: `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`.
- Keep commits focused and atomic.
- PRs should include:
  - Clear summary of behavior changes
  - Linked issue (if applicable)
  - Notes on manual test coverage performed
