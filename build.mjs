// Build: src/app.jsx  ->  index.html
//
// The flags below are not a guess. They were recovered by rebuilding v0.109.3 from
// source and comparing against the index.html that shipped for that version
// (git 91348ed) until the two matched byte for byte. Changing any of them changes
// the output, so change them only on purpose:
//
//   stdin (not an entry file)  the original build piped one file in, which is why the
//                              output carries a `// <stdin>` module comment
//   target: es2017             lowers object spread to __spreadValues and ?./?? to temp
//                              vars, exactly as the shipped bundle does
//   NODE_ENV=production        pulls React's *.production.min.js files into the bundle
//   legalComments: none        drops the React license banner esbuild would append
//   react/react-dom 18.3.1     pinned in package.json; other versions change the output
//
// The app mount lives at the bottom of src/app.jsx (plain React.createElement, not JSX —
// `<App />` would compile to createElement(App, null) and no longer match).

import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";

const OUT = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : "index.html";

const source = await readFile("src/app.jsx", "utf8");

const result = await build({
  // No `sourcefile`: esbuild names stdin `<stdin>` on its own, and setting it explicitly
  // alongside resolveDir yields `src/<stdin>` in the output comment instead.
  stdin: { contents: source, loader: "jsx", resolveDir: "src" },
  bundle: true,
  format: "iife",
  target: "es2017",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "none",
  write: false,
});

const bundle = result.outputFiles[0].text;
const template = await readFile("index.template.html", "utf8");
// Replacer function, not a string: React's bundle contains `$$typeof`, and a string
// replacement would read `$$` as an escaped `$` and silently ship `$typeof` instead.
const html = template.replace("__BUNDLE__\n", () => bundle);

// Always LF. Git stores this file with LF (core.autocrlf hands the working copy CRLF),
// and writing CRLF here would show up as a whole-file diff on every build.
await writeFile(OUT, html.replace(/\r\n/g, "\n"), "utf8");

const version = source.match(/const VERSION = "([^"]+)"/)?.[1] ?? "unknown";
console.log(`built v${version} -> ${OUT}  (${html.split("\n").length} lines)`);
