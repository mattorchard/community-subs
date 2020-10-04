import React, { CSSProperties, useCallback, useEffect, useRef } from "react";
import { SetCue } from "../hooks/useCues";
import "./ScriptEditor.css";
import CueEditor from "./CueEditor";
import { Cue } from "../types/cue";
import useAsRef from "../hooks/useAsRef";
import { VariableSizeList } from "react-window";
import { getLineCount } from "../helpers/textHelpers";
import useBounds from "../hooks/useBounds";

const TARGET_DURATION = 2500;
const MIN_DURATION = 1000;

const useSequentialSelectors = (
  cues: Cue[],
  cueIndex: Map<string, number>,
  onSelectCue: (cueId: string) => void
) => {
  const cuesRef = useAsRef(cues);
  const cueIndexRef = useAsRef(cueIndex);

  const onSelectPrevious = useCallback(
    (cueId: string) => {
      const indexToSelect = cueIndexRef.current.get(cueId)! - 1;
      if (indexToSelect >= 0) {
        onSelectCue(cuesRef.current[indexToSelect].id);
      }
    },
    [onSelectCue, cuesRef, cueIndexRef]
  );

  const onSelectNext = useCallback(
    (cueId: string) => {
      const indexToSelect = cueIndexRef.current.get(cueId)! + 1;
      if (indexToSelect < cuesRef.current.length) {
        onSelectCue(cuesRef.current[indexToSelect].id);
      }
    },
    [onSelectCue, cuesRef, cueIndexRef]
  );

  return { onSelectPrevious, onSelectNext };
};

const betweenButtonSize = 32;
const baseItemSize = 39;
const perLineSize = 16;

const getItemSize = (cue: Cue, isFirst: boolean) => {
  const betweenButtonCount = isFirst ? 2 : 1;
  const lineCount = getLineCount(cue.text);
  return (
    baseItemSize +
    betweenButtonSize * betweenButtonCount +
    perLineSize * lineCount
  );
};

const ScriptEditor: React.FC<{
  cues: Cue[];
  cueIndex: Map<string, number>;
  setCue: SetCue;
  duration: number;
  selectedCue: string | null;
  onSelectCue: (cueId: string) => void;
}> = ({ cues, setCue, duration, selectedCue, onSelectCue, cueIndex }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<VariableSizeList | undefined>();
  const { height: containerHeight } = useBounds(containerRef);

  const { onSelectPrevious, onSelectNext } = useSequentialSelectors(
    cues,
    cueIndex,
    onSelectCue
  );

  useEffect(() => {
    listRef.current!.resetAfterIndex(0);
  }, [cues]);

  const handleAddBeforeAll = () => {
    const cueBefore = cues[0];
    if (cueBefore.start < MIN_DURATION) {
      alert("No room to add in a cue before that");
    } else {
      setCue({
        start: Math.max(0, cueBefore.start - TARGET_DURATION),
        end: cueBefore.start,
        text: "",
        layer: cueBefore.layer,
      });
    }
  };
  const handleAddBetween = (event: React.MouseEvent<HTMLButtonElement>) => {
    const index = parseInt(event.currentTarget.dataset.index!);
    const cueBefore = cues[index];
    const cueAfter: Cue | undefined = cues[index + 1];
    if (cueBefore.end > duration - MIN_DURATION) {
      alert("No room to add in a cue after that");
    } else if (!cueAfter) {
      setCue({
        start: cueBefore.end,
        end: Math.min(cueBefore.end + TARGET_DURATION, duration - MIN_DURATION),
        text: "",
        layer: cueBefore.layer,
      });
    } else if (cueAfter.start - cueBefore.end < MIN_DURATION) {
      alert("No room to add in a cue between");
    } else {
      setCue({
        start: cueBefore.end,
        end: cueAfter.start,
        text: "",
        layer: cueBefore.layer,
      });
    }
  };

  return (
    <section className="script-editor" ref={containerRef}>
      <VariableSizeList
        ref={(list) => (listRef.current = list || undefined)}
        className="script-editor__cue-list"
        innerElementType="ol"
        itemData={{
          cues,
          onSelectNext,
          onSelectPrevious,
          handleAddBeforeAll,
          handleAddBetween,
          setCue,
          selectedCue,
        }}
        width="calc(50vw - 1rem)"
        height={containerHeight}
        itemCount={cues.length}
        itemSize={(index) => getItemSize(cues[index], index === 0)}
      >
        {Row}
      </VariableSizeList>
    </section>
  );
};

type ItemData = {
  cues: Cue[];
  onSelectNext: (cueId: string) => void;
  onSelectPrevious: (cueId: string) => void;
  handleAddBeforeAll: () => void;
  handleAddBetween: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setCue: SetCue;
  selectedCue: string | null;
};

const Row = ({
  index,
  data,
  style,
}: {
  index: number;
  data: ItemData;
  style: CSSProperties;
}) => {
  const {
    cues,
    onSelectNext,
    onSelectPrevious,
    handleAddBeforeAll,
    handleAddBetween,
    selectedCue,
    setCue,
  } = data;
  return (
    <li style={style}>
      {index === 0 && (
        <button
          type="button"
          className="script-editor__add-cue-between-button"
          onClick={handleAddBeforeAll}
        >
          Add Before
        </button>
      )}
      <CueEditor
        cue={cues[index]}
        setCue={setCue}
        selected={selectedCue === cues[index].id}
        onSelectPrevious={onSelectPrevious}
        onSelectNext={onSelectNext}
      />
      <button
        type="button"
        className="script-editor__add-cue-between-button"
        data-index={index}
        onClick={handleAddBetween}
      >
        {index < cues.length - 1 ? "Add Between" : "Add After"}
      </button>
    </li>
  );
};

export default ScriptEditor;
