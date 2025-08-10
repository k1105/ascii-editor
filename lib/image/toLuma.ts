export function toLuma(img: ImageData): Uint8Array {
  const { data, width, height } = img;
  const out = new Uint8Array(width * height);
  
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Rec.709
    out[j] = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
  }
  
  return out;
}