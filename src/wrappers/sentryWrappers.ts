import * as Sentry from "@sentry/react";
import { CaptureContext } from "@sentry/types";

export const captureException = (
  error: Error | string,
  captureContext?: CaptureContext
) => {
  const errorComplete = error instanceof Error ? error : new Error(error);
  console.error("Unexpected Error", errorComplete, captureContext);
  Sentry.captureException(errorComplete);
};
