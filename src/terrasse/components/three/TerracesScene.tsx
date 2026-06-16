import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { progressState, smoothstep } from '@/terrasse/lib/progress';
import { ANIM } from '@/terrasse/lib/animConfig';
import { makeGlowSprite, disposeGroup } from '@/terrasse/lib/threeUtils';
import { CameraRig } from './CameraRig';

interface TerracesSceneProps {
  active: boolean;
}

interface TerracesBuild {
  group: THREE.Group;
  sunMat: THREE.LineBasicMaterial;
  glow: THREE.Sprite;
  dust: THREE.Points;
}

/**
 * Acte IV — les lignes du logo reconstruites en topographie :
 * 7 terrasses de lignes or étagées, brisées comme sur le soleil de la marque,
 * un arc solaire au sommet, de la poussière en suspension.
 */
const TERRACES = 8;

/** PRNG déterministe (mulberry32) — variations organiques reproductibles */
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildTerraces = (): TerracesBuild => {
  const group = new THREE.Group();
  const rng = mulberry32(0x7e44a1); // graine fixée : étagement « naturel » contrôlé
  const rr = (a: number, b: number) => a + (b - a) * rng();

  const mkLine = (pts: THREE.Vector3[], mat: THREE.LineBasicMaterial) =>
    new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);

  // contour bombé (convexe vers l'aval) avec basculement + ondulation douce :
  // jamais une parabole parfaite, toujours un peu de relief naturel.
  const contour = (
    x0: number,
    x1: number,
    y: number,
    z0: number,
    bow: number,
    halfW: number,
    tilt: number,
    wobAmp: number,
    wobFreq: number,
    phase: number,
    mat: THREE.LineBasicMaterial,
  ) => {
    const pts: THREE.Vector3[] = [];
    const n = 60;
    for (let k = 0; k <= n; k++) {
      const x = x0 + (x1 - x0) * (k / n);
      const t = x / halfW;
      const z = z0 + bow * (1 - t * t) + wobAmp * Math.sin(x * wobFreq + phase);
      const yy = y + tilt * x + wobAmp * 0.35 * Math.sin(x * wobFreq * 1.4 + phase * 0.6);
      pts.push(new THREE.Vector3(x, yy, z));
    }
    group.add(mkLine(pts, mat));
  };

  // chaque terrasse = une bande de lignes parallèles (écho des bandes du logo),
  // mais d'aspect irrégulier : largeur asymétrique, brèche décalée, basculement,
  // espacement variable — comme un coteau de pierre sèche bâti à la main.
  let y = 0;
  let z = 0;
  for (let i = 0; i < TERRACES; i++) {
    const depth = 1 - i / (TERRACES + 1);
    const halfW = (60 - i * 4.4) / 2;
    const halfL = halfW * rr(0.78, 1.06); // bord gauche
    const halfR = halfW * rr(0.78, 1.06); // bord droit (≠ gauche)
    const refW = Math.max(halfL, halfR);
    const bow = rr(2.2, 4.3);
    const tilt = rr(-0.035, 0.035); // léger basculement du plan de la terrasse
    const wobAmp = rr(0.3, 0.8);
    const wobFreq = rr(0.05, 0.12);
    const gapC = rr(-7, 7); // centre de la brèche, décalé (jamais au milieu)
    const gapW = rr(1.8, 4.2);
    const vOff = rr(-1.0, 1.0); // décalage vertical entre les deux pans
    const bands = 2 + Math.floor(rr(0, 2.99)); // 2 à 4 lignes

    for (let b = 0; b < bands; b++) {
      const yy = y + b * rr(0.5, 0.74);
      const op = (0.95 - b * 0.23) * (0.4 + 0.6 * depth) * rr(0.82, 1.04);
      const mat = new THREE.LineBasicMaterial({ color: 0xc9a227, transparent: true, opacity: op });
      const ph = rr(0, Math.PI * 2);
      contour(-halfL, gapC - gapW / 2, yy - vOff, z, bow, refW, tilt, wobAmp, wobFreq, ph, mat);
      contour(gapC + gapW / 2, halfR, yy + vOff, z, bow, refW, tilt, wobAmp, wobFreq, ph + 0.5, mat);
    }
    y += rr(2.0, 2.95);
    z -= rr(4.8, 6.5);
  }

  // arc solaire au sommet — plus large, posé derrière la dernière terrasse
  const sunPts: THREE.Vector3[] = [];
  const SR = 13;
  const sunCY = 15;
  const sunCZ = -49;
  for (let k = 0; k <= 96; k++) {
    const a = (k / 96) * Math.PI;
    sunPts.push(new THREE.Vector3(Math.cos(a) * SR, sunCY + Math.sin(a) * SR, sunCZ));
  }
  const sunMat = new THREE.LineBasicMaterial({ color: 0xe0bc54, transparent: true, opacity: 0 });
  group.add(mkLine(sunPts, sunMat));
  // quelques traits horizontaux dans le disque solaire (rappel du logo)
  for (let r = 0; r < 4; r++) {
    const yy = sunCY + (r - 1.5) * 2.4;
    const hw = Math.sqrt(Math.max(0, SR * SR - (yy - sunCY) * (yy - sunCY)));
    group.add(mkLine([new THREE.Vector3(-hw + 1.5, yy, sunCZ - 0.1), new THREE.Vector3(hw - 1.5, yy, sunCZ - 0.1)], sunMat));
  }

  const glow = makeGlowSprite();
  glow.position.set(0, sunCY + 2, sunCZ - 1);
  glow.scale.set(54, 54, 1);
  glow.material.opacity = 0;
  group.add(glow);

  // poussière fine en suspension, dérive lente
  const dg = new THREE.BufferGeometry();
  const N = 260;
  const da = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    da[i * 3] = (Math.random() - 0.5) * 76;
    da[i * 3 + 1] = Math.random() * 22;
    da[i * 3 + 2] = -Math.random() * 56 + 10;
  }
  dg.setAttribute('position', new THREE.BufferAttribute(da, 3));
  const dust = new THREE.Points(
    dg,
    new THREE.PointsMaterial({ color: 0xc9a227, size: 0.11, transparent: true, opacity: 0.42, depthWrite: false }),
  );
  group.add(dust);

  return { group, sunMat, glow, dust };
};

