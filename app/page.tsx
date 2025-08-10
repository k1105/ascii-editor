import ControlsPanel from '@/components/ControlsPanel';
import GridEditor from '@/components/GridEditor';
import PreviewPane from '@/components/PreviewPane';

export default function Home() {
  return (
    <div className="h-screen flex">
      {/* Left: Controls */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
        <ControlsPanel />
      </div>
      
      {/* Center: GridEditor */}
      <div className="flex-1 bg-white">
        <GridEditor />
      </div>
      
      {/* Right: Preview */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex-shrink-0">
        <PreviewPane />
      </div>
    </div>
  );
}