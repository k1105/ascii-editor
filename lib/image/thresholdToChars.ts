export function thresholdToChars(
  luma: Uint8Array,
  cols: number,
  rows: number,
  opts: { threshold: number; invert: boolean; dark: string; light: string }
): string[][] {
  const { threshold, invert, dark, light } = opts;
  const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(light));
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const Y = luma[y * cols + x];
      const v = invert ? 255 - Y : Y;
      grid[y][x] = v < threshold ? dark : light;
    }
  }
  
  return grid;
}