import { Cue } from "../types/cue";
import { v4 as uuidV4 } from "uuid";
import { timeCodeToMillis } from "./timeCodeHelpers";

export const fromVtt = (transcriptId: string, rawVtt: string): Cue[] =>
  rawVtt
    .split(/\r?\n\r?\n/g)
    .filter(
      (block, index) =>
        block && // Non-empty
        getBlockType(block) === "cue" && // Other types not yet supported
        index // Exclude the first (file header)
    )
    .map(parseCue)
    .map((partial) => ({
      ...partial,
      transcriptId,
      id: uuidV4(),
      layer: 0,
    }));

const getBlockType = (block: string) => {
  if (block.startsWith("NOTE")) {
    return "comment";
  } else if (block.startsWith("STYLE")) {
    // Todo: Parse style blocks
    console.warn("Currently style blocks are not parsed during import");
    return "style";
  } else if (block.startsWith("REGION")) {
    // Todo: Parse region blocks
    console.warn("Currently region blocks are not parsed during import");
    return "region";
  }
  return "cue";
};

const parseCue = (block: string) => {
  const rawLines = block.split("\n");
  if (!rawLines[0].includes("-->")) {
    rawLines.shift(); // Throw away any identifiers, they're not currently supported
  }
  const [header, ...rawTextLines] = rawLines;
  const { start, end, settings } = parseCueHeader(header);
  const text = rawTextLines.map(removeTags).join("\n");

  return {
    text,
    start,
    end,
    settings,
  };
};

const removeTags = (text: string) => text.replace(/<[^>]+>/g, "");

const parseCueHeader = (cueHeaderText: string) => {
  const basicHeaderGroups = cueHeaderText.match(
    /((?:[0-9][0-9]:)?[0-9:.]{9}) --> ((?:[0-9][0-9]:)?[0-9:.]{9}) ?(.*)?\s*?/
  );
  if (!basicHeaderGroups) {
    throw new Error(
      `Unable to get timestamps from cue header "${cueHeaderText}"`
    );
  }
  const [, startRaw, endRaw, settingsRaw] = basicHeaderGroups;
  return {
    start: parseTime(startRaw),
    end: parseTime(endRaw),
    settings: settingsRaw ? parseSettings() : undefined,
  };
};

const parseTime = (timeText: string) => {
  const digitGroups = timeText.match(
    /(?:([0-9][0-9]):)?([0-9][0-9]):([0-9][0-9]).([0-9][0-9][0-9])/
  );
  if (!digitGroups) {
    throw new Error(`Unable to get time from timestamp "${timeText}"`);
  }
  digitGroups.shift(); // Drop the complete match group
  const digits = digitGroups.map((num) => parseInt(num));
  const includesHour = digitGroups.length === 4;

  if (includesHour) {
    const [hours, minutes, seconds, milliseconds] = digits;
    return timeCodeToMillis({ hours, minutes, seconds, milliseconds });
  } else {
    const [minutes, seconds, milliseconds] = digits;
    return timeCodeToMillis({ hours: 0, minutes, seconds, milliseconds });
  }
};

const parseSettings = () => {
  // Todo: Parse cue settings
  console.warn("Currently cue settings are not parsed during import");
  return undefined;
};
