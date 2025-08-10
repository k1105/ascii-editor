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
  const {rows, cols, grid, pixelSize, toggleCell, palette} = useEditorStore();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.id.startsWith("cell-")) return;

      const [, rStr, cStr] = target.id.split("-");
      const currentR = parseInt(rStr, 10);
      const currentC = parseInt(cStr, 10);

      switch (e.key) {
        case " ": {
          e.preventDefault();
          toggleCell(currentR, currentC);
          break;
        }
        case "Backspace": {
          e.preventDefault();
          const {setCell} = useEditorStore.getState();
          setCell(currentR, currentC, palette[1]); // light
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const newR = Math.max(0, currentR - 1);
          document.getElementById(`cell-${newR}-${currentC}`)?.focus();
          break;
        }
        case "ArrowDown": {
          e.preventDefault();
          const newR = Math.min(rows - 1, currentR + 1);
          document.getElementById(`cell-${newR}-${currentC}`)?.focus();
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          const newC = Math.max(0, currentC - 1);
          document.getElementById(`cell-${currentR}-${newC}`)?.focus();
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const newC = Math.min(cols - 1, currentC + 1);
          document.getElementById(`cell-${currentR}-${newC}`)?.focus();
          break;
        }
      }
    },
    [rows, cols, toggleCell, palette]
  );

  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Grid Editor</h2>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
          gridAutoRows: `${pixelSize}px`,
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
              onToggle={toggleCell}
            />
          ))
        )}
      </div>
    </div>
  );
}
