import { renderHook, act } from "@testing-library/react-hooks";
import useCues from "./useCues";
import { Cue } from "../types/subtitles";

test("Saving a new cue should persist to state", () => {
  const { result } = renderHook(() => useCues());
  const sampleQue: Cue = { id: "1", lines: [], start: 0, end: 1000 };

  act(() => {
    const [, saveCue] = result.current;
    saveCue(sampleQue);
  });

  {
    const [cues] = result.current;
    expect(cues).toEqual(new Map([["1", sampleQue]]));
  }
});

test("Saving a new end time should persist to state", () => {
  const { result } = renderHook(() => useCues());
  const sampleQue: Cue = { id: "1", lines: [], start: 0, end: 1000 };

  act(() => {
    const [, saveCue] = result.current;
    saveCue(sampleQue);
    saveCue({ id: "1", end: 500 });
  });

  {
    const [cues] = result.current;
    expect(cues).toEqual(new Map([["1", { ...sampleQue, end: 500 }]]));
  }
});

test("Saving a new start time should persist to state", () => {
  const { result } = renderHook(() => useCues());
  const sampleQue: Cue = { id: "1", lines: [], start: 0, end: 1000 };

  act(() => {
    const [, saveCue] = result.current;
    saveCue(sampleQue);
    saveCue({ id: "1", start: 500 });
  });

  {
    const [cues] = result.current;
    expect(cues).toEqual(new Map([["1", { ...sampleQue, start: 500 }]]));
  }
});

test("Saving a new start date should maintain sort order", () => {
  const { result } = renderHook(() => useCues());
  const cueA: Cue = { id: "A", lines: [], start: 1000, end: 2000 };
  const cueB: Cue = { id: "B", lines: [], start: 2000, end: 3000 };
  const cueC: Cue = { id: "C", lines: [], start: 3000, end: 4000 };

  act(() => {
    const [, saveCue] = result.current;
    saveCue(cueC);
    saveCue(cueA);
    saveCue(cueB);
  });

  {
    const [cues] = result.current;
    expect(cues).toEqual(
      new Map([
        ["A", cueA],
        ["B", cueB],
        ["C", cueC],
      ])
    );
  }
});
