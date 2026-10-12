# Lean Six Sigma Learning Experience Demo

A frontend-only Lean Six Sigma White Belt demo with an animated 3D wireframe intro and a single question about the Measure phase of DMAIC. The bundled `Intro_1.wav` narration plays on the intro, with native controls to pause or replay it.

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

## Cloudflare Pages

The source repository can remain private. Connect it to Cloudflare Pages with the GitHub integration, then use:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

In the Cloudflare Pages project, open **Settings > Variables and Secrets** and add an encrypted production secret named `SITE_PASSWORD`. Set it to a strong shared passphrase. The Pages middleware protects the page and static assets with the browser's native password prompt; enter any username and the shared password.

Do not add the password to this repository. Anyone who receives the password can share it with others, so change the Cloudflare secret to revoke access.
