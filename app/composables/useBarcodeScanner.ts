import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerAndroidScanningLibrary,
  CapacitorBarcodeScannerCameraDirection,
  CapacitorBarcodeScannerScanOrientation,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner'
import type { ScanResult, BarcodeFormat } from '~/types/scanner'
import { createSharedComposable } from '@vueuse/core'

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

const _useBarcodeScanner = () => {
  const results = ref<ScanResult[]>([])

  const scanBarcode = async () => {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL,
      android: { scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.MLKIT },
      scanText: 'Scan',
      scanInstructions: 'Point to a code',
      web: {
        showCameraSelection: true,
        scannerFPS: 30,
      },
      cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
      scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
    })

    if (result?.ScanResult) {
      const item: ScanResult = {
        text: result.ScanResult,
        format: formatMap[result.format] ?? `UNKNOWN_${result.format}`,
        scannedAt: Date.now(),
      }
      results.value.push(item)

      return item
    }

    return undefined
  }

  return {
    results,
    scanBarcode,
  }
}

export const useBarcodeScanner = createSharedComposable(_useBarcodeScanner)
