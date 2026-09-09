import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import vert from "@/terrasse/shaders/particles.vert?raw";
import frag from "@/terrasse/shaders/particles.frag?raw";

interface ParticleFieldProps {
  count: number;
  /** drift : dérive lente (héro) · orbital : orbite autour de la bouteille */
  mode?: "drift" | "orbital";
  opacity?: number;
  driveCamera?: boolean;
}

const GOLD = new THREE.Color("#C9A227");

export const ParticleField = ({
  count,
  mode = "drift",
  opacity = 0.6,
  driveCamera = false,
}: ParticleFieldProps) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const ptsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      if (mode === "orbital") {
        const a = Math.random() * Math.PI * 2;
        const r = 9 + Math.random() * 14;
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = 2 + Math.random() * 22;
        pos[i * 3 + 2] = Math.sin(a) * r;
      } else {
        pos[i * 3] = (Math.random() - 0.5) * 80;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 44;
        pos[i * 3 + 2] = -Math.random() * 46;
      }
      seed[i] = Math.random();
      size[i] = 1.4 + Math.random() * 2.6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count, mode]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.6) },
      uDrift: { value: mode === "drift" ? 2.2 : 0.4 },
      uColor: { value: GOLD },
      uOpacity: { value: opacity },
    }),
    [mode, opacity],
  );

  useFrame(({ camera, clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
    if (ptsRef.current && mode === "orbital") ptsRef.current.rotation.y += 0.0008;
    if (driveCamera) {
      camera.position.set(0, 0, 34);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <points ref={ptsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
