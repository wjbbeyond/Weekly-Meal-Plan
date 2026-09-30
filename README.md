# Weekly-Meal-Plan

A local weekly meal planner using preset dishes, without AI calls or API keys. Plans and language are saved in browser storage. Clearing requires confirmation. Storage may be unavailable; export before closing if a warning appears.

## Develop and verify

Node 22.13+ LTS, 24 LTS, or 26+.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
```

Tests use fake model responses and never call paid APIs. Tailwind CSS is compiled locally. Build output uses relative asset paths for static subdirectory hosting; publish only `dist/` when separately authorized. No deployment workflow is included.
