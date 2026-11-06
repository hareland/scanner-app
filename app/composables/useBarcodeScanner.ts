import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerAndroidScanningLibrary,
  CapacitorBarcodeScannerCameraDirection,
  CapacitorBarcodeScannerScanOrientation,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner'
import { createSharedComposable } from '@vueuse/core'
import type { ScanResult, BarcodeFormat } from '~/types/scanner'
import { haptic } from '~/lib/native'

const formatMap: Record<number, BarcodeFormat> = {
  [CapacitorBarcodeScannerTypeHint.QR_CODE]: 'QR_CODE',
  [CapacitorBarcodeScannerTypeHint.DATA_MATRIX]: 'DATA_MATRIX',
  [CapacitorBarcodeScannerTypeHint.UPC_A]: 'UPC_A',
  [CapacitorBarcodeScannerTypeHint.UPC_E]: 'UPC_E',
  [CapacitorBarcodeScannerTypeHint.EAN_8]: 'EAN_8',
  [CapacitorBarcodeScannerTypeHint.EAN_13]: 'EAN_13',
  [CapacitorBarcodeScannerTypeHint.CODE_39]: 'CODE_39',
  [CapacitorBarcodeScannerTypeHint.CODE_93]: 'CODE_93',
  [CapacitorBarcodeScannerTypeHint.CODE_128]: 'CODE_128',
  [CapacitorBarcodeScannerTypeHint.CODABAR]: 'CODABAR',
  [CapacitorBarcodeScannerTypeHint.ITF]: 'ITF',
  [CapacitorBarcodeScannerTypeHint.AZTEC]: 'AZTEC',
  [CapacitorBarcodeScannerTypeHint.PDF_417]: 'PDF_417',
}

/** Scans one code with the system scanner. `results` holds this session's scans, oldest first. */
const _useBarcodeScanner = () => {
  const results = ref<ScanResult[]>([])
  const { settings } = useScannerSettings()

  const scanBarcode = async () => {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL,
      android: { scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.MLKIT },
      scanText: 'Scan',
      scanInstructions: 'Point the camera at a code',
      web: {
        showCameraSelection: settings.webCameraSelection,
        scannerFPS: 30,
      },
      cameraDirection: settings.cameraFacing === 'front'
        ? CapacitorBarcodeScannerCameraDirection.FRONT
        : CapacitorBarcodeScannerCameraDirection.BACK,
      scanOrientation: CapacitorBarcodeScannerScanOrientation.ADAPTIVE,
    })

    if (!result?.ScanResult) return undefined

    const item: ScanResult = {
      text: result.ScanResult,
      format: normalizeFormat(formatMap[result.format] ?? `UNKNOWN_${result.format}`, result.ScanResult),
      scannedAt: Date.now(),
    }
    results.value.push(item)
    if (settings.hapticFeedback) haptic('success').catch(() => {})

    return item
  }

  const clear = () => {
    results.value = []
  }

  return {
    results,
    scanBarcode,
    clear,
  }
}

export const useBarcodeScanner = createSharedComposable(_useBarcodeScanner)
