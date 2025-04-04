// src/store/useSceneStore.ts
import create from 'zustand';
import { Scene, PerspectiveCamera, Vector3 } from 'three';
import { Tween, Easing, update } from '@tweenjs/tween.js';

interface SceneState {
	scene: Scene | null;
	camera: PerspectiveCamera | null;
	viewer: any | null;
	cameraPosition: Vector3;
	setScene: (scene: Scene) => void;
	setCamera: (camera: PerspectiveCamera) => void;
	setViewer: (viewer: any) => void;
	setCameraPosition: (position: Vector3) => void;
	interpolateCameraPosition: (targetPosition: Vector3, duration: number) => void;
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
	interpolateCameraPosition: (targetPosition: Vector3, duration: number) => {
		const state = useSceneStore.getState();
		const { cameraPosition } = state;
		const camera = state.camera;

		if (!camera) return;

		const start = cameraPosition.clone();
		const end = targetPosition;
		
		const tween = new Tween(start)
			.to({ x: end.x, y: end.y, z: end.z }, duration)
			.onUpdate(() => {
				if (camera) {
					state.setCameraPosition(start);
					camera.position.copy(start);
					camera.updateProjectionMatrix();
				}
			})
			.start();

		const animate = () => {
			requestAnimationFrame(animate);
			update();
		};
		animate();
	},
}));
