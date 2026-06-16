import * as THREE from 'three';

/** Sprite de lueur radiale or (texture canvas, pas d'asset réseau). */
export const makeGlowSprite = (): THREE.Sprite => {
  const cv = document.createElement('canvas');
  cv.width = 256;
  cv.height = 256;
  const x = cv.getContext('2d');
  if (x) {
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(220,180,60,0.85)');
    g.addColorStop(0.35, 'rgba(201,162,39,0.28)');
    g.addColorStop(1, 'rgba(201,162,39,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(cv);
  return new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
};

/**
 * Environnement « cyclorama de studio » généré en canvas (256px/face) :
 * un fond noir chaud dégradé (cœur gris chaud → bords noirs) commun à toutes
 * les faces, plus trois accents — trait or (+X), trait ivoire (−X), douche
 * zénithale (+Y) — pour des reflets diffus/spéculaires riches sur le verre.
 */
export const makeEnvMap = (): THREE.CubeTexture => {
  const S = 256;
  const faces: HTMLCanvasElement[] = [];
  for (let f = 0; f < 6; f++) {
    const cv = document.createElement('canvas');
    cv.width = S;
    cv.height = S;
    const x = cv.getContext('2d');
    if (x) {
      // cyclorama radial chaud, identique sur chaque face → ambiance enveloppante
      const base = x.createRadialGradient(S / 2, S * 0.42, S * 0.05, S / 2, S * 0.5, S * 0.85);
      base.addColorStop(0, '#1b1813');
      base.addColorStop(0.55, '#100d0a');
      base.addColorStop(1, '#070605');
      x.fillStyle = base;
      x.fillRect(0, 0, S, S);

      if (f === 0) {
        // +X : softbox or
        const g = x.createLinearGradient(0, 0, S, 0);
        g.addColorStop(0.4, 'rgba(201,162,39,0)');
        g.addColorStop(0.5, 'rgba(224,188,84,0.92)');
        g.addColorStop(0.6, 'rgba(201,162,39,0)');
        x.fillStyle = g;
        x.fillRect(0, 0, S, S);
      }
      if (f === 1) {
        // −X : softbox ivoire, plus discrète
        const g = x.createLinearGradient(0, 0, S, 0);
        g.addColorStop(0.44, 'rgba(244,240,230,0)');
        g.addColorStop(0.5, 'rgba(244,240,230,0.4)');
        g.addColorStop(0.56, 'rgba(244,240,230,0)');
        x.fillStyle = g;
        x.fillRect(0, 0, S, S);
      }
      if (f === 2) {
        // +Y : douche zénithale douce
        const g = x.createRadialGradient(S / 2, S / 2, S * 0.04, S / 2, S / 2, S * 0.6);
        g.addColorStop(0, 'rgba(248,244,234,0.34)');
        g.addColorStop(1, 'rgba(248,244,234,0)');
        x.fillStyle = g;
        x.fillRect(0, 0, S, S);
      }
    }
    faces.push(cv);
  }
  const tex = new THREE.CubeTexture(faces as unknown as HTMLImageElement[]);
  tex.needsUpdate = true;
  return tex;
};

/**
 * Ombre de contact au sol : texture radiale sombre (ellipse floue) à plaquer
 * sur un plan horizontal sous la bouteille. Ancre l'objet dans l'espace —
 * la signature d'un rendu produit de studio.
 */
export const makeContactShadow = (): THREE.CanvasTexture => {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = S;
  cv.height = S;
  const x = cv.getContext('2d');
  if (x) {
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(0,0,0,0.78)');
    g.addColorStop(0.45, 'rgba(0,0,0,0.4)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, S, S);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
};

/** Libère récursivement géométries et matériaux d'un groupe. */
export const disposeGroup = (root: THREE.Object3D): void => {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else if (mat) mat.dispose();
  });
};
