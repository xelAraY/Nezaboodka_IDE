import { Rx, LoggingLevel } from "reactronic"

const IS_DBG = process.env.NODE_ENV !== "production"

export function configureDebugging(): void {
  Rx.setLoggingMode(false)
  Rx.setLoggingMode(IS_DBG, LoggingLevel.Debug)
  Rx.setProfilingMode(false, {
    asyncActionDurationWarningThreshold: 300,
    mainThreadBlockingWarningThreshold: 10,
    repetitiveUsageWarningThreshold: 5,
    garbageCollectionSummaryInterval: Number.MAX_SAFE_INTEGER,
  })
  // VerstakNode.setDefaultLoggingOptions(LoggingLevel.ErrorsOnly)
}
