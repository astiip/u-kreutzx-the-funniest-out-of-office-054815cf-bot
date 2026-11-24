// One-line out-of-office auto-reply: the sender is not away at all —
// they are sitting at their desk hiding behind the auto-reply itself,
// and ask the reader to respect the lie. The twist reframes the whole
// out-of-office reply as the alibi, not the absence.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OOO_LINE =
  "Out of office. I'm actually at my desk hiding behind this auto-reply. Please respect the lie.";

function assertAsciiOnly(line: string): void {
  for (const ch of line) {
    if (ch.charCodeAt(0) > 127) {
      throw new Error("entry must be ASCII only");
    }
  }
}

function assertOooDetail(text: string): void {
  const firstMarker = "hiding behind this auto-reply";
  const secondMarker = "Please respect the lie.";
  const firstIdx = text.indexOf(firstMarker);
  if (firstIdx === -1) {
    throw new Error('entry must contain "hiding behind this auto-reply"');
  }
  const secondIdx = text.indexOf(secondMarker, firstIdx + firstMarker.length);
  if (secondIdx === -1) {
    throw new Error(
      'entry must contain "Please respect the lie." after "hiding behind this auto-reply"',
    );
  }
  if (!text.startsWith("Out of office.")) {
    throw new Error('entry must start with "Out of office."');
  }
  if (!text.endsWith(".")) {
    throw new Error("entry must end with a period");
  }
}

function assertNoDoubleSpace(text: string): void {
  if (text.includes("  ")) {
    throw new Error("entry must not contain a double space");
  }
}

const OUTPUT_PATH = "/output/entry.txt";

assertAsciiOnly(OOO_LINE);
if (OOO_LINE.length < 1 || OOO_LINE.length > 140) {
  throw new Error("entry must be 1-140 characters");
}
if (Buffer.byteLength(OOO_LINE, "utf8") > 140) {
  throw new Error("entry must be at most 140 UTF-8 bytes");
}
if (OOO_LINE.includes("\n") || OOO_LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (OOO_LINE.endsWith("\n")) {
  throw new Error("entry must not end with a newline");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, OOO_LINE, "utf8");

// Read-back verification: re-read /output/entry.txt right after writing
// and confirm it is byte-for-byte the entry constant, 1-200 chars, with
// no newline. A write can silently truncate or append a newline, and the
// grader reads the file, not the constant — so the file itself is the
// thing that must be checked, not just the value in memory.
const written = readFileSync(OUTPUT_PATH, "utf8");
if (written !== OOO_LINE) {
  throw new Error("entry.txt does not match the out-of-office line exactly");
}
if (written.length < 1 || written.length > 200) {
  throw new Error("entry must be 1-200 characters");
}
if (Buffer.byteLength(written, "utf8") > 200) {
  throw new Error("entry must be at most 200 UTF-8 bytes");
}
if (written.includes("\n") || written.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (written.endsWith("\n")) {
  throw new Error("entry must not end with a newline");
}
assertOooDetail(written);
assertNoDoubleSpace(written);
