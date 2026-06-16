import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { progressState, smoothstep } from '@/terrasse/lib/progress';
import { ANIM } from '@/terrasse/lib/animConfig';
import { LABEL_TEXTURE, LABEL_EMISSIVE } from '@/terrasse/lib/assets';
import { makeEnvMap, makeGlowSprite, makeContactShadow, disposeGroup } from '@/terrasse/lib/threeUtils';
import { useLtdrStore } from '@/terrasse/lib/store';
import { BottleLights, type BottleLightsHandle } from './Lights';
import { ParticleField } from './ParticleField';

interface BottleSceneProps {
  active: boolean;
}

/** Profil de la bouteille (type bourguignon, comme la bouteille réelle). */
const PROFILE: Array<[number, number]> = [
  [0.01, 0],
  [2.6, 0],
  [3.45, 0.18],
  [3.6, 0.7],
  [3.62, 14],
  [3.58, 17.5],
  [3.1, 19.6],
  [2.2, 21.4],
  [1.6, 23],
  [1.32, 24.6],
  [1.28, 28.6],
  [1.42, 28.9],
  [1.42, 29.7],
  [1.25, 29.9],
  [0.7, 29.95],
];

const CAPSULE_PROFILE: Array<[number, number]> = [
  [1.34, 26.2],
  [1.36, 29.6],
  [1.48, 29.8],
  [1.48, 30.3],
  [1.1, 30.45],
  [0.01, 30.45],
];

export const BottleScene = ({ active }: BottleSceneProps) => {
  const tier = useLtdrStore((s) => s.tier);
  const lights = useRef<BottleLightsHandle>(null);
  const groupRef = useRef<THREE.Group>(null);
  const userRotSmoothed = useRef(0);

  const [labelTex, labelEmissive] = useLoader(THREE.TextureLoader, [LABEL_TEXTURE, LABEL_EMISSIVE]);

  const built = useMemo(() => {
    const env = makeEnvMap();
    const group = new THREE.Group();

    // verre — teinte lie-de-vin très sombre, rendu studio
    const glassMat =
      tier === 'high'
        ? new THREE.MeshPhysicalMaterial({
            color: 0x120808,
            transmission: 0.92,
            thickness: 1.8,
            roughness: 0.04,
            ior: 1.52,
            attenuationColor: new THREE.Color('#3a0f17'),
            attenuationDistance: 1.1,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            envMap: env,
            envMapIntensity: 1.4,
          })
        : new THREE.MeshPhysicalMaterial({
            color: 0x16090d,
            roughness: 0.05,
            metalness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            envMap: env,
            envMapIntensity: 1.4,
          });
    const glass = new THREE.Mesh(
      new THREE.LatheGeometry(PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), 64),
      glassMat,
    );
    group.add(glass);

    // capsule noir satin
    const capsule = new THREE.Mesh(
      new THREE.LatheGeometry(CAPSULE_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), 48),
      new THREE.MeshStandardMaterial({
        color: 0x0d0b0a,
        roughness: 0.35,
        metalness: 0.55,
        envMap: env,
        envMapIntensity: 0.9,
      }),
    );
    group.add(capsule);

    const glow = makeGlowSprite();
    glow.position.set(0, 13, -16);
    glow.scale.set(50, 50, 1);
    glow.material.opacity = 0.18;

    // ombre de contact au sol (plan horizontal, hors du groupe qui tourne)
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 26),
      new THREE.MeshBasicMaterial({
        map: makeContactShadow(),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.05;
    shadow.scale.set(1, 1.25, 1); // ellipse allongée en profondeur

    return { group, glow, shadow, env };
  }, [tier]);

  // étiquette réelle, cylindre décalé du verre (~0,5 mm équiv.) contre le z-fighting
  const label = useMemo(() => {
    labelTex.colorSpace = THREE.SRGBColorSpace;
    labelEmissive.colorSpace = THREE.SRGBColorSpace;
    labelTex.anisotropy = 8;
    labelEmissive.anisotropy = 8;
    const theta = 2.1;
    const radius = 3.66;
    const aspect = 1640 / 1400; // ratio du fichier label-crop
    const height = (radius * theta) / aspect;
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, -theta / 2 + Math.PI, theta),
      // map = réponse à la lumière ; emissiveMap = auto-rayonnement des marquages
      // (le fond noir reste noir, l'or/ivoire restent lisibles dans l'ombre)
      new THREE.MeshStandardMaterial({
        map: labelTex,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: labelEmissive,
        emissiveIntensity: 0.55,
        roughness: 0.5,
        metalness: 0.0,
        envMap: built.env,
        envMapIntensity: 0.35,
      }),
    );
    mesh.position.y = 5.8;
    mesh.rotation.y = Math.PI; // face étiquette vers +z quand rotation groupe = 0
    return mesh;
  }, [labelTex, labelEmissive, built]);

  useEffect(() => {
    built.group.add(label);
    return () => {
      disposeGroup(built.group);
      disposeGroup(built.shadow);
      built.glow.material.map?.dispose();
      built.glow.material.dispose();
    };
  }, [built, label]);

  useFrame(({ camera }) => {
    const p = progressState.bottle;
    const B = ANIM.bottle;
    const group = groupRef.current;
    if (!group) return;
    const lerp = THREE.MathUtils.lerp;

    // 1. la bouteille monte du noir
    group.position.y = -9 * (1 - smoothstep(0, B.riseEnd, p));

    // 2. la lumière monte
    const lit = smoothstep(B.lightStart, B.lightEnd, p);
    const L = lights.current;
    if (L?.key) L.key.intensity = lit * 1.15;
    if (L?.rimGold) L.rimGold.intensity = lit * 2.6;
    if (L?.rimIvory) L.rimIvory.intensity = lit * 0.7;
    built.glow.material.opacity = 0.18 + lit * 0.3;
    // l'ombre de contact apparaît quand la bouteille se pose
    const settled = smoothstep(B.riseEnd * 0.5, B.holdStart, p);
    (built.shadow.material as THREE.MeshBasicMaterial).opacity = settled * 0.85;

    // 3. rotation scrollée — un tour complet, étiquette face caméra à rotAEnd
    const rotA = Math.PI * 2 * smoothstep(B.rotAStart, B.rotAEnd, p);
    const rotB = Math.PI * 0.85 * smoothstep(B.rotBStart, 1, p);
    userRotSmoothed.current += (progressState.bottleUserRot - userRotSmoothed.current) * 0.08;
    group.rotation.y = rotA + rotB + userRotSmoothed.current;

    // 4. caméra : recul studio (bouteille entière) → gros plan étiquette → recul
    // hero : bouteille entière, recul studio ; gros plan : l'étiquette remplit le cadre
    const pushIn = smoothstep(B.pushInStart, B.pushInEnd, p) * (1 - smoothstep(B.pushOutStart, B.pushOutEnd, p));
    if (active) {
      camera.position.set(0, lerp(17, 6, pushIn), lerp(46, 16, pushIn));
      camera.lookAt(0, lerp(13, 5.8, pushIn), 0);
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <primitive object={built.group} />
      </group>
      <primitive object={built.shadow} />
      <primitive object={built.glow} />
      <BottleLights ref={lights} />
      <ParticleField count={tier === 'low' ? 80 : 220} mode="orbital" opacity={0.45} />
    </>
  );
};
