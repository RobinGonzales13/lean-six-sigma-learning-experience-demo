# Lean Six Sigma Learning Experience Demo

A frontend-only Lean Six Sigma White Belt intro with an animated 3D wireframe corridor and the bundled `Intro_1.wav` narration. The browser attempts autoplay; if it blocks audio, select **Begin training** to start it. Native controls remain available to pause or replay.

## Run locally

```sh
npm install
npm run dev
```

## Verify and build

```sh
npm run lint
npm run build
```

## Cloudflare Pages deployment

The GitHub source repository stays private. After authenticating Wrangler with `npx wrangler login`, build and deploy with:

```sh
npm run build
npx wrangler pages deploy dist --project-name lean-six-sigma-learning-experience-demo --branch main
```

Set an encrypted production secret named `SITE_PASSWORD` in the Cloudflare Pages project, or update it with `npx wrangler pages secret put SITE_PASSWORD --project-name lean-six-sigma-learning-experience-demo`. The middleware protects the page and static assets with the browser's native password prompt; enter any username and the shared password.

Do not add the password to this repository. Anyone who receives the password can share it with others, so change the Cloudflare secret to revoke access.
