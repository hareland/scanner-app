import type { BarcodeFormat } from '~/types/scanner'

export const isUrl = (text: string) => /^https?:\/\/\S+$/i.test(text.trim())

/** `QR_CODE` → `QR Code`, `EAN_13` → `EAN-13`. */
export function formatLabel(format: BarcodeFormat) {
  const labels: Record<string, string> = {
    QR_CODE: 'QR Code',
    DATA_MATRIX: 'Data Matrix',
    UPC_A: 'UPC-A',
    UPC_E: 'UPC-E',
    EAN_8: 'EAN-8',
    EAN_13: 'EAN-13',
    CODE_39: 'Code 39',
    CODE_93: 'Code 93',
    CODE_128: 'Code 128',
    CODABAR: 'Codabar',
    ITF: 'ITF',
    AZTEC: 'Aztec',
    PDF_417: 'PDF417',
  }
  return labels[format] ?? format
}

/** An icon for the kind of content a code holds. */
export function contentIcon(text: string, format: BarcodeFormat) {
  if (isUrl(text)) return 'i-lucide-link'
  if (/^WIFI:/i.test(text)) return 'i-lucide-wifi'
  if (/^(mailto:|MATMSG:)/i.test(text)) return 'i-lucide-mail'
  if (/^tel:/i.test(text)) return 'i-lucide-phone'
  if (/^BEGIN:VCARD/i.test(text)) return 'i-lucide-contact'
  return format === 'QR_CODE' ? 'i-lucide-qr-code' : 'i-lucide-barcode'
}

/** A setup code (`stp:{json}`) carries scanner configuration. Returns the parsed payload, or the parse error. */
export function parseSetupCode(text: string): { ok: true, value: unknown } | { ok: false, error: string } | null {
  if (!text.startsWith('stp:')) return null
  try {
    return { ok: true, value: JSON.parse(text.slice(4)) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

/** The JsBarcode name of a 1D format, `undefined` for formats it can't draw (2D codes). */
export function jsBarcodeFormat(format: BarcodeFormat) {
  const formats: Record<string, string> = {
    CODE_128: 'CODE128',
    CODE_39: 'CODE39',
    CODE_93: 'CODE93',
    EAN_13: 'EAN13',
    EAN_8: 'EAN8',
    UPC_A: 'UPC',
    UPC_E: 'UPCE',
    ITF: 'ITF',
    CODABAR: 'codabar',
  }
  return formats[format]
}

/**
 * Apple Vision reports UPC-A and EAN-13 alike, so iOS scans come back tagged with either one at random.
 * Trust the digits instead: a UPC-A is an EAN-13 with a leading 0 (iOS reads it that way),
 * so 11–12 digits or 13 starting with 0 is UPC-A, other 13-digit codes are EAN-13.
 */
export function normalizeFormat(format: BarcodeFormat, text: string): BarcodeFormat {
  if (format !== 'UPC_A' && format !== 'EAN_13') return format
  if (/^(\d{11,12}|0\d{12})$/.test(text)) return 'UPC_A'
  if (/^\d{13}$/.test(text)) return 'EAN_13'
  return format
}

/** The value to draw: JsBarcode wants a UPC-A without the leading 0 iOS adds. */
export function barcodeValue(format: BarcodeFormat, text: string) {
  return format === 'UPC_A' && /^0\d{12}$/.test(text) ? text.slice(1) : text
}
