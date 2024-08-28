import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Camera, Vector3 } from "three";
import { useSceneStore } from "@/store/useSceneStore";

interface CustomCameraControlsProps {
  camera: any;
  children?: React.ReactNode;
}

const CustomCameraControls = ({
  camera,
  children,
}: CustomCameraControlsProps) => {
  const { viewer, setCamera } = useSceneStore();
  // const camera = viewer.scene.cameraP;
  //   useMemo(() => {
  //     console.log(camera);
  //     if (camera) {
  //       camera.up.set(0, 0, 1);
  //       setCamera(camera);
  //     } else {
  //       // setCamera(cameraRef.current);
  //     }
  //   }, [camera]);

  return <CameraControls camera={camera}>{children}</CameraControls>;
};

interface CameraManagerProps {
  position: Vector3 | null;
  camera: any;
}

const CameraManager = ({ position, camera }: CameraManagerProps) => {
  // const { camera: cameraStore } = useSceneStore();
  const cameraRef = useRef<Camera>(null!);

  useEffect(() => {
    // const camera = cameraRef.current || cameraStore;
    if (camera && position) {
      camera.position.copy(position);
    }
  }, [position, camera]);

  useFrame(() => {
    // const camera = cameraRef.current || cameraStore;
    if (cameraRef.current && position) {
      cameraRef.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <CustomCameraControls camera={cameraRef.current}>
      {/* <PerspectiveCamera ref={cameraRef} makeDefault /> */}
    </CustomCameraControls>
  );
};

export default CameraManager;