export const TerracesScene = ({ active }: TerracesSceneProps) => {
  const built = useMemo(buildTerraces, []);

  // révélation « paysage » : la caméra reste EN AVANT du coteau et s'élève
  // doucement en reculant, dévoilant tout l'étagement qui monte vers le soleil
  // (légère dérive latérale pour la parallaxe). Jamais de vol à travers le vide.
  const path = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 3.5, 34),
        new THREE.Vector3(-3, 6.5, 31),
        new THREE.Vector3(3, 9.5, 28),
        new THREE.Vector3(-2, 12.5, 25),
        new THREE.Vector3(0, 15.5, 22),
      ]),
    [],
  );
  const look = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 5, -8),
        new THREE.Vector3(0, 8, -18),
        new THREE.Vector3(0, 10.5, -28),
        new THREE.Vector3(0, 13, -40),
        new THREE.Vector3(0, 15, -49),
      ]),
    [],
  );

  useEffect(() => () => disposeGroup(built.group), [built]);

  useFrame(() => {
    const p = progressState.terraces;
    const sunOn = smoothstep(ANIM.terraces.sunRevealStart, ANIM.terraces.sunRevealEnd, p);
    built.sunMat.opacity = sunOn;
    built.glow.material.opacity = sunOn * 0.72;
    built.dust.rotation.y = p * 0.12;
  });

  return (
    <>
      <primitive object={built.group} />
      <fogExp2 attach="fog" args={['#0A0908', 0.012]} />
      <CameraRig path={path} look={look} getProgress={() => progressState.terraces} active={active} />
    </>
  );
};
