@AGENTS.md

# TOEIC-Trainer — Claude Code only

Project rules are in `AGENTS.md` above (shared with Cline).
Cross-project house rules are in `~/.agents/AGENTS.md`.
Everything below is Claude-Code-specific.

## Agent roles — `.claude/agents/`

None. This project is small enough to run from the main session; don't create
subagent roles here until there is a reason.

## Division of labour

Cline is **opted in** here (AGENTS.md rule 3), and this is the repo where it earns its
keep: a 19,800-line bundled `index.html` is exactly the whole-file read that should go
to Gemini's 1M context rather than being paged through here.

## High-risk files

- `index.html` — one file *is* the product. Always confirm the diff before Keep, and
  never let a search-and-replace run across the bundled `node_modules/...` regions
  (AGENTS.md rule 2).
