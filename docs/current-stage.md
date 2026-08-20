# Current stage — 2026-08-20

Working session state, per house rule 5. The main session is the only writer of this file.

## Done and pushed

`a5ade44` — four subagent roles in `.claude/agents/`, and an editorial fix to the
`AGENTS.md` Status section.

## Done, pending commit — the unbundling

The last long-running open task is finished: **the source is in the repo and the build is
reproducible.** `npm run verify` returns `OK build matches index.html byte for byte`.

### How it was done

| Step | Result |
|---|---|
| 1. Spike | Rebuilt v0.109.3 from the Artifact export and matched `git show 91348ed:index.html` **byte for byte**, which proved the source authentic and the flags correct at the same time |
| 2. Repo scaffolding | `src/app.jsx`, `build.mjs`, `scripts/verify-build.mjs`, `index.template.html`, `package.json` + lockfile, `.gitignore` |
| 3. Forward-port | The 24 hunks of v0.110.0 (+246/−34) translated back into JSX; proved equivalent, then `index.html` regenerated from source |
| 4. CI | `.github/workflows/pages.yml` runs `npm ci` → `npm run verify` → uploads only `_site/index.html` |
| 5. Docs | `AGENTS.md` rule 2, code layout, Status and mistakes list rewritten; `bundle-surgeon` reworked from bundle surgery to source + build; stale `index.html` references fixed in the other three roles |

### The recovered build recipe

esbuild `--bundle --format=iife --target=es2017 --loader=jsx`,
`--define:process.env.NODE_ENV='"production"'`, `--legal-comments=none`, fed through
**stdin** (hence the `// <stdin>` comment in the output), react/react-dom `18.3.1`,
esbuild `0.25.0`. Every flag is load-bearing and documented in `build.mjs`.

### Two findings worth keeping

- `String.replace(marker, bundle)` mangled React's `$$typeof` into `$typeof` — a dead
  bundle that `npm run verify` caught on its first run. Now a replacer function.
- The shipped v0.110.0 was hand-typed into the bundle, so it cannot be byte-reproduced
  (literal Thai vs `\uXXXX`, hand indentation, a local named `now2`). Equivalence was
  proved by minifying both sides with identifiers preserved: `IDENTICAL`, 2,497,356 bytes
  each. Every version from here on is byte-comparable normally.

### Commit plan (approved, not yet run)

1. `build: recover the JSX source and build index.html with esbuild`
2. `ci: verify index.html against source before deploying Pages`
3. `docs: rules and roles now describe a repo with a build step`

No `VERSION` bump in any of them — behaviour is unchanged, and AGENTS.md rule 1 says bump
the constant and the subject together or neither.

## Open

1. **Split `src/app.jsx` into modules** (prompts, storage/SRS, banks, UI). Waiting for the
   build was the point: a split can now be proved to change nothing by minify-comparing
   `index.html` before and after.
2. **The CI verify step has never run on Linux.** esbuild is deterministic across platforms
   and this build takes its input from stdin, so no paths reach the output — but the first
   push to `main` is what actually proves it. If it fails, revert commit 2 alone; the site
   stays on the previous deploy either way.
