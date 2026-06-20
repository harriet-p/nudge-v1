/**
 * Integer multiplier for authored art pixels → screen pixels.
 * 1 = base size, 2 = double, etc.
 */
export const PIXEL_SCALE = 1

/**
 * PNG files are exported at 2 screen pixels per authored art pixel.
 * Display size = nativePngPixels / ASSET_PIXEL_RATIO * PIXEL_SCALE.
 */
export const ASSET_PIXEL_RATIO = 2

export function scaledPx(nativePngPixels: number): number {
  return Math.round((nativePngPixels / ASSET_PIXEL_RATIO) * PIXEL_SCALE)
}

export function scaledSize(
  width: number,
  height: number,
): { width: number; height: number } {
  return {
    width: scaledPx(width),
    height: scaledPx(height),
  }
}
