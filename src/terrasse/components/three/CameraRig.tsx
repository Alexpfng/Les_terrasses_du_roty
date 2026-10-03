import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CameraRigProps {
  path: THREE.CatmullRomCurve3;
  look: THREE.CatmullRomCurve3;
  /** progression 0..1 lue à chaque frame (hors React) */
  getProgress: () => number;
  active: boolean;
}

/** Caméra sur courbe Catmull-Rom, lookAt lissé (lerp 0.05). */
export const CameraRig = ({ path, look, getProgress, active }: CameraRigProps) => {
  const target = useMemo(() => new THREE.Vector3(), []);
  const smoothed = useRef<THREE.Vector3 | null>(null);

  useFrame(({ camera }) => {
    if (!active) return;
    const p = Math.min(1, Math.max(0, getProgress()));
    camera.position.copy(path.getPoint(p));
    look.getPoint(p, target);
    if (!smoothed.current) smoothed.current = target.clone();
    smoothed.current.lerp(target, 0.05);
    camera.lookAt(smoothed.current);
  });

  return null;
};
