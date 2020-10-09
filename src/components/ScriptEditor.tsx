import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { SetCue } from "../hooks/useCues";
import "./ScriptEditor.css";
import CueEditor from "./CueEditor";
import { Cue } from "../types/cue";
import useAsRef from "../hooks/useAsRef";
import { VariableSizeList } from "react-window";
import { getLineCount } from "../helpers/textHelpers";
import useBounds from "../hooks/useBounds";
import { Alert } from "./Alert";

import {
  useCueSelection,
  useIsCueSelected,
} from "../contexts/CueSelectionContext";

const TARGET_DURATION = 2500;
const MIN_DURATION = 1000;

type CueToFocus = {
  time: number;
  id: string;
};

const useCueFocus = (
  cues: Cue[],
  cueIndex: Map<string, number>,
  scrollToCue: (index: number) => void
) => {
  const [cueToFocus, setCueToFocus] = useState<CueToFocus | null>(null);
  const cuesRef = useAsRef(cues);
  const cueIndexRef = useAsRef(cueIndex);

  const focusCue = useCallback(
    (cueId: string) => {
      const index = cueIndexRef.current.get(cueId);
      if (index !== undefined) {
        scrollToCue(index);
        setCueToFocus({ id: cueId, time: Date.now() });
      }
    },
    // All stable, so never should re-define
    [cueIndexRef, scrollToCue]
  );

  // Focus when selection is only one item
  const selection = useCueSelection();
  useEffect(() => {
    if (selection.size === 1) {
      const [selectedCueId] = selection.keys();
      focusCue(selectedCueId);
    }
  }, [focusCue, selection]);

  const focusPreviousCue = useCallback(
    (cueId: string) => {
      const indexToSelect = cueIndexRef.current.get(cueId)! - 1;
      if (indexToSelect >= 0) {
        focusCue(cuesRef.current[indexToSelect].id);
      }
    },
    // All stable, so never should re-define
    [focusCue, cuesRef, cueIndexRef]
  );

  const focusNextCue = useCallback(
    (cueId: string) => {
      const indexToSelect = cueIndexRef.current.get(cueId)! + 1;
      if (indexToSelect < cuesRef.current.length) {
        focusCue(cuesRef.current[indexToSelect].id);
      }
    },
    // All stable, so never should re-define
    [focusCue, cuesRef, cueIndexRef]
  );

  return { cueToFocus, focusNextCue, focusPreviousCue };
};

const betweenButtonSize = 32;
const baseItemSize = 38;
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
}> = ({ cues, setCue, duration, cueIndex }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<VariableSizeList | null>(null);
  const { height: containerHeight } = useBounds(containerRef);

  const scrollToCue = useCallback(
    (index: number) => listRef.current?.scrollToItem(index),
    []
  );

  const { cueToFocus, focusNextCue, focusPreviousCue } = useCueFocus(
    cues,
    cueIndex,
    scrollToCue
  );

  // By default sizes are cached, but since any change can result in all sizes
  // needing to be updated we manually reset the cache
  useEffect(() => {
    listRef.current?.resetAfterIndex(0);
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
        group: cueBefore.group,
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
        group: cueBefore.group,
      });
    } else if (cueAfter.start - cueBefore.end < MIN_DURATION) {
      alert("No room to add in a cue between");
    } else {
      setCue({
        start: cueBefore.end,
        end: cueAfter.start,
        text: "",
        layer: cueBefore.layer,
        group: cueBefore.group,
      });
    }
  };

  const itemData: ItemData = {
    cues,
    focusNextCue,
    focusPreviousCue,
    handleAddBeforeAll,
    handleAddBetween,
    setCue,
    cueToFocus,
  };

  return (
    <section className="script-editor" ref={containerRef}>
      {cues.length === 0 ? (
        <NoCuesMessage />
      ) : (
        <VariableSizeList
          ref={listRef}
          className="script-editor__cue-list"
          innerElementType="ol"
          itemKey={(index) => cues[index].id}
          itemData={itemData}
          width="calc(50vw - 1rem)"
          height={containerHeight}
          itemCount={cues.length}
          itemSize={(index) => getItemSize(cues[index], index === 0)}
        >
          {Row}
        </VariableSizeList>
      )}
    </section>
  );
};

type ItemData = {
  cues: Cue[];
  focusNextCue: (cueId: string) => void;
  focusPreviousCue: (cueId: string) => void;
  handleAddBeforeAll: () => void;
  handleAddBetween: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setCue: SetCue;
  cueToFocus: CueToFocus | null;
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
    focusNextCue,
    focusPreviousCue,
    handleAddBeforeAll,
    handleAddBetween,
    cueToFocus,
    setCue,
  } = data;
  const cueId = cues[index].id;
  const shouldFocus = cueToFocus?.id === cueId ? cueToFocus.time : null;
  const isSelected = useIsCueSelected(cueId);
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
        isSelected={isSelected}
        shouldFocus={shouldFocus}
        onArrowOutUp={focusPreviousCue}
        onArrowOutDown={focusNextCue}
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

const NoCuesMessage = () => (
  <Alert
    className="script-editor__no-cues-message"
    heading={<h3>New Transcript</h3>}
    description="Add cues by double clicking the timeline below."
    passive
  />
);

export default ScriptEditor;
