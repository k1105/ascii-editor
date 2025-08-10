"use client";

import { useEditorStore } from "@/store/useEditorStore";

export default function ControlsPanel() {
  const { 
    rows, 
    cols, 
    pixelSize, 
    threshold, 
    invert, 
    resizeGrid, 
    setPixelSize, 
    setThreshold, 
    setInvert, 
    setImageFile 
  } = useEditorStore();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Controls</h2>

      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm text-gray-600 file:mr-2 file:px-2 file:py-1 file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:rounded"
          />
        </div>

        {/* Threshold */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Threshold: {threshold}
          </label>
          <input
            type="range"
            min="0"
            max="255"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        {/* Invert */}
        <div>
          <label className="flex items-center text-sm font-medium">
            <input
              type="checkbox"
              checked={invert}
              onChange={(e) => setInvert(e.target.checked)}
              className="mr-2"
            />
            Invert
          </label>
        </div>

        <hr className="border-gray-300" />

        {/* Grid Size */}
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

        {/* Pixel Size */}
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