import useMatchParam from "./useMatchParam";

export const useTranscriptMatch = () => useMatchParam<{transcriptId: string}>("transcriptId")