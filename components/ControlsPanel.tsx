"use client";

import {useEditorStore} from "@/store/useEditorStore";

export default function ControlsPanel() {
  const {rows, cols, pixelSize, resizeGrid, setPixelSize} = useEditorStore();

  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Controls</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rows</label>
          <input
            type="number"
            min="4"
            max="400"
            value={rows}
            onChange={(e) => {
              const newRows = parseInt(e.target.value, 10);
              if (newRows >= 4 && newRows <= 400) {
                resizeGrid(newRows, cols);
              }
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cols</label>
          <input
            type="number"
            min="4"
            max="400"
            value={cols}
            onChange={(e) => {
              const newCols = parseInt(e.target.value, 10);
              if (newCols >= 4 && newCols <= 400) {
                resizeGrid(rows, newCols);
              }
            }}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Pixel Size: {pixelSize}px
          </label>
          <input
            type="range"
            min="8"
            max="28"
            value={pixelSize}
            onChange={(e) => setPixelSize(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
