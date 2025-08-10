import {create} from "zustand";
import {resizeToGrid} from "@/lib/image/resizeToGrid";
import {toLuma} from "@/lib/image/toLuma";
import {thresholdToChars} from "@/lib/image/thresholdToChars";

type Grid = string[][];

type EditorState = {
  rows: number;
  cols: number;
  grid: Grid;
  palette: [string, string]; // [dark, light] 例: ["█"," "]
  selectedChar: string; // 将来用
  threshold: number;
  invert: boolean; // 以降で使用
  pixelSize: number; // 1セルの表示px
  imageBitmap: ImageBitmap | null;
  setCell: (r: number, c: number, ch: string) => void;
  toggleCell: (r: number, c: number) => void;
  resizeGrid: (rows: number, cols: number) => void;
  setPixelSize: (px: number) => void;
  resetGrid: (fill?: string) => void;
  setThreshold: (n: number) => void;
  setInvert: (b: boolean) => void;
  setImageFile: (file: File) => Promise<void>;
  processImage: () => Promise<void>;
};

const initGrid = (rows: number, cols: number, fill: string = " "): Grid => {
  return Array.from({length: rows}, () =>
    Array.from({length: cols}, () => fill)
  );
};

// デバウンス用のタイマー
let processImageTimer: NodeJS.Timeout | null = null;

export const useEditorStore = create<EditorState>((set, get) => ({
  rows: 32,
  cols: 64,
  grid: initGrid(32, 64, " "),
  palette: ["█", " "],
  selectedChar: "█",
  threshold: 128,
  invert: false,
  pixelSize: 14,
  imageBitmap: null,

  setCell: (r: number, c: number, ch: string) => {
    const {grid} = get();
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      const newGrid = grid.map((row) => [...row]);
      newGrid[r][c] = ch;
      set({grid: newGrid});
    }
  },

  toggleCell: (r: number, c: number) => {
    const {grid, palette} = get();
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      const currentCell = grid[r][c];
      // palette内だけを対象（任意文字が入っているセルは無変更）
      if (palette.includes(currentCell)) {
        const newChar = currentCell === palette[0] ? palette[1] : palette[0];
        get().setCell(r, c, newChar);
      }
    }
  },

  resizeGrid: (rows: number, cols: number) => {
    set({
      rows,
      cols,
      grid: initGrid(rows, cols, " "),
    });
    // グリッドサイズ変更時は画像を再処理
    const {processImage} = get();
    processImage();
  },

  setPixelSize: (px: number) => {
    set({pixelSize: px});
  },

  resetGrid: (fill: string = " ") => {
    const {rows, cols} = get();
    set({grid: initGrid(rows, cols, fill)});
  },

  setThreshold: (n: number) => {
    set({threshold: n});
    // デバウンス処理
    if (processImageTimer) clearTimeout(processImageTimer);
    processImageTimer = setTimeout(() => {
      get().processImage();
    }, 100);
  },

  setInvert: (b: boolean) => {
    set({invert: b});
    get().processImage();
  },

  setImageFile: async (file: File) => {
    try {
      let imageBitmap: ImageBitmap;

      // createImageBitmap を試す
      try {
        imageBitmap = await createImageBitmap(file);
      } catch (error) {
        // Safari対策: HTMLImageElement フォールバック
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
        // HTMLImageElement を ImageBitmap に変換
        imageBitmap = await createImageBitmap(img);
      }

      set({imageBitmap});
      get().processImage();
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  },

  processImage: async () => {
    const {imageBitmap, rows, cols, threshold, invert, palette} = get();
    if (!imageBitmap) return;

    try {
      // 1. リサイズ
      const imageData = await resizeToGrid(imageBitmap, cols, rows);

      // 2. 輝度変換
      const luma = toLuma(imageData);

      // 3. しきい値処理
      const newGrid = thresholdToChars(luma, cols, rows, {
        threshold,
        invert,
        dark: palette[0],
        light: palette[1],
      });

      set({grid: newGrid});
    } catch (error) {
      console.error("Failed to process image:", error);
    }
  },
}));
