# Mindfort

**Build a world of knowledge.** A visual, grid-based 2D memory palace builder for students.

## Run

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

For production:
```bash
npm run build
npm run preview
```

## Features (v0.2)

- Full React 19 + TypeScript + Vite application.
- Draw rectangular rooms by clicking and dragging on a 24 × 16 grid.
- Choose room names and floor colors; move empty rooms by dragging.
- Place 12 furniture types and reposition furniture precisely on individual grid cells; rotate items.
- Attach concepts, explanations, vivid associations, and active recall questions to furniture.
- Review concepts with a question-first reveal and remembered/forgotten tracking.
- Create multiple separate fortresses. Includes an example Operating Systems house.
- Undo and redo the most recent 30 editor changes; grid zoom and responsive tool panels.
- Browser-local persistence, JSON import/export backups, no login or backend.

## How to build a memory house

1. Create a fortress for a subject, or open the Operating Systems example.
2. Choose **Draw a room**, then drag a rectangle on an empty grid.
3. Choose **Place furniture**, select an item, then click an empty cell inside a room.
4. Select the furniture and choose **Attach memory**. Record the concept, a short explanation, an imaginative spatial association, and a recall question.
5. Use **Practice recall** to hide answers and attempt retrieval before revealing them.

Tip: associate ideas with vivid, unusual events rather than plain labels. Example: four chefs sharing one refrigerator symbolizes threads sharing process memory.

## Hosting

Deploy as a **Vite app** to Cloudflare Pages or another static host.
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required.

For GitHub Pages, configure a build/deploy action that publishes `dist`. Do **not** deploy the source branch root directly; unlike v0.1 this app needs a build step. Vite `base: './'` supports relative asset paths.

## Data and privacy

Data lives in `localStorage` on the current browser/device. Clearing site data removes the stored fortress. Always export a backup before clearing storage or changing devices. There is currently no account sync or server. An imported backup replaces the current data after confirmation.

**Current limitations:** rooms are rectangles on a fixed-size grid; furniture occupies one logical cell; the editor has no character walking or 3D rendering. Room movement is restricted to empty rooms. Recall attempts are self-rated, not a scientifically calibrated memory score.

## Tests

`npm test` runs model geometry and validation tests with Node's built-in test runner (no test framework needed).

## Prior prototype

The first dependency-free single HTML prototype remains in the `main` branch until this new implementation is reviewed and merged.
