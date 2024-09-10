import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextLoader } from "@/utils/loaders";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { parseCoordinates, Coordinate } from "@/utils/constants";
import { MeshProps } from "@react-three/fiber";
import { useSceneStore } from "@/store/useSceneStore";
import * as THREE from "three";
import { mouseUpMaterial } from "@/utils/materials";

export const apiFunction = httpsCallable(functions, "octree");

export const testApi = async ({ file }) => {
  const result: any = await apiFunction({
    fileName: file,
  });
  return result.data;
};

function Main() {
  const [coordinates, setCoordinates] = useState<Coordinate[]>(null!);
  const [selected, setSelected] = useState<Coordinate>(null!);
  const { setCameraPosition } = useSceneStore();

  const pointApiData = useMemo(async () => {
    return await testApi({ file: "2024Pedras_coordinates.txt" }).then(
      (data) => {
        const points = parseCoordinates(data);
        setCoordinates(points);
        return points;
      }
    );
  }, []);

  useEffect(() => {
    if (!selected) return;
    console.log(selected);
    setCameraPosition(selected.position);
  }, [selected]);

  useEffect(() => {
    console.log(coordinates);
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

      {coordinates && (
        <Potree360Points coordinates={coordinates} onSelect={setSelected} />
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
          uuid={coordinate.id}
          name={coordinate.name}
          position={coordinate.position}
        />
      ))}
    </>
  );
};

interface SphereProps extends MeshProps {
  scene: THREE.Scene;
  uuid?: string;
  name?: string;
  position?: THREE.Vector3;
  onClick?: (ref: any) => void;
}

function addSphere({ scene, uuid, name, position }: SphereProps) {
  position ??= new THREE.Vector3(0, 0, 0);
  const testSphere = new THREE.IcosahedronGeometry(0.5, 3);
  const testMesh = new THREE.Mesh(testSphere, mouseUpMaterial);
  testMesh.name = name || "testMesh";
  testMesh.uuid = uuid || "";
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
      uuid: props.uuid,
      name: props.name,
      position: props.position as THREE.Vector3,
    });
  }, [props]);
  return <></>;
}

export default Main;
