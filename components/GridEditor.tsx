"use client";

import React, {useCallback} from "react";
import {useEditorStore} from "@/store/useEditorStore";

const GridCell = React.memo(
  ({
    r,
    c,
    char,
    pixelSize,
    onToggle,
  }: {
    r: number;
    c: number;
    char: string;
    pixelSize: number;
    onToggle: (r: number, c: number) => void;
  }) => {
    const handleClick = useCallback(() => {
      onToggle(r, c);
    }, [r, c, onToggle]);

    return (
      <button
        id={`cell-${r}-${c}`}
        key={r * 1000 + c}
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          lineHeight: 1,
          fontSize: Math.floor(pixelSize * 0.8),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #e5e7eb",
          backgroundColor: char === "█" ? "#000" : "#f9f9f9",
          color: "#333",
          cursor: "pointer",
          padding: 0,
          margin: 0,
        }}
      >
        {char}
      </button>
    );
  }
);

GridCell.displayName = "GridCell";

export default function GridEditor() {
  const {rows, cols, grid, pixelSize, toggleCell, palette, setCell} = useEditorStore();

  // フォーカス移動ヘルパー
  const focusCell = useCallback((r: number, c: number, scrollIntoView = false) => {
    const cellId = `cell-${r}-${c}`;
    const element = document.getElementById(cellId);
    if (element) {
      element.focus();
      if (scrollIntoView) {
        element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }, []);

  // 次のセルへの移動（右進み、行末で折返し）
  const moveToNextCell = useCallback((currentR: number, currentC: number) => {
    if (currentC < cols - 1) {
      // 同じ行の右隣へ
      focusCell(currentR, currentC + 1, true);
    } else if (currentR < rows - 1) {
      // 次の行の先頭へ
      focusCell(currentR + 1, 0, true);
    } else {
      // 最終セル - その場に留まる
      focusCell(currentR, currentC);
    }
  }, [cols, rows, focusCell]);

  // 前のセルへの移動（左戻り、行頭で前行末尾へ）
  const moveToPreviousCell = useCallback((currentR: number, currentC: number) => {
    if (currentC > 0) {
      // 同じ行の左隣へ
      focusCell(currentR, currentC - 1, true);
      return { r: currentR, c: currentC - 1 };
    } else if (currentR > 0) {
      // 前の行の末尾へ
      focusCell(currentR - 1, cols - 1, true);
      return { r: currentR - 1, c: cols - 1 };
    } else {
      // 原点 - その場に留まる
      focusCell(0, 0);
      return { r: 0, c: 0 };
    }
  }, [cols, focusCell]);

  // 次の行の先頭へ移動（Enter）
  const moveToNextLineStart = useCallback((currentR: number) => {
    if (currentR < rows - 1) {
      // 次の行の先頭
      focusCell(currentR + 1, 0, true);
    } else {
      // 最終行 - 末尾に留まる
      focusCell(currentR, cols - 1);
    }
  }, [rows, cols, focusCell]);

  // 印字可能文字かどうかの判定
  const isPrintable = useCallback((key: string) => {
    // 1文字のキー入力（Space含む）を印字可能として扱う
    return key.length === 1 && key >= ' ' && key <= '~';
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.id.startsWith("cell-")) return;

      const [, rStr, cStr] = target.id.split("-");
      const currentR = parseInt(rStr, 10);
      const currentC = parseInt(cStr, 10);

      // 印字可能文字の処理
      if (isPrintable(e.key)) {
        e.preventDefault();
        // セルに文字を入力
        setCell(currentR, currentC, e.key);
        // 次のセルへ移動
        moveToNextCell(currentR, currentC);
        return;
      }

      switch (e.key) {
        case "Backspace": {
          e.preventDefault();
          // 前のセルに移動してからそのセルをlightにする
          const prevPos = moveToPreviousCell(currentR, currentC);
          setCell(prevPos.r, prevPos.c, palette[1]); // light
          break;
        }
        case "Enter": {
          e.preventDefault();
          moveToNextLineStart(currentR);
          break;
        }
        case " ": {
          // Spaceキーは印字可能文字として上で処理されるが、
          // クリック時のトグル動作と区別するため、ここでも明示的に処理
          if (e.target === target) {
            // キーボード入力の場合は印字として扱う（上で処理済み）
            return;
          } else {
            // クリックイベントの場合はトグル
            e.preventDefault();
            toggleCell(currentR, currentC);
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const newR = Math.max(0, currentR - 1);
          focusCell(newR, currentC, true);
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          const newR = Math.min(rows - 1, currentR + 1);
          focusCell(newR, currentC, true);
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          const newC = Math.max(0, currentC - 1);
          focusCell(currentR, newC, true);
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const newC = Math.min(cols - 1, currentC + 1);
          focusCell(currentR, newC, true);
          break;
        }
      }
    },
    [rows, cols, toggleCell, palette, setCell, isPrintable, moveToNextCell, moveToPreviousCell, moveToNextLineStart, focusCell]
  );

  // クリック時のトグル処理（Space以外での通常のクリック）
  const handleCellToggle = useCallback((r: number, c: number) => {
    toggleCell(r, c);
    focusCell(r, c); // クリック後にフォーカスを当てる
  }, [toggleCell, focusCell]);

  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Grid Editor</h2>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
          gridAutoRows: `${pixelSize}px`,
          gap: "1px",
          justifyContent: "start",
          alignContent: "start",
          overflow: "auto",
          maxHeight: "calc(100vh - 120px)",
        }}
        onKeyDown={handleKeyDown}
      >
        {grid.map((row, r) =>
          row.map((char, c) => (
            <GridCell
              key={r * cols + c}
              r={r}
              c={c}
              char={char}
              pixelSize={pixelSize}
              onToggle={handleCellToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}