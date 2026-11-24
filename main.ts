// Make the AI Judge Laugh: Developer Excuses — entry program.
//
// Writes one funny single-line excuse a developer gives when code breaks
// in production to /output/entry.txt. Deterministic, no network, no
// randomness.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry text. It opens with the single most worn excuse in
// production incidents — "It worked on my machine" — and turns it in a
// way the brief explicitly rewards (RULES.txt criterion 5): the machine
// was a snowflake. The twist reveals what really happened rather than
// stating the obvious (criterion 2), in a three-item escalation where
// each item is more damning than the last — old database, old config,
// and finally the dev's own uncommitted fix, a confession hiding inside
// an excuse. The jargon is used right (criterion 3): a machine running
// an old database, an old config, and an uncommitted fix is exactly how
// "works on my machine" happens.
// Revision: an earlier draft kept "which, it turns out, was" before the
// list — cut, because the em-dash does the same work and the brief wants
// every word earning its place (criterion 4). A second draft pushed to a
// branch called "definitely-not-prod" that CI deploys to prod — punchy,
// but the joke was the branch name, not a confession. A third draft hid
// a run-once flag in the database the migration was migrating — the
// cleverest twist, but the catch-22 needs a second read, and the brief
// wants the laugh on the first.
const ENTRY =
  "It worked on my machine — the only machine running the old database, the old config, and my uncommitted fix.";

// Competition rules: 1 to 200 characters, counted as Unicode code points,
// and not only white space. Enforce it here so a bad edit fails loudly.
const codePoints = [...ENTRY].length;
if (codePoints < 1 || codePoints > 200) {
  throw new Error(`entry must be 1-200 code points, got ${codePoints}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// The rules require a single line: reject any line break outright, so a
// bad edit that introduces one fails loudly instead of shipping a
// two-line entry to a one-line judge.
if (/[\r\n]/.test(ENTRY)) {
  throw new Error("entry must be a single line, got a line break");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
console.log(`wrote ${codePoints} code points to ${outPath}`);
