// src/store/useSceneStore.ts
import create from 'zustand';
import { Scene, PerspectiveCamera } from 'three';
interface SceneState {
	scene: Scene | null;
	camera: PerspectiveCamera | null;
	viewer: Potree.Viewer | null;
	setScene: (scene: Scene) => void;
	setCamera: (camera: PerspectiveCamera) => void;
	setViewer: (viewer: Potree.Viewer) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
	scene: null,
	camera: null,
	viewer: null,
	setScene: (scene) => set({ scene }),
	setCamera: (camera) => set({ camera }),
	setViewer: (viewer) => set({ viewer })
}));
