"use client";
import React, { useEffect, useMemo, useRef } from "react";
import Main from "./components/Main";
import { useSceneStore } from "@/store/useSceneStore";
import { MeshStandardMaterial, Raycaster, Vector2 } from "three";

const initPotree = (tools) => {
  if (typeof document === "undefined") return null;

  const viewer = new Potree.Viewer(
    document.getElementById("potree_render_area")
  );

  viewer.setEDLEnabled(false);
  viewer.setFOV(60);
  viewer.setPointBudget(1_000_000);
  viewer.loadSettingsFromURL();
  viewer.setBackground("skybox");

  if (tools === true)
    viewer.loadGUI(() => {
      viewer.setLanguage("en");
      $("#menu_tools").next().show();
      $("#menu_clipping").next().show();
      viewer.toggleSidebar();
    });

  Potree.loadPointCloud("./pointclouds/metadata.json", "test", (e) => {
    const scene = viewer.scene;
    const pointcloud = e.pointcloud;

    const material = pointcloud.material;
    material.activeAttributeName = "rgba";
    material.minSize = 2;
    material.size = 3;
    material.octreeSize = 1024;
    material.pointSizeType = Potree.PointSizeType.FIXED;
    material.shape = Potree.PointShape.CIRCLE;

    scene.addPointCloud(pointcloud);
    viewer.fitToScreen();
  });

  return {
    camera: viewer.scene.cameraP,
    scene: viewer.scene.scene,
    viewer: viewer,
  };
};

const mouseDownMaterial = new MeshStandardMaterial({
  color: 0xff0000,
  emissive: 0xffffff,
});

const mouseUpMaterial = new MeshStandardMaterial({
  color: 0xff0000,
  emissive: 0xff0000,
});

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

export default function PotreeApp({ tools }) {
  const {
    setCamera,
    setViewer,
    setScene,
    setCameraPosition,
    cameraPosition,
    camera,
    scene,
    viewer,
  } = useSceneStore();
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());
  const mouseDown = useRef(null);

  useEffect(() => {
    const potreeInstance = initPotree(tools);
    setCamera(potreeInstance.camera);
    setScene(potreeInstance.scene);
    setViewer(potreeInstance.viewer);
  }, [setCamera, setScene, setViewer]);

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

  return <Main />;
}
