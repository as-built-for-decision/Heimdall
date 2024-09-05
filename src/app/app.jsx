"use client";
import React, { useEffect } from "react";
import Main from "./components/Main";
import { useSceneStore } from "@/store/useSceneStore";
import PointerEvents from "@/wrappers/PointerWrapper";

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

  if (tools === true) {
    viewer.loadGUI(() => {
      viewer.setLanguage("en");
      $("#menu_tools").next().show();
      $("#menu_clipping").next().show();
    });
  }

  Potree.loadPointCloud("./pointclouds/metadata.json", "full_scan", (e) => {
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

export default function PotreeApp({ tools }) {
  const { setCamera, setViewer, setScene } = useSceneStore();

  useEffect(() => {
    const potreeInstance = initPotree(tools);
    setCamera(potreeInstance.camera);
    setScene(potreeInstance.scene);
    setViewer(potreeInstance.viewer);
  }, [setCamera, setScene, setViewer]);

  return (
    <>
      <Main />
      <PointerEvents />
    </>
  );
}
