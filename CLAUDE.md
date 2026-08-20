@AGENTS.md

# TOEIC-Trainer — Claude Code only

Project rules are in `AGENTS.md` above (shared with Cline).
Cross-project house rules are in `~/.agents/AGENTS.md`.
Everything below is Claude-Code-specific.

## Agent roles — `.claude/agents/`

| Role | Model | Owns | Route to it when |
|---|---|---|---|
| `bundle-surgeon` | sonnet | The only role that edits `src/app.jsx`; runs the build; `VERSION` + commit-subject bump | Any code change |
| `content-auditor` | opus | TOEIC item correctness — answer keys, distractors, Thai explanations, Part 1-7 format | "Is this question actually right / actually TOEIC-shaped" |
| `prompt-smith` | opus | The ~12 prompt builders + the `parseLooseJson` repair chain | Generation quality or parse-failure work — with measured before/after counts |
| `data-safety` | sonnet | `toeic_*` storage keys, SRS scheduling, backup checksum | Any diff touching a persist path, **before** it ships |

Only `bundle-surgeon` writes to `src/app.jsx`. The other three produce findings and hand
them over — that separation is the point, not an inconvenience.

These files carry **no version-pinned status**. Current version, open tasks and the
mistakes list live in `AGENTS.md`; a role file that copies them goes stale at the next
bump.

## Division of labour

Cline is **opted in** here (AGENTS.md rule 3), and this is the repo where it earns its
keep: `src/app.jsx` is ~12,300 lines in one file, exactly the whole-file read that should
go to Gemini's 1M context rather than being paged through here.

## High-risk files

- `src/app.jsx` — one file *is* the product. Always confirm the diff before Keep.
- `index.html` — generated. Never edit it; `npm run build` writes it and `npm run verify`
  proves it still matches the source (AGENTS.md rule 2).
