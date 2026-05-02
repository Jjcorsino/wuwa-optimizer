# WuWa Optimizer Modernization Baseline

Date: 2026-05-01

## Toolchain

- Node local: 22.13.1
- CI Node: 24, as configured in `.github/workflows/nuxthub.yml`
- Package manager: pnpm 10.14.0 via `npx --yes pnpm@10.14.0`
- `corepack pnpm` currently fails locally with a package-manager signature error, so local commands should use the pinned `npx` form until Corepack is updated.

## Baseline Checks

- `npx --yes pnpm@10.14.0 install --frozen-lockfile`: pass
- `npx --yes pnpm@10.14.0 check-types`: pass after fixing the importer navigation binding and build scorer call signature.
- `npx --yes pnpm@10.14.0 build`: pass with warnings.
- `npx --yes pnpm@10.14.0 lint`: fails before modernization work due to broad existing stylistic debt, mainly `style/quotes` across data and locale files.

## Current Build Warnings

- Browserslist data is stale.
- OpenCV imports Node built-ins (`fs`, `path`, `crypto`) that Vite externalizes for browser compatibility.
- Large client chunks are produced, including scanner/OpenCV/Tesseract-related code.
- Nuxt link checker reports navigation links with missing text/labels.

## Notes

The lint baseline should be fixed separately from feature work. A repository-wide auto-format would touch thousands of lines and obscure review of import/export and optimizer changes.
