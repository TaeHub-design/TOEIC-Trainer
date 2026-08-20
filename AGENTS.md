# TOEIC-Trainer — project rules

Read this before touching any file in this project.
Cross-project house rules live in `~/.agents/AGENTS.md` and apply here too.

---

## Project-specific hard rules

1. **No design doc, no lock ritual.** This project has no locked spec — house rules 1
   and 2 (locked design, version-bump ritual) **do not apply here**. Versioning is a
   `VERSION` constant in `index.html` plus a `vX.Y.Z: <what changed>` commit subject.
   Bump both together or neither.
2. ⚠️ **`index.html` is a build artifact, not source.** It is esbuild output with React
   inlined — 2.8 MB, ~19,800 lines, one `// <stdin>` module. The real source is **not in
   this repo**; the app began life as a Claude Artifact (`IS_ARTIFACT` /
   `window.storage` at line ~7277 are the tell). **Never hand-edit the bundled
   `node_modules/...` regions.** Only the `// <stdin>` section (from ~line 7273) is
   this project's own code. Getting the source into the repo is the top open task.
3. **This repo is OPTED IN — Cline may read any file here.** It is a public repo with
   no confidential content and no secrets, so the Gemini free tier's training terms are
   acceptable. This is the **exception** to the house-rules default; the game repos are
   still opted out.
4. **No API keys in the repo.** The app calls Anthropic and Google model endpoints from
   the browser with a key the user pastes in at runtime. A key must never be committed,
   and no `.env` should appear here.

---

## What this is

A single-page TOEIC study app in Thai — React, bundled into one self-contained
`index.html`, served by GitHub Pages. Personal study tool, not a product. Public repo
`TaeHub-design/TOEIC-Trainer`.

---

## Code layout

| File | Notes |
|---|---|
| `index.html` | The whole app. Bundled — see hard rule 2. `VERSION` ~line 7276, app code starts at the `// <stdin>` marker ~line 7273 |
| `.github/workflows/pages.yml` | Pages deploy. Fires on **push to `main` only** — work on a branch stays undeployed until merged |

---

## Status

Live at v0.110.0. `model-refresh-v0.110.0` is merged; `main` is current and deployed.

Open:

1. Get the `<stdin>` source into the repo with a real build step, so edits stop meaning
   surgery on bundled output

---

## ⛔ Mistakes already made and corrected — do not repeat

<!-- Add an entry every time a correction costs more than five minutes. -->

1. *(none yet)*
