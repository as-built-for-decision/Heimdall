"use client";
import React, { useMemo, useRef, useEffect } from "react";
import { Raycaster, Vector2 } from "three";
import { mouseDownMaterial, mouseUpMaterial } from "@/utils/materials";
import { useSceneStore } from "@/store/useSceneStore";

const onBubbleSelect = (
  event,
  camera,
  scene,
  raycaster,
  mouse,
  selected,
  onSelect
) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    if (selected !== intersectedObject) {
      if (selected) {
        selected.material = mouseUpMaterial;
      }

      intersectedObject.material = mouseDownMaterial;
      return intersectedObject;
    } else {
      if (onSelect) {
        onSelect(intersectedObject);
      }
    }
  }

  return null;
};

export default function PointerEventsWrapper() {
  const { camera, scene, viewer, setCameraPosition, cameraPosition } =
    useSceneStore();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const mouseDown = useRef(null);
  const mouseOver = useRef(null);
  const lastSelected = useRef(null);

  useMemo(() => {
    if (!camera || !scene || !viewer) return;

    const handlePointerDown = (event) => {
      const selectedObject = onBubbleSelect(
        event,
        camera,
        scene,
        raycaster.current,
        mouse.current,
        mouseDown.current,
        (object) => {
          lastSelected.current = object;
        }
      );

      if (selectedObject) {
        mouseDown.current = selectedObject;
      }
    };

    const handlePointerUp = (event) => {
      const selectedObject = onBubbleSelect(
        event,
        camera,
        scene,
        raycaster.current,
        mouse.current,
        mouseDown.current,
        (object) => {
          if (!mouseOver.current) return;
          //   console.log("handlePointerUp", object);
          if (mouseOver.current.uuid == object.uuid) {
            mouseOver.current.material = mouseUpMaterial;
            lastSelected.current = null;
            const pos = mouseOver.current.position;
            mouseOver.current = null;
            setCameraPosition(pos);
          } else {
            if (mouseOver.current) {
              mouseOver.current.material = mouseUpMaterial;
              mouseOver.current = null;
            }
          }
        }
      );

      if (selectedObject) {
        mouseDown.current = selectedObject;
      }
    };

    const handlePointerOver = (event) => {
      const selectedObject = onBubbleSelect(
        event,
        camera,
        scene,
        raycaster.current,
        mouse.current,
        mouseOver.current,
        (object) => {
          const obj = object || mouseDown.current;

          lastSelected.current = null;
        }
      );

      if (selectedObject) {
        mouseOver.current = selectedObject;
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerOver);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerOver);
    };
  }, [camera, scene, viewer, setCameraPosition]);

  useEffect(() => {
    if (!camera || !scene || !viewer) return;

    viewer.scene.view.position = cameraPosition;
    viewer.scene.view.lookAt(cameraPosition);
  }, [cameraPosition, camera, scene, viewer]);

  return null;
}
