import { Range, Violation } from "../linters/linter";

type TimeFlag<T> = {
  id: number;
  time: number;
  value: T;
} & ({ isStart: true; isEnd: false } | { isEnd: true; isStart: false });

const flagComparator = (a: TimeFlag<any>, b: TimeFlag<any>) => {
  if (a.time !== b.time) {
    return a.time - b.time;
  }
  if (a.isStart && b.isEnd) {
    return -1;
  }
  if (a.isEnd && b.isStart) {
    return 1;
  }
  return 0;
};

export type ViolationAnnotation = {
  violations: Violation[];
  text: string;
} & Range;

export const getViolationAnnotations = (
  text: string,
  violations: Violation[]
) => {
  const flags: TimeFlag<Violation>[] = violations.flatMap(
    (violation, index) => [
      {
        time: violation.start,
        value: violation,
        id: index,
        isStart: true,
        isEnd: false,
      },
      {
        time: violation.end,
        value: violation,
        id: index,
        isStart: false,
        isEnd: true,
      },
    ]
  );
  flags.sort(flagComparator);

  const ongoing = new Set<Violation>();
  const flatViolations: ViolationAnnotation[] = [];
  let pivot = 0;

  flags.forEach((flag) => {
    flatViolations.push({
      start: pivot,
      end: flag.time,
      text: text.substring(pivot, flag.time),
      violations: [...ongoing],
    });
    if (flag.isStart) {
      ongoing.add(flag.value);
    } else if (flag.isEnd) {
      ongoing.delete(flag.value);
    }
    pivot = flag.time;
  });

  // Remove first if empty
  if (
    flatViolations.length > 0 &&
    flatViolations[0].start === flatViolations[0].end
  ) {
    flatViolations.shift();
  }

  // Add last empty annotation if needed
  if (pivot !== text.length) {
    flatViolations.push({
      start: pivot,
      end: text.length,
      text: text.substring(pivot, text.length),
      violations: [],
    });
  }

  return flatViolations;
};
