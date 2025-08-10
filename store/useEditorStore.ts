import { create } from 'zustand';

interface EditorState {
  // Add your state properties here
}

interface EditorActions {
  // Add your actions here
}

type EditorStore = EditorState & EditorActions;

export const useEditorStore = create<EditorStore>((set) => ({
  // Initialize your state and actions here
}));