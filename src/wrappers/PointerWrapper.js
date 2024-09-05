"use client";
import { useMemo, useRef, useEffect } from "react";
import { Raycaster, Vector2 } from "three";
import { mouseDownMaterial, mouseUpMaterial } from "@/utils/materials";
import { useSceneStore } from "@/store/useSceneStore";

const onBubbleSelect = (event, camera, scene, raycaster, mouse, selected) => {
  // Update mouse coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Perform raycast
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    if (selected === intersectedObject) {
      intersectedObject.material = mouseUpMaterial;
    } else {
      if (selected) selected.material = mouseUpMaterial;
      intersectedObject.material = mouseDownMaterial;
    }
    return intersectedObject;
  }
  return null;
};

export default function PointerEvents() {
  const { camera, scene, viewer, setCameraPosition, cameraPosition } =
    useSceneStore();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const mouseDown = useRef(null);

  useMemo(() => {
    if (!camera || !scene || !viewer) return;

    const handlePointerDown = (event) => {
      mouseDown.current = onBubbleSelect(
        event,
        camera,
        scene,
        raycaster.current,
        mouse.current,
        mouseDown.current
      );
    };

    const handlePointerUp = (event) => {
      mouseDown.current = onBubbleSelect(
        event,
        camera,
        scene,
        raycaster.current,
        mouse.current,
        mouseDown.current
      );
      if (mouseDown.current) {
        setCameraPosition(mouseDown.current.position);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [camera, scene, viewer, setCameraPosition]);

  useEffect(() => {
    if (!camera || !scene || !viewer) return;

    viewer.scene.view.position = cameraPosition;
    viewer.scene.view.lookAt(cameraPosition);
  }, [cameraPosition, camera, scene, viewer]);

  return null; // This component only handles events, no UI.
}
