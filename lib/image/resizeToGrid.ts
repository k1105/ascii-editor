export type FitMode = "fit"; // 後で "cover" 追加予定。今は fit 固定。

export async function resizeToGrid(
  source: ImageBitmap | HTMLImageElement,
  cols: number,
  rows: number,
  mode: FitMode = "fit",
  bg = 255 // レターボックスを白で埋める
): Promise<ImageData> {
  const targetW = cols;
  const targetH = rows;
  const canvas = new OffscreenCanvas(targetW, targetH);
  const ctx = canvas.getContext("2d", {willReadFrequently: true})!;

  // 背景（白）
  ctx.fillStyle = `rgb(${bg},${bg},${bg})`;
  ctx.fillRect(0, 0, targetW, targetH);

  // 元画像サイズ
  const w =
    "width" in source
      ? source.width
      : (source as HTMLImageElement).naturalWidth;
  const h =
    "height" in source
      ? source.height
      : (source as HTMLImageElement).naturalHeight;

  // 等比フィット（レターボックス）
  const scale = Math.min(targetW / w, targetH / h);
  const dw = Math.max(1, Math.floor(w * scale));
  const dh = Math.max(1, Math.floor(h * scale));
  const dx = Math.floor((targetW - dw) / 2);
  const dy = Math.floor((targetH - dh) / 2);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, w, h, dx, dy, dw, dh);

  return ctx.getImageData(0, 0, targetW, targetH);
}
