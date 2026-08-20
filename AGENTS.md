# TOEIC-Trainer — project rules

Read this before touching any file in this project.
Cross-project house rules live in `~/.agents/AGENTS.md` and apply here too.

---

## Project-specific hard rules

1. **No design doc, no lock ritual.** This project has no locked spec — house rules 1
   and 2 (locked design, version-bump ritual) **do not apply here**. Versioning is a
   `VERSION` constant in `src/app.jsx` plus a `vX.Y.Z: <what changed>` commit subject.
   Bump both together or neither.
2. ⚠️ **`src/app.jsx` is the source. `index.html` is build output — never hand-edit it.**
   Every code change goes into `src/app.jsx`, then `npm run build` regenerates
   `index.html`, and both are committed together. `npm run verify` re-builds and compares;
   CI runs it before deploying, so a hand-edit to `index.html` fails the build rather than
   shipping. The esbuild flags in `build.mjs` were recovered by rebuilding v0.109.3 until
   it matched the shipped bundle byte for byte — treat them as load-bearing.
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
| `src/app.jsx` | **The source.** One file, ~12,300 lines. `VERSION` near the top; the mount call at the bottom is what esbuild consumes as its entry |
| `build.mjs` | `npm run build` — esbuild + inline into the HTML shell. Flags are documented in the file and are not free to change |
| `scripts/verify-build.mjs` | `npm run verify` — rebuilds and compares against `index.html`, or against `index.html` at a given git revision |
| `index.template.html` | The 16-line HTML shell; `__BUNDLE__` marks the injection point |
| `index.html` | Build output, committed so the file stays directly openable. Never edited by hand |
| `Version/` | The v0.109.3 JSX exported from the original Claude Artifact, kept as provenance |
| `.github/workflows/pages.yml` | Pages deploy. Fires on **push to `main` only** — work on a branch stays undeployed until merged. Runs `npm run verify` first |

---

## Status

Live at v0.110.0, built from `src/app.jsx`. The source is in the repo and `npm run verify`
passes, so the long-running "get the source in with a real build step" task is closed.

Open:

1. Split `src/app.jsx` into modules (prompts, storage/SRS, banks, UI). Safe to attempt now
   that the build can prove a split changed nothing — that proof was the reason to wait.

---

## ⛔ Mistakes already made and corrected — do not repeat

<!-- Add an entry every time a correction costs more than five minutes. -->

1. **Don't build the HTML with `String.replace(marker, bundle)`.** JavaScript reads `$$`
   in a *replacement string* as an escaped `$`, so React's `$$typeof` silently shipped as
   `$typeof` and the bundle was dead on arrival. `build.mjs` passes a replacer function
   instead. `npm run verify` is what caught it.
2. **v0.110.0 was hand-typed into the bundle, so it can never be byte-reproduced.** It
   carries literal Thai where esbuild emits `\uXXXX`, hand indentation, and one local named
   `now2`. Equivalence there was proved by minifying both sides and comparing; every
   version after it is byte-comparable normally.
