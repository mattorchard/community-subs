import { fixReplace, Linter, testLines, testMatch, testWhole } from "./linter";
import { getLineCount } from "../helpers/textHelpers";

const maxLines = 2;
const maxCharsPerLine = 42;

const netlixEnglishLinter = new Linter("Netflix (English)", [
  {
    id: "1.2-line-length",
    name: "Line too long",
    description: `No more than ${maxCharsPerLine} characters per line`,
    test: testLines((cue, text) => {
      if (text.length <= maxCharsPerLine) {
        return [];
      }
      return [{ start: 0, end: text.length }];
    }),
  },
  {
    id: "1.3.1-smart-ellipses",
    name: "Use smart ellipses",
    description:
      "Instead of using three dots, use a single smart character (U+2026)",
    test: testMatch(/\.{3}/g),
    fix: fixReplace("…"),
  },
  {
    id: "1.3.2-end-double-hyphen",
    name: "Use two hyphens for interruptions",
    description:
      "Use two hyphens to indicate abrupt interruptions and the end of a line",
    test: testLines((cue, text) => {
      if (/([^-]-)$/.test(text)) {
        return [{ start: text.length - 1, end: text.length }];
      }
      return [];
    }),
    fix: fixReplace("--"),
  },
  {
    id: "1.6.1-no-space-after-starting-hyphen",
    name: "Exclude space after starting hyphen",
    description:
      "A hyphen at the start of a line should not have a space afterwards",
    test: testLines((cue, text) => {
      if (/^- /.test(text)) {
        return [{ start: 0, end: 2 }];
      }
      return [];
    }),
    fix: fixReplace("-"),
  },
  {
    id: "1.10-line-count",
    name: "Too many lines",
    description: `Only ${maxLines} lines permitted per cue`,
    test: testWhole(({ text }) => getLineCount(text) > maxLines),
  },
  {
    id: "1.11.1-spell-low-numbers",
    name: "Spell low numbers",
    description: "Numbers below 11 should be spelled out",
    test: testMatch(/\b([0-9]|(10)])\b{}/g),
    fix: fixReplace((number) => englishNumbers[parseInt(number)]),
  },
]);

const englishNumbers = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];

export default netlixEnglishLinter;
