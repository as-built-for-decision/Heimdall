import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextLoader } from "@/utils/loaders";
import { parseCoordinates, Coordinate } from "@/utils/constants";
import { MeshProps } from "@react-three/fiber";
import { useSceneStore } from "@/store/useSceneStore";
import * as THREE from "three";
import { mouseUpMaterial } from "@/utils/materials";

function Main() {
  const [coordinates, setCoordinates] = useState<Coordinate[]>(null!);
  const [selected, setSelected] = useState<Coordinate>(null!);
  const { setCameraPosition } = useSceneStore();

  // useEffect(() => {
  //   if (!selected) return;
  //   setCameraPosition(selected.position);
  // }, [selected]);

  useEffect(() => {
    setCameraPosition(
      new THREE.Vector3(
        -2.974597692489624,
        -62.673194885253906,
        1.6231589317321777
      )
    );
  }, [coordinates]);

  return (
    <div>
      <div id="potree_render_area" />
      <div id="potree_sidebar_container" />
      <TextLoader
        path="./pointclouds/coordinates.txt"
        onLoad={(data) => setCoordinates(parseCoordinates(data))}
      />

      {coordinates && (
        <Potree360Points
          coordinates={coordinates}
          onSelect={setSelected}
        />
      )}
    </div>
  );
}

interface Potree360PointsProps {
  coordinates: Coordinate[];
  onSelect?: (coordinate: Coordinate) => void;
}

const Potree360Points = ({ coordinates, onSelect }: Potree360PointsProps) => {
  return (
    <>
      {coordinates.map((coordinate) => (
        <Sphere
          key={coordinate.id}
          position={coordinate.position}
          onClick={() => {
            if (onSelect) onSelect(coordinate);
          }}
        />
      ))}
    </>
  );
};

interface SphereProps extends MeshProps {
  scene: THREE.Scene;
  position?: THREE.Vector3;
  onClick?: (ref: any) => void;
}

function addSphere({ scene, position }: SphereProps) {
  position ??= new THREE.Vector3(0, 0, 0);
  const testSphere = new THREE.IcosahedronGeometry(0.5, 3);
  const testMesh = new THREE.Mesh(testSphere, mouseUpMaterial);
  testMesh.position.set(position.x, position.y, position.z);
  scene.add(testMesh);
  return testMesh;
}

function Sphere(props: MeshProps) {
  const ref = useRef<THREE.Mesh>();
  const { scene } = useSceneStore();
  ref.current = useMemo(() => {
    if (!scene || ref.current) return;
    return addSphere({
      scene,
      position: props.position as THREE.Vector3,
    });
  }, [props]);
  return <></>;
}

export default Main;
