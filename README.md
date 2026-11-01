# Mindfort

**Build a world of knowledge.** An interactive memory palace designed for studying. Turn everyday places into memorable associations and practice active recall.

## Try it

The app lives in `index.html`. Open it in a modern browser or host it on any static web server.

For a local development server:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080.

## What's in the MVP

- Create multiple subject fortresses.
- Three rooms: kitchen, bedroom, living room.
- Fifteen object anchors per fortress, including a refrigerator, cupboard, bed and bookshelf.
- For each anchor, save a concept title, explanation, vivid mental association and recall question.
- Recall mode hides the answer first, then lets you self-grade remembered / revisit.
- Operating Systems sample memories show how to associate threads, mutexes, processes and virtual memory with household objects.
- Browser-only local storage and downloadable JSON backups; no signup or servers.

## Deploy with GitHub Pages

1. Go to the repository's **Settings → Pages**.
2. Choose **Deploy from a branch**.
3. Select the `main` branch and `/(root)` folder and save.
4. GitHub Pages will show the published URL when the build completes.

You can also deploy directly to Cloudflare Pages as a static site. No build command is required; use the root directory.

## Privacy and important limits

Data is saved to the current browser's `localStorage` only. **Clearing site data or switching devices can lose your work.** Export a JSON backup regularly and use Import to restore it. There is no cloud sync or cross-device account in this MVP.

Review counts are not scientifically calibrated recall probabilities, and self-grades are not objective tests. This project demonstrates a combination of spatial associations and retrieval practice. It does not guarantee improved memory.

## Next development priorities

1. Replace emoji room layout with bespoke SVG/isometric scene illustrations, while preserving accessible furniture buttons.
2. Add a richer visual association editor (drawings or user-supplied images).
3. Create a more deliberate review queue using spaced-repetition scheduling.
4. Provide import/export conflict handling and better accessibility testing.
5. Run usability tests before adding educational articles or unobtrusive advertisements.

## Stack

Dependency-free HTML, CSS and modern JavaScript. No build step and no external analytics or ad scripts.