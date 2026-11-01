# Mindfort

**Give every idea a place to live.** A spatial memory palace built on the real [Excalidraw](https://excalidraw.com/) React editor.

## Get started

Requires Node.js 22.

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## What changed

Mindfort now embeds the **official Excalidraw editor**. The drawing canvas, toolbar, freehand drawing, shapes, lines, text, selection, pan, zoom, undo/redo, exports and shape styling are native Excalidraw functionality, rather than a lookalike UI.

Mindfort provides the learning layer:
- Create and manage multiple independent knowledge fortresses.
- Draw a floor plan with rectangles, doors, furniture symbols, notes, and arrows; use the normal Excalidraw UI and shortcuts.
- Select **one shape** to attach a concept, explanation, vivid visual association, and question.
- Switch to Recall to test yourself, reveal the answer, and record a remembered/forgotten review.
- Autosave scenes and memory associations locally; export an individual scene or an all-fortresses backup.
- Convert earlier rectangular-room and furniture data on first open. Original legacy element IDs are preserved so associations still work.

## Backups and privacy

This MVP is local-only. Data is stored on this browser's `localStorage`. There are no user accounts, server sync, or automatic cross-device backups. If you clear browser data or switch devices without exporting a backup, work may be lost.

The home page's **Export all** action produces `mindfort-all-fortresses.json`, which includes all fortress metadata, Excalidraw elements, attached memories and scene assets. Use **Import** to restore it; importing replaces existing local data after confirmation.

The editor's **Export scene** creates a single scene file with Mindfort memory associations for safekeeping. It is different from Excalidraw's standard image export.

## Known limitations

- Visual memory anchors attach to individual Excalidraw elements, not groups.
- Scene export is a backup; the current import action accepts full workspace backups.
- There is no collaborative editing, cloud sync, memory schedule, or automatic memory scoring.
- Browser storage has a finite quota. Large inserted images may exhaust it. Use export backups frequently.
- For a blank fortress, use Excalidraw's rectangle tool to draw rooms; freehand arrangement is intentional rather than constrained by a house grid.

## Develop & test

```bash
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

GitHub Actions validates the TypeScript build, geometry tests, and Chromium end-to-end workflows.

## Deployment

Cloudflare Pages: build command `npm run build`, output directory `dist`. This is a static Vite app, without backend environment variables.

Excalidraw is MIT licensed. Keep its upstream attribution and follow its license when redistributing code.

## Public website launch

The `.github/workflows/pages.yml` workflow builds and deploys `main` to GitHub Pages. To enable this once, open the repository's **Settings → Pages** and select **GitHub Actions** as the build-and-deployment source. GitHub must allow Pages deployment for the repository. The expected project URL is https://channi23.github.io/mindfort/ after a successful deployment; do not assume the URL is live until the Pages action succeeds.

SEO basics are included: descriptive HTML title and description, canonical URL, Open Graph metadata, WebApplication JSON-LD, `robots.txt`, `sitemap.xml`, and an original [memory palace guide](./public/memory-palace-guide.html). Search visibility and rankings are not guaranteed. Google Search Console requires ownership verification from the site owner.

A [privacy page](./public/privacy.html) explains local storage and current third-party usage. No ad tracking or AdSense script is included. If ads are added later, update privacy disclosures, request any legally required user consent, and ensure AdSense approval before serving advertisements. GitHub Pages hosting itself is not a promise of ad-network approval.
