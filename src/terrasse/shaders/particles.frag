uniform vec3 uColor;
uniform float uOpacity;

varying float vAlpha;

void main() {
  // disque doux, sans texture
  float d = length(gl_PointCoord - vec2(0.5));
  float a = smoothstep(0.5, 0.12, d);
  gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
}
