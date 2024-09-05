// src/store/useSceneStore.ts
import create from 'zustand';
import { Scene, PerspectiveCamera, Vector3 } from 'three';
interface SceneState {
	scene: Scene | null;
	camera: PerspectiveCamera | null;
	viewer: any | null;
	cameraPosition: Vector3;
	setScene: (scene: Scene) => void;
	setCamera: (camera: PerspectiveCamera) => void;
	setViewer: (viewer: any) => void;
	setCameraPosition: (position: Vector3) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
	scene: null,
	camera: null,
	viewer: null,
	cameraPosition: new Vector3(0, 0, 0),
	setScene: (scene) => set({ scene }),
	setCamera: (camera) => set({ camera }),
	setViewer: (viewer) => set({ viewer }),
	setCameraPosition: (cameraPosition) => set({ cameraPosition }),
}));
