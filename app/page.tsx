"use client";

import {useEffect} from "react";
import ControlsPanel from "@/components/ControlsPanel";
import GridEditor from "@/components/GridEditor";
import PreviewPane from "@/components/PreviewPane";

export default function Home() {
  useEffect(() => {
    // 初回レンダ後に左上セルへfocus
    const timer = setTimeout(() => {
      document.getElementById("cell-0-0")?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex">
      {/* Left: Controls */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
        <ControlsPanel />
      </div>

      {/* Center: GridEditor */}
      <div className="flex-1">
        <GridEditor />
      </div>

      {/* Right: Preview */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex-shrink-0">
        <PreviewPane />
      </div>
    </div>
  );
}
