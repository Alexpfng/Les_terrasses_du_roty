import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

export interface BottleLightsHandle {
  key: THREE.SpotLight | null;
  rimGold: THREE.DirectionalLight | null;
  rimIvory: THREE.DirectionalLight | null;
}

/**
 * Plateau lumière de l'Acte VI : ambiance chaude très basse,
 * key spot ivoire, rim or (signature) et contre ivoire.
 * Les intensités démarrent à 0 — la timeline scroll les monte.
 */
export const BottleLights = forwardRef<BottleLightsHandle>((_props, ref) => {
  const key = useRef<THREE.SpotLight>(null);
  const rimGold = useRef<THREE.DirectionalLight>(null);
  const rimIvory = useRef<THREE.DirectionalLight>(null);

  useImperativeHandle(ref, () => ({
    get key() {
      return key.current;
    },
    get rimGold() {
      return rimGold.current;
    },
    get rimIvory() {
      return rimIvory.current;
    },
  }));

  return (
    <>
      <ambientLight color="#2a2018" intensity={0.5} />
      <spotLight
        ref={key}
        color="#fff2d8"
        intensity={0}
        distance={60}
        angle={0.7}
        penumbra={0.6}
        position={[-14, 24, 22]}
      />
      <directionalLight ref={rimGold} color="#C9A227" intensity={0} position={[16, 14, -14]} />
      <directionalLight ref={rimIvory} color="#F4F0E6" intensity={0} position={[-18, 10, -10]} />
    </>
  );
});
BottleLights.displayName = "BottleLights";
