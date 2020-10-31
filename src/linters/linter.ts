import { Cue } from "../types/cue";
import { replaceSubstring } from "../helpers/textHelpers";

export type Range = {
  start: number;
  end: number;
};

export type LintRule = {
  id: string;
  name: string;
  description: string;
  test: (cue: Cue) => Range[];
  fix?: (cue: Cue, range: Range) => Cue;
  preview?: (cue: Cue, range: Range) => Cue;
};

export type Violation = Range & { rule: LintRule };

export class Linter {
  name: string;
  rules: LintRule[];
  constructor(name: string, rules: LintRule[]) {
    this.name = name;
    this.rules = rules;
  }
  getViolations(cue: Cue): Violation[] {
    return this.rules.flatMap((rule) => {
      return rule.test(cue).map((range) => ({
        ...range,
        rule,
      }));
    });
  }
}

export const testWhole = (tester: (cue: Cue) => boolean) => (
  cue: Cue
): Range[] => (tester(cue) ? [{ start: 0, end: cue.text.length }] : []);

export const testLines = (tester: (cue: Cue, line: string) => Range[]) => (
  cue: Cue
): Range[] => {
  const allResults: Range[] = [];
  const lines = cue.text.split("\n");
  let offset = 0;
  for (const line of lines) {
    const lineRanges = tester(cue, line);
    for (const range of lineRanges) {
      range.start += offset;
      range.end += offset;
    }
    allResults.push(...lineRanges);
    offset += line.length;
  }
  return allResults;
};

export const testMatch = (pattern: RegExp) => (cue: Cue): Range[] => {
  const results = [];
  const matches = cue.text.matchAll(pattern);
  for (const match of matches) {
    const { length } = match[0];
    const { index } = match;
    if (index !== undefined) {
      results.push({ start: index, end: index + length });
    }
  }
  return results;
};

export const fixReplace = (replacer: string | ((text: string) => string)) => (
  cue: Cue,
  { start, end }: Range
) => ({
  ...cue,
  text: replaceSubstring(
    cue.text,
    typeof replacer === "string"
      ? replacer
      : replacer(cue.text.substring(start, end)),
    start,
    end
  ),
});
