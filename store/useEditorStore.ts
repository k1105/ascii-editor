import { create } from 'zustand';

type Grid = string[][];

type EditorState = {
  rows: number;
  cols: number;
  grid: Grid;
  palette: [string, string];      // [dark, light] 例: ["█"," "]
  selectedChar: string;           // 将来用
  threshold: number;
  invert: boolean;               // 以降で使用
  pixelSize: number;             // 1セルの表示px
  setCell: (r: number, c: number, ch: string) => void;
  toggleCell: (r: number, c: number) => void;
  resizeGrid: (rows: number, cols: number) => void;
  setPixelSize: (px: number) => void;
  resetGrid: (fill?: string) => void;
};

const initGrid = (rows: number, cols: number, fill: string = " "): Grid => {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
};

export const useEditorStore = create<EditorState>((set, get) => ({
  rows: 32,
  cols: 64,
  grid: initGrid(32, 64, " "),
  palette: ["█", " "],
  selectedChar: "█",
  threshold: 128,
  invert: false,
  pixelSize: 14,

  setCell: (r: number, c: number, ch: string) => {
    const { grid } = get();
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      const newGrid = grid.map(row => [...row]);
      newGrid[r][c] = ch;
      set({ grid: newGrid });
    }
  },

  toggleCell: (r: number, c: number) => {
    const { grid, palette } = get();
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
      grid: initGrid(rows, cols, " ")
    });
  },

  setPixelSize: (px: number) => {
    set({ pixelSize: px });
  },

  resetGrid: (fill: string = " ") => {
    const { rows, cols } = get();
    set({ grid: initGrid(rows, cols, fill) });
  },
}));