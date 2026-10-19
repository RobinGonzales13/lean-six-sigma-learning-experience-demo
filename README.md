# Lean Six Sigma Learning Experience Demo

A desktop-first Lean Six Sigma learning demo with an ILE Dashboard, animated blue digital background, RCA training, an animated 3D corridor, bundled lesson narrations, two lesson screens with Back/Next navigation, and a final selectable-answer quiz. If the browser blocks autoplay, use the native audio controls or the visible Play narration fallback. The quiz submit button is visual-only for this demo.

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
