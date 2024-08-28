"use client";
import React, { useEffect, useMemo } from "react";
import Main from "./components/Main";
import { useSceneStore } from "@/store/useSceneStore";

function initPotree() {
  if (!document) return;
  window.viewer = new Potree.Viewer(
    document.getElementById("potree_render_area")
  );

  viewer.setEDLEnabled(false);
  viewer.setFOV(60);
  viewer.setPointBudget(1_000_000);
  viewer.loadSettingsFromURL();
  viewer.setBackground("skybox");

  // viewer.loadGUI(() => {
  //   viewer.setLanguage("en");
  //   $("#menu_tools").next().show();
  //   $("#menu_clipping").next().show();
  //   viewer.toggleSidebar();
  // });

  // Load and add point cloud to scene
  Potree.loadPointCloud("./pointclouds/metadata.json", "test", (e) => {
    let scene = viewer.scene;
    let pointcloud = e.pointcloud;

    let material = pointcloud.material;
    material.activeAttributeName = "rgba";
    material.minSize = 2;
    material.size = 1;
    material.octreeSize = 512;
    material.pointSizeType = Potree.PointSizeType.FIXED;
    material.shape = Potree.PointShape.CIRCLE;

    scene.addPointCloud(pointcloud);

    viewer.fitToScreen();
  });
  return {
    camera: viewer.scene.scene.cameraP,
    scene: viewer.scene.scene,
    viewer: viewer,
  };
}

export default function PotreeApp() {
  const { setCamera, setViewer, setScene } = useSceneStore();

  useEffect(() => {
    const { camera, scene, viewer } = initPotree();
    setCamera(camera);
    setScene(scene);
    setViewer(viewer);
  }, []);

  return <Main />;
}
