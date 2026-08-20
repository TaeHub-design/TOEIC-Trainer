// Verify that the committed index.html is what src/app.jsx actually builds to.
//
// Run it before any commit that touches src/ or build.mjs. A clean result means the
// shipped file and the source cannot have drifted apart; that guarantee is the whole
// reason the build exists.
//
//   node scripts/verify-build.mjs            compare against ./index.html
//   node scripts/verify-build.mjs <rev>      compare against index.html at a git revision

import { execFileSync } from "node:child_process";
import { readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const rev = process.argv[2];
const tmp = join(tmpdir(), `toeic-verify-${process.pid}.html`);

execFileSync(process.execPath, ["build.mjs", "--out", tmp], { stdio: "inherit" });

const built = await readFile(tmp, "utf8");
await rm(tmp, { force: true });

const shipped = rev
  ? execFileSync("git", ["show", `${rev}:index.html`], { encoding: "utf8", maxBuffer: 64 << 20 })
  : (await readFile("index.html", "utf8")).replace(/\r\n/g, "\n");

const label = rev ? `index.html at ${rev}` : "index.html";

if (built === shipped) {
  console.log(`OK  build matches ${label} byte for byte`);
  process.exit(0);
}

// Not identical — report enough to see whether the drift is expected.
const a = built.split("\n");
const b = shipped.split("\n");
const setB = new Set(b);
const setA = new Set(a);
const onlyBuilt = a.filter((l) => !setB.has(l));
const onlyShipped = b.filter((l) => !setA.has(l));

console.log(`DRIFT  build does not match ${label}`);
console.log(`  built:   ${a.length} lines`);
console.log(`  shipped: ${b.length} lines`);
console.log(`  ${onlyBuilt.length} line(s) only in the build, ${onlyShipped.length} only in ${label}`);
for (const l of onlyShipped.slice(0, 5)) console.log(`  - ${l.trim().slice(0, 100)}`);
for (const l of onlyBuilt.slice(0, 5)) console.log(`  + ${l.trim().slice(0, 100)}`);
process.exit(1);
