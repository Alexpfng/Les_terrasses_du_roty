attribute float aSeed;
attribute float aSize;

uniform float uTime;
uniform float uPixelRatio;
uniform float uDrift;

varying float vAlpha;

void main() {
  vec3 p = position;
  // dérive lente, pseudo-aléatoire par particule
  p.x += sin(uTime * 0.12 + aSeed * 6.2831) * uDrift;
  p.y += mod(uTime * (0.18 + aSeed * 0.25), 24.0) - 12.0;
  p.z += cos(uTime * 0.1 + aSeed * 12.566) * uDrift * 0.6;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  // taille atténuée par la profondeur
  gl_PointSize = aSize * uPixelRatio * (38.0 / -mv.z);

  // scintillement doux
  vAlpha = 0.25 + 0.55 * (0.5 + 0.5 * sin(uTime * 1.4 + aSeed * 40.0));
}
