# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

## Deployment (GitHub Pages)

Two options are provided:

- Quick (local): install `gh-pages` and run `npm run deploy`.
	1. `npm install -D gh-pages`
	2. `npm run deploy`

- CI (recommended): the repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` which builds and deploys to the `gh-pages` branch automatically on pushes to `main`.

Built assets expect the site base path `/Portfolio-1/` (configured in `vite.config.js`). The Pages URL will be:

		https://Mohamed-Moslemani.github.io/Portfolio-1/


If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
