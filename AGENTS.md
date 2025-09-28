# Repository Guidelines

## Project Structure & Module Organization
- Monorepo uses npm workspaces: packages/frontend (Next 14) and packages/backend (Express + Sequelize); shared docs and scripts live at the root.
- Backend source under packages/backend/src/{controllers,services,routes,models,migrations,utils} with Sequelize setup in src/config.
- Frontend lives in packages/frontend/src; App Router pages sit in pp/, shared UI in components/, API helpers in lib/, mock fixtures in data/, and Tailwind tokens in styles/.
- Secrets stay in local .env / .env.local; never commit populated copies.

## Build, Test, and Development Commands
- 
pm install (root) installs every workspace; run package scripts via 
pm run <script> --workspace <name>.
- 
pm run dev:backend starts the API on port 5000; 
pm run dev:frontend launches the Next dev server on port 3000.
- 
pm run migrate --workspace backend runs Sequelize migrations; migrate:undo rolls back, seed hydrates baseline data.
- 
pm run build --workspace frontend plus 
pm run start --workspace frontend emulate production; 
pm run lint --workspace frontend enforces ESLint/Next.

## Coding Style & Naming Conventions
- Apply 2-space indentation; camelCase for variables/functions, PascalCase for React components, snake_case for persisted columns mapped through Sequelize.
- Keep REST handlers in src/routes/<resource>.route.js, pair business logic in src/services, and prefer thin controllers.
- Use functional React components with hooks; colocate route-specific UI under src/app/<segment> and share primitives from components/.

## Testing Guidelines
- Manual smoke scripts (	est-api.js, 	est-session.js) run with 
ode <file> once backend and frontend are active.
- Backfill automated coverage with Jest specs under packages/backend/tests, mirroring src and naming files <feature>.spec.ts.
- Frontend tests belong in packages/frontend/src/__tests__ with React Testing Library and .test.tsx suffixes.
- Target >80% coverage on authentication, scheduling, and payment flows; document remaining manual steps in PRs.

## Commit & Pull Request Guidelines
- Follow existing history: concise, imperative commit subjects like “Fix build errors completely”; use bodies for rationale or breaking changes.
- PRs must include a summary, verification steps (
pm run lint, relevant Node scripts), UI evidence when visuals change, and linked issues.
- Highlight migrations or env changes with rollout/rollback notes and rebase on main before requesting review.

## Security & Configuration Tips
- Rotate Google API credentials per GOOGLE_CALENDAR_SETUP.md; never store secrets in source control.
- Confirm .next, 
ode_modules, dumps, and .env* stay untracked via git status before pushing.
