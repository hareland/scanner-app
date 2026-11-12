export type BarcodeFormat
  = | 'QR_CODE'
    | 'DATA_MATRIX'
    | 'UPC_A'
    | 'UPC_E'
    | 'EAN_8'
    | 'EAN_13'
    | 'CODE_39'
    | 'CODE_93'
    | 'CODE_128'
    | 'CODABAR'
    | 'ITF'
    | 'AZTEC'
    | 'PDF_417'
    | string

export type ScanResult = {
  text: string
  format: BarcodeFormat
  scannedAt: number
  /** What the code is, in the user's words (e.g. "Gym locker", "Wi-Fi at the cabin"). */
  description?: string
}

export type MatchOperator
  = | 'startsWith'
    | 'endsWith'
    | 'contains'
    | 'equals'
    | 'regex'

export type MatchCondition = {
  field: 'text' | 'format'
  operator: MatchOperator
  value: string
  caseSensitive?: boolean
}

/**
 * How multiple conditions within a rule are evaluated.
 * 'AND' = all must match, 'OR' = at least one must match.
 */
export type ConditionLogic = 'AND' | 'OR'

export type ScanActionType
  = | 'save' // persist the scan result
    | 'navigate' // go to a route/screen
    | 'webhook' // fire an HTTP request
    | 'clipboard' // copy value to clipboard
    | 'alert' // show a notification/toast
    | 'none'

export type ScanAction
  = | { type: 'save' }
    | { type: 'none' }
    | { type: 'clipboard' }
    | { type: 'alert', message: string }
    | { type: 'navigate', route: string, params?: Record<string, string> }
    | { type: 'webhook', url: string, method?: 'GET', headers?: Record<string, string> }
    | { type: 'webhook', url: string, method: 'POST', body: string, headers?: Record<string, string> }

export type ScanRule = {
  id: string
  label: string
  enabled: boolean
  conditionLogic: ConditionLogic
  conditions: MatchCondition[]
  action: ScanAction
  /** Optional: stop evaluating further rules once this one matches */
  stopPropagation?: boolean
}

/**
 * A "profile" is a named collection of rules — e.g. "Warehouse", "Retail".
 * Only one profile is active at a time.
 */
export type ScanProfile = {
  id: string
  label: string
  rules: ScanRule[]
  createdAt: number
  updatedAt: number
}

export type AppSettings = {
  activeProfileId: string
  profiles: ScanProfile[]
  preferences: {
    hapticFeedback: boolean
    beepOnScan: boolean
    torchEnabled: boolean
    scanDelay: number // ms between scans
    cameraFacing: 'front' | 'back'
  }
}

/** The result of running a scan result through a rule */
export type RuleEvalResult = {
  rule: ScanRule
  matched: boolean
  action: ScanAction | null
}
